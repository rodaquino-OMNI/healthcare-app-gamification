/**
 * Central export file for all shared types in the AUSTA SuperApp
 * 
 * This file collects and re-exports all type definitions from across the 
 * application's shared types, providing a single point of import for 
 * components and services that need these types.
 */

// Authentication types
export type { AuthSession, AuthState } from './auth.types';

// Health Journey types
export { HealthMetricType } from './health.types';
export type { HealthMetric, MedicalEvent, HealthGoal, DeviceConnection } from './health.types';

// Care Journey types
export type { 
  Appointment, 
  Medication, 
  TelemedicineSession, 
  TreatmentPlan 
} from './care.types';

// Plan Journey types
export type { 
  ClaimStatus, 
  ClaimType, 
  PlanType, 
  CoverageType, 
  Claim, 
  Plan, 
  Coverage, 
  Benefit 
} from './plan.types';

// Gamification types
export type { 
  Achievement, 
  Quest, 
  Reward, 
  GameProfile 
} from './gamification.types';

// Notification types
export { 
  NotificationType, 
  NotificationChannel, 
  NotificationStatus, 
  NotificationPriority 
} from './notification.types';

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
} from './notification.types';