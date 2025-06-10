/**
 * Standardized error types for application exceptions
 * Used to categorize errors and determine appropriate HTTP status codes
 */
export enum ErrorType {
  /**
   * Validation errors - typically for invalid input data (400 Bad Request)
   */
  VALIDATION = 'VALIDATION',
  
  /**
   * Business logic errors - when an operation violates business rules (422 Unprocessable Entity)
   */
  BUSINESS = 'BUSINESS',
  
  /**
   * Resource not found errors (404 Not Found)
   */
  NOT_FOUND = 'NOT_FOUND',
  
  /**
   * Authentication errors - missing or invalid credentials (401 Unauthorized)
   */
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  /**
   * Permission errors - authenticated but not allowed (403 Forbidden)
   */
  FORBIDDEN = 'FORBIDDEN',
  
  /**
   * External service errors - issues with third-party services (502 Bad Gateway)
   */
  EXTERNAL = 'EXTERNAL',
  
  /**
   * Technical/infrastructure errors - internal server errors (500 Internal Server Error)
   */
  TECHNICAL = 'TECHNICAL',
  
  /**
   * Generic server errors (500 Internal Server Error)
   */
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  
  /**
   * Data consistency errors
   */
  DATA_CONSISTENCY = 'DATA_CONSISTENCY',
  
  /**
   * Rate limit exceeded errors (429 Too Many Requests)
   */
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  /**
   * Configuration errors
   */
  CONFIGURATION = 'CONFIGURATION',

  /**
   * Health service specific error codes
   */
  HEALTH_001 = 'HEALTH_001',
  HEALTH_002 = 'HEALTH_002',

  /**
   * Plan service specific error codes
   */
  PLAN_TECHNICAL_ERROR = 'PLAN_TECHNICAL_ERROR',
  PLAN_CLAIM_NOT_FOUND = 'PLAN_CLAIM_NOT_FOUND',
  PLAN_CLAIM_STATUS_INVALID = 'PLAN_CLAIM_STATUS_INVALID',
  PLAN_UNAUTHORIZED_ACCESS = 'PLAN_UNAUTHORIZED_ACCESS',

  /**
   * Notification service specific error codes
   */
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  NOTIFICATION_NOT_FOUND = 'NOTIFICATION_NOT_FOUND'
}

// For backward compatibility with services using the ErrorCodes constant
export const ErrorCodes = ErrorType;

// For backward compatibility with services using the ERROR_CODES constant
export const ERROR_CODES = ErrorType;