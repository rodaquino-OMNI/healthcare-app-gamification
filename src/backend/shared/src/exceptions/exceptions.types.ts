import { HttpStatus } from '@nestjs/common';

import { ErrorType } from './error.types';

// Re-export ErrorType so it can be imported from this file
export { ErrorType };

/**
 * Base application exception class
 * Extends Error to provide additional context for API exceptions
 */
export class AppException extends Error {
    /**
     * Type of error (validation, business, etc.)
     */
    readonly type: ErrorType;

    /**
     * Error code for client identification
     */
    readonly code: string | number;

    /**
     * Optional metadata for additional context
     */
    readonly metadata?: Record<string, unknown>;

    /**
     * HTTP status code to return
     */
    readonly statusCode: HttpStatus;

    /**
     * Stack trace
     */
    readonly stack!: string; // Using definite assignment assertion

    constructor(
        message: string,
        type: ErrorType = ErrorType.TECHNICAL,
        code: string | number = 'UNKNOWN_ERROR',
        metadata?: Record<string, unknown>,
        statusCode?: HttpStatus
    ) {
        super(message);
        this.name = this.constructor.name;
        this.type = type;
        this.code = code;
        this.metadata = metadata;
        this.statusCode = statusCode || this.mapTypeToStatusCode(type);

        // Ensure stack trace is captured
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Converts the exception to a JSON object
     */
    toJSON(): Record<string, unknown> {
        return {
            message: this.message,
            type: this.type,
            code: this.code,
            metadata: this.metadata,
            statusCode: this.statusCode,
        };
    }

    /**
     * Maps error types to HTTP status codes
     */
    private mapTypeToStatusCode(type: ErrorType): HttpStatus {
        switch (type) {
            case ErrorType.VALIDATION:
                return HttpStatus.BAD_REQUEST;
            case ErrorType.BUSINESS:
                return HttpStatus.UNPROCESSABLE_ENTITY;
            case ErrorType.NOT_FOUND:
                return HttpStatus.NOT_FOUND;
            case ErrorType.UNAUTHORIZED:
                return HttpStatus.UNAUTHORIZED;
            case ErrorType.FORBIDDEN:
                return HttpStatus.FORBIDDEN;
            case ErrorType.EXTERNAL:
                return HttpStatus.BAD_GATEWAY;
            case ErrorType.TECHNICAL:
                return HttpStatus.INTERNAL_SERVER_ERROR;
            case ErrorType.INTERNAL_SERVER_ERROR:
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}

/**
 * Specialized exception for validation errors
 */
export class ValidationException extends AppException {
    constructor(
        message: string,
        code: string | number = 'VALIDATION_ERROR',
        metadata?: Record<string, unknown>
    ) {
        super(message, ErrorType.VALIDATION, code, metadata);
    }
}

/**
 * Specialized exception for business logic errors
 */
export class BusinessException extends AppException {
    constructor(
        message: string,
        code: string | number = 'BUSINESS_ERROR',
        metadata?: Record<string, unknown>
    ) {
        super(message, ErrorType.BUSINESS, code, metadata);
    }
}

/**
 * Specialized exception for not found errors
 */
export class NotFoundException extends AppException {
    constructor(
        message: string,
        code: string | number = 'NOT_FOUND',
        metadata?: Record<string, unknown>
    ) {
        super(message, ErrorType.NOT_FOUND, code, metadata);
    }
}

/**
 * Specialized exception for external service errors
 */
export class ExternalServiceException extends AppException {
    constructor(
        message: string,
        code: string | number = 'EXTERNAL_SERVICE_ERROR',
        metadata?: Record<string, unknown>
    ) {
        super(message, ErrorType.EXTERNAL, code, metadata);
    }
}
