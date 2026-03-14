/**
 * Gamification API
 *
 * This module provides functions for interacting with the gamification engine
 * of the AUSTA SuperApp. It includes methods for retrieving user game profiles,
 * achievements, quests, and rewards.
 */

import axios from 'axios'; // version 1.6.8 with security enhancements

// Define interfaces directly in this file until TypeScript can find
// the proper module
interface GameProfile {
    id: string;
    userId: string;
    level: number;
    xp: number;
    totalAchievements: number;
    completedQuests: number;
    createdAt: string;
    updatedAt: string;
}

interface Achievement {
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

interface Quest {
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

interface Reward {
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

interface GamificationEventResponse {
    achievements?: Achievement[];
    rewards?: Reward[];
}

interface GamificationEventData {
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

/**
 * Base URL for the gamification API endpoints
 * Using a direct string instead of importing from an unavailable module
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.austa.com.br';
const GAMIFICATION_API_URL = `${API_BASE_URL}/gamification`;

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
 * Fetches the leaderboard, optionally filtered by time period.
 *
 * @param period - Optional time period filter
 * @returns A promise that resolves with leaderboard entries
 */
export const getLeaderboard = async (
    period?: 'daily' | 'weekly' | 'monthly' | 'allTime'
): Promise<LeaderboardEntry[]> => {
    try {
        const response = await axios.get<LeaderboardEntry[]>(`${GAMIFICATION_API_URL}/leaderboard`, {
            params: { period },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        throw new Error('Failed to retrieve leaderboard. Please try again later.');
    }
};

/**
 * Updates progress on a specific quest for a user.
 *
 * @param userId - The ID of the user
 * @param questId - The ID of the quest to update
 * @param progress - The new progress value
 * @returns A promise that resolves with the updated quest
 */
export const updateQuestProgress = async (userId: string, questId: string, progress: number): Promise<Quest> => {
    try {
        const url = `${GAMIFICATION_API_URL}/users/${userId}/quests/${questId}/progress`;
        const response = await axios.post<Quest>(url, { progress });
        return response.data;
    } catch (error) {
        console.error('Failed to update quest progress:', error);
        throw new Error('Failed to update quest progress. Please try again later.');
    }
};

/**
 * Marks a quest as completed for a user.
 *
 * @param userId - The ID of the user
 * @param questId - The ID of the quest to complete
 * @returns A promise that resolves with the completed quest
 */
export const completeQuest = async (userId: string, questId: string): Promise<Quest> => {
    try {
        const url = `${GAMIFICATION_API_URL}/users/${userId}/quests/${questId}/complete`;
        const response = await axios.post<Quest>(url, {});
        return response.data;
    } catch (error) {
        console.error('Failed to complete quest:', error);
        throw new Error('Failed to complete quest. Please try again later.');
    }
};

/**
 * Redeems a reward for a user.
 *
 * @param userId - The ID of the user
 * @param rewardId - The ID of the reward to redeem
 * @returns A promise that resolves with the redemption record
 */
export const redeemReward = async (userId: string, rewardId: string): Promise<RewardRedemption> => {
    try {
        const url = `${GAMIFICATION_API_URL}/users/${userId}/rewards/${rewardId}/redeem`;
        const response = await axios.post<RewardRedemption>(url, {});
        return response.data;
    } catch (error) {
        console.error('Failed to redeem reward:', error);
        throw new Error('Failed to redeem reward. Please try again later.');
    }
};

/**
 * Fetches the reward redemption history for a user.
 *
 * @param userId - The ID of the user
 * @returns A promise that resolves with the user's reward redemption history
 */
export const getRewardHistory = async (userId: string): Promise<RewardRedemption[]> => {
    try {
        const url = `${GAMIFICATION_API_URL}/users/${userId}/rewards/history`;
        const response = await axios.get<RewardRedemption[]>(url);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch reward history:', error);
        throw new Error('Failed to retrieve reward history. Please try again later.');
    }
};

/**
 * Fetches the current streak status for a user.
 *
 * @param userId - The ID of the user
 * @returns A promise that resolves with the user's streak information
 */
export const getStreakStatus = async (userId: string): Promise<StreakStatus> => {
    try {
        const url = `${GAMIFICATION_API_URL}/users/${userId}/streak`;
        const response = await axios.get<StreakStatus>(url);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch streak status:', error);
        throw new Error('Failed to retrieve streak status. Please try again later.');
    }
};

/**
 * Updates (bumps) the streak for a user by activity type.
 *
 * @param userId - The ID of the user
 * @param streakType - The type of streak activity
 * @returns A promise that resolves with the updated streak status
 */
export const updateStreak = async (userId: string, streakType: string): Promise<StreakStatus> => {
    try {
        const url = `${GAMIFICATION_API_URL}/users/${userId}/streak/update`;
        const response = await axios.post<StreakStatus>(url, { streakType });
        return response.data;
    } catch (error) {
        console.error('Failed to update streak:', error);
        throw new Error('Failed to update streak. Please try again later.');
    }
};

export default {
    getGameProfile,
    getUserAchievements,
    getUserQuests,
    getUserRewards,
    getJourneyAchievements,
    acknowledgeAchievement,
    triggerGamificationEvent,
    updateGameProfile,
    getLeaderboard,
    updateQuestProgress,
    completeQuest,
    redeemReward,
    getRewardHistory,
    getStreakStatus,
    updateStreak,
};
