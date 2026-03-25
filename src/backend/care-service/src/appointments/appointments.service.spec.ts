/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { AppointmentsService } from './appointments.service';
import { AppointmentStatus, AppointmentType } from './entities/appointment.entity';
import { AppException } from '../../../shared/src/exceptions/exceptions.types';

/**
 * Unit tests for AppointmentsService.
 *
 * Uses direct instantiation to avoid NestJS DI token resolution issues.
 */
describe('AppointmentsService', () => {
    let service: AppointmentsService;

    const mockAppointment = {
        id: 'appt-test-123',
        userId: 'user-test-123',
        providerId: 'provider-test-123',
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        type: AppointmentType.IN_PERSON,
        status: AppointmentStatus.SCHEDULED,
        reason: 'Annual checkup',
        notes: null,
        provider: { id: 'provider-test-123', name: 'Dr. Test', telemedicineAvailable: true },
        user: {
            id: 'user-test-123',
            name: 'Test User',
            email: 'test@example.com',
            phone: '+5511999990000',
        },
    };

    const mockPrisma = {
        appointment: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
        },
    };

    const mockProvidersService = {
        findById: jest.fn(),
        checkAvailability: jest.fn(),
    };

    const mockTelemedicineService = {
        startTelemedicineSession: jest.fn(),
    };

    const mockKafkaService = {
        produce: jest.fn(),
        emit: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        service = new AppointmentsService(
            mockPrisma as any,
            mockProvidersService as any,
            mockTelemedicineService as any,
            mockKafkaService as any
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ----------------------------------------------------------------
    // findById
    // ----------------------------------------------------------------
    describe('findById', () => {
        it('should return appointment when found by id', async () => {
            mockPrisma.appointment.findUnique.mockResolvedValue(mockAppointment);

            const result = await service.findById('appt-test-123');

            expect(mockPrisma.appointment.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 'appt-test-123' } })
            );
            expect(result).toEqual(mockAppointment);
        });

        it('should return null when appointment is not found', async () => {
            mockPrisma.appointment.findUnique.mockResolvedValue(null);

            const result = await service.findById('nonexistent-id');

            expect(result).toBeNull();
        });

        it('should throw AppException when database query fails', async () => {
            mockPrisma.appointment.findUnique.mockRejectedValue(new Error('DB error'));

            await expect(service.findById('appt-test-123')).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // findAll
    // ----------------------------------------------------------------
    describe('findAll', () => {
        it('should return paginated appointments', async () => {
            const appointments = [mockAppointment];
            mockPrisma.appointment.findMany.mockResolvedValue(appointments);
            mockPrisma.appointment.count.mockResolvedValue(1);

            const result = await service.findAll({ page: 1, limit: 10 });

            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('meta');
            expect(result.data).toEqual(appointments);
        });

        it('should apply where filter from filterDto', async () => {
            mockPrisma.appointment.findMany.mockResolvedValue([]);
            mockPrisma.appointment.count.mockResolvedValue(0);

            await service.findAll({ page: 1, limit: 10 }, { where: { userId: 'user-test-123' } });

            expect(mockPrisma.appointment.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ userId: 'user-test-123' }),
                })
            );
        });

        it('should compute correct pagination metadata', async () => {
            mockPrisma.appointment.findMany.mockResolvedValue([mockAppointment]);
            mockPrisma.appointment.count.mockResolvedValue(25);

            const result = await service.findAll({ page: 2, limit: 10 });

            expect(result.meta.page).toBe(2);
            expect(result.meta.total).toBe(25);
            expect(result.meta.totalPages).toBe(3);
        });

        it('should throw AppException when query fails', async () => {
            mockPrisma.appointment.findMany.mockRejectedValue(new Error('Connection error'));

            await expect(service.findAll()).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // create
    // ----------------------------------------------------------------
    describe('create', () => {
        const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

        const createDto = {
            userId: 'user-test-123',
            providerId: 'provider-test-123',
            dateTime: futureDate.toISOString(),
            type: AppointmentType.IN_PERSON,
            reason: 'Annual checkup',
        };

        it('should create an appointment when all validations pass', async () => {
            const mockProvider = {
                id: 'provider-test-123',
                name: 'Dr. Test',
                telemedicineAvailable: true,
            };
            mockProvidersService.findById.mockResolvedValue(mockProvider);
            mockProvidersService.checkAvailability.mockResolvedValue(true);
            mockPrisma.appointment.create.mockResolvedValue(mockAppointment);
            mockKafkaService.produce.mockResolvedValue(undefined);

            const result = await service.create(createDto as any);

            expect(result).toEqual(mockAppointment);
        });

        it('should throw AppException when appointment date is in the past', async () => {
            const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const dtoWithPastDate = { ...createDto, dateTime: pastDate.toISOString() };

            mockProvidersService.findById.mockResolvedValue({ id: 'provider-test-123' });

            await expect(service.create(dtoWithPastDate as any)).rejects.toThrow(AppException);
        });

        it('should throw AppException when provider is not available', async () => {
            mockProvidersService.findById.mockResolvedValue({
                id: 'provider-test-123',
                telemedicineAvailable: false,
            });
            mockProvidersService.checkAvailability.mockResolvedValue(false);

            await expect(service.create(createDto as any)).rejects.toThrow(AppException);
        });

        it('should throw AppException when telemedicine appointment with non-telemedicine provider', async () => {
            const telemedicineDto = { ...createDto, type: AppointmentType.TELEMEDICINE };
            mockProvidersService.findById.mockResolvedValue({
                id: 'provider-test-123',
                telemedicineAvailable: false,
            });
            mockProvidersService.checkAvailability.mockResolvedValue(true);

            await expect(service.create(telemedicineDto as any)).rejects.toThrow(AppException);
        });

        it('should publish Kafka event after successful creation', async () => {
            mockProvidersService.findById.mockResolvedValue({
                id: 'provider-test-123',
                telemedicineAvailable: true,
            });
            mockProvidersService.checkAvailability.mockResolvedValue(true);
            mockPrisma.appointment.create.mockResolvedValue(mockAppointment);
            mockKafkaService.produce.mockResolvedValue(undefined);

            await service.create(createDto as any);

            expect(mockKafkaService.produce).toHaveBeenCalledWith(
                'care.appointment.created',
                expect.objectContaining({ appointmentId: mockAppointment.id }),
                mockAppointment.id
            );
        });
    });

    // ----------------------------------------------------------------
    // update
    // ----------------------------------------------------------------
    describe('update', () => {
        it('should update appointment when it exists and is in valid state', async () => {
            mockPrisma.appointment.findUnique.mockResolvedValue(mockAppointment);
            const updatedAppointment = { ...mockAppointment, notes: 'Updated notes' };
            mockPrisma.appointment.update.mockResolvedValue(updatedAppointment);
            mockKafkaService.produce.mockResolvedValue(undefined);
            mockPrisma.appointment.count.mockResolvedValue(0);

            const result = await service.update('appt-test-123', { notes: 'Updated notes' } as any);

            expect(result.notes).toBe('Updated notes');
        });

        it('should throw AppException when appointment does not exist', async () => {
            mockPrisma.appointment.findUnique.mockResolvedValue(null);

            await expect(service.update('nonexistent', { notes: 'test' } as any)).rejects.toThrow(
                AppException
            );
        });

        it('should throw AppException when appointment is already completed', async () => {
            const completedAppointment = {
                ...mockAppointment,
                status: AppointmentStatus.COMPLETED,
            };
            mockPrisma.appointment.findUnique.mockResolvedValue(completedAppointment);

            await expect(service.update('appt-test-123', { notes: 'test' } as any)).rejects.toThrow(
                AppException
            );
        });

        it('should throw AppException when appointment is already cancelled', async () => {
            const cancelledAppointment = {
                ...mockAppointment,
                status: AppointmentStatus.CANCELLED,
            };
            mockPrisma.appointment.findUnique.mockResolvedValue(cancelledAppointment);

            await expect(service.update('appt-test-123', { notes: 'test' } as any)).rejects.toThrow(
                AppException
            );
        });
    });

    // ----------------------------------------------------------------
    // delete
    // ----------------------------------------------------------------
    describe('delete', () => {
        it('should cancel the appointment instead of deleting it', async () => {
            mockPrisma.appointment.findUnique.mockResolvedValue(mockAppointment);
            mockPrisma.appointment.update.mockResolvedValue({
                ...mockAppointment,
                status: AppointmentStatus.CANCELLED,
            });
            mockPrisma.appointment.count.mockResolvedValue(0);
            mockKafkaService.produce.mockResolvedValue(undefined);

            const result = await service.delete('appt-test-123');

            expect(result).toBe(true);
        });

        it('should throw AppException when appointment does not exist', async () => {
            mockPrisma.appointment.findUnique.mockResolvedValue(null);

            await expect(service.delete('nonexistent-id')).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // count
    // ----------------------------------------------------------------
    describe('count', () => {
        it('should return the count of matching appointments', async () => {
            mockPrisma.appointment.count.mockResolvedValue(5);

            const result = await service.count({ where: { userId: 'user-test-123' } });

            expect(result).toBe(5);
        });

        it('should throw AppException when count query fails', async () => {
            mockPrisma.appointment.count.mockRejectedValue(new Error('DB error'));

            await expect(service.count()).rejects.toThrow(AppException);
        });
    });
});
