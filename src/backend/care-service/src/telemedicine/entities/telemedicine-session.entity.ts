import { User } from '@app/auth/users/entities/user.entity';

import { Appointment } from '../../appointments/entities/appointment.entity';

/**
 * Represents a telemedicine session entity.
 */
export class TelemedicineSession {
    /**
     * Unique identifier for the telemedicine session.
     */
    id!: string;

    /**
     * ID of the appointment associated with the telemedicine session.
     */
    appointmentId!: string;

    /**
     * The appointment associated with the telemedicine session.
     */
    appointment!: Appointment;

    /**
     * ID of the patient participating in the telemedicine session.
     */
    patientId!: string;

    /**
     * The patient participating in the telemedicine session.
     */
    patient!: User;

    /**
     * ID of the healthcare provider conducting the telemedicine session.
     */
    providerId!: string;

    /**
     * The healthcare provider conducting the telemedicine session.
     */
    provider!: User;

    /**
     * Start time of the telemedicine session.
     */
    startTime!: Date;

    /**
     * End time of the telemedicine session (nullable if the session is ongoing).
     */
    endTime!: Date;

    /**
     * Status of the telemedicine session (e.g., scheduled, ongoing, completed, cancelled).
     */
    status!: string;

    /**
     * Timestamp of when the telemedicine session was created.
     */
    createdAt!: Date;

    /**
     * Timestamp of when the telemedicine session was last updated.
     */
    updatedAt!: Date;
}
