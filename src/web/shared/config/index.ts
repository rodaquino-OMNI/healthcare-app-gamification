/**
 * Configuration Index Module
 *
 * This module centralizes all configuration exports for the AUSTA SuperApp.
 * It re-exports individual configuration modules and provides a unified
 * configuration object for easier consumption throughout the application.
 *
 * @module config
 */

// Import individual configurations
import { apiConfig } from './apiConfig';
import { supportedLocales, defaultLocale } from './i18nConfig';

// Re-export individual configurations for direct access
export { apiConfig, supportedLocales, defaultLocale };

/**
 * Unified configuration object that consolidates all application settings.
 * This allows importing all configuration with a single import statement.
 */
export const config = {
    /**
     * API related configuration
     * Includes base URL and journey-specific endpoints
     */
    api: apiConfig,

    /**
     * Internationalization configuration
     * Includes supported locales and default locale
     */
    i18n: {
        supportedLocales,
        defaultLocale,
    },
};
