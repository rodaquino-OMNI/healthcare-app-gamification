import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Enum representing different types of errors in the application.
 * Used to categorize exceptions for consistent error handling across services.
 */
export enum ErrorType {
  /**
   * Validation errors - input data fails validation requirements
   * Maps to HTTP 400 Bad Request
   */
  VALIDATION = 'validation',
  
  /**
   * Business logic errors - operation cannot be completed due to business rules
   * Maps to HTTP 422 Unprocessable Entity
   */
  BUSINESS = 'business',
  
  /**
   * Technical errors - unexpected system errors and exceptions
   * Maps to HTTP 500 Internal Server Error
   */
  TECHNICAL = 'technical',
  
  /**
   * External system errors - failures in external services or dependencies
   * Maps to HTTP 502 Bad Gateway
   */
  EXTERNAL = 'external',
  
  /**
   * Not found errors - requested resource doesn't exist
   * Maps to HTTP 404 Not Found
   */
  NOT_FOUND = 'not_found'
}

/**
 * Base class for application-specific exceptions, providing a standardized error structure.
 * All custom exceptions in the AUSTA SuperApp should extend this class to ensure
 * consistent error handling and responses across all journeys.
 */
export class AppException extends Error {
  /**
   * Creates a new AppException instance.
   * 
   * @param message - Human-readable error message
   * @param type - Type of error from ErrorType enum
   * @param code - Error code for more specific categorization (e.g., "HEALTH_001")
   * @param details - Additional details about the error (optional)
   * @param cause - Original error that caused this exception, if any (optional)
   */
  constructor(
    public readonly message: string,
    public readonly type: ErrorType,
    public readonly code: string,
    public readonly details?: any,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppException.prototype);
  }

  /**
   * Returns a JSON representation of the exception.
   * Used for consistent error responses across the application.
   * 
   * @returns JSON object with standardized error structure
   */
  toJSON(): Record<string, any> {
    return {
      error: {
        type: this.type,
        code: this.code,
        message: this.message,
        details: this.details
      }
    };
  }

  /**
   * Converts the AppException to an HttpException for NestJS.
   * Maps error types to appropriate HTTP status codes.
   * 
   * @returns An HttpException instance that can be thrown in NestJS controllers
   */
  toHttpException(): HttpException {
    const statusCode = this.getHttpStatusCode();
    return new HttpException(this.toJSON(), statusCode);
  }

  /**
   * Determines the appropriate HTTP status code based on the error type.
   * @private
   */
  private getHttpStatusCode(): HttpStatus {
    switch (this.type) {
      case ErrorType.VALIDATION:
        return HttpStatus.BAD_REQUEST;
      case ErrorType.BUSINESS:
        return HttpStatus.UNPROCESSABLE_ENTITY;
      case ErrorType.EXTERNAL:
        return HttpStatus.BAD_GATEWAY;
      case ErrorType.NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case ErrorType.TECHNICAL:
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}