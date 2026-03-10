import Joi from 'joi'; // joi 17.9.1

/**
 * Creates a Joi validation schema for the Plan Service configuration
 * @returns Joi validation schema for the Plan Service configuration
 */
const createValidationSchema = (): Joi.ObjectSchema => {
    return Joi.object({
        // Server configuration
        server: Joi.object({
            port: Joi.number().port().default(3000).description('Port number for the Plan Service'),
            host: Joi.string().hostname().default('localhost').description('Host for the Plan Service'),
            cors: Joi.object({
                origin: Joi.alternatives()
                    .try(Joi.string(), Joi.array().items(Joi.string()), Joi.boolean())
                    .default(['https://app.austa.com.br', /\.austa\.com\.br$/])
                    .description('CORS origin configuration'),
                credentials: Joi.boolean().default(true).description('Whether to allow credentials in CORS requests'),
            }).default(),
            timeout: Joi.number().positive().default(30000).description('Request timeout in milliseconds'),
        }).required(),

        // Database configuration
        database: Joi.object({
            url: Joi.string().uri().description('Database connection string'),
            host: Joi.string().hostname().description('Database host'),
            port: Joi.number().port().default(5432).description('Database port'),
            username: Joi.string().description('Database username'),
            password: Joi.string().description('Database password'),
            database: Joi.string().required().description('Database name'),
            schema: Joi.string().default('plan').description('Database schema for Plan service'),
            ssl: Joi.boolean().default(true).description('Whether to use SSL for database connection'),
            poolSize: Joi.number().positive().default(20).description('Database connection pool size'),
        })
            .required()
            .xor('url', 'host')
            .and('host', 'username', 'password', 'database'),

        // Insurance API integration
        insuranceApi: Joi.object({
            baseUrl: Joi.string().uri().required().description('Base URL for insurance API'),
            apiKey: Joi.string().required().description('API key for insurance API access'),
            timeout: Joi.number()
                .positive()
                .default(10000)
                .description('Timeout for insurance API requests in milliseconds'),
            retries: Joi.number()
                .integer()
                .min(0)
                .max(5)
                .default(3)
                .description('Number of retries for failed insurance API requests'),
            rateLimit: Joi.object({
                windowMs: Joi.number().positive().default(60000).description('Rate limit window in milliseconds'),
                maxRequests: Joi.number()
                    .positive()
                    .default(100)
                    .description('Maximum number of requests in the rate limit window'),
            }).default(),
        }).required(),

        // Claims processing configuration
        claims: Joi.object({
            supportedDocumentTypes: Joi.array()
                .items(Joi.string())
                .default(['pdf', 'jpg', 'jpeg', 'png'])
                .description('Supported document types for claim submissions'),
            maxDocumentSize: Joi.number()
                .positive()
                .default(10 * 1024 * 1024) // 10MB
                .description('Maximum document size in bytes'),
            maxDocumentsPerClaim: Joi.number()
                .integer()
                .positive()
                .default(5)
                .description('Maximum number of documents per claim'),
            autoApprovalThreshold: Joi.number()
                .positive()
                .default(100)
                .description('Threshold for automatic claim approval in local currency units'),
            processingTimeEstimate: Joi.object({
                standard: Joi.number().integer().positive().default(3).description('Standard processing time in days'),
                express: Joi.number().integer().positive().default(1).description('Express processing time in days'),
            }).default(),
            retentionPeriod: Joi.number()
                .integer()
                .positive()
                .default(7 * 365) // 7 years
                .description('Document retention period in days'),
        }).required(),

        // Document storage configuration
        storage: Joi.object({
            provider: Joi.string().valid('s3', 'local').default('s3').description('Storage provider for documents'),
            s3: Joi.object({
                bucket: Joi.string().required().description('S3 bucket name for document storage'),
                region: Joi.string().default('sa-east-1').description('AWS region for S3 bucket'),
                accessKeyId: Joi.string().description('AWS access key ID'),
                secretAccessKey: Joi.string().description('AWS secret access key'),
                endpoint: Joi.string().uri().description('Custom S3 endpoint (for non-AWS S3 compatible services)'),
                pathPrefix: Joi.string().default('plan').description('Path prefix for storing documents'),
            }).when('provider', { is: 's3', then: Joi.required() }),
            local: Joi.object({
                directory: Joi.string().required().description('Local directory for document storage'),
            }).when('provider', { is: 'local', then: Joi.required() }),
        }).required(),

        // Cost simulator configuration
        costSimulator: Joi.object({
            currency: Joi.string().default('BRL').description('Currency for cost estimates'),
            procedureCatalog: Joi.object({
                source: Joi.string()
                    .valid('database', 'api')
                    .default('database')
                    .description('Source for procedure catalog'),
                apiEndpoint: Joi.string()
                    .uri()
                    .when('source', { is: 'api', then: Joi.required() })
                    .description('API endpoint for procedure catalog'),
                refreshInterval: Joi.number()
                    .integer()
                    .positive()
                    .default(24 * 60 * 60) // 24 hours
                    .description('Refresh interval for procedure catalog in seconds'),
            }).default(),
            coverageDefaults: Joi.object({
                consultations: Joi.number()
                    .min(0)
                    .max(100)
                    .default(80)
                    .description('Default coverage percentage for consultations'),
                examinations: Joi.number()
                    .min(0)
                    .max(100)
                    .default(70)
                    .description('Default coverage percentage for examinations'),
                procedures: Joi.number()
                    .min(0)
                    .max(100)
                    .default(60)
                    .description('Default coverage percentage for procedures'),
                emergencies: Joi.number()
                    .min(0)
                    .max(100)
                    .default(90)
                    .description('Default coverage percentage for emergencies'),
            }).default(),
        }).required(),

        // Gamification integration
        gamification: Joi.object({
            enabled: Joi.boolean().default(true).description('Whether gamification is enabled for Plan service'),
            eventEndpoint: Joi.string().uri().required().description('Endpoint for sending gamification events'),
            timeout: Joi.number()
                .positive()
                .default(5000)
                .description('Timeout for gamification event requests in milliseconds'),
            events: Joi.object({
                claimSubmitted: Joi.string().default('CLAIM_SUBMITTED').description('Event name for claim submission'),
                claimApproved: Joi.string().default('CLAIM_APPROVED').description('Event name for claim approval'),
                digitalCardAccessed: Joi.string()
                    .default('DIGITAL_CARD_ACCESSED')
                    .description('Event name for digital card access'),
                benefitUsed: Joi.string().default('BENEFIT_USED').description('Event name for benefit usage'),
            }).default(),
        }).required(),

        // Notification service integration
        notifications: Joi.object({
            enabled: Joi.boolean().default(true).description('Whether notifications are enabled for Plan service'),
            serviceEndpoint: Joi.string().uri().required().description('Endpoint for notification service'),
            timeout: Joi.number()
                .positive()
                .default(5000)
                .description('Timeout for notification requests in milliseconds'),
            templates: Joi.object({
                claimStatus: Joi.string()
                    .default('plan-claim-status')
                    .description('Template for claim status notifications'),
                claimReminder: Joi.string()
                    .default('plan-claim-reminder')
                    .description('Template for claim reminder notifications'),
                benefitExpiration: Joi.string()
                    .default('plan-benefit-expiration')
                    .description('Template for benefit expiration notifications'),
            }).default(),
        }).required(),

        // Logging configuration
        logging: Joi.object({
            level: Joi.string().valid('debug', 'info', 'warn', 'error').default('info').description('Logging level'),
            format: Joi.string().valid('json', 'pretty').default('json').description('Logging format'),
            destination: Joi.string().valid('stdout', 'file').default('stdout').description('Logging destination'),
            filename: Joi.string()
                .when('destination', { is: 'file', then: Joi.required() })
                .description('Log file path when destination is file'),
        }).default(),
    });
};

// Export the validation schema for use in the configuration module
export default createValidationSchema();
