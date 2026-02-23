import { MetricType, MetricSource } from './types/health.types';
import { CreateMetricDto } from './dto/create-metric.dto';
import {
  createHealthServiceTestModule,
  HealthServiceTestContext,
  mockPrismaService,
} from './test-helpers/health-service.mocks';

describe('HealthService - anomaly detection', () => {
  let ctx: HealthServiceTestContext;

  beforeEach(async () => {
    jest.clearAllMocks();
    ctx = await createHealthServiceTestModule();
  });

  const userId = 'test-user-123';

  it('should detect statistical anomalies using z-score', async () => {
    // Arrange
    const historicalMetrics = Array.from({ length: 30 }, (_, i) => ({
      value: 120 + Math.random() * 10 - 5, // Normal BP around 120
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    }));

    mockPrismaService.healthMetric.findMany.mockResolvedValue(historicalMetrics);

    const anomalousMetric: CreateMetricDto = {
      type: MetricType.BLOOD_PRESSURE_SYSTOLIC,
      value: 160, // Significantly higher than normal
      unit: 'mmHg',
      source: MetricSource.USER_INPUT,
      timestamp: new Date(),
      notes: null,
    };

    mockPrismaService.healthMetric.create.mockResolvedValue({
      id: 'metric-123',
      userId,
      ...anomalousMetric,
      anomaly: JSON.stringify({
        severity: 'WARNING',
        type: 'STATISTICAL_ANOMALY',
        zScore: 4.5,
      }),
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
    const trendingMetrics = Array.from({ length: 7 }, (_, i) => ({
      value: 120 + i * 5, // Increasing trend
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    }));

    mockPrismaService.healthMetric.findMany.mockResolvedValue(trendingMetrics);

    const continuingTrendMetric: CreateMetricDto = {
      type: MetricType.BLOOD_PRESSURE_SYSTOLIC,
      value: 155, // Continuing the trend
      unit: 'mmHg',
      source: MetricSource.USER_INPUT,
      timestamp: new Date(),
      notes: null,
    };

    mockPrismaService.healthMetric.create.mockResolvedValue({
      id: 'metric-123',
      userId,
      ...continuingTrendMetric,
      anomaly: JSON.stringify({
        severity: 'INFO',
        type: 'TREND_CHANGE',
        message: 'Rapid increasing trend detected',
      }),
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
