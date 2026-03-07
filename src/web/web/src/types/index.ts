/**
 * Type definitions index for AUSTA SuperApp web application
 *
 * This file aggregates and re-exports all shared TypeScript types used
 * throughout the application. By providing a single import point, it improves
 * code organization and reduces import complexity for components and services.
 *
 * The types are organized by journey (Health, Care, Plan) and cross-cutting
 * concerns (Authentication, Gamification, Notifications).
 */

// Authentication types
export type { AuthSession, AuthState } from 'shared/types/auth.types';

// Health Journey types
export { HealthMetricType } from 'shared/types/health.types';

export type { HealthMetric, MedicalEvent, HealthGoal, DeviceConnection } from 'shared/types/health.types';

// Care Journey types
export type { Appointment, Medication, TelemedicineSession, TreatmentPlan } from 'shared/types/care.types';

// Plan Journey types
export type {
    ClaimStatus,
    ClaimType,
    PlanType,
    CoverageType,
    Claim,
    Plan,
    Coverage,
    Benefit,
} from 'shared/types/plan.types';

// Gamification types
export type { Achievement, Quest, Reward, GameProfile } from 'shared/types/gamification.types';

// Notification types
export {
    NotificationType,
    NotificationChannel,
    NotificationStatus,
    NotificationPriority,
} from 'shared/types/notification.types';

export type {
    Notification,
    NotificationPreference,
    JourneyNotificationPreference,
    SendNotificationRequest,
    NotificationTemplate,
    NotificationFilter,
    NotificationCount,
    AchievementNotificationData,
    LevelUpNotificationData,
    AppointmentReminderData,
    ClaimStatusUpdateData,
} from 'shared/types/notification.types';
