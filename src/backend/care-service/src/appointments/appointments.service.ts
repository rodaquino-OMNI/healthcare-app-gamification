import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto, PaginatedResponse } from '@app/shared/dto/pagination.dto';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common'; // v10.0.0+

import { TelemedicineSession } from '@app/care/telemedicine/entities/telemedicine-session.entity';

import { AppointmentsSchedulingService } from './appointments-scheduling.service';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointments/dto/update-appointment.dto';
import { Appointment } from '../appointments/entities/appointment.entity';

/**
 * Facade for the appointments subsystem.
 *
 * Preserves the original public API so that controllers and other consumers
 * are unaffected by the internal split into scheduling, validation, and
 * notification services.  Every call delegates directly to
 * {@link AppointmentsSchedulingService}.
 */
@Injectable()
export class AppointmentsService {
    private readonly logger = new LoggerService();

    constructor(private readonly schedulingService: AppointmentsSchedulingService) {
        this.logger.log('AppointmentsService initialized', 'AppointmentsService');
    }

    /** @see AppointmentsSchedulingService.findById */
    async findById(id: string): Promise<Appointment | null> {
        return this.schedulingService.findById(id);
    }

    /** @see AppointmentsSchedulingService.findAll */
    async findAll(
        filter?: FilterDto,
        pagination?: PaginationDto
    ): Promise<PaginatedResponse<Appointment>> {
        return this.schedulingService.findAll(filter, pagination);
    }

    /** @see AppointmentsSchedulingService.create */
    async create(data: CreateAppointmentDto): Promise<Appointment> {
        return this.schedulingService.create(data);
    }

    /** @see AppointmentsSchedulingService.update */
    async update(id: string, data: UpdateAppointmentDto): Promise<Appointment> {
        return this.schedulingService.update(id, data);
    }

    /** @see AppointmentsSchedulingService.delete */
    async delete(id: string): Promise<boolean> {
        return this.schedulingService.delete(id);
    }

    /** @see AppointmentsSchedulingService.count */
    async count(filter?: FilterDto): Promise<number> {
        return this.schedulingService.count(filter);
    }

    /** @see AppointmentsSchedulingService.completeAppointment */
    async completeAppointment(id: string): Promise<Appointment> {
        return this.schedulingService.completeAppointment(id);
    }

    /** @see AppointmentsSchedulingService.getUpcomingAppointments */
    async getUpcomingAppointments(
        userId: string,
        pagination?: PaginationDto
    ): Promise<PaginatedResponse<Appointment>> {
        return this.schedulingService.getUpcomingAppointments(userId, pagination);
    }

    /** @see AppointmentsSchedulingService.getPastAppointments */
    async getPastAppointments(
        userId: string,
        pagination?: PaginationDto
    ): Promise<PaginatedResponse<Appointment>> {
        return this.schedulingService.getPastAppointments(userId, pagination);
    }

    /** @see AppointmentsSchedulingService.confirmAppointment */
    async confirmAppointment(id: string): Promise<Appointment> {
        return this.schedulingService.confirmAppointment(id);
    }

    /** @see AppointmentsSchedulingService.startTelemedicineSession */
    async startTelemedicineSession(
        appointmentId: string,
        userId: string
    ): Promise<TelemedicineSession> {
        return this.schedulingService.startTelemedicineSession(appointmentId, userId);
    }

    /** @see AppointmentsSchedulingService.checkUserAppointmentConflict */
    async checkUserAppointmentConflict(userId: string, dateTime: Date): Promise<boolean> {
        return this.schedulingService.checkUserAppointmentConflict(userId, dateTime);
    }

    /** @see AppointmentsSchedulingService.getProviderAppointments */
    async getProviderAppointments(
        providerId: string,
        pagination?: PaginationDto,
        filter?: FilterDto
    ): Promise<PaginatedResponse<Appointment>> {
        return this.schedulingService.getProviderAppointments(providerId, pagination, filter);
    }

    /** @see AppointmentsSchedulingService.getProviderTodayAppointments */
    async getProviderTodayAppointments(providerId: string): Promise<Appointment[]> {
        return this.schedulingService.getProviderTodayAppointments(providerId);
    }
}
