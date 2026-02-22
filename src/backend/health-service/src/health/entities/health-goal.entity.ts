/**
 * Health goal entity definition for the AUSTA SuperApp.
 * Represents a specific health objective set by a user that can be tracked over time.
 * This enables the F-101-RQ-005 requirement to allow users to set and track health-related goals
 * and contributes to F-301-RQ-003 for tracking user progress toward achievements.
 */

/**
 * Enumeration of possible health goal types.
 */
export enum GoalType {
  STEPS = 'steps',
  SLEEP = 'sleep',
  WATER = 'water',
  WEIGHT = 'weight',
  EXERCISE = 'exercise',
  HEART_RATE = 'heart_rate',
  BLOOD_PRESSURE = 'blood_pressure',
  BLOOD_GLUCOSE = 'blood_glucose',
  CUSTOM = 'custom'
}

/**
 * Enumeration of possible health goal statuses.
 */
export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

/**
 * Enumeration of possible health goal periods.
 */
export enum GoalPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

/**
 * Represents a health goal set by a user.
 */
export class HealthGoal {
  /**
   * Unique identifier for the health goal.
   */
  id: string;

  /**
   * Reference to the health record this goal belongs to.
   */
  recordId: string;

  /**
   * Type of health goal (e.g., steps, sleep, weight).
   */
  type: GoalType;

  /**
   * Title or name of the goal.
   */
  title: string;

  /**
   * Optional description of the goal.
   */
  description: string;

  /**
   * Target value to achieve for this goal.
   */
  targetValue: number;

  /**
   * Unit of measurement for the goal (e.g., steps, hours, kg).
   */
  unit: string;

  /**
   * Current progress value toward the goal.
   */
  currentValue: number = 0;

  /**
   * Current status of the goal (active, completed, abandoned).
   */
  status: GoalStatus = GoalStatus.ACTIVE;

  /**
   * Period for the goal (daily, weekly, monthly, custom).
   */
  period: GoalPeriod;

  /**
   * Date when the goal was started or became active.
   */
  startDate: Date;

  /**
   * Optional target end date for the goal.
   */
  endDate: Date;

  /**
   * Date when the goal was completed, if applicable.
   */
  completedDate: Date;

  /**
   * Date when the goal was created in the system.
   */
  createdAt: Date;

  /**
   * Date when the goal was last updated.
   */
  updatedAt: Date;
}
