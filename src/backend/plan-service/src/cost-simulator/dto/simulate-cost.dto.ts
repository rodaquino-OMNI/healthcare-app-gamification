import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, Min, Matches, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  EMERGENCY = 'emergency'
}

/**
 * Enum representing coding standards used for procedures
 */
export enum CodingStandard {
  CPT = 'CPT',
  TUSS = 'TUSS',
  CBHPM = 'CBHPM'
}

/**
 * Data transfer object for the simulate cost endpoint
 */
export class SimulateCostDto {
  /**
   * The procedure code to simulate cost for
   * This can be a standardized code like CPT, CBHPM, or TUSS
   */
  @ApiProperty({
    description: 'Procedure code (CPT, CBHPM, or TUSS)',
    example: '10060'
  })
  @IsString()
  @IsNotEmpty()
  procedureCode!: string;

  /**
   * The coding standard used for the procedure code
   */
  @ApiProperty({
    description: 'Coding standard used for procedure',
    enum: CodingStandard,
    example: CodingStandard.CPT,
    required: false
  })
  @IsEnum(CodingStandard)
  @IsOptional()
  codingStandard?: CodingStandard;

  /**
   * The type of medical procedure
   */
  @ApiProperty({
    description: 'Type of medical procedure',
    enum: ProcedureType,
    example: ProcedureType.CONSULTATION
  })
  @IsEnum(ProcedureType)
  @IsNotEmpty()
  procedureType!: ProcedureType;

  /**
   * The estimated full cost of the procedure
   */
  @ApiProperty({
    description: 'Estimated full cost of the procedure',
    example: 250.00
  })
  @IsNumber()
  @Min(0)
  estimatedFullCost!: number;

  /**
   * Additional description of the procedure
   */
  @ApiProperty({
    description: 'Additional procedure description',
    example: 'General practitioner consultation',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * The healthcare provider ID for the simulation
   */
  @ApiProperty({
    description: 'Healthcare provider ID',
    example: 'b5c6d7e8-f9g0-h1i2-j3k4-l5m6n7o8p9q0',
    required: false
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, {
    message: 'Provider ID must be a valid UUID'
  })
  providerId?: string;

  /**
   * Network type for cost calculation (in-network vs out-of-network)
   */
  @ApiProperty({
    description: 'Network type (in-network or out-of-network)',
    enum: ['in-network', 'out-of-network'],
    default: 'in-network',
    required: false
  })
  @IsString()
  @IsOptional()
  @IsEnum(['in-network', 'out-of-network'])
  networkType?: 'in-network' | 'out-of-network' = 'in-network';

  /**
   * The plan ID to check coverage against
   */
  @ApiProperty({
    description: 'Plan ID to check coverage against',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, {
    message: 'Plan ID must be a valid UUID'
  })
  planId!: string;

  /**
   * Optional facility ID if the procedure is performed at a specific facility
   */
  @ApiProperty({
    description: 'Facility ID where procedure will be performed',
    example: 'c7d8e9f0-g1h2-i3j4-k5l6-m7n8o9p0q1r2',
    required: false
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, {
    message: 'Facility ID must be a valid UUID'
  })
  facilityId?: string;

  /**
   * Flag to indicate if this is a recurring procedure
   */
  @ApiProperty({
    description: 'Is this a recurring procedure?',
    example: false,
    required: false
  })
  @IsOptional()
  isRecurring?: boolean;

  /**
   * Number of occurrences for recurring procedures
   */
  @ApiProperty({
    description: 'Number of occurrences for recurring procedures',
    example: 6,
    required: false
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf(o => o.isRecurring === true)
  @Min(1)
  occurrences?: number;
}