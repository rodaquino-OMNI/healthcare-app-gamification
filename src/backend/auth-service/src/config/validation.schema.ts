import { ErrorType } from '@app/shared/exceptions/exceptions.types';
import * as Joi from 'joi';

/**
 * Validation schema for the Auth Service configuration.
 * Defines all required configuration parameters and their validation rules.
 */
export class AuthServiceConfigValidation {
    /**
     * Static schema definition that validates all configuration parameters
     * for the Auth Service, including OAuth, MFA, JWT, session management, and more.
     */
    static schema = Joi.object({
        // Server configuration
        PORT: Joi.number().default(3000),
        HOST: Joi.string().default('localhost'),
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),

        // Authentication settings
        AUTH_JWT_SECRET: Joi.string().required(),
        AUTH_JWT_EXPIRATION: Joi.string().default('1h'),
        AUTH_REFRESH_TOKEN_EXPIRATION: Joi.string().default('7d'),
        AUTH_REFRESH_TOKEN_SECRET: Joi.string().required(),

        // OAuth providers configuration
        OAUTH_GOOGLE_CLIENT_ID: Joi.string().optional(),
        OAUTH_GOOGLE_CLIENT_SECRET: Joi.string().optional(),
        OAUTH_FACEBOOK_CLIENT_ID: Joi.string().optional(),
        OAUTH_FACEBOOK_CLIENT_SECRET: Joi.string().optional(),
        OAUTH_APPLE_CLIENT_ID: Joi.string().optional(),
        OAUTH_APPLE_CLIENT_SECRET: Joi.string().optional(),
        OAUTH_REDIRECT_URL: Joi.string().optional(),

        // MFA settings
        MFA_ENABLED: Joi.boolean().default(true),
        MFA_ISSUER: Joi.string().default('AUSTA SuperApp'),
        MFA_EXPIRY_SECONDS: Joi.number().default(300), // 5 minutes
        MFA_SMS_PROVIDER: Joi.string().valid('twilio', 'sns', 'custom').default('twilio'),
        MFA_SMS_PROVIDER_API_KEY: Joi.string().when('MFA_SMS_PROVIDER', {
            is: Joi.exist().not('custom'),
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),

        // Password policy
        PASSWORD_MIN_LENGTH: Joi.number().default(10),
        PASSWORD_REQUIRE_UPPERCASE: Joi.boolean().default(true),
        PASSWORD_REQUIRE_LOWERCASE: Joi.boolean().default(true),
        PASSWORD_REQUIRE_NUMBER: Joi.boolean().default(true),
        PASSWORD_REQUIRE_SYMBOL: Joi.boolean().default(true),
        PASSWORD_HISTORY_COUNT: Joi.number().default(5),
        PASSWORD_MAX_AGE_DAYS: Joi.number().default(90),

        // Account lockout policy
        ACCOUNT_LOCKOUT_MAX_ATTEMPTS: Joi.number().default(5),
        ACCOUNT_LOCKOUT_DURATION_MINUTES: Joi.number().default(30),
        ACCOUNT_LOCKOUT_RESET_ATTEMPTS_AFTER_MINUTES: Joi.number().default(15),

        // Biometric authentication
        BIOMETRIC_AUTHENTICATION_ENABLED: Joi.boolean().default(true),
        BIOMETRIC_DEVICE_KEY_EXPIRATION_DAYS: Joi.number().default(90),

        // Session management
        SESSION_ABSOLUTE_TIMEOUT_HOURS: Joi.number().default(12),
        SESSION_IDLE_TIMEOUT_MINUTES: Joi.number().default(30),
        SESSION_MAX_CONCURRENT: Joi.number().default(5),

        // Rate limiting
        RATE_LIMIT_LOGIN_MAX: Joi.number().default(10),
        RATE_LIMIT_LOGIN_WINDOW_MINUTES: Joi.number().default(5),
        RATE_LIMIT_REGISTER_MAX: Joi.number().default(5),
        RATE_LIMIT_REGISTER_WINDOW_MINUTES: Joi.number().default(60),
        RATE_LIMIT_FORGOT_PASSWORD_MAX: Joi.number().default(5),
        RATE_LIMIT_FORGOT_PASSWORD_WINDOW_MINUTES: Joi.number().default(60),

        // Database configuration
        DATABASE_URL: Joi.string().required(),

        // Redis configuration (for sessions, rate limiting, etc.)
        REDIS_URL: Joi.string().required(),

        // Logging and monitoring
        LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
        SENTRY_DSN: Joi.string().optional(),

        // Compliance settings
        GDPR_ENABLED: Joi.boolean().default(true),
        LGPD_ENABLED: Joi.boolean().default(true), // Brazilian General Data Protection Law
        DATA_RETENTION_DAYS: Joi.number().default(365 * 2), // 2 years

        // Security features
        REQUIRE_EMAIL_VERIFICATION: Joi.boolean().default(true),
        EMAIL_VERIFICATION_EXPIRY_HOURS: Joi.number().default(24),
        REQUIRE_STRONG_PASSWORD: Joi.boolean().default(true),

        // PHI encryption (LGPD Art.46 compliance)
        ENCRYPTION_KEY: Joi.string().optional(),
    }).unknown();
}

// Define a default port constant that can be used throughout the codebase
export const DEFAULT_PORT = 3001;
