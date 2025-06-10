import * as Joi from 'joi';
import { ErrorType } from '@app/shared/exceptions/exceptions.types';

/**
 * Validation schema for the API Gateway configuration.
 * Ensures all required configuration parameters are provided and have the correct format.
 */
export class ApiGatewayConfigValidation {
  /**
   * Complete validation schema for the API Gateway configuration
   */
  static schema = Joi.object({
    env: Joi.string().valid('development', 'staging', 'production', 'test').required()
      .description('Application environment'),
    server: Joi.object({
      port: Joi.number().port().required()
        .description('Port number the API Gateway will listen on'),
      cors: Joi.object({
        origin: Joi.alternatives().try(
          Joi.string(),
          Joi.array().items(Joi.string(), Joi.object().instance(RegExp))
        ).required()
          .description('Allowed origins for CORS'),
        credentials: Joi.boolean().default(true)
          .description('Whether to allow credentials in CORS requests'),
        methods: Joi.array().items(Joi.string()).default(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'])
          .description('Allowed HTTP methods'),
        allowedHeaders: Joi.array().items(Joi.string())
          .description('Allowed HTTP headers'),
        exposedHeaders: Joi.array().items(Joi.string())
          .description('HTTP headers exposed to the browser')
      }).required()
        .description('CORS configuration')
    }).required()
      .description('Server configuration'),
    
    authentication: Joi.object({
      jwtSecret: Joi.string().min(32).required()
        .description('Secret key for JWT token signing'),
      tokenExpiration: Joi.string().pattern(/^\d+[smhd]$/).required()
        .description('JWT access token expiration period (e.g., "1h", "30m")'),
      refreshTokenExpiration: Joi.string().pattern(/^\d+[smhd]$/).required()
        .description('JWT refresh token expiration period (e.g., "7d", "30d")')
    }).required()
      .description('Authentication configuration'),
    
    rateLimiting: Joi.object({
      windowMs: Joi.number().min(1000).required()
        .description('Time window for rate limiting in milliseconds'),
      max: Joi.number().min(1).required()
        .description('Maximum number of requests within the time window'),
      journeyLimits: Joi.object().pattern(
        Joi.string().valid('health', 'care', 'plan'),
        Joi.number().min(1)
      ).required()
        .description('Rate limits specific to each journey'),
      standardHeaders: Joi.boolean().default(true)
        .description('Whether to add standard rate limit headers to responses'),
      legacyHeaders: Joi.boolean().default(false)
        .description('Whether to add legacy rate limit headers to responses')
    }).required()
      .description('Rate limiting configuration'),
    
    caching: Joi.object({
      ttl: Joi.object().pattern(
        Joi.string().valid('health', 'care', 'plan'),
        Joi.string().pattern(/^\d+[smh]$/)
      ).required()
        .description('Time-to-live for cached responses by journey'),
      maxItems: Joi.number().min(100).default(1000)
        .description('Maximum number of items in the cache'),
      checkPeriod: Joi.number().min(0).default(600)
        .description('How often to check for expired items (in seconds)')
    }).required()
      .description('Caching configuration'),
    
    services: Joi.object({
      health: Joi.string().uri().required()
        .description('Health journey service URL'),
      care: Joi.string().uri().required()
        .description('Care journey service URL'),
      plan: Joi.string().uri().required()
        .description('Plan journey service URL'),
      game: Joi.string().uri().required()
        .description('Gamification service URL'),
      auth: Joi.string().uri().required()
        .description('Authentication service URL')
    }).required()
      .description('Microservices endpoints')
  }).required()
    .description('API Gateway configuration');

  /**
   * Validation options
   */
  static validationOptions = {
    abortEarly: false,
    errors: {
      label: 'key',
      wrap: {
        label: false
      }
    }
  };

  /**
   * Constructor for the validation schema.
   */
  constructor() {}
}