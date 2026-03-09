/**
 * Analytics Utility
 *
 * Provides comprehensive analytics tracking functionality
 * for the AUSTA SuperApp, enabling tracking of user
 * interactions, journey-specific events, and
 * gamification-related activities.
 *
 * This utility supports tracking through multiple platforms:
 * - Google Analytics 4 for behavior tracking
 * - Datadog RUM for performance monitoring
 * - Sentry for error tracking
 *
 * @package react-ga4 ^2.1.0
 * @package @sentry/nextjs ^7.60.1
 * @package @datadog/browser-rum ^4.37.0
 */

import { datadogRum } from '@datadog/browser-rum'; // v4.37.0
import * as Sentry from '@sentry/nextjs'; // v7.60.1
import ReactGA from 'react-ga4'; // v2.1.0
import { JOURNEY_IDS } from 'shared/utils/index';

import { webConfig } from '../constants/config';

type AnalyticsParams = Record<string, unknown>;

// Define application version from environment variables
const APP_VERSION = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development';
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';

/**
 * Initializes analytics services with proper configuration
 *
 * @param options - Configuration options for analytics init
 * @returns A promise that resolves when services initialize
 */
export const initAnalytics = (options?: {
    enableAnalytics?: boolean;
    userId?: string;
    userProperties?: AnalyticsParams;
}): void => {
    try {
        // Default to enabled in production
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
            trackUserInteractions: true,
            trackResources: true,
            trackLongTasks: true,
            defaultPrivacyLevel: 'mask-user-input',
        });

        // Set tracking enabled state
        datadogRum.setTrackingConsent(analyticsEnabled ? 'granted' : 'not-granted');

        // Set user properties if authenticated
        if (options?.userId) {
            setUserId(options.userId);

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
    } catch (error) {
        Sentry.captureException(error);
    }
};

/**
 * Tracks when a user views a screen in the application
 *
 * @param screenName - The name of the screen being viewed
 * @param journeyId - Optional journey identifier
 * @param params - Optional additional parameters
 */
export const trackScreenView = (screenName: string, journeyId?: string, params?: AnalyticsParams): void => {
    try {
        if (!screenName) {
            return;
        }

        // Set current screen in Google Analytics
        ReactGA.set({ page: screenName });

        // Prepare event parameters
        const eventParams: AnalyticsParams = {
            page_title: screenName,
            page_path: window.location.pathname,
            ...params,
        };

        // Add journey context if provided
        if (journeyId) {
            eventParams.journey_id = journeyId;
            eventParams.journey = journeyId;
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
        Sentry.captureException(error);
    }
};

/**
 * Tracks a custom event with the analytics services
 *
 * @param eventName - The name of the event to track
 * @param params - Optional additional parameters
 */
export const trackEvent = (eventName: string, params?: AnalyticsParams): void => {
    try {
        if (!eventName) {
            return;
        }

        // Format event name to comply with GA4 conventions
        const formattedEventName = eventName
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '');

        // Log event in Google Analytics
        ReactGA.event(formattedEventName, params);

        // Track in Datadog RUM
        datadogRum.addAction(formattedEventName, params);
    } catch (error) {
        Sentry.captureException(error);
    }
};

/**
 * Tracks a journey-specific event with appropriate context
 *
 * @param journeyId - The journey identifier
 * @param eventName - The name of the event to track
 * @param params - Optional additional parameters
 */
export const trackJourneyEvent = (journeyId: string, eventName: string, params?: AnalyticsParams): void => {
    try {
        if (!journeyId || !eventName) {
            return;
        }

        // Add journey context to parameters
        const journeyParams = {
            ...params,
            journey_id: journeyId,
            journey: journeyId,
        };

        // Format event name with journey prefix
        const journeyEventName = `${journeyId}_${eventName}`;

        // Track the event with journey context
        trackEvent(journeyEventName, journeyParams);
    } catch (error) {
        Sentry.captureException(error);
    }
};

/**
 * Tracks a health journey-specific event
 *
 * @param eventName - The name of the event to track
 * @param params - Optional additional parameters
 */
export const trackHealthEvent = (eventName: string, params?: AnalyticsParams): void => {
    trackJourneyEvent(JOURNEY_IDS.HEALTH, eventName, params);
};

/**
 * Tracks a care journey-specific event
 *
 * @param eventName - The name of the event to track
 * @param params - Optional additional parameters
 */
export const trackCareEvent = (eventName: string, params?: AnalyticsParams): void => {
    trackJourneyEvent(JOURNEY_IDS.CARE, eventName, params);
};

/**
 * Tracks a plan journey-specific event
 *
 * @param eventName - The name of the event to track
 * @param params - Optional additional parameters
 */
export const trackPlanEvent = (eventName: string, params?: AnalyticsParams): void => {
    trackJourneyEvent(JOURNEY_IDS.PLAN, eventName, params);
};

/**
 * Tracks a gamification-related event
 *
 * @param eventName - The name of the event to track
 * @param params - Optional additional parameters
 */
export const trackGamificationEvent = (eventName: string, params?: AnalyticsParams): void => {
    const gamificationEventName = `gamification_${eventName}`;
    trackEvent(gamificationEventName, params);
};

/**
 * Tracks when a user unlocks an achievement
 *
 * @param achievementId - The unique identifier
 * @param achievementName - The name of the achievement
 * @param journeyId - The associated journey
 * @param xpEarned - The amount of XP earned
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
        journey: journeyId,
        xp_earned: xpEarned,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Tracks when a user levels up in gamification
 *
 * @param newLevel - The new level achieved
 * @param xpEarned - The amount of XP earned
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
export const trackError = (errorName: string, error: Error, context?: AnalyticsParams): void => {
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
export const trackPerformanceMetric = (metricName: string, value: number, context?: AnalyticsParams): void => {
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
export const setUserProperties = (properties: AnalyticsParams): void => {
    try {
        // Set user properties in GA4
        ReactGA.set(properties);

        // Set user attributes in Datadog RUM
        datadogRum.setUser({
            ...datadogRum.getUser(),
            ...properties,
        });
    } catch (error) {
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
            return;
        }

        // Set user ID in GA4
        ReactGA.set({ user_id: userId });

        // Set user ID in Datadog RUM
        datadogRum.setUser({ id: userId });

        // Set user ID in Sentry
        Sentry.setUser({ id: userId });
    } catch (error) {
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
        if ('removeUser' in datadogRum) {
            (datadogRum as { removeUser: () => void }).removeUser();
        } else {
            datadogRum.setUser({});
        }
    } catch (error) {
        Sentry.captureException(error);
    }
};
