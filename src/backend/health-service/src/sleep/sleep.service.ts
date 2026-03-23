import { PrismaService } from '@app/shared/database/prisma.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateSleepRecordDto } from './dto/create-sleep-record.dto';
import { FilterSleepDto } from './dto/filter-sleep.dto';
import { UpdateSleepRecordDto } from './dto/update-sleep-record.dto';
import { MetricType, MetricSource } from '../health/types/health.types';

interface SleepStages {
    light: number;
    deep: number;
    rem: number;
    awake: number;
}

interface SleepRecord {
    id: string;
    userId: string;
    date: Date;
    durationMinutes: number;
    quality: string;
    bedtime: Date | null;
    wakeTime: Date | null;
    stages: SleepStages | null;
    notes: string | null;
    source: string;
    createdAt: Date;
    updatedAt: Date;
}

interface SleepTrend {
    averageDuration: number;
    averageQuality: string;
    totalRecords: number;
    weeklyData: Array<{ date: string; duration: number; quality: string }>;
}

type SleepMetadata = Record<string, number | string | null | SleepStages>;

interface RawMetric {
    id: string;
    userId: string;
    value: number;
    timestamp: Date;
    source: string | null;
    notes: string | null;
    metadata: unknown;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class SleepService {
    private readonly CACHE_TTL = 300;

    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService
    ) {}

    async listSleepRecords(
        userId: string,
        filters: FilterSleepDto
    ): Promise<{
        data: SleepRecord[];
        pagination: { limit: number; offset: number; total: number };
    }> {
        const limit = filters.limit ?? 10;
        const offset = filters.offset ?? 0;

        const where: {
            userId: string;
            type: MetricType;
            timestamp?: { gte?: Date; lte?: Date };
        } = {
            userId,
            type: MetricType.SLEEP,
        };

        if (filters.startDate || filters.endDate) {
            const timestampFilter: { gte?: Date; lte?: Date } = {};
            if (filters.startDate) {
                timestampFilter.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                timestampFilter.lte = new Date(filters.endDate);
            }
            where.timestamp = timestampFilter;
        }

        const [data, total] = await Promise.all([
            this.prismaService.healthMetric.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                take: limit,
                skip: offset,
            }),
            this.prismaService.healthMetric.count({ where }),
        ]);

        return {
            data: data.map((m: RawMetric) => this.transformToSleepRecord(m)),
            pagination: { limit, offset, total },
        };
    }

    async getSleepRecord(userId: string, id: string): Promise<SleepRecord> {
        const record = await this.prismaService.healthMetric.findFirst({
            where: { id, userId, type: MetricType.SLEEP },
        });

        if (!record) {
            throw new NotFoundException(`Sleep record with ID ${id} not found`);
        }

        return this.transformToSleepRecord(record);
    }

    async createSleepRecord(userId: string, dto: CreateSleepRecordDto): Promise<SleepRecord> {
        const metadata: SleepMetadata = {
            durationMinutes: dto.durationMinutes,
            quality: dto.quality,
            bedtime: dto.bedtime ? dto.bedtime.toISOString() : null,
            wakeTime: dto.wakeTime ? dto.wakeTime.toISOString() : null,
            stages: dto.stages ?? null,
        };

        const metric = await this.prismaService.healthMetric.create({
            data: {
                id: uuidv4(),
                userId,
                type: MetricType.SLEEP,
                value: dto.durationMinutes,
                unit: 'minutes',
                timestamp: dto.date,
                source: dto.source ?? MetricSource.USER_INPUT,
                notes: dto.notes ?? null,
                isAbnormal: false,
                metadata: JSON.parse(JSON.stringify(metadata)),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        await this.invalidateCache(userId);
        return this.transformToSleepRecord(metric);
    }

    async updateSleepRecord(
        userId: string,
        id: string,
        dto: UpdateSleepRecordDto
    ): Promise<SleepRecord> {
        const existing = await this.prismaService.healthMetric.findFirst({
            where: { id, userId, type: MetricType.SLEEP },
        });

        if (!existing) {
            throw new NotFoundException(`Sleep record with ID ${id} not found`);
        }

        const existingMetadata = (existing.metadata as Record<string, unknown>) ?? {};

        const updatedMetadata: SleepMetadata = {
            durationMinutes: dto.durationMinutes ?? (existingMetadata['durationMinutes'] as number),
            quality: dto.quality ?? (existingMetadata['quality'] as string),
            bedtime: dto.bedtime
                ? dto.bedtime.toISOString()
                : (existingMetadata['bedtime'] as string | null),
            wakeTime: dto.wakeTime
                ? dto.wakeTime.toISOString()
                : (existingMetadata['wakeTime'] as string | null),
            stages: dto.stages ?? (existingMetadata['stages'] as SleepStages | null),
        };

        const updated = await this.prismaService.healthMetric.update({
            where: { id },
            data: {
                value: dto.durationMinutes ?? existing.value,
                timestamp: dto.date ?? existing.timestamp,
                source: dto.source ?? existing.source,
                notes: dto.notes !== undefined ? dto.notes : existing.notes,
                metadata: JSON.parse(JSON.stringify(updatedMetadata)),
                updatedAt: new Date(),
            },
        });

        await this.invalidateCache(userId);
        return this.transformToSleepRecord(updated);
    }

    async getSleepTrends(userId: string): Promise<SleepTrend> {
        const cacheKey = `sleep:trends:${userId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as SleepTrend;
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const records = await this.prismaService.healthMetric.findMany({
            where: {
                userId,
                type: MetricType.SLEEP,
                timestamp: { gte: thirtyDaysAgo },
            },
            orderBy: { timestamp: 'asc' },
        });

        const totalDuration = records.reduce(
            (sum: number, r: { value: number }) => sum + r.value,
            0
        );
        const avgDuration = records.length > 0 ? totalDuration / records.length : 0;

        const weeklyData = records.map(
            (r: { timestamp: Date; value: number; metadata: unknown }) => {
                const meta = (r.metadata as Record<string, string>) ?? {};
                return {
                    date: r.timestamp.toISOString().split('T')[0],
                    duration: r.value,
                    quality: meta['quality'] ?? 'UNKNOWN',
                };
            }
        );

        const trend: SleepTrend = {
            averageDuration: Math.round(avgDuration),
            averageQuality: this.calculateAverageQuality(records),
            totalRecords: records.length,
            weeklyData,
        };

        await this.redisService.set(cacheKey, JSON.stringify(trend), this.CACHE_TTL);
        return trend;
    }

    async getSleepGoals(userId: string): Promise<unknown[]> {
        return this.prismaService.healthGoal.findMany({
            where: { recordId: userId, type: 'SLEEP' },
        });
    }

    private calculateAverageQuality(records: Array<{ metadata: unknown }>): string {
        const qualityMap: Record<string, number> = {
            POOR: 1,
            FAIR: 2,
            GOOD: 3,
            EXCELLENT: 4,
        };
        const reverseMap: Record<number, string> = {
            1: 'POOR',
            2: 'FAIR',
            3: 'GOOD',
            4: 'EXCELLENT',
        };

        if (records.length === 0) {
            return 'UNKNOWN';
        }

        const total = records.reduce((sum, r) => {
            const meta = (r.metadata as Record<string, string>) ?? {};
            return sum + (qualityMap[meta['quality']] ?? 0);
        }, 0);

        const avg = Math.round(total / records.length);
        return reverseMap[avg] ?? 'FAIR';
    }

    private async invalidateCache(userId: string): Promise<void> {
        await this.redisService.del(`sleep:trends:${userId}`);
    }

    private transformToSleepRecord(metric: RawMetric): SleepRecord {
        const meta = (metric.metadata as Record<string, unknown>) ?? {};
        return {
            id: metric.id,
            userId: metric.userId,
            date: metric.timestamp,
            durationMinutes: metric.value,
            quality: (meta['quality'] as string) ?? 'UNKNOWN',
            bedtime: meta['bedtime'] ? new Date(meta['bedtime'] as string) : null,
            wakeTime: meta['wakeTime'] ? new Date(meta['wakeTime'] as string) : null,
            stages: (meta['stages'] as SleepStages) ?? null,
            notes: metric.notes,
            source: metric.source ?? MetricSource.USER_INPUT,
            createdAt: metric.createdAt,
            updatedAt: metric.updatedAt,
        };
    }
}
