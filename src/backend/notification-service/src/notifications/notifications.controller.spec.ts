/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Test, TestingModule } from '@nestjs/testing';

import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
    let controller: NotificationsController;

    const mockNotificationsService = {
        sendNotification: jest.fn(),
        findAllByUser: jest.fn(),
        findOne: jest.fn(),
        markAsRead: jest.fn(),
        markAllAsRead: jest.fn(),
        remove: jest.fn(),
        getUnreadCount: jest.fn(),
    };

    const mockLoggerService = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    };

    const mockNotification = {
        id: 1,
        userId: 'user-1',
        type: 'APPOINTMENT_REMINDER',
        title: 'Appointment Reminder',
        body: 'Your appointment is tomorrow',
        channel: 'in-app',
        status: 'PENDING',
        journey: 'care',
        metadata: {},
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationsController],
            providers: [
                { provide: NotificationsService, useValue: mockNotificationsService },
                { provide: LoggerService, useValue: mockLoggerService },
            ],
        }).compile();

        controller = module.get<NotificationsController>(NotificationsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // -------------------------------------------------------------------------
    // sendNotification
    // -------------------------------------------------------------------------
    describe('sendNotification', () => {
        const sendDto: SendNotificationDto = {
            userId: 'user-1',
            type: 'APPOINTMENT_REMINDER',
            title: 'Appointment Reminder',
            body: 'Your appointment is tomorrow',
            templateId: 'template-1',
            journey: 'care',
            data: {},
        };

        it('should delegate to NotificationsService.sendNotification and return the result', async () => {
            mockNotificationsService.sendNotification.mockResolvedValue(mockNotification);

            const result = await controller.sendNotification(sendDto);

            expect(mockNotificationsService.sendNotification).toHaveBeenCalledWith(sendDto);
            expect(result).toEqual(mockNotification);
        });

        it('should return null when template is inactive', async () => {
            mockNotificationsService.sendNotification.mockResolvedValue(null);

            const result = await controller.sendNotification(sendDto);

            expect(result).toBeNull();
        });

        it('should propagate AppException from the service when template is not found', async () => {
            mockNotificationsService.sendNotification.mockRejectedValue(
                new AppException('Template not found', 'NOT_FOUND' as any, 'NOTIF_001')
            );

            await expect(controller.sendNotification(sendDto)).rejects.toThrow(AppException);
        });
    });

    // -------------------------------------------------------------------------
    // findAll
    // -------------------------------------------------------------------------
    describe('findAll', () => {
        it('should return all notifications for the authenticated user', async () => {
            mockNotificationsService.findAllByUser.mockResolvedValue([mockNotification]);

            const result = await controller.findAll('user-1');

            expect(mockNotificationsService.findAllByUser).toHaveBeenCalledWith(
                'user-1',
                undefined
            );
            expect(result).toEqual([mockNotification]);
        });

        it('should filter by read status when isRead query param is provided', async () => {
            mockNotificationsService.findAllByUser.mockResolvedValue([]);

            await controller.findAll('user-1', true);

            expect(mockNotificationsService.findAllByUser).toHaveBeenCalledWith('user-1', true);
        });

        it('should return empty array when user has no notifications', async () => {
            mockNotificationsService.findAllByUser.mockResolvedValue([]);

            const result = await controller.findAll('user-with-none');

            expect(result).toEqual([]);
        });
    });

    // -------------------------------------------------------------------------
    // findOne
    // -------------------------------------------------------------------------
    describe('findOne', () => {
        it('should return a notification by ID for the authenticated user', async () => {
            mockNotificationsService.findOne.mockResolvedValue(mockNotification);

            const result = await controller.findOne('1', 'user-1');

            expect(mockNotificationsService.findOne).toHaveBeenCalledWith('1', 'user-1');
            expect(result).toEqual(mockNotification);
        });

        it('should throw AppException when notification is not found', async () => {
            mockNotificationsService.findOne.mockRejectedValue(
                new AppException('Notification not found', 'NOT_FOUND' as any, 'NOTIF_002')
            );

            await expect(controller.findOne('nonexistent-id', 'user-1')).rejects.toThrow(
                AppException
            );
        });
    });

    // -------------------------------------------------------------------------
    // markAsRead
    // -------------------------------------------------------------------------
    describe('markAsRead', () => {
        it('should mark a notification as read and return the updated notification', async () => {
            const readNotification = { ...mockNotification, status: 'READ' };
            mockNotificationsService.markAsRead.mockResolvedValue(readNotification);

            const result = await controller.markAsRead('1', 'user-1');

            expect(mockNotificationsService.markAsRead).toHaveBeenCalledWith('1', 'user-1');
            expect(result.status).toBe('READ');
        });

        it('should throw AppException when notification is not found', async () => {
            mockNotificationsService.markAsRead.mockRejectedValue(
                new AppException('Notification not found', 'NOT_FOUND' as any, 'NOTIF_002')
            );

            await expect(controller.markAsRead('nonexistent-id', 'user-1')).rejects.toThrow(
                AppException
            );
        });
    });

    // -------------------------------------------------------------------------
    // remove
    // -------------------------------------------------------------------------
    describe('remove', () => {
        it('should call NotificationsService.remove with the given ID', async () => {
            mockNotificationsService.remove.mockResolvedValue(undefined);

            await controller.remove('1');

            expect(mockNotificationsService.remove).toHaveBeenCalledWith('1');
        });

        it('should throw AppException when notification to delete is not found', async () => {
            mockNotificationsService.remove.mockRejectedValue(
                new AppException('Notification not found', 'NOT_FOUND' as any, 'NOTIF_002')
            );

            await expect(controller.remove('nonexistent-id')).rejects.toThrow(AppException);
        });
    });
});
