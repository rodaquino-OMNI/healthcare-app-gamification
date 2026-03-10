import { ApiProperty } from '@nestjs/swagger';
import {
    IsNumber, // class-validator@0.14.1
    IsString, // class-validator@0.14.1
    IsOptional, // class-validator@0.14.1
    IsEnum,
    IsDateString,
    IsArray,
    IsUrl,
} from 'class-validator';

import { ClaimStatus } from '../entities/claim.entity';

/**
 * Data Transfer Object for creating new claims
 */
export class CreateClaimDto {
    /**
     * User ID submitting the claim
     * @example "550e8400-e29b-41d4-a716-446655440000"
     */
    @ApiProperty({ description: 'User ID submitting the claim' })
    @IsString()
    userId!: string;

    /**
     * Plan ID the claim is associated with
     * @example "44f8a113-3f76-4833-93e4-f1bcf9b179cf"
     */
    @ApiProperty({ description: 'Plan ID the claim is associated with' })
    @IsString()
    planId!: string;

    /**
     * Type of claim (e.g., medical_visit, procedure, medication)
     * @example "medical_visit"
     */
    @ApiProperty({ description: 'Type of claim' })
    @IsString()
    type!: string;

    /**
     * Amount being claimed in local currency
     * @example 150.50
     */
    @ApiProperty({ description: 'Amount being claimed' })
    @IsNumber()
    amount!: number;

    /**
     * Initial status of the claim (default: submitted)
     * @example "submitted"
     */
    @ApiProperty({
        description: 'Initial status of the claim',
        enum: ClaimStatus,
        default: ClaimStatus.SUBMITTED,
        required: false,
    })
    @IsEnum(ClaimStatus)
    @IsOptional()
    status?: ClaimStatus;

    /**
     * Procedure code for medical claims
     * @example "99213"
     */
    @ApiProperty({
        description: 'Procedure code for medical claims',
        required: false,
    })
    @IsString()
    @IsOptional()
    procedureCode?: string;

    /**
     * Diagnosis code (ICD-10) for medical claims
     * @example "J11.1"
     */
    @ApiProperty({
        description: 'Diagnosis code (ICD-10) for medical claims',
        required: false,
    })
    @IsString()
    @IsOptional()
    diagnosisCode?: string;

    /**
     * Healthcare provider name
     * @example "Dr. Jane Smith"
     */
    @ApiProperty({
        description: 'Healthcare provider name',
        required: false,
    })
    @IsString()
    @IsOptional()
    providerName?: string;

    /**
     * Date of service in ISO format
     * @example "2023-05-15"
     */
    @ApiProperty({
        description: 'Date of service in ISO format',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    serviceDate?: string;

    /**
     * Additional notes about the claim
     * @example "Routine medical check-up with lab work"
     */
    @ApiProperty({
        description: 'Additional notes about the claim',
        required: false,
    })
    @IsString()
    @IsOptional()
    notes?: string;

    /**
     * URL to receipt/invoice document
     * @example "https://storage.example.com/receipts/receipt123.pdf"
     */
    @ApiProperty({
        description: 'URL to receipt/invoice document',
        required: false,
    })
    @IsUrl()
    @IsOptional()
    receiptUrl?: string;

    /**
     * URLs to additional supporting documents
     * @example ["https://storage.example.com/docs/doc1.pdf", "https://storage.example.com/docs/doc2.pdf"]
     */
    @ApiProperty({
        description: 'URLs to additional supporting documents',
        required: false,
        type: [String],
    })
    @IsArray()
    @IsOptional()
    additionalDocumentUrls?: string[];
}
