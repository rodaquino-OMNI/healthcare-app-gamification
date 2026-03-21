import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware that logs incoming requests and outgoing responses.
 * Adds request tracing via correlation IDs and logs request/response details.
 */
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    constructor(private readonly loggerService: LoggerService) {
        this.loggerService.setContext('LoggingMiddleware');
    }

    use(req: Request, res: Response, next: NextFunction): void {
        try {
            // Generate a correlation ID if not already present
            const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();

            // Add correlation ID to response headers
            res.setHeader('X-Correlation-Id', correlationId);

            // Extract request information
            const { method, originalUrl } = req;
            const body = req.body as Record<string, unknown> | undefined;
            const userAgent = req.get('user-agent') || 'unknown';
            const ipAddress = this.getIpAddress(req);

            // Create a context for logging
            const logContext = {
                correlationId,
                method,
                originalUrl,
                ipAddress,
                userAgent,
            };

            // Log the request
            const hasBody = body !== undefined && body !== null && Object.keys(body).length > 0;
            const requestMeta: Record<string, unknown> = {
                ...logContext,
                hasBody,
                // Don't log sensitive body data like passwords
                body: hasBody ? this.sanitizeRequestBody(body) : undefined,
            };
            this.loggerService.log(
                `Request received ${method} ${originalUrl} ` + JSON.stringify(requestMeta)
            );

            // Calculate request start time
            const startTime = process.hrtime();

            // Store the logger reference for use in the end method override
            const loggerService = this.loggerService;

            // Override response end method to log response
            const originalEnd = res.end.bind(res);

            // Use type assertion to avoid complex overload resolution on Response.end
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Response.end has 6+ overloads; typed wrapper is impractical
            res.end = function (this: Response, ...args: unknown[]): unknown {
                // Calculate request duration
                const [seconds, nanoseconds] = process.hrtime(startTime);
                const responseTime = seconds * 1000 + nanoseconds / 1000000;

                // Get status code and content length
                const statusCode = res.statusCode;
                const contentLength = res.getHeader('content-length') || 0;

                // Log the response
                const responseMeta = {
                    ...logContext,
                    statusCode,
                    contentLength,
                    responseTime,
                };
                const msg =
                    `Response sent ${statusCode} ` +
                    `${method} ${originalUrl} - ` +
                    `${responseTime.toFixed(2)}ms ` +
                    JSON.stringify(responseMeta);
                if (statusCode >= 400) {
                    loggerService.warn(msg);
                } else {
                    loggerService.log(msg);
                }

                // Call the original end function
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument -- apply requires any[] for overloaded .end()
                return (originalEnd as (...a: any[]) => unknown)(...args);
            } as Response['end'];

            next();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : 'No stack trace';
            this.loggerService.error(`Logging error: ${errorMessage}`, errorStack);
            next();
        }
    }

    /**
     * Extracts the IP address from the request.
     * Handles various proxy headers and fallbacks.
     *
     * @param req - The Express request object
     * @returns The client IP address
     */
    private getIpAddress(req: Request): string {
        return (
            (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
            req.ip ||
            req.connection.remoteAddress ||
            'unknown'
        );
    }

    /**
     * Sanitizes the request body to remove sensitive information.
     *
     * @param body - The request body to sanitize
     * @returns The sanitized body
     */
    private sanitizeRequestBody(body: Record<string, unknown>): Record<string, unknown> {
        if (!body) {
            return body;
        }

        const sanitized: Record<string, unknown> = { ...body };
        // Mask sensitive fields
        const sensitiveFields = [
            'password',
            'newPassword',
            'currentPassword',
            'token',
            'secret',
            'authorization',
        ];

        sensitiveFields.forEach((field) => {
            if (sanitized[field] !== undefined) {
                sanitized[field] = '******';
            }
        });
        return sanitized;
    }
}
