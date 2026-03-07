import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation'; // next/navigation 13.0+
import axios from 'axios'; // axios 1.4+

import { AuthSession } from 'src/web/shared/types/auth.types';
import { API_BASE_URL } from 'src/web/shared/constants/api';
import { WEB_AUTH_ROUTES } from 'src/web/shared/constants/routes';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook that provides authentication-related functionality
 * including login, registration, logout, and session management
 */
export const useAuth = () => {
    const router = useRouter();
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Login with email and password
     * @param credentials User credentials (email and password)
     * @returns The authentication session on success
     */
    const login = async (credentials: { email: string; password: string }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
            const session: AuthSession = response.data;

            // Update the session in the auth context
            auth.setSession(session);

            // Navigate to home page after successful login
            router.push('/');
            return session;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
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
    const register = async (data: { name: string; email: string; password: string }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, data);

            // Navigate to login page after successful registration
            router.push(WEB_AUTH_ROUTES.LOGIN);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout the current user
     */
    const logout = async () => {
        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/auth/logout`);

            // Clear the session in the auth context
            auth.setSession(null);

            // Navigate to login page after logout
            router.push(WEB_AUTH_ROUTES.LOGIN);
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
    const checkSession = async () => {
        if (auth.status !== 'loading') return;

        try {
            const response = await axios.get(`${API_BASE_URL}/auth/session`);
            if (response.data) {
                auth.setSession(response.data);
            } else {
                auth.setSession(null);
            }
        } catch (err) {
            auth.setSession(null);
        }
    };

    // Check session on component mount
    useEffect(() => {
        checkSession();
    }, []);

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

    return {
        login,
        register,
        logout,
        checkSession,
        session: auth.session,
        status: auth.status,
        isAuthenticated: auth.status === 'authenticated',
        isLoading: auth.status === 'loading' || loading,
        error,
    };
};
