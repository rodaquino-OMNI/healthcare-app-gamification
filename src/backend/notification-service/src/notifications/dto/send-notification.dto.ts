import { IsString, IsNotEmpty, IsEnum, IsObject, IsArray, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for sending a notification
 */
export class SendNotificationDto {
  /**
   * The ID of the user to send the notification to
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty({
    description: 'User ID to send notification to',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  /**
   * The type of notification
   * @example "APPOINTMENT_REMINDER"
   */
  @ApiProperty({
    description: 'Type of notification',
    example: 'APPOINTMENT_REMINDER'
  })
  @IsString()
  @IsNotEmpty()
  type!: string;

  /**
   * The title of the notification
   * @example "Appointment Reminder"
   */
  @ApiProperty({
    description: 'Notification title',
    example: 'Appointment Reminder'
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  /**
   * The body content of the notification
   * @example "Your appointment with Dr. Smith is tomorrow at 2:00 PM"
   */
  @ApiProperty({
    description: 'Notification body content',
    example: 'Your appointment with Dr. Smith is tomorrow at 2:00 PM'
  })
  @IsString()
  @IsNotEmpty()
  body!: string;

  /**
   * Optional template ID for dynamic content
   * @example "appointment-reminder"
   */
  @ApiProperty({
    description: 'Template ID for dynamic content',
    example: 'appointment-reminder',
    required: false
  })
  @IsString()
  @IsOptional()
  templateId?: string;

  /**
   * Optional dynamic data for template rendering
   * @example { "doctorName": "Dr. Smith", "time": "2:00 PM", "date": "Tomorrow" }
   */
  @ApiProperty({
    description: 'Dynamic data for template rendering',
    example: { doctorName: 'Dr. Smith', time: '2:00 PM', date: 'Tomorrow' },
    required: false
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  /**
   * Optional notification delivery channels
   * @example ["EMAIL", "PUSH", "SMS"]
   */
  @ApiProperty({
    description: 'Notification delivery channels',
    example: ['EMAIL', 'PUSH', 'SMS'],
    required: false,
    isArray: true
  })
  @IsArray()
  @IsOptional()
  channels?: string[];

  /**
   * Optional journey context for styling
   * @example "health"
   */
  @ApiProperty({
    description: 'Journey context for styling',
    example: 'health',
    enum: ['health', 'care', 'plan'],
    required: false
  })
  @IsString()
  @IsOptional()
  journey?: string;

  /**
   * Whether this notification is related to gamification (achievements, levels, etc.)
   * @example true
   */
  @ApiProperty({
    description: 'Whether this is a gamification-related notification',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isGamification?: boolean;

  /**
   * Achievement details if this is an achievement notification
   */
  @ApiProperty({
    description: 'Achievement details for gamification notifications',
    example: {
      id: 'first-appointment',
      name: 'First Appointment',
      description: 'Completed your first medical appointment',
      iconUrl: 'https://assets.superapp.health/badges/first-appointment.png',
      xpEarned: 100
    },
    required: false
  })
  @IsObject()
  @IsOptional()
  achievement?: {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    xpEarned: number;
  };

  /**
   * Level-up details if this is a level-up notification
   */
  @ApiProperty({
    description: 'Level-up details for gamification notifications',
    example: {
      oldLevel: 1,
      newLevel: 2,
      xpEarned: 200,
      rewards: ['New health quiz unlocked', 'Meditation content access']
    },
    required: false
  })
  @IsObject()
  @IsOptional()
  levelUp?: {
    oldLevel: number;
    newLevel: number;
    xpEarned: number;
    rewards?: string[];
  };

  /**
   * Streak information for streak-related notifications
   */
  @ApiProperty({
    description: 'Streak information for streak-related notifications',
    example: {
      current: 5,
      milestone: 5,
      type: 'daily-check-in'
    },
    required: false
  })
  @IsObject()
  @IsOptional()
  streak?: {
    current: number;
    milestone?: number;
    type: string;
  };

  /**
   * Priority level of notification, useful for controlling gamification notification frequency
   * @example 2
   */
  @ApiProperty({
    description: 'Priority level of notification (1-5, with 1 being highest)',
    example: 2,
    required: false
  })
  @IsNumber()
  @IsOptional()
  priority?: number;
}