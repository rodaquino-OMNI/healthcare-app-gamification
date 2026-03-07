import { useQuery } from '@apollo/client'; // v3.7.17
import { GameProfile } from 'shared/types/gamification.types';
import { GET_GAME_PROFILE } from 'shared/graphql/queries/gamification.queries';
import { API_BASE_URL } from 'shared/constants/api';
import { apiConfig } from 'shared/config/apiConfig';
import { ALL_JOURNEYS } from 'shared/constants/journeys';
import { formatJourneyValue } from 'shared/utils/index';

/**
 * React hook for accessing and managing the user's game profile data.
 * Provides access to gamification data including level, XP, achievements, and quests
 * from the gamification engine.
 *
 * @param userId The ID of the user whose game profile should be fetched
 * @returns Object containing the game profile data, loading state, and error information
 */
export const useGameProfile = (userId: string) => {
    return useQuery<{ gameProfile: GameProfile }>(GET_GAME_PROFILE, {
        variables: { userId },
        skip: !userId, // Skip query execution if userId is falsy
        fetchPolicy: 'cache-and-network', // First return cached data, then fetch from network
        nextFetchPolicy: 'cache-first', // For subsequent executions, check cache first
        // Keep data fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Keep cached data for 30 minutes
        cacheTime: 30 * 60 * 1000,
        // Refetch when window regains focus
        refetchOnWindowFocus: true,
        onError: (error) => {
            console.error('Error fetching game profile:', error);
        },
    });
};
