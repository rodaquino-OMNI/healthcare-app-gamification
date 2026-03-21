import { BadRequestException } from '@nestjs/common';

import { CreateMetricDto } from './dto/create-metric.dto';
import {
    createHealthServiceTestModule,
    HealthServiceTestContext,
    mockPrismaService,
    mockHealthMetricsService,
    mockHealthGoalsService,
} from './test-helpers/health-service.mocks';
import { MetricType, MetricSource } from './types/health.types';

describe('HealthService - recordHealthMetric', () => {
    let ctx: HealthServiceTestContext;

    beforeEach(async () => {
        jest.clearAllMocks();
        ctx = await createHealthServiceTestModule();
    });

    it('should be defined', () => {
        expect(ctx.service).toBeDefined();
    });

    const userId = 'test-user-123';
    const validMetricDto: CreateMetricDto = {
        type: MetricType.HEART_RATE,
        value: 72,
        unit: 'bpm',
        source: MetricSource.USER_INPUT,
        timestamp: new Date(),
        notes: null,
    };

    it('should validate metric input before processing', async () => {
        // Arrange
        const invalidMetric: CreateMetricDto = {
            ...validMetricDto,
            value: -1, // Invalid negative value
        };

        // Act & Assert
        await expect(ctx.service.recordHealthMetric(userId, invalidMetric)).rejects.toThrow(
            BadRequestException
        );
    });

    it('should validate metric ranges based on type', async () => {
        // Arrange
        const outOfRangeMetric: CreateMetricDto = {
            type: MetricType.HEART_RATE,
            value: 300, // Too high for heart rate
            unit: 'bpm',
            source: MetricSource.USER_INPUT,
            timestamp: new Date(),
            notes: null,
        };

        // Act & Assert
        await expect(ctx.service.recordHealthMetric(userId, outOfRangeMetric)).rejects.toThrow(
            BadRequestException
        );
    });

    it('should successfully record a valid health metric', async () => {
        // Arrange
        const expectedMetric = {
            id: 'metric-123',
            userId,
            ...validMetricDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockHealthMetricsService.getHistoricalMetrics.mockResolvedValue([]);
        mockHealthMetricsService.detectAnomalies.mockReturnValue(null);
        mockHealthMetricsService.updateMetricCache.mockResolvedValue(undefined);
        mockHealthMetricsService.emitMetricEvents.mockResolvedValue(undefined);
        mockHealthGoalsService.checkAndUpdateHealthGoals.mockResolvedValue(undefined);
        mockPrismaService.healthMetric.create.mockResolvedValue(expectedMetric);
        mockPrismaService.$transaction.mockImplementation(async (fn) => fn(mockPrismaService));

        // Act
        const result = await ctx.service.recordHealthMetric(userId, validMetricDto);

        // Assert
        expect(result).toMatchObject(expectedMetric);
        expect(mockPrismaService.healthMetric.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                userId,
                type: validMetricDto.type,
                value: validMetricDto.value,
                unit: validMetricDto.unit,
            }),
        });
    });

    it('should detect anomalies for critical values', async () => {
        // Arrange
        const criticalMetric: CreateMetricDto = {
            type: MetricType.BLOOD_PRESSURE_SYSTOLIC,
            value: 181, // Critical high blood pressure (above 180 threshold)
            unit: 'mmHg',
            source: MetricSource.USER_INPUT,
            timestamp: new Date(),
            notes: null,
        };

        const anomalyResult = {
            severity: 'CRITICAL' as const,
            type: 'THRESHOLD_VIOLATION' as const,
            message: 'Blood pressure is critically high',
        };

        mockHealthMetricsService.getHistoricalMetrics.mockResolvedValue([]);
        mockHealthMetricsService.detectAnomalies.mockReturnValue(anomalyResult);
        mockHealthMetricsService.updateMetricCache.mockResolvedValue(undefined);
        mockHealthMetricsService.emitMetricEvents.mockResolvedValue(undefined);
        mockHealthGoalsService.checkAndUpdateHealthGoals.mockResolvedValue(undefined);
        mockPrismaService.healthMetric.create.mockResolvedValue({
            id: 'metric-123',
            userId,
            ...criticalMetric,
            isAbnormal: true,
            metadata: anomalyResult,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        mockPrismaService.$transaction.mockImplementation(async (fn) => fn(mockPrismaService));

        // Act
        const result = await ctx.service.recordHealthMetric(userId, criticalMetric);

        // Assert
        expect(result.metadata).toBeDefined();
        expect(result.metadata?.severity).toBe('CRITICAL');
        // Verify anomaly detection was called
        expect(mockHealthMetricsService.detectAnomalies).toHaveBeenCalledWith(
            criticalMetric,
            expect.any(Array)
        );
        // Verify events were emitted with the anomaly
        expect(mockHealthMetricsService.emitMetricEvents).toHaveBeenCalledWith(
            userId,
            expect.objectContaining({ id: 'metric-123' }),
            anomalyResult
        );
    });

    it('should update cache after recording metric', async () => {
        // Arrange
        const expectedMetric = {
            id: 'metric-123',
            userId,
            ...validMetricDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockHealthMetricsService.getHistoricalMetrics.mockResolvedValue([]);
        mockHealthMetricsService.detectAnomalies.mockReturnValue(null);
        mockHealthMetricsService.updateMetricCache.mockResolvedValue(undefined);
        mockHealthMetricsService.emitMetricEvents.mockResolvedValue(undefined);
        mockHealthGoalsService.checkAndUpdateHealthGoals.mockResolvedValue(undefined);
        mockPrismaService.healthMetric.create.mockResolvedValue(expectedMetric);
        mockPrismaService.$transaction.mockImplementation(async (fn) => fn(mockPrismaService));

        // Act
        await ctx.service.recordHealthMetric(userId, validMetricDto);

        // Assert
        expect(mockHealthMetricsService.updateMetricCache).toHaveBeenCalledWith(
            userId,
            validMetricDto.type,
            expectedMetric
        );
    });

    it('should emit events after recording metric', async () => {
        // Arrange
        const expectedMetric = {
            id: 'metric-123',
            userId,
            ...validMetricDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockHealthMetricsService.getHistoricalMetrics.mockResolvedValue([]);
        mockHealthMetricsService.detectAnomalies.mockReturnValue(null);
        mockHealthMetricsService.updateMetricCache.mockResolvedValue(undefined);
        mockHealthMetricsService.emitMetricEvents.mockResolvedValue(undefined);
        mockHealthGoalsService.checkAndUpdateHealthGoals.mockResolvedValue(undefined);
        mockPrismaService.healthMetric.create.mockResolvedValue(expectedMetric);
        mockPrismaService.$transaction.mockImplementation(async (fn) => fn(mockPrismaService));

        // Act
        await ctx.service.recordHealthMetric(userId, validMetricDto);

        // Assert
        expect(mockHealthMetricsService.emitMetricEvents).toHaveBeenCalledWith(
            userId,
            expectedMetric,
            null // no anomaly
        );
    });

    it('should check and update health goals after recording metric', async () => {
        // Arrange
        const stepsMetric: CreateMetricDto = {
            type: MetricType.STEPS,
            value: 5000,
            unit: 'steps',
            source: MetricSource.CONNECTED_DEVICE,
            timestamp: new Date(),
            notes: null,
        };

        const createdMetric = {
            id: 'metric-123',
            userId,
            ...stepsMetric,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockHealthMetricsService.getHistoricalMetrics.mockResolvedValue([]);
        mockHealthMetricsService.detectAnomalies.mockReturnValue(null);
        mockHealthMetricsService.updateMetricCache.mockResolvedValue(undefined);
        mockHealthMetricsService.emitMetricEvents.mockResolvedValue(undefined);
        mockHealthGoalsService.checkAndUpdateHealthGoals.mockResolvedValue(undefined);
        mockPrismaService.healthMetric.create.mockResolvedValue(createdMetric);
        mockPrismaService.$transaction.mockImplementation(async (fn) => fn(mockPrismaService));

        // Act
        await ctx.service.recordHealthMetric(userId, stepsMetric);

        // Assert
        expect(mockHealthGoalsService.checkAndUpdateHealthGoals).toHaveBeenCalledWith(
            mockPrismaService, // the transaction client
            userId,
            createdMetric
        );
    });
});
