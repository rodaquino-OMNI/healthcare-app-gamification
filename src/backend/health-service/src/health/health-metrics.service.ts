import { KafkaService } from '@app/shared/kafka/kafka.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable } from '@nestjs/common';

import { CreateMetricDto } from './dto/create-metric.dto';
import { MetricType } from './types/health.types';

/** Shape of a Prisma health metric row (mirrors the HealthMetric Prisma model) */
export interface PrismaHealthMetric {
    id: string;
    userId: string;
    type: string;
    value: number;
    unit: string;
    timestamp: Date;
    source: string | null;
    notes: string | null;
    trend: number | null;
    isAbnormal: boolean | null;
    metadata: unknown;
    createdAt: Date;
    updatedAt: Date;
}

/** Anomaly detection result */
export interface AnomalyDetection {
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    type: 'THRESHOLD_VIOLATION' | 'STATISTICAL_ANOMALY' | 'TREND_CHANGE';
    message?: string;
    zScore?: number;
}

/** Prisma transaction client (subset used by metric operations) */
export interface PrismaTransactionClient {
    healthMetric: {
        create: (args: { data: Record<string, unknown> }) => Promise<PrismaHealthMetric>;
        findMany: (args: Record<string, unknown>) => Promise<PrismaHealthMetric[]>;
    };
    healthGoal: {
        findMany: (args: Record<string, unknown>) => Promise<
            Array<{
                id: string;
                currentValue: number;
                targetValue: number;
                type: string;
            }>
        >;
        update: (args: Record<string, unknown>) => Promise<unknown>;
    };
}

/** Metric range definitions for validation and anomaly detection */
export const METRIC_RANGES: Record<
    MetricType,
    { min: number; max: number; criticalLow: number; criticalHigh: number }
> = {
    [MetricType.HEART_RATE]: { min: 30, max: 250, criticalLow: 40, criticalHigh: 180 },
    [MetricType.BLOOD_PRESSURE_SYSTOLIC]: { min: 70, max: 250, criticalLow: 90, criticalHigh: 180 },
    [MetricType.BLOOD_PRESSURE_DIASTOLIC]: {
        min: 40,
        max: 150,
        criticalLow: 60,
        criticalHigh: 120,
    },
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

/**
 * Service responsible for metric-level operations:
 * anomaly detection, caching, event emission, and historical data retrieval.
 */
@Injectable()
export class HealthMetricsService {
    private readonly CACHE_TTL = 300; // 5 minutes
    private readonly ANOMALY_HISTORY_DAYS = 30;
    private readonly Z_SCORE_THRESHOLD = 3;

    constructor(
        private readonly redisService: RedisService,
        private readonly kafkaService: KafkaService
    ) {}

    /**
     * Gets historical metrics for anomaly detection
     */
    async getHistoricalMetrics(
        prisma: PrismaTransactionClient,
        userId: string,
        type: MetricType
    ): Promise<PrismaHealthMetric[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - this.ANOMALY_HISTORY_DAYS);

        return prisma.healthMetric.findMany({
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
     */
    detectAnomalies(
        metricDto: CreateMetricDto,
        historicalMetrics: PrismaHealthMetric[]
    ): AnomalyDetection | null {
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
        const statisticalAnomaly = this.detectStatisticalAnomaly(
            metricDto.value,
            historicalMetrics
        );
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
     * Updates metric cache in Redis
     */
    async updateMetricCache(
        userId: string,
        type: MetricType,
        metric: PrismaHealthMetric
    ): Promise<void> {
        const cacheKey = `metrics:${userId}:${type}`;
        const score = metric.timestamp.getTime();
        const value = JSON.stringify(metric);

        await this.redisService.zadd(cacheKey, score, value);
        await this.redisService.expire(cacheKey, this.CACHE_TTL);
    }

    /**
     * Emits metric events to Kafka
     */
    async emitMetricEvents(
        userId: string,
        metric: PrismaHealthMetric,
        anomaly: AnomalyDetection | null
    ): Promise<void> {
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
     * Detects threshold-based anomalies
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
     */
    private detectStatisticalAnomaly(
        value: number,
        historicalMetrics: PrismaHealthMetric[]
    ): AnomalyDetection | null {
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
     * Detects trend anomalies using simple linear regression
     */
    private detectTrendAnomaly(
        value: number,
        historicalMetrics: PrismaHealthMetric[]
    ): AnomalyDetection | null {
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
}
