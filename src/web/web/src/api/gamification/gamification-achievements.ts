/**
 * Gamification Achievements API
 *
 * This module provides functions for interacting with the gamification engine
 * of the AUSTA SuperApp. It includes methods for retrieving user game profiles,
 * achievements, quests, rewards, and triggering gamification events.
 */

import axios from 'axios'; // version 1.6.8 with security enhancements

// ─── Interfaces ──────────────────────────────────────────────────────────────

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

export interface GamificationEventResponse {
    achievements?: Achievement[];
    rewards?: Reward[];
}

export interface GamificationEventData {
    [key: string]: unknown;
}

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    displayName: string;
    avatarUrl?: string;
    points: number;
    level: number;
}

export interface RewardRedemption {
    id: string;
    rewardId: string;
    userId: string;
    redeemedAt: string;
    status: 'pending' | 'fulfilled' | 'expired';
    code?: string;
}

export interface StreakStatus {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string;
    streakType: string;
    nextMilestone: number;
}

// ─── API Client ──────────────────────────────────────────────────────────────

/**
 * Base URL for the gamification API endpoints
 * Using a direct string instead of importing from an unavailable module
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.austa.com.br';
export const GAMIFICATION_API_URL = `${API_BASE_URL}/gamification`;

// ─── Functions ───────────────────────────────────────────────────────────────

/**
 * Retrieves the user's game profile from the gamification engine.
 *
 * @param userId - The unique identifier of the user
 * @returns A promise that resolves to the user's game profile
 */
export const getGameProfile = async (userId: string): Promise<GameProfile> => {
    try {
        const response = await axios.get<GameProfile>(`${GAMIFICATION_API_URL}/profiles/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch game profile:', error);
        throw new Error('Failed to retrieve game profile. Please try again later.');
    }
};

/**
 * Retrieves all achievements for a user.
 *
 * @param userId - The unique identifier of the user
 * @returns A promise that resolves to an array of achievements
 */
export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
    try {
        const response = await axios.get<Achievement[]>(`${GAMIFICATION_API_URL}/users/${userId}/achievements`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user achievements:', error);
        throw new Error('Failed to retrieve achievements. Please try again later.');
    }
};

/**
 * Retrieves all active and completed quests for a user.
 *
 * @param userId - The unique identifier of the user
 * @returns A promise that resolves to an array of quests
 */
export const getUserQuests = async (userId: string): Promise<Quest[]> => {
    try {
        const response = await axios.get<Quest[]>(`${GAMIFICATION_API_URL}/users/${userId}/quests`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user quests:', error);
        throw new Error('Failed to retrieve quests. Please try again later.');
    }
};

/**
 * Retrieves all rewards earned by a user.
 *
 * @param userId - The unique identifier of the user
 * @returns A promise that resolves to an array of rewards
 */
export const getUserRewards = async (userId: string): Promise<Reward[]> => {
    try {
        const response = await axios.get<Reward[]>(`${GAMIFICATION_API_URL}/users/${userId}/rewards`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user rewards:', error);
        throw new Error('Failed to retrieve rewards. Please try again later.');
    }
};

/**
 * Retrieves journey-specific achievements for a user.
 *
 * @param userId - The unique identifier of the user
 * @param journey - The journey identifier (health, care, plan)
 * @returns A promise that resolves to an array of journey-specific achievements
 */
export const getJourneyAchievements = async (userId: string, journey: string): Promise<Achievement[]> => {
    try {
        const url = `${GAMIFICATION_API_URL}/users/${userId}` + `/journeys/${journey}/achievements`;
        const response = await axios.get<Achievement[]>(url);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch ${journey} journey achievements:`, error);
        throw new Error(`Failed to retrieve ${journey} journey achievements.` + ' Please try again later.');
    }
};

/**
 * Acknowledges an achievement notification as seen by the user.
 *
 * @param userId - The unique identifier of the user
 * @param achievementId - The unique identifier of the achievement
 * @returns A promise that resolves when the achievement is acknowledged
 */
export const acknowledgeAchievement = async (userId: string, achievementId: string): Promise<void> => {
    try {
        const url = `${GAMIFICATION_API_URL}/users/${userId}` + `/achievements/${achievementId}/acknowledge`;
        await axios.post(url);
    } catch (error) {
        console.error('Failed to acknowledge achievement:', error);
        throw new Error('Failed to acknowledge achievement.' + ' Please try again later.');
    }
};

/**
 * Triggers a gamification event based on user action.
 * This is used to record user actions that may lead to achievements.
 *
 * @param userId - The unique identifier of the user
 * @param eventType - The type of event that occurred
 * @param eventData - Additional data related to the event
 * @returns A promise resolving to any new achievements or rewards
 */
export const triggerGamificationEvent = async (
    userId: string,
    eventType: string,
    eventData: GamificationEventData
): Promise<GamificationEventResponse> => {
    try {
        const response = await axios.post<GamificationEventResponse>(`${GAMIFICATION_API_URL}/events`, {
            userId,
            eventType,
            eventData,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to trigger gamification event:', error);
        throw new Error('Failed to record your activity.' + ' Please try again later.');
    }
};

/**
 * Updates the gamification profile for a given user ID with the provided data.
 *
 * @param userId - The ID of the user whose gamification profile to update
 * @param profileData - The partial gamification profile data to update
 * @returns A promise that resolves with the updated user's gamification profile
 */
export const updateGameProfile = async (userId: string, profileData: Partial<GameProfile>): Promise<GameProfile> => {
    try {
        const response = await axios.patch<GameProfile>(`${GAMIFICATION_API_URL}/profiles/${userId}`, profileData);
        return response.data;
    } catch (error) {
        console.error('Failed to update game profile:', error);
        throw new Error('Failed to update game profile. Please try again later.');
    }
};

/**
 * Retrieves detailed information about a specific achievement.
 *
 * @param achievementId - The unique identifier of the achievement
 * @returns A promise that resolves to the achievement details including criteria and tips
 */
export const getAchievementDetail = async (
    achievementId: string
): Promise<Achievement & { criteria: string[]; tips: string[] }> => {
    try {
        const response = await axios.get<Achievement & { criteria: string[]; tips: string[] }>(
            `${GAMIFICATION_API_URL}/achievements/${achievementId}`
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch achievement detail:', error);
        throw new Error('Failed to retrieve achievement detail. Please try again later.');
    }
};

/**
 * Retrieves detailed information about a specific quest.
 *
 * @param questId - The unique identifier of the quest
 * @returns A promise that resolves to the quest details including steps
 */
export const getQuestDetail = async (
    questId: string
): Promise<Quest & { steps: Array<{ description: string; completed: boolean }> }> => {
    try {
        const response = await axios.get<Quest & { steps: Array<{ description: string; completed: boolean }> }>(
            `${GAMIFICATION_API_URL}/quests/${questId}`
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch quest detail:', error);
        throw new Error('Failed to retrieve quest detail. Please try again later.');
    }
};

/**
 * Retrieves detailed information about a specific reward.
 *
 * @param rewardId - The unique identifier of the reward
 * @returns A promise that resolves to the reward details including terms and redemption instructions
 */
export const getRewardDetail = async (
    rewardId: string
): Promise<Reward & { terms: string; redemptionInstructions: string }> => {
    try {
        const response = await axios.get<Reward & { terms: string; redemptionInstructions: string }>(
            `${GAMIFICATION_API_URL}/rewards/${rewardId}`
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch reward detail:', error);
        throw new Error('Failed to retrieve reward detail. Please try again later.');
    }
};

/**
 * Acknowledges a reward notification as seen by the user.
 *
 * @param userId - The unique identifier of the user
 * @param rewardId - The unique identifier of the reward
 * @returns A promise that resolves when the reward is acknowledged
 */
export const acknowledgeReward = async (userId: string, rewardId: string): Promise<void> => {
    try {
        const url = `${GAMIFICATION_API_URL}/users/${userId}` + `/rewards/${rewardId}/acknowledge`;
        await axios.post(url);
    } catch (error) {
        console.error('Failed to acknowledge reward:', error);
        throw new Error('Failed to acknowledge reward.' + ' Please try again later.');
    }
};

/**
 * Retrieves the progress towards a specific achievement for a user.
 *
 * @param userId - The unique identifier of the user
 * @param achievementId - The unique identifier of the achievement
 * @returns A promise that resolves to the achievement progress information
 */
export const getAchievementProgress = async (
    userId: string,
    achievementId: string
): Promise<{ current: number; target: number; percentage: number }> => {
    try {
        const url = `${GAMIFICATION_API_URL}/users/${userId}` + `/achievements/${achievementId}/progress`;
        const response = await axios.get<{ current: number; target: number; percentage: number }>(url);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch achievement progress:', error);
        throw new Error('Failed to retrieve achievement progress.' + ' Please try again later.');
    }
};
