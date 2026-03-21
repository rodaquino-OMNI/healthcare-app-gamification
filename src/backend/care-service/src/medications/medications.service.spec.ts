/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { AppException } from '@app/shared/exceptions/exceptions.types';

import { CreateMedicationDto } from './dto/create-medication.dto';
import { Medication } from './entities/medication.entity';
import { MedicationsService } from './medications.service';

/**
 * Unit tests for MedicationsService.
 *
 * Uses direct instantiation to avoid NestJS DI token resolution issues
 * with the `Configuration` type imported from registerAs.
 */
describe('MedicationsService', () => {
    let service: MedicationsService;

    const mockMedication: Medication = {
        id: 'med-1',
        userId: 'user-1',
        name: 'Amoxicillin',
        dosage: 500,
        frequency: 'Three times daily',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-15'),
        reminderEnabled: true,
        notes: 'Take with food',
        active: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    const mockCreateDto: CreateMedicationDto = {
        name: 'Amoxicillin',
        dosage: 500,
        frequency: 'Three times daily',
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        reminderEnabled: true,
        notes: 'Take with food',
    };

    const mockPrisma = {
        medication: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    const mockLogger = {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    };

    const mockKafka = {
        produce: jest.fn(),
        emit: jest.fn(),
    };

    const mockConfig = {
        gamification: {
            enabled: false,
            defaultEvents: {
                medicationAdherence: 'medication.adherence',
            },
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        service = new MedicationsService(
            mockPrisma as any,
            mockLogger as any,
            mockKafka as any,
            mockConfig as any
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ----------------------------------------------------------------
    // create
    // ----------------------------------------------------------------
    describe('create', () => {
        it('should create and return a new medication record', async () => {
            mockPrisma.medication.create.mockResolvedValue(mockMedication);

            const result = await service.create(mockCreateDto, 'user-1');

            expect(mockPrisma.medication.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    name: 'Amoxicillin',
                    dosage: 500,
                    userId: 'user-1',
                    startDate: expect.any(Date),
                }),
            });
            expect(result).toEqual(mockMedication);
        });

        it('should convert startDate string to a Date object', async () => {
            mockPrisma.medication.create.mockResolvedValue(mockMedication);

            await service.create(mockCreateDto, 'user-1');

            const callArg = mockPrisma.medication.create.mock.calls[0][0];
            expect(callArg.data.startDate).toBeInstanceOf(Date);
        });

        it('should convert endDate string to a Date object when provided', async () => {
            mockPrisma.medication.create.mockResolvedValue(mockMedication);

            await service.create({ ...mockCreateDto, endDate: '2024-01-15' }, 'user-1');

            const callArg = mockPrisma.medication.create.mock.calls[0][0];
            expect(callArg.data.endDate).toBeInstanceOf(Date);
        });

        it('should set endDate to null when not provided', async () => {
            const dtoWithoutEndDate: CreateMedicationDto = {
                ...mockCreateDto,
                endDate: undefined,
            };
            mockPrisma.medication.create.mockResolvedValue({
                ...mockMedication,
                endDate: null,
            });

            const result = await service.create(dtoWithoutEndDate, 'user-1');

            expect(result).toBeDefined();
        });

        it('should publish a Kafka event when gamification is enabled', async () => {
            const serviceWithGamification = new MedicationsService(
                mockPrisma as any,
                mockLogger as any,
                mockKafka as any,
                {
                    gamification: {
                        enabled: true,
                        defaultEvents: { medicationAdherence: 'medication.adherence' },
                    },
                } as any
            );
            mockPrisma.medication.create.mockResolvedValue(mockMedication);
            mockKafka.produce.mockResolvedValue(undefined);

            await serviceWithGamification.create(mockCreateDto, 'user-1');

            expect(mockKafka.produce).toHaveBeenCalledWith(
                'medication.adherence',
                expect.objectContaining({
                    eventType: 'MEDICATION_CREATED',
                    userId: 'user-1',
                    medicationId: 'med-1',
                })
            );
        });

        it('should not publish Kafka event when gamification is disabled', async () => {
            mockPrisma.medication.create.mockResolvedValue(mockMedication);

            await service.create(mockCreateDto, 'user-1');

            expect(mockKafka.produce).not.toHaveBeenCalled();
        });

        it('should throw AppException when creation fails', async () => {
            mockPrisma.medication.create.mockRejectedValue(
                new Error('Database constraint violation')
            );

            await expect(service.create(mockCreateDto, 'user-1')).rejects.toThrow(AppException);
        });

        it('should log successful medication creation', async () => {
            mockPrisma.medication.create.mockResolvedValue(mockMedication);

            await service.create(mockCreateDto, 'user-1');

            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.stringContaining('med-1'),
                'MedicationsService'
            );
        });
    });

    // ----------------------------------------------------------------
    // findAll
    // ----------------------------------------------------------------
    describe('findAll', () => {
        it('should return a list of medications', async () => {
            const mockMedications = [mockMedication];
            mockPrisma.medication.findMany.mockResolvedValue(mockMedications);

            const result = await service.findAll({}, { page: 1, limit: 10 });

            expect(mockPrisma.medication.findMany).toHaveBeenCalled();
            expect(result).toEqual(mockMedications);
        });

        it('should apply filter where conditions', async () => {
            mockPrisma.medication.findMany.mockResolvedValue([mockMedication]);

            await service.findAll({ where: { userId: 'user-1' } }, { page: 1, limit: 10 });

            expect(mockPrisma.medication.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ userId: 'user-1' }),
                })
            );
        });

        it('should apply pagination offset correctly (page 3, limit 5 = skip 10)', async () => {
            mockPrisma.medication.findMany.mockResolvedValue([]);

            await service.findAll({}, { page: 3, limit: 5 });

            expect(mockPrisma.medication.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ skip: 10, take: 5 })
            );
        });

        it('should use default orderBy (createdAt desc) when not specified', async () => {
            mockPrisma.medication.findMany.mockResolvedValue([]);

            await service.findAll({}, { page: 1, limit: 10 });

            expect(mockPrisma.medication.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ orderBy: { createdAt: 'desc' } })
            );
        });

        it('should return empty array when no medications match the filter', async () => {
            mockPrisma.medication.findMany.mockResolvedValue([]);

            const result = await service.findAll({ where: { userId: 'user-with-none' } }, {});

            expect(result).toEqual([]);
        });

        it('should throw AppException when query fails', async () => {
            mockPrisma.medication.findMany.mockRejectedValue(new Error('Database error'));

            await expect(service.findAll({}, {})).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // findOne
    // ----------------------------------------------------------------
    describe('findOne', () => {
        it('should return a medication when found by ID', async () => {
            mockPrisma.medication.findUnique.mockResolvedValue(mockMedication);

            const result = await service.findOne('med-1');

            expect(mockPrisma.medication.findUnique).toHaveBeenCalledWith({
                where: { id: 'med-1' },
            });
            expect(result).toEqual(mockMedication);
        });

        it('should throw AppException when medication is not found', async () => {
            mockPrisma.medication.findUnique.mockResolvedValue(null);

            await expect(service.findOne('nonexistent-id')).rejects.toThrow(AppException);
        });

        it('should throw AppException when database lookup fails', async () => {
            mockPrisma.medication.findUnique.mockRejectedValue(new Error('Query failed'));

            await expect(service.findOne('med-1')).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // update
    // ----------------------------------------------------------------
    describe('update', () => {
        it('should update and return the modified medication', async () => {
            const updatedMedication = { ...mockMedication, dosage: 250, frequency: 'Twice daily' };
            mockPrisma.medication.findUnique.mockResolvedValue(mockMedication);
            mockPrisma.medication.update.mockResolvedValue(updatedMedication);

            const result = await service.update('med-1', { dosage: 250, frequency: 'Twice daily' });

            expect(mockPrisma.medication.update).toHaveBeenCalledWith({
                where: { id: 'med-1' },
                data: expect.objectContaining({ dosage: 250, frequency: 'Twice daily' }),
            });
            expect(result.dosage).toBe(250);
            expect(result.frequency).toBe('Twice daily');
        });

        it('should convert startDate string to Date when present in update payload', async () => {
            const updatedMedication = { ...mockMedication, startDate: new Date('2024-02-01') };
            mockPrisma.medication.findUnique.mockResolvedValue(mockMedication);
            mockPrisma.medication.update.mockResolvedValue(updatedMedication);

            await service.update('med-1', { startDate: '2024-02-01' });

            const callArg = mockPrisma.medication.update.mock.calls[0][0];
            expect(callArg.data.startDate).toBeInstanceOf(Date);
        });

        it('should convert endDate string to Date when present in update payload', async () => {
            const updatedMedication = { ...mockMedication, endDate: new Date('2024-03-01') };
            mockPrisma.medication.findUnique.mockResolvedValue(mockMedication);
            mockPrisma.medication.update.mockResolvedValue(updatedMedication);

            await service.update('med-1', { endDate: '2024-03-01' });

            const callArg = mockPrisma.medication.update.mock.calls[0][0];
            expect(callArg.data.endDate).toBeInstanceOf(Date);
        });

        it('should throw AppException when medication does not exist', async () => {
            mockPrisma.medication.findUnique.mockResolvedValue(null);

            await expect(service.update('nonexistent-id', { dosage: 100 })).rejects.toThrow(
                AppException
            );
        });

        it('should throw AppException when update query fails', async () => {
            mockPrisma.medication.findUnique.mockResolvedValue(mockMedication);
            mockPrisma.medication.update.mockRejectedValue(new Error('Update failed'));

            await expect(service.update('med-1', { dosage: 100 })).rejects.toThrow(AppException);
        });

        it('should log update success', async () => {
            mockPrisma.medication.findUnique.mockResolvedValue(mockMedication);
            mockPrisma.medication.update.mockResolvedValue(mockMedication);

            await service.update('med-1', { notes: 'Updated notes' });

            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.stringContaining('med-1'),
                'MedicationsService'
            );
        });
    });

    // ----------------------------------------------------------------
    // remove
    // ----------------------------------------------------------------
    describe('remove', () => {
        it('should delete a medication and resolve with void', async () => {
            mockPrisma.medication.findUnique.mockResolvedValue(mockMedication);
            mockPrisma.medication.delete.mockResolvedValue(mockMedication);

            await expect(service.remove('med-1')).resolves.toBeUndefined();

            expect(mockPrisma.medication.delete).toHaveBeenCalledWith({
                where: { id: 'med-1' },
            });
        });

        it('should verify existence before attempting deletion', async () => {
            mockPrisma.medication.findUnique.mockResolvedValue(mockMedication);
            mockPrisma.medication.delete.mockResolvedValue(mockMedication);

            await service.remove('med-1');

            expect(mockPrisma.medication.findUnique).toHaveBeenCalledWith({
                where: { id: 'med-1' },
            });
        });

        it('should throw AppException when medication does not exist', async () => {
            mockPrisma.medication.findUnique.mockResolvedValue(null);

            await expect(service.remove('nonexistent-id')).rejects.toThrow(AppException);
        });

        it('should throw AppException when delete query fails', async () => {
            mockPrisma.medication.findUnique.mockResolvedValue(mockMedication);
            mockPrisma.medication.delete.mockRejectedValue(
                new Error('Delete failed due to foreign key constraint')
            );

            await expect(service.remove('med-1')).rejects.toThrow(AppException);
        });

        it('should log deletion success', async () => {
            mockPrisma.medication.findUnique.mockResolvedValue(mockMedication);
            mockPrisma.medication.delete.mockResolvedValue(mockMedication);

            await service.remove('med-1');

            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.stringContaining('med-1'),
                'MedicationsService'
            );
        });
    });
});
