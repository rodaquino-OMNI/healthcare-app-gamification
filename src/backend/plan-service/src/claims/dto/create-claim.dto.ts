import { 
  IsNotEmpty, // class-validator@0.14.1
  IsNumber, // class-validator@0.14.1
  IsString, // class-validator@0.14.1
  IsUUID, // class-validator@0.14.1
  IsOptional, // class-validator@0.14.1
  Min // class-validator@0.14.1
} from 'class-validator';

/**
 * Represents the data structure for creating a new claim.
 * Used to validate claim submission requests from the Plan Journey.
 */
export class CreateClaimDto {
  /**
   * The ID of the insurance plan associated with the claim.
   */
  @IsUUID()
  @IsNotEmpty()
  planId: string;

  /**
   * The type of claim being submitted.
   * Examples: 'MEDICAL_VISIT', 'PROCEDURE', 'EXAM', 'THERAPY'
   */
  @IsString()
  @IsNotEmpty()
  type: string;

  /**
   * The amount of the claim.
   * Must be greater than 0.01
   */
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  /**
   * The code associated with the medical procedure.
   * Optional field for procedure-specific identification.
   */
  @IsString()
  @IsOptional()
  procedureCode: string;

  /**
   * An array of document IDs associated with the claim.
   * These reference documents like receipts, prescriptions, or reports
   * that have been previously uploaded to the system.
   */
  @IsUUID('all', { each: true })
  @IsOptional()
  documentIds: string[];
}