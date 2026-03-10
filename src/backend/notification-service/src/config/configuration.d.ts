/**
 * Type declarations for the notification configuration
 */

export interface NotificationConfig {
    port: number;
    nodeEnv: string;
    apiPrefix: string;
    databaseUrl: string;
    redisUrl: string;
    kafkaBrokers: string[];
    webSocketPort: number;
    emailFromAddress: string;
    emailFromName: string;
    smsFromNumber: string;
    pushEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
    inAppEnabled: boolean;
    channelPriority: string[];
    defaultJourney: string;
    maxRetries: number;
    retryDelay: number;
    expirationTime: number;
    rateLimits: Record<string, number>;
}

export const notification: NotificationConfig;
