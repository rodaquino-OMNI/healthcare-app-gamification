import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ChatMessagePayload {
    content: string;
    userId: string;
}

interface QuickReplyPayload {
    replyId: string;
    userId: string;
}

interface ChatReply {
    message: string;
    timestamp: string;
    type: 'text' | 'tip' | 'quickReply';
}

const WELLNESS_TIPS: string[] = [
    'Try taking 5 deep breaths to start your day.',
    'Remember to stay hydrated throughout the day.',
    'A short walk can boost your mood significantly.',
    'Practice gratitude by noting 3 things you are thankful for.',
    'Taking breaks helps maintain focus and reduces stress.',
    'Mindful breathing for 2 minutes can lower anxiety.',
    'Stretching regularly improves both body and mind.',
    "A good night's sleep is the foundation of wellness.",
];

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/wellness-chat',
})
export class WellnessGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private readonly logger = new Logger(WellnessGateway.name);

    constructor(private readonly configService: ConfigService) {}

    handleConnection(client: Socket): void {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('chat:message')
    handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: ChatMessagePayload
    ): { event: string; data: ChatReply } {
        this.logger.log(`Message from ${payload.userId}: ${payload.content}`);

        // Emit typing indicator
        client.emit('chat:typing', { isTyping: true });

        // Return a canned wellness tip (placeholder for AI integration)
        const tip = WELLNESS_TIPS[Math.floor(Math.random() * WELLNESS_TIPS.length)];

        const reply: ChatReply = {
            message: tip,
            timestamp: new Date().toISOString(),
            type: 'tip',
        };

        // Stop typing indicator
        client.emit('chat:typing', { isTyping: false });

        return { event: 'chat:reply', data: reply };
    }

    @SubscribeMessage('chat:quickReply')
    handleQuickReply(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: QuickReplyPayload
    ): { event: string; data: ChatReply } {
        this.logger.log(`Quick reply from ${payload.userId}: ${payload.replyId}`);

        const reply: ChatReply = {
            message: `Acknowledged your selection: ${payload.replyId}. Let me help you with that.`,
            timestamp: new Date().toISOString(),
            type: 'quickReply',
        };

        return { event: 'chat:reply', data: reply };
    }
}
