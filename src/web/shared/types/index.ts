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
export type {
    HealthMetric,
    MedicalEvent,
    HealthGoal,
    HealthGoalStatus,
    DeviceConnection,
    DeviceConnectionStatus,
} from './health.types';

// Care Journey types
export type {
    Appointment,
    AppointmentType,
    AppointmentStatus,
    Medication,
    TelemedicineSession,
    TelemedicineSessionStatus,
    TreatmentPlan,
    TreatmentPlanStatus,
    SymptomRegionDetail,
    SymptomCondition,
    Provider,
} from './care.types';

// Plan Journey types
export type { ClaimStatus, ClaimType, PlanType, CoverageType, Claim, Plan, Coverage, Benefit } from './plan.types';

// Gamification types
export type { GamificationJourney, Achievement, Quest, Reward, GameProfile } from './gamification.types';

// Notification types
export { NotificationType, NotificationChannel, NotificationStatus, NotificationPriority } from './notification.types';

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
} from './notification.types';

// Wellness Journey types
export type {
    MoodLevel,
    GoalCategory,
    GoalStatus,
    BreathingExerciseType,
    MeditationSessionStatus,
    ChallengeCategory,
    ChallengeStatus,
    MoodEntry,
    WellnessTip,
    BreathingExercise,
    MeditationSession,
    DailyPlan,
    DailyPlanActivity,
    WellnessGoal,
    JournalEntry,
    WellnessChallenge,
    WellnessStreak,
    WellnessInsights,
    QuickReplyOption,
    CompanionChatMessage,
} from './wellness.types';

// Journey types
export type { JourneyId } from '../constants/journeys';

// Journey as an object type (element of ALL_JOURNEYS array)
import type { ALL_JOURNEYS } from '../constants/journeys';
export type Journey = (typeof ALL_JOURNEYS)[number];

/**
 * Props for the confirmation modal used across journeys.
 */
export interface AustaConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    visible?: boolean;
    journey?: string;
    confirmText?: string;
    cancelText?: string;
}
