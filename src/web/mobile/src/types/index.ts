/**
 * Index file that exports all shared types for use in the mobile application.
 * This provides a centralized location for importing types across the
 * Health, Care, and Plan journeys as well as authentication, gamification,
 * and notification systems.
 */

// Authentication types
export type { AuthSession, AuthState } from '@shared/types/auth.types';

// Health journey types
export type { HealthMetric, MedicalEvent, HealthGoal, DeviceConnection } from '@shared/types/health.types';
export { HealthMetricType } from '@shared/types/health.types';

// Care journey types
export type { Appointment, Medication, TelemedicineSession, TreatmentPlan } from '@shared/types/care.types';

// Plan journey types
export type {
  ClaimStatus, 
  ClaimType, 
  PlanType, 
  CoverageType,
  Claim, 
  Plan, 
  Coverage, 
  Benefit
} from '@shared/types/plan.types';

// Gamification types
export type { Achievement, Quest, Reward, GameProfile } from '@shared/types/gamification.types';

// Notification types
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
  ClaimStatusUpdateData
} from '@shared/types/notification.types';

export {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  NotificationPriority
} from '@shared/types/notification.types';