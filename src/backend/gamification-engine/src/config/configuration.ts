import { registerAs } from '@nestjs/config'; // v10.0.0+

/**
 * Defines the configuration object for the Gamification Engine,
 * loading values from environment variables.
 */
export const gamificationEngine = registerAs('gamificationEngine', () => ({
  // Server configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
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
    maxRetries: parseInt(process.env.KAFKA_MAX_RETRIES, 10) || 3,
    retryInterval: parseInt(process.env.KAFKA_RETRY_INTERVAL, 10) || 1000,
  },
  
  // Event processing configuration
  eventProcessing: {
    rate: parseInt(process.env.EVENT_PROCESSING_RATE, 10) || 1000,
    batchSize: parseInt(process.env.EVENT_BATCH_SIZE, 10) || 100,
    rulesRefreshInterval: parseInt(process.env.RULES_REFRESH_INTERVAL, 10) || 60000, // 1 minute
  },
  
  // Points configuration for gamification
  points: {
    defaultValues: {
      healthMetricRecorded: parseInt(process.env.DEFAULT_POINT_HEALTH_METRIC_RECORDED, 10) || 10,
      appointmentBooked: parseInt(process.env.DEFAULT_POINT_APPOINTMENT_BOOKED, 10) || 20,
      appointmentAttended: parseInt(process.env.DEFAULT_POINT_APPOINTMENT_ATTENDED, 10) || 50,
      claimSubmitted: parseInt(process.env.DEFAULT_POINT_CLAIM_SUBMITTED, 10) || 15,
      goalCompleted: parseInt(process.env.DEFAULT_POINT_GOAL_COMPLETED, 10) || 100,
    },
    limits: {
      maxPointsPerDay: parseInt(process.env.MAX_POINTS_PER_DAY, 10) || 1000,
      maxPointsPerAction: parseInt(process.env.MAX_POINTS_PER_ACTION, 10) || 500,
    },
  },
  
  // Redis configuration for caching and real-time state
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'game:',
    ttl: {
      achievements: parseInt(process.env.ACHIEVEMENTS_TTL, 10) || 3600, // 1 hour
      userProfile: parseInt(process.env.USER_PROFILE_TTL, 10) || 300, // 5 minutes
      leaderboard: parseInt(process.env.LEADERBOARD_TTL, 10) || 900, // 15 minutes
      rules: parseInt(process.env.RULES_TTL, 10) || 600, // 10 minutes
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
      updateInterval: parseInt(process.env.LEADERBOARD_UPDATE_INTERVAL, 10) || 900000, // 15 minutes
      maxEntries: parseInt(process.env.LEADERBOARD_MAX_ENTRIES, 10) || 100,
    },
    achievements: {
      notificationsEnabled: process.env.ACHIEVEMENTS_NOTIFICATIONS_ENABLED !== 'false', // Enabled by default
      progressTrackingEnabled: process.env.ACHIEVEMENTS_PROGRESS_TRACKING_ENABLED !== 'false', // Enabled by default
      maxConcurrentQuests: parseInt(process.env.ACHIEVEMENTS_MAX_CONCURRENT_QUESTS, 10) || 5,
    },
    rewards: {
      expirationDays: parseInt(process.env.REWARDS_EXPIRATION_DAYS, 10) || 30,
      redemptionEnabled: process.env.REWARDS_REDEMPTION_ENABLED !== 'false', // Enabled by default
    },
  },
}));