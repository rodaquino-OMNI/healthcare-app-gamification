import { INestApplication, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

const JwtAuthGuard = AuthGuard('jwt');

import { AppModule } from '../src/app.module';
import { SendNotificationDto } from '../src/notifications/dto/send-notification.dto';
import { NotificationsService } from '../src/notifications/notifications.service';

describe('NotificationsController (e2e)', () => {
    let app: INestApplication;
    const mockNotificationsService = {
        sendNotification: jest.fn().mockResolvedValue(true),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideProvider(NotificationsService)
            .useValue(mockNotificationsService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send a notification', () => {
        const dto: SendNotificationDto = {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Achievement Unlocked!',
            body: 'You unlocked the Daily Steps achievement!',
            type: 'achievement',
            journey: 'health',
            data: {
                achievementId: 'daily-steps',
                xp: 50,
            },
            channels: ['push', 'in-app'],
        };

        return request(app.getHttpServer())
            .post('/notifications/send')
            .send(dto)
            .expect(HttpStatus.OK)
            .expect(() => {
                expect(mockNotificationsService.sendNotification).toHaveBeenCalledWith(dto);
            });
    });

    it('should return 400 when DTO is invalid', () => {
        const invalidDto = {
            // Missing required fields
            title: 'Invalid Notification',
        };

        return request(app.getHttpServer())
            .post('/notifications/send')
            .send(invalidDto)
            .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 500 when notification service fails', () => {
        const dto: SendNotificationDto = {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Test Notification',
            body: 'This is a test notification',
            type: 'info',
            journey: 'care',
            data: { appointmentId: '123' },
            channels: ['email', 'push'],
        };

        mockNotificationsService.sendNotification.mockRejectedValueOnce(
            new Error('Service failure')
        );

        return request(app.getHttpServer())
            .post('/notifications/send')
            .send(dto)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should handle journey-specific notification templates', () => {
        const dto: SendNotificationDto = {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Appointment Reminder',
            body: 'Your appointment with Dr. Santos is tomorrow at 10:00 AM',
            type: 'reminder',
            journey: 'care',
            data: {
                appointmentId: '456',
                provider: 'Dr. Santos',
                time: '10:00 AM',
                date: '2023-04-15',
            },
            channels: ['push', 'sms', 'email'],
        };

        return request(app.getHttpServer())
            .post('/notifications/send')
            .send(dto)
            .expect(HttpStatus.OK)
            .expect(() => {
                expect(mockNotificationsService.sendNotification).toHaveBeenCalledWith(dto);
            });
    });
});
