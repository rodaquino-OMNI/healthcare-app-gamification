import { Injectable } from '@nestjs/common';

import { CreateSessionDto } from './dto/create-session.dto';
import { TelemedicineSession } from './entities/telemedicine-session.entity';
import { PrismaService } from '../../../shared/src/database/prisma.service';
import { AppException, ErrorType } from '../../../shared/src/exceptions/exceptions.types';
import { KafkaService } from '../../../shared/src/kafka/kafka.service';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { AppointmentType, AppointmentStatus } from '../appointments/entities/appointment.entity';
import { configuration } from '../config/configuration';
import { ProvidersService } from '../providers/providers.service';

const CARE_TELEMEDICINE_CONNECTION_FAILED = 'CARE_TELEMEDICINE_CONNECTION_FAILED';

/**
 * Service responsible for managing telemedicine sessions, including session creation,
 * validation, and coordination between patients and healthcare providers.
 */
@Injectable()
export class TelemedicineService {
    private readonly config = configuration();

    /**
     * Initializes the TelemedicineService with required dependencies.
     *
     * @param prisma - Database service for data access
     * @param logger - Logger service for structured logging
     * @param kafkaService - Event streaming service for publishing events
     * @param providersService - Service for validating provider information
     */
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService,
        private readonly kafkaService: KafkaService,
        private readonly providersService: ProvidersService
    ) {
        this.logger.log('TelemedicineService initialized', 'TelemedicineService');
    }

    /**
     * Starts a new telemedicine session between a patient and provider.
     * Validates provider availability, appointment eligibility, and creates
     * the necessary session records.
     *
     * @param createSessionDto - Data required to create a telemedicine session
     * @returns The created telemedicine session
     * @throws AppException if validation fails or system error occurs
     */
    async startTelemedicineSession(
        createSessionDto: CreateSessionDto
    ): Promise<TelemedicineSession> {
        try {
            // Validate that telemedicine is enabled in the configuration
            if (!this.config.telemedicine.enabled) {
                throw new AppException(
                    'Telemedicine service is currently disabled',
                    ErrorType.BUSINESS,
                    'CARE_TELEMEDICINE_DISABLED',
                    {}
                );
            }

            // Validate that the provider offers telemedicine
            const provider = await this.providersService.findById(createSessionDto.providerId!);

            if (!provider.telemedicineAvailable) {
                throw new AppException(
                    `Provider ${provider.name} does not offer telemedicine services`,
                    ErrorType.BUSINESS,
                    'CARE_TELEMEDICINE_UNAVAILABLE',
                    { providerId: provider.id }
                );
            }

            // Get the appointment to validate eligibility
            const appointment = await this.prisma.appointment.findUnique({
                where: { id: createSessionDto.appointmentId! },
            });

            if (!appointment) {
                throw new AppException(
                    `Appointment with ID ${createSessionDto.appointmentId!} not found`,
                    ErrorType.BUSINESS,
                    'CARE_APPOINTMENT_NOT_FOUND',
                    { appointmentId: createSessionDto.appointmentId! }
                );
            }

            // Validate appointment type is telemedicine
            if (appointment.type !== AppointmentType.TELEMEDICINE) {
                throw new AppException(
                    'Cannot start telemedicine session for a non-telemedicine appointment',
                    ErrorType.BUSINESS,
                    'CARE_APPOINTMENT_INVALID_TYPE',
                    { appointmentId: appointment.id, type: appointment.type }
                );
            }

            // Validate appointment status
            if (appointment.status !== AppointmentStatus.SCHEDULED) {
                throw new AppException(
                    `Cannot start telemedicine session for appointment with status ${appointment.status}`,
                    ErrorType.BUSINESS,
                    'CARE_APPOINTMENT_INVALID_STATUS',
                    { appointmentId: appointment.id, status: appointment.status }
                );
            }

            // Create a new telemedicine session
            const session = await this.prisma.telemedicineSession.create({
                data: {
                    appointmentId: createSessionDto.appointmentId!,
                    patientId: createSessionDto.userId,
                    providerId: provider.id,
                    startTime: new Date(),
                    status: 'STARTED',
                },
            });

            // Update appointment status (keep as SCHEDULED while telemedicine session is active)
            await this.prisma.appointment.update({
                where: { id: appointment.id },
                data: { status: 'SCHEDULED' },
            });

            // Log session creation
            this.logger.log(`Telemedicine session started: ${session.id}`, 'TelemedicineService');

            // Publish event to Kafka for gamification and notifications
            await this.kafkaService.produce(
                'care.telemedicine.started',
                {
                    sessionId: session.id,
                    appointmentId: session.appointmentId,
                    patientId: session.patientId,
                    providerId: session.providerId,
                    startTime: session.startTime,
                    maxDuration: this.config.telemedicine.sessionDuration.default,
                },
                session.id // Use session ID as message key for ordering
            );

            return session as unknown as TelemedicineSession;
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }

            const err = error instanceof Error ? error : new Error(String(error));
            this.logger.error(
                `Failed to start telemedicine session: ${err.message}`,
                err.stack,
                'TelemedicineService'
            );

            throw new AppException(
                'Failed to start telemedicine session',
                ErrorType.TECHNICAL,
                CARE_TELEMEDICINE_CONNECTION_FAILED,
                { dto: createSessionDto }
            );
        }
    }
}
