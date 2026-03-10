import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuditService } from './audit.service';
import { AuditAction } from './dto/audit-log.dto';
import { PHI_ACCESS_KEY, PhiAccessMetadata } from './phi-access.decorator';

/**
 * Maps HTTP methods to audit actions.
 */
const HTTP_METHOD_ACTION_MAP: Record<string, AuditAction> = {
    GET: AuditAction.READ,
    POST: AuditAction.WRITE,
    PUT: AuditAction.WRITE,
    PATCH: AuditAction.WRITE,
    DELETE: AuditAction.DELETE,
};

/**
 * Interceptor that automatically logs controller actions for audit trail.
 * Extracts user identity from the JWT-authenticated request, determines the
 * action from the HTTP method, and derives the resource type from the controller class name.
 *
 * Logging happens after the response is sent so it never delays the response.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(
        private readonly auditService: AuditService,
        private readonly reflector: Reflector
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest<Request & { user?: { id?: string; sub?: string } }>();
        const controllerName = context.getClass().name;
        const handlerName = context.getHandler().name;

        const userId: string | undefined = request.user?.id ?? request.user?.sub;
        const method: string = request.method;
        const action = HTTP_METHOD_ACTION_MAP[method] ?? AuditAction.READ;
        const resourceType = controllerName.replace(/Controller$/, '');
        const resourceId: string | undefined = (request.params as Record<string, string>)?.['id'];
        const ipAddress: string | undefined =
            request.ip ?? (request.headers?.['x-forwarded-for'] as string | undefined);
        const userAgent: string | undefined = request.headers?.['user-agent'];

        return next.handle().pipe(
            tap(() => {
                if (!userId) {
                    return;
                }

                const response = httpContext.getResponse<Response>();

                this.auditService.log({
                    userId,
                    action,
                    resourceType,
                    resourceId,
                    ipAddress,
                    userAgent,
                    metadata: {
                        handler: handlerName,
                        path: request.url,
                        statusCode: response.statusCode,
                    },
                });

                // PHI-specific audit logging (LGPD compliance)
                const phiMeta = this.reflector.get<PhiAccessMetadata>(PHI_ACCESS_KEY, context.getHandler());
                if (phiMeta) {
                    this.auditService.logPHIAccess(userId, phiMeta.resourceType, resourceId ?? request.url, action, {
                        method,
                        path: request.url,
                        handler: handlerName,
                        ipAddress,
                        userAgent,
                    });
                }
            })
        );
    }
}
