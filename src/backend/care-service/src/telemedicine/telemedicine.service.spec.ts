/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { TelemedicineService } from './telemedicine.service';
import { AppException } from '../../../shared/src/exceptions/exceptions.types';

/**
 * Unit tests for TelemedicineService.
 *
 * Uses direct instantiation to avoid NestJS DI token resolution issues
 * with configuration registered via registerAs.
 */
describe('TelemedicineService', () => {
    let service: TelemedicineService;

    const mockSession = {
        id: 'session-test-123',
        appointmentId: 'appt-test-123',
        patientId: 'user-test-123',
        providerId: 'provider-test-123',
        startTime: new Date(),
        status: 'STARTED',
    };

    const mockAppointment = {
        id: 'appt-test-123',
        userId: 'user-test-123',
        providerId: 'provider-test-123',
        type: 'TELEMEDICINE',
        status: 'SCHEDULED',
        dateTime: new Date(Date.now() + 60 * 60 * 1000),
    };

    const mockProvider = {
        id: 'provider-test-123',
        name: 'Dr. Telemedicine',
        telemedicineAvailable: true,
    };

    const mockPrisma = {
        appointment: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        telemedicineSession: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
        },
    };

    const mockLogger = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    };

    const mockKafkaService = {
        produce: jest.fn(),
        emit: jest.fn(),
    };

    const mockProvidersService = {
        findById: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        service = new TelemedicineService(
            mockPrisma as any,
            mockLogger as any,
            mockKafkaService as any,
            mockProvidersService as any
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ----------------------------------------------------------------
    // startTelemedicineSession
    // ----------------------------------------------------------------
    describe('startTelemedicineSession', () => {
        const createSessionDto = {
            userId: 'user-test-123',
            appointmentId: 'appt-test-123',
            providerId: 'provider-test-123',
        };

        it('should create a telemedicine session successfully', async () => {
            mockProvidersService.findById.mockResolvedValue(mockProvider);
            mockPrisma.appointment.findUnique.mockResolvedValue(mockAppointment);
            mockPrisma.telemedicineSession.create.mockResolvedValue(mockSession);
            mockPrisma.appointment.update.mockResolvedValue({
                ...mockAppointment,
                status: 'IN_PROGRESS',
            });
            mockKafkaService.produce.mockResolvedValue(undefined);

            const result = await service.startTelemedicineSession(createSessionDto as any);

            expect(result).toEqual(mockSession);
        });

        it('should throw AppException when provider does not offer telemedicine', async () => {
            mockProvidersService.findById.mockResolvedValue({
                ...mockProvider,
                telemedicineAvailable: false,
            });

            await expect(service.startTelemedicineSession(createSessionDto as any)).rejects.toThrow(
                AppException
            );
        });

        it('should throw AppException when appointment is not found', async () => {
            mockProvidersService.findById.mockResolvedValue(mockProvider);
            mockPrisma.appointment.findUnique.mockResolvedValue(null);

            await expect(service.startTelemedicineSession(createSessionDto as any)).rejects.toThrow(
                AppException
            );
        });

        it('should throw AppException when appointment is not of type TELEMEDICINE', async () => {
            mockProvidersService.findById.mockResolvedValue(mockProvider);
            mockPrisma.appointment.findUnique.mockResolvedValue({
                ...mockAppointment,
                type: 'IN_PERSON',
            });

            await expect(service.startTelemedicineSession(createSessionDto as any)).rejects.toThrow(
                AppException
            );
        });

        it('should throw AppException when appointment status is not SCHEDULED or CONFIRMED', async () => {
            mockProvidersService.findById.mockResolvedValue(mockProvider);
            mockPrisma.appointment.findUnique.mockResolvedValue({
                ...mockAppointment,
                status: 'COMPLETED',
            });

            await expect(service.startTelemedicineSession(createSessionDto as any)).rejects.toThrow(
                AppException
            );
        });

        it('should update appointment status to IN_PROGRESS after session creation', async () => {
            mockProvidersService.findById.mockResolvedValue(mockProvider);
            mockPrisma.appointment.findUnique.mockResolvedValue(mockAppointment);
            mockPrisma.telemedicineSession.create.mockResolvedValue(mockSession);
            mockPrisma.appointment.update.mockResolvedValue({
                ...mockAppointment,
                status: 'IN_PROGRESS',
            });
            mockKafkaService.produce.mockResolvedValue(undefined);

            await service.startTelemedicineSession(createSessionDto as any);

            expect(mockPrisma.appointment.update).toHaveBeenCalledWith({
                where: { id: mockAppointment.id },
                data: { status: 'IN_PROGRESS' },
            });
        });

        it('should publish Kafka event after session is started', async () => {
            mockProvidersService.findById.mockResolvedValue(mockProvider);
            mockPrisma.appointment.findUnique.mockResolvedValue(mockAppointment);
            mockPrisma.telemedicineSession.create.mockResolvedValue(mockSession);
            mockPrisma.appointment.update.mockResolvedValue(mockAppointment);
            mockKafkaService.produce.mockResolvedValue(undefined);

            await service.startTelemedicineSession(createSessionDto as any);

            expect(mockKafkaService.produce).toHaveBeenCalledWith(
                'care.telemedicine.started',
                expect.objectContaining({
                    sessionId: mockSession.id,
                    appointmentId: mockSession.appointmentId,
                    patientId: mockSession.patientId,
                }),
                mockSession.id
            );
        });

        it('should throw AppException when session creation fails', async () => {
            mockProvidersService.findById.mockResolvedValue(mockProvider);
            mockPrisma.appointment.findUnique.mockResolvedValue(mockAppointment);
            mockPrisma.telemedicineSession.create.mockRejectedValue(
                new Error('Database constraint violation')
            );

            await expect(service.startTelemedicineSession(createSessionDto as any)).rejects.toThrow(
                AppException
            );
        });
    });
});
