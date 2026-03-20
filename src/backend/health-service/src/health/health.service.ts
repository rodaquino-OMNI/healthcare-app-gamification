import { PrismaService } from '@app/shared/database/prisma.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { HealthMetric } from './entities/health-metric.entity';
import { HealthGoalsService } from './health-goals.service';
import {
    HealthMetricsService,
    PrismaHealthMetric,
    PrismaTransactionClient,
    METRIC_RANGES,
} from './health-metrics.service';
import { MetricType, MetricSource } from './types/health.types';

/** Filters for querying health metrics */
interface GetMetricsFilters {
    types?: MetricType[];
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}

/**
 * Orchestrator service for health-related operations.
 * Delegates anomaly detection, caching, event emission to HealthMetricsService
 * and goal tracking to HealthGoalsService.
 */
@Injectable()
export class HealthService {
    private readonly CACHE_TTL = 300; // 5 minutes

    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly healthMetricsService: HealthMetricsService,
        private readonly healthGoalsService: HealthGoalsService
    ) {}

    /**
     * Records a new health metric with validation and anomaly detection
     * @param userId User ID
     * @param metricDto Health metric data
     * @returns The created health metric
     */
    async recordHealthMetric(userId: string, metricDto: CreateMetricDto): Promise<HealthMetric> {
        // Validate metric input
        this.validateMetricInput(metricDto);

        // Validate metric range based on type
        this.validateMetricRange(metricDto.type, metricDto.value);

        // Use transaction to ensure data consistency
        return this.prismaService.$transaction(async (prisma: unknown) => {
            const tx = prisma as PrismaTransactionClient;
            // Get historical data for anomaly detection
            const historicalMetrics = await this.healthMetricsService.getHistoricalMetrics(
                tx,
                userId,
                metricDto.type
            );

            // Detect anomalies
            const anomaly = this.healthMetricsService.detectAnomalies(metricDto, historicalMetrics);

            // Create the metric
            const metric = await tx.healthMetric.create({
                data: {
                    id: uuidv4(),
                    userId,
                    type: metricDto.type,
                    value: metricDto.value,
                    unit: metricDto.unit,
                    timestamp: metricDto.timestamp || new Date(),
                    source: metricDto.source,
                    notes: metricDto.notes,
                    isAbnormal: anomaly !== null,
                    metadata: anomaly ? JSON.parse(JSON.stringify(anomaly)) : undefined,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            // Update cache
            await this.healthMetricsService.updateMetricCache(userId, metricDto.type, metric);

            // Emit events
            await this.healthMetricsService.emitMetricEvents(userId, metric, anomaly);

            // Check and update health goals
            await this.healthGoalsService.checkAndUpdateHealthGoals(tx, userId, metric);

            // Transform the metric to match entity structure
            return this.transformToHealthMetric(metric);
        });
    }

    /**
     * Validates metric input values
     */
    private validateMetricInput(metricDto: CreateMetricDto): void {
        if (metricDto.value < 0) {
            throw new BadRequestException('Metric value cannot be negative');
        }

        if (!Object.values(MetricType).includes(metricDto.type)) {
            throw new BadRequestException('Invalid metric type');
        }

        if (!metricDto.unit || typeof metricDto.unit !== 'string') {
            throw new BadRequestException('Metric unit is required');
        }
    }

    /**
     * Validates metric value is within acceptable range for its type
     */
    private validateMetricRange(type: MetricType, value: number): void {
        const range = METRIC_RANGES[type];
        if (!range) {
            return;
        } // No range validation for unknown types

        if (value < range.min || value > range.max) {
            throw new BadRequestException(
                `${type} value must be between ${range.min} and ${range.max}`
            );
        }
    }

    /**
     * Transforms Prisma model to HealthMetric entity
     */
    private transformToHealthMetric(model: PrismaHealthMetric): HealthMetric {
        return {
            id: model.id,
            userId: model.userId,
            type: model.type as MetricType,
            value: model.value,
            unit: model.unit,
            timestamp: model.timestamp,
            source: (model.source ?? MetricSource.USER_INPUT) as MetricSource,
            notes: model.notes ?? undefined,
            trend: model.trend ?? undefined,
            isAbnormal: model.isAbnormal ?? false,
            metadata:
                model.metadata !== null && model.metadata !== undefined
                    ? (model.metadata as Record<string, unknown>)
                    : undefined,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }

    /**
     * Gets health metrics with caching and filtering
     * @param userId User ID
     * @param filters Filter options
     * @returns Paginated metrics
     */
    async getHealthMetrics(
        userId: string,
        filters?: GetMetricsFilters
    ): Promise<{
        data: HealthMetric[];
        pagination: { limit: number; offset: number; total: number };
    }> {
        const limit = filters?.limit || 10;
        const offset = filters?.offset || 0;

        // Generate cache key based on filters
        const cacheKey = `metrics:${userId}:${JSON.stringify(filters || {})}`;

        // Try to get from cache first
        const cachedData = await this.redisService.get(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData) as {
                data: HealthMetric[];
                pagination: { limit: number; offset: number; total: number };
            };
        }

        // Build where clause
        const where: Record<string, unknown> = { userId };

        if (filters?.types && filters.types.length > 0) {
            where.type = { in: filters.types };
        }

        if (filters?.startDate || filters?.endDate) {
            const timestampFilter: { gte?: Date; lte?: Date } = {};
            if (filters.startDate) {
                timestampFilter.gte = filters.startDate;
            }
            if (filters.endDate) {
                timestampFilter.lte = filters.endDate;
            }
            where.timestamp = timestampFilter;
        }

        // Execute queries
        const [data, total] = await Promise.all([
            this.prismaService.healthMetric.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                take: limit,
                skip: offset,
            }),
            this.prismaService.healthMetric.count({ where }),
        ]);

        // Transform data
        const transformedData = data.map((m) =>
            this.transformToHealthMetric(m as PrismaHealthMetric)
        );

        const result = {
            data: transformedData,
            pagination: { limit, offset, total },
        };

        // Cache the result
        await this.redisService.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);

        return result;
    }

    /**
     * Creates a new health metric (legacy method for compatibility)
     * @param userId User ID
     * @param metricData Metric data
     * @returns The created health metric
     */
    async createHealthMetric(
        userId: string,
        metricData: Partial<CreateMetricDto>
    ): Promise<HealthMetric> {
        const metricDto: CreateMetricDto = {
            type: metricData.type!,
            value: metricData.value!,
            unit: metricData.unit!,
            timestamp: metricData.timestamp || new Date(),
            source: metricData.source || MetricSource.USER_INPUT,
            notes: metricData.notes || null,
        };

        return this.recordHealthMetric(userId, metricDto);
    }

    /**
     * Updates an existing health metric
     * @param id Health metric ID
     * @param updateDto Update data
     * @returns The updated health metric
     */
    async updateHealthMetric(id: string, updateDto: UpdateMetricDto): Promise<HealthMetric> {
        const metric = await this.prismaService.healthMetric.findUnique({
            where: { id },
        });

        if (!metric) {
            throw new NotFoundException(`Health metric with ID ${id} not found`);
        }

        // Validate update data if value is being changed
        if (updateDto.value !== undefined) {
            this.validateMetricRange(metric.type as MetricType, updateDto.value);
        }

        const updated = await this.prismaService.healthMetric.update({
            where: { id },
            data: {
                ...updateDto,
                updatedAt: new Date(),
            },
        });

        return this.transformToHealthMetric(updated);
    }
}
