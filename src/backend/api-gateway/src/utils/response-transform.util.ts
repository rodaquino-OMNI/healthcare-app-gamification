import {
    ErrorCodes,
    AUTH_INVALID_CREDENTIALS,
    AUTH_INSUFFICIENT_PERMISSIONS,
    AUTH_TOKEN_INVALID,
} from '@app/shared/constants/error-codes.constants';
import { JOURNEY_IDS } from '@app/shared/constants/journey.constants';
import { HttpStatus, Logger } from '@nestjs/common';

const logger = new Logger('ResponseTransformUtil');

// Additional error code constants not in the ErrorCodes enum
const API_RATE_LIMIT_EXCEEDED = 'API_RATE_LIMIT_EXCEEDED';
const API_INVALID_PARAMETER = 'API_INVALID_PARAMETER';

/** Shape of an upstream error with an HTTP-like response (e.g. Axios errors). */
interface UpstreamErrorResponse {
    response?: {
        status?: number;
        data?: {
            message?: string;
            errorCode?: string;
            path?: string;
        };
    };
    config?: { url?: string };
    status?: number;
    message?: string;
    errorCode?: string;
    path?: string;
    journey?: string;
    stack?: string;
}

/**
 * Transforms a successful response from a backend service
 * into a standardized format for the client.
 *
 * @param data - The data to transform
 * @returns The transformed response data
 */
export function transformResponse(data: unknown): unknown {
    // If data is null or undefined, return an empty object
    if (data === null || data === undefined) {
        return {};
    }

    // Return the data as is
    return data;
}

/**
 * Transforms an error response from a backend service
 * into a standardized format for the client.
 * Extracts relevant information from various error types
 * and converts them to a consistent format.
 *
 * @param error - The error to transform
 * @returns A standardized error response object
 */
export function transformErrorResponse(error: UpstreamErrorResponse): {
    statusCode: number;
    errorCode: string;
    message: string;
    timestamp: string;
    path?: string;
    journey?: string;
} {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'An unexpected error occurred';
    let errorCode: string = ErrorCodes.SYS_INTERNAL_SERVER_ERROR as string;
    let path: string | undefined;
    let journey: string | undefined;

    logger.error(`Transforming error response: ${JSON.stringify(error)}`, error.stack);

    // Extract status code and message from error response if available
    if (error.response) {
        // Handle Axios-like error objects
        statusCode = error.response.status || statusCode;
        errorMessage = error.response.data?.message || error.message || errorMessage;
        errorCode = error.response.data?.errorCode || errorCode;
        path = error.response.data?.path || error.config?.url;

        // Extract journey from path if available
        if (path) {
            Object.values(JOURNEY_IDS).forEach((journeyId) => {
                if (path?.includes(`/${journeyId}/`)) {
                    journey = journeyId;
                }
            });
        }
    } else if (error.status) {
        // Handle NestJS HttpException or similar error objects
        statusCode = error.status;
        errorMessage = error.message || errorMessage;
        errorCode = error.errorCode || errorCode;
        path = error.path;
        journey = error.journey;
    } else if (error instanceof Error) {
        // Handle standard Error objects
        errorMessage = error.message || errorMessage;
    }

    // Map specific error messages to appropriate error codes
    if (errorCode === (ErrorCodes.SYS_INTERNAL_SERVER_ERROR as string)) {
        if (
            errorMessage.toLowerCase().includes('unauthorized') ||
            errorMessage.toLowerCase().includes('unauthenticated')
        ) {
            errorCode = AUTH_INVALID_CREDENTIALS;
            statusCode = HttpStatus.UNAUTHORIZED;
        } else if (errorMessage.toLowerCase().includes('forbidden')) {
            errorCode = AUTH_INSUFFICIENT_PERMISSIONS;
            statusCode = HttpStatus.FORBIDDEN;
        } else if (errorMessage.toLowerCase().includes('token expired')) {
            errorCode = AUTH_TOKEN_INVALID;
            statusCode = HttpStatus.UNAUTHORIZED;
        } else if (errorMessage.toLowerCase().includes('rate limit')) {
            errorCode = API_RATE_LIMIT_EXCEEDED;
            statusCode = HttpStatus.TOO_MANY_REQUESTS;
        } else if (
            errorMessage.toLowerCase().includes('invalid input') ||
            errorMessage.toLowerCase().includes('validation failed')
        ) {
            errorCode = API_INVALID_PARAMETER;
            statusCode = HttpStatus.BAD_REQUEST;
        }
    }

    // Create standardized error response
    const errorResponse = {
        statusCode,
        errorCode,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        ...(path && { path }),
        ...(journey && { journey }),
    };

    logger.debug(`Transformed error response: ${JSON.stringify(errorResponse)}`);

    return errorResponse;
}
