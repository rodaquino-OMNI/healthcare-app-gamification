import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../database/prisma.service';
import { LoggerService } from '../logging/logger.service';
import { AuditAction, AuditLogEntry } from './dto/audit-log.dto';

/**
 * Service for PHI access audit logging.
 * Provides HIPAA/LGPD-compliant audit trail for all protected health information access.
 *
 * All logging is fire-and-forget to avoid blocking request processing.
 * Failures are logged but never propagated to the caller.
 */
@Injectable()
export class AuditService {
    private readonly logger: LoggerService;

    constructor(
        private readonly prisma: PrismaService,
        loggerService: LoggerService
    ) {
        this.logger = loggerService.createLogger('AuditService');
    }

    /**
     * Log an audit entry (fire-and-forget).
     * Never throws — errors are captured and logged internally.
     *
     * @param entry - The audit log entry to persist
     */
    log(entry: AuditLogEntry): void {
        void Promise.resolve().then(async () => {
            try {
                await this.prisma.auditLog.create({
                    data: {
                        userId: entry.userId,
                        action: entry.action,
                        resourceType: entry.resourceType,
                        resourceId: entry.resourceId ?? null,
                        journeyId: entry.journeyId ?? null,
                        ipAddress: entry.ipAddress ?? null,
                        userAgent: entry.userAgent ?? null,
                        metadata: entry.metadata
                            ? (entry.metadata as Prisma.InputJsonValue)
                            : Prisma.JsonNull,
                    },
                });
            } catch (error) {
                this.logger.error(
                    `Failed to write audit log: ${error instanceof Error ? error.message : String(error)}`,
                    error instanceof Error ? error.stack : undefined
                );
            }
        });
    }

    /**
     * Convenience method for logging PHI access events.
     *
     * @param userId - The user accessing the resource
     * @param resourceType - Type of resource being accessed (e.g., "Patient", "HealthMetric")
     * @param resourceId - Identifier of the specific resource
     * @param action - The action performed
     * @param metadata - Optional additional context
     */
    logPHIAccess(
        userId: string,
        resourceType: string,
        resourceId: string,
        action: AuditAction | string,
        metadata?: Record<string, unknown>
    ): void {
        this.log({
            userId,
            action,
            resourceType,
            resourceId,
            metadata: {
                ...metadata,
                phiAccess: true,
            },
        });
    }
}
