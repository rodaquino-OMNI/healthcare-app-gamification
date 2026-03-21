import { PrismaService } from '@app/shared/database/prisma.service';
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { Test, TestingModule } from '@nestjs/testing';

import { PlansService } from './plans.service';

const mockPrismaService = {
    plan: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
    $transaction: jest.fn(),
};

const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};

const mockTracingService = {
    createSpan: jest.fn().mockImplementation((_name, fn) => fn()),
};

describe('PlansService', () => {
    let service: PlansService;

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlansService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: LoggerService, useValue: mockLoggerService },
                { provide: TracingService, useValue: mockTracingService },
            ],
        }).compile();

        service = module.get<PlansService>(PlansService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create and return a new plan', async () => {
            const planData = { name: 'Basic Plan', type: 'basic', userId: 'test-user-id' };
            const createdPlan = { id: 'test-plan-id', ...planData, createdAt: new Date() };

            mockPrismaService.plan.create.mockResolvedValue(createdPlan);

            const result = await service.create(planData);

            expect(result).toEqual(createdPlan);
            expect(mockPrismaService.plan.create).toHaveBeenCalledWith({ data: planData });
        });

        it('should throw AppException when creation fails', async () => {
            mockPrismaService.plan.create.mockRejectedValue(new Error('DB error'));

            await expect(service.create({ name: 'Plan' })).rejects.toBeInstanceOf(AppException);
        });
    });

    describe('findAll', () => {
        it('should return an array of plans with default pagination', async () => {
            const plans = [
                { id: 'plan-1', name: 'Plan A' },
                { id: 'plan-2', name: 'Plan B' },
            ];
            mockPrismaService.plan.findMany.mockResolvedValue(plans);

            const pagination = { limit: 10, page: 1 };
            const result = await service.findAll(pagination);

            expect(result).toEqual(plans);
            expect(mockPrismaService.plan.findMany).toHaveBeenCalled();
        });

        it('should apply filters when provided', async () => {
            const plans = [{ id: 'plan-1', name: 'Plan A', type: 'premium' }];
            mockPrismaService.plan.findMany.mockResolvedValue(plans);

            const pagination = { limit: 5, page: 1 };
            const filter = { where: { type: 'premium' } };
            const result = await service.findAll(pagination, filter as any);

            expect(result).toEqual(plans);
            expect(mockPrismaService.plan.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { type: 'premium' } })
            );
        });

        it('should apply orderBy when provided in filter', async () => {
            mockPrismaService.plan.findMany.mockResolvedValue([]);

            const pagination = { limit: 10, page: 1 };
            const filter = { orderBy: { name: 'asc' } };
            await service.findAll(pagination, filter as any);

            expect(mockPrismaService.plan.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ orderBy: { name: 'asc' } })
            );
        });

        it('should throw AppException when query fails', async () => {
            mockPrismaService.plan.findMany.mockRejectedValue(new Error('DB error'));

            await expect(service.findAll({ limit: 10 } as any)).rejects.toBeInstanceOf(
                AppException
            );
        });
    });

    describe('findOne', () => {
        it('should return a plan by id', async () => {
            const plan = { id: 'test-plan-id', name: 'Test Plan' };
            mockPrismaService.plan.findUnique.mockResolvedValue(plan);

            const result = await service.findOne('test-plan-id');

            expect(result).toEqual(plan);
            expect(mockPrismaService.plan.findUnique).toHaveBeenCalledWith({
                where: { id: 'test-plan-id' },
            });
        });

        it('should throw AppException with PLAN_NOT_FOUND when plan does not exist', async () => {
            mockPrismaService.plan.findUnique.mockResolvedValue(null);

            await expect(service.findOne('non-existent-id')).rejects.toBeInstanceOf(AppException);
        });

        it('should re-throw AppException from inner calls', async () => {
            const appException = new AppException(
                'Not found',
                'BUSINESS' as any,
                'PLAN_NOT_FOUND',
                {}
            );
            mockPrismaService.plan.findUnique.mockRejectedValue(appException);

            await expect(service.findOne('test-id')).rejects.toBeInstanceOf(AppException);
        });

        it('should throw AppException on DB errors', async () => {
            mockPrismaService.plan.findUnique.mockRejectedValue(new Error('Connection lost'));

            await expect(service.findOne('test-id')).rejects.toBeInstanceOf(AppException);
        });
    });

    describe('update', () => {
        it('should update and return the plan', async () => {
            const existingPlan = { id: 'test-plan-id', name: 'Old Name' };
            const updatedPlan = { id: 'test-plan-id', name: 'New Name' };

            mockPrismaService.plan.findUnique.mockResolvedValue(existingPlan);
            mockPrismaService.plan.update.mockResolvedValue(updatedPlan);

            const result = await service.update('test-plan-id', { name: 'New Name' });

            expect(result).toEqual(updatedPlan);
            expect(mockPrismaService.plan.update).toHaveBeenCalledWith({
                where: { id: 'test-plan-id' },
                data: { name: 'New Name' },
            });
        });

        it('should throw AppException when plan not found for update', async () => {
            mockPrismaService.plan.findUnique.mockResolvedValue(null);

            await expect(service.update('non-existent-id', { name: 'New' })).rejects.toBeInstanceOf(
                AppException
            );
        });

        it('should throw AppException on DB update error', async () => {
            const existingPlan = { id: 'test-plan-id', name: 'Old Name' };
            mockPrismaService.plan.findUnique.mockResolvedValue(existingPlan);
            mockPrismaService.plan.update.mockRejectedValue(new Error('Update failed'));

            await expect(service.update('test-plan-id', { name: 'New' })).rejects.toBeInstanceOf(
                AppException
            );
        });
    });

    describe('remove', () => {
        it('should delete a plan successfully', async () => {
            const existingPlan = { id: 'test-plan-id', name: 'Plan to delete' };
            mockPrismaService.plan.findUnique.mockResolvedValue(existingPlan);
            mockPrismaService.plan.delete.mockResolvedValue(existingPlan);

            await expect(service.remove('test-plan-id')).resolves.toBeUndefined();
            expect(mockPrismaService.plan.delete).toHaveBeenCalledWith({
                where: { id: 'test-plan-id' },
            });
        });

        it('should throw AppException when plan not found for removal', async () => {
            mockPrismaService.plan.findUnique.mockResolvedValue(null);

            await expect(service.remove('non-existent-id')).rejects.toBeInstanceOf(AppException);
        });

        it('should throw AppException on DB delete error', async () => {
            const existingPlan = { id: 'test-plan-id', name: 'Plan' };
            mockPrismaService.plan.findUnique.mockResolvedValue(existingPlan);
            mockPrismaService.plan.delete.mockRejectedValue(new Error('Delete failed'));

            await expect(service.remove('test-plan-id')).rejects.toBeInstanceOf(AppException);
        });
    });

    describe('verifyCoverage', () => {
        it('should return true when procedure is directly covered', async () => {
            const plan = {
                id: 'plan-id',
                coverageDetails: {
                    procedures: {
                        '99213': { covered: true, percentage: 80 },
                    },
                },
            };
            mockPrismaService.plan.findUnique.mockResolvedValue(plan);

            const result = await service.verifyCoverage('plan-id', '99213');

            expect(result).toBe(true);
        });

        it('should return false when plan has no coverage details', async () => {
            const plan = { id: 'plan-id', coverageDetails: null };
            mockPrismaService.plan.findUnique.mockResolvedValue(plan);

            const result = await service.verifyCoverage('plan-id', '99213');

            expect(result).toBe(false);
        });

        it('should return true when procedure category is covered', async () => {
            const plan = {
                id: 'plan-id',
                coverageDetails: {
                    categories: {
                        '992': { covered: true, percentage: 70 },
                    },
                },
            };
            mockPrismaService.plan.findUnique.mockResolvedValue(plan);

            const result = await service.verifyCoverage('plan-id', '99213');

            expect(result).toBe(true);
        });

        it('should return false when procedure is not covered', async () => {
            const plan = {
                id: 'plan-id',
                coverageDetails: {
                    procedures: {
                        '99213': { covered: false },
                    },
                },
            };
            mockPrismaService.plan.findUnique.mockResolvedValue(plan);

            const result = await service.verifyCoverage('plan-id', '99213');

            expect(result).toBe(false);
        });

        it('should throw AppException when plan not found', async () => {
            mockPrismaService.plan.findUnique.mockResolvedValue(null);

            await expect(service.verifyCoverage('non-existent', '99213')).rejects.toBeInstanceOf(
                AppException
            );
        });
    });

    describe('calculateCoverage', () => {
        it('should calculate covered amount and copay correctly', async () => {
            const plan = {
                id: 'plan-id',
                coverageDetails: {
                    procedures: {
                        '99213': { covered: true, percentage: 80 },
                    },
                },
            };
            mockPrismaService.plan.findUnique.mockResolvedValue(plan);

            const result = await service.calculateCoverage('plan-id', '99213', 200);

            expect(result.covered).toBe(true);
            expect(result.coverageAmount).toBe(160);
            expect(result.copayAmount).toBe(40);
        });

        it('should return default result when coverage details are null', async () => {
            const plan = { id: 'plan-id', coverageDetails: null };
            mockPrismaService.plan.findUnique.mockResolvedValue(plan);

            const result = await service.calculateCoverage('plan-id', '99213', 200);

            expect(result.covered).toBe(false);
            expect(result.coverageAmount).toBe(0);
            expect(result.copayAmount).toBe(200);
        });

        it('should throw AppException when plan not found', async () => {
            mockPrismaService.plan.findUnique.mockResolvedValue(null);

            await expect(
                service.calculateCoverage('non-existent', '99213', 100)
            ).rejects.toBeInstanceOf(AppException);
        });
    });
});
