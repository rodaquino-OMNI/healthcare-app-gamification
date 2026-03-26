import { AuthSession, AuthState } from '@shared/types/auth.types';
import { jwtDecode } from 'jwt-decode'; // v4: named export (was default in v3)
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// DEMO_MODE — Set to true to bypass auth and show the app with mock data
const DEMO_MODE = true; // DEMO_MODE

import {
    login,
    register,
    verifyMfa,
    refreshToken as refreshTokenApi,
    socialLogin,
    RegisterData,
    SocialTokenData,
} from '../api/auth';
import { secureTokenStorage, migrateFromAsyncStorage } from '../utils/secure-storage';

/**
 * Buffer time (in ms) before token expiration when we should refresh
 * Refresh 5 minutes before expiration to ensure continuous service
 */
const REFRESH_BUFFER_TIME = 5 * 60 * 1000;

/**
 * Type definition for the authentication context
 */
interface AuthContextType extends AuthState {
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (userData: RegisterData) => Promise<void>;
    signOut: () => Promise<void>;
    handleMfaVerification: (code: string, tempToken: string) => Promise<void>;
    handleSocialLogin: (provider: string, tokenData: SocialTokenData) => Promise<void>;
    handleRefreshToken: () => Promise<void>;
    getUserFromToken: (token: string) => any;
    isLoading: boolean;
    isAuthenticated: boolean;
}

/**
 * Initial auth state
 */
const initialAuthState: AuthState = {
    session: null,
    status: 'loading',
};

/**
 * Create the authentication context
 */
export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Authentication provider component
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State for managing authentication
    const [authState, setAuthState] = useState<AuthState>(initialAuthState);
    const [refreshTimerId, setRefreshTimerId] = useState<NodeJS.Timeout | null>(null);

    // Computed properties for convenience
    const isLoading = authState.status === 'loading';
    const isAuthenticated = authState.status === 'authenticated';

    /**
     * Load the saved authentication session from storage
     */
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- return type inferred from implementation
    const loadPersistedSession = async () => {
        try {
            const sessionData = secureTokenStorage.getSession();

            if (sessionData) {
                const session = JSON.parse(sessionData) as AuthSession;

                // Check if the session is expired
                const isExpired = session.expiresAt < Date.now();

                if (isExpired) {
                    // Try to refresh the token if expired
                    try {
                        await handleRefreshToken();
                    } catch (error) {
                        // If refresh fails, clear the session
                        secureTokenStorage.removeSession();
                        setAuthState({ session: null, status: 'unauthenticated' });
                    }
                } else {
                    // Session is valid, set it
                    setAuthState({ session, status: 'authenticated' });

                    // Schedule token refresh
                    scheduleTokenRefresh(session.expiresAt);
                }
            } else {
                // No session found
                setAuthState({ session: null, status: 'unauthenticated' });
            }
        } catch (error) {
            console.error('Error loading auth session:', error);
            setAuthState({ session: null, status: 'unauthenticated' });
        }
    };

    /**
     * Persist the authentication session to storage
     */
    // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- sync storage ops; async signature matches interface; return type inferred
    const persistSession = async (session: AuthSession | null) => {
        try {
            if (session) {
                secureTokenStorage.setSession(JSON.stringify(session));
            } else {
                secureTokenStorage.removeSession();
            }
        } catch (error) {
            console.error('Error persisting auth session:', error);
        }
    };

    /**
     * Schedule a token refresh before expiration
     */
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- return type inferred from implementation
    const scheduleTokenRefresh = (expiresAt: number) => {
        // Clear any existing refresh timer
        if (refreshTimerId) {
            clearTimeout(refreshTimerId);
        }

        // Calculate when to refresh (5 minutes before expiration)
        const timeUntilRefresh = expiresAt - Date.now() - REFRESH_BUFFER_TIME;

        // Only schedule if we need to refresh in the future
        if (timeUntilRefresh > 0) {
            const timerId = setTimeout(async () => {
                try {
                    await handleRefreshToken();
                } catch (error) {
                    console.error('Auto token refresh failed:', error);
                    // If refresh fails during auto-refresh, we'll keep the current session
                    // until it expires, at which point the user will be logged out
                }
            }, timeUntilRefresh);

            setRefreshTimerId(timerId);
        }
    };

    /**
     * Sign in with email and password
     */
    const signIn = async (email: string, password: string): Promise<void> => {
        try {
            setAuthState((prev) => ({ ...prev, status: 'loading' }));

            const session = await login(email, password);
            setAuthState({ session, status: 'authenticated' });

            // Schedule token refresh
            scheduleTokenRefresh(session.expiresAt);
        } catch (error) {
            console.error('Sign in error:', error);
            setAuthState({ session: null, status: 'unauthenticated' });
            throw error;
        }
    };

    /**
     * Register a new user
     */
    const signUp = async (userData: RegisterData): Promise<void> => {
        try {
            setAuthState((prev) => ({ ...prev, status: 'loading' }));

            const session = await register(userData);
            setAuthState({ session, status: 'authenticated' });

            // Schedule token refresh
            scheduleTokenRefresh(session.expiresAt);
        } catch (error) {
            console.error('Sign up error:', error);
            setAuthState({ session: null, status: 'unauthenticated' });
            throw error;
        }
    };

    /**
     * Sign out the current user
     */
    // eslint-disable-next-line @typescript-eslint/require-await -- sync-only path; async for interface contract compliance
    const signOut = async (): Promise<void> => {
        try {
            // Clear any scheduled token refresh
            if (refreshTimerId) {
                clearTimeout(refreshTimerId);
                setRefreshTimerId(null);
            }

            // Remove session from storage
            secureTokenStorage.removeSession();

            // Update state
            setAuthState({ session: null, status: 'unauthenticated' });
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    /**
     * Handle MFA verification
     */
    const handleMfaVerification = async (code: string, tempToken: string): Promise<void> => {
        try {
            setAuthState((prev) => ({ ...prev, status: 'loading' }));

            const session = await verifyMfa(code, tempToken);
            setAuthState({ session, status: 'authenticated' });

            // Schedule token refresh
            scheduleTokenRefresh(session.expiresAt);
        } catch (error) {
            console.error('MFA verification error:', error);
            setAuthState({ session: null, status: 'unauthenticated' });
            throw error;
        }
    };

    /**
     * Handle social login (OAuth)
     */
    const handleSocialLogin = async (provider: string, tokenData: SocialTokenData): Promise<void> => {
        try {
            setAuthState((prev) => ({ ...prev, status: 'loading' }));

            const session = await socialLogin(provider, tokenData);
            setAuthState({ session, status: 'authenticated' });

            // Schedule token refresh
            scheduleTokenRefresh(session.expiresAt);
        } catch (error) {
            console.error('Social login error:', error);
            setAuthState({ session: null, status: 'unauthenticated' });
            throw error;
        }
    };

    /**
     * Refresh the authentication token
     */
    const handleRefreshToken = async (): Promise<void> => {
        try {
            // Only attempt refresh if we have a session
            if (!authState.session) {
                throw new Error('No session to refresh');
            }

            const newSession = await refreshTokenApi();
            setAuthState({ session: newSession, status: 'authenticated' });

            // Schedule the next token refresh
            scheduleTokenRefresh(newSession.expiresAt);

            return;
        } catch (error) {
            console.error('Token refresh error:', error);
            // On refresh failure, user must re-authenticate
            setAuthState({ session: null, status: 'unauthenticated' });
            throw error;
        }
    };

    /**
     * Get user information from token
     */
    const getUserFromToken = (token: string): any => {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    // Load the persisted session on mount, preceded by a one-time migration
    useEffect(() => {
        // DEMO_MODE — Skip real auth, set fake authenticated session
        if (DEMO_MODE) {
            setAuthState({
                session: {
                    accessToken:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXItMDAxIiwibmFtZSI6IkRlbW8gVXNlciIsImlhdCI6MTkwMDAwMDAwMCwiZXhwIjoxOTAwMDg2NDAwfQ.demo-sig',
                    refreshToken: 'demo-refresh-xxx',
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
                    userId: 'demo-user-001',
                },
                status: 'authenticated',
            });
            return; // DEMO_MODE
        }
        migrateFromAsyncStorage().then(() => {
            loadPersistedSession();
        });

        // Clean up the refresh timer on unmount
        return () => {
            if (refreshTimerId) {
                clearTimeout(refreshTimerId);
            }
        };
    }, []);

    // Persist the session whenever it changes
    useEffect(() => {
        if (DEMO_MODE) {
            return;
        } // DEMO_MODE
        persistSession(authState.session);
    }, [authState.session]);

    // Combine state and methods to provide through context
    const contextValue: AuthContextType = {
        ...authState,
        signIn,
        signUp,
        signOut,
        handleMfaVerification,
        handleSocialLogin,
        handleRefreshToken,
        getUserFromToken,
        isLoading,
        isAuthenticated,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the auth context
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
