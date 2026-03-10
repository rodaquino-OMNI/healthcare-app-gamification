import { registerAs } from '@nestjs/config'; // @nestjs/config 10.0.0+

import validationSchema from './validation.schema';

/**
 * Configuration factory function for the Plan Service.
 *
 * Loads environment variables, transforms them into a structured configuration object,
 * and validates them against the schema. This configuration includes all settings for
 * the My Plan & Benefits journey, such as insurance integration, claims processing,
 * document storage, cost simulation, and integration with other services.
 *
 * @returns Validated configuration object for the Plan Service
 */
export const planService = registerAs('planService', () => {
    // Parse CORS origin from environment variable
    let corsOrigin: string | string[] | RegExp | (string | RegExp)[] = [
        'https://app.austa.com.br',
        /\.austa\.com\.br$/,
    ];
    if (process.env.CORS_ORIGIN) {
        if (process.env.CORS_ORIGIN.startsWith('/') && process.env.CORS_ORIGIN.endsWith('/')) {
            // Handle regex pattern
            const pattern = process.env.CORS_ORIGIN.slice(1, -1);
            corsOrigin = new RegExp(pattern);
        } else if (process.env.CORS_ORIGIN.includes(',')) {
            // Handle comma-separated list
            corsOrigin = process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
        } else {
            // Handle single origin
            corsOrigin = process.env.CORS_ORIGIN;
        }
    }

    // Create the configuration object from environment variables
    const config = {
        server: {
            port: parseInt(process.env.PORT || '3000', 10),
            host: process.env.HOST || 'localhost',
            cors: {
                origin: corsOrigin,
                credentials: process.env.CORS_CREDENTIALS !== 'false',
            },
            timeout: parseInt(process.env.SERVER_TIMEOUT || '30000', 10),
        },

        database: {
            url: process.env.DATABASE_URL,
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT || '5432', 10),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            schema: process.env.DATABASE_SCHEMA || 'plan',
            ssl: process.env.DATABASE_SSL !== 'false',
            poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '20', 10),
        },

        insuranceApi: {
            baseUrl: process.env.INSURANCE_API_BASE_URL,
            apiKey: process.env.INSURANCE_API_KEY,
            timeout: parseInt(process.env.INSURANCE_API_TIMEOUT || '10000', 10),
            retries: parseInt(process.env.INSURANCE_API_RETRIES || '3', 10),
            rateLimit: {
                windowMs: parseInt(process.env.INSURANCE_API_RATE_LIMIT_WINDOW || '60000', 10),
                maxRequests: parseInt(process.env.INSURANCE_API_RATE_LIMIT_MAX || '100', 10),
            },
        },

        claims: {
            supportedDocumentTypes: process.env.CLAIMS_SUPPORTED_DOC_TYPES
                ? process.env.CLAIMS_SUPPORTED_DOC_TYPES.split(',').map((type) => type.trim())
                : ['pdf', 'jpg', 'jpeg', 'png'],
            maxDocumentSize: parseInt(process.env.CLAIMS_MAX_DOC_SIZE || String(10 * 1024 * 1024), 10), // Default 10MB
            maxDocumentsPerClaim: parseInt(process.env.CLAIMS_MAX_DOCS_PER_CLAIM || '5', 10),
            autoApprovalThreshold: parseFloat(process.env.CLAIMS_AUTO_APPROVAL_THRESHOLD || '100'),
            processingTimeEstimate: {
                standard: parseInt(process.env.CLAIMS_PROCESSING_TIME_STANDARD || '3', 10),
                express: parseInt(process.env.CLAIMS_PROCESSING_TIME_EXPRESS || '1', 10),
            },
            retentionPeriod: parseInt(process.env.CLAIMS_RETENTION_PERIOD || String(7 * 365), 10), // Default 7 years
        },

        storage: {
            provider: process.env.STORAGE_PROVIDER || 's3',
            s3: {
                bucket: process.env.S3_BUCKET,
                region: process.env.S3_REGION || 'sa-east-1',
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                endpoint: process.env.S3_ENDPOINT,
                pathPrefix: process.env.S3_PATH_PREFIX || 'plan',
            },
            local: {
                directory: process.env.LOCAL_STORAGE_DIRECTORY,
            },
        },

        costSimulator: {
            currency: process.env.COST_SIMULATOR_CURRENCY || 'BRL',
            procedureCatalog: {
                source: process.env.PROCEDURE_CATALOG_SOURCE || 'database',
                apiEndpoint: process.env.PROCEDURE_CATALOG_API_ENDPOINT,
                refreshInterval: parseInt(process.env.PROCEDURE_CATALOG_REFRESH_INTERVAL || String(24 * 60 * 60), 10), // Default 24 hours
            },
            coverageDefaults: {
                consultations: parseInt(process.env.COVERAGE_DEFAULT_CONSULTATIONS || '80', 10),
                examinations: parseInt(process.env.COVERAGE_DEFAULT_EXAMINATIONS || '70', 10),
                procedures: parseInt(process.env.COVERAGE_DEFAULT_PROCEDURES || '60', 10),
                emergencies: parseInt(process.env.COVERAGE_DEFAULT_EMERGENCIES || '90', 10),
            },
        },

        gamification: {
            enabled: process.env.GAMIFICATION_ENABLED !== 'false',
            eventEndpoint: process.env.GAMIFICATION_EVENT_ENDPOINT,
            timeout: parseInt(process.env.GAMIFICATION_TIMEOUT || '5000', 10),
            events: {
                claimSubmitted: process.env.GAMIFICATION_EVENT_CLAIM_SUBMITTED || 'CLAIM_SUBMITTED',
                claimApproved: process.env.GAMIFICATION_EVENT_CLAIM_APPROVED || 'CLAIM_APPROVED',
                digitalCardAccessed: process.env.GAMIFICATION_EVENT_DIGITAL_CARD_ACCESSED || 'DIGITAL_CARD_ACCESSED',
                benefitUsed: process.env.GAMIFICATION_EVENT_BENEFIT_USED || 'BENEFIT_USED',
            },
        },

        notifications: {
            enabled: process.env.NOTIFICATIONS_ENABLED !== 'false',
            serviceEndpoint: process.env.NOTIFICATIONS_SERVICE_ENDPOINT,
            timeout: parseInt(process.env.NOTIFICATIONS_TIMEOUT || '5000', 10),
            templates: {
                claimStatus: process.env.NOTIFICATIONS_TEMPLATE_CLAIM_STATUS || 'plan-claim-status',
                claimReminder: process.env.NOTIFICATIONS_TEMPLATE_CLAIM_REMINDER || 'plan-claim-reminder',
                benefitExpiration: process.env.NOTIFICATIONS_TEMPLATE_BENEFIT_EXPIRATION || 'plan-benefit-expiration',
            },
        },

        logging: {
            level: process.env.LOG_LEVEL || 'info',
            format: process.env.LOG_FORMAT || 'json',
            destination: process.env.LOG_DESTINATION || 'stdout',
            filename: process.env.LOG_FILENAME,
        },
    };

    // Validate the configuration
    const validationResult = validationSchema.validate(config, {
        abortEarly: false,
    });

    // If validation fails, throw error with details
    if (validationResult.error) {
        const errorDetails = validationResult.error.details.map((detail) => detail.message).join(', ');
        throw new Error(`Plan Service configuration validation failed: ${errorDetails}`);
    }

    // Return the validated configuration with defaults from schema
    return validationResult.value as typeof config;
});

export default planService;
