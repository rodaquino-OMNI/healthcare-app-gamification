/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorCodes } from '@app/shared/constants/error-codes.constants';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable, NestMiddleware, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

import { configuration } from '../config/configuration';

/**
 * Middleware that applies rate limiting to API requests.
 * Uses Redis to track request counts and applies journey-specific limits
 * to ensure fair usage and protect against abuse.
 */
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    constructor(
        private readonly redisService: RedisService,
        private readonly configService: ConfigService
    ) {}

    /**
     * Applies rate limiting logic to incoming requests.
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Extract the user's IP address from the request
            const ip =
                (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
                req.ip ||
                req.connection.remoteAddress ||
                'unknown';

            // Check if user is authenticated
            const isAuthenticated = !!(req as any).user;
            const userId = isAuthenticated ? (req as any).user.id : null;

            // Determine which journey this request is for
            const journey = this.getRequestJourney(req);

            // Construct a unique key for rate limiting
            // For authenticated users, use their ID; for anonymous users, use IP
            const identifier = isAuthenticated ? `user:${userId}` : `ip:${ip}`;
            const rateLimitKey = `rateLimit:${identifier}:${journey || 'global'}`;

            // Retrieve the rate limiting configuration from the ConfigService
            const rateLimitConfig = this.configService.get('apiGateway.rateLimit');
            if (!rateLimitConfig) {
                return next();
            }

            // Determine the maximum number of requests allowed
            let maxRequests = rateLimitConfig.max;
            if (journey && rateLimitConfig.journeyLimits && rateLimitConfig.journeyLimits[journey]) {
                maxRequests = rateLimitConfig.journeyLimits[journey];
            }

            // Authenticated users get higher limits
            if (isAuthenticated) {
                maxRequests *= 3; // Triple the limit for authenticated users
            }

            // Check if the rate limit key exists
            const exists = await this.redisService.exists(rateLimitKey);

            // Get the window duration in seconds
            const windowSeconds = Math.floor(rateLimitConfig.windowMs / 1000);

            // Journey-specific TTL based on data volatility
            const ttl = journey ? this.redisService.getJourneyTTL(journey) : windowSeconds;

            if (exists) {
                // Key exists, get current count
                const requestCount = await this.redisService.get(rateLimitKey);
                const currentCount = parseInt(requestCount || '0', 10);

                if (currentCount >= maxRequests) {
                    // Get remaining time until reset
                    const remainingTtl = await this.redisService.ttl(rateLimitKey);

                    // Set rate limit headers
                    if (rateLimitConfig.standardHeaders) {
                        res.setHeader('RateLimit-Limit', maxRequests.toString());
                        res.setHeader('RateLimit-Remaining', '0');
                        res.setHeader('RateLimit-Reset', Math.ceil(Date.now() / 1000 + remainingTtl).toString());
                        res.setHeader('Retry-After', remainingTtl.toString());
                    }

                    // Return 429 Too Many Requests error
                    throw new HttpException(
                        {
                            statusCode: HttpStatus.TOO_MANY_REQUESTS,
                            error: 'Too Many Requests',
                            message: rateLimitConfig.message || 'Too many requests, please try again later.',
                            code: 'API_001', // API_RATE_LIMIT_EXCEEDED constant value
                        },
                        HttpStatus.TOO_MANY_REQUESTS
                    );
                }

                // Increment the request count
                await this.redisService.set(rateLimitKey, (currentCount + 1).toString(), ttl);

                // Set rate limit headers
                if (rateLimitConfig.standardHeaders) {
                    const remaining = Math.max(0, maxRequests - (currentCount + 1));
                    const resetTime = Math.ceil(Date.now() / 1000 + (await this.redisService.ttl(rateLimitKey)));

                    res.setHeader('RateLimit-Limit', maxRequests.toString());
                    res.setHeader('RateLimit-Remaining', remaining.toString());
                    res.setHeader('RateLimit-Reset', resetTime.toString());
                }
            } else {
                // Key doesn't exist, create it with initial count of 1
                await this.redisService.set(rateLimitKey, '1', ttl);

                // Set rate limit headers
                if (rateLimitConfig.standardHeaders) {
                    res.setHeader('RateLimit-Limit', maxRequests.toString());
                    res.setHeader('RateLimit-Remaining', (maxRequests - 1).toString());
                    res.setHeader('RateLimit-Reset', Math.ceil(Date.now() / 1000 + ttl).toString());
                }
            }

            // Call the next middleware in the chain
            next();
        } catch (error) {
            if (error instanceof HttpException) {
                throw error as any;
            }

            // For unexpected errors, log and continue
            console.error('Rate limit middleware error:', error);
            next();
        }
    }

    /**
     * Determine which journey the request belongs to based on the path or GraphQL operation.
     * @param req The Express request object
     * @returns The journey identifier or null if not determined
     */
    private getRequestJourney(req: Request): string | null {
        // First check path segments
        const path = req.path.toLowerCase();

        if (path.includes('/health')) {
            return 'health';
        } else if (path.includes('/care')) {
            return 'care';
        } else if (path.includes('/plan')) {
            return 'plan';
        } else if (path.includes('/gamification') || path.includes('/game')) {
            return 'game';
        }

        // If path doesn't indicate journey, try GraphQL operation (if available)
        if (req.body?.operationName && typeof req.body.operationName === 'string') {
            const operation = req.body.operationName.toLowerCase();

            if (operation.includes('health')) {
                return 'health';
            }
            if (operation.includes('care')) {
                return 'care';
            }
            if (operation.includes('plan')) {
                return 'plan';
            }
            if (operation.includes('game') || operation.includes('achievement')) {
                return 'game';
            }
        }

        return null;
    }
}
