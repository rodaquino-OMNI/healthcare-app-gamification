import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Interface for role objects with a name property
 */
interface Role {
    name: string;
    [key: string]: any;
}

/**
 * Guard that checks if the current user has the required roles to access a route.
 * Works in conjunction with the @Roles decorator to enforce role-based access control.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    /**
     * Determines if the current request is authorized based on the user's roles.
     *
     * @param context - The execution context of the current request
     * @returns A boolean indicating if the request is authorized
     * @throws AppException if authorization fails
     */
    canActivate(context: ExecutionContext): boolean {
        // Get required roles from the route handler metadata
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

        // If no roles are required, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        // Get the request object
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Ensure user exists
        if (!user) {
            throw new AppException('Authentication required', ErrorType.VALIDATION, 'AUTH_003', { requiredRoles });
        }

        // Check if user has any of the required roles
        const hasRole = this.matchRoles(requiredRoles, user.roles);
        if (!hasRole) {
            throw new AppException('Insufficient permissions', ErrorType.VALIDATION, 'AUTH_004', {
                requiredRoles,
                userRoles: user.roles?.map((role: Role) => role.name) || [],
            });
        }

        return true;
    }

    /**
     * Checks if the user has any of the required roles.
     *
     * @param requiredRoles - The roles required to access the route
     * @param userRoles - The roles that the user has
     * @returns A boolean indicating if the user has any of the required roles
     */
    private matchRoles(requiredRoles: string[], userRoles: Role[]): boolean {
        if (!userRoles) {
            return false;
        }

        return requiredRoles.some((requiredRole) => userRoles.some((userRole) => userRole.name === requiredRole));
    }
}
