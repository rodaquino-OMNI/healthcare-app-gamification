/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity representing a user's notification preferences
 */
export class NotificationPreference {
    /**
     * Unique identifier for the preference record
     * @example 1
     */
    @ApiProperty({ description: 'Unique preference record ID' })
    id!: number;

    /**
     * ID of the user this preference belongs to
     * @example "550e8400-e29b-41d4-a716-446655440000"
     */
    @ApiProperty({ description: 'User ID these preferences belong to' })
    userId!: string;

    /**
     * Whether push notifications are enabled for this user
     * @example true
     */
    @ApiProperty({ description: 'Push notifications enabled flag' })
    pushEnabled!: boolean;

    /**
     * Whether email notifications are enabled for this user
     * @example true
     */
    @ApiProperty({ description: 'Email notifications enabled flag' })
    emailEnabled!: boolean;

    /**
     * Whether SMS notifications are enabled for this user
     * @example false
     */
    @ApiProperty({ description: 'SMS notifications enabled flag' })
    smsEnabled!: boolean;

    /**
     * Timestamp of when the preference record was created
     */
    @ApiProperty({ description: 'Creation timestamp' })
    createdAt!: Date;

    /**
     * Timestamp of when the preference record was last updated
     */
    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt!: Date;

    /**
     * Detailed notification type preferences (stored as JSON)
     * Example: { "APPOINTMENT_REMINDER": { "push": true, "email": true, "sms": false } }
     */
    @ApiProperty({
        description: 'Detailed notification type preferences',
        example: { APPOINTMENT_REMINDER: { push: true, email: true, sms: false } },
        required: false,
    })
    typePreferences?: Record<string, unknown>;

    /**
     * Journey-specific notification preferences (stored as JSON)
     * Example: { "health": { "push": true, "email": true }, "care": { "push": true, "sms": true } }
     */
    @ApiProperty({
        description: 'Journey-specific notification preferences',
        example: { health: { push: true, email: true }, care: { push: true, sms: true } },
        required: false,
    })
    journeyPreferences?: Record<string, unknown>;
}
