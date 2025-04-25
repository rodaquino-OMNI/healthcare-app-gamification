import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm'; // typeorm v0.3.0+

/**
 * Entity representing a user's notification preferences.
 * This stores the user's choices for receiving notifications across different channels.
 * Used by the notification service to determine how to deliver notifications to users.
 */
@Entity()
export class NotificationPreference {
  /**
   * Unique identifier for the notification preference record
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The user ID associated with these notification preferences
   * References the user in the authentication system
   */
  @Column()
  userId: string;

  /**
   * Whether push notifications are enabled for this user
   * Default is true as push notifications are a primary notification channel
   */
  @Column({ default: true })
  pushEnabled: boolean;

  /**
   * Whether email notifications are enabled for this user
   * Default is true for important communications
   */
  @Column({ default: true })
  emailEnabled: boolean;

  /**
   * Whether SMS notifications are enabled for this user
   * Default is false due to potential costs associated with SMS
   */
  @Column({ default: false })
  smsEnabled: boolean;

  /**
   * Timestamp when the preference record was created
   * Automatically set by TypeORM
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp when the preference record was last updated
   * Automatically updated by TypeORM
   */
  @UpdateDateColumn()
  updatedAt: Date;
}