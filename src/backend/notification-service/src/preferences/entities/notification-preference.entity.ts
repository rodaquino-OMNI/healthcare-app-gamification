import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity representing a user's notification preferences
 */
@Entity('notification_preferences')
export class NotificationPreference {
  /**
   * Unique identifier for the preference record
   * @example 1
   */
  @ApiProperty({ description: 'Unique preference record ID' })
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * ID of the user this preference belongs to
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty({ description: 'User ID these preferences belong to' })
  @Column({ name: 'user_id' })
  userId!: string;

  /**
   * Whether push notifications are enabled for this user
   * @example true
   */
  @ApiProperty({ description: 'Push notifications enabled flag' })
  @Column({ name: 'push_enabled', default: true })
  pushEnabled!: boolean;

  /**
   * Whether email notifications are enabled for this user
   * @example true
   */
  @ApiProperty({ description: 'Email notifications enabled flag' })
  @Column({ name: 'email_enabled', default: true })
  emailEnabled!: boolean;

  /**
   * Whether SMS notifications are enabled for this user
   * @example false
   */
  @ApiProperty({ description: 'SMS notifications enabled flag' })
  @Column({ name: 'sms_enabled', default: false })
  smsEnabled!: boolean;

  /**
   * Timestamp of when the preference record was created
   */
  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /**
   * Timestamp of when the preference record was last updated
   */
  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  /**
   * Detailed notification type preferences (stored as JSON)
   * Example: { "APPOINTMENT_REMINDER": { "push": true, "email": true, "sms": false } }
   */
  @ApiProperty({ 
    description: 'Detailed notification type preferences', 
    example: { "APPOINTMENT_REMINDER": { "push": true, "email": true, "sms": false } },
    required: false
  })
  @Column({ type: 'json', nullable: true })
  typePreferences?: Record<string, any>;

  /**
   * Journey-specific notification preferences (stored as JSON)
   * Example: { "health": { "push": true, "email": true }, "care": { "push": true, "sms": true } }
   */
  @ApiProperty({
    description: 'Journey-specific notification preferences',
    example: { "health": { "push": true, "email": true }, "care": { "push": true, "sms": true } },
    required: false
  })
  @Column({ type: 'json', nullable: true, name: 'journey_preferences' })
  journeyPreferences?: Record<string, any>;
}