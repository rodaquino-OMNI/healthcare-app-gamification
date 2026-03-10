import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface AuthenticatedRequest {
    user: Record<string, unknown>;
}

/**
 * Decorator that extracts the current user from the request object
 * @param propertyPath Optional path to a property within the user object
 */
export const CurrentUser = createParamDecorator((data: string, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    // If no property path is provided or user doesn't exist, return the whole user object
    if (!data || !user) {
        return user;
    }

    // Return the specific user property if it exists
    return user[data];
});
