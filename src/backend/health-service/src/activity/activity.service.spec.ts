/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ActivityService } from './activity.service';
import { ActivityType } from './dto/create-activity-record.dto';
import { FilterActivityDto } from './dto/filter-activity.dto';
import { MetricSource, MetricType } from '../health/types/health.types';

describe('ActivityService', () => {
    let service: ActivityService;

    const mockPrismaService = {
        healthMetric: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
        },
    };

    const mockRedisService = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    };

    const userId = 'user-test-abc';

    beforeEach(async () => {
        jest.clearAllMocks();
        mockRedisService.get.mockResolvedValue(null);
        mockRedisService.set.mockResolvedValue(undefined);
        mockRedisService.del.mockResolvedValue(undefined);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ActivityService,
                {
                    provide: 'PrismaService',
                    useValue: mockPrismaService,
                },
                {
                    provide: 'RedisService',
                    useValue: mockRedisService,
                },
            ],
        })
            .overrideProvider(ActivityService)
            .useFactory({
                factory: () =>
                    new ActivityService(mockPrismaService as any, mockRedisService as any),
            })
            .compile();

        service = module.get<ActivityService>(ActivityService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createActivityRecord', () => {
        const createDto = {
            type: ActivityType.STEPS,
            value: 5000,
            unit: 'steps',
            date: new Date('2026-03-23T10:00:00Z'),
            source: MetricSource.USER_INPUT,
            activityName: 'Morning Walk',
            durationMinutes: 30,
        };

        const mockCreatedRow = {
            id: 'metric-created-1',
            userId,
            type: MetricType.STEPS,
            value: 5000,
            unit: 'steps',
            timestamp: createDto.date,
            source: MetricSource.USER_INPUT,
            notes: null,
            metadata: {
                activityType: ActivityType.STEPS,
                activityName: 'Morning Walk',
                durationMinutes: 30,
            },
            isAbnormal: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should create a health metric and return an ActivityRecord', async () => {
            mockPrismaService.healthMetric.create.mockResolvedValue(mockCreatedRow);

            const result = await service.createActivityRecord(userId, createDto);

            expect(mockPrismaService.healthMetric.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        userId,
                        type: MetricType.STEPS,
                        value: 5000,
                        unit: 'steps',
                    }),
                })
            );
            expect(result.type).toBe(ActivityType.STEPS);
            expect(result.value).toBe(5000);
            expect(result.activityName).toBe('Morning Walk');
        });

        it('should default source to USER_INPUT when not provided', async () => {
            const dtoWithoutSource = { ...createDto, source: undefined };
            mockPrismaService.healthMetric.create.mockResolvedValue(mockCreatedRow);

            await service.createActivityRecord(userId, dtoWithoutSource as any);

            expect(mockPrismaService.healthMetric.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        source: MetricSource.USER_INPUT,
                    }),
                })
            );
        });

        it('should store metadata with activityName and durationMinutes', async () => {
            mockPrismaService.healthMetric.create.mockResolvedValue(mockCreatedRow);

            await service.createActivityRecord(userId, createDto);

            const callArg = mockPrismaService.healthMetric.create.mock.calls[0][0];
            expect(callArg.data.metadata).toEqual(
                expect.objectContaining({
                    activityName: 'Morning Walk',
                    durationMinutes: 30,
                })
            );
        });
    });

    describe('listActivityRecords', () => {
        const filters: FilterActivityDto = { limit: 5, offset: 0 };

        const mockRows = [
            {
                id: 'metric-1',
                userId,
                type: MetricType.STEPS,
                value: 3000,
                unit: 'steps',
                timestamp: new Date(),
                source: MetricSource.USER_INPUT,
                notes: null,
                metadata: { activityType: ActivityType.STEPS },
                isAbnormal: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        it('should return paginated activity records', async () => {
            mockPrismaService.healthMetric.findMany.mockResolvedValue(mockRows);
            mockPrismaService.healthMetric.count.mockResolvedValue(1);

            const result = await service.listActivityRecords(userId, filters);

            expect(mockPrismaService.healthMetric.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ userId }),
                    take: 5,
                    skip: 0,
                })
            );
            expect(result.data).toHaveLength(1);
            expect(result.pagination.total).toBe(1);
        });

        it('should use cached data when available', async () => {
            const cachedResult = { data: [], pagination: { limit: 5, offset: 0, total: 0 } };
            mockRedisService.get.mockResolvedValue(JSON.stringify(cachedResult));

            const result = await service.listActivityRecords(userId, filters);

            expect(mockPrismaService.healthMetric.findMany).not.toHaveBeenCalled();
            expect(result).toEqual(cachedResult);
        });

        it('should filter by date range when provided', async () => {
            const startDate = new Date('2026-03-01');
            const endDate = new Date('2026-03-23');
            mockPrismaService.healthMetric.findMany.mockResolvedValue([]);
            mockPrismaService.healthMetric.count.mockResolvedValue(0);

            await service.listActivityRecords(userId, { ...filters, startDate, endDate });

            const callArg = mockPrismaService.healthMetric.findMany.mock.calls[0][0];
            expect(callArg.where.timestamp).toEqual({ gte: startDate, lte: endDate });
        });
    });

    describe('getActivitySummary', () => {
        it('should aggregate steps, calories, and distance for today', async () => {
            const rows = [
                {
                    id: 'm1',
                    userId,
                    type: MetricType.STEPS,
                    value: 4000,
                    unit: 'steps',
                    timestamp: new Date(),
                    source: null,
                    notes: null,
                    metadata: null,
                    isAbnormal: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'm2',
                    userId,
                    type: MetricType.CALORIES,
                    value: 200,
                    unit: 'kcal',
                    timestamp: new Date(),
                    source: null,
                    notes: null,
                    metadata: null,
                    isAbnormal: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'm3',
                    userId,
                    type: MetricType.DISTANCE,
                    value: 3.2,
                    unit: 'km',
                    timestamp: new Date(),
                    source: null,
                    notes: null,
                    metadata: null,
                    isAbnormal: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            mockPrismaService.healthMetric.findMany.mockResolvedValue(rows);

            const summary = await service.getActivitySummary(userId);

            expect(summary.totalSteps).toBe(4000);
            expect(summary.totalCalories).toBe(200);
            expect(summary.totalDistanceKm).toBe(3.2);
        });

        it('should return zeros when no activity exists today', async () => {
            mockPrismaService.healthMetric.findMany.mockResolvedValue([]);

            const summary = await service.getActivitySummary(userId);

            expect(summary.totalSteps).toBe(0);
            expect(summary.totalCalories).toBe(0);
            expect(summary.totalDistanceKm).toBe(0);
            expect(summary.activeMinutes).toBe(0);
        });
    });

    describe('getActivityGoals', () => {
        it('should return default goals for the user', async () => {
            const goals = await service.getActivityGoals(userId);

            expect(Array.isArray(goals)).toBe(true);
            expect(goals.length).toBeGreaterThan(0);
            expect(goals[0].userId).toBe(userId);
            expect(goals[0].status).toBe('ACTIVE');
        });

        it('should include steps goal', async () => {
            const goals = await service.getActivityGoals(userId);
            const stepsGoal = goals.find((g) => g.type === ActivityType.STEPS);
            expect(stepsGoal).toBeDefined();
            expect(stepsGoal?.target).toBe(10000);
        });

        it('should return cached goals when available', async () => {
            const cachedGoals = [
                { id: 'cached-goal', userId, type: ActivityType.STEPS, target: 8000 },
            ];
            mockRedisService.get.mockResolvedValue(JSON.stringify(cachedGoals));

            const goals = await service.getActivityGoals(userId);

            expect(mockPrismaService.healthMetric.findMany).not.toHaveBeenCalled();
            expect(goals).toEqual(cachedGoals);
        });
    });

    describe('getActivityRecord', () => {
        const recordId = 'rec-specific-1';

        it('should return a specific activity record by id', async () => {
            const mockRow = {
                id: recordId,
                userId,
                type: MetricType.STEPS,
                value: 2000,
                unit: 'steps',
                timestamp: new Date(),
                source: MetricSource.USER_INPUT,
                notes: null,
                metadata: { activityType: ActivityType.STEPS },
                isAbnormal: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.healthMetric.findFirst.mockResolvedValue(mockRow);

            const result = await service.getActivityRecord(userId, recordId);

            expect(mockPrismaService.healthMetric.findFirst).toHaveBeenCalledWith({
                where: { id: recordId, userId },
            });
            expect(result.id).toBe(recordId);
        });

        it('should throw NotFoundException when record does not exist', async () => {
            mockPrismaService.healthMetric.findFirst.mockResolvedValue(null);

            await expect(service.getActivityRecord(userId, 'nonexistent')).rejects.toThrow(
                NotFoundException
            );
        });
    });
});
