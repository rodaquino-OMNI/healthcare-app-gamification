import { Module } from '@nestjs/common'; // ^9.0.0
import { PermissionsService } from './permissions.service';
import { PrismaService } from '@app/shared/database/prisma.service';

/**
 * Module that provides the PermissionsService for managing permissions in the auth service.
 * This module enables fine-grained access control for the three user journeys: Health, Care, and Plan.
 * 
 * The permissions system is built around a hierarchical format (journey:resource:action)
 * and supports the role-based access control (RBAC) system with journey-specific permissions.
 * 
 * Examples of permissions:
 * - health:metrics:read - View health metrics
 * - care:appointment:create - Schedule appointments
 * - plan:claim:submit - Submit insurance claims
 */
@Module({
  providers: [PermissionsService, PrismaService],
  exports: [PermissionsService],
})
export class PermissionsModule {}