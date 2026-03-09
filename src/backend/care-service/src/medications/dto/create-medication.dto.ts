import { IsString, IsNumber, IsOptional, IsDateString, IsBoolean } from 'class-validator'; // version 0.14.1

/**
 * Data Transfer Object for creating a new medication.
 * This DTO defines the structure and validation for medication data
 * to ensure consistency and integrity when creating medication records.
 */
export class CreateMedicationDto {
    /**
     * Name of the medication
     * @example "Amoxicillin"
     */
    @IsString()
    name!: string;

    /**
     * Dosage amount in appropriate units (e.g., mg, ml)
     * @example 500
     */
    @IsNumber()
    dosage!: number;

    /**
     * How often the medication should be taken
     * @example "Twice daily" or "Every 8 hours"
     */
    @IsString()
    frequency!: string;

    /**
     * Date when the medication regimen starts
     * @example "2023-04-15"
     */
    @IsDateString()
    startDate!: string;

    /**
     * Optional date when the medication regimen ends
     * @example "2023-04-30"
     */
    @IsOptional()
    @IsDateString()
    endDate!: string;

    /**
     * Whether reminders should be enabled for this medication
     * @example true
     */
    @IsBoolean()
    reminderEnabled!: boolean;

    /**
     * Optional additional notes about the medication
     * @example "Take with food to reduce stomach upset"
     */
    @IsOptional()
    @IsString()
    notes!: string;
}
