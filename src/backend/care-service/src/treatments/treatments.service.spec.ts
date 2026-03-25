/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { PrismaService } from '@app/shared/database/prisma.service';
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { TreatmentsService } from './treatments.service';

describe('TreatmentsService', () => {
    let service: TreatmentsService;

    const mockTreatmentPlan = {
        id: 'plan-test-123',
        name: 'Hypertension Management',
        description: 'Daily blood pressure monitoring and lifestyle changes',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        progress: 0,
        userId: 'user-test-123',
        careActivityId: 'activity-test-123',
        careActivity: { id: 'activity-test-123', name: 'Blood Pressure Check' },
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockPrismaService = {
        treatmentPlan: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    const mockLogger = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        setContext: jest.fn(),
    };

    const mockTracingService = {
        createSpan: jest.fn().mockImplementation((_name: string, fn: () => any) => fn()),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TreatmentsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: LoggerService,
                    useValue: mockLogger,
                },
                {
                    provide: TracingService,
                    useValue: mockTracingService,
                },
            ],
        }).compile();

        service = module.get<TreatmentsService>(TreatmentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ----------------------------------------------------------------
    // create
    // ----------------------------------------------------------------
    describe('create', () => {
        const userId = 'user-test-123';
        const createDto = {
            name: 'Hypertension Management',
            description: 'Daily blood pressure monitoring',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-06-30'),
            progress: 0,
            careActivityId: 'activity-test-123',
        };

        it('should create and return a new treatment plan', async () => {
            mockPrismaService.treatmentPlan.create.mockResolvedValue(mockTreatmentPlan);

            const result = await service.create(userId, createDto as any);

            expect(mockPrismaService.treatmentPlan.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        name: createDto.name,
                        description: createDto.description,
                    }),
                })
            );
            expect(result).toEqual(mockTreatmentPlan);
        });

        it('should set userId when userId is provided', async () => {
            mockPrismaService.treatmentPlan.create.mockResolvedValue(mockTreatmentPlan);

            await service.create(userId, createDto as any);

            expect(mockPrismaService.treatmentPlan.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        userId,
                    }),
                })
            );
        });

        it('should use 0 as default progress when not provided', async () => {
            const dtoWithoutProgress = { ...createDto, progress: undefined };
            mockPrismaService.treatmentPlan.create.mockResolvedValue(mockTreatmentPlan);

            await service.create(userId, dtoWithoutProgress as any);

            expect(mockPrismaService.treatmentPlan.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ progress: 0 }),
                })
            );
        });

        it('should propagate errors from prisma.treatmentPlan.create', async () => {
            mockPrismaService.treatmentPlan.create.mockRejectedValue(
                new Error('Database constraint violation')
            );

            await expect(service.create(userId, createDto as any)).rejects.toThrow();
        });
    });

    // ----------------------------------------------------------------
    // findAll
    // ----------------------------------------------------------------
    describe('findAll', () => {
        const userId = 'user-test-123';

        it('should return treatment plans for a user', async () => {
            const plans = [mockTreatmentPlan];
            mockPrismaService.treatmentPlan.findMany.mockResolvedValue(plans);

            const result = await service.findAll(userId, {});

            expect(mockPrismaService.treatmentPlan.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ userId }),
                })
            );
            expect(result).toEqual(plans);
        });

        it('should apply filter where conditions in addition to userId', async () => {
            mockPrismaService.treatmentPlan.findMany.mockResolvedValue([]);
            const filter = { where: { progress: 50 } };

            await service.findAll(userId, filter as any);

            expect(mockPrismaService.treatmentPlan.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ userId, progress: 50 }),
                })
            );
        });

        it('should return empty array when no plans match', async () => {
            mockPrismaService.treatmentPlan.findMany.mockResolvedValue([]);

            const result = await service.findAll('user-with-no-plans', {});

            expect(result).toEqual([]);
        });

        it('should propagate errors from prisma.treatmentPlan.findMany', async () => {
            mockPrismaService.treatmentPlan.findMany.mockRejectedValue(new Error('Query failed'));

            await expect(service.findAll(userId, {})).rejects.toThrow();
        });

        it('should pass default skip=0 and take=50 to prisma when no options provided', async () => {
            mockPrismaService.treatmentPlan.findMany.mockResolvedValue([]);

            await service.findAll(userId, {});

            expect(mockPrismaService.treatmentPlan.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ skip: 0, take: 50 })
            );
        });

        it('should pass provided skip and take to prisma', async () => {
            mockPrismaService.treatmentPlan.findMany.mockResolvedValue([]);

            await service.findAll(userId, {}, { skip: 20, take: 10 });

            expect(mockPrismaService.treatmentPlan.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ skip: 20, take: 10 })
            );
        });
    });

    // ----------------------------------------------------------------
    // findOne
    // ----------------------------------------------------------------
    describe('findOne', () => {
        it('should return treatment plan when found by id', async () => {
            mockPrismaService.treatmentPlan.findUnique.mockResolvedValue(mockTreatmentPlan);

            const result = await service.findOne('plan-test-123');

            expect(mockPrismaService.treatmentPlan.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 'plan-test-123' } })
            );
            expect(result).toEqual(mockTreatmentPlan);
        });

        it('should throw AppException when treatment plan is not found', async () => {
            mockPrismaService.treatmentPlan.findUnique.mockResolvedValue(null);

            await expect(service.findOne('nonexistent-id')).rejects.toThrow(AppException);
        });

        it('should re-throw database errors from findUnique', async () => {
            const dbError = new Error('Connection refused');
            mockPrismaService.treatmentPlan.findUnique.mockRejectedValue(dbError);

            await expect(service.findOne('plan-test-123')).rejects.toThrow('Connection refused');
        });

        it('should call findUnique with the correct id', async () => {
            mockPrismaService.treatmentPlan.findUnique.mockResolvedValue(mockTreatmentPlan);

            const result = await service.findOne('plan-test-123');

            expect(mockPrismaService.treatmentPlan.findUnique).toHaveBeenCalledWith({
                where: { id: 'plan-test-123' },
            });
            expect(result).toEqual(mockTreatmentPlan);
        });
    });

    // ----------------------------------------------------------------
    // update
    // ----------------------------------------------------------------
    describe('update', () => {
        const updateDto = { name: 'Updated Plan Name', progress: 50 };

        it('should update and return the treatment plan', async () => {
            const updatedPlan = { ...mockTreatmentPlan, ...updateDto };
            mockPrismaService.treatmentPlan.update.mockResolvedValue(updatedPlan);

            const result = await service.update('plan-test-123', updateDto as any);

            expect(mockPrismaService.treatmentPlan.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 'plan-test-123' },
                    data: expect.objectContaining({ name: 'Updated Plan Name', progress: 50 }),
                })
            );
            expect(result.name).toBe('Updated Plan Name');
        });

        it('should throw AppException when plan does not exist (Prisma P2025)', async () => {
            const prismaError = new Prisma.PrismaClientKnownRequestError(
                'Record to update not found.',
                { code: 'P2025', clientVersion: '7.0.0' }
            );
            mockPrismaService.treatmentPlan.update.mockRejectedValue(prismaError);

            await expect(service.update('nonexistent-id', updateDto as any)).rejects.toThrow(
                AppException
            );
        });

        it('should only update fields that are present in updateDto', async () => {
            const partialDto = { progress: 75 };
            mockPrismaService.treatmentPlan.update.mockResolvedValue({
                ...mockTreatmentPlan,
                progress: 75,
            });

            await service.update('plan-test-123', partialDto as any);

            const callData = mockPrismaService.treatmentPlan.update.mock.calls[0][0].data;
            expect(callData).toHaveProperty('progress', 75);
            expect(callData).not.toHaveProperty('name');
        });

        it('should update description, startDate, and endDate when provided', async () => {
            const fullDto = {
                description: 'Updated description',
                startDate: new Date('2024-02-01'),
                endDate: new Date('2024-12-31'),
            };
            mockPrismaService.treatmentPlan.update.mockResolvedValue({
                ...mockTreatmentPlan,
                ...fullDto,
            });

            await service.update('plan-test-123', fullDto as any);

            const callData = mockPrismaService.treatmentPlan.update.mock.calls[0][0].data;
            expect(callData).toHaveProperty('description', 'Updated description');
            expect(callData).toHaveProperty('startDate');
            expect(callData).toHaveProperty('endDate');
        });
    });

    // ----------------------------------------------------------------
    // remove
    // ----------------------------------------------------------------
    describe('remove', () => {
        it('should delete and return the treatment plan', async () => {
            mockPrismaService.treatmentPlan.delete.mockResolvedValue(mockTreatmentPlan);

            const result = await service.remove('plan-test-123');

            expect(mockPrismaService.treatmentPlan.delete).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 'plan-test-123' } })
            );
            expect(result).toEqual(mockTreatmentPlan);
        });

        it('should throw AppException when plan does not exist (Prisma P2025)', async () => {
            const prismaError = new Prisma.PrismaClientKnownRequestError(
                'Record to delete does not exist.',
                { code: 'P2025', clientVersion: '7.0.0' }
            );
            mockPrismaService.treatmentPlan.delete.mockRejectedValue(prismaError);

            await expect(service.remove('nonexistent-id')).rejects.toThrow(AppException);
        });

        it('should call delete with correct where clause', async () => {
            mockPrismaService.treatmentPlan.delete.mockResolvedValue(mockTreatmentPlan);

            await service.remove('plan-test-123');

            expect(mockPrismaService.treatmentPlan.delete).toHaveBeenCalledWith({
                where: { id: 'plan-test-123' },
            });
        });
    });
});
