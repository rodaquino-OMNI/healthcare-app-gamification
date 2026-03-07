/**
 * Analytics Utility
 *
 * Provides comprehensive analytics tracking functionality for the AUSTA SuperApp,
 * enabling tracking of user interactions, journey-specific events, and
 * gamification-related activities.
 *
 * This utility supports tracking through multiple analytics platforms:
 * - Google Analytics 4 for behavior tracking
 * - Datadog RUM for performance monitoring
 * - Sentry for error tracking
 *
 * @package react-ga4 ^2.1.0
 * @package @sentry/nextjs ^7.60.1
 * @package @datadog/browser-rum ^4.37.0
 */

import ReactGA from 'react-ga4'; // v2.1.0
import * as Sentry from '@sentry/nextjs'; // v7.60.1
import { datadogRum } from '@datadog/browser-rum'; // v4.37.0

import { webConfig } from '../constants/config';
import { JOURNEY_IDS } from 'shared/utils/index';

// Define application version from environment variables
const APP_VERSION = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development';
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';

/**
 * Initializes analytics services with proper configuration
 *
 * @param options - Configuration options for analytics initialization
 * @returns A promise that resolves when all analytics services are initialized
 */
export const initAnalytics = async (options?: {
    enableAnalytics?: boolean;
    userId?: string;
    userProperties?: Record<string, unknown>;
}): Promise<void> => {
    try {
        // Default to enabled in production, disabled in development
        const analyticsEnabled = options?.enableAnalytics ?? webConfig.analytics.enabled;

        // Initialize Google Analytics
        ReactGA.initialize(webConfig.analytics.trackingId, {
            gaOptions: {
                sampleRate: webConfig.analytics.sampleRate,
                userId: options?.userId,
            },
            testMode: !analyticsEnabled,
        });

        // Initialize Datadog RUM
        datadogRum.init({
            applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID || '',
            clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
            site: 'datadoghq.com',
            service: 'austa-superapp-web',
            env: ENVIRONMENT,
            version: APP_VERSION,
            sampleRate: 100,
            trackInteractions: true,
            trackResources: true,
            trackLongTasks: true,
            defaultPrivacyLevel: 'mask-user-input',
        });

        // Set tracking enabled state
        datadogRum.setTrackingConsent(analyticsEnabled ? 'granted' : 'not-granted');

        // Set user properties if authenticated
        if (options?.userId) {
            setUserId(options.userId);

            // Set additional user properties if provided
            if (options?.userProperties) {
                setUserProperties(options.userProperties);
            }
        }

        // Set global event parameters
        ReactGA.set({
            app_version: APP_VERSION,
            environment: ENVIRONMENT,
        });

        // Log initialization event
        trackEvent('analytics_initialized', {
            enabled: analyticsEnabled,
            timestamp: new Date().toISOString(),
        });

        console.log('Analytics initialized successfully');
    } catch (error) {
        console.error('Error initializing analytics:', error);
        Sentry.captureException(error);
    }
};

/**
 * Tracks when a user views a screen in the application
 *
 * @param screenName - The name of the screen or page being viewed
 * @param journeyId - Optional journey identifier (health, care, plan)
 * @param params - Optional additional parameters to include with the event
 */
export const trackScreenView = (screenName: string, journeyId?: string, params?: Record<string, unknown>): void => {
    try {
        if (!screenName) {
            console.warn('Screen name is required for tracking');
            return;
        }

        // Set current screen in Google Analytics
        ReactGA.set({ page: screenName });

        // Prepare event parameters
        const eventParams: Record<string, unknown> = {
            page_title: screenName,
            page_path: window.location.pathname,
            ...params,
        };

        // Add journey context if provided
        if (journeyId) {
            eventParams.journey_id = journeyId;
            eventParams.journey = journeyId; // For backward compatibility
        }

        // Log page_view event
        ReactGA.send({ hitType: 'pageview', ...eventParams });

        // Track in Datadog RUM
        datadogRum.addAction('page_view', {
            name: screenName,
            journey: journeyId,
            ...params,
        });
    } catch (error) {
        console.error('Error tracking screen view:', error);
        Sentry.captureException(error);
    }
};

/**
 * Tracks a custom event with the analytics services
 *
 * @param eventName - The name of the event to track
 * @param params - Optional additional parameters to include with the event
 */
export const trackEvent = (eventName: string, params?: Record<string, unknown>): void => {
    try {
        if (!eventName) {
            console.warn('Event name is required for tracking');
            return;
        }

        // Format event name to comply with GA4 naming conventions
        // Convert to snake_case if not already
        const formattedEventName = eventName
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '');

        // Log event in Google Analytics
        ReactGA.event(formattedEventName, params);

        // Track in Datadog RUM
        datadogRum.addAction(formattedEventName, params);
    } catch (error) {
        console.error('Error tracking event:', error);
        Sentry.captureException(error);
    }
};

/**
 * Tracks a journey-specific event with appropriate context
 *
 * @param journeyId - The journey identifier (health, care, plan)
 * @param eventName - The name of the event to track
 * @param params - Optional additional parameters to include with the event
 */
export const trackJourneyEvent = (journeyId: string, eventName: string, params?: Record<string, unknown>): void => {
    try {
        if (!journeyId || !eventName) {
            console.warn('Journey ID and event name are required for journey event tracking');
            return;
        }

        // Add journey context to parameters
        const journeyParams = {
            ...params,
            journey_id: journeyId,
            journey: journeyId, // For backward compatibility
        };

        // Format event name with journey prefix for better categorization
        const journeyEventName = `${journeyId}_${eventName}`;

        // Track the event with journey context
        trackEvent(journeyEventName, journeyParams);
    } catch (error) {
        console.error('Error tracking journey event:', error);
        Sentry.captureException(error);
    }
};

/**
 * Tracks a health journey-specific event
 *
 * @param eventName - The name of the event to track
 * @param params - Optional additional parameters to include with the event
 */
export const trackHealthEvent = (eventName: string, params?: Record<string, unknown>): void => {
    trackJourneyEvent(JOURNEY_IDS.HEALTH, eventName, params);
};

/**
 * Tracks a care journey-specific event
 *
 * @param eventName - The name of the event to track
 * @param params - Optional additional parameters to include with the event
 */
export const trackCareEvent = (eventName: string, params?: Record<string, unknown>): void => {
    trackJourneyEvent(JOURNEY_IDS.CARE, eventName, params);
};

/**
 * Tracks a plan journey-specific event
 *
 * @param eventName - The name of the event to track
 * @param params - Optional additional parameters to include with the event
 */
export const trackPlanEvent = (eventName: string, params?: Record<string, unknown>): void => {
    trackJourneyEvent(JOURNEY_IDS.PLAN, eventName, params);
};

/**
 * Tracks a gamification-related event
 *
 * @param eventName - The name of the event to track
 * @param params - Optional additional parameters to include with the event
 */
export const trackGamificationEvent = (eventName: string, params?: Record<string, unknown>): void => {
    // Format event name with gamification prefix
    const gamificationEventName = `gamification_${eventName}`;

    // Track the event
    trackEvent(gamificationEventName, params);
};

/**
 * Tracks when a user unlocks an achievement
 *
 * @param achievementId - The unique identifier of the achievement
 * @param achievementName - The name of the achievement
 * @param journeyId - The journey associated with the achievement
 * @param xpEarned - The amount of XP earned for this achievement
 */
export const trackAchievementUnlocked = (
    achievementId: string,
    achievementName: string,
    journeyId: string,
    xpEarned: number
): void => {
    trackGamificationEvent('achievement_unlocked', {
        achievement_id: achievementId,
        achievement_name: achievementName,
        journey_id: journeyId,
        journey: journeyId, // For backward compatibility
        xp_earned: xpEarned,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Tracks when a user levels up in the gamification system
 *
 * @param newLevel - The new level achieved
 * @param xpEarned - The amount of XP earned for this level up
 */
export const trackLevelUp = (newLevel: number, xpEarned: number): void => {
    trackGamificationEvent('level_up', {
        new_level: newLevel,
        xp_earned: xpEarned,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Tracks an error that occurred in the application
 *
 * @param errorName - The name or category of the error
 * @param error - The error object
 * @param context - Additional context about the error
 */
export const trackError = (errorName: string, error: Error, context?: Record<string, unknown>): void => {
    // Report to Sentry
    Sentry.captureException(error, {
        tags: { error_name: errorName },
        contexts: { additional: context },
    });

    // Track error event in analytics
    trackEvent('app_error', {
        error_name: errorName,
        error_message: error.message,
        error_stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
        ...context,
    });
};

/**
 * Tracks a performance-related metric for monitoring
 *
 * @param metricName - The name of the metric
 * @param value - The numeric value of the metric
 * @param context - Additional context about the metric
 */
export const trackPerformanceMetric = (metricName: string, value: number, context?: Record<string, unknown>): void => {
    // Track in Datadog RUM
    datadogRum.addTiming(metricName, value);

    // Also track as an event for better visibility
    trackEvent('performance_metric', {
        metric_name: metricName,
        value,
        ...context,
    });
};

/**
 * Sets user properties for analytics segmentation
 *
 * @param properties - Object containing user properties
 */
export const setUserProperties = (properties: Record<string, unknown>): void => {
    try {
        // Set user properties in GA4
        ReactGA.set(properties);

        // Set user attributes in Datadog RUM
        datadogRum.setUser({
            ...datadogRum.getUser(),
            ...properties,
        });
    } catch (error) {
        console.error('Error setting user properties:', error);
        Sentry.captureException(error);
    }
};

/**
 * Sets the user ID for analytics tracking
 *
 * @param userId - The unique identifier for the user
 */
export const setUserId = (userId: string): void => {
    try {
        if (!userId) {
            console.warn('User ID is required for user identification');
            return;
        }

        // Set user ID in GA4
        ReactGA.set({ user_id: userId });

        // Set user ID in Datadog RUM
        datadogRum.setUser({ id: userId });

        // Set user ID in Sentry for error reporting context
        Sentry.setUser({ id: userId });
    } catch (error) {
        console.error('Error setting user ID:', error);
        Sentry.captureException(error);
    }
};

/**
 * Resets all analytics data, typically called on logout
 */
export const resetAnalyticsData = (): void => {
    try {
        // Track logout event before resetting
        trackEvent('user_logout', {
            timestamp: new Date().toISOString(),
        });

        // Reset GA4 data
        ReactGA.set({ user_id: undefined });

        // Reset Sentry user
        Sentry.setUser(null);

        // Reset Datadog RUM user
        datadogRum.removeUser();
    } catch (error) {
        console.error('Error resetting analytics data:', error);
        Sentry.captureException(error);
    }
};
