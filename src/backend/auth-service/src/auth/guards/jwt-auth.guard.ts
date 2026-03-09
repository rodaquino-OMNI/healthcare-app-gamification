/* eslint-disable */
import { ErrorType } from '@app/shared/exceptions/error.types'; // Import directly from error.types
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that uses JWT authentication.
 * This guard is used to protect routes that require authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector,
        private logger: LoggerService
    ) {
        super();
    }

    /**
     * Handle JWT authentication and errors
     * @param err Error object if authentication fails
     * @param user User object if authentication succeeds
     * @param info Additional info from Passport
     * @returns The authenticated user
     */
    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        // If there was an error or no user was found, throw an exception
        if (err || !user) {
            const request = this.getRequest(context) as { url: string; method: string };
            const errObj = err as { message?: string } | null;
            const errorMessage = errObj?.message || 'Unauthorized access';
            const errorDetails = {
                url: request.url,
                method: request.method,
                info: info?.message,
                detail: 'Authentication required',
            };

            this.logger.warn(`Authentication failed: ${errorMessage}`, 'JwtAuthGuard');

            throw new AppException('Authentication required', ErrorType.UNAUTHORIZED, 'AUTH_006', errorDetails);
        }

        // Otherwise return the authenticated user
        return user as TUser;
    }
}
