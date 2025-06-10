import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a notification sent to a user through various channels
 */
@Entity('notifications')
export class Notification {
  /**
   * Unique identifier for the notification
   * @example 1
   */
  @ApiProperty({ description: 'Unique notification ID' })
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * ID of the user the notification was sent to
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty({ description: 'User ID the notification was sent to' })
  @Column({ name: 'user_id' })
  userId!: string;

  /**
   * Type of notification
   * @example "APPOINTMENT_REMINDER"
   */
  @ApiProperty({ description: 'Type of notification' })
  @Column()
  type!: string;

  /**
   * Notification title
   * @example "Appointment Reminder"
   */
  @ApiProperty({ description: 'Notification title' })
  @Column()
  title!: string;

  /**
   * Notification body content
   * @example "Your appointment with Dr. Smith is tomorrow at 2:00 PM"
   */
  @ApiProperty({ description: 'Notification body content' })
  @Column({ type: 'text' })
  body!: string;

  /**
   * Channel through which the notification was delivered
   * @example "EMAIL"
   */
  @ApiProperty({ description: 'Delivery channel (EMAIL, PUSH, SMS, IN_APP)' })
  @Column()
  channel!: string;

  /**
   * Notification delivery status
   * @example "DELIVERED"
   */
  @ApiProperty({ description: 'Delivery status (PENDING, DELIVERED, FAILED, READ)' })
  @Column()
  status!: string;

  /**
   * Timestamp of when the notification was created
   */
  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /**
   * Timestamp of when the notification was last updated
   */
  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  /**
   * Optional journey context for styling
   * @example "health"
   */
  @ApiProperty({ 
    description: 'Journey context for styling', 
    enum: ['health', 'care', 'plan', 'gamification'],
    required: false
  })
  @Column({ nullable: true })
  journey?: string;

  /**
   * Optional metadata for additional information
   */
  @ApiProperty({ description: 'Additional metadata', required: false })
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  /**
   * Optional achievement ID for gamification-related notifications
   * @example "daily-steps-goal"
   */
  @ApiProperty({ 
    description: 'Achievement ID for gamification notifications', 
    required: false 
  })
  @Column({ nullable: true, name: 'achievement_id' })
  achievementId?: string;

  /**
   * Optional points awarded in this notification
   * @example 50
   */
  @ApiProperty({ 
    description: 'Points awarded', 
    required: false 
  })
  @Column({ nullable: true })
  points?: number;

  /**
   * Optional badge ID unlocked with this notification
   * @example "fitness-master"
   */
  @ApiProperty({ 
    description: 'Badge ID unlocked', 
    required: false 
  })
  @Column({ nullable: true, name: 'badge_id' })
  badgeId?: string;

  /**
   * Optional level information for level-up notifications
   * @example 5
   */
  @ApiProperty({ 
    description: 'New level achieved', 
    required: false 
  })
  @Column({ nullable: true })
  level?: number;
}