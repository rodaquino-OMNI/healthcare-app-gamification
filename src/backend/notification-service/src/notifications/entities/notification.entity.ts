import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'; // typeorm v0.3.0+

/**
 * Notification entity - represents a notification record stored in the database
 * 
 * Stores information about notifications sent to users including:
 * - The recipient user ID
 * - Notification type and content
 * - Delivery channel and status
 * - Timestamps for creation and updates
 */
@Entity()
export class Notification {
  /**
   * Unique identifier for the notification
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * ID of the user who will receive this notification
   */
  @Column()
  userId: string;

  /**
   * Type of notification (e.g., 'achievement', 'appointment-reminder', 'claim-status')
   */
  @Column()
  type: string;

  /**
   * Notification title/headline
   */
  @Column()
  title: string;

  /**
   * Notification body content
   */
  @Column('text')
  body: string;

  /**
   * Delivery channel (e.g., 'push', 'email', 'sms', 'in-app')
   */
  @Column()
  channel: string;

  /**
   * Current status of the notification (e.g., 'pending', 'sent', 'delivered', 'failed')
   */
  @Column()
  status: string;

  /**
   * Timestamp when the notification was created
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp when the notification was last updated
   */
  @UpdateDateColumn()
  updatedAt: Date;
}