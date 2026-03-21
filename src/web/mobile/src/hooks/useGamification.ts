/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
/**
 * @file useGamification.ts
 * @description Custom React hooks for fetching gamification data within the
 * Gamification Engine journey. Each sub-hook fetches a specific slice of
 * gamification state via TanStack Query v5, replacing the former Apollo GraphQL queries.
 */

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useAuth } from './useAuth';
import {
    getGameProfile,
    getAchievements,
    getQuests,
    getRewards,
    GameProfile,
    Achievement,
    Quest,
    Reward,
} from '../api/gamification';

// ---------------------------------------------------------------------------
// Internal helper
// ---------------------------------------------------------------------------

/**
 * Derives the userId string from the auth context, or undefined if unavailable.
 */
function useUserId(): string | undefined {
    const { session, getUserFromToken } = useAuth();
    return session?.accessToken ? (getUserFromToken(session.accessToken)?.sub as string | undefined) : undefined;
}

// ---------------------------------------------------------------------------
// Sub-hooks
// ---------------------------------------------------------------------------

/**
 * Fetches and provides the game profile for the currently authenticated user.
 *
 * @returns The user's GameProfile, or undefined if not yet loaded.
 */
export function useGameProfile(): GameProfile | undefined {
    const userId = useUserId();

    const { data, error } = useQuery<GameProfile, Error>({
        queryKey: ['gameProfile', userId],
        queryFn: () => getGameProfile(userId as string),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    useEffect(() => {
        if (error) {
            console.error('Error fetching game profile:', error);
        }
    }, [error]);

    return data;
}

/**
 * Fetches and provides the achievements for the currently authenticated user.
 *
 * @returns The user's Achievement array, or undefined if not yet loaded.
 */
export function useAchievements(): Achievement[] | undefined {
    const userId = useUserId();

    const { data, error } = useQuery<Achievement[], Error>({
        queryKey: ['achievements', userId],
        queryFn: () => getAchievements(userId as string),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    useEffect(() => {
        if (error) {
            console.error('Error fetching achievements:', error);
        }
    }, [error]);

    return data;
}

/**
 * Fetches and provides the quests for the currently authenticated user.
 *
 * @returns The user's Quest array, or undefined if not yet loaded.
 */
export function useQuests(): Quest[] | undefined {
    const userId = useUserId();

    const { data, error } = useQuery<Quest[], Error>({
        queryKey: ['quests', userId],
        queryFn: () => getQuests(userId as string),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    useEffect(() => {
        if (error) {
            console.error('Error fetching quests:', error);
        }
    }, [error]);

    return data;
}

/**
 * Fetches and provides the rewards for the currently authenticated user.
 *
 * @returns The user's Reward array, or undefined if not yet loaded.
 */
export function useRewards(): Reward[] | undefined {
    const userId = useUserId();

    const { data, error } = useQuery<Reward[], Error>({
        queryKey: ['rewards', userId],
        queryFn: () => getRewards(userId as string),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    useEffect(() => {
        if (error) {
            console.error('Error fetching rewards:', error);
        }
    }, [error]);

    return data;
}

// ---------------------------------------------------------------------------
// Combined hook
// ---------------------------------------------------------------------------

/**
 * Combined gamification hook that provides access to all gamification data
 * with unified loading, error, and refetch support.
 *
 * Unlike the individual sub-hooks, this hook calls useQuery directly so it can
 * expose isLoading, error, and refetch at the aggregate level.
 *
 * @returns Object with profile, achievements, quests, rewards, isLoading, error, and refetch.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- hook return type inferred
export function useGamification() {
    const userId = useUserId();

    const profileQ = useQuery<GameProfile, Error>({
        queryKey: ['gameProfile', userId],
        queryFn: () => getGameProfile(userId as string),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    const achievementsQ = useQuery<Achievement[], Error>({
        queryKey: ['achievements', userId],
        queryFn: () => getAchievements(userId as string),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    const questsQ = useQuery<Quest[], Error>({
        queryKey: ['quests', userId],
        queryFn: () => getQuests(userId as string),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    const rewardsQ = useQuery<Reward[], Error>({
        queryKey: ['rewards', userId],
        queryFn: () => getRewards(userId as string),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    const isLoading = profileQ.isPending || achievementsQ.isPending || questsQ.isPending || rewardsQ.isPending;
    const error = profileQ.error || achievementsQ.error || questsQ.error || rewardsQ.error;

    return {
        profile: profileQ.data,
        achievements: achievementsQ.data ?? [],
        quests: questsQ.data ?? [],
        rewards: rewardsQ.data ?? [],
        isLoading,
        error,
        refetch: () => {
            profileQ.refetch();
            achievementsQ.refetch();
            questsQ.refetch();
            rewardsQ.refetch();
        },
    };
}
