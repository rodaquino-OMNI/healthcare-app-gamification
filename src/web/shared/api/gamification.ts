/**
 * Gamification API
 *
 * This module provides functions for interacting with the gamification engine
 * of the AUSTA SuperApp. It includes methods for retrieving user game profiles,
 * achievements, quests, and rewards.
 */

// Create a constants object to replace the missing import
const API_CONFIG = {
    BASE_URL: typeof window !== 'undefined' ? window.location.origin + '/api' : 'http://localhost:3000/api',
    TIMEOUT: 15000,
    ENDPOINTS: {
        PROFILES: '/gamification/profiles',
        ACHIEVEMENTS: '/gamification/achievements',
        QUESTS: '/gamification/quests',
        REWARDS: '/gamification/rewards',
        EVENTS: '/gamification/events',
    },
};

// Import types (adjust path as needed for your project structure)
import { GameProfile, Achievement, Quest, Reward } from '../types/gamification.types';

/**
 * Base URL for the gamification API endpoints
 */
const GAMIFICATION_API_URL = API_CONFIG.BASE_URL;

/**
 * Helper function to handle API errors consistently
 * @param error - The error object from fetch
 * @param defaultMessage - Default error message to display
 */
const handleApiError = (error: unknown, defaultMessage: string): never => {
    // Log the error with useful debugging information
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Gamification API Error: ${defaultMessage}`, message);

    // Throw a user-friendly error with consistent format
    throw new Error(defaultMessage);
};

/**
 * Retrieves the user's game profile from the gamification engine.
 *
 * @param userId - The unique identifier of the user
 * @returns A promise that resolves to the user's game profile
 */
export const getGameProfile = async (userId: string): Promise<GameProfile> => {
    try {
        // Using fetch API instead of axios to avoid dependency issues
        const response = await fetch(`${GAMIFICATION_API_URL}${API_CONFIG.ENDPOINTS.PROFILES}/${userId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return (await response.json()) as GameProfile;
    } catch (error) {
        return handleApiError(error, 'Failed to retrieve game profile. Please try again later.');
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
        const response = await fetch(
            `${GAMIFICATION_API_URL}${API_CONFIG.ENDPOINTS.ACHIEVEMENTS}?userId=${encodeURIComponent(userId)}`,
            { method: 'GET' }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return (await response.json()) as Achievement[];
    } catch (error) {
        return handleApiError(error, 'Failed to retrieve achievements. Please try again later.');
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
        const response = await fetch(
            `${GAMIFICATION_API_URL}${API_CONFIG.ENDPOINTS.QUESTS}?userId=${encodeURIComponent(userId)}`,
            { method: 'GET' }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return (await response.json()) as Quest[];
    } catch (error) {
        return handleApiError(error, 'Failed to retrieve quests. Please try again later.');
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
        const response = await fetch(
            `${GAMIFICATION_API_URL}${API_CONFIG.ENDPOINTS.REWARDS}?userId=${encodeURIComponent(userId)}`,
            { method: 'GET' }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return (await response.json()) as Reward[];
    } catch (error) {
        return handleApiError(error, 'Failed to retrieve rewards. Please try again later.');
    }
};

/**
 * Submits a gamification event to the engine.
 *
 * @param userId - The unique identifier of the user
 * @param eventType - The type of event being recorded
 * @param eventData - Additional data related to the event
 * @returns A promise that resolves when the event is processed
 */
export const submitGamificationEvent = async (
    userId: string,
    eventType: string,
    eventData: Record<string, unknown>
): Promise<void> => {
    try {
        const response = await fetch(`${GAMIFICATION_API_URL}${API_CONFIG.ENDPOINTS.EVENTS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                eventType,
                eventData,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        return handleApiError(error, 'Failed to record activity. Your progress will be updated later.');
    }
};

export default {
    getGameProfile,
    getUserAchievements,
    getUserQuests,
    getUserRewards,
    submitGamificationEvent,
};
