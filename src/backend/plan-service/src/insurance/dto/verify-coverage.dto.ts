import { IsString, IsEnum, IsOptional, IsUUID, IsBoolean } from 'class-validator'; // version ^0.14.0
import { ApiProperty } from '@nestjs/swagger'; // version ^6.0.0

/**
 * Enum defining the types of medical procedures for coverage verification
 */
export enum ProcedureType {
  CONSULTATION = 'CONSULTATION',
  DIAGNOSTIC = 'DIAGNOSTIC',
  LABORATORY = 'LABORATORY',
  IMAGING = 'IMAGING',
  SURGERY = 'SURGERY',
  THERAPY = 'THERAPY',
  MEDICATION = 'MEDICATION',
  OTHER = 'OTHER',
}

/**
 * Data transfer object for insurance coverage verification requests
 * Used in the My Plan & Benefits journey to verify if a procedure is covered
 * and calculate estimated costs based on the user's insurance plan
 */
export class VerifyCoverageDto {
  @ApiProperty({
    description: 'The code for the medical procedure',
    example: 'PROC-12345',
    required: true,
  })
  @IsString()
  procedureCode: string;

  @ApiProperty({
    description: 'The type of medical procedure',
    enum: ProcedureType,
    example: ProcedureType.CONSULTATION,
    required: true,
  })
  @IsEnum(ProcedureType)
  procedureType: ProcedureType;

  @ApiProperty({
    description: 'The ID of the insurance plan',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID(4)
  planId: string;

  @ApiProperty({
    description: 'The ID of the healthcare provider (optional)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsUUID(4)
  @IsOptional()
  providerId?: string;

  @ApiProperty({
    description: 'Whether the provider is in-network (affects coverage amounts)',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isInNetwork?: boolean;
}