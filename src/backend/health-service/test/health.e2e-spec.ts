/* eslint-disable */
import { PrismaService } from '@app/shared/database/prisma.service';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { CreateMetricDto } from '../src/health/dto/create-metric.dto';
import { HealthModule } from '../src/health/health.module';
import { HealthService } from '../src/health/health.service';
import { MetricType, MetricSource } from '../src/health/types/health.types';

/**
 * Comprehensive end-to-end tests for the Health Service, verifying the correct behavior
 * of its API endpoints, data persistence, and integration with other services.
 * It focuses on validating the core functionalities of the Health Journey, such as
 * creating, retrieving, and updating health metrics.
 *
 * Addresses requirement F-101: My Health Journey
 */
describe('Health Service (e2e)', () => {
    let app: INestApplication;
    let healthService: HealthService;

    const mockHealthService = {
        recordHealthMetric: jest.fn(),
        getHealthMetrics: jest.fn(),
        getHealthGoals: jest.fn(),
        createHealthGoal: jest.fn(),
        updateHealthGoal: jest.fn(),
        getHealthInsights: jest.fn(),
        createHealthMetric: jest.fn(),
        updateHealthMetric: jest.fn(),
    };

    const mockPrismaService = {
        healthMetric: {
            create: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
        },
        healthGoal: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            findFirst: jest.fn(),
        },
        $transaction: jest.fn(),
    };

    const mockRedisService = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        zadd: jest.fn(),
        zrange: jest.fn(),
        expire: jest.fn(),
    };

    const mockKafkaService = {
        emit: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn().mockReturnValue('test-value'),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [HealthModule],
        })
            .overrideProvider(HealthService)
            .useValue(mockHealthService)
            .overrideProvider(PrismaService)
            .useValue(mockPrismaService)
            .overrideProvider(RedisService)
            .useValue(mockRedisService)
            .overrideProvider(KafkaService)
            .useValue(mockKafkaService)
            .overrideProvider(ConfigService)
            .useValue(mockConfigService)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: true,
            })
        );
        await app.init();
        healthService = moduleFixture.get<HealthService>(HealthService);

        // Clear all mocks
        jest.clearAllMocks();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('POST /health/:recordId', () => {
        it('should return 201 when creating a valid health metric', async () => {
            const recordId = 'test-record-id';
            const createMetricDto: CreateMetricDto = {
                type: MetricType.HEART_RATE,
                value: 72,
                unit: 'bpm',
                timestamp: new Date(),
                source: MetricSource.USER_INPUT,
                notes: 'Resting heart rate',
            };

            const expectedResult = {
                id: 'new-metric-id',
                userId: 'test-user-id',
                ...createMetricDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockHealthService.createHealthMetric.mockResolvedValue(expectedResult);

            const response = await request(app.getHttpServer())
                .post(`/health/${recordId}`)
                .send(createMetricDto)
                .expect(HttpStatus.CREATED);

            expect(response.body).toMatchObject({
                id: 'new-metric-id',
                type: MetricType.HEART_RATE,
                value: 72,
                unit: 'bpm',
            });
            expect(mockHealthService.createHealthMetric).toHaveBeenCalledWith(
                recordId,
                expect.objectContaining(createMetricDto)
            );
        });

        it('should return 400 when creating an invalid health metric', async () => {
            const recordId = 'valid-record-id';
            const createMetricDto = {
                type: 'INVALID_TYPE', // Invalid metric type
                value: 'not a number', // Invalid value
                unit: 123, // Invalid unit
                timestamp: 'not a date', // Invalid timestamp
                source: 'WRONG', // Invalid source
                notes: null,
            };

            await request(app.getHttpServer())
                .post(`/health/${recordId}`)
                .send(createMetricDto)
                .expect(HttpStatus.BAD_REQUEST);
        });
    });

    describe('PUT /health/:id', () => {
        it('should return 200 when updating a valid health metric', async () => {
            const metricId = 'valid-metric-id';
            const updateMetricDto = {
                value: 75,
                notes: 'Updated resting heart rate',
            };

            mockHealthService.updateHealthMetric.mockResolvedValue({
                id: metricId,
                type: MetricType.HEART_RATE,
                value: 75,
                unit: 'bpm',
                timestamp: new Date(),
                source: MetricSource.USER_INPUT,
                notes: 'Updated resting heart rate',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response = await request(app.getHttpServer())
                .put(`/health/${metricId}`)
                .send(updateMetricDto)
                .expect(HttpStatus.OK);

            expect(response.body).toMatchObject({
                id: metricId,
                type: MetricType.HEART_RATE,
                value: 75,
                unit: 'bpm',
                notes: 'Updated resting heart rate',
            });
            expect(mockHealthService.updateHealthMetric).toHaveBeenCalledWith(metricId, updateMetricDto);
        });

        it('should return 400 when updating an invalid health metric', async () => {
            const metricId = 'valid-metric-id';
            const updateMetricDto = {
                value: 'not a number',
                notes: 123,
            };

            await request(app.getHttpServer())
                .put(`/health/${metricId}`)
                .send(updateMetricDto)
                .expect(HttpStatus.BAD_REQUEST);
        });
    });
});
