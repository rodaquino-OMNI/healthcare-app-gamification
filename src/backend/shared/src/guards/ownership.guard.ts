import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Reflector, ModuleRef } from '@nestjs/core';

export const OWNERSHIP_KEY = 'ownership_config';

export interface OwnershipConfig {
    /** The service class to use for looking up the resource */
    service: new (...args: unknown[]) => unknown;
    /** The method name on the service to fetch the resource by ID */
    method: string;
    /** Route param name containing the resource ID (default: 'id') */
    paramName?: string;
    /** Field on the resource containing the owner user ID (default: 'userId') */
    userField?: string;
}

/**
 * Decorator to configure OwnershipGuard on a controller method.
 */
export const CheckOwnership =
    (config: OwnershipConfig): MethodDecorator =>
    (target, propertyKey, descriptor) => {
        Reflect.defineMetadata(OWNERSHIP_KEY, config, descriptor.value!);
        return descriptor;
    };

/**
 * Guard that verifies the authenticated user owns the requested resource.
 * Uses ModuleRef to dynamically resolve the configured service at runtime.
 */
@Injectable()
export class OwnershipGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly moduleRef: ModuleRef
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const config = this.reflector.get<OwnershipConfig>(OWNERSHIP_KEY, context.getHandler());

        if (!config) {
            return true;
        }

        const request = context.switchToHttp().getRequest<{
            user?: { id?: string; sub?: string };
            params?: Record<string, string>;
        }>();
        const userId = request.user?.id || request.user?.sub;

        if (!userId) {
            throw new ForbiddenException('User not authenticated');
        }

        const paramName = config.paramName || 'id';
        const resourceId = request.params?.[paramName];

        if (!resourceId) {
            throw new NotFoundException('Resource ID not found in request params');
        }

        const service = this.moduleRef.get(config.service, {
            strict: false,
        });
        const method = (service as Record<string, (...args: unknown[]) => Promise<unknown>>)[
            config.method
        ];

        if (!method) {
            throw new Error(`Method ${config.method} not found on service`);
        }

        const resource = (await method.call(service, resourceId)) as Record<string, unknown> | null;

        if (!resource) {
            throw new NotFoundException('Resource not found');
        }

        const userField = config.userField || 'userId';
        const resourceUserId = resource[userField];

        if (resourceUserId !== userId) {
            throw new ForbiddenException('You do not own this resource');
        }

        return true;
    }
}
