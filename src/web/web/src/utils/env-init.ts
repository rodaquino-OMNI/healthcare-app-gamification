/**
 * Environment Initialization Script
 * 
 * This script creates a browser-compatible environment variable object
 * that can be used by client-side code. This prevents "process is not defined"
 * errors in the browser while allowing consistent environment variable access.
 */

// Create window.__ENV__ object if it doesn't exist
export const initEnvironment = (): void => {
  if (typeof window !== 'undefined') {
    // Initialize the __ENV__ object if not already present
    (window as any).__ENV__ = (window as any).__ENV__ || {};
    
    // Capture Next.js public environment variables
    const envKeys = Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'));
    
    // Add all public environment variables to window.__ENV__
    envKeys.forEach(key => {
      const cleanKey = key.replace('NEXT_PUBLIC_', '');
      (window as any).__ENV__[cleanKey] = process.env[key];
    });
    
    // Add API URL for convenience
    if (!("API_URL" in (window as any).__ENV__)) {
      (window as any).__ENV__.API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || 'https://api.austa.com.br';
    }
    
    // Add environment
    if (!("ENVIRONMENT" in (window as any).__ENV__)) {
      (window as any).__ENV__.ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'development';
    }
    
    // Add feature flags
    if (!("FEATURE_GAMIFICATION" in (window as any).__ENV__)) {
      (window as any).__ENV__.FEATURE_GAMIFICATION = process.env.NEXT_PUBLIC_FEATURE_GAMIFICATION !== 'false';
    }
  }
};

export default initEnvironment;