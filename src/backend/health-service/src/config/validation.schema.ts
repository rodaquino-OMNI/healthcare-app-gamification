import * as Joi from 'joi';
import { ErrorType } from '@nestjs/common';

/**
 * Validation schema for the Health Service environment variables.
 * This ensures all required configuration is present and correctly formatted.
 * 
 * All environment variables are validated during application bootstrap,
 * providing immediate feedback if configuration is missing or invalid.
 */
export const validationSchema = Joi.object({
  // Core service configuration
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3001),
  API_PREFIX: Joi.string().default('api/v1'),
  
  // Database configuration
  DATABASE_URL: Joi.string().required(),
  DATABASE_SSL: Joi.string().valid('true', 'false').default('false'),
  
  // TimescaleDB configuration for health metrics
  TIMESCALE_ENABLED: Joi.string().valid('true', 'false').default('true'),
  METRICS_RETENTION_DAYS: Joi.number().integer().min(1).max(3650).default(730), // Default 2 years
  METRICS_AGGREGATION_ENABLED: Joi.string().valid('true', 'false').default('true'),
  METRICS_AGGREGATION_INTERVALS: Joi.string().default('hour,day,week,month'),
  
  // FHIR API integration for medical records
  FHIR_API_ENABLED: Joi.string().valid('true', 'false').default('true'),
  FHIR_API_URL: Joi.string().uri().when('FHIR_API_ENABLED', { is: 'true', then: Joi.required() }),
  FHIR_API_AUTH_TYPE: Joi.string().valid('oauth2', 'basic', 'none').default('oauth2'),
  FHIR_API_CLIENT_ID: Joi.string().when('FHIR_API_ENABLED', { is: 'true', then: Joi.required() }),
  FHIR_API_CLIENT_SECRET: Joi.string().when('FHIR_API_ENABLED', { is: 'true', then: Joi.required() }),
  FHIR_API_SCOPE: Joi.string().when('FHIR_API_ENABLED', { is: 'true', then: Joi.required() }),
  FHIR_API_TOKEN_URL: Joi.string().uri().when('FHIR_API_ENABLED', { is: 'true', then: Joi.required() }),
  FHIR_API_USERNAME: Joi.string().when('FHIR_API_AUTH_TYPE', { is: 'basic', then: Joi.required() }),
  FHIR_API_PASSWORD: Joi.string().when('FHIR_API_AUTH_TYPE', { is: 'basic', then: Joi.required() }),
  FHIR_API_TIMEOUT: Joi.number().integer().default(10000), // 10 seconds default
  
  // Wearable device integration
  WEARABLES_SYNC_ENABLED: Joi.string().valid('true', 'false').default('true'),
  WEARABLES_SUPPORTED: Joi.string().default('googlefit,healthkit,fitbit'),
  // Google Fit settings
  GOOGLEFIT_CLIENT_ID: Joi.string().when('WEARABLES_SYNC_ENABLED', { is: 'true', then: Joi.required() }),
  GOOGLEFIT_CLIENT_SECRET: Joi.string().when('WEARABLES_SYNC_ENABLED', { is: 'true', then: Joi.required() }),
  // Apple HealthKit settings
  HEALTHKIT_TEAM_ID: Joi.string().when('WEARABLES_SYNC_ENABLED', { is: 'true', then: Joi.required() }),
  HEALTHKIT_KEY_ID: Joi.string().when('WEARABLES_SYNC_ENABLED', { is: 'true', then: Joi.required() }),
  HEALTHKIT_PRIVATE_KEY: Joi.string().when('WEARABLES_SYNC_ENABLED', { is: 'true', then: Joi.required() }),
  // Fitbit settings
  FITBIT_CLIENT_ID: Joi.string().when('WEARABLES_SYNC_ENABLED', { is: 'true', then: Joi.required() }),
  FITBIT_CLIENT_SECRET: Joi.string().when('WEARABLES_SYNC_ENABLED', { is: 'true', then: Joi.required() }),
  // Sync settings
  WEARABLES_SYNC_INTERVAL: Joi.number().integer().default(15), // Minutes
  WEARABLES_MAX_SYNC_DAYS: Joi.number().integer().default(30),
  
  // Health features configuration
  HEALTH_GOALS_MAX_ACTIVE: Joi.number().integer().default(10),
  HEALTH_INSIGHTS_ENABLED: Joi.string().valid('true', 'false').default('true'),
  HEALTH_INSIGHTS_GENERATION_INTERVAL: Joi.number().integer().default(24), // Hours
  HEALTH_INSIGHTS_MODELS_PATH: Joi.string(),
  
  // Event streaming configuration
  EVENTS_KAFKA_ENABLED: Joi.string().valid('true', 'false').default('true'),
  EVENTS_KAFKA_BROKERS: Joi.string().when('EVENTS_KAFKA_ENABLED', { is: 'true', then: Joi.required() }),
  EVENTS_TOPIC_PREFIX: Joi.string().default('austa.health'),
  
  // Caching configuration
  REDIS_URL: Joi.string().required(),
  REDIS_TTL: Joi.number().integer().default(3600), // 1 hour default
  
  // Medical history settings
  MEDICAL_HISTORY_MAX_EVENTS: Joi.number().integer().default(1000),
  
  // Storage configuration
  STORAGE_S3_BUCKET: Joi.string(),
  STORAGE_S3_REGION: Joi.string(),
  STORAGE_S3_PREFIX: Joi.string().default('health'),

  // PHI encryption (LGPD Art.46 compliance)
  ENCRYPTION_KEY: Joi.string().optional(),
});