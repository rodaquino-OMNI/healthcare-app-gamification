import { GameProfile } from '@shared/types/gamification.types';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

/** Minimal shape of a decoded JWT used in this context. */
interface DecodedToken {
    sub?: string;
    [key: string]: unknown;
}

import { getGameProfile } from '@api/gamification';
import { useAuth } from '@context/AuthContext';

/**
 * Interface that defines the shape of the gamification context value
 */
interface GamificationContextType {
    /** The user's game profile data */
    gameProfile: GameProfile | undefined;
    /** Indicates whether the game profile is currently loading */
    isLoading: boolean;
    /** Any error that occurred while loading the game profile */
    error: Error | null;
}

/**
 * Context object for the gamification system
 * Provides access to the user's game profile, achievements, quests, and rewards
 */
const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

/**
 * Provider component that manages gamification state and methods
 * Makes the gamification context available to all child components
 */
const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Get the session from the authentication context and extract userId
    const { session, getUserFromToken } = useAuth();
    const decoded = session?.accessToken ? (getUserFromToken(session.accessToken) as DecodedToken | null) : null;
    const userId = decoded?.sub;

    // State for managing the game profile data
    const [gameProfile, setGameProfile] = useState<GameProfile | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Fetch the game profile when the user ID changes
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- return type inferred from implementation
        const fetchGameProfile = async () => {
            // Don't try to fetch if there's no user ID
            if (!userId) {
                setGameProfile(undefined);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Get the game profile from the API
                const profile = await getGameProfile(userId);
                setGameProfile(profile as GameProfile | undefined);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)));
                console.error('Error fetching game profile:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGameProfile();
    }, [userId]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useCallback(() => {
        return {
            gameProfile,
            isLoading,
            error,
        };
    }, [gameProfile, isLoading, error]);

    return <GamificationContext.Provider value={contextValue()}>{children}</GamificationContext.Provider>;
};

/**
 * Custom hook that provides access to the gamification context
 * @returns The gamification context object containing user state and gamification methods
 * @throws Error if used outside of GamificationProvider
 */
const useGamification = (): GamificationContextType => {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};

export { GamificationContext, GamificationProvider, useGamification };
