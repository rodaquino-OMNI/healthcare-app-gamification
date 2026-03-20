import { User } from '@app/auth/users/entities/user.entity';

import { Provider } from '@app/care/providers/entities/provider.entity';

/**
 * Enum defining the possible types of appointments.
 * Values match Prisma-generated AppointmentType enum.
 */
export enum AppointmentType {
    IN_PERSON = 'IN_PERSON',
    TELEMEDICINE = 'TELEMEDICINE',
}

/**
 * Enum defining the possible statuses of appointments.
 * Values match Prisma-generated AppointmentStatus enum.
 */
export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

/**
 * Represents an appointment entity in the database.
 * This entity is part of the Care Journey and tracks scheduled
 * appointments between users and healthcare providers.
 */
export class Appointment {
    /**
     * Unique identifier for the appointment.
     */
    id!: string;

    /**
     * ID of the user scheduling the appointment.
     */
    userId!: string;

    /**
     * The user scheduling the appointment.
     */
    user!: User;

    /**
     * ID of the healthcare provider for the appointment.
     */
    providerId!: string;

    /**
     * The healthcare provider for the appointment.
     */
    provider!: Provider;

    /**
     * Date and time of the appointment.
     */
    dateTime!: Date;

    /**
     * Type of appointment (e.g., in-person, telemedicine).
     */
    type!: AppointmentType;

    /**
     * Status of the appointment (e.g., scheduled, completed, cancelled).
     */
    status!: AppointmentStatus;

    /**
     * Optional notes or comments about the appointment.
     */
    notes!: string;
}
