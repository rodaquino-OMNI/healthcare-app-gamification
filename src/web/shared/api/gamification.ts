/**
 * Gamification API
 * 
 * This module provides functions for interacting with the gamification engine
 * of the AUSTA SuperApp. It includes methods for retrieving user game profiles,
 * achievements, quests, and rewards.
 */

import axios from 'axios'; // Using version 1.6.8 with security enhancements
import { API_BASE_URL, API_TIMEOUT, GAMIFICATION_ENDPOINTS } from '../constants/api';

// Import types (adjust path as needed for your project structure)
import { GameProfile, Achievement, Quest, Reward } from '../types/gamification.types';

/**
 * Base URL for the gamification API endpoints
 */
const GAMIFICATION_API_URL = `${API_BASE_URL}`;

/**
 * Helper function to handle API errors consistently
 * @param error - The error object from axios
 * @param defaultMessage - Default error message to display
 */
const handleApiError = (error: any, defaultMessage: string): never => {
  // Log the error with useful debugging information
  console.error(
    `Gamification API Error: ${defaultMessage}`,
    error.response?.data || error.message || error
  );
  
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
    const response = await axios.get(`${GAMIFICATION_API_URL}${GAMIFICATION_ENDPOINTS.PROFILES}/${userId}`, {
      timeout: API_TIMEOUT,
    });
    return response.data;
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
    const response = await axios.get(`${GAMIFICATION_API_URL}${GAMIFICATION_ENDPOINTS.ACHIEVEMENTS}`, {
      params: { userId },
      timeout: API_TIMEOUT,
    });
    return response.data;
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
    const response = await axios.get(`${GAMIFICATION_API_URL}${GAMIFICATION_ENDPOINTS.QUESTS}`, {
      params: { userId },
      timeout: API_TIMEOUT,
    });
    return response.data;
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
    const response = await axios.get(`${GAMIFICATION_API_URL}${GAMIFICATION_ENDPOINTS.REWARDS}`, {
      params: { userId },
      timeout: API_TIMEOUT,
    });
    return response.data;
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
  eventData: Record<string, any>
): Promise<void> => {
  try {
    await axios.post(`${GAMIFICATION_API_URL}${GAMIFICATION_ENDPOINTS.EVENTS}`, {
      userId,
      eventType,
      eventData,
      timestamp: new Date().toISOString()
    }, {
      timeout: API_TIMEOUT,
    });
  } catch (error) {
    return handleApiError(error, 'Failed to record activity. Your progress will be updated later.');
  }
};

export default {
  getGameProfile,
  getUserAchievements,
  getUserQuests,
  getUserRewards,
  submitGamificationEvent
};