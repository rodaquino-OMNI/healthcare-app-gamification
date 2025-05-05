import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';

/**
 * Parameter decorator that extracts the authenticated user from the request object.
 * This decorator is designed to be used in controller methods where the user
 * information is required.
 * 
 * @throws AppException if no user is found in the request
 * 
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // Check if user exists in request (set by JwtAuthGuard)
    if (!request.user) {
      throw new AppException(
        'User not authenticated',
        ErrorType.VALIDATION,
        'AUTH_001',
        {}
      );
    }
    
    return request.user;
  },
);