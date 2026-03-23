/* eslint-disable @typescript-eslint/no-explicit-any -- Socket.IO event callbacks and Kafka message payloads are dynamically typed */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- Kafka message payloads and error stacks are untyped at runtime */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- error.stack and Kafka message fields are untyped */
/* eslint-disable @typescript-eslint/no-unsafe-argument -- error.stack passed to logger as string | undefined */
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface NotificationPayload {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    journey?: string;
    data?: Record<string, any>;
    timestamp: Date;
}

@WebSocketGateway({
    cors: {
        origin: process.env.CORS_ALLOWED_ORIGINS?.split(',').filter(Boolean).length
            ? process.env.CORS_ALLOWED_ORIGINS.split(',').filter(Boolean)
            : ['https://app.austa.com.br', /\.austa\.com\.br$/],
        methods: ['GET', 'POST'],
        credentials: true,
    },
    namespace: 'notifications',
})
export class WebsocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server!: Server;

    // Store connected clients by userId
    private connectedUsers: Map<string, Set<string>> = new Map();
    // Store socket connections by socket id
    private connections: Map<string, { userId: string; journeys: string[] }> = new Map();

    constructor(
        private readonly kafkaService: KafkaService,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('WebsocketsGateway');
    }

    afterInit(_server: Server): void {
        if (!process.env.CORS_ALLOWED_ORIGINS && process.env.NODE_ENV === 'production') {
            this.logger.warn(
                'CORS_ALLOWED_ORIGINS not set in production; defaulting to app.austa.com.br'
            );
        }
        this.logger.log('WebSocket Gateway initialized');
        // Subscribe to Kafka notifications topic
        this.setupKafkaListener();
    }

    handleConnection(client: Socket, ..._args: unknown[]): void {
        const userId = this.getUserIdFromClient(client);

        if (!userId) {
            this.logger.warn(`Client connected without user ID: ${client.id}`);
            client.disconnect();
            return;
        }

        this.logger.debug(`Client connected: ${client.id}, userId: ${userId}`);

        // Store connection in our maps
        if (!this.connectedUsers.has(userId)) {
            this.connectedUsers.set(userId, new Set());
        }
        this.connectedUsers.get(userId)!.add(client.id);

        // Default to all journeys if not specified
        const journeys = client.handshake.query.journeys
            ? String(client.handshake.query.journeys).split(',')
            : ['health', 'care', 'plan'];

        this.connections.set(client.id, { userId, journeys });

        // Join rooms for each journey
        journeys.forEach((journey) => {
            void client.join(`${userId}:${journey}`);
        });

        // Join user room
        void client.join(userId);
    }

    handleDisconnect(client: Socket): void {
        const connectionInfo = this.connections.get(client.id);

        if (connectionInfo) {
            const { userId } = connectionInfo;

            this.logger.debug(`Client disconnected: ${client.id}, userId: ${userId}`);

            // Remove from our maps
            this.connections.delete(client.id);

            const userSockets = this.connectedUsers.get(userId);
            if (userSockets) {
                userSockets.delete(client.id);
                if (userSockets.size === 0) {
                    this.connectedUsers.delete(userId);
                }
            }
        } else {
            this.logger.debug(`Unknown client disconnected: ${client.id}`);
        }
    }

    /**
     * Send a notification to a specific user
     */
    sendToUser(userId: string, notification: NotificationPayload): void {
        try {
            this.logger.debug(`Sending notification to user ${userId}`);

            // Emit to user's room
            this.server.to(userId).emit('notification', notification);

            // If notification has a journey, also emit to journey-specific room
            if (notification.journey) {
                this.server.to(`${userId}:${notification.journey}`).emit('notification', {
                    ...notification,
                    journeySpecific: true,
                });
            }
        } catch (error) {
            const errorStack = error instanceof Error ? (error as any).stack : undefined;
            this.logger.error(`Error sending notification to user ${userId}`, errorStack);
        }
    }

    /**
     * Send a notification to all users in a journey
     */
    sendToJourney(journey: string, notification: NotificationPayload): void {
        try {
            this.logger.debug(`Broadcasting notification to journey ${journey}`);

            // Create copies of the notification for each user
            for (const [userId, _] of this.connectedUsers) {
                const userNotification = {
                    ...notification,
                    broadcast: true,
                };

                this.server.to(`${userId}:${journey}`).emit('notification', userNotification);
            }
        } catch (error) {
            const errorStack = error instanceof Error ? (error as any).stack : undefined;
            this.logger.error(`Error broadcasting to journey ${journey}`, errorStack);
        }
    }

    /**
     * Send a notification to all connected users
     */
    broadcastNotification(notification: NotificationPayload): void {
        try {
            this.logger.debug('Broadcasting notification to all users');

            this.server.emit('notification', {
                ...notification,
                broadcast: true,
            });
        } catch (error) {
            const errorStack = error instanceof Error ? (error as any).stack : undefined;
            this.logger.error('Error broadcasting notification to all users', errorStack);
        }
    }

    /**
     * Get count of connected users
     */
    getConnectedUsersCount(): number {
        return this.connectedUsers.size;
    }

    /**
     * Check if a user is connected
     */
    isUserConnected(userId: string): boolean {
        return this.connectedUsers.has(userId) && (this.connectedUsers.get(userId)?.size ?? 0) > 0;
    }

    /**
     * Handle mark as read events from clients
     */
    @SubscribeMessage('markAsRead')
    handleMarkAsRead(@ConnectedSocket() client: Socket, @MessageBody() data: { id: string }): void {
        try {
            const connectionInfo = this.connections.get(client.id);

            if (!connectionInfo) {
                this.logger.warn(`Unknown client tried to mark notification as read: ${client.id}`);
                return;
            }

            const { userId } = connectionInfo;
            const notificationId = data.id;

            this.logger.debug(`Marking notification ${notificationId} as read for user ${userId}`);

            // Emit to kafka for persistence
            void this.kafkaService.emit('notifications.markAsRead', {
                userId,
                notificationId,
                timestamp: new Date().toISOString(),
            });

            // Acknowledge to the client
            client.emit('markAsReadAck', { id: notificationId, success: true });
        } catch (error) {
            const errorStack = error instanceof Error ? (error as any).stack : undefined;
            this.logger.error('Error handling markAsRead event', errorStack);

            // Send error to client
            client.emit('error', { message: 'Failed to mark notification as read' });
        }
    }

    /**
     * Handle mark all as read events from clients
     */
    @SubscribeMessage('markAllAsRead')
    handleMarkAllAsRead(@ConnectedSocket() client: Socket): void {
        try {
            const connectionInfo = this.connections.get(client.id);

            if (!connectionInfo) {
                this.logger.warn(
                    `Unknown client tried to mark all notifications as read: ${client.id}`
                );
                return;
            }

            const { userId } = connectionInfo;

            this.logger.debug(`Marking all notifications as read for user ${userId}`);

            // Emit to kafka for persistence
            void this.kafkaService.emit('notifications.markAllAsRead', {
                userId,
                timestamp: new Date().toISOString(),
            });

            // Acknowledge to the client
            client.emit('markAllAsReadAck', { success: true });
        } catch (error) {
            const errorStack = error instanceof Error ? (error as any).stack : undefined;
            this.logger.error('Error handling markAllAsRead event', errorStack);

            // Send error to client
            client.emit('error', { message: 'Failed to mark all notifications as read' });
        }
    }

    /**
     * Extract user ID from socket client
     */
    private getUserIdFromClient(client: Socket): string | null {
        // Get user ID from auth token or query parameter
        const userId = client.handshake.auth.userId || client.handshake.query.userId;

        if (!userId || Array.isArray(userId)) {
            return null;
        }

        return String(userId);
    }

    /**
     * Send a journey-specific notification
     */
    sendJourneyNotification(
        journey: string,
        userId: string,
        notification: NotificationPayload
    ): void {
        try {
            this.logger.debug(`Sending ${journey} notification to user ${userId}`);

            this.server.to(`${userId}:${journey}`).emit(journey, notification);
        } catch (error) {
            const errorStack = error instanceof Error ? (error as any).stack : undefined;
            this.logger.error(
                `Error sending ${journey} notification to user ${userId}`,
                errorStack
            );
        }
    }

    /**
     * Setup Kafka consumer for notifications
     */
    private setupKafkaListener(): void {
        void this.kafkaService.subscribe('notifications', 'websocket-gateway', async (message) => {
            try {
                this.logger.debug('Received notification from Kafka', {
                    key: message.key,
                    topic: message.topic,
                });

                const payload = this.parseKafkaMessage(message);

                if (!payload) {
                    return;
                }

                if (payload.userId) {
                    // Single user notification
                    this.sendToUser(payload.userId, payload);
                } else if (payload.journey) {
                    // Journey broadcast
                    this.sendToJourney(payload.journey, payload);
                } else {
                    // Global broadcast
                    this.broadcastNotification(payload);
                }
            } catch (error) {
                const errorStack = error instanceof Error ? error.stack : undefined;
                this.logger.error('Error processing Kafka notification', errorStack);
            }
        });
    }

    /**
     * Parse Kafka message into notification payload
     */
    private parseKafkaMessage(message: any): NotificationPayload | null {
        try {
            // Parse message value
            const value =
                typeof message.value === 'string' ? JSON.parse(message.value) : message.value;

            // Basic validation
            if (!value || !value.title || !value.message) {
                this.logger.warn('Received invalid notification payload');
                return null;
            }

            return {
                id: value.id || `auto-${Date.now()}`,
                userId: value.userId,
                title: value.title,
                message: value.message,
                type: value.type || 'general',
                journey: value.journey,
                data: value.data,
                timestamp: new Date(),
            };
        } catch (error) {
            const errorStack = error instanceof Error ? (error as any).stack : undefined;
            this.logger.error('Error parsing Kafka message', errorStack);
            return null;
        }
    }
}
