// Analytics services mock implementations
const ReactGA = {
    initialize: (_trackingId: string, _options?: any) => {},
    set: (_fieldsObject: Record<string, any>) => {},
    event: (_params: any) => {},
    send: (_hitType: string, _params?: any) => {},
};

const Sentry = {
    init: (_options: any) => {},
    setUser: (_user: any | null) => {},
    captureException: (_error: Error, _context?: any) => {},
};

const datadogRum = {
    init: (_options: any) => {},
    addAction: (_name: string, _params: any) => {},
    setUser: (_user: any) => {},
    clearUser: () => {},
    addTiming: (_name: string, _time: number) => {},
};

// Define environment-specific constants without using process.env
// Using type string to avoid literal type issues in comparisons
const ENVIRONMENT: string = 'development';
const APP_VERSION = '1.0.0';

// Simple logger implementation that doesn't depend on console
const logger = {
    log: (..._args: any[]): void => {},
    error: (..._args: any[]): void => {},
    warn: (..._args: any[]): void => {},
};

import * as Constants from '../constants/index';

// Default to enabling analytics
let analyticsEnabled = true;

// Analytics service IDs - configured via app.config.js extra or environment variables
const GA_TRACKING_ID =
    (Constants as any).expoConfig?.extra?.gaTrackingId ||
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_GA_TRACKING_ID) ||
    'G-XXXXXXXXXX';
const DD_APP_ID =
    (Constants as any).expoConfig?.extra?.datadogAppId ||
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_DATADOG_APP_ID) ||
    'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';
const DD_CLIENT_TOKEN =
    (Constants as any).expoConfig?.extra?.datadogClientToken ||
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_DATADOG_CLIENT_TOKEN) ||
    'pub_XXXXXXXX';
const SENTRY_DSN =
    (Constants as any).expoConfig?.extra?.sentryDsn ||
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SENTRY_DSN) ||
    'https://example@sentry.io/123456';

/**
 * Initializes the analytics services with user information and application context.
 * @param options Configuration options for analytics initialization
 * @returns A promise that resolves when analytics is initialized
 */
/* eslint-disable @typescript-eslint/require-await -- mock implementation; real integration will be async */
export const initAnalytics = async (
    options: {
        userId?: string;
        userProperties?: Record<string, any>;
        enableAnalytics?: boolean;
    } = {}
): Promise<void> => {
    try {
        // Update analytics enabled flag
        analyticsEnabled = options.enableAnalytics !== false;

        // Initialize Google Analytics
        ReactGA.initialize(GA_TRACKING_ID, {
            gaOptions: {
                userId: options.userId,
            },
            testMode: ENVIRONMENT !== 'production',
        });

        // Initialize Datadog RUM
        datadogRum.init({
            applicationId: DD_APP_ID,
            clientToken: DD_CLIENT_TOKEN,
            env: ENVIRONMENT,
            version: APP_VERSION,
            trackUserInteractions: true,
            trackResources: true,
            trackLongTasks: true,
            trackFrustrations: true,
            service: 'austa-mobile-app',
        });

        // Set up Sentry
        Sentry.init({
            dsn: SENTRY_DSN,
            environment: ENVIRONMENT,
            release: APP_VERSION,
            enableAutoSessionTracking: true,
            tracesSampleRate: 1.0,
        });

        // Set user ID if provided
        if (options.userId) {
            setUserId(options.userId);
        }

        // Set user properties if provided
        if (options.userProperties) {
            setUserProperties(options.userProperties);
        }

        // Set default event parameters
        ReactGA.set({
            app_version: APP_VERSION,
            environment: ENVIRONMENT,
        });

        // Log initialization event
        trackEvent('app_initialized', {
            app_version: APP_VERSION,
            environment: ENVIRONMENT,
        });

        logger.log('Analytics initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize analytics:', error);
        // Continue without analytics to not block the app functionality
    }
};

/**
 * Tracks when a user views a screen in the application.
 * @param screenName The name of the screen being viewed
 * @param journeyId The journey ID the screen belongs to (optional)
 * @param params Additional parameters to include with the event (optional)
 */
export const trackScreenView = (screenName: string, journeyId?: string, params?: Record<string, any>): void => {
    if (!analyticsEnabled || !screenName) {
        return;
    }

    try {
        // Build event parameters
        const eventParams = {
            screen_name: screenName,
            ...(journeyId && { journey_id: journeyId }),
            ...params,
        };

        // Track in Google Analytics - fixed to match the expected parameter type
        ReactGA.send('pageview', {
            page: screenName,
            ...eventParams,
        });

        // Track in Datadog RUM
        datadogRum.addAction('view_screen', eventParams);

        logger.log(`Screen view tracked: ${screenName}`, eventParams);
    } catch (error) {
        logger.error('Error tracking screen view:', error);
    }
};

/**
 * Tracks a custom event with the analytics services.
 * @param eventName The name of the event to track
 * @param params Additional parameters to include with the event (optional)
 */
export const trackEvent = (eventName: string, params?: Record<string, any>): void => {
    if (!analyticsEnabled || !eventName) {
        return;
    }

    try {
        // Format event name to comply with GA4 naming conventions
        // Lowercase, underscores instead of spaces, alphanumeric characters only
        const formattedEventName = eventName
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '_')
            .replace(/__+/g, '_');

        // Track in Google Analytics
        ReactGA.event({
            category: params?.category || 'general',
            action: formattedEventName,
            ...params,
        });

        // Track in Datadog RUM
        datadogRum.addAction(formattedEventName, params || {});

        logger.log(`Event tracked: ${formattedEventName}`, params);
    } catch (error) {
        logger.error('Error tracking event:', error);
    }
};

/**
 * Tracks a journey-specific event with appropriate context.
 * @param journeyId The journey ID (health, care, plan)
 * @param eventName The name of the event to track
 * @param params Additional parameters to include with the event (optional)
 */
export const trackJourneyEvent = (journeyId: string, eventName: string, params?: Record<string, any>): void => {
    if (!analyticsEnabled || !journeyId || !eventName) {
        return;
    }

    try {
        // Validate journey ID
        const validJourneyIds = Object.values(Constants.JOURNEY_IDS);
        if (!validJourneyIds.includes(journeyId as any)) {
            logger.warn(`Invalid journey ID: ${journeyId}. Event not tracked.`);
            return;
        }

        // Format the event name with journey prefix
        const formattedEventName = `${journeyId}_${eventName}`;

        // Get journey name
        const journeyKey = Object.keys(Constants.JOURNEY_IDS).find(
            (key) => Constants.JOURNEY_IDS[key as keyof typeof Constants.JOURNEY_IDS] === journeyId
        );

        const journeyName = journeyKey
            ? Constants.JOURNEY_NAMES[journeyKey as keyof typeof Constants.JOURNEY_NAMES]
            : '';

        // Add journey ID to event parameters
        const eventParams = {
            journey_id: journeyId,
            journey_name: journeyName,
            ...params,
        };

        // Track the event
        trackEvent(formattedEventName, eventParams);
    } catch (error) {
        logger.error('Error tracking journey event:', error);
    }
};

/**
 * Tracks a health journey-specific event.
 * @param eventName The name of the event to track
 * @param params Additional parameters to include with the event (optional)
 */
export const trackHealthEvent = (eventName: string, params?: Record<string, any>): void => {
    trackJourneyEvent(Constants.JOURNEY_IDS.MyHealth, eventName, params);
};

/**
 * Tracks a care journey-specific event.
 * @param eventName The name of the event to track
 * @param params Additional parameters to include with the event (optional)
 */
export const trackCareEvent = (eventName: string, params?: Record<string, any>): void => {
    trackJourneyEvent(Constants.JOURNEY_IDS.CareNow, eventName, params);
};

/**
 * Tracks a plan journey-specific event.
 * @param eventName The name of the event to track
 * @param params Additional parameters to include with the event (optional)
 */
export const trackPlanEvent = (eventName: string, params?: Record<string, any>): void => {
    trackJourneyEvent(Constants.JOURNEY_IDS.MyPlan, eventName, params);
};

/**
 * Tracks a gamification-related event.
 * @param eventName The name of the event to track
 * @param params Additional parameters to include with the event (optional)
 */
export const trackGamificationEvent = (eventName: string, params?: Record<string, any>): void => {
    if (!analyticsEnabled || !eventName) {
        return;
    }

    try {
        // Format with gamification prefix
        const formattedEventName = `gamification_${eventName}`;

        // Track the event
        trackEvent(formattedEventName, params);
    } catch (error) {
        logger.error('Error tracking gamification event:', error);
    }
};

/**
 * Tracks when a user unlocks an achievement.
 * @param achievementId The ID of the unlocked achievement
 * @param achievementName The display name of the achievement
 * @param journeyId The journey the achievement belongs to
 * @param xpEarned The amount of XP earned from the achievement
 */
export const trackAchievementUnlocked = (
    achievementId: string,
    achievementName: string,
    journeyId: string,
    xpEarned: number
): void => {
    if (!analyticsEnabled) {
        return;
    }

    try {
        // Get journey name
        const journeyKey = Object.keys(Constants.JOURNEY_IDS).find(
            (key) => Constants.JOURNEY_IDS[key as keyof typeof Constants.JOURNEY_IDS] === journeyId
        );

        const journeyName = journeyKey
            ? Constants.JOURNEY_NAMES[journeyKey as keyof typeof Constants.JOURNEY_NAMES]
            : '';

        const eventParams = {
            achievement_id: achievementId,
            achievement_name: achievementName,
            journey_id: journeyId,
            journey_name: journeyName,
            xp_earned: xpEarned,
        };

        trackGamificationEvent('achievement_unlocked', eventParams);
    } catch (error) {
        logger.error('Error tracking achievement unlock:', error);
    }
};

/**
 * Tracks when a user levels up in the gamification system.
 * @param newLevel The new level the user has reached
 * @param xpEarned The amount of XP earned to reach this level
 */
export const trackLevelUp = (newLevel: number, xpEarned: number): void => {
    if (!analyticsEnabled) {
        return;
    }

    try {
        const eventParams = {
            new_level: newLevel,
            xp_earned: xpEarned,
        };

        trackGamificationEvent('level_up', eventParams);
    } catch (error) {
        logger.error('Error tracking level up:', error);
    }
};

/**
 * Tracks an error that occurred in the application.
 * @param errorName A descriptive name for the error
 * @param error The actual error object
 * @param context Additional context about when/where the error occurred
 */
export const trackError = (errorName: string, error: Error, context?: Record<string, any>): void => {
    try {
        // Log error to Sentry with context
        Sentry.captureException(error, {
            tags: {
                error_name: errorName,
                ...context,
            },
        });

        // Create error parameters with error details and context
        const errorParams = {
            error_name: errorName,
            error_message: error.message,
            error_stack: ENVIRONMENT !== 'production' ? error.stack : undefined,
            ...context,
        };

        // Call trackEvent with app_error event and parameters
        trackEvent('app_error', errorParams);
    } catch (e) {
        // Fail silently if error tracking fails
        logger.error('Error while tracking error:', e);
    }
};

/**
 * Tracks a performance-related metric for monitoring.
 * @param metricName The name of the metric being tracked
 * @param value The numeric value of the metric
 * @param context Additional context for the metric
 */
export const trackPerformanceMetric = (metricName: string, value: number, context?: Record<string, any>): void => {
    if (!analyticsEnabled) {
        return;
    }

    try {
        // Create metric parameters with value and context
        const metricParams = {
            metric_name: metricName,
            metric_value: value,
            ...context,
        };

        // Track custom metric in Datadog RUM
        datadogRum.addTiming(metricName, value);

        // Call trackEvent with performance_metric event and parameters
        trackEvent('performance_metric', metricParams);
    } catch (error) {
        logger.error('Error tracking performance metric:', error);
    }
};

/**
 * Sets user properties for analytics segmentation.
 * @param properties Object containing user properties to set
 */
export const setUserProperties = (properties: Record<string, any>): void => {
    if (!analyticsEnabled || !properties) {
        return;
    }

    try {
        // Iterate through properties object
        Object.entries(properties).forEach(([key, value]) => {
            // Set each property as a user property in Google Analytics
            ReactGA.set({ [key]: value });
        });

        // Set user attributes in Datadog RUM
        datadogRum.setUser({
            ...properties,
        });

        // Set user data in Sentry
        Sentry.setUser(properties);

        logger.log('User properties set');
    } catch (error) {
        logger.error('Error setting user properties:', error);
    }
};

/**
 * Sets the user ID for analytics tracking.
 * @param userId The user ID to set
 */
export const setUserId = (userId: string): void => {
    if (!analyticsEnabled || !userId) {
        return;
    }

    try {
        // Validate user ID parameter
        if (!userId) {
            logger.warn('Invalid user ID provided');
            return;
        }

        // Set user ID in Google Analytics
        ReactGA.set({ userId });

        // Set user ID in Datadog RUM
        datadogRum.setUser({ id: userId });

        // Set user ID in Sentry for error reporting context
        Sentry.setUser({ id: userId });

        logger.log('User ID set');
    } catch (error) {
        logger.error('Error setting user ID:', error);
    }
};

/**
 * Resets all analytics data, typically called on logout.
 */
export const resetAnalyticsData = (): void => {
    try {
        // Log user_logout event before resetting
        trackEvent('user_logout');

        // Reset analytics data in Google Analytics
        ReactGA.set({ userId: undefined });

        // Clear user ID from Sentry
        Sentry.setUser(null);

        // Reset user in Datadog RUM
        datadogRum.clearUser();

        logger.log('Analytics data reset');
    } catch (error) {
        logger.error('Error resetting analytics data:', error);
    }
};
