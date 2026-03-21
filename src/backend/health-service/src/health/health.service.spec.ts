import { PrismaService } from '@app/shared/database/prisma.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HealthGoalsService } from './health-goals.service';
import { HealthMetricsService } from './health-metrics.service';
import { HealthService } from './health.service';
import { MetricType, MetricSource } from './types/health.types';

describe('HealthService', () => {
    let service: HealthService;
    let prismaService: Record<string, any>;
    let redisService: Record<string, jest.Mock>;
    let healthMetricsService: Record<string, jest.Mock>;
    let healthGoalsService: Record<string, jest.Mock>;

    beforeEach(async () => {
        prismaService = {
            healthMetric: {
                findMany: jest.fn().mockResolvedValue([]),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                count: jest.fn().mockResolvedValue(0),
            },
            healthGoal: {
                findMany: jest.fn().mockResolvedValue([]),
                update: jest.fn(),
            },
            $transaction: jest.fn().mockImplementation((cb: (prisma: any) => Promise<any>) =>
                cb({
                    healthMetric: {
                        findMany: jest.fn().mockResolvedValue([]),
                        create: jest.fn().mockResolvedValue({
                            id: 'metric-1',
                            userId: 'user-1',
                            type: MetricType.HEART_RATE,
                            value: 72,
                            unit: 'bpm',
                            timestamp: new Date(),
                            source: MetricSource.USER_INPUT,
                            notes: null,
                            anomaly: null,
                            trend: null,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }),
                    },
                    healthGoal: {
                        findMany: jest.fn().mockResolvedValue([]),
                        update: jest.fn(),
                    },
                })
            ),
        };

        redisService = {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue('OK'),
            zadd: jest.fn().mockResolvedValue(1),
            expire: jest.fn().mockResolvedValue(1),
        };

        healthMetricsService = {
            getHistoricalMetrics: jest.fn().mockResolvedValue([]),
            detectAnomalies: jest.fn().mockReturnValue(null),
            updateMetricCache: jest.fn().mockResolvedValue(undefined),
            emitMetricEvents: jest.fn().mockResolvedValue(undefined),
        };

        healthGoalsService = {
            checkAndUpdateHealthGoals: jest.fn().mockResolvedValue(undefined),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HealthService,
                { provide: PrismaService, useValue: prismaService },
                { provide: RedisService, useValue: redisService },
                { provide: HealthMetricsService, useValue: healthMetricsService },
                { provide: HealthGoalsService, useValue: healthGoalsService },
            ],
        }).compile();

        service = module.get<HealthService>(HealthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('recordHealthMetric', () => {
        it('should record a valid health metric', async () => {
            const metricDto = {
                type: MetricType.HEART_RATE,
                value: 72,
                unit: 'bpm',
                timestamp: new Date(),
                source: MetricSource.USER_INPUT,
                notes: null,
            };

            const result = await service.recordHealthMetric('user-1', metricDto);

            expect(result).toBeDefined();
            expect(result.id).toBe('metric-1');
            expect(result.type).toBe(MetricType.HEART_RATE);
        });

        it('should throw BadRequestException for negative value', async () => {
            const metricDto = {
                type: MetricType.HEART_RATE,
                value: -1,
                unit: 'bpm',
                timestamp: new Date(),
                source: MetricSource.USER_INPUT,
                notes: null,
            };

            await expect(service.recordHealthMetric('user-1', metricDto)).rejects.toThrow(
                BadRequestException
            );
        });

        it('should throw BadRequestException for out-of-range value', async () => {
            const metricDto = {
                type: MetricType.HEART_RATE,
                value: 300,
                unit: 'bpm',
                timestamp: new Date(),
                source: MetricSource.USER_INPUT,
                notes: null,
            };

            await expect(service.recordHealthMetric('user-1', metricDto)).rejects.toThrow(
                BadRequestException
            );
        });

        it('should throw BadRequestException when unit is missing', async () => {
            const metricDto = {
                type: MetricType.HEART_RATE,
                value: 72,
                unit: '',
                timestamp: new Date(),
                source: MetricSource.USER_INPUT,
                notes: null,
            };

            await expect(service.recordHealthMetric('user-1', metricDto)).rejects.toThrow(
                BadRequestException
            );
        });
    });

    describe('getHealthMetrics', () => {
        it('should return cached data when available', async () => {
            const cachedResult = {
                data: [{ id: 'cached-1', type: MetricType.HEART_RATE, value: 80 }],
                pagination: { limit: 10, offset: 0, total: 1 },
            };
            redisService.get.mockResolvedValueOnce(JSON.stringify(cachedResult));

            const result = await service.getHealthMetrics('user-1');

            expect(result).toEqual(cachedResult);
            expect(prismaService.healthMetric.findMany).not.toHaveBeenCalled();
        });

        it('should fetch from database when cache is empty', async () => {
            prismaService.healthMetric.findMany.mockResolvedValueOnce([]);
            prismaService.healthMetric.count.mockResolvedValueOnce(0);

            const result = await service.getHealthMetrics('user-1');

            expect(result.data).toEqual([]);
            expect(result.pagination.total).toBe(0);
        });

        it('should apply filters for metric types', async () => {
            prismaService.healthMetric.findMany.mockResolvedValueOnce([]);
            prismaService.healthMetric.count.mockResolvedValueOnce(0);

            await service.getHealthMetrics('user-1', { types: [MetricType.HEART_RATE] });

            expect(prismaService.healthMetric.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        type: { in: [MetricType.HEART_RATE] },
                    }),
                })
            );
        });
    });

    describe('updateHealthMetric', () => {
        it('should throw NotFoundException when metric does not exist', async () => {
            prismaService.healthMetric.findUnique.mockResolvedValueOnce(null);

            await expect(service.updateHealthMetric('nonexistent', { value: 80 })).rejects.toThrow(
                NotFoundException
            );
        });

        it('should update an existing metric', async () => {
            const existing = {
                id: 'metric-1',
                userId: 'user-1',
                type: MetricType.HEART_RATE,
                value: 72,
                unit: 'bpm',
                timestamp: new Date(),
                source: MetricSource.USER_INPUT,
                notes: null,
                anomaly: null,
                trend: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaService.healthMetric.findUnique.mockResolvedValueOnce(existing);
            prismaService.healthMetric.update.mockResolvedValueOnce({ ...existing, value: 80 });

            const result = await service.updateHealthMetric('metric-1', { value: 80 });

            expect(result).toBeDefined();
            expect(prismaService.healthMetric.update).toHaveBeenCalled();
        });

        it('should validate range when updating value', async () => {
            const existing = {
                id: 'metric-1',
                type: MetricType.HEART_RATE,
                value: 72,
            };

            prismaService.healthMetric.findUnique.mockResolvedValueOnce(existing);

            await expect(service.updateHealthMetric('metric-1', { value: 999 })).rejects.toThrow(
                BadRequestException
            );
        });
    });
});
