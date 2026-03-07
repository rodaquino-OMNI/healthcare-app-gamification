import { IsNotEmpty, IsString, IsObject, IsUUID, IsOptional } from 'class-validator'; // class-validator@latest

/**
 * Data transfer object for processing events within the gamification engine.
 * This defines the structure and validation rules for events received from
 * various journeys in the AUSTA SuperApp. Events are used to award points,
 * track achievements, and trigger gamification elements.
 */
export class ProcessEventDto {
    /**
     * The type of the event.
     * Examples:
     * - 'HEALTH_METRIC_RECORDED' - User recorded a health metric
     * - 'APPOINTMENT_BOOKED' - User booked a medical appointment
     * - 'CLAIM_SUBMITTED' - User submitted an insurance claim
     * - 'MEDICATION_TAKEN' - User logged taking medication
     * - 'GOAL_ACHIEVED' - User achieved a health goal
     */
    @IsNotEmpty()
    @IsString()
    type: string = '';

    /**
     * The ID of the user associated with the event.
     * This must be a valid UUID and identify a registered user in the system.
     */
    @IsNotEmpty()
    @IsUUID()
    userId: string = '';

    /**
     * The data associated with the event.
     * This contains journey-specific details about the event, such as:
     * - Health journey: metric type, value, unit
     * - Care journey: appointment details, provider information
     * - Plan journey: claim amount, claim type
     */
    @IsNotEmpty()
    @IsObject()
    data: object = {};

    /**
     * The journey associated with the event.
     * Possible values:
     * - 'health' - My Health journey
     * - 'care' - Care Now journey
     * - 'plan' - My Plan & Benefits journey
     * This field is optional but recommended for better context.
     */
    @IsOptional()
    @IsString()
    journey: string = '';
}
