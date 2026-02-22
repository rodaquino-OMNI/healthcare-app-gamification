/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { PreferencesService } from '../preferences/preferences.service';
import { TemplatesService } from '../templates/templates.service';
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { Notification } from './entities/notification.entity';
import { SendNotificationDto } from './dto/send-notification.dto';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prismaService: PrismaService;
  let kafkaService: KafkaService;
  let preferencesService: PreferencesService;
  let templatesService: TemplatesService;

  const mockNotification: Notification = {
    id: 1,
    userId: 'user-1',
    type: 'APPOINTMENT_REMINDER',
    title: 'Appointment Reminder',
    body: 'Your appointment with Dr. Smith is tomorrow at 2:00 PM',
    channel: 'in-app',
    status: 'PENDING',
    journey: 'care',
    metadata: {},
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  };

  const mockTemplate = {
    id: 'template-1',
    code: 'APPOINTMENT_REMINDER',
    title: 'Appointment Reminder',
    message: 'Your appointment with {{doctorName}} is tomorrow at {{time}}',
    channels: 'in-app,push',
    journey: 'care',
    isActive: true,
    priority: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUserPreferences = {
    userId: 'user-1',
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    inAppEnabled: true,
    journeyPreferences: {
      care: { enabled: true },
      health: { enabled: true },
      plan: { enabled: false },
    },
  };

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockKafkaService = {
    emit: jest.fn(),
    produce: jest.fn(),
  };

  const mockPreferencesService = {
    findOne: jest.fn(),
  };

  const mockTemplatesService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: KafkaService, useValue: mockKafkaService },
        { provide: PreferencesService, useValue: mockPreferencesService },
        { provide: TemplatesService, useValue: mockTemplatesService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prismaService = module.get<PrismaService>(PrismaService);
    kafkaService = module.get<KafkaService>(KafkaService);
    preferencesService = module.get<PreferencesService>(PreferencesService);
    templatesService = module.get<TemplatesService>(TemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------------------------------------------
  // sendNotification
  // ----------------------------------------------------------------
  describe('sendNotification', () => {
    const sendDto: SendNotificationDto = {
      userId: 'user-1',
      type: 'APPOINTMENT_REMINDER',
      title: 'Appointment Reminder',
      body: 'Your appointment is tomorrow',
      templateId: 'template-1',
      journey: 'care',
      data: { doctorName: 'Dr. Smith', time: '2:00 PM' },
    };

    it('should create and return a notification when template is active', async () => {
      mockTemplatesService.findById.mockResolvedValue(mockTemplate);
      (mockPreferencesService.findOne as any).mockResolvedValue(mockUserPreferences);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockKafkaService.emit.mockResolvedValue(undefined);

      const result = await service.sendNotification(sendDto);

      expect(mockTemplatesService.findById).toHaveBeenCalledWith('template-1');
      expect(mockPrismaService.notification.create).toHaveBeenCalled();
      expect(result).toEqual(mockNotification);
    });

    it('should return null when template is inactive', async () => {
      const inactiveTemplate = { ...mockTemplate, isActive: false };
      mockTemplatesService.findById.mockResolvedValue(inactiveTemplate);
      (mockPreferencesService.findOne as any).mockResolvedValue(mockUserPreferences);

      const result = await service.sendNotification(sendDto);

      expect(mockPrismaService.notification.create).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when user has disabled journey notifications', async () => {
      mockTemplatesService.findById.mockResolvedValue(mockTemplate);
      (mockPreferencesService.findOne as any).mockResolvedValue({
        ...mockUserPreferences,
        journeyPreferences: { care: { enabled: false } },
      });

      const result = await service.sendNotification(sendDto);

      expect(mockPrismaService.notification.create).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should emit push notification event via Kafka when push channel is enabled', async () => {
      mockTemplatesService.findById.mockResolvedValue(mockTemplate);
      (mockPreferencesService.findOne as any).mockResolvedValue(mockUserPreferences);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockKafkaService.emit.mockResolvedValue(undefined);

      await service.sendNotification(sendDto);

      expect(mockKafkaService.emit).toHaveBeenCalledWith(
        'notifications.push',
        expect.objectContaining({ userId: 'user-1' })
      );
    });

    it('should throw AppException when template is not found', async () => {
      mockTemplatesService.findById.mockResolvedValue(null);

      await expect(service.sendNotification(sendDto)).rejects.toThrow(AppException);
    });

    it('should proceed with defaults when user preferences are not found', async () => {
      mockTemplatesService.findById.mockResolvedValue(mockTemplate);
      (mockPreferencesService.findOne as any).mockResolvedValue(null);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockKafkaService.emit.mockResolvedValue(undefined);

      const result = await service.sendNotification(sendDto);

      expect(result).toEqual(mockNotification);
    });

    it('should process template variables with provided data', async () => {
      mockTemplatesService.findById.mockResolvedValue(mockTemplate);
      (mockPreferencesService.findOne as any).mockResolvedValue(mockUserPreferences);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockKafkaService.emit.mockResolvedValue(undefined);

      await service.sendNotification({
        ...sendDto,
        data: { doctorName: 'Dr. Silva', time: '3:00 PM' },
      });

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: expect.stringContaining('Appointment'),
          }),
        })
      );
    });
  });

  // ----------------------------------------------------------------
  // markAsRead
  // ----------------------------------------------------------------
  describe('markAsRead', () => {
    it('should mark a notification as read and return the updated notification', async () => {
      const pendingNotification = { ...mockNotification, status: 'PENDING' };
      const readNotification = { ...mockNotification, status: 'READ' };
      mockPrismaService.notification.findFirst.mockResolvedValue(pendingNotification);
      mockPrismaService.notification.update.mockResolvedValue(readNotification);

      const result = await service.markAsRead('1', 'user-1');

      expect(mockPrismaService.notification.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'READ' }),
        })
      );
      expect(result.status).toBe('READ');
    });

    it('should return notification unchanged when it is already read', async () => {
      const alreadyReadNotification = { ...mockNotification, status: 'READ' };
      mockPrismaService.notification.findFirst.mockResolvedValue(alreadyReadNotification);

      const result = await service.markAsRead('1', 'user-1');

      expect(mockPrismaService.notification.update).not.toHaveBeenCalled();
      expect(result.status).toBe('READ');
    });

    it('should throw AppException when notification is not found', async () => {
      mockPrismaService.notification.findFirst.mockResolvedValue(null);

      await expect(service.markAsRead('nonexistent-id', 'user-1')).rejects.toThrow(AppException);
    });
  });

  // ----------------------------------------------------------------
  // markAllAsRead
  // ----------------------------------------------------------------
  describe('markAllAsRead', () => {
    it('should mark all notifications for a user as read', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 5 });

      await service.markAllAsRead('user-1');

      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: expect.objectContaining({ status: 'READ' }),
      });
    });
  });

  // ----------------------------------------------------------------
  // findAllByUser
  // ----------------------------------------------------------------
  describe('findAllByUser', () => {
    it('should return all notifications for a user', async () => {
      const mockNotifications = [mockNotification];
      mockPrismaService.notification.findMany.mockResolvedValue(mockNotifications);

      const result = await service.findAllByUser('user-1');

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } })
      );
      expect(result).toEqual(mockNotifications);
    });

    it('should filter only unread notifications when isRead is false', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([mockNotification]);

      await service.findAllByUser('user-1', false);

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: { not: 'READ' },
          }),
        })
      );
    });

    it('should filter only read notifications when isRead is true', async () => {
      const readNotification = { ...mockNotification, status: 'READ' };
      mockPrismaService.notification.findMany.mockResolvedValue([readNotification]);

      await service.findAllByUser('user-1', true);

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'READ' }),
        })
      );
    });

    it('should return empty array when user has no notifications', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([]);

      const result = await service.findAllByUser('user-with-no-notifications');

      expect(result).toEqual([]);
    });
  });

  // ----------------------------------------------------------------
  // findOne
  // ----------------------------------------------------------------
  describe('findOne', () => {
    it('should return a notification when found by ID', async () => {
      mockPrismaService.notification.findFirst.mockResolvedValue(mockNotification);

      const result = await service.findOne('1', 'user-1');

      expect(mockPrismaService.notification.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ userId: 'user-1' }) })
      );
      expect(result).toEqual(mockNotification);
    });

    it('should find by ID only when userId is not provided', async () => {
      mockPrismaService.notification.findFirst.mockResolvedValue(mockNotification);

      const result = await service.findOne('1');

      expect(result).toEqual(mockNotification);
    });

    it('should throw AppException when notification is not found', async () => {
      mockPrismaService.notification.findFirst.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(AppException);
    });
  });

  // ----------------------------------------------------------------
  // remove
  // ----------------------------------------------------------------
  describe('remove', () => {
    it('should delete a notification by ID', async () => {
      mockPrismaService.notification.findFirst.mockResolvedValue(mockNotification);
      mockPrismaService.notification.delete.mockResolvedValue(mockNotification);

      await service.remove('1');

      expect(mockPrismaService.notification.delete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: mockNotification.id } })
      );
    });

    it('should throw AppException when notification does not exist', async () => {
      mockPrismaService.notification.findFirst.mockResolvedValue(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(AppException);
    });
  });

  // ----------------------------------------------------------------
  // getUnreadCount
  // ----------------------------------------------------------------
  describe('getUnreadCount', () => {
    it('should return the count of unread notifications for a user', async () => {
      mockPrismaService.notification.count.mockResolvedValue(3);

      const result = await service.getUnreadCount('user-1');

      expect(mockPrismaService.notification.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', status: { not: 'READ' } },
      });
      expect(result).toBe(3);
    });

    it('should return 0 when user has no unread notifications', async () => {
      mockPrismaService.notification.count.mockResolvedValue(0);

      const result = await service.getUnreadCount('user-1');

      expect(result).toBe(0);
    });
  });
});
