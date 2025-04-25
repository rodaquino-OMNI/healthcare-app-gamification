import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/platform-socket.io'; // @nestjs/platform-socket.io v10.0.0+
import { UseGuards, Inject, Logger } from '@nestjs/common'; // @nestjs/common v10.0.0+
import { Server, Socket } from 'socket.io'; // socket.io v4.0.0+

import { notification } from '../config/configuration';
import { SendNotificationDto } from '../notifications/dto/send-notification.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { TracingService } from 'src/backend/shared/src/tracing/tracing.service';

/**
 * WebSocket gateway for handling real-time communication in the AUSTA SuperApp.
 * Manages user connections, authentication, and notification delivery.
 */
@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger: Logger;

  /**
   * Initializes the WebSocketGateway with required services.
   * 
   * @param notificationsService - Service for sending notifications
   * @param logger - Service for logging events
   * @param tracingService - Service for distributed tracing
   */
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly logger: LoggerService,
    private readonly tracingService: TracingService
  ) {
    this.logger = new Logger('WebsocketsGateway');
  }

  /**
   * Handles new WebSocket connections.
   * Authenticates the user and initializes their connection.
   * 
   * @param client - The connecting Socket.io client
   */
  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`, 'WebsocketsGateway');
    
    try {
      // Get authentication token from handshake
      const token = client.handshake.auth.token;
      
      if (!token) {
        this.logger.warn(`Client ${client.id} has no authentication token, disconnecting`, 'WebsocketsGateway');
        client.disconnect();
        return;
      }
      
      // TODO: Implement JWT verification
      // const userId = verifyAndDecodeToken(token);
      
      // For demonstration purposes
      const userId = this.extractUserIdFromToken(token);
      
      if (!userId) {
        this.logger.warn(`Invalid token for client ${client.id}, disconnecting`, 'WebsocketsGateway');
        client.disconnect();
        return;
      }
      
      // Store userId in socket data for future reference
      client.data.userId = userId;
      
      // Join user-specific room for targeted notifications
      client.join(`user:${userId}`);
      
      this.logger.log(`Client ${client.id} authenticated as user ${userId}`, 'WebsocketsGateway');
      
      // Send connection confirmation
      client.emit('connected', { userId });
    } catch (error) {
      this.logger.error(`Error authenticating client ${client.id}`, error.stack, 'WebsocketsGateway');
      client.disconnect();
    }
  }

  /**
   * Handles WebSocket disconnections.
   * Cleans up any resources associated with the connection.
   * 
   * @param client - The disconnecting Socket.io client
   */
  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`, 'WebsocketsGateway');
    
    // Additional cleanup if needed
  }

  /**
   * Handles subscription to journey-specific notifications.
   * 
   * @param client - The Socket.io client
   * @param payload - The subscription payload containing journey ID
   */
  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { journey: string }): void {
    try {
      const { journey } = payload;
      const userId = client.data.userId;
      
      if (!userId) {
        this.logger.warn(`Unauthenticated client ${client.id} attempted to subscribe to ${journey}`, 'WebsocketsGateway');
        return;
      }
      
      // Join journey-specific room
      client.join(`journey:${journey}`);
      
      // Also join combined user+journey room for targeted journey notifications
      client.join(`user:${userId}:journey:${journey}`);
      
      this.logger.log(`User ${userId} subscribed to ${journey} notifications`, 'WebsocketsGateway');
      
      // Confirm subscription to client
      client.emit('subscribed', { journey });
    } catch (error) {
      this.logger.error(`Error in subscription handling`, error.stack, 'WebsocketsGateway');
      client.emit('error', { message: 'Failed to subscribe to notifications' });
    }
  }

  /**
   * Handles unsubscription from journey-specific notifications.
   * 
   * @param client - The Socket.io client
   * @param payload - The unsubscription payload containing journey ID
   */
  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { journey: string }): void {
    try {
      const { journey } = payload;
      const userId = client.data.userId;
      
      if (!userId) {
        this.logger.warn(`Unauthenticated client ${client.id} attempted to unsubscribe from ${journey}`, 'WebsocketsGateway');
        return;
      }
      
      // Leave journey-specific rooms
      client.leave(`journey:${journey}`);
      client.leave(`user:${userId}:journey:${journey}`);
      
      this.logger.log(`User ${userId} unsubscribed from ${journey} notifications`, 'WebsocketsGateway');
      
      // Confirm unsubscription to client
      client.emit('unsubscribed', { journey });
    } catch (error) {
      this.logger.error(`Error in unsubscription handling`, error.stack, 'WebsocketsGateway');
      client.emit('error', { message: 'Failed to unsubscribe from notifications' });
    }
  }

  /**
   * Handles marking notifications as read.
   * 
   * @param client - The Socket.io client
   * @param payload - The notification ID to mark as read
   */
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(client: Socket, payload: { notificationId: number }): Promise<void> {
    try {
      const { notificationId } = payload;
      const userId = client.data.userId;
      
      if (!userId) {
        this.logger.warn(`Unauthenticated client ${client.id} attempted to mark notification as read`, 'WebsocketsGateway');
        return;
      }
      
      await this.tracingService.createSpan('websocket.markAsRead', async () => {
        await this.notificationsService.markAsRead(notificationId);
        
        this.logger.log(`User ${userId} marked notification ${notificationId} as read`, 'WebsocketsGateway');
        
        // Confirm to client
        client.emit('marked', { notificationId });
      });
    } catch (error) {
      this.logger.error(`Error marking notification as read`, error.stack, 'WebsocketsGateway');
      client.emit('error', { message: 'Failed to mark notification as read' });
    }
  }

  /**
   * Sends a notification to a specific user.
   * Used by NotificationsService to dispatch real-time notifications.
   * 
   * @param userId - The user ID to send the notification to
   * @param notification - The notification object to send
   */
  sendToUser(userId: string, notification: any): void {
    try {
      this.server.to(`user:${userId}`).emit('notification', notification);
      this.logger.debug(`Sent notification to user ${userId}`, 'WebsocketsGateway');
    } catch (error) {
      this.logger.error(`Error sending notification to user ${userId}`, error.stack, 'WebsocketsGateway');
    }
  }

  /**
   * Sends a journey-specific notification to a user.
   * 
   * @param userId - The user ID to send the notification to
   * @param journey - The journey context for the notification
   * @param notification - The notification object to send
   */
  sendJourneyNotificationToUser(userId: string, journey: string, notification: any): void {
    try {
      this.server.to(`user:${userId}:journey:${journey}`).emit('notification', notification);
      this.logger.debug(`Sent ${journey} notification to user ${userId}`, 'WebsocketsGateway');
    } catch (error) {
      this.logger.error(`Error sending ${journey} notification to user ${userId}`, error.stack, 'WebsocketsGateway');
    }
  }

  /**
   * Broadcasts a notification to all users subscribed to a specific journey.
   * 
   * @param journey - The journey context for the notification
   * @param notification - The notification object to broadcast
   */
  broadcastToJourney(journey: string, notification: any): void {
    try {
      this.server.to(`journey:${journey}`).emit('notification', notification);
      this.logger.debug(`Broadcast notification to journey ${journey}`, 'WebsocketsGateway');
    } catch (error) {
      this.logger.error(`Error broadcasting to journey ${journey}`, error.stack, 'WebsocketsGateway');
    }
  }

  /**
   * Temporary method to extract user ID from token for demonstration.
   * In production, this would be replaced with proper JWT verification.
   * 
   * @param token - The authentication token
   * @returns The extracted user ID or null if invalid
   * @private
   */
  private extractUserIdFromToken(token: string): string | null {
    // This is a placeholder implementation for demonstration purposes
    // In production, use a proper JWT library to decode and verify tokens
    if (token && token.length > 10) {
      // Simply return the token as user ID for demonstration
      return token;
    }
    return null;
  }
}