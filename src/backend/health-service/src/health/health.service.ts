/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaService } from '@app/shared/database/prisma.service';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { HealthMetric } from './entities/health-metric.entity';
import { MetricType, MetricSource } from './types/health.types';

// Metric range definitions for validation
const METRIC_RANGES: Record<MetricType, { min: number; max: number; criticalLow: number; criticalHigh: number }> = {
    [MetricType.HEART_RATE]: { min: 30, max: 250, criticalLow: 40, criticalHigh: 180 },
    [MetricType.BLOOD_PRESSURE_SYSTOLIC]: { min: 70, max: 250, criticalLow: 90, criticalHigh: 180 },
    [MetricType.BLOOD_PRESSURE_DIASTOLIC]: { min: 40, max: 150, criticalLow: 60, criticalHigh: 120 },
    [MetricType.BLOOD_GLUCOSE]: { min: 20, max: 600, criticalLow: 70, criticalHigh: 180 },
    [MetricType.OXYGEN_SATURATION]: { min: 50, max: 100, criticalLow: 90, criticalHigh: 100 },
    [MetricType.BODY_TEMPERATURE]: { min: 35, max: 42, criticalLow: 36, criticalHigh: 39 },
    [MetricType.RESPIRATORY_RATE]: { min: 8, max: 40, criticalLow: 12, criticalHigh: 25 },
    [MetricType.WEIGHT]: { min: 1, max: 500, criticalLow: 0, criticalHigh: 0 },
    [MetricType.STEPS]: { min: 0, max: 100000, criticalLow: 0, criticalHigh: 0 },
    [MetricType.SLEEP]: { min: 0, max: 24, criticalLow: 0, criticalHigh: 0 },
    [MetricType.CALORIES]: { min: 0, max: 10000, criticalLow: 0, criticalHigh: 0 },
    [MetricType.DISTANCE]: { min: 0, max: 200, criticalLow: 0, criticalHigh: 0 },
    [MetricType.FLOORS]: { min: 0, max: 500, criticalLow: 0, criticalHigh: 0 },
    [MetricType.ACTIVITY]: { min: 0, max: 1440, criticalLow: 0, criticalHigh: 0 },
    [MetricType.UNKNOWN]: { min: 0, max: Number.MAX_SAFE_INTEGER, criticalLow: 0, criticalHigh: 0 },
};

interface AnomalyDetection {
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    type: 'THRESHOLD_VIOLATION' | 'STATISTICAL_ANOMALY' | 'TREND_CHANGE';
    message?: string;
    zScore?: number;
}

interface GetMetricsFilters {
    types?: MetricType[];
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}

/**
 * Service responsible for handling health-related operations
 */
@Injectable()
export class HealthService {
    private readonly CACHE_TTL = 300; // 5 minutes
    private readonly ANOMALY_HISTORY_DAYS = 30;
    private readonly Z_SCORE_THRESHOLD = 3;

    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly kafkaService: KafkaService,
        private readonly configService: ConfigService
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
        return await this.prismaService.$transaction(async (prisma) => {
            // Get historical data for anomaly detection
            const historicalMetrics = await this.getHistoricalMetrics(prisma, userId, metricDto.type);

            // Detect anomalies
            const anomaly = await this.detectAnomalies(metricDto, historicalMetrics);

            // Create the metric
            const metric = await (prisma as any).healthMetric.create({
                data: {
                    id: uuidv4(),
                    userId,
                    type: metricDto.type,
                    value: metricDto.value,
                    unit: metricDto.unit,
                    timestamp: metricDto.timestamp || new Date(),
                    source: metricDto.source,
                    notes: metricDto.notes,
                    anomaly: anomaly ? JSON.stringify(anomaly) : undefined,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            // Update cache
            await this.updateMetricCache(userId, metricDto.type, metric);

            // Emit events
            await this.emitMetricEvents(userId, metric, anomaly);

            // Check and update health goals
            await this.checkAndUpdateHealthGoals(prisma, userId, metric);

            // Transform the metric to match entity structure
            return this.transformToHealthMetric(metric);
        });
    }

    /**
     * Validates metric input values
     * @param metricDto Metric data to validate
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
     * @param type Metric type
     * @param value Metric value
     */
    private validateMetricRange(type: MetricType, value: number): void {
        const range = METRIC_RANGES[type];
        if (!range) {
            return;
        } // No range validation for unknown types

        if (value < range.min || value > range.max) {
            throw new BadRequestException(`${type} value must be between ${range.min} and ${range.max}`);
        }
    }

    /**
     * Gets historical metrics for anomaly detection
     * @param prisma Prisma transaction client
     * @param userId User ID
     * @param type Metric type
     * @returns Historical metrics
     */
    private async getHistoricalMetrics(prisma: any, userId: string, type: MetricType): Promise<any[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - this.ANOMALY_HISTORY_DAYS);

        return await prisma.healthMetric.findMany({
            where: {
                userId,
                type,
                timestamp: { gte: startDate },
            },
            orderBy: { timestamp: 'desc' },
            take: 100, // Limit to last 100 records
        });
    }

    /**
     * Detects anomalies in the metric value
     * @param metricDto New metric data
     * @param historicalMetrics Historical metrics for comparison
     * @returns Anomaly detection result or null
     */
    private async detectAnomalies(
        metricDto: CreateMetricDto,
        historicalMetrics: any[]
    ): Promise<AnomalyDetection | null> {
        // 1. Threshold-based anomaly detection
        const thresholdAnomaly = this.detectThresholdAnomaly(metricDto.type, metricDto.value);
        if (thresholdAnomaly) {
            return thresholdAnomaly;
        }

        // Skip statistical checks if not enough historical data
        if (historicalMetrics.length < 10) {
            return null;
        }

        // 2. Statistical anomaly detection (Z-score)
        const statisticalAnomaly = this.detectStatisticalAnomaly(metricDto.value, historicalMetrics);
        if (statisticalAnomaly) {
            return statisticalAnomaly;
        }

        // 3. Trend anomaly detection
        const trendAnomaly = this.detectTrendAnomaly(metricDto.value, historicalMetrics);
        if (trendAnomaly) {
            return trendAnomaly;
        }

        return null;
    }

    /**
     * Detects threshold-based anomalies
     * @param type Metric type
     * @param value Metric value
     * @returns Anomaly detection result or null
     */
    private detectThresholdAnomaly(type: MetricType, value: number): AnomalyDetection | null {
        const range = METRIC_RANGES[type];
        if (!range || (range.criticalLow === 0 && range.criticalHigh === 0)) {
            return null;
        }

        if (range.criticalLow > 0 && value < range.criticalLow) {
            return {
                severity: 'CRITICAL',
                type: 'THRESHOLD_VIOLATION',
                message: `${type} is critically low`,
            };
        }

        if (range.criticalHigh > 0 && value > range.criticalHigh) {
            return {
                severity: 'CRITICAL',
                type: 'THRESHOLD_VIOLATION',
                message: `${type} is critically high`,
            };
        }

        return null;
    }

    /**
     * Detects statistical anomalies using Z-score
     * @param value New metric value
     * @param historicalMetrics Historical metrics
     * @returns Anomaly detection result or null
     */
    private detectStatisticalAnomaly(value: number, historicalMetrics: any[]): AnomalyDetection | null {
        const values = historicalMetrics.map((m) => m.value);
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        if (stdDev === 0) {
            return null;
        } // No variation in data

        const zScore = (value - mean) / stdDev;

        if (Math.abs(zScore) > this.Z_SCORE_THRESHOLD) {
            return {
                severity: 'WARNING',
                type: 'STATISTICAL_ANOMALY',
                message: `Value is ${Math.abs(zScore).toFixed(1)} standard deviations from the mean`,
                zScore,
            };
        }

        return null;
    }

    /**
     * Detects trend anomalies
     * @param value New metric value
     * @param historicalMetrics Historical metrics (ordered by timestamp desc)
     * @returns Anomaly detection result or null
     */
    private detectTrendAnomaly(value: number, historicalMetrics: any[]): AnomalyDetection | null {
        if (historicalMetrics.length < 7) {
            return null;
        } // Need at least a week of data

        // Get last 7 days of data
        const recentMetrics = historicalMetrics.slice(0, 7).reverse(); // Oldest to newest
        const values = recentMetrics.map((m) => m.value);

        // Calculate trend using simple linear regression
        const n = values.length;
        const sumX = values.reduce((sum, _, i) => sum + i, 0);
        const sumY = values.reduce((sum, v) => sum + v, 0);
        const sumXY = values.reduce((sum, v, i) => sum + i * v, 0);
        const sumX2 = values.reduce((sum, _, i) => sum + i * i, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const avgValue = sumY / n;

        // Check if rapid change (slope > 10% of average value per day)
        const rapidChangeThreshold = avgValue * 0.1;

        if (Math.abs(slope) > rapidChangeThreshold) {
            return {
                severity: 'INFO',
                type: 'TREND_CHANGE',
                message: `Rapid ${slope > 0 ? 'increasing' : 'decreasing'} trend detected`,
            };
        }

        return null;
    }

    /**
     * Updates metric cache
     * @param userId User ID
     * @param type Metric type
     * @param metric Metric to cache
     */
    private async updateMetricCache(userId: string, type: MetricType, metric: any): Promise<void> {
        const cacheKey = `metrics:${userId}:${type}`;
        const score = metric.timestamp.getTime();
        const value = JSON.stringify(metric);

        await this.redisService.zadd(cacheKey, score, value);
        await this.redisService.expire(cacheKey, this.CACHE_TTL);
    }

    /**
     * Emits metric events to Kafka
     * @param userId User ID
     * @param metric Created metric
     * @param anomaly Detected anomaly (if any)
     */
    private async emitMetricEvents(userId: string, metric: any, anomaly: AnomalyDetection | null): Promise<void> {
        // Emit general metric recorded event
        await this.kafkaService.emit('health.events', {
            type: 'health.metric.recorded',
            userId,
            journey: 'health',
            timestamp: new Date().toISOString(),
            data: {
                metricId: metric.id,
                metricType: metric.type,
                value: metric.value,
                unit: metric.unit,
            },
        });

        // Emit anomaly event if detected
        if (anomaly) {
            await this.kafkaService.emit('health.events', {
                type: 'health.metric.anomaly.detected',
                userId,
                timestamp: new Date().toISOString(),
                data: {
                    metricId: metric.id,
                    metricType: metric.type,
                    value: metric.value,
                    anomaly,
                },
            });
        }
    }

    /**
     * Checks and updates health goals based on new metric
     * @param prisma Prisma transaction client
     * @param userId User ID
     * @param metric New metric
     */
    private async checkAndUpdateHealthGoals(prisma: any, userId: string, metric: any): Promise<void> {
        // Find active goals for this metric type
        const activeGoals = await prisma.healthGoal.findMany({
            where: {
                userId,
                type: metric.type,
                status: 'ACTIVE',
            },
        });

        for (const goal of activeGoals) {
            let newValue = goal.currentValue;

            // For cumulative metrics (steps, calories, etc.), add to current value
            if (['STEPS', 'CALORIES', 'DISTANCE', 'FLOORS', 'ACTIVITY'].includes(metric.type)) {
                newValue = goal.currentValue + metric.value;
            } else {
                // For instantaneous metrics, use the new value
                newValue = metric.value;
            }

            const progress = Math.min(100, (newValue / goal.targetValue) * 100);

            await prisma.healthGoal.update({
                where: { id: goal.id },
                data: {
                    currentValue: newValue,
                    progress,
                    status: progress >= 100 ? 'COMPLETED' : 'ACTIVE',
                    updatedAt: new Date(),
                },
            });
        }
    }

    /**
     * Transforms Prisma model to HealthMetric entity
     * @param model Prisma model
     * @returns HealthMetric entity
     */
    private transformToHealthMetric(model: any): HealthMetric {
        return {
            id: model.id,
            userId: model.userId,
            type: model.type as MetricType,
            value: model.value,
            unit: model.unit,
            timestamp: model.timestamp,
            source: model.source as MetricSource,
            notes: model.notes,
            trend: model.trend,
            isAbnormal: model.anomaly ? true : false,
            metadata: model.anomaly ? JSON.parse(model.anomaly) : undefined,
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
    ): Promise<{ data: HealthMetric[]; pagination: { limit: number; offset: number; total: number } }> {
        const limit = filters?.limit || 10;
        const offset = filters?.offset || 0;

        // Generate cache key based on filters
        const cacheKey = `metrics:${userId}:${JSON.stringify(filters || {})}`;

        // Try to get from cache first
        const cachedData = await this.redisService.get(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        // Build where clause
        const where: any = { userId };

        if (filters?.types && filters.types.length > 0) {
            where.type = { in: filters.types };
        }

        if (filters?.startDate || filters?.endDate) {
            where.timestamp = {};
            if (filters.startDate) {
                where.timestamp.gte = filters.startDate;
            }
            if (filters.endDate) {
                where.timestamp.lte = filters.endDate;
            }
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
        const transformedData = data.map((m: any) => this.transformToHealthMetric(m));

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
    async createHealthMetric(userId: string, metricData: Partial<CreateMetricDto>): Promise<HealthMetric> {
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
