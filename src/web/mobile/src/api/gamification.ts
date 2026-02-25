import { AxiosResponse } from 'axios'; // Version 1.6.8 with security enhancements
import { restClient } from './client';
import { getAuthSession } from './care';

// ---------------------------------------------------------------------------
// Interfaces — re-exported from the shared canonical types
// ---------------------------------------------------------------------------

import type {
  Achievement,
  Quest,
  Reward,
  GameProfile,
} from '@shared/types/gamification.types';

export type { Achievement, Quest, Reward, GameProfile };

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

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

async function authHeaders(): Promise<{ Authorization: string }> {
  const session = await getAuthSession();
  if (!session) throw new Error('Authentication required');
  return { Authorization: `Bearer ${session.accessToken}` };
}

// ---------------------------------------------------------------------------
// Existing functions (fixed: auth headers + typed returns)
// ---------------------------------------------------------------------------

/**
 * Fetches the gamification profile for a given user ID.
 *
 * @param userId - The ID of the user whose gamification profile to fetch
 * @returns A promise that resolves with the user's gamification profile
 */
export async function getGameProfile(userId: string): Promise<GameProfile> {
  const headers = await authHeaders();
  const endpoint = `/api/gamification/profiles/${userId}`;
  const response: AxiosResponse<GameProfile> = await restClient.get(
    endpoint,
    { headers },
  );
  return response.data;
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
  profileData: Partial<GameProfile>,
): Promise<GameProfile> {
  const headers = await authHeaders();
  const endpoint = `/api/gamification/profiles/${userId}`;
  const response: AxiosResponse<GameProfile> = await restClient.patch(
    endpoint,
    profileData,
    { headers },
  );
  return response.data;
}

/**
 * Fetches achievements for a given user ID.
 *
 * @param userId - The ID of the user whose achievements to fetch
 * @returns A promise that resolves with the user's achievements
 */
export async function getAchievements(userId: string): Promise<Achievement[]> {
  const headers = await authHeaders();
  const endpoint = `/api/gamification/profiles/${userId}/achievements`;
  const response: AxiosResponse<Achievement[]> = await restClient.get(
    endpoint,
    { headers },
  );
  return response.data;
}

/**
 * Fetches quests for a given user ID.
 *
 * @param userId - The ID of the user whose quests to fetch
 * @returns A promise that resolves with the user's quests
 */
export async function getQuests(userId: string): Promise<Quest[]> {
  const headers = await authHeaders();
  const endpoint = `/api/gamification/profiles/${userId}/quests`;
  const response: AxiosResponse<Quest[]> = await restClient.get(
    endpoint,
    { headers },
  );
  return response.data;
}

/**
 * Fetches rewards for a given user ID.
 *
 * @param userId - The ID of the user whose rewards to fetch
 * @returns A promise that resolves with the user's rewards
 */
export async function getRewards(userId: string): Promise<Reward[]> {
  const headers = await authHeaders();
  const endpoint = `/api/gamification/profiles/${userId}/rewards`;
  const response: AxiosResponse<Reward[]> = await restClient.get(
    endpoint,
    { headers },
  );
  return response.data;
}

// ---------------------------------------------------------------------------
// New functions (7 additions)
// ---------------------------------------------------------------------------

/**
 * Fetches the leaderboard, optionally filtered by time period.
 *
 * @param period - Optional time period filter
 * @returns A promise that resolves with leaderboard entries
 */
export async function getLeaderboard(
  period?: 'daily' | 'weekly' | 'monthly' | 'allTime',
): Promise<LeaderboardEntry[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<LeaderboardEntry[]> = await restClient.get(
    '/api/gamification/leaderboard',
    { params: { period }, headers },
  );
  return response.data;
}

/**
 * Updates progress on a specific quest for a user.
 *
 * @param userId - The ID of the user
 * @param questId - The ID of the quest to update
 * @param progress - The new progress value
 * @returns A promise that resolves with the updated quest
 */
export async function updateQuestProgress(
  userId: string,
  questId: string,
  progress: number,
): Promise<Quest> {
  const headers = await authHeaders();
  const endpoint = `/api/gamification/profiles/${userId}/quests/${questId}/progress`;
  const response: AxiosResponse<Quest> = await restClient.post(
    endpoint,
    { progress },
    { headers },
  );
  return response.data;
}

/**
 * Marks a quest as completed for a user.
 *
 * @param userId - The ID of the user
 * @param questId - The ID of the quest to complete
 * @returns A promise that resolves with the completed quest
 */
export async function completeQuest(
  userId: string,
  questId: string,
): Promise<Quest> {
  const headers = await authHeaders();
  const endpoint = `/api/gamification/profiles/${userId}/quests/${questId}/complete`;
  const response: AxiosResponse<Quest> = await restClient.post(
    endpoint,
    {},
    { headers },
  );
  return response.data;
}

/**
 * Redeems a reward for a user.
 *
 * @param userId - The ID of the user
 * @param rewardId - The ID of the reward to redeem
 * @returns A promise that resolves with the redemption record
 */
export async function redeemReward(
  userId: string,
  rewardId: string,
): Promise<RewardRedemption> {
  const headers = await authHeaders();
  const endpoint = `/api/gamification/profiles/${userId}/rewards/${rewardId}/redeem`;
  const response: AxiosResponse<RewardRedemption> = await restClient.post(
    endpoint,
    {},
    { headers },
  );
  return response.data;
}

/**
 * Fetches the reward redemption history for a user.
 *
 * @param userId - The ID of the user
 * @returns A promise that resolves with the user's reward redemption history
 */
export async function getRewardHistory(
  userId: string,
): Promise<RewardRedemption[]> {
  const headers = await authHeaders();
  const endpoint = `/api/gamification/profiles/${userId}/rewards/history`;
  const response: AxiosResponse<RewardRedemption[]> = await restClient.get(
    endpoint,
    { headers },
  );
  return response.data;
}

/**
 * Fetches the current streak status for a user.
 *
 * @param userId - The ID of the user
 * @returns A promise that resolves with the user's streak information
 */
export async function getStreakStatus(userId: string): Promise<StreakStatus> {
  const headers = await authHeaders();
  const endpoint = `/api/gamification/profiles/${userId}/streak`;
  const response: AxiosResponse<StreakStatus> = await restClient.get(
    endpoint,
    { headers },
  );
  return response.data;
}

/**
 * Updates (bumps) the streak for a user by activity type.
 *
 * @param userId - The ID of the user
 * @param streakType - The type of streak activity
 * @returns A promise that resolves with the updated streak status
 */
export async function updateStreak(
  userId: string,
  streakType: string,
): Promise<StreakStatus> {
  const headers = await authHeaders();
  const endpoint = `/api/gamification/profiles/${userId}/streak/update`;
  const response: AxiosResponse<StreakStatus> = await restClient.post(
    endpoint,
    { streakType },
    { headers },
  );
  return response.data;
}
