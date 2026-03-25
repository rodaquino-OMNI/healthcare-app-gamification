/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { AppointmentsSchedulingService } from './appointments-scheduling.service';
import { AppointmentsService } from './appointments.service';
import { AppointmentStatus, AppointmentType } from './entities/appointment.entity';
import { AppException, ErrorType } from '../../../shared/src/exceptions/exceptions.types';

/**
 * Unit tests for AppointmentsService (facade).
 *
 * The facade delegates every call to AppointmentsSchedulingService.
 * These tests verify correct delegation and that return values / errors
 * propagate unchanged.
 */
describe('AppointmentsService', () => {
    let service: AppointmentsService;
    let mockSchedulingService: Record<string, jest.Mock>;

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

    beforeEach(() => {
        jest.clearAllMocks();
        mockSchedulingService = {
            findById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
            completeAppointment: jest.fn(),
            getUpcomingAppointments: jest.fn(),
            getPastAppointments: jest.fn(),
            confirmAppointment: jest.fn(),
            startTelemedicineSession: jest.fn(),
            checkUserAppointmentConflict: jest.fn(),
            getProviderAppointments: jest.fn(),
            getProviderTodayAppointments: jest.fn(),
        };
        service = new AppointmentsService(
            mockSchedulingService as unknown as AppointmentsSchedulingService
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ----------------------------------------------------------------
    // findById
    // ----------------------------------------------------------------
    describe('findById', () => {
        it('should delegate to schedulingService.findById and return appointment', async () => {
            mockSchedulingService.findById.mockResolvedValue(mockAppointment);

            const result = await service.findById('appt-test-123');

            expect(mockSchedulingService.findById).toHaveBeenCalledWith('appt-test-123');
            expect(result).toEqual(mockAppointment);
        });

        it('should return null when scheduling service returns null', async () => {
            mockSchedulingService.findById.mockResolvedValue(null);

            const result = await service.findById('nonexistent-id');

            expect(result).toBeNull();
        });

        it('should propagate AppException from scheduling service', async () => {
            mockSchedulingService.findById.mockRejectedValue(
                new AppException('Failed to retrieve', ErrorType.TECHNICAL, 'CARE_101', {})
            );

            await expect(service.findById('appt-test-123')).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // findAll
    // ----------------------------------------------------------------
    describe('findAll', () => {
        it('should delegate to schedulingService.findAll and return paginated result', async () => {
            const paginatedResult = {
                data: [mockAppointment],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                    offset: 0,
                    hasNext: false,
                    hasPrev: false,
                },
            };
            mockSchedulingService.findAll.mockResolvedValue(paginatedResult);

            const result = await service.findAll(undefined, { page: 1, limit: 10 });

            expect(mockSchedulingService.findAll).toHaveBeenCalledWith(undefined, {
                page: 1,
                limit: 10,
            });
            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('meta');
            expect(result.data).toEqual([mockAppointment]);
        });

        it('should pass filter to scheduling service', async () => {
            const paginatedResult = {
                data: [],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                    offset: 0,
                    hasNext: false,
                    hasPrev: false,
                },
            };
            mockSchedulingService.findAll.mockResolvedValue(paginatedResult);
            const filter = { where: { userId: 'user-test-123' } };

            await service.findAll(filter, { page: 1, limit: 10 });

            expect(mockSchedulingService.findAll).toHaveBeenCalledWith(filter, {
                page: 1,
                limit: 10,
            });
        });

        it('should return correct pagination metadata from scheduling service', async () => {
            const paginatedResult = {
                data: [mockAppointment],
                meta: {
                    page: 2,
                    limit: 10,
                    total: 25,
                    totalPages: 3,
                    offset: 10,
                    hasNext: true,
                    hasPrev: true,
                },
            };
            mockSchedulingService.findAll.mockResolvedValue(paginatedResult);

            const result = await service.findAll(undefined, { page: 2, limit: 10 });

            expect(result.meta.page).toBe(2);
            expect(result.meta.total).toBe(25);
            expect(result.meta.totalPages).toBe(3);
        });

        it('should propagate AppException from scheduling service', async () => {
            mockSchedulingService.findAll.mockRejectedValue(
                new AppException('Failed to retrieve', ErrorType.TECHNICAL, 'CARE_102', {})
            );

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

        it('should delegate to schedulingService.create and return created appointment', async () => {
            mockSchedulingService.create.mockResolvedValue(mockAppointment);

            const result = await service.create(createDto as any);

            expect(mockSchedulingService.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(mockAppointment);
        });

        it('should propagate AppException for past date from scheduling service', async () => {
            mockSchedulingService.create.mockRejectedValue(
                new AppException('Cannot book in the past', ErrorType.BUSINESS, 'CARE_103', {})
            );
            const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const dtoWithPastDate = { ...createDto, dateTime: pastDate.toISOString() };

            await expect(service.create(dtoWithPastDate as any)).rejects.toThrow(AppException);
        });

        it('should propagate AppException for unavailable provider from scheduling service', async () => {
            mockSchedulingService.create.mockRejectedValue(
                new AppException('Provider not available', ErrorType.BUSINESS, 'CARE_105', {})
            );

            await expect(service.create(createDto as any)).rejects.toThrow(AppException);
        });

        it('should propagate AppException for telemedicine with non-telemedicine provider', async () => {
            const telemedicineDto = { ...createDto, type: AppointmentType.TELEMEDICINE };
            mockSchedulingService.create.mockRejectedValue(
                new AppException(
                    'Provider does not offer telemedicine',
                    ErrorType.BUSINESS,
                    'CARE_106',
                    {}
                )
            );

            await expect(service.create(telemedicineDto as any)).rejects.toThrow(AppException);
        });

        it('should delegate creation including Kafka publishing to scheduling service', async () => {
            mockSchedulingService.create.mockResolvedValue(mockAppointment);

            await service.create(createDto as any);

            expect(mockSchedulingService.create).toHaveBeenCalledTimes(1);
            expect(mockSchedulingService.create).toHaveBeenCalledWith(createDto);
        });
    });

    // ----------------------------------------------------------------
    // update
    // ----------------------------------------------------------------
    describe('update', () => {
        it('should delegate to schedulingService.update and return updated appointment', async () => {
            const updatedAppointment = { ...mockAppointment, notes: 'Updated notes' };
            mockSchedulingService.update.mockResolvedValue(updatedAppointment);

            const result = await service.update('appt-test-123', { notes: 'Updated notes' } as any);

            expect(mockSchedulingService.update).toHaveBeenCalledWith('appt-test-123', {
                notes: 'Updated notes',
            });
            expect(result.notes).toBe('Updated notes');
        });

        it('should propagate AppException when appointment does not exist', async () => {
            mockSchedulingService.update.mockRejectedValue(
                new AppException('Appointment not found', ErrorType.BUSINESS, 'CARE_108', {})
            );

            await expect(service.update('nonexistent', { notes: 'test' } as any)).rejects.toThrow(
                AppException
            );
        });

        it('should propagate AppException when appointment is already completed', async () => {
            mockSchedulingService.update.mockRejectedValue(
                new AppException(
                    'Cannot update a completed appointment',
                    ErrorType.BUSINESS,
                    'CARE_109',
                    {}
                )
            );

            await expect(service.update('appt-test-123', { notes: 'test' } as any)).rejects.toThrow(
                AppException
            );
        });

        it('should propagate AppException when appointment is already cancelled', async () => {
            mockSchedulingService.update.mockRejectedValue(
                new AppException(
                    'Cannot update a cancelled appointment',
                    ErrorType.BUSINESS,
                    'CARE_109',
                    {}
                )
            );

            await expect(service.update('appt-test-123', { notes: 'test' } as any)).rejects.toThrow(
                AppException
            );
        });
    });

    // ----------------------------------------------------------------
    // delete
    // ----------------------------------------------------------------
    describe('delete', () => {
        it('should delegate to schedulingService.delete and return true', async () => {
            mockSchedulingService.delete.mockResolvedValue(true);

            const result = await service.delete('appt-test-123');

            expect(mockSchedulingService.delete).toHaveBeenCalledWith('appt-test-123');
            expect(result).toBe(true);
        });

        it('should propagate AppException when appointment does not exist', async () => {
            mockSchedulingService.delete.mockRejectedValue(
                new AppException('Appointment not found', ErrorType.BUSINESS, 'CARE_115', {})
            );

            await expect(service.delete('nonexistent-id')).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // count
    // ----------------------------------------------------------------
    describe('count', () => {
        it('should delegate to schedulingService.count and return the count', async () => {
            mockSchedulingService.count.mockResolvedValue(5);

            const result = await service.count({ where: { userId: 'user-test-123' } });

            expect(mockSchedulingService.count).toHaveBeenCalledWith({
                where: { userId: 'user-test-123' },
            });
            expect(result).toBe(5);
        });

        it('should propagate AppException when count query fails', async () => {
            mockSchedulingService.count.mockRejectedValue(
                new AppException('Failed to count', ErrorType.TECHNICAL, 'CARE_117', {})
            );

            await expect(service.count()).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // completeAppointment
    // ----------------------------------------------------------------
    describe('completeAppointment', () => {
        it('should delegate to schedulingService.completeAppointment', async () => {
            const completed = { ...mockAppointment, status: AppointmentStatus.COMPLETED };
            mockSchedulingService.completeAppointment.mockResolvedValue(completed);

            const result = await service.completeAppointment('appt-test-123');

            expect(mockSchedulingService.completeAppointment).toHaveBeenCalledWith('appt-test-123');
            expect(result.status).toBe(AppointmentStatus.COMPLETED);
        });
    });

    // ----------------------------------------------------------------
    // getUpcomingAppointments
    // ----------------------------------------------------------------
    describe('getUpcomingAppointments', () => {
        it('should delegate to schedulingService.getUpcomingAppointments', async () => {
            const paginatedResult = {
                data: [mockAppointment],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                    offset: 0,
                    hasNext: false,
                    hasPrev: false,
                },
            };
            mockSchedulingService.getUpcomingAppointments.mockResolvedValue(paginatedResult);

            const result = await service.getUpcomingAppointments('user-test-123', {
                page: 1,
                limit: 10,
            });

            expect(mockSchedulingService.getUpcomingAppointments).toHaveBeenCalledWith(
                'user-test-123',
                { page: 1, limit: 10 }
            );
            expect(result.data).toEqual([mockAppointment]);
        });
    });

    // ----------------------------------------------------------------
    // getPastAppointments
    // ----------------------------------------------------------------
    describe('getPastAppointments', () => {
        it('should delegate to schedulingService.getPastAppointments', async () => {
            const paginatedResult = {
                data: [mockAppointment],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                    offset: 0,
                    hasNext: false,
                    hasPrev: false,
                },
            };
            mockSchedulingService.getPastAppointments.mockResolvedValue(paginatedResult);

            const result = await service.getPastAppointments('user-test-123', {
                page: 1,
                limit: 10,
            });

            expect(mockSchedulingService.getPastAppointments).toHaveBeenCalledWith(
                'user-test-123',
                { page: 1, limit: 10 }
            );
            expect(result.data).toEqual([mockAppointment]);
        });
    });

    // ----------------------------------------------------------------
    // confirmAppointment
    // ----------------------------------------------------------------
    describe('confirmAppointment', () => {
        it('should delegate to schedulingService.confirmAppointment', async () => {
            mockSchedulingService.confirmAppointment.mockResolvedValue(mockAppointment);

            const result = await service.confirmAppointment('appt-test-123');

            expect(mockSchedulingService.confirmAppointment).toHaveBeenCalledWith('appt-test-123');
            expect(result).toEqual(mockAppointment);
        });
    });

    // ----------------------------------------------------------------
    // startTelemedicineSession
    // ----------------------------------------------------------------
    describe('startTelemedicineSession', () => {
        it('should delegate to schedulingService.startTelemedicineSession', async () => {
            const mockSession = {
                id: 'session-1',
                appointmentId: 'appt-test-123',
                userId: 'user-test-123',
            };
            mockSchedulingService.startTelemedicineSession.mockResolvedValue(mockSession);

            const result = await service.startTelemedicineSession('appt-test-123', 'user-test-123');

            expect(mockSchedulingService.startTelemedicineSession).toHaveBeenCalledWith(
                'appt-test-123',
                'user-test-123'
            );
            expect(result).toEqual(mockSession);
        });
    });

    // ----------------------------------------------------------------
    // checkUserAppointmentConflict
    // ----------------------------------------------------------------
    describe('checkUserAppointmentConflict', () => {
        it('should delegate to schedulingService.checkUserAppointmentConflict', async () => {
            mockSchedulingService.checkUserAppointmentConflict.mockResolvedValue(true);
            const dateTime = new Date();

            const result = await service.checkUserAppointmentConflict('user-test-123', dateTime);

            expect(mockSchedulingService.checkUserAppointmentConflict).toHaveBeenCalledWith(
                'user-test-123',
                dateTime
            );
            expect(result).toBe(true);
        });
    });

    // ----------------------------------------------------------------
    // getProviderAppointments
    // ----------------------------------------------------------------
    describe('getProviderAppointments', () => {
        it('should delegate to schedulingService.getProviderAppointments', async () => {
            const paginatedResult = {
                data: [mockAppointment],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                    offset: 0,
                    hasNext: false,
                    hasPrev: false,
                },
            };
            mockSchedulingService.getProviderAppointments.mockResolvedValue(paginatedResult);

            const result = await service.getProviderAppointments('provider-test-123', {
                page: 1,
                limit: 10,
            });

            expect(mockSchedulingService.getProviderAppointments).toHaveBeenCalledWith(
                'provider-test-123',
                { page: 1, limit: 10 },
                undefined
            );
            expect(result.data).toEqual([mockAppointment]);
        });
    });

    // ----------------------------------------------------------------
    // getProviderTodayAppointments
    // ----------------------------------------------------------------
    describe('getProviderTodayAppointments', () => {
        it('should delegate to schedulingService.getProviderTodayAppointments', async () => {
            mockSchedulingService.getProviderTodayAppointments.mockResolvedValue([mockAppointment]);

            const result = await service.getProviderTodayAppointments('provider-test-123');

            expect(mockSchedulingService.getProviderTodayAppointments).toHaveBeenCalledWith(
                'provider-test-123'
            );
            expect(result).toEqual([mockAppointment]);
        });
    });
});
