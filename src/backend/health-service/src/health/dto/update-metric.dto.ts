import { IsNumber, IsOptional, IsString } from 'class-validator'; // class-validator@0.14.1

/**
 * Data transfer object for updating a health metric.
 * This DTO defines the properties that can be updated for a health metric.
 * Used when making partial updates to existing metrics.
 */
export class UpdateMetricDto {
    /**
     * The numeric value of the health metric
     * @example 120 (for systolic blood pressure)
     */
    @IsNumber()
    @IsOptional()
    value?: number;

    /**
     * The unit of measurement for the health metric
     * @example 'mmHg' (for blood pressure)
     */
    @IsString()
    @IsOptional()
    unit?: string;

    /**
     * Additional notes or context for the health metric
     * @example 'Measured after exercise'
     */
    @IsString()
    @IsOptional()
    notes?: string;
}
