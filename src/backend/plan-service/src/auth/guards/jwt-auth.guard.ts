import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that verifies JWT tokens for authenticated routes
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    /**
     * Handles the token validation process
     * @param context Execution context containing the request
     * @returns Whether the request is authorized
     */
    canActivate(context: ExecutionContext) {
        // For local development or testing you can bypass token validation
        // if using an environment flag like process.env.BYPASS_AUTH === 'true'

        return super.canActivate(context);
    }

    /**
     * Custom error handling for authentication failures
     * @param error Error thrown during authentication
     */
    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new UnauthorizedException('Authentication failed');
        }
        return user;
    }
}
