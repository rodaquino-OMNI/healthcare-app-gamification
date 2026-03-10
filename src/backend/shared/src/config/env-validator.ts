import { z } from 'zod';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Coerce a string env var into a boolean (accepts 'true'/'false'). */
const coerceBoolean = z
    .enum(['true', 'false', ''])
    .optional()
    .transform((v) => v === 'true');

/** Coerce a string env var into an integer with a default. */
const coerceInt = (fallback: number) => z.coerce.number().int().default(fallback);

/** Coerce a string env var into a float with a default. */
const coerceFloat = (fallback: number) => z.coerce.number().default(fallback);

/** Comma-separated string to array transformer. */
const commaSeparated = (fallback: string) =>
    z
        .string()
        .default(fallback)
        .transform((v) => v.split(',').map((s) => s.trim()));

// ---------------------------------------------------------------------------
// Common env vars shared by all services
// ---------------------------------------------------------------------------

const commonEnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
    PORT: coerceInt(3000),
    HOST: z.string().default('localhost'),
    API_PREFIX: z.string().default('api/v1'),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'verbose']).default('info'),
    LOG_FORMAT: z.enum(['json', 'text', 'pretty']).default('json'),
});

// ---------------------------------------------------------------------------
// Database configuration
// ---------------------------------------------------------------------------

const databaseEnvSchema = z.object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    DATABASE_HOST: z.string().optional(),
    DATABASE_PORT: coerceInt(5432),
    DATABASE_NAME: z.string().optional(),
    DATABASE_USERNAME: z.string().optional(),
    DATABASE_PASSWORD: z.string().optional(),
    DATABASE_SCHEMA: z.string().default('public'),
    DATABASE_SSL: coerceBoolean,
    DATABASE_POOL_SIZE: coerceInt(20),
    DATABASE_MAX_CONNECTIONS: coerceInt(20),
    DATABASE_IDLE_TIMEOUT: coerceInt(30000),
    DATABASE_LOGGING: coerceBoolean,
});

// ---------------------------------------------------------------------------
// Redis configuration
// ---------------------------------------------------------------------------

const redisEnvSchema = z.object({
    REDIS_URL: z.string().optional(),
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: coerceInt(6379),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: coerceInt(0),
    REDIS_KEY_PREFIX: z.string().default('austa:'),
    REDIS_TTL: coerceInt(3600),
});

// ---------------------------------------------------------------------------
// Kafka / event streaming
// ---------------------------------------------------------------------------

const kafkaEnvSchema = z.object({
    KAFKA_BROKERS: z.string().default('localhost:9092'),
    KAFKA_CLIENT_ID: z.string().default('austa-service'),
    KAFKA_GROUP_ID: z.string().optional(),
    KAFKA_MAX_RETRIES: coerceInt(3),
    KAFKA_RETRY_INTERVAL: coerceInt(1000),
    KAFKA_TOPIC_HEALTH_EVENTS: z.string().default('health.events'),
    KAFKA_TOPIC_CARE_EVENTS: z.string().default('care.events'),
    KAFKA_TOPIC_PLAN_EVENTS: z.string().default('plan.events'),
    KAFKA_TOPIC_USER_EVENTS: z.string().default('user.events'),
    KAFKA_TOPIC_GAME_EVENTS: z.string().default('game.events'),
    EVENTS_KAFKA_ENABLED: coerceBoolean,
    EVENTS_KAFKA_BROKERS: z.string().optional(),
    EVENTS_TOPIC_PREFIX: z.string().default('austa.health'),
});

// ---------------------------------------------------------------------------
// JWT / Auth
// ---------------------------------------------------------------------------

const authEnvSchema = z.object({
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional(),
    JWT_ACCESS_EXPIRATION: z.string().default('1h'),
    JWT_REFRESH_EXPIRATION: z.string().default('7d'),
    JWT_ISSUER: z.string().default('austa.com.br'),
    JWT_AUDIENCE: z.string().default('austa-users'),
    AUTH_SERVICE_PORT: coerceInt(3001),
    AUTH_SERVICE_API_PREFIX: z.string().default('api/v1'),
    AUTH_DATABASE_URL: z.string().optional(),
    AUTH_JWT_SECRET: z.string().optional(),
    AUTH_JWT_EXPIRATION: z.string().default('1h'),
    AUTH_REFRESH_TOKEN_EXPIRATION: z.string().default('7d'),
    AUTH_REFRESH_TOKEN_SECRET: z.string().optional(),
});

// ---------------------------------------------------------------------------
// OAuth providers
// ---------------------------------------------------------------------------

const oauthEnvSchema = z.object({
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CALLBACK_URL: z.string().optional(),
    GOOGLE_AUTH_ENABLED: coerceBoolean,
    FACEBOOK_CLIENT_ID: z.string().optional(),
    FACEBOOK_CLIENT_SECRET: z.string().optional(),
    FACEBOOK_CALLBACK_URL: z.string().optional(),
    FACEBOOK_AUTH_ENABLED: coerceBoolean,
    APPLE_CLIENT_ID: z.string().optional(),
    APPLE_TEAM_ID: z.string().optional(),
    APPLE_KEY_ID: z.string().optional(),
    APPLE_PRIVATE_KEY: z.string().optional(),
    APPLE_CALLBACK_URL: z.string().optional(),
    APPLE_AUTH_ENABLED: coerceBoolean,
});

// ---------------------------------------------------------------------------
// MFA / Biometric
// ---------------------------------------------------------------------------

const mfaEnvSchema = z.object({
    MFA_ENABLED: coerceBoolean,
    MFA_ISSUER: z.string().default('AUSTA SuperApp'),
    MFA_CODE_EXPIRATION: coerceInt(300),
    MFA_WINDOW_SIZE: coerceInt(1),
    MFA_SMS_PROVIDER: z.string().optional(),
    MFA_SMS_PROVIDER_API_KEY: z.string().optional(),
    SMS_PROVIDER: z.string().default('twilio'),
    SMS_MFA_ENABLED: coerceBoolean,
    EMAIL_MFA_ENABLED: coerceBoolean,
    TOTP_MFA_ENABLED: coerceBoolean,
    BIOMETRIC_AUTHENTICATION_ENABLED: coerceBoolean,
    BIOMETRIC_DEVICE_KEY_EXPIRATION_DAYS: coerceInt(90),
});

// ---------------------------------------------------------------------------
// Session & Password policy
// ---------------------------------------------------------------------------

const sessionPasswordEnvSchema = z.object({
    MAX_CONCURRENT_SESSIONS: coerceInt(5),
    SESSION_ABSOLUTE_TIMEOUT: coerceInt(43200),
    SESSION_INACTIVITY_TIMEOUT: coerceInt(1800),
    REMEMBER_ME_EXTENSION: coerceInt(2592000),
    PASSWORD_MIN_LENGTH: coerceInt(10),
    PASSWORD_HISTORY: coerceInt(5),
    PASSWORD_MAX_AGE: coerceInt(7776000),
    PASSWORD_LOCKOUT_THRESHOLD: coerceInt(5),
    PASSWORD_LOCKOUT_DURATION: coerceInt(1800),
    PASSWORD_REQUIRE_UPPERCASE: coerceBoolean,
    PASSWORD_REQUIRE_LOWERCASE: coerceBoolean,
    PASSWORD_REQUIRE_NUMBER: coerceBoolean,
    PASSWORD_REQUIRE_SPECIAL: coerceBoolean,
});

// ---------------------------------------------------------------------------
// Security & Rate limiting
// ---------------------------------------------------------------------------

const securityEnvSchema = z.object({
    RATE_LIMIT_WINDOW_MS: coerceInt(900000),
    RATE_LIMIT_MAX: coerceInt(100),
    RATE_LIMIT_DEFAULT: coerceInt(100),
    RATE_LIMIT_HEALTH: coerceInt(200),
    RATE_LIMIT_CARE: coerceInt(150),
    RATE_LIMIT_PLAN: coerceInt(100),
    CORS_ORIGIN: z.string().optional(),
    CORS_ORIGINS: z.string().optional(),
    CORS_METHODS: z.string().optional(),
    CORS_CREDENTIALS: coerceBoolean,
    ENCRYPTION_KEY: z.string().optional(),
    SENTRY_DSN: z.string().optional(),
});

// ---------------------------------------------------------------------------
// FHIR API (Health service)
// ---------------------------------------------------------------------------

const fhirEnvSchema = z.object({
    FHIR_API_ENABLED: coerceBoolean,
    FHIR_API_URL: z.string().optional(),
    FHIR_API_AUTH_TYPE: z.enum(['oauth2', 'basic', 'none']).default('oauth2'),
    FHIR_API_CLIENT_ID: z.string().optional(),
    FHIR_API_CLIENT_SECRET: z.string().optional(),
    FHIR_API_SCOPE: z.string().optional(),
    FHIR_API_TOKEN_URL: z.string().optional(),
    FHIR_API_USERNAME: z.string().optional(),
    FHIR_API_PASSWORD: z.string().optional(),
    FHIR_API_TIMEOUT: coerceInt(10000),
});

// ---------------------------------------------------------------------------
// Wearables (Health service)
// ---------------------------------------------------------------------------

const wearablesEnvSchema = z.object({
    WEARABLES_SYNC_ENABLED: coerceBoolean,
    WEARABLES_SUPPORTED: z.string().default('googlefit,healthkit,fitbit'),
    GOOGLEFIT_CLIENT_ID: z.string().optional(),
    GOOGLEFIT_CLIENT_SECRET: z.string().optional(),
    HEALTHKIT_TEAM_ID: z.string().optional(),
    HEALTHKIT_KEY_ID: z.string().optional(),
    HEALTHKIT_PRIVATE_KEY: z.string().optional(),
    FITBIT_CLIENT_ID: z.string().optional(),
    FITBIT_CLIENT_SECRET: z.string().optional(),
    WEARABLES_SYNC_INTERVAL: coerceInt(15),
    WEARABLES_MAX_SYNC_DAYS: coerceInt(30),
});

// ---------------------------------------------------------------------------
// Health service-specific
// ---------------------------------------------------------------------------

const healthEnvSchema = z.object({
    TIMESCALE_ENABLED: coerceBoolean,
    METRICS_RETENTION_DAYS: coerceInt(730),
    METRICS_AGGREGATION_ENABLED: coerceBoolean,
    METRICS_AGGREGATION_INTERVALS: z.string().default('hour,day,week,month'),
    HEALTH_GOALS_MAX_ACTIVE: coerceInt(10),
    HEALTH_INSIGHTS_ENABLED: coerceBoolean,
    HEALTH_INSIGHTS_GENERATION_INTERVAL: coerceInt(24),
    HEALTH_INSIGHTS_MODELS_PATH: z.string().optional(),
    MEDICAL_HISTORY_MAX_EVENTS: coerceInt(1000),
});

// ---------------------------------------------------------------------------
// Care service-specific
// ---------------------------------------------------------------------------

const careEnvSchema = z.object({
    CARE_SERVICE_PORT: coerceInt(3002),
    CARE_SERVICE_DATABASE_URL: z.string().optional(),
    CARE_SERVICE_REDIS_URL: z.string().optional(),
    CARE_SERVICE_JWT_SECRET: z.string().optional(),
    CARE_SERVICE_AGORA_APP_ID: z.string().optional(),
    CARE_SERVICE_AGORA_APP_CERTIFICATE: z.string().optional(),
    CARE_SERVICE_TELEMEDICINE_ENABLED: coerceBoolean,
    CARE_SERVICE_TELEMEDICINE_PROVIDER: z.string().default('agora'),
    CARE_SERVICE_SYMPTOMS_CHECKER_ENABLED: coerceBoolean,
    CARE_SERVICE_GAMIFICATION_ENABLED: coerceBoolean,
    CARE_SERVICE_GAMIFICATION_URL: z.string().optional(),
    CARE_SERVICE_LOG_LEVEL: z.string().default('info'),
});

// ---------------------------------------------------------------------------
// Plan service-specific
// ---------------------------------------------------------------------------

const planEnvSchema = z.object({
    INSURANCE_API_BASE_URL: z.string().optional(),
    INSURANCE_API_KEY: z.string().optional(),
    INSURANCE_API_TIMEOUT: coerceInt(10000),
    INSURANCE_API_RETRIES: coerceInt(3),
    CLAIMS_SUPPORTED_DOC_TYPES: z.string().optional(),
    CLAIMS_MAX_DOC_SIZE: coerceInt(10 * 1024 * 1024),
    CLAIMS_MAX_DOCS_PER_CLAIM: coerceInt(5),
    CLAIMS_AUTO_APPROVAL_THRESHOLD: coerceFloat(100),
    COST_SIMULATOR_CURRENCY: z.string().default('BRL'),
    STORAGE_PROVIDER: z.string().default('s3'),
    S3_BUCKET: z.string().optional(),
    S3_REGION: z.string().default('sa-east-1'),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    S3_ENDPOINT: z.string().optional(),
    S3_PATH_PREFIX: z.string().default('plan'),
});

// ---------------------------------------------------------------------------
// Gamification engine-specific
// ---------------------------------------------------------------------------

const gamificationEnvSchema = z.object({
    GAMIFICATION_ENABLED: coerceBoolean,
    GAMIFICATION_EVENT_ENDPOINT: z.string().optional(),
    GAMIFICATION_TIMEOUT: coerceInt(5000),
    EVENT_PROCESSING_RATE: coerceInt(1000),
    EVENT_BATCH_SIZE: coerceInt(100),
    RULES_REFRESH_INTERVAL: coerceInt(60000),
    MAX_POINTS_PER_DAY: coerceInt(1000),
    MAX_POINTS_PER_ACTION: coerceInt(500),
    LEADERBOARD_UPDATE_INTERVAL: coerceInt(900000),
    LEADERBOARD_MAX_ENTRIES: coerceInt(100),
    REWARDS_EXPIRATION_DAYS: coerceInt(30),
    CACHE_ENABLED: coerceBoolean,
});

// ---------------------------------------------------------------------------
// Notification service-specific
// ---------------------------------------------------------------------------

const notificationEnvSchema = z.object({
    NOTIFICATION_PORT: coerceInt(3003),
    WEBSOCKET_PORT: coerceInt(3004),
    EMAIL_FROM_ADDRESS: z.string().default('notifications@austa.com'),
    EMAIL_FROM_NAME: z.string().default('AUSTA Notifications'),
    SMS_FROM_NUMBER: z.string().optional(),
    PUSH_ENABLED: coerceBoolean,
    EMAIL_ENABLED: coerceBoolean,
    SMS_ENABLED: coerceBoolean,
    INAPP_ENABLED: coerceBoolean,
    FIREBASE_API_KEY: z.string().optional(),
    SENDGRID_API_KEY: z.string().optional(),
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    MAX_RETRIES: coerceInt(3),
    RETRY_DELAY: coerceInt(1000),
    EXPIRATION_TIME: coerceInt(86400),
});

// ---------------------------------------------------------------------------
// API Gateway-specific
// ---------------------------------------------------------------------------

const gatewayEnvSchema = z.object({
    API_BASE_URL: z.string().default('http://localhost:4000'),
    GRAPHQL_PLAYGROUND: coerceBoolean,
    GRAPHQL_DEBUG: coerceBoolean,
    GRAPHQL_SCHEMA_FILE: z.string().default('schema.gql'),
    TOKEN_EXPIRATION: z.string().default('1h'),
    REFRESH_TOKEN_EXPIRATION: z.string().default('7d'),
    TOKEN_ISSUER: z.string().default('austa.com.br'),
    TOKEN_AUDIENCE: z.string().default('austa-users'),
    AUTH_SERVICE_URL: z.string().default('http://auth-service:3000'),
    AUTH_SERVICE_TIMEOUT: coerceInt(5000),
    HEALTH_SERVICE_URL: z.string().default('http://health-service:3000'),
    HEALTH_SERVICE_TIMEOUT: coerceInt(5000),
    CARE_SERVICE_URL: z.string().default('http://care-service:3000'),
    CARE_SERVICE_TIMEOUT: coerceInt(5000),
    PLAN_SERVICE_URL: z.string().default('http://plan-service:3000'),
    PLAN_SERVICE_TIMEOUT: coerceInt(5000),
    GAMIFICATION_SERVICE_URL: z.string().default('http://gamification-service:3000'),
    GAMIFICATION_SERVICE_TIMEOUT: coerceInt(5000),
    NOTIFICATION_SERVICE_URL: z.string().default('http://notification-service:3000'),
    NOTIFICATION_SERVICE_TIMEOUT: coerceInt(5000),
});

// ---------------------------------------------------------------------------
// S3 / Storage (shared across health + plan)
// ---------------------------------------------------------------------------

const storageEnvSchema = z.object({
    STORAGE_S3_BUCKET: z.string().optional(),
    STORAGE_S3_REGION: z.string().optional(),
    STORAGE_S3_PREFIX: z.string().default('health'),
});

// ---------------------------------------------------------------------------
// Tracing & Monitoring
// ---------------------------------------------------------------------------

const observabilityEnvSchema = z.object({
    TRACING_ENABLED: coerceBoolean,
    TRACING_EXPORTER_ENDPOINT: z.string().default('http://localhost:4318'),
    MONITORING_ENABLED: coerceBoolean,
    METRICS_PATH: z.string().default('/metrics'),
    LOG_FILE_OUTPUT: coerceBoolean,
    LOG_FILE_PATH: z.string().optional(),
    LOG_REQUESTS: coerceBoolean,
    LOG_RESPONSES: coerceBoolean,
    LOG_PRETTY: coerceBoolean,
    LOG_DESTINATION: z.string().default('stdout'),
});

// ---------------------------------------------------------------------------
// Compliance (LGPD / GDPR)
// ---------------------------------------------------------------------------

const complianceEnvSchema = z.object({
    GDPR_ENABLED: coerceBoolean,
    LGPD_ENABLED: coerceBoolean,
    DATA_RETENTION_DAYS: coerceInt(730),
    REQUIRE_EMAIL_VERIFICATION: coerceBoolean,
    EMAIL_VERIFICATION_EXPIRY_HOURS: coerceInt(24),
});

// ---------------------------------------------------------------------------
// Full environment schema (union of all sub-schemas)
// ---------------------------------------------------------------------------

export const envSchema = commonEnvSchema
    .merge(databaseEnvSchema)
    .merge(redisEnvSchema)
    .merge(kafkaEnvSchema)
    .merge(authEnvSchema)
    .merge(oauthEnvSchema)
    .merge(mfaEnvSchema)
    .merge(sessionPasswordEnvSchema)
    .merge(securityEnvSchema)
    .merge(fhirEnvSchema)
    .merge(wearablesEnvSchema)
    .merge(healthEnvSchema)
    .merge(careEnvSchema)
    .merge(planEnvSchema)
    .merge(gamificationEnvSchema)
    .merge(notificationEnvSchema)
    .merge(gatewayEnvSchema)
    .merge(storageEnvSchema)
    .merge(observabilityEnvSchema)
    .merge(complianceEnvSchema)
    .partial()
    .required({
        NODE_ENV: true,
    });

/** Inferred type of the validated environment. */
export type EnvConfig = z.infer<typeof envSchema>;

// ---------------------------------------------------------------------------
// Validate helpers
// ---------------------------------------------------------------------------

/**
 * Validates `process.env` against the full schema.
 * On failure, logs every issue and exits with code 1.
 *
 * @returns The validated and typed environment configuration.
 */
export function validateEnv(): EnvConfig {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error('Environment validation failed:');
        for (const issue of result.error.issues) {
            console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
        }
        process.exit(1);
    }

    return result.data;
}

// ---------------------------------------------------------------------------
// Per-service validators
// ---------------------------------------------------------------------------

/**
 * Validates environment variables required by the Auth service.
 */
export function validateAuthEnv(): z.infer<typeof authServiceSchema> {
    return parseOrExit(authServiceSchema, 'Auth');
}

/**
 * Validates environment variables required by the Health service.
 */
export function validateHealthEnv(): z.infer<typeof healthServiceSchema> {
    return parseOrExit(healthServiceSchema, 'Health');
}

/**
 * Validates environment variables required by the Care service.
 */
export function validateCareEnv(): z.infer<typeof careServiceSchema> {
    return parseOrExit(careServiceSchema, 'Care');
}

/**
 * Validates environment variables required by the Plan service.
 */
export function validatePlanEnv(): z.infer<typeof planServiceSchema> {
    return parseOrExit(planServiceSchema, 'Plan');
}

/**
 * Validates environment variables required by the Gamification engine.
 */
export function validateGamificationEnv(): z.infer<typeof gamificationServiceSchema> {
    return parseOrExit(gamificationServiceSchema, 'Gamification');
}

/**
 * Validates environment variables required by the Notification service.
 */
export function validateNotificationEnv(): z.infer<typeof notificationServiceSchema> {
    return parseOrExit(notificationServiceSchema, 'Notification');
}

/**
 * Validates environment variables required by the API Gateway.
 */
export function validateGatewayEnv(): z.infer<typeof gatewayServiceSchema> {
    return parseOrExit(gatewayServiceSchema, 'API Gateway');
}

// ---------------------------------------------------------------------------
// Per-service composite schemas
// ---------------------------------------------------------------------------

const authServiceSchema = commonEnvSchema
    .merge(databaseEnvSchema)
    .merge(redisEnvSchema)
    .merge(authEnvSchema)
    .merge(oauthEnvSchema)
    .merge(mfaEnvSchema)
    .merge(sessionPasswordEnvSchema)
    .merge(securityEnvSchema)
    .merge(complianceEnvSchema)
    .partial()
    .required({
        NODE_ENV: true,
        DATABASE_URL: true,
    });

const healthServiceSchema = commonEnvSchema
    .merge(databaseEnvSchema)
    .merge(redisEnvSchema)
    .merge(kafkaEnvSchema)
    .merge(fhirEnvSchema)
    .merge(wearablesEnvSchema)
    .merge(healthEnvSchema)
    .merge(storageEnvSchema)
    .partial()
    .required({
        NODE_ENV: true,
        DATABASE_URL: true,
    });

const careServiceSchema = commonEnvSchema
    .merge(databaseEnvSchema)
    .merge(redisEnvSchema)
    .merge(kafkaEnvSchema)
    .merge(careEnvSchema)
    .partial()
    .required({
        NODE_ENV: true,
    });

const planServiceSchema = commonEnvSchema
    .merge(databaseEnvSchema)
    .merge(planEnvSchema)
    .merge(storageEnvSchema)
    .merge(securityEnvSchema)
    .partial()
    .required({
        NODE_ENV: true,
    });

const gamificationServiceSchema = commonEnvSchema
    .merge(databaseEnvSchema)
    .merge(redisEnvSchema)
    .merge(kafkaEnvSchema)
    .merge(gamificationEnvSchema)
    .partial()
    .required({
        NODE_ENV: true,
    });

const notificationServiceSchema = commonEnvSchema
    .merge(databaseEnvSchema)
    .merge(redisEnvSchema)
    .merge(kafkaEnvSchema)
    .merge(notificationEnvSchema)
    .partial()
    .required({
        NODE_ENV: true,
    });

const gatewayServiceSchema = commonEnvSchema
    .merge(authEnvSchema)
    .merge(securityEnvSchema)
    .merge(gatewayEnvSchema)
    .merge(observabilityEnvSchema)
    .partial()
    .required({
        NODE_ENV: true,
    });

// ---------------------------------------------------------------------------
// Internal helper
// ---------------------------------------------------------------------------

function parseOrExit<T extends z.ZodTypeAny>(schema: T, serviceName: string): z.infer<T> {
    const result = schema.safeParse(process.env);

    if (!result.success) {
        console.error(`${serviceName} service environment validation failed:`);
        for (const issue of result.error.issues) {
            console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
        }
        process.exit(1);
    }

    return result.data as z.infer<T>;
}
