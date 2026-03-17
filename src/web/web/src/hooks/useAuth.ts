import axios from 'axios'; // axios 1.4+
import { useState, useEffect, useContext, useCallback } from 'react';
import { API_BASE_URL } from 'shared/constants/api';
import { WEB_AUTH_ROUTES } from 'shared/constants/routes';
import { AuthSession, AuthUser } from 'shared/types/auth.types';

import { useSafeNavRouter as useRouter } from '@/hooks/useSafeRouter';

import { AuthContext } from '../context/AuthContext';

/** Shape returned by the useAuth hook */
interface UseAuthReturn {
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (data: { name: string; email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
    getProfile: () => Promise<unknown>;
    session: AuthSession | null;
    userId: string;
    user: AuthUser | null;
    status: 'authenticated' | 'loading' | 'unauthenticated';
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AxiosErrorShape {
    response?: {
        data?: {
            message?: string;
        };
    };
}

/**
 * Hook that provides authentication-related functionality
 * including login, registration, logout, and session management
 */
export const useAuth = (): UseAuthReturn => {
    const router = useRouter();
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Login with email and password
     * @param credentials User credentials (email and password)
     * @returns The authentication session on success
     */
    const login = async (credentials: { email: string; password: string }): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post<AuthSession>(`${API_BASE_URL}/auth/login`, credentials);
            const session: AuthSession = response.data;

            // Update the session in the auth context
            auth.setSession(session);

            // Navigate to home page after successful login
            void router.push('/');
        } catch (err: unknown) {
            const axiosErr = err as AxiosErrorShape;
            setError(axiosErr?.response?.data?.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Register a new user account
     * @param data User registration data
     * @returns The registration response data
     */
    const register = async (data: { name: string; email: string; password: string }): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            await axios.post(`${API_BASE_URL}/auth/register`, data);

            // Navigate to login page after successful registration
            void router.push(WEB_AUTH_ROUTES.LOGIN);
        } catch (err: unknown) {
            const axiosErr = err as AxiosErrorShape;
            setError(axiosErr?.response?.data?.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout the current user
     */
    const logout = async (): Promise<void> => {
        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/auth/logout`);

            // Clear the session in the auth context
            auth.setSession(null);

            // Navigate to login page after logout
            void router.push(WEB_AUTH_ROUTES.LOGIN);
        } catch (err) {
            console.error('Logout error:', err);

            // Even if server logout fails, clear the session locally
            auth.setSession(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Check if the current session is valid
     */
    const checkSession = useCallback(async (): Promise<void> => {
        if (auth.status !== 'loading') {
            return;
        }

        try {
            const response = await axios.get<AuthSession | null>(`${API_BASE_URL}/auth/session`);
            if (response.data) {
                auth.setSession(response.data);
            } else {
                auth.setSession(null);
            }
        } catch (_err) {
            auth.setSession(null);
        }
    }, [auth]);

    // Check session on component mount
    useEffect(() => {
        void checkSession();
    }, [checkSession]);

    // Set up axios interceptor to add authorization header
    useEffect(() => {
        const interceptor = axios.interceptors.request.use((config) => {
            if (auth.session?.accessToken) {
                config.headers.Authorization = `Bearer ${auth.session.accessToken}`;
            }
            return config;
        });

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, [auth.session]);

    // Computed convenience properties derived from session
    const userId = auth.session?.userId ?? '';
    const user = auth.session?.user ?? null;

    /**
     * Fetch the current user's profile from the backend
     */
    const getProfile = async (): Promise<unknown> => {
        try {
            const response = await axios.get<unknown>(`${API_BASE_URL}/auth/profile`);
            return response.data;
        } catch (err) {
            console.error('Error fetching profile:', err);
            throw err;
        }
    };

    return {
        login,
        register,
        logout,
        checkSession,
        getProfile,
        session: auth.session,
        userId,
        user,
        status: auth.status,
        isAuthenticated: auth.status === 'authenticated',
        isLoading: auth.status === 'loading' || loading,
        error,
    };
};
