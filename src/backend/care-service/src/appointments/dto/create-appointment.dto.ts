/* eslint-disable */
import { IsString, IsNotEmpty, IsDate, IsOptional, IsUUID, IsIn } from 'class-validator'; // version 0.14.0

/**
 * Data Transfer Object for creating a new appointment.
 * This class defines the structure and validation rules for appointment creation
 * requests in the Care Now journey.
 */
export class CreateAppointmentDto {
    /**
     * ID of the user scheduling the appointment.
     */
    @IsNotEmpty()
    @IsUUID()
    userId!: string;

    /**
     * ID of the healthcare provider for the appointment.
     */
    @IsNotEmpty()
    @IsUUID()
    providerId!: string;

    /**
     * Date and time of the appointment.
     */
    @IsNotEmpty()
    @IsDate()
    dateTime!: Date;

    /**
     * Type of appointment (e.g., in-person, telemedicine).
     */
    @IsNotEmpty()
    @IsString()
    @IsIn(['in-person', 'telemedicine'])
    type!: string;

    /**
     * Optional reason for the appointment.
     */
    @IsOptional()
    @IsString()
    reason?: string;
}
