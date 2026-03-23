import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateSleepRecordDto, SleepQuality } from './dto/create-sleep-record.dto';
import { FilterSleepDto } from './dto/filter-sleep.dto';
import { UpdateSleepRecordDto } from './dto/update-sleep-record.dto';
import { SleepService } from './sleep.service';
import { MetricSource, MetricType } from '../health/types/health.types';

const mockPrismaService = {
    healthMetric: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
    },
    healthGoal: {
        findMany: jest.fn(),
    },
};

const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
};

const userId = 'user-abc';
const recordId = 'metric-xyz';
const now = new Date('2024-01-15T00:00:00Z');

const rawMetric = {
    id: recordId,
    userId,
    type: MetricType.SLEEP,
    value: 480,
    unit: 'minutes',
    timestamp: now,
    source: MetricSource.USER_INPUT,
    notes: 'Good night',
    isAbnormal: false,
    metadata: {
        durationMinutes: 480,
        quality: SleepQuality.GOOD,
        bedtime: '2024-01-14T22:00:00.000Z',
        wakeTime: '2024-01-15T06:00:00.000Z',
        stages: { light: 180, deep: 120, rem: 150, awake: 30 },
    },
    createdAt: now,
    updatedAt: now,
};

describe('SleepService', () => {
    let service: SleepService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SleepService,
                { provide: 'PrismaService', useValue: mockPrismaService },
                { provide: 'RedisService', useValue: mockRedisService },
            ],
        })
            .overrideProvider(SleepService)
            .useFactory({
                factory: () =>
                    new SleepService(mockPrismaService as never, mockRedisService as never),
            })
            .compile();

        service = module.get<SleepService>(SleepService);
        jest.clearAllMocks();
    });

    describe('createSleepRecord', () => {
        it('should create a sleep record with all fields and return transformed result', async () => {
            const dto: CreateSleepRecordDto = {
                date: now,
                durationMinutes: 480,
                quality: SleepQuality.GOOD,
                bedtime: new Date('2024-01-14T22:00:00Z'),
                wakeTime: new Date('2024-01-15T06:00:00Z'),
                stages: { light: 180, deep: 120, rem: 150, awake: 30 },
                notes: 'Good night',
                source: MetricSource.USER_INPUT,
            };

            mockPrismaService.healthMetric.create.mockResolvedValue(rawMetric);
            mockRedisService.del.mockResolvedValue(1);

            const result = await service.createSleepRecord(userId, dto);

            expect(mockPrismaService.healthMetric.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        userId,
                        type: MetricType.SLEEP,
                        value: 480,
                        unit: 'minutes',
                        source: MetricSource.USER_INPUT,
                    }),
                })
            );
            expect(mockRedisService.del).toHaveBeenCalledWith(`sleep:trends:${userId}`);
            expect(result.durationMinutes).toBe(480);
            expect(result.quality).toBe(SleepQuality.GOOD);
            expect(result.userId).toBe(userId);
        });

        it('should use USER_INPUT as default source when not provided', async () => {
            const dto: CreateSleepRecordDto = {
                date: now,
                durationMinutes: 360,
                quality: SleepQuality.FAIR,
            };

            mockPrismaService.healthMetric.create.mockResolvedValue({
                ...rawMetric,
                value: 360,
                source: MetricSource.USER_INPUT,
                metadata: {
                    durationMinutes: 360,
                    quality: SleepQuality.FAIR,
                    bedtime: null,
                    wakeTime: null,
                    stages: null,
                },
            });
            mockRedisService.del.mockResolvedValue(1);

            const result = await service.createSleepRecord(userId, dto);

            expect(mockPrismaService.healthMetric.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ source: MetricSource.USER_INPUT }),
                })
            );
            expect(result.source).toBe(MetricSource.USER_INPUT);
        });
    });

    describe('listSleepRecords', () => {
        it('should return paginated records with default limit and offset', async () => {
            const filters: FilterSleepDto = {};
            mockPrismaService.healthMetric.findMany.mockResolvedValue([rawMetric]);
            mockPrismaService.healthMetric.count.mockResolvedValue(1);

            const result = await service.listSleepRecords(userId, filters);

            expect(mockPrismaService.healthMetric.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { userId, type: MetricType.SLEEP },
                    take: 10,
                    skip: 0,
                    orderBy: { timestamp: 'desc' },
                })
            );
            expect(result.pagination).toEqual({ limit: 10, offset: 0, total: 1 });
            expect(result.data).toHaveLength(1);
        });

        it('should apply date range filter when startDate and endDate are provided', async () => {
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-01-31');
            const filters: FilterSleepDto = { startDate, endDate, limit: 5, offset: 0 };

            mockPrismaService.healthMetric.findMany.mockResolvedValue([]);
            mockPrismaService.healthMetric.count.mockResolvedValue(0);

            await service.listSleepRecords(userId, filters);

            expect(mockPrismaService.healthMetric.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        userId,
                        type: MetricType.SLEEP,
                        timestamp: { gte: new Date(startDate), lte: new Date(endDate) },
                    },
                })
            );
        });

        it('should return empty list when no records exist', async () => {
            mockPrismaService.healthMetric.findMany.mockResolvedValue([]);
            mockPrismaService.healthMetric.count.mockResolvedValue(0);

            const result = await service.listSleepRecords(userId, {});

            expect(result.data).toHaveLength(0);
            expect(result.pagination.total).toBe(0);
        });
    });

    describe('getSleepRecord', () => {
        it('should return a single sleep record when found', async () => {
            mockPrismaService.healthMetric.findFirst.mockResolvedValue(rawMetric);

            const result = await service.getSleepRecord(userId, recordId);

            expect(mockPrismaService.healthMetric.findFirst).toHaveBeenCalledWith({
                where: { id: recordId, userId, type: MetricType.SLEEP },
            });
            expect(result.id).toBe(recordId);
            expect(result.durationMinutes).toBe(480);
        });

        it('should throw NotFoundException when record does not exist', async () => {
            mockPrismaService.healthMetric.findFirst.mockResolvedValue(null);

            await expect(service.getSleepRecord(userId, 'nonexistent')).rejects.toThrow(
                new NotFoundException('Sleep record with ID nonexistent not found')
            );
        });
    });

    describe('updateSleepRecord', () => {
        it('should update a sleep record and invalidate cache', async () => {
            const dto: UpdateSleepRecordDto = {
                durationMinutes: 540,
                quality: SleepQuality.EXCELLENT,
            };
            const updatedMetric = {
                ...rawMetric,
                value: 540,
                metadata: {
                    ...rawMetric.metadata,
                    durationMinutes: 540,
                    quality: SleepQuality.EXCELLENT,
                },
                updatedAt: new Date(),
            };

            mockPrismaService.healthMetric.findFirst.mockResolvedValue(rawMetric);
            mockPrismaService.healthMetric.update.mockResolvedValue(updatedMetric);
            mockRedisService.del.mockResolvedValue(1);

            const result = await service.updateSleepRecord(userId, recordId, dto);

            expect(mockPrismaService.healthMetric.findFirst).toHaveBeenCalledWith({
                where: { id: recordId, userId, type: MetricType.SLEEP },
            });
            expect(mockPrismaService.healthMetric.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: recordId },
                    data: expect.objectContaining({ value: 540 }),
                })
            );
            expect(mockRedisService.del).toHaveBeenCalledWith(`sleep:trends:${userId}`);
            expect(result.durationMinutes).toBe(540);
        });

        it('should throw NotFoundException when updating a non-existent record', async () => {
            mockPrismaService.healthMetric.findFirst.mockResolvedValue(null);

            await expect(
                service.updateSleepRecord(userId, 'nonexistent', { durationMinutes: 300 })
            ).rejects.toThrow(new NotFoundException('Sleep record with ID nonexistent not found'));
        });
    });

    describe('getSleepTrends', () => {
        it('should return cached trends when available', async () => {
            const cachedTrends = {
                averageDuration: 450,
                averageQuality: 'GOOD',
                totalRecords: 5,
                weeklyData: [],
            };
            mockRedisService.get.mockResolvedValue(JSON.stringify(cachedTrends));

            const result = await service.getSleepTrends(userId);

            expect(mockRedisService.get).toHaveBeenCalledWith(`sleep:trends:${userId}`);
            expect(mockPrismaService.healthMetric.findMany).not.toHaveBeenCalled();
            expect(result).toEqual(cachedTrends);
        });

        it('should compute trends from DB and cache result when no cache hit', async () => {
            mockRedisService.get.mockResolvedValue(null);
            mockPrismaService.healthMetric.findMany.mockResolvedValue([
                {
                    ...rawMetric,
                    value: 480,
                    metadata: { quality: 'GOOD' },
                    timestamp: new Date('2024-01-15'),
                },
                {
                    ...rawMetric,
                    value: 420,
                    metadata: { quality: 'FAIR' },
                    timestamp: new Date('2024-01-14'),
                },
            ]);
            mockRedisService.set.mockResolvedValue('OK');

            const result = await service.getSleepTrends(userId);

            expect(mockPrismaService.healthMetric.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ userId, type: MetricType.SLEEP }),
                })
            );
            expect(mockRedisService.set).toHaveBeenCalledWith(
                `sleep:trends:${userId}`,
                expect.any(String),
                300
            );
            expect(result.totalRecords).toBe(2);
            expect(result.averageDuration).toBe(450);
        });

        it('should return UNKNOWN quality when no records exist', async () => {
            mockRedisService.get.mockResolvedValue(null);
            mockPrismaService.healthMetric.findMany.mockResolvedValue([]);
            mockRedisService.set.mockResolvedValue('OK');

            const result = await service.getSleepTrends(userId);

            expect(result.averageQuality).toBe('UNKNOWN');
            expect(result.totalRecords).toBe(0);
            expect(result.averageDuration).toBe(0);
        });
    });

    describe('getSleepGoals', () => {
        it('should return sleep goals for the user', async () => {
            const goals = [{ id: 'goal-1', recordId: userId, type: 'SLEEP', targetValue: 480 }];
            mockPrismaService.healthGoal.findMany.mockResolvedValue(goals);

            const result = await service.getSleepGoals(userId);

            expect(mockPrismaService.healthGoal.findMany).toHaveBeenCalledWith({
                where: { recordId: userId, type: 'SLEEP' },
            });
            expect(result).toEqual(goals);
        });

        it('should return empty array when no sleep goals are set', async () => {
            mockPrismaService.healthGoal.findMany.mockResolvedValue([]);

            const result = await service.getSleepGoals(userId);

            expect(result).toEqual([]);
        });
    });
});
