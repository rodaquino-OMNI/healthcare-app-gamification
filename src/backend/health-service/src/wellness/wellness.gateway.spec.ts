import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { WellnessGateway } from './wellness.gateway';

const mockConfigService = {
    get: jest.fn(),
};

const mockClient = {
    id: 'client-001',
    emit: jest.fn(),
};

describe('WellnessGateway', () => {
    let gateway: WellnessGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [WellnessGateway, { provide: ConfigService, useValue: mockConfigService }],
        }).compile();

        gateway = module.get<WellnessGateway>(WellnessGateway);
        jest.clearAllMocks();
    });

    describe('handleMessage', () => {
        it('should return a chat:reply event with a wellness tip', () => {
            const payload = { content: 'How can I feel better?', userId: 'user-123' };

            const result = gateway.handleMessage(mockClient as any, payload);

            expect(result.event).toBe('chat:reply');
            expect(result.data.type).toBe('tip');
            expect(result.data.message).toBeTruthy();
            expect(result.data.timestamp).toBeTruthy();
            expect(mockClient.emit).toHaveBeenCalledWith('chat:typing', { isTyping: true });
            expect(mockClient.emit).toHaveBeenCalledWith('chat:typing', { isTyping: false });
        });

        it('should log the message content', () => {
            const logSpy = jest.spyOn(gateway['logger'], 'log');
            const payload = { content: 'Test message', userId: 'user-456' };

            gateway.handleMessage(mockClient as any, payload);

            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('user-456'));
        });
    });

    describe('handleQuickReply', () => {
        it('should return a chat:reply event acknowledging the selection', () => {
            const payload = { replyId: 'reply-001', userId: 'user-123' };

            const result = gateway.handleQuickReply(mockClient as any, payload);

            expect(result.event).toBe('chat:reply');
            expect(result.data.type).toBe('quickReply');
            expect(result.data.message).toContain('reply-001');
        });
    });

    describe('handleConnection', () => {
        it('should log the client connection', () => {
            const logSpy = jest.spyOn(gateway['logger'], 'log');

            gateway.handleConnection(mockClient as any);

            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('client-001'));
        });
    });

    describe('handleDisconnect', () => {
        it('should log the client disconnection', () => {
            const logSpy = jest.spyOn(gateway['logger'], 'log');

            gateway.handleDisconnect(mockClient as any);

            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('client-001'));
        });
    });
});
