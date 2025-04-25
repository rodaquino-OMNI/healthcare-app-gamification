import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppException } from 'src/backend/shared/src/exceptions/exceptions.types';

/**
 * JWT Authentication Guard for protecting routes that require authentication.
 * 
 * This guard validates JWT tokens in incoming requests before allowing
 * access to protected resources. It extends the Passport AuthGuard
 * and is used across all journeys in the AUSTA SuperApp.
 * 
 * @example
 * // Use in a controller to protect a route
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile(@Request() req) {
 *   return req.user;
 * }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Determines if the current request is allowed to proceed based on JWT authentication.
   * Intercepts authentication errors and transforms them into standardized responses.
   * 
   * @param context - The execution context of the current request
   * @returns A boolean indicating if the request is authenticated
   * @throws HttpException if authentication fails
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Attempt to authenticate the request using the jwt strategy
      return await super.canActivate(context) as boolean;
    } catch (error) {
      // Transform AppException errors to HTTP exceptions with proper formatting
      if (error instanceof AppException) {
        throw error.toHttpException();
      }
      // For other errors, maintain the original exception
      throw error;
    }
  }

  /**
   * Handles the result of the authentication process.
   * This method is called after Passport has validated the JWT token.
   * 
   * @param err - Any error that occurred during authentication
   * @param user - The authenticated user if successful
   * @param info - Additional info about the authentication process
   * @returns The authenticated user if successful
   * @throws UnauthorizedException if authentication fails
   */
  handleRequest(err: Error, user: any, info: any): any {
    // If authentication failed or no user was found, throw an UnauthorizedException
    if (err || !user) {
      throw new UnauthorizedException('Invalid token or user not found');
    }
    
    // Return the authenticated user
    return user;
  }
}

export { JwtAuthGuard };