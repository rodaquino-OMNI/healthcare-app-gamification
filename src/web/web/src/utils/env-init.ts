/**
 * Environment Initialization Script
 *
 * This script creates a browser-compatible environment
 * variable object that can be used by client-side code.
 * This prevents "process is not defined" errors in the
 * browser while allowing consistent env variable access.
 */

// Add declaration for Node.js process in browser context
declare const process: {
    env: {
        [key: string]: string | undefined;
        NODE_ENV?: string;
        NEXT_PUBLIC_API_URL?: string;
        API_BASE_URL?: string;
        NEXT_PUBLIC_ENVIRONMENT?: string;
        NEXT_PUBLIC_FEATURE_GAMIFICATION?: string;
    };
};

interface WindowEnv {
    [key: string]: string | boolean | undefined;
    API_URL?: string;
    ENVIRONMENT?: string;
    FEATURE_GAMIFICATION?: boolean;
}

interface WindowWithEnv extends Window {
    __ENV__: WindowEnv;
}

function getWindowEnv(): WindowEnv {
    const win = window as unknown as WindowWithEnv;
    if (!win.__ENV__) {
        win.__ENV__ = {};
    }
    return win.__ENV__;
}

// Create window.__ENV__ object if it doesn't exist
export const initEnvironment = (): void => {
    if (typeof window !== 'undefined') {
        const env = getWindowEnv();

        // Capture Next.js public environment variables
        const envKeys =
            typeof process !== 'undefined' && process.env
                ? Object.keys(process.env).filter((key) => key.startsWith('NEXT_PUBLIC_'))
                : [];

        // Add all public environment variables to env
        envKeys.forEach((key) => {
            if (typeof process !== 'undefined' && process.env && process.env[key]) {
                const cleanKey = key.replace('NEXT_PUBLIC_', '');
                env[cleanKey] = process.env[key];
            }
        });

        // Add API URL for convenience
        if (!('API_URL' in env)) {
            const apiUrl =
                typeof process !== 'undefined' && process.env
                    ? process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL
                    : null;
            env.API_URL = apiUrl || 'https://api.austa.com.br';
        }

        // Add environment
        if (!('ENVIRONMENT' in env)) {
            const environment =
                typeof process !== 'undefined' && process.env
                    ? process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV
                    : null;
            env.ENVIRONMENT = environment || 'development';
        }

        // Add feature flags
        if (!('FEATURE_GAMIFICATION' in env)) {
            const featureFlag =
                typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_FEATURE_GAMIFICATION : null;
            env.FEATURE_GAMIFICATION = featureFlag !== 'false';
        }
    }
};

export default initEnvironment;
