import {
    createHealthServiceTestModule,
    HealthServiceTestContext,
    mockPrismaService,
    mockRedisService,
} from './test-helpers/health-service.mocks';
import { MetricType } from './types/health.types';

describe('HealthService - getHealthMetrics', () => {
    let ctx: HealthServiceTestContext;

    beforeEach(async () => {
        jest.clearAllMocks();
        ctx = await createHealthServiceTestModule();
    });

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
        const result = await ctx.service.getHealthMetrics(userId, {
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
        const result = await ctx.service.getHealthMetrics(userId, {
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
        await ctx.service.getHealthMetrics(userId, {
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
