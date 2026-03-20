import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator'; // class-validator v5.0.1

/**
 * Data Transfer Object for creating a telemedicine session.
 * This DTO defines the structure of data required from the client
 * to initiate a telemedicine session in the Care Now journey.
 */
export class CreateSessionDto {
    /**
     * The ID of the user initiating the telemedicine session.
     * Must be a valid UUID.
     */
    @IsNotEmpty()
    @IsUUID()
    userId!: string;

    /**
     * The ID of the appointment associated with the telemedicine session.
     * Provided when starting a session from an existing appointment.
     */
    @IsOptional()
    @IsUUID()
    appointmentId?: string;

    /**
     * The ID of the healthcare provider for the telemedicine session.
     * Provided when starting a session from an existing appointment.
     */
    @IsOptional()
    @IsUUID()
    providerId?: string;
}
