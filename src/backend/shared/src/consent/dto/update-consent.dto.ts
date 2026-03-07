import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';

/**
 * Enum representing possible consent statuses.
 * Mirrors the Prisma ConsentStatus enum.
 */
export enum ConsentStatus {
    ACTIVE = 'ACTIVE',
    REVOKED = 'REVOKED',
    EXPIRED = 'EXPIRED',
}

/**
 * DTO for updating an existing consent record.
 * Primarily used for revoking consent (LGPD right to withdraw consent).
 */
export class UpdateConsentDto {
    @ApiPropertyOptional({
        enum: ConsentStatus,
        description: 'New status for the consent record',
        example: ConsentStatus.REVOKED,
    })
    @IsOptional()
    @IsEnum(ConsentStatus)
    status?: ConsentStatus;

    @ApiPropertyOptional({
        description: 'ISO 8601 date when consent was revoked',
        example: '2026-02-22T12:00:00.000Z',
    })
    @IsOptional()
    @IsDateString()
    revokedAt?: string;
}
