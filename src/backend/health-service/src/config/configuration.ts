/* eslint-disable */
import { registerAs } from '@nestjs/config'; // NestJS Config 2.3.1+
import Joi from 'joi'; // Joi 17.0.0+

/**
 * Health service configuration
 * Provides structured access to environment variables with sensible defaults
 * Registered with NestJS ConfigModule for centralized configuration management
 */

/**
 * Configuration interface for Health Service
 */
export interface Configuration {
    nodeEnv: string;
    port: number;
    apiPrefix: string;
    databaseUrl: string;
    databaseSSL: boolean;
    timescaleEnabled: boolean;
    metricsRetentionDays: number;
    metricsAggregationEnabled: boolean;
    metricsAggregationIntervals: string;
    fhirApiEnabled: boolean;
    fhirApiUrl: string;
    fhirApiAuthType: string;
    fhirApiClientId: string;
    fhirApiClientSecret: string;
    fhirApiScope: string;
    fhirApiTokenUrl: string;
    fhirApiUsername: string;
    fhirApiPassword: string;
    fhirApiTimeout: number;
    wearablesSyncEnabled: boolean;
    wearablesSupported: string;
    googlefitClientId: string;
    googlefitClientSecret: string;
    healthkitTeamId: string;
    healthkitKeyId: string;
    healthkitPrivateKey: string;
    fitbitClientId: string;
    fitbitClientSecret: string;
    wearablesSyncInterval: number;
    wearablesMaxSyncDays: number;
    healthGoalsMaxActive: number;
    healthInsightsEnabled: boolean;
    healthInsightsGenerationInterval: number;
    healthInsightsModelsPath: string;
    eventsKafkaEnabled: boolean;
    eventsKafkaBrokers: string;
    eventsTopicPrefix: string;
    redisUrl: string;
    redisTtl: number;
    medicalHistoryMaxEvents: number;
    storageS3Bucket: string;
    storageS3Region: string;
    storageS3Prefix: string;
}

export const health = registerAs('health', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3001,
    apiPrefix: process.env.API_PREFIX || 'api/v1',
    databaseUrl: process.env.DATABASE_URL,
    databaseSSL: process.env.DATABASE_SSL === 'true',
    timescaleEnabled: process.env.TIMESCALE_ENABLED === 'true',
    metricsRetentionDays: parseInt(process.env.METRICS_RETENTION_DAYS, 10) || 730,
    metricsAggregationEnabled: process.env.METRICS_AGGREGATION_ENABLED === 'true',
    metricsAggregationIntervals: process.env.METRICS_AGGREGATION_INTERVALS || 'hour,day,week,month',
    fhirApiEnabled: process.env.FHIR_API_ENABLED === 'true',
    fhirApiUrl: process.env.FHIR_API_URL,
    fhirApiAuthType: process.env.FHIR_API_AUTH_TYPE || 'oauth2',
    fhirApiClientId: process.env.FHIR_API_CLIENT_ID,
    fhirApiClientSecret: process.env.FHIR_API_CLIENT_SECRET,
    fhirApiScope: process.env.FHIR_API_SCOPE,
    fhirApiTokenUrl: process.env.FHIR_API_TOKEN_URL,
    fhirApiUsername: process.env.FHIR_API_USERNAME,
    fhirApiPassword: process.env.FHIR_API_PASSWORD,
    fhirApiTimeout: parseInt(process.env.FHIR_API_TIMEOUT, 10) || 10000,
    wearablesSyncEnabled: process.env.WEARABLES_SYNC_ENABLED === 'true',
    wearablesSupported: process.env.WEARABLES_SUPPORTED || 'googlefit,healthkit,fitbit',
    googlefitClientId: process.env.GOOGLEFIT_CLIENT_ID,
    googlefitClientSecret: process.env.GOOGLEFIT_CLIENT_SECRET,
    healthkitTeamId: process.env.HEALTHKIT_TEAM_ID,
    healthkitKeyId: process.env.HEALTHKIT_KEY_ID,
    healthkitPrivateKey: process.env.HEALTHKIT_PRIVATE_KEY,
    fitbitClientId: process.env.FITBIT_CLIENT_ID,
    fitbitClientSecret: process.env.FITBIT_CLIENT_SECRET,
    wearablesSyncInterval: parseInt(process.env.WEARABLES_SYNC_INTERVAL, 10) || 15,
    wearablesMaxSyncDays: parseInt(process.env.WEARABLES_MAX_SYNC_DAYS, 10) || 30,
    healthGoalsMaxActive: parseInt(process.env.HEALTH_GOALS_MAX_ACTIVE, 10) || 10,
    healthInsightsEnabled: process.env.HEALTH_INSIGHTS_ENABLED === 'true',
    healthInsightsGenerationInterval: parseInt(process.env.HEALTH_INSIGHTS_GENERATION_INTERVAL, 10) || 24,
    healthInsightsModelsPath: process.env.HEALTH_INSIGHTS_MODELS_PATH,
    eventsKafkaEnabled: process.env.EVENTS_KAFKA_ENABLED === 'true',
    eventsKafkaBrokers: process.env.EVENTS_KAFKA_BROKERS,
    eventsTopicPrefix: process.env.EVENTS_TOPIC_PREFIX || 'austa.health',
    redisUrl: process.env.REDIS_URL,
    redisTtl: parseInt(process.env.REDIS_TTL, 10) || 3600,
    medicalHistoryMaxEvents: parseInt(process.env.MEDICAL_HISTORY_MAX_EVENTS, 10) || 1000,
    storageS3Bucket: process.env.STORAGE_S3_BUCKET,
    storageS3Region: process.env.STORAGE_S3_REGION,
    storageS3Prefix: process.env.STORAGE_S3_PREFIX || 'health',
}));

/**
 * Validation schema for Health service environment variables
 * Ensures that required variables are present and correctly formatted
 * Used by NestJS ConfigModule for validation during application startup
 */
export const validationSchema = Joi.object({
    // Core configuration
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3001),
    API_PREFIX: Joi.string().default('api/v1'),

    // Database configuration
    DATABASE_URL: Joi.string().required().description('PostgreSQL connection string'),
    DATABASE_SSL: Joi.boolean().default(false),

    // TimescaleDB configuration
    TIMESCALE_ENABLED: Joi.boolean().default(false),
    METRICS_RETENTION_DAYS: Joi.number().default(730),
    METRICS_AGGREGATION_ENABLED: Joi.boolean().default(false),
    METRICS_AGGREGATION_INTERVALS: Joi.string().default('hour,day,week,month'),

    // FHIR API configuration
    FHIR_API_ENABLED: Joi.boolean().default(false),
    FHIR_API_URL: Joi.string().when('FHIR_API_ENABLED', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    FHIR_API_AUTH_TYPE: Joi.string().valid('oauth2', 'basic', 'none').default('oauth2'),
    FHIR_API_CLIENT_ID: Joi.string().when('FHIR_API_AUTH_TYPE', {
        is: 'oauth2',
        then: Joi.when('FHIR_API_ENABLED', {
            is: true,
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
    }),
    FHIR_API_CLIENT_SECRET: Joi.string().when('FHIR_API_AUTH_TYPE', {
        is: 'oauth2',
        then: Joi.when('FHIR_API_ENABLED', {
            is: true,
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
    }),
    FHIR_API_SCOPE: Joi.string().when('FHIR_API_AUTH_TYPE', {
        is: 'oauth2',
        then: Joi.optional(),
        otherwise: Joi.optional(),
    }),
    FHIR_API_TOKEN_URL: Joi.string().when('FHIR_API_AUTH_TYPE', {
        is: 'oauth2',
        then: Joi.when('FHIR_API_ENABLED', {
            is: true,
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
    }),
    FHIR_API_USERNAME: Joi.string().when('FHIR_API_AUTH_TYPE', {
        is: 'basic',
        then: Joi.when('FHIR_API_ENABLED', {
            is: true,
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
    }),
    FHIR_API_PASSWORD: Joi.string().when('FHIR_API_AUTH_TYPE', {
        is: 'basic',
        then: Joi.when('FHIR_API_ENABLED', {
            is: true,
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
    }),
    FHIR_API_TIMEOUT: Joi.number().default(10000),

    // Wearables configuration
    WEARABLES_SYNC_ENABLED: Joi.boolean().default(false),
    WEARABLES_SUPPORTED: Joi.string().default('googlefit,healthkit,fitbit'),
    GOOGLEFIT_CLIENT_ID: Joi.string().when('WEARABLES_SYNC_ENABLED', {
        is: true,
        then: Joi.when('WEARABLES_SUPPORTED', {
            is: Joi.string().pattern(/googlefit/),
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
    }),
    GOOGLEFIT_CLIENT_SECRET: Joi.string().when('WEARABLES_SYNC_ENABLED', {
        is: true,
        then: Joi.when('WEARABLES_SUPPORTED', {
            is: Joi.string().pattern(/googlefit/),
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
    }),
    HEALTHKIT_TEAM_ID: Joi.string().when('WEARABLES_SYNC_ENABLED', {
        is: true,
        then: Joi.when('WEARABLES_SUPPORTED', {
            is: Joi.string().pattern(/healthkit/),
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
    }),
    HEALTHKIT_KEY_ID: Joi.string().when('WEARABLES_SYNC_ENABLED', {
        is: true,
        then: Joi.when('WEARABLES_SUPPORTED', {
            is: Joi.string().pattern(/healthkit/),
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
    }),
    HEALTHKIT_PRIVATE_KEY: Joi.string().when('WEARABLES_SYNC_ENABLED', {
        is: true,
        then: Joi.when('WEARABLES_SUPPORTED', {
            is: Joi.string().pattern(/healthkit/),
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
    }),
    FITBIT_CLIENT_ID: Joi.string().when('WEARABLES_SYNC_ENABLED', {
        is: true,
        then: Joi.when('WEARABLES_SUPPORTED', {
            is: Joi.string().pattern(/fitbit/),
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
    }),
    FITBIT_CLIENT_SECRET: Joi.string().when('WEARABLES_SYNC_ENABLED', {
        is: true,
        then: Joi.when('WEARABLES_SUPPORTED', {
            is: Joi.string().pattern(/fitbit/),
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
    }),
    WEARABLES_SYNC_INTERVAL: Joi.number().default(15),
    WEARABLES_MAX_SYNC_DAYS: Joi.number().default(30),

    // Health Goals configuration
    HEALTH_GOALS_MAX_ACTIVE: Joi.number().default(10),

    // Health Insights configuration
    HEALTH_INSIGHTS_ENABLED: Joi.boolean().default(false),
    HEALTH_INSIGHTS_GENERATION_INTERVAL: Joi.number().default(24),
    HEALTH_INSIGHTS_MODELS_PATH: Joi.string().when('HEALTH_INSIGHTS_ENABLED', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),

    // Event streaming configuration
    EVENTS_KAFKA_ENABLED: Joi.boolean().default(false),
    EVENTS_KAFKA_BROKERS: Joi.string().when('EVENTS_KAFKA_ENABLED', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    EVENTS_TOPIC_PREFIX: Joi.string().default('austa.health'),

    // Redis configuration
    REDIS_URL: Joi.string().required().description('Redis connection string'),
    REDIS_TTL: Joi.number().default(3600),

    // Medical history configuration
    MEDICAL_HISTORY_MAX_EVENTS: Joi.number().default(1000),

    // Storage configuration
    STORAGE_S3_BUCKET: Joi.string().required(),
    STORAGE_S3_REGION: Joi.string().required(),
    STORAGE_S3_PREFIX: Joi.string().default('health'),
});
