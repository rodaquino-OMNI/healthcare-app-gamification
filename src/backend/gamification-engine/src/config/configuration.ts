/* eslint-disable */
import { registerAs } from '@nestjs/config'; // v10.0.0+

import { DEFAULT_PORT } from './validation.schema';

/**
 * Helper function for safely parsing environment variables to integers
 * Handles the 'string | undefined' type of process.env values
 *
 * @param value The environment variable value (potentially undefined)
 * @param defaultValue The default value to use if parsing fails
 * @returns A parsed integer or the default value
 */
const parseIntSafe = (value: string | undefined, defaultValue: number): number => {
    if (value === undefined) {
        return defaultValue;
    }

    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Defines the configuration object for the Gamification Engine,
 * loading values from environment variables.
 */
export const gamificationEngine = registerAs('gamificationEngine', () => ({
    // Server configuration
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseIntSafe(process.env.PORT, DEFAULT_PORT),
    apiPrefix: process.env.API_PREFIX || 'api',

    // Kafka configuration for event processing
    kafka: {
        clientId: process.env.KAFKA_CLIENT_ID || 'gamification-engine',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
        groupId: process.env.KAFKA_GROUP_ID || 'gamification-consumer-group',
        topics: {
            healthEvents: process.env.KAFKA_TOPIC_HEALTH_EVENTS || 'health.events',
            careEvents: process.env.KAFKA_TOPIC_CARE_EVENTS || 'care.events',
            planEvents: process.env.KAFKA_TOPIC_PLAN_EVENTS || 'plan.events',
            userEvents: process.env.KAFKA_TOPIC_USER_EVENTS || 'user.events',
            gameEvents: process.env.KAFKA_TOPIC_GAME_EVENTS || 'game.events',
        },
        maxRetries: parseIntSafe(process.env.KAFKA_MAX_RETRIES, 3),
        retryInterval: parseIntSafe(process.env.KAFKA_RETRY_INTERVAL, 1000),
    },

    // Event processing configuration
    eventProcessing: {
        rate: parseIntSafe(process.env.EVENT_PROCESSING_RATE, 1000),
        batchSize: parseIntSafe(process.env.EVENT_BATCH_SIZE, 100),
        rulesRefreshInterval: parseIntSafe(process.env.RULES_REFRESH_INTERVAL, 60000), // 1 minute
    },

    // Points configuration for gamification
    points: {
        defaultValues: {
            healthMetricRecorded: parseIntSafe(process.env.DEFAULT_POINT_HEALTH_METRIC_RECORDED, 10),
            appointmentBooked: parseIntSafe(process.env.DEFAULT_POINT_APPOINTMENT_BOOKED, 20),
            appointmentAttended: parseIntSafe(process.env.DEFAULT_POINT_APPOINTMENT_ATTENDED, 50),
            claimSubmitted: parseIntSafe(process.env.DEFAULT_POINT_CLAIM_SUBMITTED, 15),
            goalCompleted: parseIntSafe(process.env.DEFAULT_POINT_GOAL_COMPLETED, 100),
        },
        limits: {
            maxPointsPerDay: parseIntSafe(process.env.MAX_POINTS_PER_DAY, 1000),
            maxPointsPerAction: parseIntSafe(process.env.MAX_POINTS_PER_ACTION, 500),
        },
    },

    // Redis configuration for caching and real-time state
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseIntSafe(process.env.REDIS_PORT, 6379),
        password: process.env.REDIS_PASSWORD || '',
        db: parseIntSafe(process.env.REDIS_DB, 0),
        keyPrefix: process.env.REDIS_KEY_PREFIX || 'game:',
        ttl: {
            achievements: parseIntSafe(process.env.ACHIEVEMENTS_TTL, 3600), // 1 hour
            userProfile: parseIntSafe(process.env.USER_PROFILE_TTL, 300), // 5 minutes
            leaderboard: parseIntSafe(process.env.LEADERBOARD_TTL, 900), // 15 minutes
            rules: parseIntSafe(process.env.RULES_TTL, 600), // 10 minutes
        },
    },

    // Database configuration for persistence
    database: {
        url: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL === 'true',
        logging: process.env.DATABASE_LOGGING === 'true',
    },

    // Gamification features configuration
    features: {
        cache: {
            enabled: process.env.CACHE_ENABLED !== 'false', // Enabled by default
        },
        leaderboard: {
            updateInterval: parseIntSafe(process.env.LEADERBOARD_UPDATE_INTERVAL, 900000), // 15 min
            maxEntries: parseIntSafe(process.env.LEADERBOARD_MAX_ENTRIES, 100),
        },
        achievements: {
            notificationsEnabled: process.env.ACHIEVEMENTS_NOTIFICATIONS_ENABLED !== 'false', // Enabled by default
            progressTrackingEnabled: process.env.ACHIEVEMENTS_PROGRESS_TRACKING_ENABLED !== 'false', // Enabled by default
            maxConcurrentQuests: parseIntSafe(process.env.ACHIEVEMENTS_MAX_CONCURRENT_QUESTS, 5),
        },
        rewards: {
            expirationDays: parseIntSafe(process.env.REWARDS_EXPIRATION_DAYS, 30),
            redemptionEnabled: process.env.REWARDS_REDEMPTION_ENABLED !== 'false', // Enabled by default
        },
    },
}));
