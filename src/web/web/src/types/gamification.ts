/**
 * Gamification Types
 *
 * This module defines TypeScript interfaces for the gamification system entities,
 * including GameProfile, Achievement, Quest, and Reward.
 */

/**
 * User's game profile containing level, XP, and other gamification data
 */
export interface GameProfile {
    id: string;
    userId: string;
    level: number;
    xp: number;
    totalAchievements: number;
    completedQuests: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Achievement representation in the gamification system
 */
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    journey?: string;
    xpReward: number;
    unlockedAt?: string;
    progress?: number;
    isUnlocked: boolean;
}

/**
 * Quest representation in the gamification system
 */
export interface Quest {
    id: string;
    title: string;
    description: string;
    icon: string;
    journey?: string;
    xpReward: number;
    progress: number;
    completed: boolean;
    expiresAt?: string;
}

/**
 * Reward representation in the gamification system
 */
export interface Reward {
    id: string;
    title: string;
    description: string;
    icon: string;
    journey?: string;
    earnedAt?: string;
    redeemedAt?: string;
    isRedeemed: boolean;
    expiresAt?: string;
}

/**
 * Event data for gamification events
 */
export interface GamificationEvent {
    userId: string;
    type: string;
    journey?: string;
    data: Record<string, any>;
    timestamp?: string;
}
