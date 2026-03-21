/**
 * Environment Configuration
 *
 * This module provides a safe way to access environment variables in both server and client environments.
 * It handles the common issue of `process is not defined` errors in browser contexts.
 */

// Define the type for our environment configuration
export interface EnvConfig {
    API_BASE_URL: string;
    ENVIRONMENT: string;
    FEATURE_GAMIFICATION: boolean;
    FEATURE_TELEMEDICINE: boolean;
    FEATURE_WEARABLE_SYNC: boolean;
    [key: string]: unknown;
}

/**
 * Safe environment variable getter that works in both Node.js and browser environments
 * @param key - The environment variable key to access
 * @param defaultValue - Default value if the environment variable is not found
 */
const getEnv = <T>(key: string, defaultValue: T): T => {
    // Check Node.js environment
    if (typeof process !== 'undefined' && process.env) {
        // Check for direct environment variable
        if (process.env[key] !== undefined) {
            // Convert string values to appropriate types
            const value = process.env[key];
            if (typeof defaultValue === 'boolean') {
                return (value === 'true') as unknown as T;
            }
            if (typeof defaultValue === 'number') {
                return (Number(value) || defaultValue) as unknown as T;
            }
            return value as unknown as T;
        }

        // Check for Next.js public environment variables
        const nextPublicKey = `NEXT_PUBLIC_${key}`;
        if (process.env[nextPublicKey] !== undefined) {
            const value = process.env[nextPublicKey];
            if (typeof defaultValue === 'boolean') {
                return (value === 'true') as unknown as T;
            }
            if (typeof defaultValue === 'number') {
                return (Number(value) || defaultValue) as unknown as T;
            }
            return value as unknown as T;
        }
    }

    // Check for browser environment variables using window.__ENV__ pattern
    if (typeof window !== 'undefined') {
        const win = window as typeof window & { __ENV__?: Record<string, unknown> };
        if (win.__ENV__ && win.__ENV__[key] !== undefined) {
            return win.__ENV__[key] as T;
        }
    }

    return defaultValue;
};

/**
 * Environment configuration with safe fallbacks
 */
export const env: EnvConfig = {
    API_BASE_URL: getEnv('API_BASE_URL', 'https://api.austa.com.br'),
    ENVIRONMENT: getEnv('ENVIRONMENT', 'development'),
    FEATURE_GAMIFICATION: getEnv('FEATURE_GAMIFICATION', true),
    FEATURE_TELEMEDICINE: getEnv('FEATURE_TELEMEDICINE', true),
    FEATURE_WEARABLE_SYNC: getEnv('FEATURE_WEARABLE_SYNC', true),
    ANALYTICS_TRACKING_ID: getEnv('ANALYTICS_TRACKING_ID', ''),
    SENTRY_DSN: getEnv('SENTRY_DSN', ''),
};

export default env;
