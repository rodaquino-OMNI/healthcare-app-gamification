/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { SendNotificationDto } from './dto/send-notification.dto';
import { PrismaService } from '@app/shared/database/prisma.service';
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { ErrorType } from '@app/shared/exceptions/error.types';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { PreferencesService } from '../preferences/preferences.service';
import { TemplatesService } from '../templates/templates.service';
import { NotificationTemplate } from '../types/notification';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaService: KafkaService,
    private readonly preferencesService: PreferencesService,
    private readonly templatesService: TemplatesService
  ) {}

  /**
   * Send a notification based on a template
   * @param sendNotificationDto The details of the notification to send
   * @returns The created notification
   */
  async sendNotification(sendNotificationDto: SendNotificationDto): Promise<Notification> {
    try {
      this.logger.log(`Sending notification to user ${sendNotificationDto.userId} using template ${sendNotificationDto.templateId}`);

      // Get the notification template
      const template = await this.templatesService.findById(sendNotificationDto.templateId);

      if (!template) {
        throw new AppException(ErrorType.TEMPLATE_NOT_FOUND, { templateId: sendNotificationDto.templateId } as any
        );
      }

      // Check if template is active
      if (!(template as any).isActive) {
        this.logger.warn(`Attempted to use inactive template: ${(template as any).code}`);
        return null;
      }

      // Get user preferences
      const userPreferences = await (this.preferencesService as any).findOne({ userId: sendNotificationDto.userId });

      if (!userPreferences) {
        this.logger.warn(`No preferences found for user ${sendNotificationDto.userId}, using defaults`);
      }

      // Determine journey context (from notification or template)
      const journey = sendNotificationDto.journey || template.journey || 'default';

      // Check if user has disabled this journey's notifications
      if (userPreferences?.journeyPreferences?.[journey]?.enabled === false) {
        this.logger.warn(`User ${sendNotificationDto.userId} has disabled notifications for journey ${journey}`);
        return null;
      }

      // Process template content with provided data
      const processedTemplate = this.processTemplateContent(template as any, sendNotificationDto.data);

      // Determine the available channels based on template and user preferences
      const availableChannels = template.channels.split(',');

      // Filter by user preferences
      const enabledChannels = this.getEnabledChannels(availableChannels, userPreferences);

      if (enabledChannels.length === 0) {
        this.logger.warn(`No enabled channels for user ${sendNotificationDto.userId}`);
        return null;
      }

      // Create notification record
      const notification = await this.createNotification({
        userId: sendNotificationDto.userId,
        title: processedTemplate.title,
        body: processedTemplate.message,
        type: (template as any).code,
        journey: journey,
        metadata: sendNotificationDto.data
      });

      // Send through each enabled channel
      for (const channel of enabledChannels) {
        await this.sendThroughChannel(
          notification,
          channel,
          userPreferences
        );
      }

      return notification;
    } catch (error) {
      this.logger.error(
        `Failed to send notification: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
        error instanceof Error ? (error as any).stack : undefined
      );
      throw error as any;
    }
  }

  /**
   * Process template content with provided data
   */
  private processTemplateContent(
    template: NotificationTemplate,
    data?: Record<string, any>
  ): { title: string; message: string } {
    try {
      let title = template.title;
      let message = template.message;

      // Simple variable replacement
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          title = title.replace(regex, String(value));
          message = message.replace(regex, String(value));
        });
      }

      return { title, message };
    } catch (error) {
      this.logger.error(
        `Error processing template: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
        error instanceof Error ? (error as any).stack : undefined
      );
      return {
        title: template.title,
        message: template.message
      };
    }
  }

  /**
   * Get enabled notification channels based on user preferences
   */
  private getEnabledChannels(
    availableChannels: string[],
    userPreferences?: any
  ): string[] {
    if (!userPreferences) {
      return availableChannels;
    }

    return availableChannels.filter(channel => {
      switch (channel) {
        case 'push':
          return userPreferences.pushEnabled !== false;
        case 'email':
          return userPreferences.emailEnabled !== false;
        case 'sms':
          return userPreferences.smsEnabled !== false;
        case 'in-app':
          return userPreferences.inAppEnabled !== false;
        default:
          return true;
      }
    });
  }

  /**
   * Create a notification record in the database
   */
  private async createNotification(data: {
    userId: string;
    title: string;
    body: string;
    type: string;
    journey?: string;
    metadata?: Record<string, any>;
  }): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        body: data.body,
        type: data.type,
        journey: data.journey || 'default',
        metadata: data.metadata || {},
        channel: 'in-app',
        status: 'PENDING',
      },
    });
  }

  /**
   * Send notification through the specified channel
   */
  private async sendThroughChannel(
    notification: Notification,
    channel: string,
    userPreferences?: any
  ): Promise<void> {
    try {
      switch (channel) {
        case 'push':
          await this.sendPushNotification(notification, userPreferences);
          break;
        case 'email':
          await this.sendEmailNotification(notification, userPreferences);
          break;
        case 'sms':
          await this.sendSmsNotification(notification, userPreferences);
          break;
        case 'in-app':
          // In-app notifications are already created in the database
          // This could trigger a WebSocket event if needed
          break;
        default:
          this.logger.warn(`Unknown notification channel: ${channel}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to send notification via ${channel}: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
        error instanceof Error ? (error as any).stack : undefined
      );
      // Continue with other channels even if one fails
    }
  }

  /**
   * Send a push notification
   */
  private async sendPushNotification(
    notification: Notification,
    userPreferences?: any
  ): Promise<void> {
    try {
      // Emit event to Kafka for the push notification service to handle
      await this.kafkaService.emit('notifications.push', {
        userId: notification.userId,
        title: notification.title,
        body: notification.body,
        metadata: notification.metadata,
        journey: notification.journey,
        notificationId: notification.id
      });

      this.logger.debug(`Push notification event emitted for user ${notification.userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send push notification: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
        error instanceof Error ? (error as any).stack : undefined
      );
      throw error as any;
    }
  }

  /**
   * Send an email notification
   */
  private async sendEmailNotification(
    notification: Notification,
    userPreferences?: any
  ): Promise<void> {
    try {
      // Emit event to Kafka for the email service to handle
      await this.kafkaService.emit('notifications.email', {
        userId: notification.userId,
        title: notification.title,
        body: notification.body,
        metadata: notification.metadata,
        journey: notification.journey,
        notificationId: notification.id
      });

      this.logger.debug(`Email notification event emitted for user ${notification.userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email notification: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
        error instanceof Error ? (error as any).stack : undefined
      );
      throw error as any;
    }
  }

  /**
   * Send an SMS notification
   */
  private async sendSmsNotification(
    notification: Notification,
    userPreferences?: any
  ): Promise<void> {
    try {
      // Emit event to Kafka for the SMS service to handle
      await this.kafkaService.emit('notifications.sms', {
        userId: notification.userId,
        body: notification.body,
        metadata: notification.metadata,
        journey: notification.journey,
        notificationId: notification.id
      });

      this.logger.debug(`SMS notification event emitted for user ${notification.userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send SMS notification: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
        error instanceof Error ? (error as any).stack : undefined
      );
      throw error as any;
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.prisma.notification.findFirst({
      where: { id: id as any, userId }
    });

    if (!notification) {
      throw new AppException(ErrorType.NOTIFICATION_NOT_FOUND, { id, userId } as any
      );
    }

    if (notification.status === 'READ') {
      return notification;
    }

    return this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: 'READ',
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications for a user as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId },
      data: {
        status: 'READ',
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Find all notifications for a user
   */
  async findAllByUser(userId: string, isRead?: boolean): Promise<Notification[]> {
    const where: any = { userId };

    if (isRead !== undefined) {
      where.status = isRead ? 'READ' : { not: 'READ' };
    }

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find a notification by ID
   */
  async findOne(id: string, userId?: string): Promise<Notification> {
    const where: any = { id: id as any };

    if (userId) {
      where.userId = userId;
    }

    const notification = await this.prisma.notification.findFirst({
      where
    });

    if (!notification) {
      throw new AppException(ErrorType.NOTIFICATION_NOT_FOUND, { id, userId } as any
      );
    }

    return notification;
  }

  /**
   * Remove a notification
   */
  async remove(id: string): Promise<void> {
    const notification = await this.findOne(id);
    await this.prisma.notification.delete({
      where: { id: notification.id },
    });
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, status: { not: 'READ' } },
    });
  }
}
