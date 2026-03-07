import { SetMetadata } from '@nestjs/common';

/**
 * Decorator that defines the roles required for a route
 * @param roles String array of role names
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
