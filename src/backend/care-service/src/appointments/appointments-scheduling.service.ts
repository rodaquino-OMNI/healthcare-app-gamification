import { PrismaService } from '@app/shared/database/prisma.service';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto, PaginatedResponse } from '@app/shared/dto/pagination.dto';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common'; // v10.0.0+
import {
    AppointmentStatus as PrismaAppointmentStatus,
    AppointmentType as PrismaAppointmentType,
} from '@prisma/client';

import { ProvidersService } from '@app/care/providers/providers.service';
import { TelemedicineSession } from '@app/care/telemedicine/entities/telemedicine-session.entity';
import { TelemedicineService } from '@app/care/telemedicine/telemedicine.service';

import { AppointmentsNotificationService } from './appointments-notification.service';
import { AppointmentsValidationService } from './appointments-validation.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment, AppointmentStatus, AppointmentType } from './entities/appointment.entity';

/** Reusable Prisma include for appointment queries with provider and user. */
const APPOINTMENT_INCLUDE = {
    provider: true,
    user: { select: { id: true, name: true, email: true, phone: true } },
} as const;

/**
 * Core scheduling service handling CRUD operations, queries, and appointment
 * lifecycle transitions. Delegates validation to AppointmentsValidationService
 * and event publishing to AppointmentsNotificationService.
 */
@Injectable()
export class AppointmentsSchedulingService {
    private readonly logger = new LoggerService();
    private readonly ctx = 'AppointmentsSchedulingService';

    constructor(
        private readonly prisma: PrismaService,
        private readonly providersService: ProvidersService,
        private readonly telemedicineService: TelemedicineService,
        private readonly validationService: AppointmentsValidationService,
        private readonly notificationService: AppointmentsNotificationService
    ) {
        this.logger.log('AppointmentsSchedulingService initialized', this.ctx);
    }

    /** Wraps an unknown error into an AppException, logging first. */
    private rethrow(
        message: string,
        code: string,
        details: Record<string, unknown>,
        error: unknown
    ): never {
        const err = error instanceof Error ? error : new Error(String(error));
        this.logger.error(`${message}: ${err.message}`, err.stack, this.ctx);
        throw new AppException(message, ErrorType.TECHNICAL, code, details);
    }

    /**
     * Retrieves an appointment by its unique identifier.
     * @param id Appointment ID
     * @returns The requested appointment or null if not found
     */
    async findById(id: string): Promise<Appointment | null> {
        try {
            const appointment = await this.prisma.appointment.findUnique({
                where: { id },
                include: APPOINTMENT_INCLUDE,
            });
            return appointment as unknown as Appointment | null;
        } catch (error) {
            this.rethrow(`Failed to retrieve appointment with ID ${id}`, 'CARE_101', { id }, error);
        }
    }

    /**
     * Retrieves a paginated list of appointments based on filter criteria.
     * @param filter Filter criteria for appointments
     * @param pagination Pagination parameters
     * @returns Paginated list of appointments
     */
    async findAll(
        filter?: FilterDto,
        pagination?: PaginationDto
    ): Promise<PaginatedResponse<Appointment>> {
        try {
            const { page = 1, limit = 10 } = pagination || {};
            const skip = (page - 1) * limit;
            const where = filter?.where || {};

            const appointments = await this.prisma.appointment.findMany({
                where,
                skip,
                take: limit,
                orderBy: filter?.orderBy || { dateTime: 'DESC' },
                include: APPOINTMENT_INCLUDE,
            });

            const totalItems = await this.count(filter);
            const totalPages = Math.ceil(totalItems / limit);

            return {
                data: appointments as unknown as Appointment[],
                meta: {
                    page,
                    limit,
                    total: totalItems,
                    totalPages,
                    offset: skip,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            };
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }
            this.rethrow(
                'Failed to retrieve appointments',
                'CARE_102',
                { pagination, filter },
                error
            );
        }
    }

    /**
     * Creates a new appointment.
     * @param data Appointment data
     * @returns The created appointment
     */
    async create(data: CreateAppointmentDto): Promise<Appointment> {
        try {
            const provider = await this.providersService.findById(data.providerId);

            this.validationService.validateFutureDate(data.dateTime, 'CARE_103');
            this.validationService.validateAdvanceBooking(data.dateTime, 'CARE_104', 'booked');

            const appointmentDate = new Date(data.dateTime);
            await this.validationService.validateProviderAvailability(
                data.providerId,
                appointmentDate,
                'CARE_105'
            );

            if (
                (data.type as AppointmentType) === AppointmentType.TELEMEDICINE &&
                !provider.telemedicineAvailable
            ) {
                throw new AppException(
                    'Provider does not offer telemedicine services',
                    ErrorType.BUSINESS,
                    'CARE_106',
                    { providerId: data.providerId }
                );
            }

            const appointment = await this.prisma.appointment.create({
                data: {
                    userId: data.userId,
                    providerId: data.providerId,
                    dateTime: appointmentDate,
                    type: data.type.toUpperCase() as PrismaAppointmentType,
                    status: PrismaAppointmentStatus.SCHEDULED,
                    notes: data.reason ?? null,
                },
                include: APPOINTMENT_INCLUDE,
            });

            await this.notificationService.publishAppointmentCreated(
                appointment as unknown as Appointment
            );
            this.logger.log(`Appointment created: ${appointment.id}`, this.ctx);
            return appointment as unknown as Appointment;
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }
            this.rethrow('Failed to create appointment', 'CARE_107', { data }, error);
        }
    }

    /**
     * Updates an existing appointment.
     * @param id Appointment ID
     * @param data Updated appointment data
     * @returns The updated appointment
     */
    async update(id: string, data: UpdateAppointmentDto): Promise<Appointment> {
        try {
            const existing = await this.findById(id);

            if (!existing) {
                throw new AppException(
                    `Appointment with ID ${id} not found`,
                    ErrorType.BUSINESS,
                    'CARE_108',
                    { id }
                );
            }
            if (
                existing.status === AppointmentStatus.COMPLETED ||
                existing.status === AppointmentStatus.CANCELLED
            ) {
                throw new AppException(
                    `Cannot update a ${existing.status.toLowerCase()} appointment`,
                    ErrorType.BUSINESS,
                    'CARE_109',
                    { id, status: existing.status }
                );
            }

            // Validate date/time change
            if (data.dateTime && data.dateTime !== existing.dateTime) {
                this.validationService.validateFutureDate(data.dateTime, 'CARE_110');
                this.validationService.validateAdvanceBooking(
                    data.dateTime,
                    'CARE_111',
                    'rescheduled'
                );
                await this.validationService.validateProviderAvailability(
                    existing.providerId,
                    new Date(data.dateTime),
                    'CARE_112'
                );
            }

            // Validate telemedicine type change
            if (
                data.type === AppointmentType.TELEMEDICINE &&
                existing.type !== AppointmentType.TELEMEDICINE
            ) {
                await this.validationService.validateTelemedicineAvailable(
                    existing.providerId,
                    'CARE_113'
                );
            }

            const isCancelling =
                data.status === AppointmentStatus.CANCELLED &&
                (existing.status as AppointmentStatus) !== AppointmentStatus.CANCELLED;
            const xpLoss = isCancelling
                ? this.validationService.calculateCancellationPenalty(existing.dateTime)
                : 0;

            const updated = await this.prisma.appointment.update({
                where: { id },
                data: {
                    dateTime: data.dateTime,
                    type: data.type as unknown as PrismaAppointmentType | undefined,
                    status: data.status as unknown as PrismaAppointmentStatus | undefined,
                    notes: data.notes,
                },
                include: APPOINTMENT_INCLUDE,
            });

            const eventType = isCancelling ? 'APPOINTMENT_CANCELLED' : 'APPOINTMENT_UPDATED';
            await this.notificationService.publishAppointmentUpdated(
                updated as unknown as Appointment,
                eventType,
                xpLoss
            );

            this.logger.log(`Appointment updated: ${id}`, this.ctx);
            return updated as unknown as Appointment;
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }
            this.rethrow(
                `Failed to update appointment with ID ${id}`,
                'CARE_114',
                { id, data },
                error
            );
        }
    }

    /**
     * Soft-deletes an appointment by cancelling it.
     * @param id Appointment ID
     * @returns True if the appointment was successfully cancelled
     */
    async delete(id: string): Promise<boolean> {
        try {
            const existing = await this.findById(id);
            if (!existing) {
                throw new AppException(
                    `Appointment with ID ${id} not found`,
                    ErrorType.BUSINESS,
                    'CARE_115',
                    { id }
                );
            }
            await this.update(id, { status: AppointmentStatus.CANCELLED });
            this.logger.log(`Appointment cancelled: ${id}`, this.ctx);
            return true;
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }
            this.rethrow(`Failed to delete appointment with ID ${id}`, 'CARE_116', { id }, error);
        }
    }

    /**
     * Counts appointments based on filter criteria.
     * @param filter Filter criteria for appointments
     * @returns The count of matching appointments
     */
    async count(filter?: FilterDto): Promise<number> {
        try {
            const where = filter?.where || {};
            return await this.prisma.appointment.count({ where });
        } catch (error) {
            this.rethrow('Failed to count appointments', 'CARE_117', { filter }, error);
        }
    }

    /**
     * Marks an appointment as completed.
     * @param id Appointment ID
     * @returns The updated appointment
     */
    async completeAppointment(id: string): Promise<Appointment> {
        try {
            const existing = await this.findById(id);
            if (!existing) {
                throw new AppException(
                    `Appointment with ID ${id} not found`,
                    ErrorType.BUSINESS,
                    'CARE_118',
                    { id }
                );
            }
            if (
                existing.status === AppointmentStatus.COMPLETED ||
                existing.status === AppointmentStatus.CANCELLED
            ) {
                throw new AppException(
                    `Cannot complete a ${existing.status.toLowerCase()} appointment`,
                    ErrorType.BUSINESS,
                    'CARE_119',
                    { id, status: existing.status }
                );
            }

            const completed = await this.update(id, { status: AppointmentStatus.COMPLETED });
            await this.notificationService.publishAppointmentCompleted(completed);
            this.logger.log(`Appointment completed: ${id}`, this.ctx);
            return completed;
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }
            this.rethrow(`Failed to complete appointment with ID ${id}`, 'CARE_120', { id }, error);
        }
    }

    /**
     * Gets upcoming appointments for a user.
     * @param userId User ID
     * @param pagination Pagination parameters
     * @returns Paginated list of upcoming appointments
     */
    async getUpcomingAppointments(
        userId: string,
        pagination?: PaginationDto
    ): Promise<PaginatedResponse<Appointment>> {
        try {
            return this.findAll(
                {
                    where: {
                        userId,
                        dateTime: { gte: new Date() },
                        status: { in: [AppointmentStatus.SCHEDULED] },
                    },
                    orderBy: { dateTime: 'ASC' },
                },
                pagination
            );
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }
            this.rethrow(
                `Failed to retrieve upcoming appointments for user ${userId}`,
                'CARE_121',
                { userId, pagination },
                error
            );
        }
    }

    /**
     * Gets past appointments for a user.
     * @param userId User ID
     * @param pagination Pagination parameters
     * @returns Paginated list of past appointments
     */
    async getPastAppointments(
        userId: string,
        pagination?: PaginationDto
    ): Promise<PaginatedResponse<Appointment>> {
        try {
            return this.findAll(
                {
                    where: {
                        userId,
                        OR: [
                            { dateTime: { lt: new Date() } },
                            {
                                status: {
                                    in: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
                                },
                            },
                        ],
                    },
                    orderBy: { dateTime: 'DESC' },
                },
                pagination
            );
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }
            this.rethrow(
                `Failed to retrieve past appointments for user ${userId}`,
                'CARE_122',
                { userId, pagination },
                error
            );
        }
    }

    /**
     * Confirms an appointment.
     * @param id Appointment ID
     * @returns The updated appointment
     */
    async confirmAppointment(id: string): Promise<Appointment> {
        try {
            const existing = await this.findById(id);
            if (!existing) {
                throw new AppException(
                    `Appointment with ID ${id} not found`,
                    ErrorType.BUSINESS,
                    'CARE_123',
                    { id }
                );
            }
            if (existing.status !== AppointmentStatus.SCHEDULED) {
                throw new AppException(
                    `Cannot confirm appointment with status ${existing.status}`,
                    ErrorType.BUSINESS,
                    'CARE_124',
                    { id, status: existing.status }
                );
            }

            // CONFIRMED not in enum; keep as SCHEDULED to indicate confirmed booking
            const confirmed = await this.update(id, { status: AppointmentStatus.SCHEDULED });
            await this.notificationService.publishAppointmentConfirmed(confirmed);
            this.logger.log(`Appointment confirmed: ${id}`, this.ctx);
            return confirmed;
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }
            this.rethrow(`Failed to confirm appointment with ID ${id}`, 'CARE_125', { id }, error);
        }
    }

    /**
     * Initiates a telemedicine session for an appointment.
     * @param appointmentId Appointment ID
     * @param userId User ID initiating the session
     * @returns The created telemedicine session
     */
    async startTelemedicineSession(
        appointmentId: string,
        userId: string
    ): Promise<TelemedicineSession> {
        try {
            const appointment = await this.findById(appointmentId);
            if (!appointment) {
                throw new AppException(
                    `Appointment with ID ${appointmentId} not found`,
                    ErrorType.BUSINESS,
                    'CARE_126',
                    { appointmentId }
                );
            }
            if (appointment.type !== AppointmentType.TELEMEDICINE) {
                throw new AppException(
                    'Cannot start telemedicine session for non-telemedicine appointment',
                    ErrorType.BUSINESS,
                    'CARE_127',
                    { appointmentId, type: appointment.type }
                );
            }
            if (appointment.userId !== userId && appointment.providerId !== userId) {
                throw new AppException(
                    `User ${userId} is not authorized for this appointment`,
                    ErrorType.BUSINESS,
                    'CARE_128',
                    { appointmentId, userId }
                );
            }

            const session = await this.telemedicineService.startTelemedicineSession({
                userId,
                appointmentId,
                providerId: appointment.providerId,
            });
            this.logger.log(
                `Telemedicine session started for appointment: ${appointmentId}`,
                this.ctx
            );
            return session;
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }
            this.rethrow(
                `Failed to start telemedicine session for appointment ${appointmentId}`,
                'CARE_129',
                { appointmentId, userId },
                error
            );
        }
    }

    /**
     * Checks for appointment conflicts for a user.
     * @param userId User ID
     * @param dateTime Proposed appointment date and time
     * @returns True if a conflict exists
     */
    async checkUserAppointmentConflict(userId: string, dateTime: Date): Promise<boolean> {
        return this.validationService.checkUserAppointmentConflict(userId, dateTime);
    }

    /**
     * Gets appointments for a provider.
     * @param providerId Provider ID
     * @param pagination Pagination parameters
     * @param filter Filter criteria
     * @returns Paginated list of provider appointments
     */
    async getProviderAppointments(
        providerId: string,
        pagination?: PaginationDto,
        filter?: FilterDto
    ): Promise<PaginatedResponse<Appointment>> {
        try {
            return this.findAll({ ...filter, where: { ...filter?.where, providerId } }, pagination);
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }
            this.rethrow(
                `Failed to retrieve appointments for provider ${providerId}`,
                'CARE_131',
                { providerId, pagination, filter },
                error
            );
        }
    }

    /**
     * Gets today's appointments for a provider.
     * @param providerId Provider ID
     * @returns List of today's appointments
     */
    async getProviderTodayAppointments(providerId: string): Promise<Appointment[]> {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const result = await this.findAll(
                {
                    where: {
                        providerId,
                        dateTime: { gte: today, lt: tomorrow },
                        status: { in: [AppointmentStatus.SCHEDULED] },
                    },
                    orderBy: { dateTime: 'ASC' },
                },
                { limit: 100 }
            );
            return result.data;
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }
            this.rethrow(
                `Failed to retrieve today's appointments for provider ${providerId}`,
                'CARE_132',
                { providerId },
                error
            );
        }
    }
}
