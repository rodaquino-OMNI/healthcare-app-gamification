import React, { createContext, useCallback, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { Achievement, Quest, GameProfile } from 'shared/types/gamification.types';

import { useAuth } from '@/hooks/useAuth';
import { useGameProfile } from '@/hooks/useGamification';

/**
 * Interface defining the shape of the Gamification Context
 * Provides access to gamification data and functionality
 */
interface GamificationContextType {
    // The user's gamification profile containing level, XP, achievements, and quests
    gameProfile: GameProfile | undefined;

    // Indicates whether gamification data is currently loading
    isLoading: boolean;

    // Contains any error that occurred during gamification operations
    error: Error | null;

    // Triggers a gamification event (e.g., completing a task, reaching a milestone)
    triggerGamificationEvent: (eventType: string, eventData?: unknown) => Promise<void>;

    // Checks if a specific achievement is unlocked
    hasAchievement: (achievementId: string) => boolean;

    // Checks if a specific quest is completed
    isQuestCompleted: (questId: string) => boolean;

    // Returns the progress percentage for an achievement
    getAchievementProgress: (achievementId: string) => number;

    // Returns the progress percentage for a quest
    getQuestProgress: (questId: string) => number;
}

// Create the context with a default value of null
const GamificationContext = createContext<GamificationContextType | null>(null);

/**
 * Provider component for the Gamification context
 * Makes gamification data and functionality available throughout the application
 */
export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Get the user ID from the auth context
    const { userId } = useAuth();

    // State for tracking errors
    const [error, setError] = useState<Error | null>(null);

    // Use the gameProfile hook to fetch the profile data
    const { data: gameProfileData, loading: profileLoading } = useGameProfile(userId ?? '');
    const gameProfile = gameProfileData?.gameProfile;

    // Determine loading state - we're loading if we don't have a profile and don't have an error
    const isLoading = profileLoading;

    /**
     * Triggers a gamification event on the server
     * @param eventType - The type of event being triggered (e.g., "COMPLETE_HEALTH_CHECK")
     * @param eventData - Additional data related to the event
     * @returns Promise that resolves when the event is processed
     */
    const triggerGamificationEvent = useCallback(
        async (eventType: string, eventData?: unknown): Promise<void> => {
            // Ensure the user is authenticated
            if (!userId) {
                const authError = new Error('User must be authenticated to trigger gamification events');
                setError(authError);
                return Promise.reject(authError);
            }

            try {
                // Make an API call to trigger the event
                const response = await fetch('/api/gamification/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        eventType,
                        data: eventData,
                    }),
                });

                // Handle API errors
                if (!response.ok) {
                    throw new Error(`Failed to trigger gamification event: ${response.statusText}`);
                }

                // Clear any previous errors
                setError(null);
            } catch (err) {
                // Log and set the error
                console.error('Error triggering gamification event:', err);
                const eventError = err instanceof Error ? err : new Error('Failed to trigger gamification event');
                setError(eventError);
                return Promise.reject(eventError);
            }
        },
        [userId]
    );

    /**
     * Checks if the user has unlocked a specific achievement
     * @param achievementId - ID of the achievement to check
     * @returns boolean indicating if the achievement is unlocked
     */
    const hasAchievement = useCallback(
        (achievementId: string): boolean => {
            const achievement = gameProfile?.achievements?.find((a: Achievement) => a.id === achievementId);
            return achievement ? achievement.unlocked : false;
        },
        [gameProfile?.achievements]
    );

    /**
     * Checks if the user has completed a specific quest
     * @param questId - ID of the quest to check
     * @returns boolean indicating if the quest is completed
     */
    const isQuestCompleted = useCallback(
        (questId: string): boolean => {
            if (!gameProfile?.quests) {
                return false;
            }

            const quest = gameProfile.quests.find((q: Quest) => q.id === questId);
            return quest ? quest.completed : false;
        },
        [gameProfile?.quests]
    );

    /**
     * Calculates the progress percentage for an achievement
     * @param achievementId - ID of the achievement
     * @returns number between 0-100 representing completion percentage
     */
    const getAchievementProgress = useCallback(
        (achievementId: string): number => {
            const achievement = gameProfile?.achievements?.find((a: Achievement) => a.id === achievementId);
            if (!achievement) {
                return 0;
            }

            if (achievement.unlocked) {
                return 100;
            }
            return Math.round((achievement.progress / achievement.total) * 100);
        },
        [gameProfile?.achievements]
    );

    /**
     * Calculates the progress percentage for a quest
     * @param questId - ID of the quest
     * @returns number between 0-100 representing completion percentage
     */
    const getQuestProgress = useCallback(
        (questId: string): number => {
            if (!gameProfile?.quests) {
                return 0;
            }

            const quest = gameProfile.quests.find((q: Quest) => q.id === questId);
            if (!quest) {
                return 0;
            }

            if (quest.completed) {
                return 100;
            }
            return Math.round((quest.progress / quest.total) * 100);
        },
        [gameProfile?.quests]
    );

    // Reset error when user ID changes
    useEffect(() => {
        setError(null);
    }, [userId]);

    // Create the context value
    const value = useMemo(
        () => ({
            gameProfile,
            isLoading,
            error,
            triggerGamificationEvent,
            hasAchievement,
            isQuestCompleted,
            getAchievementProgress,
            getQuestProgress,
        }),
        [
            gameProfile,
            isLoading,
            error,
            triggerGamificationEvent,
            hasAchievement,
            isQuestCompleted,
            getAchievementProgress,
            getQuestProgress,
        ]
    );

    return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};

/**
 * Hook to use the gamification context
 * Provides access to gamification data and functionality
 *
 * @example
 * const { gameProfile, triggerGamificationEvent } = useGamification();
 *
 * // Display user level and XP
 * <Text>Level {gameProfile?.level}: {gameProfile?.xp} XP</Text>
 *
 * // Trigger a gamification event when user completes a health check
 * const completeHealthCheck = async () => {
 *   await triggerGamificationEvent('COMPLETE_HEALTH_CHECK', { metricType: 'bloodPressure' });
 * };
 */
export const useGamification = (): GamificationContextType => {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};
