import Joi from 'joi'; // joi version 17.11.0

/**
 * Validation schema for Care Service configuration
 *
 * This schema ensures all required environment variables are present and correctly formatted
 * It is used with NestJS ConfigModule for validating environment variables
 */
export const validationSchema = Joi.object({
    // Environment and server config
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    API_PREFIX: Joi.string().default('api'),

    // Database connection
    DATABASE_URL: Joi.string().required(),

    // Authentication
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('1h'),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

    // Telemedicine API
    TELEMEDICINE_API_KEY: Joi.string().required(),
    TELEMEDICINE_API_URL: Joi.string().uri().required(),

    // API Timeouts
    APPOINTMENT_API_TIMEOUT: Joi.number().default(5000),
    MEDICATION_API_TIMEOUT: Joi.number().default(5000),
    PROVIDER_API_TIMEOUT: Joi.number().default(5000),
    SYMPTOM_CHECKER_API_TIMEOUT: Joi.number().default(5000),
    TELEMEDICINE_API_TIMEOUT: Joi.number().default(5000),
    TREATMENT_API_TIMEOUT: Joi.number().default(5000),

    // Kafka Configuration
    KAFKA_BROKERS: Joi.string().required(),
    KAFKA_CLIENT_ID: Joi.string().default('care-service'),

    // Notifications Service
    NOTIFICATIONS_SERVICE_URL: Joi.string().uri().required(),
    NOTIFICATIONS_SERVICE_TIMEOUT: Joi.number().default(5000),
});
