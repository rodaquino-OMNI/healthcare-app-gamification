/**
 * Literal union for journey identifiers used in the gamification system.
 * Aligned with DS component interfaces (QuestCard, RewardCard, LevelIndicator).
 */
export type GamificationJourney = 'health' | 'care' | 'plan';

/**
 * Defines the structure for an achievement in the gamification system.
 * Achievements represent milestones that users can unlock by performing
 * specific actions or reaching certain thresholds.
 *
 * This is the canonical superset type: it includes fields used by the UI
 * (title, icon, total, unlocked, journey) as well as fields returned by the
 * REST API (name, iconUrl, category, target, unlockedAt).
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
    /** API name field (maps to title in UI contexts) */
    name?: string;
    /** API icon URL for remote images */
    iconUrl?: string;
    /** API category grouping */
    category?: string;
    /** API target value (maps to total in UI contexts) */
    target?: number;
    /** ISO timestamp when the achievement was unlocked */
    unlockedAt?: string;
}

/**
 * Defines the structure for a quest in the gamification system.
 * Quests are time-limited challenges that users can complete to
 * earn rewards and progress in the system.
 *
 * This is the canonical superset type: it includes fields used by the UI
 * (title, icon, journey, total, completed) as well as fields returned by
 * the REST API (name, type, status, reward, target, expiresAt).
 */
export interface Quest {
    /** Unique identifier for the quest */
    id: string;
    /** Display title of the quest */
    title: string;
    /** Detailed description of what the quest involves */
    description: string;
    /** Which journey this quest belongs to (health, care, plan) */
    journey: GamificationJourney;
    /** Icon identifier for visual representation */
    icon: string;
    /** Current progress toward completing the quest */
    progress: number;
    /** Total progress needed to complete the quest */
    total: number;
    /** Whether the quest has been completed */
    completed: boolean;
    /** API name field (maps to title in UI contexts) */
    name?: string;
    /** API quest type */
    type?: 'daily' | 'weekly' | 'special';
    /** API quest status */
    status?: 'active' | 'completed' | 'expired';
    /** API reward information */
    reward?: { type: string; amount: number };
    /** API target value (maps to total in UI contexts) */
    target?: number;
    /** ISO timestamp when the quest expires */
    expiresAt?: string;
}

/**
 * Defines the structure for a reward in the gamification system.
 * Rewards are granted to users for completing quests, unlocking
 * achievements, or reaching certain milestones.
 *
 * This is the canonical superset type: it includes fields used by the UI
 * (title, icon, journey, xp) as well as fields returned by the REST API
 * (name, cost, category, imageUrl, available, redeemedAt).
 */
export interface Reward {
    /** Unique identifier for the reward */
    id: string;
    /** Display title of the reward */
    title: string;
    /** Detailed description of what the reward provides */
    description: string;
    /** Which journey this reward is associated with */
    journey: GamificationJourney;
    /** Icon identifier for visual representation */
    icon: string;
    /** Experience points value of the reward */
    xp: number;
    /** API name field (maps to title in UI contexts) */
    name?: string;
    /** API cost to redeem */
    cost?: number;
    /** API category grouping */
    category?: string;
    /** API image URL for remote images */
    imageUrl?: string;
    /** Whether the reward is currently available */
    available?: boolean;
    /** ISO timestamp when the reward was redeemed */
    redeemedAt?: string;
}

/**
 * Defines the structure for a user's game profile in the gamification system.
 * The game profile tracks the user's progress, level, and engagement
 * across the platform.
 *
 * This is the canonical superset type: it includes fields used by the UI
 * (level, xp, achievements, quests) as well as fields returned by the
 * REST API (userId, points, badges, streak, rank).
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
    /** API user identifier */
    userId?: string;
    /** API points (maps to xp in UI contexts) */
    points?: number;
    /** API badge identifiers */
    badges?: string[];
    /** API current streak count */
    streak?: number;
    /** API leaderboard rank */
    rank?: number;
}
