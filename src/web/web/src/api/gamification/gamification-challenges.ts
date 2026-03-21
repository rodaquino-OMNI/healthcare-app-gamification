/**
 * Gamification Challenges API
 *
 * This module provides functions for interacting with challenge, streak,
 * leaderboard, and reward redemption features of the AUSTA SuperApp
 * gamification engine.
 */

import axios from 'axios'; // version 1.6.8 with security enhancements

import {
    GAMIFICATION_API_URL,
    type Quest,
    type RewardRedemption,
    type LeaderboardEntry,
    type StreakStatus,
} from './gamification-achievements';

// Types are exported from gamification-achievements; import from there directly.

// ─── Functions ───────────────────────────────────────────────────────────────

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

/**
 * Retrieves the XP history for a user.
 *
 * @param userId - The unique identifier of the user
 * @param limit - Optional limit on the number of entries to return
 * @returns A promise that resolves to an array of XP history entries
 */
export const getXpHistory = async (
    userId: string,
    limit?: number
): Promise<Array<{ amount: number; reason: string; timestamp: string }>> => {
    try {
        const response = await axios.get<Array<{ amount: number; reason: string; timestamp: string }>>(
            `${GAMIFICATION_API_URL}/users/${userId}/xp-history`,
            { params: { limit } }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch XP history:', error);
        throw new Error('Failed to retrieve XP history. Please try again later.');
    }
};

/**
 * Retrieves the level progress for a user.
 *
 * @param userId - The unique identifier of the user
 * @returns A promise that resolves to the user's level progress information
 */
export const getLevelProgress = async (
    userId: string
): Promise<{ currentLevel: number; currentXp: number; nextLevelXp: number; progress: number }> => {
    try {
        const response = await axios.get<{
            currentLevel: number;
            currentXp: number;
            nextLevelXp: number;
            progress: number;
        }>(`${GAMIFICATION_API_URL}/users/${userId}/level-progress`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch level progress:', error);
        throw new Error('Failed to retrieve level progress. Please try again later.');
    }
};

/**
 * Retrieves quests for a specific journey for a user.
 *
 * @param userId - The unique identifier of the user
 * @param journey - The journey identifier (health, care, plan)
 * @returns A promise that resolves to an array of journey-specific quests
 */
export const getJourneyQuests = async (userId: string, journey: string): Promise<Quest[]> => {
    try {
        const url = `${GAMIFICATION_API_URL}/users/${userId}` + `/journeys/${journey}/quests`;
        const response = await axios.get<Quest[]>(url);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch ${journey} journey quests:`, error);
        throw new Error(`Failed to retrieve ${journey} journey quests.` + ' Please try again later.');
    }
};

/**
 * Retrieves the daily challenge quest for a user.
 *
 * @param userId - The unique identifier of the user
 * @returns A promise that resolves to the daily challenge quest
 */
export const getDailyChallenge = async (userId: string): Promise<Quest> => {
    try {
        const response = await axios.get<Quest>(`${GAMIFICATION_API_URL}/users/${userId}/daily-challenge`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch daily challenge:', error);
        throw new Error('Failed to retrieve daily challenge. Please try again later.');
    }
};

/**
 * Retrieves the weekly challenge quest for a user.
 *
 * @param userId - The unique identifier of the user
 * @returns A promise that resolves to the weekly challenge quest
 */
export const getWeeklyChallenge = async (userId: string): Promise<Quest> => {
    try {
        const response = await axios.get<Quest>(`${GAMIFICATION_API_URL}/users/${userId}/weekly-challenge`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch weekly challenge:', error);
        throw new Error('Failed to retrieve weekly challenge. Please try again later.');
    }
};
