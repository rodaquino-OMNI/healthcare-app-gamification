/**
 * Defines the structure for an achievement in the gamification system.
 * Achievements represent milestones that users can unlock by performing
 * specific actions or reaching certain thresholds.
 */
export interface Achievement {
  /** Unique identifier for the achievement */
  id: string;
  /** Display title of the achievement */
  title: string;
  /** Detailed description of what the achievement represents */
  description: string;
  /** Which journey this achievement belongs to (health, care, plan) */
  journey: string;
  /** Icon identifier for visual representation */
  icon: string;
  /** Current progress toward unlocking the achievement */
  progress: number;
  /** Total progress needed to unlock the achievement */
  total: number;
  /** Whether the achievement has been unlocked */
  unlocked: boolean;
}

/**
 * Defines the structure for a quest in the gamification system.
 * Quests are time-limited challenges that users can complete to
 * earn rewards and progress in the system.
 */
export interface Quest {
  /** Unique identifier for the quest */
  id: string;
  /** Display title of the quest */
  title: string;
  /** Detailed description of what the quest involves */
  description: string;
  /** Which journey this quest belongs to (health, care, plan) */
  journey: string;
  /** Icon identifier for visual representation */
  icon: string;
  /** Current progress toward completing the quest */
  progress: number;
  /** Total progress needed to complete the quest */
  total: number;
  /** Whether the quest has been completed */
  completed: boolean;
}

/**
 * Defines the structure for a reward in the gamification system.
 * Rewards are granted to users for completing quests, unlocking
 * achievements, or reaching certain milestones.
 */
export interface Reward {
  /** Unique identifier for the reward */
  id: string;
  /** Display title of the reward */
  title: string;
  /** Detailed description of what the reward provides */
  description: string;
  /** Which journey this reward is associated with */
  journey: string;
  /** Icon identifier for visual representation */
  icon: string;
  /** Experience points value of the reward */
  xp: number;
}

/**
 * Defines the structure for a user's game profile in the gamification system.
 * The game profile tracks the user's progress, level, and engagement
 * across the platform.
 */
export interface GameProfile {
  /** User's current level in the gamification system */
  level: number;
  /** User's current experience points */
  xp: number;
  /** Collection of the user's achievements (both locked and unlocked) */
  achievements: Achievement[];
  /** Collection of the user's quests (both active and completed) */
  quests: Quest[];
}