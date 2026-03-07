import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        // If no roles are specified, allow access
        if (!roles || roles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // For development or testing, you might want to bypass role checks
        // if using an environment flag like process.env.BYPASS_ROLES === 'true'

        // Make sure user exists and has roles
        if (!user || !user.roles) {
            return false;
        }

        // Check if user has any of the required roles
        return roles.some((role) => user.roles.includes(role));
    }
}
