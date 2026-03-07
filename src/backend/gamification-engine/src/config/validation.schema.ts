/* eslint-disable */
import Joi from 'joi';

/**
 * Default port for the Gamification Engine service
 */
export const DEFAULT_PORT = 3005;

export const validationSchema = Joi.object({
    // Environment
    NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),

    // Server settings
    PORT: Joi.number().port().default(DEFAULT_PORT),
    HOST: Joi.string().default('0.0.0.0'),
    LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('info'),
    SERVICE_NAME: Joi.string().default('gamification-engine'),

    // Database settings
    DATABASE_URL: Joi.string().required().description('PostgreSQL connection string for gamification data'),
    DATABASE_SSL: Joi.boolean().default(process.env.NODE_ENV === 'production'),
    DATABASE_MAX_CONNECTIONS: Joi.number().default(20),

    // Redis settings
    REDIS_URL: Joi.string().required().description('Redis connection string for leaderboards and real-time state'),
    REDIS_PASSWORD: Joi.string().allow('').optional(),
    REDIS_TLS: Joi.boolean().default(process.env.NODE_ENV === 'production'),

    // Kafka settings
    KAFKA_BROKERS: Joi.string().required().description('Comma-separated list of Kafka brokers'),
    KAFKA_GROUP_ID: Joi.string().default('gamification-engine'),
    KAFKA_CLIENT_ID: Joi.string().default('gamification-engine'),
    KAFKA_SSL: Joi.boolean().default(process.env.NODE_ENV === 'production'),

    // Journey event topics
    HEALTH_EVENTS_TOPIC: Joi.string().default('health.events').description('Kafka topic for health journey events'),
    CARE_EVENTS_TOPIC: Joi.string().default('care.events').description('Kafka topic for care journey events'),
    PLAN_EVENTS_TOPIC: Joi.string().default('plan.events').description('Kafka topic for plan journey events'),
    USER_EVENTS_TOPIC: Joi.string().default('user.events').description('Kafka topic for user events'),
    GAME_EVENTS_TOPIC: Joi.string().default('game.events').description('Kafka topic for gamification events'),

    // Authentication
    JWT_SECRET: Joi.string().required().description('Secret for JWT token verification'),
    JWT_EXPIRATION: Joi.number()
        .default(3600) // 1 hour in seconds
        .description('JWT token expiration time in seconds'),

    // Gamification settings
    ACHIEVEMENT_NOTIFICATION_ENABLED: Joi.boolean().default(true).description('Enable achievement notifications'),
    DEFAULT_POINTS_EXPIRY_DAYS: Joi.number().default(365).description('Default expiration for points in days'),
    EVENT_BATCH_SIZE: Joi.number()
        .min(1)
        .max(1000)
        .default(100)
        .description('Number of events to process in a single batch'),
    ENABLE_LEADERBOARDS: Joi.boolean().default(true).description('Enable leaderboard functionality'),
    LEADERBOARD_UPDATE_INTERVAL_MS: Joi.number()
        .default(60000) // 1 minute
        .description('Interval for updating leaderboards in milliseconds'),
    ACHIEVEMENT_RULES_PATH: Joi.string()
        .default('./config/rules')
        .description('Path to achievement rules configuration files'),
    MAX_ACHIEVEMENTS_PER_USER: Joi.number().default(1000).description('Maximum number of achievements a user can have'),
    POINTS_PRECISION: Joi.number().default(2).description('Number of decimal places for points calculations'),

    // Journey-specific gamification settings
    HEALTH_JOURNEY_ENABLED: Joi.boolean().default(true).description('Enable gamification for Health journey'),
    CARE_JOURNEY_ENABLED: Joi.boolean().default(true).description('Enable gamification for Care journey'),
    PLAN_JOURNEY_ENABLED: Joi.boolean().default(true).description('Enable gamification for Plan journey'),

    // Rate limiting
    RATE_LIMIT_ENABLED: Joi.boolean().default(true).description('Enable rate limiting for API endpoints'),
    RATE_LIMIT_WINDOW_MS: Joi.number()
        .default(60000) // 1 minute
        .description('Rate limiting window in milliseconds'),
    RATE_LIMIT_MAX_REQUESTS: Joi.number().default(1000).description('Maximum number of requests in rate limit window'),

    // Integration endpoints
    NOTIFICATION_SERVICE_URL: Joi.string()
        .uri()
        .when('ACHIEVEMENT_NOTIFICATION_ENABLED', {
            is: true,
            then: Joi.required(),
            otherwise: Joi.optional(),
        })
        .description('URL of the notification service for achievement notifications'),

    // Metrics and monitoring
    ENABLE_METRICS: Joi.boolean().default(true).description('Enable Prometheus metrics collection'),
    METRICS_PORT: Joi.number().port().default(9090).description('Port for Prometheus metrics endpoint'),
    SENTRY_DSN: Joi.string().uri().optional().description('Sentry DSN for error tracking'),

    // Caching
    CACHE_TTL: Joi.number()
        .default(300) // 5 minutes in seconds
        .description('Default cache TTL in seconds'),

    // Feature flags
    ENABLE_QUESTS: Joi.boolean().default(true).description('Enable quests feature'),
    ENABLE_REWARDS: Joi.boolean().default(true).description('Enable rewards feature'),
    ENABLE_LEVELS: Joi.boolean().default(true).description('Enable user leveling feature'),

    // Performance tuning
    EVENT_PROCESSOR_CONCURRENCY: Joi.number()
        .min(1)
        .max(100)
        .default(10)
        .description('Number of concurrent event processing workers'),
    RULE_EVALUATION_TIMEOUT_MS: Joi.number().default(5000).description('Timeout for rule evaluation in milliseconds'),
    MAX_EVENT_QUEUE_SIZE: Joi.number().default(10000).description('Maximum size of event processing queue'),

    // Anti-gaming/cheating
    ANTI_CHEAT_ENABLED: Joi.boolean().default(true).description('Enable anti-cheating measures'),
    MAX_EVENTS_PER_USER_PER_MINUTE: Joi.number()
        .default(100)
        .description('Maximum number of events per user per minute'),

    // Maintenance
    MAINTENANCE_MODE: Joi.boolean().default(false).description('Enable maintenance mode'),
    MAINTENANCE_MESSAGE: Joi.string()
        .default('Gamification system under maintenance')
        .description('Message to show during maintenance'),
});
