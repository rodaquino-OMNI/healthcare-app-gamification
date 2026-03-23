import { IsString, IsNumber, IsOptional, IsDateString, IsBoolean } from 'class-validator';

/**
 * Data Transfer Object for updating an existing medication.
 * All fields are optional since updates may be partial.
 * Mirrors CreateMedicationDto field types for consistency
 * (dosage is a plain number, not a nested object).
 */
export class UpdateMedicationDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    dosage?: number;

    @IsOptional()
    @IsString()
    frequency?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsBoolean()
    reminderEnabled?: boolean;

    @IsOptional()
    @IsString()
    notes?: string;
}
