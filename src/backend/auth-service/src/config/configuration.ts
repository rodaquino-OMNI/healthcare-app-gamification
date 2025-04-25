import { registerAs, ConfigType } from '@nestjs/config';
// These imports are specified in the requirements but may be used in other auth service files
import { AuthServiceConfigValidation } from '../config/validation.schema';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { TracingModule } from 'src/backend/shared/src/tracing/tracing.module';

/**
 * Configuration for the Auth Service
 * Defines all settings related to authentication, authorization, and security
 * 
 * This configuration supports the core authentication functionality described in F-201
 * and addresses security implications outlined in Technical Specifications/2.4.4
 */
const configuration = registerAs('authService', () => ({
  server: {
    port: parseInt(process.env.AUTH_SERVICE_PORT, 10) || 3001,
    environment: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.AUTH_SERVICE_API_PREFIX || 'api/v1',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretkeythatshouldbechangedinproduction',
    accessTokenExpiration: process.env.JWT_ACCESS_EXPIRATION || '1h', // 1 hour
    refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d', // 7 days
    issuer: process.env.JWT_ISSUER || 'austa.com.br',
    audience: process.env.JWT_AUDIENCE || 'austa-users',
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/v1/auth/google/callback',
      enabled: process.env.GOOGLE_AUTH_ENABLED === 'true',
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      callbackUrl: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3001/api/v1/auth/facebook/callback',
      enabled: process.env.FACEBOOK_AUTH_ENABLED === 'true',
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID || '',
      teamId: process.env.APPLE_TEAM_ID || '',
      keyId: process.env.APPLE_KEY_ID || '',
      privateKey: process.env.APPLE_PRIVATE_KEY || '',
      callbackUrl: process.env.APPLE_CALLBACK_URL || 'http://localhost:3001/api/v1/auth/apple/callback',
      enabled: process.env.APPLE_AUTH_ENABLED === 'true',
    },
  },
  mfa: {
    enabled: process.env.MFA_ENABLED === 'true',
    issuer: process.env.MFA_ISSUER || 'AUSTA SuperApp',
    codeExpiration: parseInt(process.env.MFA_CODE_EXPIRATION, 10) || 300, // 5 minutes in seconds
    windowSize: parseInt(process.env.MFA_WINDOW_SIZE, 10) || 1, // Number of time steps to check
    smsProvider: process.env.SMS_PROVIDER || 'twilio',
    emailEnabled: process.env.EMAIL_MFA_ENABLED === 'true',
    smsEnabled: process.env.SMS_MFA_ENABLED === 'true',
    totpEnabled: process.env.TOTP_MFA_ENABLED === 'true',
  },
  database: {
    url: process.env.AUTH_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/auth',
    ssl: process.env.DATABASE_SSL === 'true',
    maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 20,
    idleTimeout: parseInt(process.env.DATABASE_IDLE_TIMEOUT, 10) || 30000, // 30 seconds
  },
  session: {
    maxConcurrentSessions: parseInt(process.env.MAX_CONCURRENT_SESSIONS, 10) || 5,
    absoluteTimeout: parseInt(process.env.SESSION_ABSOLUTE_TIMEOUT, 10) || 43200, // 12 hours in seconds
    inactivityTimeout: parseInt(process.env.SESSION_INACTIVITY_TIMEOUT, 10) || 1800, // 30 minutes in seconds
    rememberMeExtension: parseInt(process.env.REMEMBER_ME_EXTENSION, 10) || 2592000, // 30 days in seconds
  },
  password: {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH, 10) || 10,
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false', // Default to true
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false', // Default to true
    requireNumber: process.env.PASSWORD_REQUIRE_NUMBER !== 'false', // Default to true
    requireSpecialChar: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false', // Default to true
    history: parseInt(process.env.PASSWORD_HISTORY, 10) || 5, // Remember last 5 passwords
    maxAge: parseInt(process.env.PASSWORD_MAX_AGE, 10) || 7776000, // 90 days in seconds
    lockoutThreshold: parseInt(process.env.PASSWORD_LOCKOUT_THRESHOLD, 10) || 5, // 5 failed attempts
    lockoutDuration: parseInt(process.env.PASSWORD_LOCKOUT_DURATION, 10) || 1800, // 30 minutes in seconds
  },
  security: {
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // limit each IP to 100 requests per windowMs
    },
    cors: {
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
      methods: process.env.CORS_METHODS ? process.env.CORS_METHODS.split(',') : ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: process.env.CORS_CREDENTIALS === 'true',
    },
    contentSecurity: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    fileOutput: process.env.LOG_FILE_OUTPUT === 'true',
    filePath: process.env.LOG_FILE_PATH || './logs/auth-service.log',
  },
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true',
    metricsPath: process.env.METRICS_PATH || '/metrics',
  },
}));

export type AuthServiceConfig = ConfigType<typeof configuration>;

export default configuration;
export { configuration };