import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // next/navigation 13.0+

import { login, logout, getProfile } from '@/api/auth';
import { AuthSession } from 'shared/types/auth.types';
import { WEB_AUTH_ROUTES } from 'shared/constants/routes';

/**
 * Authentication context interface
 * Defines the shape of the authentication context
 */
interface AuthContextType {
    /**
     * Current authentication session if available, null otherwise
     */
    session: AuthSession | null;

    /**
     * Current authentication status
     */
    status: 'authenticated' | 'loading' | 'unauthenticated';

    /**
     * Sets the authentication session
     * @param session - The authentication session or null to clear
     */
    setSession: (session: AuthSession | null) => void;

    /**
     * Logs in a user with the provided credentials
     * @param email - User's email address
     * @param password - User's password
     * @returns A promise resolving to the authentication session
     */
    login: (email: string, password: string) => Promise<AuthSession>;

    /**
     * Logs out the current user
     * @returns A promise that resolves when logout is complete
     */
    logout: () => Promise<void>;

    /**
     * Retrieves the current user's profile
     * @returns A promise resolving to the user profile
     */
    getProfile: () => Promise<unknown>;
}

/**
 * Default context value
 */
const defaultContext: AuthContextType = {
    session: null,
    status: 'loading',
    setSession: () => {},
    login: async () => {
        throw new Error('AuthContext not initialized');
    },
    logout: async () => {
        throw new Error('AuthContext not initialized');
    },
    getProfile: async () => {
        throw new Error('AuthContext not initialized');
    },
};

/**
 * Authentication context
 * Provides authentication state and functions throughout the application
 */
export const AuthContext = createContext<AuthContextType>(defaultContext);

/**
 * Authentication provider props
 */
interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * Authentication Provider component
 * Manages authentication state and provides authentication functions to child components
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const router = useRouter();

    // Authentication state
    const [session, setSessionState] = useState<AuthSession | null>(null);
    const [status, setStatus] = useState<'authenticated' | 'loading' | 'unauthenticated'>('loading');

    /**
     * Updates the authentication session and status
     */
    const setSession = (newSession: AuthSession | null) => {
        setSessionState(newSession);
        setStatus(newSession ? 'authenticated' : 'unauthenticated');

        // Store session in localStorage if available (for persistence)
        if (typeof window !== 'undefined') {
            if (newSession) {
                localStorage.setItem('auth_session', JSON.stringify(newSession));
            } else {
                localStorage.removeItem('auth_session');
            }
        }
    };

    /**
     * Check for existing session in localStorage on component mount
     */
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedSession = localStorage.getItem('auth_session');

            if (storedSession) {
                try {
                    const parsedSession = JSON.parse(storedSession) as AuthSession;

                    // Check if the token is expired
                    if (parsedSession.expiresAt > Date.now()) {
                        setSession(parsedSession);
                    } else {
                        // Token is expired, clear the session
                        setSession(null);
                    }
                } catch (error) {
                    console.error('Failed to parse stored session:', error);
                    setSession(null);
                }
            } else {
                setStatus('unauthenticated');
            }
        }
    }, []);

    /**
     * Handles user login
     */
    const handleLogin = async (email: string, password: string): Promise<AuthSession> => {
        try {
            const authSession = await login(email, password);
            setSession(authSession);
            return authSession;
        } catch (error) {
            setSession(null);
            throw error;
        }
    };

    /**
     * Handles user logout
     */
    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setSession(null);
            router.push(WEB_AUTH_ROUTES.LOGIN);
        }
    };

    /**
     * Retrieves user profile
     */
    const handleGetProfile = async (): Promise<unknown> => {
        if (!session) {
            throw new Error('No active session');
        }

        try {
            return await getProfile();
        } catch (error) {
            // If we get an unauthorized error, clear the session
            if ((error as { response?: { status?: number } })?.response?.status === 401) {
                setSession(null);
            }
            throw error;
        }
    };

    const value: AuthContextType = {
        session,
        status,
        setSession,
        login: handleLogin,
        logout: handleLogout,
        getProfile: handleGetProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
