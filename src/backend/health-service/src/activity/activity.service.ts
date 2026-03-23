import { PrismaService } from '@app/shared/database/prisma.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateActivityRecordDto, ActivityType } from './dto/create-activity-record.dto';
import { FilterActivityDto } from './dto/filter-activity.dto';
import { UpdateActivityRecordDto } from './dto/update-activity-record.dto';
import { MetricSource, MetricType } from '../health/types/health.types';

/** Represents a stored activity record */
export interface ActivityRecord {
    id: string;
    userId: string;
    type: ActivityType;
    value: number;
    unit: string;
    durationMinutes: number | null;
    activityName: string | null;
    source: MetricSource;
    notes: string | null;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

/** Aggregated summary for a given day */
export interface ActivitySummary {
    date: string;
    totalSteps: number;
    totalCalories: number;
    totalDistanceKm: number;
    activeMinutes: number;
}

/** Activity goal entry */
export interface ActivityGoal {
    id: string;
    userId: string;
    type: ActivityType;
    target: number;
    unit: string;
    period: 'DAILY' | 'WEEKLY';
    progress: number;
    status: 'ACTIVE' | 'COMPLETED';
}

/** Map from ActivityType enum to MetricType for Prisma storage */
const ACTIVITY_TYPE_TO_METRIC: Record<ActivityType, MetricType> = {
    [ActivityType.STEPS]: MetricType.STEPS,
    [ActivityType.CALORIES]: MetricType.CALORIES,
    [ActivityType.DISTANCE]: MetricType.DISTANCE,
    [ActivityType.WORKOUT]: MetricType.ACTIVITY,
    [ActivityType.EXERCISE]: MetricType.ACTIVITY,
};

@Injectable()
export class ActivityService {
    private readonly CACHE_TTL = 300; // 5 minutes

    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService
    ) {}

    /**
     * List paginated activity records for a user with optional date range filter.
     */
    async listActivityRecords(
        userId: string,
        filters: FilterActivityDto
    ): Promise<{
        data: ActivityRecord[];
        pagination: { limit: number; offset: number; total: number };
    }> {
        const limit = filters.limit ?? 10;
        const offset = filters.offset ?? 0;
        const cacheKey = `activity:list:${userId}:${JSON.stringify(filters)}`;

        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as {
                data: ActivityRecord[];
                pagination: { limit: number; offset: number; total: number };
            };
        }

        const activityMetricTypes = [
            MetricType.STEPS,
            MetricType.CALORIES,
            MetricType.DISTANCE,
            MetricType.ACTIVITY,
        ];

        const where: Record<string, unknown> = {
            userId,
            type: { in: activityMetricTypes },
        };

        if (filters.startDate || filters.endDate) {
            const timestampFilter: { gte?: Date; lte?: Date } = {};
            if (filters.startDate) {
                timestampFilter.gte = filters.startDate;
            }
            if (filters.endDate) {
                timestampFilter.lte = filters.endDate;
            }
            where.timestamp = timestampFilter;
        }

        const [rows, total] = await Promise.all([
            this.prismaService.healthMetric.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                take: limit,
                skip: offset,
            }),
            this.prismaService.healthMetric.count({ where }),
        ]);

        const data = rows.map(
            (r: {
                id: string;
                userId: string;
                type: string;
                value: number;
                unit: string;
                timestamp: Date;
                source: string | null;
                notes: string | null;
                metadata: unknown;
                createdAt: Date;
                updatedAt: Date;
            }) => this.toActivityRecord(r)
        );
        const result = { data, pagination: { limit, offset, total } };

        await this.redisService.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);
        return result;
    }

    /**
     * Retrieve a single activity record by ID for the given user.
     */
    async getActivityRecord(userId: string, id: string): Promise<ActivityRecord> {
        const cacheKey = `activity:record:${userId}:${id}`;

        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as ActivityRecord;
        }

        const row = await this.prismaService.healthMetric.findFirst({
            where: { id, userId },
        });

        if (!row) {
            throw new NotFoundException(`Activity record ${id} not found`);
        }

        const record = this.toActivityRecord(row);
        await this.redisService.set(cacheKey, JSON.stringify(record), this.CACHE_TTL);
        return record;
    }

    /**
     * Create a new activity record stored as a HealthMetric.
     */
    async createActivityRecord(
        userId: string,
        dto: CreateActivityRecordDto
    ): Promise<ActivityRecord> {
        const metricType = ACTIVITY_TYPE_TO_METRIC[dto.type];

        const metadata: Record<string, string | number | null> = {
            activityType: dto.type,
            activityName: dto.activityName ?? null,
            durationMinutes: dto.durationMinutes ?? null,
        };

        const row = await this.prismaService.healthMetric.create({
            data: {
                id: uuidv4(),
                userId,
                type: metricType,
                value: dto.value,
                unit: dto.unit,
                timestamp: dto.date,
                source: dto.source ?? MetricSource.USER_INPUT,
                notes: dto.notes ?? null,
                isAbnormal: false,
                metadata: JSON.parse(JSON.stringify(metadata)),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return this.toActivityRecord(row);
    }

    /**
     * Update an existing activity record.
     */
    async updateActivityRecord(
        userId: string,
        id: string,
        dto: UpdateActivityRecordDto
    ): Promise<ActivityRecord> {
        const existing = await this.prismaService.healthMetric.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            throw new NotFoundException(`Activity record ${id} not found`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        if (dto.value !== undefined) {
            updateData.value = dto.value;
        }
        if (dto.unit !== undefined) {
            updateData.unit = dto.unit;
        }
        if (dto.notes !== undefined) {
            updateData.notes = dto.notes;
        }
        if (dto.date !== undefined) {
            updateData.timestamp = dto.date;
        }
        if (dto.source !== undefined) {
            updateData.source = dto.source;
        }

        if (
            dto.type !== undefined ||
            dto.activityName !== undefined ||
            dto.durationMinutes !== undefined
        ) {
            const prevMeta = (existing.metadata as Record<string, unknown>) ?? {};
            updateData.metadata = JSON.parse(
                JSON.stringify({
                    ...prevMeta,
                    ...(dto.type !== undefined ? { activityType: dto.type } : {}),
                    ...(dto.activityName !== undefined ? { activityName: dto.activityName } : {}),
                    ...(dto.durationMinutes !== undefined
                        ? { durationMinutes: dto.durationMinutes }
                        : {}),
                })
            );
            if (dto.type !== undefined) {
                updateData.type = ACTIVITY_TYPE_TO_METRIC[dto.type];
            }
        }

        const updated = (await this.prismaService.healthMetric.update({
            where: { id },
            data: updateData,
        })) as {
            id: string;
            userId: string;
            type: string;
            value: number;
            unit: string;
            timestamp: Date;
            source: string | null;
            notes: string | null;
            metadata: unknown;
            createdAt: Date;
            updatedAt: Date;
        };

        await this.redisService.del(`activity:record:${userId}:${id}`);
        return this.toActivityRecord(updated);
    }

    /**
     * Aggregate today's activity metrics into a summary.
     */
    async getActivitySummary(userId: string): Promise<ActivitySummary> {
        const cacheKey = `activity:summary:${userId}`;

        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as ActivitySummary;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const rows = await this.prismaService.healthMetric.findMany({
            where: {
                userId,
                type: {
                    in: [
                        MetricType.STEPS,
                        MetricType.CALORIES,
                        MetricType.DISTANCE,
                        MetricType.ACTIVITY,
                    ],
                },
                timestamp: { gte: today, lt: tomorrow },
            },
        });

        let totalSteps = 0;
        let totalCalories = 0;
        let totalDistanceKm = 0;
        let activeMinutes = 0;

        for (const row of rows) {
            if (row.type === MetricType.STEPS) {
                totalSteps += row.value;
            } else if (row.type === MetricType.CALORIES) {
                totalCalories += row.value;
            } else if (row.type === MetricType.DISTANCE) {
                totalDistanceKm += row.value;
            } else if (row.type === MetricType.ACTIVITY) {
                const meta = row.metadata as Record<string, unknown> | null;
                const dur = meta?.durationMinutes;
                if (typeof dur === 'number') {
                    activeMinutes += dur;
                }
            }
        }

        const summary: ActivitySummary = {
            date: today.toISOString().split('T')[0] ?? today.toISOString(),
            totalSteps,
            totalCalories,
            totalDistanceKm,
            activeMinutes,
        };

        await this.redisService.set(cacheKey, JSON.stringify(summary), this.CACHE_TTL);
        return summary;
    }

    /**
     * Return placeholder activity goals for the user.
     */
    async getActivityGoals(userId: string): Promise<ActivityGoal[]> {
        const cacheKey = `activity:goals:${userId}`;

        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as ActivityGoal[];
        }

        // Default goals — in a full implementation these would be fetched from a goals table
        const goals: ActivityGoal[] = [
            {
                id: `goal-steps-${userId}`,
                userId,
                type: ActivityType.STEPS,
                target: 10000,
                unit: 'steps',
                period: 'DAILY',
                progress: 0,
                status: 'ACTIVE',
            },
            {
                id: `goal-calories-${userId}`,
                userId,
                type: ActivityType.CALORIES,
                target: 500,
                unit: 'kcal',
                period: 'DAILY',
                progress: 0,
                status: 'ACTIVE',
            },
        ];

        await this.redisService.set(cacheKey, JSON.stringify(goals), this.CACHE_TTL);
        return goals;
    }

    // ---------------------------------------------------------------------------
    // Private helpers
    // ---------------------------------------------------------------------------

    private toActivityRecord(row: {
        id: string;
        userId: string;
        type: string;
        value: number;
        unit: string;
        timestamp: Date;
        source: string | null;
        notes: string | null;
        metadata: unknown;
        createdAt: Date;
        updatedAt: Date;
    }): ActivityRecord {
        const meta = (row.metadata as Record<string, unknown> | null) ?? {};
        const rawType = (meta.activityType as string | undefined) ?? row.type;

        // Map stored metric type back to ActivityType
        let activityType: ActivityType;
        if (Object.values(ActivityType).includes(rawType as ActivityType)) {
            activityType = rawType as ActivityType;
        } else {
            // Fallback mapping from MetricType
            const fallbackMap: Record<string, ActivityType> = {
                [MetricType.STEPS]: ActivityType.STEPS,
                [MetricType.CALORIES]: ActivityType.CALORIES,
                [MetricType.DISTANCE]: ActivityType.DISTANCE,
                [MetricType.ACTIVITY]: ActivityType.EXERCISE,
            };
            activityType = fallbackMap[row.type] ?? ActivityType.EXERCISE;
        }

        const durationMinutes =
            typeof meta.durationMinutes === 'number' ? meta.durationMinutes : null;
        const activityName = typeof meta.activityName === 'string' ? meta.activityName : null;

        return {
            id: row.id,
            userId: row.userId,
            type: activityType,
            value: row.value,
            unit: row.unit,
            durationMinutes,
            activityName,
            source: (row.source ?? MetricSource.USER_INPUT) as MetricSource,
            notes: row.notes,
            date: row.timestamp,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    }
}
