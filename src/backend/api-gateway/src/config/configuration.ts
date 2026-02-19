import { registerAs, ConfigType } from '@nestjs/config';
import { ApiGatewayConfigValidation } from '../config/validation.schema';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { TracingModule } from '@app/shared/tracing/tracing.module';
import { RedisModule } from '@app/shared/redis/redis.module';
import { JOURNEY_IDS } from '@app/shared/constants/journey.constants';
import { ErrorCodes } from '@app/shared/constants/error-codes.constants';

/**
 * Configuration for the API Gateway.
 * Defines settings for authentication, CORS, rate limiting, GraphQL, logging, and service endpoints.
 */
export const configuration = registerAs('apiGateway', () => ({
  // Server configuration
  port: parseInt(process.env.PORT || '4000', 10),
  host: process.env.HOST || '0.0.0.0',
  env: process.env.NODE_ENV || 'development',
  baseUrl: process.env.API_BASE_URL || 'http://localhost:4000',
  
  // Authentication configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    tokenExpiration: process.env.TOKEN_EXPIRATION || '1h',
    refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
    issuer: process.env.TOKEN_ISSUER || 'austa.com.br',
    audience: process.env.TOKEN_AUDIENCE || 'austa-users',
    errorCodes: {
      invalidCredentials: ErrorCodes.AUTH_INVALID_CREDENTIALS,
    },
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGINS ? 
      process.env.CORS_ORIGINS.split(',') : 
      ['https://app.austa.com.br', /\.austa\.com\.br$/],
    credentials: process.env.CORS_CREDENTIALS !== 'false',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // limit each IP to 100 requests per windowMs
    journeyLimits: {
      [JOURNEY_IDS.HEALTH]: parseInt(process.env.RATE_LIMIT_HEALTH || '200', 10),
      [JOURNEY_IDS.CARE]: parseInt(process.env.RATE_LIMIT_CARE || '150', 10),
      [JOURNEY_IDS.PLAN]: parseInt(process.env.RATE_LIMIT_PLAN || '100', 10),
    },
    message: 'Too many requests, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  },
  
  // GraphQL configuration
  graphql: {
    playground: process.env.GRAPHQL_PLAYGROUND === 'true' || process.env.NODE_ENV !== 'production',
    debug: process.env.GRAPHQL_DEBUG === 'true' || process.env.NODE_ENV !== 'production',
    autoSchemaFile: process.env.GRAPHQL_SCHEMA_FILE || 'schema.gql',
    sortSchema: true,
    context: ({req, res}) => ({req, res}),
    cors: false, // Handled by Express middleware
    installSubscriptionHandlers: true,
    subscriptions: {
      'graphql-ws': true,
      'subscriptions-transport-ws': true,
    },
  },
  
  // Cache configuration
  cache: {
    ttl: {
      [JOURNEY_IDS.HEALTH]: process.env.CACHE_TTL_HEALTH || '5m',
      [JOURNEY_IDS.CARE]: process.env.CACHE_TTL_CARE || '1m',
      [JOURNEY_IDS.PLAN]: process.env.CACHE_TTL_PLAN || '15m',
    },
    defaultTtl: process.env.CACHE_TTL_DEFAULT || '5m',
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    requestLogging: process.env.LOG_REQUESTS !== 'false',
    responseLogging: process.env.LOG_RESPONSES !== 'false',
    prettyPrint: process.env.LOG_PRETTY === 'true' || process.env.NODE_ENV !== 'production',
    journeyContext: true,
  },
  
  // Tracing configuration
  tracing: {
    enabled: process.env.TRACING_ENABLED === 'true',
    serviceName: 'api-gateway',
    exporterEndpoint: process.env.TRACING_EXPORTER_ENDPOINT || 'http://localhost:4318',
  },
  
  // Backend service endpoints
  services: {
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'http://auth-service:3000',
      timeout: parseInt(process.env.AUTH_SERVICE_TIMEOUT || '5000', 10),
    },
    health: {
      url: process.env.HEALTH_SERVICE_URL || 'http://health-service:3000',
      timeout: parseInt(process.env.HEALTH_SERVICE_TIMEOUT || '5000', 10),
    },
    care: {
      url: process.env.CARE_SERVICE_URL || 'http://care-service:3000',
      timeout: parseInt(process.env.CARE_SERVICE_TIMEOUT || '5000', 10),
    },
    plan: {
      url: process.env.PLAN_SERVICE_URL || 'http://plan-service:3000',
      timeout: parseInt(process.env.PLAN_SERVICE_TIMEOUT || '5000', 10),
    },
    gamification: {
      url: process.env.GAMIFICATION_SERVICE_URL || 'http://gamification-service:3000',
      timeout: parseInt(process.env.GAMIFICATION_SERVICE_TIMEOUT || '5000', 10),
    },
    notification: {
      url: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3000',
      timeout: parseInt(process.env.NOTIFICATION_SERVICE_TIMEOUT || '5000', 10),
    },
  },
}));

// Export the configuration type
export type ApiGatewayConfig = ConfigType<typeof configuration>;

// Default export for simplicity
export default configuration;