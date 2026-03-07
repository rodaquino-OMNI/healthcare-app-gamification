import { IsNotEmpty, IsUUID } from 'class-validator'; // class-validator v5.0.1

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
    userId: string;
}
