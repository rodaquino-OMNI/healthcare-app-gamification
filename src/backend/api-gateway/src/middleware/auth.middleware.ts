/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthService } from '@app/auth/auth/auth.service';
import { UsersService } from '@app/auth/users/users.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable, NestMiddleware, HttpStatus, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

import { configuration } from '../config/configuration';

/**
 * Middleware that authenticates incoming requests by verifying the JWT token in the Authorization header.
 * Implements the requirements for API Gateway authentication and authorization.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    /**
     * Constructor for the AuthMiddleware class.
     *
     * @param authService Service for authentication operations
     * @param usersService Service for user management operations
     * @param loggerService Service for logging
     * @param configuration Configuration for the API Gateway
     */
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly loggerService: LoggerService,
        private readonly configuration: any
    ) {
        this.loggerService.setContext('AuthMiddleware');
    }

    /**
     * Authenticates the request by verifying the JWT token and attaching user information to the request object.
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
                throw new HttpException('Invalid authorization header format', HttpStatus.UNAUTHORIZED);
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
                    const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
                    const errorStack = error instanceof Error ? (error as any).stack : 'No stack trace';
                    this.loggerService.error(`User not found: ${userId}`, errorStack);
                    throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);
                }

                // Attach user information to the request object
                req['user'] = {
                    id: userId,
                    email: decoded.email,
                };

                this.loggerService.log(`Authenticated user: ${userId}`);
                return next();
            } catch (error) {
                const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
                const errorStack = error instanceof Error ? (error as any).stack : 'No stack trace';
                this.loggerService.error(`Token verification failed: ${errorMessage}`, errorStack);
                throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error as any;
            } else {
                const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
                const errorStack = error instanceof Error ? (error as any).stack : 'No stack trace';
                this.loggerService.error(`Authentication error: ${errorMessage}`, errorStack);
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
            if (typeof this.configuration === 'function') {
                // If configuration is a function (registerAs result)
                const config = this.configuration();
                return config.auth.jwtSecret;
            } else if (this.configuration.apiGateway && this.configuration.apiGateway.auth) {
                // If configuration is already resolved with apiGateway namespace
                return this.configuration.apiGateway.auth.jwtSecret;
            } else if (this.configuration.auth) {
                // If auth is directly on the configuration object
                return this.configuration.auth.jwtSecret;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
            const errorStack = error instanceof Error ? (error as any).stack : 'No stack trace';
            this.loggerService.error(`Error getting JWT secret: ${errorMessage}`, errorStack);
        }

        // Fallback to environment variable — no hardcoded default allowed
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is required');
        }
        return jwtSecret;
    }
}
