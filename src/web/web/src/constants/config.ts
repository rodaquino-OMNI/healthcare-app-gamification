/**
 * Web Application Configuration
 *
 * This module centralizes configuration settings for the AUSTA SuperApp web application,
 * including API endpoints, feature flags, and other application-wide settings.
 */

import { apiConfig } from 'src/web/shared/config/apiConfig';
import { defaultLocale, supportedLocales } from 'src/web/shared/config/i18nConfig';
import { JOURNEY_IDS } from 'src/web/shared/constants/journeys';

/**
 * Feature flags for controlling feature availability
 * These can be overridden by environment variables in different environments
 */
const featureFlags = {
    enableGamification: process.env.ENABLE_GAMIFICATION !== 'false',
    enableTelemedicine: process.env.ENABLE_TELEMEDICINE !== 'false',
    enableAiAssistant: process.env.ENABLE_AI_ASSISTANT === 'true',
    enableSocialFeatures: process.env.ENABLE_SOCIAL_FEATURES === 'true',
    enableWearableSync: process.env.ENABLE_WEARABLE_SYNC !== 'false',
    enableClaimAutoProcessing: process.env.ENABLE_CLAIM_AUTO_PROCESSING !== 'false',
    enableNewMetricsUi: process.env.ENABLE_NEW_METRICS_UI === 'true',
    enableJourneyAnimations: process.env.ENABLE_JOURNEY_ANIMATIONS !== 'false',
};

/**
 * Analytics configuration
 */
const analyticsConfig = {
    enabled: process.env.NODE_ENV === 'production',
    trackingId: process.env.ANALYTICS_TRACKING_ID || '',
    sampleRate: 100, // Percentage of users to track
};

/**
 * Web application configuration object
 * Contains all settings required for the web application
 */
export const webConfig = {
    // Environment information
    env: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',

    // API endpoints
    apiURL: apiConfig.baseURL,
    healthJourney: apiConfig.journeys.health,
    careJourney: apiConfig.journeys.care,
    planJourney: apiConfig.journeys.plan,

    // Journey IDs for consistent reference
    journeyIds: JOURNEY_IDS,

    // Internationalization settings
    defaultLocale,
    supportedLocales,

    // Feature flags for toggling functionality
    features: featureFlags,

    // Analytics configuration
    analytics: analyticsConfig,

    // Performance settings
    performanceTracking: true,
    errorTracking: true,

    // UI settings
    animationDuration: 300, // ms
    toastDuration: 5000, // ms

    // Cache settings
    cacheTTL: {
        user: 5 * 60 * 1000, // 5 minutes
        journeyData: 2 * 60 * 1000, // 2 minutes
        staticData: 24 * 60 * 60 * 1000, // 24 hours
    },

    // Session settings
    sessionTimeout: 30 * 60 * 1000, // 30 minutes of inactivity
};
