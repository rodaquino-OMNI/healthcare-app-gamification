/**
 * System-level error codes
 */
export const SYS_INTERNAL_SERVER_ERROR = 'SYS_001';
export const SYS_SERVICE_UNAVAILABLE = 'SYS_002';
export const SYS_BAD_GATEWAY = 'SYS_003';
export const SYS_UNAUTHORIZED = 'SYS_004';
export const SYS_FORBIDDEN = 'SYS_005';
export const SYS_NOT_FOUND = 'SYS_006';
export const SYS_VALIDATION_ERROR = 'SYS_007';
export const SYS_CONFLICT = 'SYS_008';

/**
 * Error code constants for authentication and authorization errors
 */
export const AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS';
export const AUTH_USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND';
export const AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED';
export const AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID';
export const AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH_INSUFFICIENT_PERMISSIONS';
export const AUTH_EMAIL_IN_USE = 'AUTH_EMAIL_IN_USE';
export const AUTH_USERNAME_IN_USE = 'AUTH_USERNAME_IN_USE';

/**
 * Error code constants for user-related errors
 */
export const USER_NOT_FOUND = 'USER_NOT_FOUND';
export const USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS';
export const USER_VALIDATION_ERROR = 'USER_VALIDATION_ERROR';

/**
 * Error code constants for profile-related errors
 */
export const PROFILE_NOT_FOUND = 'PROFILE_NOT_FOUND';
export const PROFILE_ALREADY_EXISTS = 'PROFILE_ALREADY_EXISTS';

/**
 * Error code constants for external service errors
 */
export const EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR';
export const EXTERNAL_SERVICE_TIMEOUT = 'EXTERNAL_SERVICE_TIMEOUT';
export const EXTERNAL_SERVICE_UNAVAILABLE = 'EXTERNAL_SERVICE_UNAVAILABLE';

/**
 * Error code constants for validation errors
 */
export const VALIDATION_ERROR = 'VALIDATION_ERROR';
export const VALIDATION_REQUIRED_FIELD = 'VALIDATION_REQUIRED_FIELD';
export const VALIDATION_INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT';

/**
 * Error code constants for database errors
 */
export const DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR';
export const DATABASE_QUERY_ERROR = 'DATABASE_QUERY_ERROR';
export const DATABASE_CONSTRAINT_ERROR = 'DATABASE_CONSTRAINT_ERROR';

/**
 * Care journey specific error codes
 */
export const CARE_TREATMENT_PLAN_NOT_FOUND = 'CARE_TREATMENT_PLAN_NOT_FOUND';

/**
 * Error code enum for strongly typed references
 */
export enum ErrorCodes {
  // System codes
  SYS_INTERNAL_SERVER_ERROR = 'SYS_001',
  SYS_SERVICE_UNAVAILABLE = 'SYS_002',
  SYS_BAD_GATEWAY = 'SYS_003',
  SYS_UNAUTHORIZED = 'SYS_004',
  SYS_FORBIDDEN = 'SYS_005',
  SYS_NOT_FOUND = 'SYS_006',
  SYS_VALIDATION_ERROR = 'SYS_007',
  SYS_CONFLICT = 'SYS_008',
  
  // Health journey codes
  HEALTH_RECORD_NOT_FOUND = 'HEALTH_RECORD_NOT_FOUND',
  HEALTH_DEVICE_CONNECTION_FAILED = 'HEALTH_DEVICE_CONNECTION_FAILED',
  
  // Care journey codes
  CARE_PROVIDER_NOT_FOUND = 'CARE_PROVIDER_NOT_FOUND',
  CARE_TREATMENT_PLAN_NOT_FOUND = 'CARE_TREATMENT_PLAN_NOT_FOUND',
  
  // Plan journey codes
  PLAN_NOT_FOUND = 'PLAN_NOT_FOUND'
}

/**
 * Interface for error code details
 */
export interface ErrorCodeDetails {
  code: string;
  message: string;
  statusCode: number;
}

/**
 * Interface for error code detail mappings
 */
export interface ErrorCodeDetail {
  message: string;
  statusCode: number;
  documentation?: string;
}

/**
 * Detailed information for error codes, including default messages and status codes
 */
export const ErrorCodeDetails: Record<string, ErrorCodeDetail> = {
  // System-level errors
  [ErrorCodes.SYS_INTERNAL_SERVER_ERROR]: {
    message: 'An internal server error occurred',
    statusCode: 500,
    documentation: 'https://docs.austa.health/errors/SYS-001'
  },
  
  // Health journey errors
  [ErrorCodes.HEALTH_RECORD_NOT_FOUND]: {
    message: 'Health record not found',
    statusCode: 404,
    documentation: 'https://docs.austa.health/errors/HEALTH_RECORD_NOT_FOUND'
  },
  [ErrorCodes.HEALTH_DEVICE_CONNECTION_FAILED]: {
    message: 'Device connection failed',
    statusCode: 400,
    documentation: 'https://docs.austa.health/errors/HEALTH_DEVICE_CONNECTION_FAILED'
  },
  
  // Care journey errors
  [ErrorCodes.CARE_PROVIDER_NOT_FOUND]: {
    message: 'Provider not found',
    statusCode: 404,
    documentation: 'https://docs.austa.health/errors/CARE_PROVIDER_NOT_FOUND'
  },
  [ErrorCodes.CARE_TREATMENT_PLAN_NOT_FOUND]: {
    message: 'Treatment plan not found',
    statusCode: 404,
    documentation: 'https://docs.austa.health/errors/CARE_TREATMENT_PLAN_NOT_FOUND'
  },
  
  // Plan journey errors
  [ErrorCodes.PLAN_NOT_FOUND]: {
    message: 'Plan not found',
    statusCode: 404,
    documentation: 'https://docs.austa.health/errors/PLAN_NOT_FOUND'
  },
  
  // Default fallback
  'DEFAULT': {
    message: 'An unknown error occurred',
    statusCode: 500
  }
};