/**
 * Environment Initialization Script
 * 
 * This script creates a browser-compatible environment variable object
 * that can be used by client-side code. This prevents "process is not defined"
 * errors in the browser while allowing consistent environment variable access.
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
  }
};

// Create window.__ENV__ object if it doesn't exist
export const initEnvironment = (): void => {
  if (typeof window !== 'undefined') {
    // Initialize the __ENV__ object if not already present
    (window as any).__ENV__ = (window as any).__ENV__ || {};
    
    // Capture Next.js public environment variables
    // Adding a check for process.env to avoid errors in the browser
    const envKeys = typeof process !== 'undefined' && process.env 
      ? Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
      : [];
    
    // Add all public environment variables to window.__ENV__
    envKeys.forEach(key => {
      if (typeof process !== 'undefined' && process.env && process.env[key]) {
        const cleanKey = key.replace('NEXT_PUBLIC_', '');
        (window as any).__ENV__[cleanKey] = process.env[key];
      }
    });
    
    // Add API URL for convenience
    if (!("API_URL" in (window as any).__ENV__)) {
      const apiUrl = typeof process !== 'undefined' && process.env
        ? (process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL)
        : null;
      (window as any).__ENV__.API_URL = apiUrl || 'https://api.austa.com.br';
    }
    
    // Add environment
    if (!("ENVIRONMENT" in (window as any).__ENV__)) {
      const environment = typeof process !== 'undefined' && process.env
        ? (process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV)
        : null;
      (window as any).__ENV__.ENVIRONMENT = environment || 'development';
    }
    
    // Add feature flags
    if (!("FEATURE_GAMIFICATION" in (window as any).__ENV__)) {
      const featureFlag = typeof process !== 'undefined' && process.env
        ? process.env.NEXT_PUBLIC_FEATURE_GAMIFICATION
        : null;
      (window as any).__ENV__.FEATURE_GAMIFICATION = featureFlag !== 'false';
    }
  }
};

export default initEnvironment;