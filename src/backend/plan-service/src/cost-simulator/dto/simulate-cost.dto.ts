import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, IsUUID } from 'class-validator'; // ^0.14.0
import { ApiProperty } from '@nestjs/swagger'; // ^6.0.0

/**
 * Enum defining the types of medical procedures for cost simulation
 */
export enum ProcedureType {
  CONSULTATION = 'CONSULTATION',
  DIAGNOSTIC = 'DIAGNOSTIC',
  LABORATORY = 'LABORATORY',
  IMAGING = 'IMAGING',
  SURGERY = 'SURGERY',
  THERAPY = 'THERAPY',
  MEDICATION = 'MEDICATION',
  OTHER = 'OTHER'
}

/**
 * Data transfer object for cost simulation requests in the Plan journey
 * Provides all necessary parameters to calculate estimated costs
 * for medical procedures based on a user's insurance coverage
 */
export class SimulateCostDto {
  @ApiProperty({
    description: 'Procedure code (can be CPT, TUSS or other standard code)',
    example: '10060',
    required: true
  })
  @IsString()
  procedureCode: string;

  @ApiProperty({
    description: 'Type of medical procedure',
    enum: ProcedureType,
    example: ProcedureType.CONSULTATION,
    required: true
  })
  @IsEnum(ProcedureType)
  procedureType: ProcedureType;

  @ApiProperty({
    description: 'Estimated full cost of the procedure without insurance coverage',
    example: 350.00,
    required: true
  })
  @IsNumber()
  estimatedFullCost: number;

  @ApiProperty({
    description: 'ID of the healthcare provider performing the procedure',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    required: false
  })
  @IsUUID()
  @IsOptional()
  providerId?: string;

  @ApiProperty({
    description: 'Indicates if the provider is in-network for the insurance plan',
    example: true,
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isInNetwork?: boolean;

  @ApiProperty({
    description: 'ID of the insurance plan to use for cost calculation',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    required: true
  })
  @IsUUID()
  planId: string;
}