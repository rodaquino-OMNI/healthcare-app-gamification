import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { ConfigService } from '@nestjs/config';
import { MetricType, MetricSource } from './types/health.types';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateMetricDto } from './dto/create-metric.dto';

describe('HealthService', () => {
  let service: HealthService;
  let prismaService: jest.Mocked<PrismaService>;
  let redisService: jest.Mocked<RedisService>;
  let kafkaService: jest.Mocked<KafkaService>;
  let configService: jest.Mocked<ConfigService>;

  const mockPrismaService = {
    healthMetric: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
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
    zadd: jest.fn(),
    zrange: jest.fn(),
    del: jest.fn(),
    expire: jest.fn(),
  };

  const mockKafkaService = {
    emit: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-value'),
  };

  beforeEach(async () => {
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
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    prismaService = module.get(PrismaService);
    redisService = module.get(RedisService);
    kafkaService = module.get(KafkaService);
    configService = module.get(ConfigService);

    // Clear all mocks between tests
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recordHealthMetric', () => {
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
      await expect(service.recordHealthMetric(userId, invalidMetric))
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
      await expect(service.recordHealthMetric(userId, outOfRangeMetric))
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
      const result = await service.recordHealthMetric(userId, validMetricDto);

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
      const result = await service.recordHealthMetric(userId, criticalMetric);

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
      await service.recordHealthMetric(userId, validMetricDto);

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
      await service.recordHealthMetric(userId, validMetricDto);

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
      await service.recordHealthMetric(userId, stepsMetric);

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

  describe('getHealthMetrics', () => {
    const userId = 'test-user-123';

    it('should return cached metrics if available', async () => {
      // Arrange
      const cachedData = {
        data: [
          { id: '1', type: 'HEART_RATE', value: 72 },
          { id: '2', type: 'HEART_RATE', value: 75 },
        ],
        pagination: { limit: 10, offset: 0, total: 2 },
      };
      mockRedisService.get.mockResolvedValue(JSON.stringify(cachedData));

      // Act
      const result = await service.getHealthMetrics(userId, {
        types: [MetricType.HEART_RATE],
        limit: 10,
        offset: 0,
      });

      // Assert
      expect(result).toEqual(cachedData);
      expect(mockPrismaService.healthMetric.findMany).not.toHaveBeenCalled();
    });

    it('should query database when cache miss', async () => {
      // Arrange
      mockRedisService.get.mockResolvedValue(null);
      const timestamp = new Date();
      const dbMetrics = [
        { 
          id: '1', 
          userId,
          type: 'HEART_RATE', 
          value: 72, 
          unit: 'bpm',
          timestamp,
          source: 'USER_INPUT',
          notes: null,
          anomaly: null,
          trend: null,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        { 
          id: '2', 
          userId,
          type: 'HEART_RATE', 
          value: 75, 
          unit: 'bpm',
          timestamp,
          source: 'USER_INPUT',
          notes: null,
          anomaly: null,
          trend: null,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ];
      mockPrismaService.healthMetric.findMany.mockResolvedValue(dbMetrics);
      mockPrismaService.healthMetric.count.mockResolvedValue(2);

      // Act
      const result = await service.getHealthMetrics(userId, {
        types: [MetricType.HEART_RATE],
        limit: 10,
        offset: 0,
      });

      // Assert
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toMatchObject({
        id: '1',
        userId,
        type: 'HEART_RATE',
        value: 72,
        unit: 'bpm',
        timestamp,
      });
      expect(result.data[1]).toMatchObject({
        id: '2',
        userId,
        type: 'HEART_RATE',
        value: 75,
        unit: 'bpm',
        timestamp,
      });
      expect(result.pagination).toEqual({ limit: 10, offset: 0, total: 2 });
      expect(mockRedisService.set).toHaveBeenCalled();
    });

    it('should apply filters correctly', async () => {
      // Arrange
      mockRedisService.get.mockResolvedValue(null);
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      mockPrismaService.healthMetric.findMany.mockResolvedValue([]);
      mockPrismaService.healthMetric.count.mockResolvedValue(0);

      // Act
      await service.getHealthMetrics(userId, {
        types: [MetricType.HEART_RATE, MetricType.BLOOD_PRESSURE_SYSTOLIC],
        startDate,
        endDate,
        limit: 20,
        offset: 10,
      });

      // Assert
      expect(mockPrismaService.healthMetric.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          type: { in: [MetricType.HEART_RATE, MetricType.BLOOD_PRESSURE_SYSTOLIC] },
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 20,
        skip: 10,
      });
    });
  });

  describe('anomaly detection', () => {
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
      const result = await service.recordHealthMetric(userId, anomalousMetric);

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
      const result = await service.recordHealthMetric(userId, continuingTrendMetric);

      // Assert
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.type).toBe('TREND_CHANGE');
    });
  });
});