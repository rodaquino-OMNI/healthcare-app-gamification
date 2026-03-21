import { WebsocketsGateway } from './websockets.gateway';

describe('WebsocketsGateway', () => {
    let gateway: WebsocketsGateway;
    let mockKafkaService: Record<string, jest.Mock>;
    let mockLogger: Record<string, jest.Mock>;
    let mockServer: Record<string, jest.Mock>;

    beforeEach(() => {
        mockKafkaService = {
            subscribe: jest.fn(),
            emit: jest.fn(),
        };
        mockLogger = {
            setContext: jest.fn(),
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
        };

        gateway = new WebsocketsGateway(mockKafkaService as never, mockLogger as never);

        mockServer = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
        };
        (gateway as Record<string, unknown>).server = mockServer;
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });

    describe('handleConnection', () => {
        it('should register a client with userId', () => {
            const client = {
                id: 'socket-1',
                handshake: {
                    auth: { userId: 'user-1' },
                    query: {},
                },
                join: jest.fn(),
                disconnect: jest.fn(),
            };

            gateway.handleConnection(client as never);

            expect(client.join).toHaveBeenCalledWith('user-1');
            expect(gateway.isUserConnected('user-1')).toBe(true);
        });

        it('should disconnect client without userId', () => {
            const client = {
                id: 'socket-1',
                handshake: {
                    auth: {},
                    query: {},
                },
                join: jest.fn(),
                disconnect: jest.fn(),
            };

            gateway.handleConnection(client as never);

            expect(client.disconnect).toHaveBeenCalled();
        });
    });

    describe('handleDisconnect', () => {
        it('should remove client on disconnect', () => {
            const client = {
                id: 'socket-1',
                handshake: {
                    auth: { userId: 'user-1' },
                    query: {},
                },
                join: jest.fn(),
                disconnect: jest.fn(),
            };

            gateway.handleConnection(client as never);
            expect(gateway.isUserConnected('user-1')).toBe(true);

            gateway.handleDisconnect(client as never);
            expect(gateway.isUserConnected('user-1')).toBe(false);
        });
    });

    describe('sendToUser', () => {
        it('should emit notification to user room', () => {
            const notification = {
                id: 'notif-1',
                userId: 'user-1',
                title: 'Test',
                message: 'Hello',
                type: 'general',
                timestamp: new Date(),
            };

            gateway.sendToUser('user-1', notification);

            expect(mockServer.to).toHaveBeenCalledWith('user-1');
            expect(mockServer.emit).toHaveBeenCalledWith('notification', notification);
        });
    });

    describe('broadcastNotification', () => {
        it('should emit to all connected users', () => {
            const notification = {
                id: 'notif-1',
                userId: 'all',
                title: 'Broadcast',
                message: 'Hello all',
                type: 'general',
                timestamp: new Date(),
            };

            gateway.broadcastNotification(notification);

            expect(mockServer.emit).toHaveBeenCalledWith(
                'notification',
                expect.objectContaining({ broadcast: true })
            );
        });
    });

    describe('getConnectedUsersCount', () => {
        it('should return 0 when no users connected', () => {
            expect(gateway.getConnectedUsersCount()).toBe(0);
        });

        it('should return correct count after connections', () => {
            const client1 = {
                id: 'socket-1',
                handshake: { auth: { userId: 'user-1' }, query: {} },
                join: jest.fn(),
                disconnect: jest.fn(),
            };
            const client2 = {
                id: 'socket-2',
                handshake: { auth: { userId: 'user-2' }, query: {} },
                join: jest.fn(),
                disconnect: jest.fn(),
            };

            gateway.handleConnection(client1 as never);
            gateway.handleConnection(client2 as never);

            expect(gateway.getConnectedUsersCount()).toBe(2);
        });
    });

    describe('handleMarkAsRead', () => {
        it('should emit to kafka and acknowledge', () => {
            const client = {
                id: 'socket-1',
                handshake: { auth: { userId: 'user-1' }, query: {} },
                join: jest.fn(),
                disconnect: jest.fn(),
                emit: jest.fn(),
            };

            gateway.handleConnection(client as never);
            gateway.handleMarkAsRead(client as never, { id: 'notif-1' });

            expect(mockKafkaService.emit).toHaveBeenCalledWith(
                'notifications.markAsRead',
                expect.objectContaining({ userId: 'user-1', notificationId: 'notif-1' })
            );
            expect(client.emit).toHaveBeenCalledWith(
                'markAsReadAck',
                expect.objectContaining({ id: 'notif-1', success: true })
            );
        });
    });
});
