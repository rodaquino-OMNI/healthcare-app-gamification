/* eslint-disable */
/**
 * Type declarations for shared modules
 */

// Path alias declarations for imports
declare module 'src/backend/shared/src/dto/filter.dto' {
    export class FilterDto {
        where?: Record<string, unknown>;
        orderBy?: Record<string, 'asc' | 'desc'>;
        include?: Record<string, boolean>;
    }
}

declare module 'src/backend/shared/src/dto/pagination.dto' {
    export class PaginationDto {
        page?: number;
        limit?: number;
        skip?: number;
    }
}

declare module 'src/backend/shared/src/interfaces/repository.interface' {
    export interface Repository<T = unknown> {
        findAll(): Promise<T[]>;
        findOne(id: string): Promise<T>;
        create(data: unknown): Promise<T>;
        update(id: string, data: unknown): Promise<T>;
        remove(id: string): Promise<boolean>;
    }
}

declare module 'src/backend/shared/src/interfaces/service.interface' {
    export interface Service<T = unknown, F = unknown, P = unknown> {
        findAll(filter?: F, pagination?: P): Promise<{ data: T[]; total: number; page: number; limit: number }>;
        findOne(id: string): Promise<T>;
        create(data: unknown): Promise<T>;
        update(id: string, data: unknown): Promise<T>;
        remove(id: string): Promise<boolean>;
    }
}

declare module 'src/backend/shared/src/exceptions/exceptions.types' {
    export class AppException extends Error {
        constructor(message: string, code: string, details?: Record<string, unknown>);
    }

    export enum ErrorType {
        VALIDATION = 'VALIDATION',
        BUSINESS = 'BUSINESS',
        TECHNICAL = 'TECHNICAL',
        EXTERNAL = 'EXTERNAL',
        NOT_FOUND = 'NOT_FOUND',
        UNAUTHORIZED = 'UNAUTHORIZED',
        FORBIDDEN = 'FORBIDDEN',
    }
}

declare module 'src/backend/shared/src/constants/error-codes.constants' {
    export const SYS_INTERNAL_SERVER_ERROR: string;
    export const NOTIFICATION_NOT_FOUND: string;
    export const NOTIFICATION_VALIDATION_ERROR: string;
    export const NOTIFICATION_TECHNICAL_ERROR: string;
    export const TEMPLATE_NOT_FOUND: string;
    export const PREFERENCE_NOT_FOUND: string;
}

declare module 'src/backend/shared/src/constants/journey.constants' {
    export const JOURNEY_IDS: {
        HEALTH: string;
        CARE: string;
        PLAN: string;
    };
}

declare module 'src/backend/auth-service/src/auth/decorators/current-user.decorator' {
    export function CurrentUser(): ParameterDecorator;
}

declare module 'src/backend/auth-service/src/auth/guards/jwt-auth.guard' {
    import { CanActivate } from '@nestjs/common';
    export class JwtAuthGuard implements CanActivate {
        canActivate(context: unknown): boolean | Promise<boolean>;
    }
}
