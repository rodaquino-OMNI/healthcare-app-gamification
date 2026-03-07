/**
 * Gamification API
 *
 * This module provides functions for interacting with the gamification engine
 * of the AUSTA SuperApp. It includes methods for retrieving user game profiles,
 * achievements, quests, and rewards.
 */
// Type declaration for process.env
declare const process: {
    env: {
        NEXT_PUBLIC_API_BASE_URL?: string;
        [key: string]: string | undefined;
    };
};

// TypeScript will ignore the import error when we add the @ts-ignore comment
// @ts-ignore - axios will be available at runtime
import axios from 'axios'; // version 1.6.8 with security enhancements

// Define interfaces directly in this file until TypeScript can find the proper module
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
        const response = await axios.get(`${GAMIFICATION_API_URL}/profiles/${userId}`);
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
        const response = await axios.get(`${GAMIFICATION_API_URL}/users/${userId}/achievements`);
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
        const response = await axios.get(`${GAMIFICATION_API_URL}/users/${userId}/quests`);
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
        const response = await axios.get(`${GAMIFICATION_API_URL}/users/${userId}/rewards`);
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
        const response = await axios.get(`${GAMIFICATION_API_URL}/users/${userId}/journeys/${journey}/achievements`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch ${journey} journey achievements:`, error);
        throw new Error(`Failed to retrieve ${journey} journey achievements. Please try again later.`);
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
        await axios.post(`${GAMIFICATION_API_URL}/users/${userId}/achievements/${achievementId}/acknowledge`);
    } catch (error) {
        console.error('Failed to acknowledge achievement:', error);
        throw new Error('Failed to acknowledge achievement. Please try again later.');
    }
};

/**
 * Triggers a gamification event based on user action.
 * This is used to record user actions that may lead to achievements.
 *
 * @param userId - The unique identifier of the user
 * @param eventType - The type of event that occurred
 * @param eventData - Additional data related to the event
 * @returns A promise that resolves to any new achievements or rewards triggered by the event
 */
export const triggerGamificationEvent = async (
    userId: string,
    eventType: string,
    eventData: unknown
): Promise<{ achievements?: Achievement[]; rewards?: Reward[] }> => {
    try {
        const response = await axios.post(`${GAMIFICATION_API_URL}/events`, {
            userId,
            eventType,
            eventData,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to trigger gamification event:', error);
        throw new Error('Failed to record your activity. Please try again later.');
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
};
