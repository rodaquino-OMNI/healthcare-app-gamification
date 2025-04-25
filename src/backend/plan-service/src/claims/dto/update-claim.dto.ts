import { IsOptional, IsString, IsNumber, IsDateString, IsEnum } from 'class-validator'; // class-validator v0.14.1

/**
 * Data Transfer Object for updating claim information.
 * This class defines the structure for providing updated claim data
 * when modifying an existing claim.
 */
export class UpdateClaimDto {
  /**
   * Type of claim (e.g., medical, dental, vision)
   */
  @IsOptional()
  @IsString()
  type?: string;

  /**
   * Amount claimed in the local currency
   */
  @IsOptional()
  @IsNumber()
  amount?: number;

  /**
   * Current status of the claim
   * Common values include: SUBMITTED, UNDER_REVIEW, ADDITIONAL_INFO_REQUIRED, 
   * APPROVED, DENIED, APPEALED, COMPLETED
   */
  @IsOptional()
  @IsString()
  status?: string;

  /**
   * Procedure code related to the claim
   * Typically follows a standardized coding system
   */
  @IsOptional()
  @IsString()
  procedureCode?: string;

  /**
   * Diagnosis code related to the claim
   * Typically follows ICD-10 or similar coding standards
   */
  @IsOptional()
  @IsString()
  diagnosisCode?: string;

  /**
   * Name of the healthcare provider who performed the procedure
   */
  @IsOptional()
  @IsString()
  providerName?: string;

  /**
   * Additional notes about the claim
   * May include special circumstances or explanations
   */
  @IsOptional()
  @IsString()
  notes?: string;
}