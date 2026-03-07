/**
 * Defines error types used throughout the health service
 */
export enum ErrorType {
    VALIDATION = 'VALIDATION',
    BUSINESS = 'BUSINESS',
    TECHNICAL = 'TECHNICAL',
    EXTERNAL = 'EXTERNAL',
    NOT_FOUND = 'NOT_FOUND',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
}

/**
 * Common health service error codes
 */
export const ERROR_CODES = {
    HEALTH_001: 'HEALTH_001', // Invalid input data
    HEALTH_002: 'HEALTH_002', // Resource not found
    HEALTH_003: 'HEALTH_003', // Unauthorized access
    HEALTH_004: 'HEALTH_004', // Forbidden operation
    HEALTH_404: 'HEALTH_404', // Not found
    HEALTH_500: 'HEALTH_500', // Internal server error
};
