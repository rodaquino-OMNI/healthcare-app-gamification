import { ApolloError, useQuery } from '@apollo/client'; // v3.7.17
import { GET_GAME_PROFILE } from 'shared/graphql/queries/gamification.queries';
import { GameProfile } from 'shared/types/gamification.types';

/** Shape returned by the useGameProfile hook */
interface UseGameProfileReturn {
    data: { gameProfile: GameProfile } | undefined;
    loading: boolean;
    error: ApolloError | undefined;
    gameProfile: GameProfile | undefined;
    isLoading: boolean;
}

/**
 * React hook for accessing and managing the user's game profile data.
 * Provides access to gamification data including level, XP, achievements,
 * and quests from the gamification engine.
 *
 * @param userId The ID of the user whose game profile should be fetched
 * @returns Object containing the game profile data, loading state, and error
 */
export const useGameProfile = (userId: string): UseGameProfileReturn => {
    const result = useQuery<{
        gameProfile: GameProfile;
    }>(GET_GAME_PROFILE, {
        variables: { userId },
        skip: !userId,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    return {
        data: result.data,
        loading: result.loading,
        error: result.error,
        gameProfile: result.data?.gameProfile,
        isLoading: result.loading,
    };
};

/**
 * Alias for useGameProfile -- backward compatibility
 * for consumers importing useGamification.
 */
export const useGamification = useGameProfile;
