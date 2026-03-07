/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { FhirService } from '../integrations/fhir/fhir.service';
import { WearablesService } from '../integrations/wearables/wearables.service';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { AppException } from '@app/shared/exceptions/exceptions.types';

describe('InsightsService', () => {
    let service: InsightsService;

    const mockPrismaService = {
        user: {
            findMany: jest.fn(),
        },
        healthMetric: {
            findMany: jest.fn(),
        },
        healthGoal: {
            findMany: jest.fn(),
        },
        $transaction: jest.fn(),
    };

    const mockFhirService = {
        getPatientRecord: jest.fn(),
        getMedicalHistory: jest.fn(),
    };

    const mockWearablesService = {
        getHealthMetrics: jest.fn(),
        connectDevice: jest.fn(),
    };

    const mockKafkaService = {
        emit: jest.fn().mockResolvedValue(undefined),
        produce: jest.fn().mockResolvedValue(undefined),
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
                InsightsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: FhirService,
                    useValue: mockFhirService,
                },
                {
                    provide: WearablesService,
                    useValue: mockWearablesService,
                },
                {
                    provide: KafkaService,
                    useValue: mockKafkaService,
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

        service = module.get<InsightsService>(InsightsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateUserInsights', () => {
        const userId = 'user-test-123';

        const mockMetrics = [
            { id: 'metric-1', userId, type: 'HEART_RATE', value: 72, timestamp: new Date() },
            { id: 'metric-2', userId, type: 'STEPS', value: 8000, timestamp: new Date() },
        ];

        const mockGoals = [{ id: 'goal-1', recordId: userId, type: 'STEPS', targetValue: 10000, status: 'ACTIVE' }];

        it('should generate insights for a user', async () => {
            (mockPrismaService as any).healthMetric.findMany.mockResolvedValue(mockMetrics);
            (mockPrismaService as any).healthGoal.findMany.mockResolvedValue(mockGoals);
            mockKafkaService.produce.mockResolvedValue(undefined);

            const result = await service.generateUserInsights(userId);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('metricsCount');
            expect(result).toHaveProperty('goalsCount');
        });

        it('should throw ForbiddenException when requestingUserId does not match userId', async () => {
            await expect(service.generateUserInsights(userId, 'different-user')).rejects.toThrow(ForbiddenException);
        });

        it('should query health metrics and goals for the user', async () => {
            (mockPrismaService as any).healthMetric.findMany.mockResolvedValue(mockMetrics);
            (mockPrismaService as any).healthGoal.findMany.mockResolvedValue(mockGoals);
            mockKafkaService.produce.mockResolvedValue(undefined);

            await service.generateUserInsights(userId);

            expect((mockPrismaService as any).healthMetric.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ userId }),
                })
            );
        });

        it('should publish insight event to Kafka after generation', async () => {
            (mockPrismaService as any).healthMetric.findMany.mockResolvedValue(mockMetrics);
            (mockPrismaService as any).healthGoal.findMany.mockResolvedValue(mockGoals);
            mockKafkaService.produce.mockResolvedValue(undefined);

            await service.generateUserInsights(userId);

            expect(mockKafkaService.produce).toHaveBeenCalledWith(
                'austa.health.insights',
                expect.objectContaining({ userId })
            );
        });

        it('should throw AppException when database query fails', async () => {
            (mockPrismaService as any).healthMetric.findMany.mockRejectedValue(new Error('Database connection lost'));

            await expect(service.generateUserInsights(userId)).rejects.toThrow(AppException);
        });
    });

    describe('generateInsights (cron method)', () => {
        it('should iterate over all users and generate insights', async () => {
            const mockUsers = [{ id: 'user-1' }, { id: 'user-2' }];
            mockPrismaService.user.findMany.mockResolvedValue(mockUsers);
            (mockPrismaService as any).healthMetric.findMany.mockResolvedValue([]);
            (mockPrismaService as any).healthGoal.findMany.mockResolvedValue([]);
            mockKafkaService.produce.mockResolvedValue(undefined);

            await service.generateInsights();

            expect(mockPrismaService.user.findMany).toHaveBeenCalled();
        });

        it('should not throw when individual user insight generation fails', async () => {
            const mockUsers = [{ id: 'user-1' }];
            mockPrismaService.user.findMany.mockResolvedValue(mockUsers);
            (mockPrismaService as any).healthMetric.findMany.mockRejectedValue(new Error('Failed for user'));

            await expect(service.generateInsights()).resolves.not.toThrow();
        });
    });

    describe('getUserHealthMetrics', () => {
        const userId = 'user-test-123';
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-01-31');

        it('should return health metrics for a user within date range', async () => {
            const mockMetrics = [{ id: 'metric-1', type: 'HEART_RATE', value: 72 }];
            (mockPrismaService as any).healthMetric.findMany.mockResolvedValue(mockMetrics);

            const result = await service.getUserHealthMetrics(userId, startDate, endDate);

            expect(result).toEqual(mockMetrics);
        });

        it('should query with correct date range filter', async () => {
            (mockPrismaService as any).healthMetric.findMany.mockResolvedValue([]);

            await service.getUserHealthMetrics(userId, startDate, endDate);

            expect((mockPrismaService as any).healthMetric.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        userId,
                        timestamp: { gte: startDate, lte: endDate },
                    }),
                })
            );
        });

        it('should throw AppException when query fails', async () => {
            (mockPrismaService as any).healthMetric.findMany.mockRejectedValue(new Error('Query error'));

            await expect(service.getUserHealthMetrics(userId, startDate, endDate)).rejects.toThrow(AppException);
        });
    });

    describe('analyzeHealthData', () => {
        it('should return analysis with metricsCount and recommendations', () => {
            const metrics = [{ id: 'm-1', type: 'HEART_RATE', value: 72 } as any];
            const goals = [] as any[];

            const result = service.analyzeHealthData(metrics, goals);

            expect(result).toHaveProperty('metricsCount', 1);
            expect(result).toHaveProperty('recommendations');
            expect(Array.isArray(result.recommendations)).toBe(true);
        });

        it('should reflect goalsCount in the analysis', () => {
            const metrics = [] as any[];
            const goals = [
                { id: 'g-1', type: 'STEPS', targetValue: 10000 } as any,
                { id: 'g-2', type: 'WATER', targetValue: 8 } as any,
            ];

            const result = service.analyzeHealthData(metrics, goals);

            expect(result).toHaveProperty('goalsCount', 2);
        });
    });

    describe('publishInsightEvent', () => {
        const userId = 'user-test-123';
        const insightData = { metricsCount: 5, recommendations: ['Exercise more'] };

        it('should publish event to correct Kafka topic', async () => {
            mockKafkaService.produce.mockResolvedValue(undefined);

            await service.publishInsightEvent(userId, insightData);

            expect(mockKafkaService.produce).toHaveBeenCalledWith(
                'austa.health.insights',
                expect.objectContaining({ userId, insightData })
            );
        });

        it('should throw AppException when Kafka produce fails', async () => {
            mockKafkaService.produce.mockRejectedValue(new Error('Kafka unavailable'));

            await expect(service.publishInsightEvent(userId, insightData)).rejects.toThrow(AppException);
        });
    });
});
