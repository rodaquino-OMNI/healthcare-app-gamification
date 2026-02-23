// Define the GameProfile type if it's not available
interface GameProfile {
  userId: string;
  level: number;
  points: number;
  achievements: string[];
  badges: string[];
  streak: number;
  [key: string]: any;
}

import { AxiosResponse } from 'axios'; // Version 1.6.8 with security enhancements
import { restClient } from './client';

/**
 * Fetches the gamification profile for a given user ID.
 * 
 * @param userId - The ID of the user whose gamification profile to fetch
 * @returns A promise that resolves with the user's gamification profile
 */
export async function getGameProfile(userId: string): Promise<GameProfile> {
  try {
    const endpoint = `/api/gamification/profiles/${userId}`;
    const response: AxiosResponse<GameProfile> = await restClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching gamification profile:', error);
    throw error;
  }
}

/**
 * Updates the gamification profile for a given user ID with the provided data.
 *
 * @param userId - The ID of the user whose gamification profile to update
 * @param profileData - The partial gamification profile data to update
 * @returns A promise that resolves with the updated user's gamification profile
 */
export async function updateGameProfile(
  userId: string,
  profileData: Partial<GameProfile>
): Promise<GameProfile> {
  try {
    const endpoint = `/api/gamification/profiles/${userId}`;
    const response: AxiosResponse<GameProfile> = await restClient.patch(endpoint, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating gamification profile:', error);
    throw error;
  }
}

/**
 * Fetches achievements for a given user ID.
 * @param userId - The ID of the user whose achievements to fetch
 * @returns A promise that resolves with the user's achievements
 */
export async function getAchievements(userId: string): Promise<any[]> {
  try {
    const endpoint = `/api/gamification/profiles/${userId}/achievements`;
    const response: AxiosResponse<any[]> = await restClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
}

/**
 * Fetches quests for a given user ID.
 * @param userId - The ID of the user whose quests to fetch
 * @returns A promise that resolves with the user's quests
 */
export async function getQuests(userId: string): Promise<any[]> {
  try {
    const endpoint = `/api/gamification/profiles/${userId}/quests`;
    const response: AxiosResponse<any[]> = await restClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching quests:', error);
    throw error;
  }
}

/**
 * Fetches rewards for a given user ID.
 * @param userId - The ID of the user whose rewards to fetch
 * @returns A promise that resolves with the user's rewards
 */
export async function getRewards(userId: string): Promise<any[]> {
  try {
    const endpoint = `/api/gamification/profiles/${userId}/rewards`;
    const response: AxiosResponse<any[]> = await restClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    throw error;
  }
}