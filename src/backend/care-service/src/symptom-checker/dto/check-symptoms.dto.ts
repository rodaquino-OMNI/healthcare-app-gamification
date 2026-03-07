import { IsArray, IsString, ArrayNotEmpty } from 'class-validator'; // v0.14.0

/**
 * Data Transfer Object for checking symptoms.
 * Used as input for the symptom checker feature in the Care Now journey.
 */
export class CheckSymptomsDto {
    /**
     * Array of symptom identifiers to be checked.
     * These identifiers should match the symptom catalog in the system.
     */
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true }) // Validates each element in the array is a string
    symptoms: string[];
}
