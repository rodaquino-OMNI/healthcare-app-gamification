import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsUrl, IsArray } from 'class-validator';
import { ClaimStatus } from '../entities/claim.entity';

/**
 * Data Transfer Object for updating claims
 */
export class UpdateClaimDto {
  /**
   * Updated status of the claim
   * @example "approved"
   */
  @ApiProperty({
    description: 'Updated status of the claim',
    enum: ClaimStatus,
    required: false,
  })
  @IsEnum(ClaimStatus)
  @IsOptional()
  status?: ClaimStatus;

  /**
   * Note about the status change
   * @example "Claim approved based on policy coverage"
   */
  @ApiProperty({
    description: 'Note about the status change',
    required: false,
  })
  @IsString()
  @IsOptional()
  statusNote?: string;

  /**
   * Updated procedure code
   * @example "99214"
   */
  @ApiProperty({
    description: 'Updated procedure code',
    required: false,
  })
  @IsString()
  @IsOptional()
  procedureCode?: string;

  /**
   * Updated diagnosis code
   * @example "J11.2"
   */
  @ApiProperty({
    description: 'Updated diagnosis code',
    required: false,
  })
  @IsString()
  @IsOptional()
  diagnosisCode?: string;

  /**
   * Updated service date
   * @example "2023-05-16"
   */
  @ApiProperty({
    description: 'Updated service date',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  serviceDate?: string;

  /**
   * Updated provider name
   * @example "Dr. John Smith"
   */
  @ApiProperty({
    description: 'Updated provider name',
    required: false,
  })
  @IsString()
  @IsOptional()
  providerName?: string;

  /**
   * Updated notes
   * @example "Updated information based on supporting documentation"
   */
  @ApiProperty({
    description: 'Updated notes',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  /**
   * Updated receipt URL
   * @example "https://storage.example.com/receipts/updated-receipt123.pdf"
   */
  @ApiProperty({
    description: 'Updated receipt URL',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  receiptUrl?: string;

  /**
   * Updated additional document URLs
   * @example ["https://storage.example.com/docs/updated-doc1.pdf"]
   */
  @ApiProperty({
    description: 'Updated additional document URLs',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  additionalDocumentUrls?: string[];
}