import { GameProfile } from 'src/web/shared/types/gamification.types';
import { restClient } from 'src/web/mobile/src/api/client';
import { AxiosResponse } from 'axios'; // Version 1.4.0

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