import { Injectable } from '@nestjs/common'; // @nestjs/common v10.0.0+
import { InjectRepository } from '@nestjs/typeorm'; // @nestjs/typeorm v10.0.0+
import { Repository } from 'typeorm'; // typeorm v0.3.0+

import { SendNotificationDto } from './dto/send-notification.dto';
import { Notification } from './entities/notification.entity';
import { PreferencesService } from '../preferences/preferences.service';
import { TemplatesService } from '../templates/templates.service';
import { KafkaService } from '../../shared/src/kafka/kafka.service';
import { LoggerService } from '../../shared/src/logging/logger.service';
import { RedisService } from '../../shared/src/redis/redis.service';
import { ErrorCodeDetails } from '../../shared/src/constants/error-codes.constants';
import { Service } from '../../shared/src/interfaces/service.interface';

/**
 * Provides the core logic for sending notifications within the AUSTA SuperApp.
 * It supports sending notifications via multiple channels, including push notifications,
 * SMS, and email. The service retrieves user preferences and templates to personalize
 * notifications and ensures reliable delivery.
 */
@Injectable()
export class NotificationsService {
  /**
   * Initializes the NotificationsService.
   * 
   * @param notificationRepository - Repository for notification entities
   * @param preferencesService - Service for user notification preferences
   * @param templatesService - Service for notification templates
   * @param kafkaService - Service for event streaming 
   * @param logger - Service for logging
   * @param redisService - Service for caching and real-time communication
   */
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly preferencesService: PreferencesService,
    private readonly templatesService: TemplatesService,
    private readonly kafkaService: KafkaService,
    private readonly logger: LoggerService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Sends a notification to a user based on the provided DTO.
   * 
   * @param sendNotificationDto - Data required to send the notification
   * @returns Promise that resolves when the notification is sent
   */
  async sendNotification(sendNotificationDto: SendNotificationDto): Promise<void> {
    try {
      this.logger.log(
        `Sending notification to user ${sendNotificationDto.userId} of type ${sendNotificationDto.type}`,
        'NotificationsService',
      );

      // Get user notification preferences
      const userPreferences = await this.preferencesService.findOne(sendNotificationDto.userId);
      
      if (!userPreferences) {
        this.logger.log(
          `No notification preferences found for user ${sendNotificationDto.userId}, using defaults`,
          'NotificationsService',
        );
        // If no preferences found, create default preferences
        await this.preferencesService.create(sendNotificationDto.userId);
      }

      // Determine which channels to use based on user preferences and notification type
      const channels = this.determineNotificationChannels(
        userPreferences,
        sendNotificationDto.type,
      );

      if (channels.length === 0) {
        this.logger.log(
          `User ${sendNotificationDto.userId} has disabled all notification channels for type ${sendNotificationDto.type}`,
          'NotificationsService',
        );
        return;
      }

      // Get notification template if templateId is provided
      let notificationContent = {
        title: sendNotificationDto.title,
        body: sendNotificationDto.body,
        data: sendNotificationDto.data || {},
      };

      if (sendNotificationDto.templateId) {
        try {
          // Try to get the template by ID and language
          const templates = await this.templatesService.findAll({
            where: {
              templateId: sendNotificationDto.templateId,
              language: sendNotificationDto.language || 'pt-BR',
            },
          });

          if (templates && templates.length > 0) {
            const template = templates[0];
            // Format the template with the provided data
            const formattedTemplate = this.templatesService.formatTemplateWithData(
              template,
              sendNotificationDto.data || {},
            );
            notificationContent = {
              ...notificationContent,
              title: formattedTemplate.title,
              body: formattedTemplate.body,
            };
          }
        } catch (error) {
          this.logger.warn(
            `Error fetching template ${sendNotificationDto.templateId}: ${error.message}`,
            'NotificationsService',
          );
          // Continue with original content if template not found
        }
      }

      // Send notification through each enabled channel
      for (const channel of channels) {
        try {
          await this.sendThroughChannel(
            channel,
            sendNotificationDto.userId,
            notificationContent,
          );

          // Record successful notification in database
          await this.createNotificationRecord(
            sendNotificationDto.userId,
            sendNotificationDto.type,
            notificationContent.title,
            notificationContent.body,
            channel,
            'sent',
          );
        } catch (error) {
          this.logger.error(
            `Failed to send notification via ${channel} to user ${sendNotificationDto.userId}`,
            error,
            'NotificationsService',
          );

          // Record failed notification
          await this.createNotificationRecord(
            sendNotificationDto.userId,
            sendNotificationDto.type,
            notificationContent.title,
            notificationContent.body,
            channel,
            'failed',
          );
        }
      }

      // Publish notification event to Kafka for analytics and cross-service integration
      try {
        await this.kafkaService.produce(
          'notifications',
          {
            userId: sendNotificationDto.userId,
            type: sendNotificationDto.type,
            channels,
            title: notificationContent.title,
            body: notificationContent.body,
            timestamp: new Date().toISOString(),
          },
          sendNotificationDto.userId, // Use userId as key for consistent partitioning
        );
      } catch (error) {
        this.logger.error(
          `Failed to publish notification event to Kafka`,
          error,
          'NotificationsService',
        );
        // Non-blocking - we continue even if Kafka publishing fails
      }

      this.logger.log(
        `Completed sending notification to user ${sendNotificationDto.userId}`,
        'NotificationsService',
      );
    } catch (error) {
      this.logger.error(
        `Error in sendNotification for user ${sendNotificationDto.userId}`,
        error,
        'NotificationsService',
      );
      throw error;
    }
  }

  /**
   * Creates a notification record in the database.
   * 
   * @param userId - User ID
   * @param type - Notification type
   * @param title - Notification title
   * @param body - Notification body
   * @param channel - Delivery channel
   * @param status - Notification status
   * @returns The created notification record
   * @private
   */
  private async createNotificationRecord(
    userId: string,
    type: string,
    title: string,
    body: string,
    channel: string,
    status: string,
  ): Promise<Notification> {
    try {
      const notification = this.notificationRepository.create({
        userId,
        type,
        title,
        body,
        channel,
        status,
      });

      return await this.notificationRepository.save(notification);
    } catch (error) {
      this.logger.error(
        `Failed to create notification record for user ${userId}`,
        error,
        'NotificationsService',
      );
      // Non-blocking - we don't want to fail notification delivery if record creation fails
      return null;
    }
  }

  /**
   * Determines which notification channels to use based on user preferences.
   * 
   * @param preferences - User notification preferences
   * @param type - Notification type
   * @returns Array of channels to use
   * @private
   */
  private determineNotificationChannels(preferences: any, type: string): string[] {
    const channels: string[] = [];

    // Default to in-app notifications if no preferences are found
    if (!preferences) {
      return ['in-app', 'push'];
    }

    // Add channels based on user preferences
    if (preferences.pushEnabled) {
      channels.push('push');
    }

    if (preferences.emailEnabled) {
      channels.push('email');
    }

    if (preferences.smsEnabled) {
      // SMS is typically used only for important notifications to manage costs
      const criticalTypes = ['emergency', 'appointment-reminder', 'medication-reminder'];
      if (criticalTypes.includes(type)) {
        channels.push('sms');
      }
    }

    // In-app notifications are always enabled
    channels.push('in-app');

    return channels;
  }

  /**
   * Sends a notification through a specific channel.
   * 
   * @param channel - Delivery channel
   * @param userId - User ID
   * @param content - Notification content
   * @returns Promise that resolves when the notification is sent
   * @private
   */
  private async sendThroughChannel(
    channel: string,
    userId: string,
    content: any,
  ): Promise<void> {
    switch (channel) {
      case 'push':
        await this.sendPushNotification(userId, content);
        break;
      case 'email':
        await this.sendEmailNotification(userId, content);
        break;
      case 'sms':
        await this.sendSmsNotification(userId, content);
        break;
      case 'in-app':
        await this.sendInAppNotification(userId, content);
        break;
      default:
        this.logger.warn(
          `Unknown notification channel: ${channel}`,
          'NotificationsService',
        );
    }
  }

  /**
   * Sends a push notification.
   * 
   * @param userId - User ID
   * @param content - Notification content
   * @returns Promise that resolves when the notification is sent
   * @private
   */
  private async sendPushNotification(userId: string, content: any): Promise<void> {
    this.logger.log(
      `Sending push notification to user ${userId}`,
      'NotificationsService',
    );

    // In a real implementation, this would integrate with FCM, APNs, or similar
    // For this implementation, we'll just log it
    this.logger.debug(
      `Push notification content: ${JSON.stringify(content)}`,
      'NotificationsService',
    );

    // Simulate a delay for the external API call
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Sends an email notification.
   * 
   * @param userId - User ID
   * @param content - Notification content
   * @returns Promise that resolves when the notification is sent
   * @private
   */
  private async sendEmailNotification(userId: string, content: any): Promise<void> {
    this.logger.log(
      `Sending email notification to user ${userId}`,
      'NotificationsService',
    );

    // In a real implementation, this would integrate with SendGrid, SES, or similar
    // For this implementation, we'll just log it
    this.logger.debug(
      `Email notification content: ${JSON.stringify(content)}`,
      'NotificationsService',
    );

    // Simulate a delay for the external API call
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  /**
   * Sends an SMS notification.
   * 
   * @param userId - User ID
   * @param content - Notification content
   * @returns Promise that resolves when the notification is sent
   * @private
   */
  private async sendSmsNotification(userId: string, content: any): Promise<void> {
    this.logger.log(
      `Sending SMS notification to user ${userId}`,
      'NotificationsService',
    );

    // In a real implementation, this would integrate with Twilio, SNS, or similar
    // For this implementation, we'll just log it
    this.logger.debug(
      `SMS notification content: ${JSON.stringify(content)}`,
      'NotificationsService',
    );

    // Simulate a delay for the external API call
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  /**
   * Sends an in-app notification through WebSocket.
   * 
   * @param userId - User ID
   * @param content - Notification content
   * @returns Promise that resolves when the notification is sent
   * @private
   */
  private async sendInAppNotification(userId: string, content: any): Promise<void> {
    this.logger.log(
      `Sending in-app notification to user ${userId}`,
      'NotificationsService',
    );

    try {
      // Create notification payload
      const notification = {
        userId,
        title: content.title,
        body: content.body,
        data: content.data || {},
        timestamp: new Date().toISOString(),
      };

      // Publish to Redis channel for real-time delivery to connected clients
      const userChannel = `user:${userId}:notifications`;
      await this.redisService.publish(
        userChannel,
        JSON.stringify(notification),
      );

      // Also store in Redis for retrieval when user reconnects
      const notificationListKey = `notifications:${userId}`;
      const notificationId = Date.now().toString();
      
      await this.redisService.hset(
        notificationListKey,
        notificationId,
        JSON.stringify(notification),
      );

      // Set expiry for the notification list if it doesn't exist
      // Get appropriate TTL based on the journey context
      const journeyType = this.getJourneyFromNotificationType(content.data?.type) || 'health';
      const ttl = this.redisService.getJourneyTTL(journeyType);
      await this.redisService.expire(notificationListKey, ttl);

      this.logger.debug(
        `In-app notification sent via Redis to channel ${userChannel}`,
        'NotificationsService',
      );
    } catch (error) {
      this.logger.error(
        `Failed to send in-app notification to user ${userId}`,
        error,
        'NotificationsService',
      );
      throw error;
    }
  }

  /**
   * Determines the journey context from a notification type.
   * 
   * @param type - Notification type
   * @returns Journey identifier (health, care, plan)
   * @private
   */
  private getJourneyFromNotificationType(type: string): string | undefined {
    if (!type) return undefined;
    
    if (type.startsWith('health') || type.includes('metric') || type.includes('goal')) {
      return 'health';
    } else if (type.startsWith('care') || type.includes('appointment') || type.includes('medication')) {
      return 'care';
    } else if (type.startsWith('plan') || type.includes('claim') || type.includes('coverage')) {
      return 'plan';
    } else if (type.includes('achievement') || type.includes('quest') || type.includes('level')) {
      return 'game';
    }
    return undefined;
  }

  /**
   * Retrieves notifications for a user.
   * 
   * @param userId - User ID
   * @param limit - Maximum number of notifications to retrieve
   * @param offset - Offset for pagination
   * @returns Promise resolving to an array of notifications
   */
  async getNotificationsForUser(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Notification[]> {
    try {
      return this.notificationRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      this.logger.error(
        `Failed to retrieve notifications for user ${userId}`,
        error,
        'NotificationsService',
      );
      throw error;
    }
  }

  /**
   * Marks a notification as read.
   * 
   * @param id - Notification ID
   * @returns Promise resolving to the updated notification
   */
  async markAsRead(id: number): Promise<Notification> {
    try {
      await this.notificationRepository.update(id, { status: 'read' });
      return this.notificationRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Failed to mark notification ${id} as read`,
        error,
        'NotificationsService',
      );
      throw error;
    }
  }

  /**
   * Marks all notifications for a user as read.
   * 
   * @param userId - User ID
   * @returns Promise resolving to the number of notifications updated
   */
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await this.notificationRepository.update(
        { userId, status: 'sent' },
        { status: 'read' },
      );
      
      return result.affected || 0;
    } catch (error) {
      this.logger.error(
        `Failed to mark all notifications as read for user ${userId}`,
        error,
        'NotificationsService',
      );
      throw error;
    }
  }
}