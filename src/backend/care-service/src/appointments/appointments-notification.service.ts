import { KafkaService } from '@app/shared/kafka/kafka.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common'; // v10.0.0+

import { Appointment } from './entities/appointment.entity';
import { configuration } from '../config/configuration';

/**
 * Handles Kafka event publishing for appointment lifecycle events.
 * Publishes events consumed by gamification, notification, and analytics services.
 */
@Injectable()
export class AppointmentsNotificationService {
    private readonly logger = new LoggerService();
    private readonly config = configuration();

    constructor(private readonly kafkaService: KafkaService) {
        this.logger.log(
            'AppointmentsNotificationService initialized',
            'AppointmentsNotificationService'
        );
    }

    /**
     * Publishes an event when an appointment is created.
     *
     * @param appointment The newly created appointment
     */
    async publishAppointmentCreated(appointment: Appointment): Promise<void> {
        await this.kafkaService.produce(
            'care.appointment.created',
            {
                appointmentId: appointment.id,
                userId: appointment.userId,
                providerId: appointment.providerId,
                dateTime: appointment.dateTime,
                type: appointment.type,
                eventType: this.config.gamification.defaultEvents.appointmentBooked,
            },
            appointment.id
        );
    }

    /**
     * Publishes an event when an appointment is updated or cancelled.
     *
     * @param appointment The updated appointment
     * @param eventType The type of update event
     * @param xpLoss XP penalty for late cancellations
     */
    async publishAppointmentUpdated(
        appointment: Appointment,
        eventType: string,
        xpLoss: number
    ): Promise<void> {
        await this.kafkaService.produce(
            'care.appointment.updated',
            {
                appointmentId: appointment.id,
                userId: appointment.userId,
                providerId: appointment.providerId,
                dateTime: appointment.dateTime,
                type: appointment.type,
                status: appointment.status,
                eventType,
                xpLoss,
            },
            appointment.id
        );
    }

    /**
     * Publishes an event when an appointment is completed.
     * Triggers gamification XP reward for attendance.
     *
     * @param appointment The completed appointment
     */
    async publishAppointmentCompleted(appointment: Appointment): Promise<void> {
        await this.kafkaService.produce(
            'care.appointment.completed',
            {
                appointmentId: appointment.id,
                userId: appointment.userId,
                providerId: appointment.providerId,
                dateTime: appointment.dateTime,
                type: appointment.type,
                eventType: this.config.gamification.defaultEvents.appointmentAttended,
                xpReward: this.config.gamification.pointValues.appointmentAttended,
            },
            appointment.id
        );
    }

    /**
     * Publishes an event when an appointment is confirmed.
     *
     * @param appointment The confirmed appointment
     */
    async publishAppointmentConfirmed(appointment: Appointment): Promise<void> {
        await this.kafkaService.produce(
            'care.appointment.confirmed',
            {
                appointmentId: appointment.id,
                userId: appointment.userId,
                providerId: appointment.providerId,
                dateTime: appointment.dateTime,
                type: appointment.type,
            },
            appointment.id
        );
    }
}
