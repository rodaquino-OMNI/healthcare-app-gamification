import { PrismaService } from '@app/shared/database/prisma.service';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { HealthGoalsService } from '../health-goals.service';
import { HealthMetricsService } from '../health-metrics.service';
import { HealthService } from '../health.service';

export interface HealthServiceTestContext {
    service: HealthService;
    prismaService: jest.Mocked<PrismaService>;
    redisService: jest.Mocked<RedisService>;
    kafkaService: jest.Mocked<KafkaService>;
    configService: jest.Mocked<ConfigService>;
    healthMetricsService: jest.Mocked<HealthMetricsService>;
    healthGoalsService: jest.Mocked<HealthGoalsService>;
}

export const mockPrismaService = {
    healthMetric: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
    },
    healthGoal: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
};

export const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    zadd: jest.fn(),
    zrange: jest.fn(),
    del: jest.fn(),
    expire: jest.fn(),
};

export const mockKafkaService = {
    emit: jest.fn(),
};

export const mockConfigService = {
    get: jest.fn().mockReturnValue('test-value'),
};

export const mockHealthMetricsService = {
    getHistoricalMetrics: jest.fn(),
    detectAnomalies: jest.fn(),
    updateMetricCache: jest.fn(),
    emitMetricEvents: jest.fn(),
};

export const mockHealthGoalsService = {
    checkAndUpdateHealthGoals: jest.fn(),
};

export async function createHealthServiceTestModule(): Promise<HealthServiceTestContext> {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
            HealthService,
            {
                provide: PrismaService,
                useValue: mockPrismaService,
            },
            {
                provide: RedisService,
                useValue: mockRedisService,
            },
            {
                provide: KafkaService,
                useValue: mockKafkaService,
            },
            {
                provide: ConfigService,
                useValue: mockConfigService,
            },
            {
                provide: HealthMetricsService,
                useValue: mockHealthMetricsService,
            },
            {
                provide: HealthGoalsService,
                useValue: mockHealthGoalsService,
            },
        ],
    }).compile();

    return {
        service: module.get<HealthService>(HealthService),
        prismaService: module.get(PrismaService),
        redisService: module.get(RedisService),
        kafkaService: module.get(KafkaService),
        configService: module.get(ConfigService),
        healthMetricsService: module.get(HealthMetricsService),
        healthGoalsService: module.get(HealthGoalsService),
    };
}
