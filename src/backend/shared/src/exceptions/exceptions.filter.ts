import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

import { AppException, ErrorType } from './exceptions.types';
import { LoggerService } from '../logging/logger.service';

/**
 * Global exception filter that catches all exceptions, transforms them into a standardized format,
 * and logs them appropriately based on their type and severity.
 */
@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) {
        this.logger.log('ExceptionsFilter initialized', 'ExceptionsFilter');
    }

    catch(exception: Error, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorResponse: any;

        // Extract request information for logging context
        const requestInfo = {
            method: request.method,
            url: request.url,
            userId: request.user?.id,
            journeyId: request.headers['x-journey-id'],
        };

        // Handle different types of exceptions
        if (exception instanceof AppException) {
            // For our custom AppExceptions, use the built-in methods
            errorResponse = exception.toJSON();
            statusCode = this.getStatusCodeFromErrorType(exception.type);
            this.logAppException(exception, requestInfo);
            if (process.env.NODE_ENV === 'production') {
                Sentry.captureException(exception, {
                    extra: { path: requestInfo.url, method: requestInfo.method, statusCode },
                });
            }
        } else if (exception instanceof HttpException) {
            // For NestJS HttpExceptions
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object') {
                errorResponse = {
                    error: {
                        ...(typeof exceptionResponse === 'object' ? exceptionResponse : { message: exceptionResponse }),
                        type: this.getErrorTypeFromStatus(statusCode),
                    },
                };
            } else {
                errorResponse = {
                    error: {
                        type: this.getErrorTypeFromStatus(statusCode),
                        message: exceptionResponse,
                    },
                };
            }

            this.logHttpException(exception, statusCode, requestInfo);
            if (process.env.NODE_ENV === 'production') {
                Sentry.captureException(exception, {
                    extra: { path: requestInfo.url, method: requestInfo.method, statusCode },
                });
            }
        } else {
            // For unknown exceptions
            errorResponse = {
                error: {
                    type: ErrorType.TECHNICAL,
                    code: 'INTERNAL_ERROR',
                    message: 'An unexpected error occurred',
                    // Include additional details in non-production environments
                    ...(process.env.NODE_ENV !== 'production' && {
                        details: {
                            name: exception.name,
                            message: exception.message,
                        },
                    }),
                },
            };

            this.logUnknownException(exception, requestInfo);
            if (process.env.NODE_ENV === 'production') {
                Sentry.captureException(exception, {
                    extra: { path: requestInfo.url, method: requestInfo.method, statusCode },
                });
            }
        }

        // Send the response
        return response.status(statusCode).json(errorResponse);
    }

    /**
     * Maps error types to HTTP status codes
     */
    private getStatusCodeFromErrorType(type: ErrorType): HttpStatus {
        switch (type) {
            case ErrorType.VALIDATION:
                return HttpStatus.BAD_REQUEST;
            case ErrorType.BUSINESS:
                return HttpStatus.UNPROCESSABLE_ENTITY;
            case ErrorType.EXTERNAL:
                return HttpStatus.BAD_GATEWAY;
            case ErrorType.TECHNICAL:
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

    /**
     * Maps HTTP status codes to error types
     */
    private getErrorTypeFromStatus(status: HttpStatus): ErrorType {
        if (status >= 400 && status < 500) {
            if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
                return ErrorType.BUSINESS;
            }
            return ErrorType.VALIDATION;
        } else if (status >= 500) {
            if (
                status === HttpStatus.BAD_GATEWAY ||
                status === HttpStatus.SERVICE_UNAVAILABLE ||
                status === HttpStatus.GATEWAY_TIMEOUT
            ) {
                return ErrorType.EXTERNAL;
            }
            return ErrorType.TECHNICAL;
        }
        return ErrorType.TECHNICAL;
    }

    /**
     * Logs application-specific exceptions
     */
    private logAppException(exception: AppException, requestInfo: any): void {
        // Destructure using metadata property instead of details
        const { message, type, code, metadata } = exception;
        const logContext = 'ExceptionsFilter';

        switch (type) {
            case ErrorType.TECHNICAL:
                this.logger.error(`Technical error: ${message} (${code})`, exception.stack, logContext);
                break;
            case ErrorType.EXTERNAL:
                this.logger.error(`External system error: ${message} (${code})`, exception.stack, logContext);
                break;
            case ErrorType.BUSINESS:
                this.logger.warn(`Business error: ${message} (${code})`, logContext);
                break;
            case ErrorType.VALIDATION:
                this.logger.debug(`Validation error: ${message} (${code})`, logContext);
                break;
        }
    }

    /**
     * Logs NestJS HTTP exceptions
     */
    private logHttpException(exception: HttpException, status: HttpStatus, requestInfo: any): void {
        const message = exception.message;
        const logContext = 'ExceptionsFilter';

        if (status >= 500) {
            this.logger.error(`HTTP ${status} exception: ${message}`, exception.stack, logContext);
        } else if (status >= 400) {
            this.logger.warn(`HTTP ${status} exception: ${message}`, logContext);
        } else {
            this.logger.debug(`HTTP ${status} exception: ${message}`, logContext);
        }
    }

    /**
     * Logs unknown exceptions
     */
    private logUnknownException(exception: Error, requestInfo: any): void {
        this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack, 'ExceptionsFilter');
    }
}
