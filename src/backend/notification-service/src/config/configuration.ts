import { registerAs } from '@nestjs/config';

/**
 * Configuration for the notification service
 */
export const notification = registerAs('notification', () => ({
    port: parseInt(process.env.NOTIFICATION_PORT || '3003', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'api',
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    webSocketPort: parseInt(process.env.WEBSOCKET_PORT || '3004', 10),
    emailFromAddress: process.env.EMAIL_FROM_ADDRESS || 'notifications@austa.com',
    emailFromName: process.env.EMAIL_FROM_NAME || 'AUSTA Notifications',
    smsFromNumber: process.env.SMS_FROM_NUMBER || '+123456789',
    pushEnabled: process.env.PUSH_ENABLED !== 'false',
    emailEnabled: process.env.EMAIL_ENABLED !== 'false',
    smsEnabled: process.env.SMS_ENABLED !== 'false',
    inAppEnabled: process.env.INAPP_ENABLED !== 'false',
    channelPriority: (process.env.CHANNEL_PRIORITY || 'push,email,sms,in-app').split(','),
    defaultJourney: process.env.DEFAULT_JOURNEY || 'default',
    maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
    retryDelay: parseInt(process.env.RETRY_DELAY || '1000', 10),
    expirationTime: parseInt(process.env.EXPIRATION_TIME || '86400', 10),
    rateLimits: {
        default: parseInt(process.env.RATE_LIMIT_DEFAULT || '100', 10),
    },
    push: {
        apiKey: process.env.FIREBASE_API_KEY || '',
    },
}));
