import { AuthService } from '@app/auth/auth/auth.service';
import { UsersService } from '@app/auth/users/users.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable, NestMiddleware, HttpStatus, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

import { ApiGatewayConfig } from '../config/configuration';

/** Auth config subset needed by this middleware. */
interface AuthConfig {
    jwtSecret?: string;
}

/** Possible shapes the injected config can take at runtime. */
interface ResolvedConfig {
    auth?: AuthConfig;
    apiGateway?: { auth?: AuthConfig };
}

/**
 * Middleware that authenticates incoming requests by verifying
 * the JWT token in the Authorization header.
 * Implements the requirements for API Gateway authentication
 * and authorization.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    /**
     * Constructor for the AuthMiddleware class.
     *
     * @param authService Service for authentication operations
     * @param usersService Service for user management operations
     * @param loggerService Service for logging
     * @param config Configuration for the API Gateway
     */
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly loggerService: LoggerService,
        private readonly config: ResolvedConfig | (() => ApiGatewayConfig)
    ) {
        this.loggerService.setContext('AuthMiddleware');
    }

    /**
     * Authenticates the request by verifying the JWT token
     * and attaching user information to the request object.
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     * @returns A promise that resolves when the middleware is complete
     */
    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Extract the token from the Authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                // If no token is provided, allow the request to proceed to public routes
                this.loggerService.log('No authentication token provided');
                return next();
            }

            // Validate the format of the Authorization header (Bearer token)
            const [type, token] = authHeader.split(' ');
            if (type !== 'Bearer' || !token) {
                this.loggerService.error('Invalid authorization header format');
                throw new HttpException(
                    'Invalid authorization header format',
                    HttpStatus.UNAUTHORIZED
                );
            }

            try {
                // Get JWT secret from configuration
                const jwtSecret = this.getJwtSecret();

                // Verify the JWT token
                const decoded = verify(token, jwtSecret) as JwtPayload;
                const userId = decoded.sub as string;

                // Validate that the user exists in the database
                try {
                    await this.usersService.findOne(userId);
                } catch (error) {
                    const errorType =
                        error instanceof Error ? error.constructor.name : 'UnknownError';
                    this.loggerService.warn(`User not found: ${errorType}`);
                    throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);
                }

                // Attach user information to the request object
                (req as Request & { user: unknown })['user'] = {
                    id: userId,
                    email: decoded.email as string | undefined,
                };

                this.loggerService.debug(`Authenticated user: ${userId}`);
                return next();
            } catch (error) {
                if (error instanceof HttpException) {
                    throw error;
                }
                const errorType = error instanceof Error ? error.constructor.name : 'UnknownError';
                this.loggerService.warn(`Token verification failed: ${errorType}`);
                throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                const errorType = error instanceof Error ? error.constructor.name : 'UnknownError';
                this.loggerService.warn(`Authentication error: ${errorType}`);
                throw new HttpException('Authentication failed', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    /**
     * Gets the JWT secret from the configuration.
     *
     * @returns The JWT secret
     * @private
     */
    private getJwtSecret(): string {
        try {
            if (typeof this.config === 'function') {
                // If configuration is a function (registerAs result)
                const cfg = this.config();
                if (cfg.auth.jwtSecret) {
                    return cfg.auth.jwtSecret;
                }
            } else if (this.config.apiGateway?.auth?.jwtSecret) {
                // If configuration is already resolved with apiGateway namespace
                return this.config.apiGateway.auth.jwtSecret;
            } else if (this.config.auth?.jwtSecret) {
                // If auth is directly on the configuration object
                return this.config.auth.jwtSecret;
            }
        } catch (error) {
            this.loggerService.warn('Error resolving JWT secret from configuration');
        }

        // Fallback to environment variable -- no hardcoded default allowed
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is required');
        }
        return jwtSecret;
    }
}
