import { MetricType, MetricSource } from './types/health.types';
import { BadRequestException } from '@nestjs/common';
import { CreateMetricDto } from './dto/create-metric.dto';
import {
  createHealthServiceTestModule,
  HealthServiceTestContext,
  mockPrismaService,
  mockRedisService,
  mockKafkaService,
} from './test-helpers/health-service.mocks';

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
    await expect(ctx.service.recordHealthMetric(userId, invalidMetric))
      .rejects.toThrow(BadRequestException);
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
    await expect(ctx.service.recordHealthMetric(userId, outOfRangeMetric))
      .rejects.toThrow(BadRequestException);
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

    mockPrismaService.healthMetric.create.mockResolvedValue(expectedMetric);
    mockPrismaService.healthMetric.findMany.mockResolvedValue([]);
    mockPrismaService.healthGoal.findMany.mockResolvedValue([]);
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

    const baselineMetrics = [
      { value: 120, timestamp: new Date() },
      { value: 118, timestamp: new Date() },
      { value: 122, timestamp: new Date() },
    ];

    mockPrismaService.healthMetric.findMany.mockResolvedValue(baselineMetrics);
    mockPrismaService.healthMetric.create.mockResolvedValue({
      id: 'metric-123',
      userId,
      ...criticalMetric,
      anomaly: JSON.stringify({
        severity: 'CRITICAL',
        type: 'THRESHOLD_VIOLATION',
        message: 'Blood pressure is critically high',
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockPrismaService.$transaction.mockImplementation(async (fn) => fn(mockPrismaService));

    // Act
    const result = await ctx.service.recordHealthMetric(userId, criticalMetric);

    // Assert
    expect(result.metadata).toBeDefined();
    expect(result.metadata?.severity).toBe('CRITICAL');
    // Check that we emitted two events: metric recorded and anomaly detected
    expect(mockKafkaService.emit).toHaveBeenCalledTimes(2);
    expect(mockKafkaService.emit).toHaveBeenCalledWith(
      'health.events',
      expect.objectContaining({
        type: 'health.metric.anomaly.detected',
        userId,
        data: expect.objectContaining({
          metricType: criticalMetric.type,
          value: 181,
          anomaly: expect.any(Object),
        }),
      }),
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

    mockPrismaService.healthMetric.create.mockResolvedValue(expectedMetric);
    mockPrismaService.healthGoal.findMany.mockResolvedValue([]);
    mockPrismaService.$transaction.mockImplementation(async (fn) => fn(mockPrismaService));

    // Act
    await ctx.service.recordHealthMetric(userId, validMetricDto);

    // Assert
    const cacheKey = `metrics:${userId}:${validMetricDto.type}`;
    expect(mockRedisService.zadd).toHaveBeenCalledWith(
      cacheKey,
      expect.any(Number), // timestamp as score
      JSON.stringify(expectedMetric),
    );
    expect(mockRedisService.expire).toHaveBeenCalledWith(cacheKey, 300); // 5 minutes
  });

  it('should emit gamification event after recording metric', async () => {
    // Arrange
    const expectedMetric = {
      id: 'metric-123',
      userId,
      ...validMetricDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.healthMetric.create.mockResolvedValue(expectedMetric);
    mockPrismaService.healthGoal.findMany.mockResolvedValue([]);
    mockPrismaService.$transaction.mockImplementation(async (fn) => fn(mockPrismaService));

    // Act
    await ctx.service.recordHealthMetric(userId, validMetricDto);

    // Assert
    expect(mockKafkaService.emit).toHaveBeenCalledWith(
      'health.events',
      expect.objectContaining({
        type: 'health.metric.recorded',
        userId,
        journey: 'health',
        data: expect.objectContaining({
          metricId: expectedMetric.id,
          metricType: validMetricDto.type,
        }),
      }),
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

    const activeGoal = {
      id: 'goal-123',
      userId,
      type: MetricType.STEPS,
      targetValue: 10000,
      currentValue: 3000,
      frequency: 'DAILY',
      status: 'ACTIVE',
    };

    mockPrismaService.healthGoal.findMany.mockResolvedValue([activeGoal]);
    mockPrismaService.healthMetric.create.mockResolvedValue({
      id: 'metric-123',
      userId,
      ...stepsMetric,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockPrismaService.$transaction.mockImplementation(async (fn) => fn(mockPrismaService));

    // Act
    await ctx.service.recordHealthMetric(userId, stepsMetric);

    // Assert
    expect(mockPrismaService.healthGoal.update).toHaveBeenCalledWith({
      where: { id: activeGoal.id },
      data: expect.objectContaining({
        currentValue: 8000, // 3000 + 5000
        progress: 80, // 8000/10000 * 100
      }),
    });
  });
});
