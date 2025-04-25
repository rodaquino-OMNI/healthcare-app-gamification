import { IsString, IsNotEmpty, IsOptional, IsObject, IsUUID } from 'class-validator'; // class-validator v0.14.0

/**
 * Data transfer object for sending notifications.
 * This DTO defines the structure and validation rules for notification requests
 * throughout the AUSTA SuperApp.
 */
export class SendNotificationDto {
  /**
   * The ID of the user to receive the notification
   */
  @IsUUID(4)
  @IsNotEmpty()
  userId: string;

  /**
   * Type of notification (e.g., 'achievement', 'appointment', 'reminder')
   * Used for categorizing and routing notifications
   */
  @IsString()
  @IsNotEmpty()
  type: string;

  /**
   * Title displayed in the notification
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Main content of the notification
   */
  @IsString()
  @IsNotEmpty()
  body: string;

  /**
   * Additional structured data for the notification
   * Can include journey-specific context, actions, or metadata
   */
  @IsObject()
  @IsOptional()
  data?: any;

  /**
   * ID of the notification template to use (if applicable)
   * References a pre-defined template in the notification service
   */
  @IsString()
  @IsOptional()
  templateId?: string;

  /**
   * Language code for the notification content
   * Defaults to user's preferred language if not specified
   */
  @IsString()
  @IsOptional()
  language?: string;
}