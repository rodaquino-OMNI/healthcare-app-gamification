/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // v10.0.0+
import { LoggerService } from '@app/shared/logging/logger.service';
import { WebsocketsGateway } from '../../websockets/websockets.gateway';
import { RedisService } from '@app/shared/redis/redis.service';
import { Notification } from '../../notifications/entities/notification.entity';

/**
 * Handles the sending of in-app notifications within the AUSTA SuperApp.
 * This service is responsible for checking user connection status and
 * either delivering notifications via WebSockets or storing them for later delivery.
 */
@Injectable()
export class InAppService {
  /**
   * Initializes the InAppService with required dependencies.
   *
   * @param websocketsGateway - Service for sending WebSocket messages
   * @param redisService - Service for Redis operations and checking connection status
   * @param logger - Service for logging
   * @param configService - Service for accessing configuration
   */
  constructor(
    private readonly websocketsGateway: WebsocketsGateway,
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Sends an in-app notification to a user.
   * If the user is connected, sends the notification via WebSocket.
   * If the user is not connected, stores the notification for later delivery.
   *
   * @param userId - The ID of the user to send the notification to
   * @param notification - The notification entity to send
   * @returns A promise that resolves with a boolean indicating whether the notification was sent successfully
   */
  async send(userId: string, notification: Notification): Promise<boolean> {
    try {
      this.logger.log(`Attempting to send in-app notification to user ${userId}`, 'InAppService');

      // Check if user is connected to WebSocket server
      const isConnected = await this.checkUserConnection(userId);

      if (isConnected) {
        // If user is connected, send notification immediately
        this.websocketsGateway.sendToUser(userId, {
          id: String(notification.id),
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.body,
          timestamp: notification.createdAt || new Date(),
        });

        this.logger.debug(`In-app notification sent to connected user ${userId}`, 'InAppService');
        return true;
      } else {
        // If user is not connected, store notification for later delivery
        const stored = await this.storeNotificationForLaterDelivery(userId, notification);
        this.logger.debug(`User ${userId} not connected. Notification stored for later delivery: ${stored}`, 'InAppService');
        return stored;
      }
    } catch (error) {
      this.logger.error(
        `Failed to send in-app notification to user ${userId}: ${(error as any).message}`,
        (error as any).stack,
        'InAppService'
      );
      return false;
    }
  }

  /**
   * Checks if a user is connected to the WebSocket server.
   * Uses Redis to verify if the user has an active connection.
   *
   * @param userId - The ID of the user to check
   * @returns A promise that resolves with a boolean indicating whether the user is connected
   */
  async checkUserConnection(userId: string): Promise<boolean> {
    try {
      // Check if user has an active WebSocket connection
      const connectionKey = `user:${userId}:connection`;
      const connectionExists = await this.redisService.exists(connectionKey);
      return connectionExists > 0;
    } catch (error) {
      this.logger.error(
        `Error checking connection status for user ${userId}: ${(error as any).message}`,
        (error as any).stack,
        'InAppService'
      );
      return false;
    }
  }

  /**
   * Stores a notification for later delivery when the user connects.
   * Uses Redis to store the notification with an appropriate TTL based on journey context.
   *
   * @param userId - The ID of the user to store the notification for
   * @param notification - The notification to store
   * @returns A promise that resolves with a boolean indicating whether the notification was stored successfully
   */
  async storeNotificationForLaterDelivery(
    userId: string,
    notification: Notification,
  ): Promise<boolean> {
    try {
      // Create a key for the user's pending notifications
      const pendingNotificationsKey = `user:${userId}:pending_notifications`;

      // Create notification payload
      const notificationPayload = {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        timestamp: notification.createdAt || new Date().toISOString(),
        channel: 'in-app',
        status: notification.status,
        data: {} // Additional data could be added here if needed
      };

      // Serialize the notification
      const serializedNotification = JSON.stringify(notificationPayload);

      // Generate a unique ID for the notification
      const notificationId = `${Date.now()}`;

      // Store the notification in a Redis hash
      await this.redisService.hset(
        pendingNotificationsKey,
        notificationId,
        serializedNotification
      );

      // Set an appropriate TTL for the pending notifications key
      const journey = this.getJourneyFromNotification(notification);
      const ttl = this.redisService.getJourneyTTL(journey);

      await this.redisService.expire(pendingNotificationsKey, ttl);

      return true;
    } catch (error) {
      this.logger.error(
        `Error storing notification for later delivery for user ${userId}: ${(error as any).message}`,
        (error as any).stack,
        'InAppService'
      );
      return false;
    }
  }

  /**
   * Determines the journey context from a notification.
   * Used to set appropriate cache TTLs based on journey type.
   *
   * @param notification - The notification to analyze
   * @returns The journey identifier (health, care, plan, game)
   * @private
   */
  private getJourneyFromNotification(notification: Notification): string {
    // Default to health journey if no type is available
    if (!notification || !notification.type) return 'health';

    const type = notification.type.toLowerCase();

    if (type.includes('health') || type.includes('metric') || type.includes('goal')) {
      return 'health';
    } else if (type.includes('care') || type.includes('appointment') || type.includes('medication')) {
      return 'care';
    } else if (type.includes('plan') || type.includes('claim') || type.includes('coverage')) {
      return 'plan';
    } else if (type.includes('achievement') || type.includes('quest') || type.includes('level')) {
      return 'game';
    }

    return 'health'; // Default to health journey if type is unknown
  }
}
