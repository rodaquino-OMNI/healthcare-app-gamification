import { PrismaService } from '@app/shared/database/prisma.service';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common'; // v10.0.0+
import { AppointmentStatus as PrismaAppointmentStatus } from '@prisma/client';

import { ProvidersService } from '@app/care/providers/providers.service';

import { configuration } from '../config/configuration';

/**
 * Provides reusable validation logic for appointment operations.
 * Extracted from AppointmentsSchedulingService to keep validation
 * concerns separate from CRUD and query logic.
 */
@Injectable()
export class AppointmentsValidationService {
    private readonly logger = new LoggerService();
    private readonly config = configuration();

    constructor(
        private readonly providersService: ProvidersService,
        private readonly prisma: PrismaService
    ) {
        this.logger.log(
            'AppointmentsValidationService initialized',
            'AppointmentsValidationService'
        );
    }

    /**
     * Validates that the given date/time is in the future.
     *
     * @param dateTime The date to validate
     * @param errorCode Error code to use if validation fails
     * @throws {AppException} If the date is in the past
     */
    validateFutureDate(dateTime: Date | string, errorCode: string): void {
        const appointmentDate = new Date(dateTime);
        const now = new Date();
        if (appointmentDate < now) {
            throw new AppException(
                'Appointment date must be in the future',
                ErrorType.VALIDATION,
                errorCode,
                { dateTime }
            );
        }
    }

    /**
     * Validates that the given date/time is within the maximum advance booking window.
     *
     * @param dateTime The date to validate
     * @param errorCode Error code to use if validation fails
     * @param actionLabel Label describing the action (e.g. "booked", "rescheduled")
     * @throws {AppException} If the date exceeds the max advance window
     */
    validateAdvanceBooking(dateTime: Date | string, errorCode: string, actionLabel: string): void {
        const appointmentDate = new Date(dateTime);
        const maxAdvanceDays = this.config.appointments.maxAdvanceDays;
        const maxAdvanceDate = new Date();
        maxAdvanceDate.setDate(maxAdvanceDate.getDate() + maxAdvanceDays);

        if (appointmentDate > maxAdvanceDate) {
            throw new AppException(
                `Appointments can only be ${actionLabel} up to ${maxAdvanceDays} days in advance`,
                ErrorType.VALIDATION,
                errorCode,
                { dateTime, maxAdvanceDate }
            );
        }
    }

    /**
     * Checks whether the provider is available at the requested time.
     *
     * @param providerId Provider ID
     * @param dateTime Requested appointment time
     * @param errorCode Error code to use if validation fails
     * @throws {AppException} If the provider is not available
     */
    async validateProviderAvailability(
        providerId: string,
        dateTime: Date,
        errorCode: string
    ): Promise<void> {
        const isAvailable = await this.providersService.checkAvailability(providerId, dateTime);

        if (!isAvailable) {
            throw new AppException(
                `Provider is not available at the requested time`,
                ErrorType.BUSINESS,
                errorCode,
                { providerId, dateTime }
            );
        }
    }

    /**
     * Validates that the provider offers telemedicine services.
     *
     * @param providerId Provider ID to check
     * @param errorCode Error code to use if validation fails
     * @throws {AppException} If the provider does not offer telemedicine
     */
    async validateTelemedicineAvailable(providerId: string, errorCode: string): Promise<void> {
        const provider = await this.providersService.findById(providerId);

        if (!provider.telemedicineAvailable) {
            throw new AppException(
                `Provider does not offer telemedicine services`,
                ErrorType.BUSINESS,
                errorCode,
                { providerId }
            );
        }
    }

    /**
     * Calculates the XP penalty for cancelling an appointment based on
     * the cancellation policy (minimum notice hours).
     *
     * @param appointmentDateTime The original appointment date/time
     * @returns The XP loss amount (0 if no penalty applies)
     */
    calculateCancellationPenalty(appointmentDateTime: Date | string): number {
        if (!this.config.appointments.cancellationPolicy.enabled) {
            return 0;
        }

        const appointmentDate = new Date(appointmentDateTime);
        const now = new Date();
        const hoursUntilAppointment =
            (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (
            hoursUntilAppointment < this.config.appointments.cancellationPolicy.minimumNoticeHours
        ) {
            return this.config.appointments.cancellationPolicy.penaltyXpLoss;
        }

        return 0;
    }

    /**
     * Checks for appointment conflicts for a user within a time buffer window.
     *
     * @param userId User ID
     * @param dateTime Proposed appointment date and time
     * @returns True if a conflict exists
     */
    async checkUserAppointmentConflict(userId: string, dateTime: Date): Promise<boolean> {
        try {
            const proposedTime = new Date(dateTime);

            // Check for existing appointments within a buffer time (e.g., 1 hour before and after)
            const bufferMinutes = this.config.appointments.availabilityBuffer;
            const startTime = new Date(proposedTime.getTime() - bufferMinutes * 60000);
            const endTime = new Date(proposedTime.getTime() + bufferMinutes * 60000);

            const conflictingAppointments = await this.prisma.appointment.findMany({
                where: {
                    userId,
                    dateTime: {
                        gte: startTime,
                        lte: endTime,
                    },
                    status: {
                        in: [PrismaAppointmentStatus.SCHEDULED],
                    },
                },
            });

            return conflictingAppointments.length > 0;
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            this.logger.error(
                `Failed to check appointment conflict: ${err.message}`,
                err.stack,
                'AppointmentsValidationService'
            );
            throw new AppException(
                `Failed to check appointment conflict for user ${userId}`,
                ErrorType.TECHNICAL,
                'CARE_130',
                { userId, dateTime }
            );
        }
    }
}
