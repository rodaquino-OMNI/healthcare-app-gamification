/**
 * Notification-related type definitions for the AUSTA SuperApp
 *
 * This file contains TypeScript enums, interfaces, and validation schemas for
 * notification data used throughout the application, ensuring type safety and
 * consistency across frontend and backend implementations.
 */

import { z } from 'zod'; // v3.22.4

/**
 * Types of notifications that can be sent to users
 * Aligned with gamification and journey event triggers
 */
export enum NotificationType {
    ACHIEVEMENT = 'ACHIEVEMENT',
    LEVEL_UP = 'LEVEL_UP',
    APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
    CLAIM_STATUS = 'CLAIM_STATUS',
    HEALTH_TIP = 'HEALTH_TIP',
    QUEST_AVAILABLE = 'QUEST_AVAILABLE',
    REWARD_AVAILABLE = 'REWARD_AVAILABLE',
    SYSTEM = 'SYSTEM',
}

/**
 * Channels through which notifications can be delivered
 */
export enum NotificationChannel {
    PUSH = 'PUSH',
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    IN_APP = 'IN_APP',
}

/**
 * Status of a notification in a user's notification feed
 */
export enum NotificationStatus {
    UNREAD = 'UNREAD',
    READ = 'READ',
    ARCHIVED = 'ARCHIVED',
    DELETED = 'DELETED',
}

/**
 * Priority levels for notification delivery and display ordering
 */
export enum NotificationPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

/**
 * Represents a notification delivered to a user
 * Used for notification display and management across journeys
 */
export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    channel: NotificationChannel;
    status: NotificationStatus;
    priority: NotificationPriority;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    journeyId?: string;
    createdAt: string;
    readAt?: string;
}

/**
 * Represents a user's notification preferences for a specific channel
 * Used for notification settings management
 */
export interface NotificationPreference {
    userId: string;
    channel: NotificationChannel;
    enabled: boolean;
    journeyPreferences: JourneyNotificationPreference[];
}

/**
 * Represents notification preferences scoped to a specific journey
 * Used for granular notification control per journey
 */
export interface JourneyNotificationPreference {
    journeyId: string;
    enabled: boolean;
    channels: NotificationChannel[];
}

/**
 * Request payload for sending a notification
 * Used by backend services to dispatch notifications
 */
export interface SendNotificationRequest {
    userId: string;
    type: NotificationType;
    channel: NotificationChannel;
    priority: NotificationPriority;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    journeyId?: string;
}

/**
 * Represents a notification template for consistent messaging
 * Used for templated notification content generation
 */
export interface NotificationTemplate {
    id: string;
    type: NotificationType;
    channel: NotificationChannel;
    titleTemplate: string;
    bodyTemplate: string;
}

/**
 * Filter criteria for querying notifications
 * Used for notification listing and search
 */
export interface NotificationFilter {
    userId?: string;
    type?: NotificationType;
    channel?: NotificationChannel;
    status?: NotificationStatus;
    journeyId?: string;
    startDate?: string;
    endDate?: string;
}

/**
 * Aggregated notification counts for badge display
 * Used for notification badge rendering in the UI
 */
export interface NotificationCount {
    total: number;
    unread: number;
    byType: Record<string, number>;
}

/**
 * Data payload for achievement-related notifications
 * Used when a user earns an achievement in the gamification system
 */
export interface AchievementNotificationData {
    achievementId: string;
    achievementName: string;
    xpEarned: number;
}

/**
 * Data payload for level-up notifications
 * Used when a user advances to a new gamification level
 */
export interface LevelUpNotificationData {
    newLevel: number;
    previousLevel: number;
    rewards?: string[];
}

/**
 * Data payload for appointment reminder notifications
 * Used to remind users of upcoming appointments
 */
export interface AppointmentReminderData {
    appointmentId: string;
    providerName: string;
    dateTime: string;
}

/**
 * Data payload for claim status update notifications
 * Used when an insurance claim changes status
 */
export interface ClaimStatusUpdateData {
    claimId: string;
    previousStatus: string;
    newStatus: string;
}

/**
 * Zod schema for validating notification data
 * Ensures data consistency for notification delivery
 */
export const notificationSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    type: z.nativeEnum(NotificationType),
    channel: z.nativeEnum(NotificationChannel),
    status: z.nativeEnum(NotificationStatus),
    priority: z.nativeEnum(NotificationPriority),
    title: z.string(),
    body: z.string(),
    data: z.record(z.unknown()).optional(),
    journeyId: z.string().optional(),
    createdAt: z.string().datetime(),
    readAt: z.string().datetime().optional(),
});

/**
 * Zod schema for validating notification preference data
 * Ensures data consistency for notification settings
 */
export const notificationPreferenceSchema = z.object({
    userId: z.string().uuid(),
    channel: z.nativeEnum(NotificationChannel),
    enabled: z.boolean(),
    journeyPreferences: z.array(
        z.object({
            journeyId: z.string(),
            enabled: z.boolean(),
            channels: z.array(z.nativeEnum(NotificationChannel)),
        })
    ),
});

/**
 * Zod schema for validating send notification request data
 * Ensures data consistency for notification dispatch
 */
export const sendNotificationRequestSchema = z.object({
    userId: z.string().uuid(),
    type: z.nativeEnum(NotificationType),
    channel: z.nativeEnum(NotificationChannel),
    priority: z.nativeEnum(NotificationPriority),
    title: z.string(),
    body: z.string(),
    data: z.record(z.unknown()).optional(),
    journeyId: z.string().optional(),
});

/**
 * Zod schema for validating notification template data
 * Ensures data consistency for template management
 */
export const notificationTemplateSchema = z.object({
    id: z.string().uuid(),
    type: z.nativeEnum(NotificationType),
    channel: z.nativeEnum(NotificationChannel),
    titleTemplate: z.string(),
    bodyTemplate: z.string(),
});

/**
 * Zod schema for validating notification filter data
 * Ensures data consistency for notification queries
 */
export const notificationFilterSchema = z.object({
    userId: z.string().uuid().optional(),
    type: z.nativeEnum(NotificationType).optional(),
    channel: z.nativeEnum(NotificationChannel).optional(),
    status: z.nativeEnum(NotificationStatus).optional(),
    journeyId: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});

/**
 * Zod schema for validating notification count data
 * Ensures data consistency for badge display
 */
export const notificationCountSchema = z.object({
    total: z.number(),
    unread: z.number(),
    byType: z.record(z.number()),
});

/**
 * Zod schema for validating achievement notification data
 * Ensures data consistency for achievement event payloads
 */
export const achievementNotificationDataSchema = z.object({
    achievementId: z.string().uuid(),
    achievementName: z.string(),
    xpEarned: z.number(),
});

/**
 * Zod schema for validating level-up notification data
 * Ensures data consistency for level-up event payloads
 */
export const levelUpNotificationDataSchema = z.object({
    newLevel: z.number(),
    previousLevel: z.number(),
    rewards: z.array(z.string()).optional(),
});

/**
 * Zod schema for validating appointment reminder data
 * Ensures data consistency for appointment reminder payloads
 */
export const appointmentReminderDataSchema = z.object({
    appointmentId: z.string().uuid(),
    providerName: z.string(),
    dateTime: z.string().datetime(),
});

/**
 * Zod schema for validating claim status update data
 * Ensures data consistency for claim status event payloads
 */
export const claimStatusUpdateDataSchema = z.object({
    claimId: z.string().uuid(),
    previousStatus: z.string(),
    newStatus: z.string(),
});
