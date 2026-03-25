import { CustomDecorator, SetMetadata } from '@nestjs/common'; // v10.0.0+

/**
 * Metadata key used to store roles information for route handlers.
 * This is used by the RolesGuard to determine if a user has permission to access a route.
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator that assigns roles to a route. Works in conjunction with the RolesGuard
 * to enforce role-based access control.
 *
 * @param roles - The roles required to access the route
 * @returns A decorator that sets metadata on the route handler
 *
 * @example
 * @Roles('admin')
 * @Get('protected')
 * getProtectedResource() {
 *   return 'This resource is protected';
 * }
 */
export const Roles = (...roles: string[]): CustomDecorator<string> => SetMetadata(ROLES_KEY, roles);
