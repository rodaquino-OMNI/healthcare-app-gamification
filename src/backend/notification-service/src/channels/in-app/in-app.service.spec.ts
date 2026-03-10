import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InAppService } from './in-app.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { WebsocketsGateway } from '../../websockets/websockets.gateway';
import { Notification } from '../../notifications/entities/notification.entity';

describe('InAppService', () => {
    let service: InAppService;
    let redisService: Record<string, jest.Mock>;
    let websocketsGateway: Record<string, jest.Mock>;

    const mockNotification: Notification = {
        id: 1,
        userId: 'user-1',
        type: 'APPOINTMENT_REMINDER',
        title: 'Appointment Reminder',
        body: 'Your appointment is tomorrow',
        channel: 'IN_APP',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        redisService = {
            exists: jest.fn().mockResolvedValue(0),
            hset: jest.fn().mockResolvedValue(1),
            expire: jest.fn().mockResolvedValue(1),
            getJourneyTTL: jest.fn().mockReturnValue(300),
        };

        websocketsGateway = {
            sendToUser: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InAppService,
                { provide: WebsocketsGateway, useValue: websocketsGateway },
                { provide: RedisService, useValue: redisService },
                {
                    provide: LoggerService,
                    useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
                },
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        service = module.get<InAppService>(InAppService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('send', () => {
        it('should send via websocket when user is connected', async () => {
            redisService.exists.mockResolvedValueOnce(1);

            const result = await service.send('user-1', mockNotification);

            expect(result).toBe(true);
            expect(websocketsGateway.sendToUser).toHaveBeenCalledWith('user-1', expect.any(Object));
        });

        it('should store for later delivery when user is not connected', async () => {
            redisService.exists.mockResolvedValueOnce(0);

            const result = await service.send('user-1', mockNotification);

            expect(result).toBe(true);
            expect(redisService.hset).toHaveBeenCalled();
            expect(redisService.expire).toHaveBeenCalled();
        });

        it('should return false on error', async () => {
            redisService.exists.mockRejectedValueOnce(new Error('Redis error'));

            const result = await service.send('user-1', mockNotification);

            expect(result).toBe(false);
        });
    });

    describe('checkUserConnection', () => {
        it('should return true when user has active connection', async () => {
            redisService.exists.mockResolvedValueOnce(1);

            const result = await service.checkUserConnection('user-1');

            expect(result).toBe(true);
        });

        it('should return false when user has no active connection', async () => {
            redisService.exists.mockResolvedValueOnce(0);

            const result = await service.checkUserConnection('user-1');

            expect(result).toBe(false);
        });

        it('should return false on redis error', async () => {
            redisService.exists.mockRejectedValueOnce(new Error('Redis error'));

            const result = await service.checkUserConnection('user-1');

            expect(result).toBe(false);
        });
    });

    describe('storeNotificationForLaterDelivery', () => {
        it('should store notification in redis hash', async () => {
            const result = await service.storeNotificationForLaterDelivery('user-1', mockNotification);

            expect(result).toBe(true);
            expect(redisService.hset).toHaveBeenCalledWith(
                'user:user-1:pending_notifications',
                expect.any(String),
                expect.any(String)
            );
        });

        it('should return false on redis error', async () => {
            redisService.hset.mockRejectedValueOnce(new Error('Redis error'));

            const result = await service.storeNotificationForLaterDelivery('user-1', mockNotification);

            expect(result).toBe(false);
        });

        it('should use health journey TTL for health notifications', async () => {
            const healthNotification = { ...mockNotification, type: 'health_metric_alert' };

            await service.storeNotificationForLaterDelivery('user-1', healthNotification);

            expect(redisService.getJourneyTTL).toHaveBeenCalledWith('health');
        });

        it('should use care journey TTL for appointment notifications', async () => {
            const careNotification = { ...mockNotification, type: 'appointment_reminder' };

            await service.storeNotificationForLaterDelivery('user-1', careNotification);

            expect(redisService.getJourneyTTL).toHaveBeenCalledWith('care');
        });
    });
});
