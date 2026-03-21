import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

/**
 * Implementation of Passport's local strategy for username/password authentication.
 * This is used by the LocalAuthGuard to authenticate users during login.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private logger: LoggerService
    ) {
        super({
            usernameField: 'email', // Use email as the username field
            passwordField: 'password',
        });
    }

    /**
     * Validates a user's credentials and returns the user if valid.
     * This is called by Passport during authentication.
     *
     * @param email - User's email address
     * @param password - User's password
     * @returns The authenticated user
     * @throws AppException if authentication fails
     */
    async validate(email: string, password: string): Promise<unknown> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- login() returns any due to dynamic Prisma user shape
            const user: unknown = await this.authService.login(email, password);
            if (!user) {
                this.logger.debug(`Authentication failed for user: ${email}`, 'LocalStrategy');
                throw new AppException(
                    'Invalid email or password',
                    ErrorType.VALIDATION,
                    'AUTH_005',
                    {}
                );
            }
            return user;
        } catch (error: unknown) {
            const err = error as { message?: string; stack?: string };
            const errorMsg = err.message || 'Unknown authentication error';
            const errorStack = err.stack || '';
            this.logger.error(
                `Authentication failed for user ${email}: ${errorMsg}`,
                errorStack,
                'LocalStrategy'
            );

            throw new AppException(
                'Authentication failed',
                ErrorType.VALIDATION,
                'AUTH_005',
                {},
                error instanceof Error ? undefined : undefined
            );
        }
    }
}
