import { Global, Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditInterceptor } from './audit.interceptor';
import { LoggerModule } from '../logging/logger.module';
import { PrismaService } from '../database/prisma.service';

/**
 * Global module providing PHI audit logging capabilities.
 * Import once at the app root — AuditService will be available everywhere.
 */
@Global()
@Module({
  imports: [LoggerModule],
  providers: [PrismaService, AuditService, AuditInterceptor],
  exports: [AuditService, AuditInterceptor],
})
export class AuditModule {}
