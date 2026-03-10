import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a notification sent to a user through various channels
 */
export class Notification {
    /**
     * Unique identifier for the notification
     * @example 1
     */
    @ApiProperty({ description: 'Unique notification ID' })
    id!: number;

    /**
     * ID of the user the notification was sent to
     * @example "550e8400-e29b-41d4-a716-446655440000"
     */
    @ApiProperty({ description: 'User ID the notification was sent to' })
    userId!: string;

    /**
     * Type of notification
     * @example "APPOINTMENT_REMINDER"
     */
    @ApiProperty({ description: 'Type of notification' })
    type!: string;

    /**
     * Notification title
     * @example "Appointment Reminder"
     */
    @ApiProperty({ description: 'Notification title' })
    title!: string;

    /**
     * Notification body content
     * @example "Your appointment with Dr. Smith is tomorrow at 2:00 PM"
     */
    @ApiProperty({ description: 'Notification body content' })
    body!: string;

    /**
     * Channel through which the notification was delivered
     * @example "EMAIL"
     */
    @ApiProperty({ description: 'Delivery channel (EMAIL, PUSH, SMS, IN_APP)' })
    channel!: string;

    /**
     * Notification delivery status
     * @example "DELIVERED"
     */
    @ApiProperty({ description: 'Delivery status (PENDING, DELIVERED, FAILED, READ)' })
    status!: string;

    /**
     * Timestamp of when the notification was created
     */
    @ApiProperty({ description: 'Creation timestamp' })
    createdAt!: Date;

    /**
     * Timestamp of when the notification was last updated
     */
    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt!: Date;

    /**
     * Optional journey context for styling
     * @example "health"
     */
    @ApiProperty({
        description: 'Journey context for styling',
        enum: ['health', 'care', 'plan', 'gamification'],
        required: false,
    })
    journey?: string;

    /**
     * Optional metadata for additional information
     */
    @ApiProperty({ description: 'Additional metadata', required: false })
    metadata?: Record<string, unknown>;

    /**
     * Optional achievement ID for gamification-related notifications
     * @example "daily-steps-goal"
     */
    @ApiProperty({
        description: 'Achievement ID for gamification notifications',
        required: false,
    })
    achievementId?: string;

    /**
     * Optional points awarded in this notification
     * @example 50
     */
    @ApiProperty({
        description: 'Points awarded',
        required: false,
    })
    points?: number;

    /**
     * Optional badge ID unlocked with this notification
     * @example "fitness-master"
     */
    @ApiProperty({
        description: 'Badge ID unlocked',
        required: false,
    })
    badgeId?: string;

    /**
     * Optional level information for level-up notifications
     * @example 5
     */
    @ApiProperty({
        description: 'New level achieved',
        required: false,
    })
    level?: number;
}
