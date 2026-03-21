import { CreateMetricDto } from './dto/create-metric.dto';
import {
    createHealthServiceTestModule,
    HealthServiceTestContext,
    mockPrismaService,
    mockHealthMetricsService,
    mockHealthGoalsService,
} from './test-helpers/health-service.mocks';
import { MetricType, MetricSource } from './types/health.types';

describe('HealthService - anomaly detection', () => {
    let ctx: HealthServiceTestContext;

    beforeEach(async () => {
        jest.clearAllMocks();
        ctx = await createHealthServiceTestModule();
    });

    const userId = 'test-user-123';

    it('should detect statistical anomalies using z-score', async () => {
        // Arrange
        const anomalyResult = {
            severity: 'WARNING' as const,
            type: 'STATISTICAL_ANOMALY' as const,
            message: 'Value is 4.5 standard deviations from the mean',
            zScore: 4.5,
        };

        const anomalousMetric: CreateMetricDto = {
            type: MetricType.BLOOD_PRESSURE_SYSTOLIC,
            value: 160, // Significantly higher than normal
            unit: 'mmHg',
            source: MetricSource.USER_INPUT,
            timestamp: new Date(),
            notes: null,
        };

        mockHealthMetricsService.getHistoricalMetrics.mockResolvedValue([]);
        mockHealthMetricsService.detectAnomalies.mockReturnValue(anomalyResult);
        mockHealthMetricsService.updateMetricCache.mockResolvedValue(undefined);
        mockHealthMetricsService.emitMetricEvents.mockResolvedValue(undefined);
        mockHealthGoalsService.checkAndUpdateHealthGoals.mockResolvedValue(undefined);
        mockPrismaService.healthMetric.create.mockResolvedValue({
            id: 'metric-123',
            userId,
            ...anomalousMetric,
            isAbnormal: true,
            metadata: anomalyResult,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        mockPrismaService.$transaction.mockImplementation(async (fn) => fn(mockPrismaService));

        // Act
        const result = await ctx.service.recordHealthMetric(userId, anomalousMetric);

        // Assert
        expect(result.metadata).toBeDefined();
        expect(result.metadata?.type).toBe('STATISTICAL_ANOMALY');
        expect(Math.abs(result.metadata?.zScore || 0)).toBeGreaterThan(3);
    });

    it('should detect trend anomalies', async () => {
        // Arrange
        const anomalyResult = {
            severity: 'INFO' as const,
            type: 'TREND_CHANGE' as const,
            message: 'Rapid increasing trend detected',
        };

        const continuingTrendMetric: CreateMetricDto = {
            type: MetricType.BLOOD_PRESSURE_SYSTOLIC,
            value: 155, // Continuing the trend
            unit: 'mmHg',
            source: MetricSource.USER_INPUT,
            timestamp: new Date(),
            notes: null,
        };

        mockHealthMetricsService.getHistoricalMetrics.mockResolvedValue([]);
        mockHealthMetricsService.detectAnomalies.mockReturnValue(anomalyResult);
        mockHealthMetricsService.updateMetricCache.mockResolvedValue(undefined);
        mockHealthMetricsService.emitMetricEvents.mockResolvedValue(undefined);
        mockHealthGoalsService.checkAndUpdateHealthGoals.mockResolvedValue(undefined);
        mockPrismaService.healthMetric.create.mockResolvedValue({
            id: 'metric-123',
            userId,
            ...continuingTrendMetric,
            isAbnormal: true,
            metadata: anomalyResult,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        mockPrismaService.$transaction.mockImplementation(async (fn) => fn(mockPrismaService));

        // Act
        const result = await ctx.service.recordHealthMetric(userId, continuingTrendMetric);

        // Assert
        expect(result.metadata).toBeDefined();
        expect(result.metadata?.type).toBe('TREND_CHANGE');
    });
});
