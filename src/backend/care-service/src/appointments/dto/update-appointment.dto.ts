import { IsOptional, IsString, IsDate, IsEnum } from 'class-validator'; // class-validator@0.14.1

import { AppointmentType, AppointmentStatus } from '../entities/appointment.entity';

/**
 * Data Transfer Object for updating an appointment.
 * Used to receive and validate data for appointment updates in the Care journey.
 * Addresses requirement F-102-RQ-002: Appointment Booking
 */
export class UpdateAppointmentDto {
    /**
     * Optional notes or additional information about the appointment
     */
    @IsOptional()
    @IsString()
    notes?: string;

    /**
     * Optional appointment type (e.g. IN_PERSON, TELEMEDICINE)
     */
    @IsOptional()
    @IsEnum(AppointmentType)
    type?: AppointmentType;

    /**
     * Optional appointment status (e.g. SCHEDULED, CANCELLED, COMPLETED)
     */
    @IsOptional()
    @IsEnum(AppointmentStatus)
    status?: AppointmentStatus;

    /**
     * Optional date and time of the appointment
     */
    @IsOptional()
    @IsDate()
    dateTime?: Date;
}
