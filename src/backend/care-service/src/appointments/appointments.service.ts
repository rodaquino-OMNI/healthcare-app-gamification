/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common'; // v10.0.0+
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointments/dto/update-appointment.dto';
import { Appointment, AppointmentStatus, AppointmentType } from '../appointments/entities/appointment.entity';
import { Service } from '@app/shared/interfaces/service.interface';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto, PaginatedResponse } from '@app/shared/dto/pagination.dto';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { Repository } from '@app/shared/interfaces/repository.interface';
import { ProvidersService } from '@app/care/providers/providers.service';
import { TelemedicineService } from '@app/care/telemedicine/telemedicine.service';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { AuthService } from '@app/auth/auth/auth.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { configuration } from '../config/configuration';

/**
 * Handles the business logic for managing appointments within the Care Service.
 * This service provides methods for creating, retrieving, updating, and deleting appointments,
 * ensuring proper data validation and interaction with the data access layer.
 * 
 * Implements the requirements for appointment booking and management in the Care Now journey.
 */
@Injectable()
export class AppointmentsService implements Service<Appointment, CreateAppointmentDto, UpdateAppointmentDto> {
  private readonly logger = new LoggerService();
  private readonly config = configuration();

  /**
   * Initializes the AppointmentsService with required dependencies.
   * 
   * @param prisma Database service for appointment data access
   * @param providersService Service for managing healthcare providers
   * @param telemedicineService Service for managing telemedicine sessions
   * @param kafkaService Service for event streaming
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly providersService: ProvidersService,
    private readonly telemedicineService: TelemedicineService,
    private readonly kafkaService: KafkaService
  ) {
    this.logger.log('AppointmentsService initialized', 'AppointmentsService');
  }

  /**
   * Retrieves an appointment by its unique identifier.
   * 
   * @param id Appointment ID
   * @returns The requested appointment or null if not found
   */
  async findById(id: string): Promise<Appointment | null> {
    try {
      const appointment = await (this.prisma as any).appointment.findUnique({
        where: { id },
        include: {
          provider: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      });

      return appointment;
    } catch (error) {
      this.logger.error(`Failed to find appointment: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        `Failed to retrieve appointment with ID ${id}`,
        ErrorType.TECHNICAL,
        'CARE_101',
        { id },
        error
      );
    }
  }

  /**
   * Retrieves a paginated list of appointments based on filter criteria.
   * 
   * @param pagination Pagination parameters
   * @param filter Filter criteria for appointments
   * @returns Paginated list of appointments
   */
  async findAll(pagination?: PaginationDto, filter?: FilterDto): Promise<PaginatedResponse<Appointment>> {
    try {
      const { page = 1, limit = 10 } = pagination || {};
      const skip = (page - 1) * limit;

      // Prepare where clause from filter
      const where = filter?.where || {};

      // Get appointments with pagination
      const appointments = await (this.prisma as any).appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: filter?.orderBy || { dateTime: 'desc' },
        include: {
          provider: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      });

      // Get total count for pagination
      const totalItems = await this.count(filter);
      const totalPages = Math.ceil(totalItems / limit);

      return {
        data: appointments,
        meta: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      this.logger.error(`Failed to find appointments: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        'Failed to retrieve appointments',
        ErrorType.TECHNICAL,
        'CARE_102',
        { pagination, filter },
        error
      );
    }
  }

  /**
   * Creates a new appointment.
   * 
   * @param data Appointment data
   * @returns The created appointment
   */
  async create(data: CreateAppointmentDto): Promise<Appointment> {
    try {
      // Check if provider exists
      const provider = await this.providersService.findById(data.providerId);

      // Check appointment time is in the future
      const appointmentDate = new Date(data.dateTime);
      const now = new Date();
      if (appointmentDate < now) {
        throw new AppException(
          'Appointment date must be in the future',
          ErrorType.VALIDATION,
          'CARE_103',
          { dateTime: data.dateTime }
        );
      }

      // Check if the appointment time is within allowed advance booking range
      const maxAdvanceDays = this.config.appointments.maxAdvanceDays;
      const maxAdvanceDate = new Date();
      maxAdvanceDate.setDate(maxAdvanceDate.getDate() + maxAdvanceDays);

      if (appointmentDate > maxAdvanceDate) {
        throw new AppException(
          `Appointments can only be booked up to ${maxAdvanceDays} days in advance`,
          ErrorType.VALIDATION,
          'CARE_104',
          { dateTime: data.dateTime, maxAdvanceDate }
        );
      }

      // Check provider availability for the requested time
      const isAvailable = await this.providersService.checkAvailability(
        data.providerId, 
        appointmentDate
      );

      if (!isAvailable) {
        throw new AppException(
          `Provider is not available at the requested time`,
          ErrorType.BUSINESS,
          'CARE_105',
          { providerId: data.providerId, dateTime: data.dateTime }
        );
      }

      // For telemedicine, check if provider offers it
      if (data.type === AppointmentType.TELEMEDICINE && !provider.telemedicineAvailable) {
        throw new AppException(
          `Provider does not offer telemedicine services`,
          ErrorType.BUSINESS,
          'CARE_106',
          { providerId: data.providerId }
        );
      }

      // Create appointment
      const appointment = await (this.prisma as any).appointment.create({
        data: {
          userId: data.userId,
          providerId: data.providerId,
          dateTime: appointmentDate,
          type: data.type as AppointmentType,
          status: AppointmentStatus.SCHEDULED,
          reason: data.reason || null,
          notes: null
        },
        include: {
          provider: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      });

      // Publish appointment creation event for gamification and notifications
      await this.kafkaService.produce(
        'care.appointment.created',
        {
          appointmentId: appointment.id,
          userId: appointment.userId,
          providerId: appointment.providerId,
          dateTime: appointment.dateTime,
          type: appointment.type,
          eventType: this.config.gamification.defaultEvents.appointmentBooked
        },
        appointment.id
      );

      this.logger.log(`Appointment created: ${appointment.id}`, 'AppointmentsService');
      return appointment;
    } catch (error) {
      if (error instanceof AppException) {
        throw error as any;
      }

      this.logger.error(`Failed to create appointment: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        'Failed to create appointment',
        ErrorType.TECHNICAL,
        'CARE_107',
        { data },
        error
      );
    }
  }

  /**
   * Updates an existing appointment.
   * 
   * @param id Appointment ID
   * @param data Updated appointment data
   * @returns The updated appointment
   */
  async update(id: string, data: UpdateAppointmentDto): Promise<Appointment> {
    try {
      // Check if appointment exists
      const existingAppointment = await this.findById(id);
      
      if (!existingAppointment) {
        throw new AppException(
          `Appointment with ID ${id} not found`,
          ErrorType.BUSINESS,
          'CARE_108',
          { id }
        );
      }

      // Check if the appointment is already completed or cancelled
      if (
        existingAppointment.status === AppointmentStatus.COMPLETED || 
        existingAppointment.status === AppointmentStatus.CANCELLED
      ) {
        throw new AppException(
          `Cannot update a ${existingAppointment.status.toLowerCase()} appointment`,
          ErrorType.BUSINESS,
          'CARE_109',
          { id, status: existingAppointment.status }
        );
      }

      // If changing date/time, validate availability
      if (data.dateTime && data.dateTime !== existingAppointment.dateTime) {
        const newDateTime = new Date(data.dateTime);
        const now = new Date();
        
        // Check if the new date is in the future
        if (newDateTime < now) {
          throw new AppException(
            'Appointment date must be in the future',
            ErrorType.VALIDATION,
            'CARE_110',
            { dateTime: data.dateTime }
          );
        }

        // Check if the new date is within allowed rescheduling window
        const maxAdvanceDays = this.config.appointments.maxAdvanceDays;
        const maxAdvanceDate = new Date();
        maxAdvanceDate.setDate(maxAdvanceDate.getDate() + maxAdvanceDays);

        if (newDateTime > maxAdvanceDate) {
          throw new AppException(
            `Appointments can only be rescheduled up to ${maxAdvanceDays} days in advance`,
            ErrorType.VALIDATION,
            'CARE_111',
            { dateTime: data.dateTime, maxAdvanceDate }
          );
        }

        // Check provider availability for the new time
        const isAvailable = await this.providersService.checkAvailability(
          existingAppointment.providerId, 
          newDateTime
        );

        if (!isAvailable) {
          throw new AppException(
            `Provider is not available at the requested time`,
            ErrorType.BUSINESS,
            'CARE_112',
            { providerId: existingAppointment.providerId, dateTime: data.dateTime }
          );
        }
      }

      // If changing type to telemedicine, check if provider offers it
      if (
        data.type === AppointmentType.TELEMEDICINE && 
        existingAppointment.type !== AppointmentType.TELEMEDICINE
      ) {
        const provider = await this.providersService.findById(existingAppointment.providerId);
        
        if (!provider.telemedicineAvailable) {
          throw new AppException(
            `Provider does not offer telemedicine services`,
            ErrorType.BUSINESS,
            'CARE_113',
            { providerId: existingAppointment.providerId }
          );
        }
      }

      // Check if cancelling an appointment
      const isCancelling = data.status === AppointmentStatus.CANCELLED && 
                          existingAppointment.status !== AppointmentStatus.CANCELLED;

      // Apply cancellation policy if applicable
      let xpLoss = 0;
      if (isCancelling && this.config.appointments.cancellationPolicy.enabled) {
        const appointmentDate = new Date(existingAppointment.dateTime);
        const now = new Date();
        const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (hoursUntilAppointment < this.config.appointments.cancellationPolicy.minimumNoticeHours) {
          xpLoss = this.config.appointments.cancellationPolicy.penaltyXpLoss;
        }
      }

      // Update appointment
      const updatedAppointment = await (this.prisma as any).appointment.update({
        where: { id },
        data: {
          dateTime: data.dateTime,
          type: data.type,
          status: data.status,
          notes: data.notes
        },
        include: {
          provider: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      });

      // Publish event for appointment update
      const eventType = isCancelling ? 
        this.config.gamification.defaultEvents.appointmentCancelled : 
        'APPOINTMENT_UPDATED';

      await this.kafkaService.produce(
        'care.appointment.updated',
        {
          appointmentId: updatedAppointment.id,
          userId: updatedAppointment.userId,
          providerId: updatedAppointment.providerId,
          dateTime: updatedAppointment.dateTime,
          type: updatedAppointment.type,
          status: updatedAppointment.status,
          eventType,
          xpLoss
        },
        updatedAppointment.id
      );

      this.logger.log(`Appointment updated: ${id}`, 'AppointmentsService');
      return updatedAppointment;
    } catch (error) {
      if (error instanceof AppException) {
        throw error as any;
      }

      this.logger.error(`Failed to update appointment: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        `Failed to update appointment with ID ${id}`,
        ErrorType.TECHNICAL,
        'CARE_114',
        { id, data },
        error
      );
    }
  }

  /**
   * Deletes an appointment.
   * Note: This is a soft delete operation that cancels the appointment instead of removing it.
   * 
   * @param id Appointment ID
   * @returns True if the appointment was successfully cancelled
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Check if appointment exists
      const existingAppointment = await this.findById(id);
      
      if (!existingAppointment) {
        throw new AppException(
          `Appointment with ID ${id} not found`,
          ErrorType.BUSINESS,
          'CARE_115',
          { id }
        );
      }

      // Cancel the appointment instead of deleting it
      await this.update(id, { status: AppointmentStatus.CANCELLED });
      
      this.logger.log(`Appointment cancelled: ${id}`, 'AppointmentsService');
      return true;
    } catch (error) {
      if (error instanceof AppException) {
        throw error as any;
      }

      this.logger.error(`Failed to delete appointment: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        `Failed to delete appointment with ID ${id}`,
        ErrorType.TECHNICAL,
        'CARE_116',
        { id },
        error
      );
    }
  }

  /**
   * Counts appointments based on filter criteria.
   * 
   * @param filter Filter criteria for appointments
   * @returns The count of matching appointments
   */
  async count(filter?: FilterDto): Promise<number> {
    try {
      const where = filter?.where || {};
      return await (this.prisma as any).appointment.count({ where });
    } catch (error) {
      this.logger.error(`Failed to count appointments: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        'Failed to count appointments',
        ErrorType.TECHNICAL,
        'CARE_117',
        { filter },
        error
      );
    }
  }

  /**
   * Marks an appointment as completed.
   * 
   * @param id Appointment ID
   * @returns The updated appointment
   */
  async completeAppointment(id: string): Promise<Appointment> {
    try {
      // Check if appointment exists
      const existingAppointment = await this.findById(id);
      
      if (!existingAppointment) {
        throw new AppException(
          `Appointment with ID ${id} not found`,
          ErrorType.BUSINESS,
          'CARE_118',
          { id }
        );
      }

      // Check if the appointment is already completed or cancelled
      if (
        existingAppointment.status === AppointmentStatus.COMPLETED || 
        existingAppointment.status === AppointmentStatus.CANCELLED
      ) {
        throw new AppException(
          `Cannot complete a ${existingAppointment.status.toLowerCase()} appointment`,
          ErrorType.BUSINESS,
          'CARE_119',
          { id, status: existingAppointment.status }
        );
      }

      // Update appointment status
      const completedAppointment = await this.update(id, { 
        status: AppointmentStatus.COMPLETED 
      });

      // Publish event for appointment completion and gamification
      await this.kafkaService.produce(
        'care.appointment.completed',
        {
          appointmentId: completedAppointment.id,
          userId: completedAppointment.userId,
          providerId: completedAppointment.providerId,
          dateTime: completedAppointment.dateTime,
          type: completedAppointment.type,
          eventType: this.config.gamification.defaultEvents.appointmentAttended,
          xpReward: this.config.gamification.pointValues.appointmentAttended
        },
        completedAppointment.id
      );

      this.logger.log(`Appointment completed: ${id}`, 'AppointmentsService');
      return completedAppointment;
    } catch (error) {
      if (error instanceof AppException) {
        throw error as any;
      }

      this.logger.error(`Failed to complete appointment: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        `Failed to complete appointment with ID ${id}`,
        ErrorType.TECHNICAL,
        'CARE_120',
        { id },
        error
      );
    }
  }

  /**
   * Gets upcoming appointments for a user.
   * 
   * @param userId User ID
   * @param pagination Pagination parameters
   * @returns Paginated list of upcoming appointments
   */
  async getUpcomingAppointments(userId: string, pagination?: PaginationDto): Promise<PaginatedResponse<Appointment>> {
    try {
      const now = new Date();
      
      return this.findAll(pagination, {
        where: {
          userId,
          dateTime: { gte: now },
          status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] }
        },
        orderBy: { dateTime: 'asc' }
      });
    } catch (error) {
      this.logger.error(`Failed to get upcoming appointments: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        `Failed to retrieve upcoming appointments for user ${userId}`,
        ErrorType.TECHNICAL,
        'CARE_121',
        { userId, pagination },
        error
      );
    }
  }

  /**
   * Gets past appointments for a user.
   * 
   * @param userId User ID
   * @param pagination Pagination parameters
   * @returns Paginated list of past appointments
   */
  async getPastAppointments(userId: string, pagination?: PaginationDto): Promise<PaginatedResponse<Appointment>> {
    try {
      const now = new Date();
      
      return this.findAll(pagination, {
        where: {
          userId,
          OR: [
            { dateTime: { lt: now } },
            { status: { in: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED] } }
          ]
        },
        orderBy: { dateTime: 'desc' }
      });
    } catch (error) {
      this.logger.error(`Failed to get past appointments: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        `Failed to retrieve past appointments for user ${userId}`,
        ErrorType.TECHNICAL,
        'CARE_122',
        { userId, pagination },
        error
      );
    }
  }

  /**
   * Confirms an appointment.
   * 
   * @param id Appointment ID
   * @returns The updated appointment
   */
  async confirmAppointment(id: string): Promise<Appointment> {
    try {
      // Check if appointment exists
      const existingAppointment = await this.findById(id);
      
      if (!existingAppointment) {
        throw new AppException(
          `Appointment with ID ${id} not found`,
          ErrorType.BUSINESS,
          'CARE_123',
          { id }
        );
      }

      // Check if the appointment is in a valid state for confirmation
      if (existingAppointment.status !== AppointmentStatus.SCHEDULED) {
        throw new AppException(
          `Cannot confirm appointment with status ${existingAppointment.status}`,
          ErrorType.BUSINESS,
          'CARE_124',
          { id, status: existingAppointment.status }
        );
      }

      // Update appointment status
      const confirmedAppointment = await this.update(id, { 
        status: AppointmentStatus.CONFIRMED 
      });

      // Publish event for appointment confirmation
      await this.kafkaService.produce(
        'care.appointment.confirmed',
        {
          appointmentId: confirmedAppointment.id,
          userId: confirmedAppointment.userId,
          providerId: confirmedAppointment.providerId,
          dateTime: confirmedAppointment.dateTime,
          type: confirmedAppointment.type
        },
        confirmedAppointment.id
      );

      this.logger.log(`Appointment confirmed: ${id}`, 'AppointmentsService');
      return confirmedAppointment;
    } catch (error) {
      if (error instanceof AppException) {
        throw error as any;
      }

      this.logger.error(`Failed to confirm appointment: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        `Failed to confirm appointment with ID ${id}`,
        ErrorType.TECHNICAL,
        'CARE_125',
        { id },
        error
      );
    }
  }

  /**
   * Initiates a telemedicine session for an appointment.
   * 
   * @param appointmentId Appointment ID
   * @param userId User ID initiating the session
   * @returns The created telemedicine session
   */
  async startTelemedicineSession(appointmentId: string, userId: string): Promise<any> {
    try {
      // Check if appointment exists
      const appointment = await this.findById(appointmentId);
      
      if (!appointment) {
        throw new AppException(
          `Appointment with ID ${appointmentId} not found`,
          ErrorType.BUSINESS,
          'CARE_126',
          { appointmentId }
        );
      }

      // Check if the appointment is of type telemedicine
      if (appointment.type !== AppointmentType.TELEMEDICINE) {
        throw new AppException(
          `Cannot start telemedicine session for non-telemedicine appointment`,
          ErrorType.BUSINESS,
          'CARE_127',
          { appointmentId, type: appointment.type }
        );
      }

      // Check if the user is either the patient or the provider
      if (appointment.userId !== userId && appointment.providerId !== userId) {
        throw new AppException(
          `User ${userId} is not authorized for this appointment`,
          ErrorType.BUSINESS,
          'CARE_128',
          { appointmentId, userId }
        );
      }

      // Create telemedicine session using the telemedicine service
      const session = await this.telemedicineService.startTelemedicineSession({
        userId,
        appointmentId,
        providerId: appointment.providerId
      });

      this.logger.log(`Telemedicine session started for appointment: ${appointmentId}`, 'AppointmentsService');
      return session;
    } catch (error) {
      if (error instanceof AppException) {
        throw error as any;
      }

      this.logger.error(`Failed to start telemedicine session: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        `Failed to start telemedicine session for appointment ${appointmentId}`,
        ErrorType.TECHNICAL,
        'CARE_129',
        { appointmentId, userId },
        error
      );
    }
  }

  /**
   * Checks for appointment conflicts for a user.
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
      
      const conflictingAppointments = await (this.prisma as any).appointment.findMany({
        where: {
          userId,
          dateTime: {
            gte: startTime,
            lte: endTime
          },
          status: {
            in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED]
          }
        }
      });
      
      return conflictingAppointments.length > 0;
    } catch (error) {
      this.logger.error(`Failed to check appointment conflict: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        `Failed to check appointment conflict for user ${userId}`,
        ErrorType.TECHNICAL,
        'CARE_130',
        { userId, dateTime },
        error
      );
    }
  }

  /**
   * Gets appointments for a provider.
   * 
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
      const providerFilter = {
        ...filter,
        where: {
          ...filter?.where,
          providerId
        }
      };
      
      return this.findAll(pagination, providerFilter);
    } catch (error) {
      this.logger.error(`Failed to get provider appointments: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        `Failed to retrieve appointments for provider ${providerId}`,
        ErrorType.TECHNICAL,
        'CARE_131',
        { providerId, pagination, filter },
        error
      );
    }
  }

  /**
   * Gets today's appointments for a provider.
   * 
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
        { limit: 100 }, // Higher limit to get all of today's appointments
        {
          where: {
            providerId,
            dateTime: {
              gte: today,
              lt: tomorrow
            },
            status: {
              in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED]
            }
          },
          orderBy: { dateTime: 'asc' }
        }
      );
      
      return result.data;
    } catch (error) {
      this.logger.error(`Failed to get provider's today appointments: ${(error as any).message}`, (error as any).stack, 'AppointmentsService');
      throw new AppException(
        `Failed to retrieve today's appointments for provider ${providerId}`,
        ErrorType.TECHNICAL,
        'CARE_132',
        { providerId },
        error
      );
    }
  }
}