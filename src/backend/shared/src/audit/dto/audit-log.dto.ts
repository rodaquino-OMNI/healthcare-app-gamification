import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

/**
 * Supported audit actions for PHI access logging
 * Aligned with HIPAA/LGPD compliance requirements
 */
export enum AuditAction {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
}

/**
 * DTO for creating an audit log entry
 */
export class CreateAuditLogDto {
  @IsString()
  userId!: string;

  @IsEnum(AuditAction)
  action!: AuditAction;

  @IsString()
  resourceType!: string;

  @IsOptional()
  @IsString()
  resourceId?: string;

  @IsOptional()
  @IsString()
  journeyId?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

/**
 * Interface for audit log entries used internally by AuditService
 */
export interface AuditLogEntry {
  userId: string;
  action: AuditAction | string;
  resourceType: string;
  resourceId?: string;
  journeyId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}
