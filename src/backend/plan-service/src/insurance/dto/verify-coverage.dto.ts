import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean } from 'class-validator';

/**
 * Enum representing the types of medical procedures
 */
export enum ProcedureType {
    CONSULTATION = 'consultation',
    EXAM = 'exam',
    SURGERY = 'surgery',
    THERAPY = 'therapy',
    MEDICATION = 'medication',
    PREVENTIVE = 'preventive',
    EMERGENCY = 'emergency',
}

/**
 * Data transfer object for the verify coverage endpoint
 */
export class VerifyCoverageDto {
    /**
     * The procedure code to check coverage for
     * This can be a standardized code like CPT, CBHPM, or TUSS
     */
    @ApiProperty({
        description: 'Procedure code (CPT, CBHPM, or TUSS)',
        example: '10060',
    })
    @IsString()
    @IsNotEmpty()
    procedureCode!: string;

    /**
     * The type of medical procedure
     */
    @ApiProperty({
        description: 'Type of medical procedure',
        enum: ProcedureType,
        example: ProcedureType.CONSULTATION,
    })
    @IsEnum(ProcedureType)
    @IsNotEmpty()
    procedureType!: ProcedureType;

    /**
     * The plan ID to check coverage against
     */
    @ApiProperty({
        description: 'Plan ID to check coverage against',
        example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
    })
    @IsString()
    @IsNotEmpty()
    planId!: string;

    /**
     * Additional description of the procedure
     */
    @ApiProperty({
        description: 'Additional procedure description',
        example: 'General practitioner consultation',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    /**
     * The healthcare provider ID
     */
    @ApiProperty({
        description: 'Healthcare provider ID',
        example: 'b5c6d7e8-f9g0-h1i2-j3k4-l5m6n7o8p9q0',
        required: false,
    })
    @IsString()
    @IsOptional()
    providerId?: string;

    /**
     * Whether the provider is in-network
     */
    @ApiProperty({
        description: 'Whether the provider is in-network',
        example: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isInNetwork?: boolean;
}
