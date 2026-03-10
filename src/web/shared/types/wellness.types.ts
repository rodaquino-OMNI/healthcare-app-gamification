/**
 * Wellness-related type definitions for the AUSTA SuperApp
 *
 * This file contains TypeScript interfaces and type definitions for wellness data
 * used throughout the application, ensuring type safety and consistency across
 * frontend and backend implementations of the Wellness Journey (Module 06).
 */

/**
 * Mood level on a 1-5 scale used for mood check-ins.
 */
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Category for wellness goals.
 */
export type GoalCategory = 'fitness' | 'nutrition' | 'sleep' | 'mindfulness';

/**
 * Status of a wellness goal.
 */
export type GoalStatus = 'active' | 'paused' | 'completed' | 'abandoned';

/**
 * Type of breathing exercise.
 */
export type BreathingExerciseType = 'box' | '4-7-8' | 'diaphragmatic' | 'alternate-nostril';

/**
 * Status of a meditation session.
 */
export type MeditationSessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'skipped';

/**
 * Category of a wellness challenge.
 */
export type ChallengeCategory = 'fitness' | 'nutrition' | 'sleep' | 'mindfulness' | 'social';

/**
 * Status of a wellness challenge.
 */
export type ChallengeStatus = 'available' | 'active' | 'completed' | 'expired';

/**
 * Represents a mood check-in entry logged by the user.
 */
export interface MoodEntry {
  id: string;
  userId: string;
  value: MoodLevel;
  emoji: string;
  note?: string;
  date: string;
  createdAt: string;
}

/**
 * Represents a wellness tip displayed to the user.
 */
export interface WellnessTip {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: GoalCategory;
  icon: string;
  readTime?: number;
  sourceUrl?: string;
}

/**
 * Represents a breathing exercise configuration.
 */
export interface BreathingExercise {
  id: string;
  type: BreathingExerciseType;
  titleKey: string;
  descriptionKey: string;
  inhaleSeconds: number;
  holdSeconds: number;
  exhaleSeconds: number;
  cycles: number;
  durationMinutes: number;
}

/**
 * Represents a meditation session.
 */
export interface MeditationSession {
  id: string;
  userId: string;
  titleKey: string;
  category: string;
  durationMinutes: number;
  status: MeditationSessionStatus;
  scheduledAt?: string;
  completedAt?: string;
  guidedAudioUrl?: string;
}

/**
 * Represents a daily wellness plan generated for the user.
 */
export interface DailyPlan {
  id: string;
  userId: string;
  date: string;
  activities: DailyPlanActivity[];
  completedCount: number;
  totalCount: number;
}

/**
 * Represents a single activity within a daily plan.
 */
export interface DailyPlanActivity {
  id: string;
  titleKey: string;
  category: GoalCategory;
  icon: string;
  completed: boolean;
  scheduledTime?: string;
  durationMinutes?: number;
}

/**
 * Represents a wellness goal set by the user.
 */
export interface WellnessGoal {
  id: string;
  userId: string;
  titleKey: string;
  category: GoalCategory;
  target: number;
  progress: number;
  unit?: string;
  status: GoalStatus;
  icon: string;
  startDate: string;
  endDate?: string;
}

/**
 * Represents a journal entry written by the user.
 */
export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood?: MoodLevel;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

/**
 * Represents a wellness challenge the user can participate in.
 */
export interface WellnessChallenge {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: ChallengeCategory;
  status: ChallengeStatus;
  durationDays: number;
  currentDay?: number;
  participantCount: number;
  xpReward: number;
  icon: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Represents a user's streak data for consistent wellness activities.
 */
export interface WellnessStreak {
  id: string;
  userId: string;
  type: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  milestones: number[];
}

/**
 * Represents aggregated wellness insights for the user.
 */
export interface WellnessInsights {
  userId: string;
  period: 'day' | 'week' | 'month';
  moodAverage: number;
  goalsCompleted: number;
  totalGoals: number;
  streakDays: number;
  meditationMinutes: number;
  journalEntries: number;
  topCategory: GoalCategory;
}

/**
 * Represents quick reply options in the wellness companion chat.
 */
export interface QuickReplyOption {
  id: string;
  labelKey: string;
  action: string;
  icon?: string;
}

/**
 * Represents a chat message in the wellness companion.
 */
export interface CompanionChatMessage {
  id: string;
  role: 'user' | 'companion';
  content: string;
  timestamp: string;
  quickReplies?: QuickReplyOption[];
}
