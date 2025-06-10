import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { ErrorType } from '@app/shared/exceptions/error.types'; // Import directly from error.types
import { LoggerService } from '@app/shared/logging/logger.service';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Guard that uses JWT authentication.
 * This guard is used to protect routes that require authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private logger: LoggerService) {
    super();
  }

  /**
   * Handle JWT authentication and errors
   * @param err Error object if authentication fails
   * @param user User object if authentication succeeds
   * @param info Additional info from Passport
   * @returns The authenticated user
   */
  handleRequest(err: any, user: any, info: any, context: ExecutionContext): any {
    // If there was an error or no user was found, throw an exception
    if (err || !user) {
      const request = this.getRequest(context);
      const errorMessage = err?.message || 'Unauthorized access';
      const errorDetails = {
        url: request.url,
        method: request.method,
        info: info?.message
      };
      
      this.logger.warn(`Authentication failed: ${errorMessage}`, 'JwtAuthGuard');
      
      throw new AppException(
        'Authentication required',
        ErrorType.UNAUTHORIZED, // Use UNAUTHORIZED instead of VALIDATION
        'AUTH_006',
        errorDetails
      );
    }
    
    // Otherwise return the authenticated user
    return user;
  }
}