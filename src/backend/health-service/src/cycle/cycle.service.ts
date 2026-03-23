import { PrismaService } from '@app/shared/database/prisma.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateCycleRecordDto } from './dto/create-cycle-record.dto';
import { FilterCycleDto } from './dto/filter-cycle.dto';
import { UpdateCycleRecordDto } from './dto/update-cycle-record.dto';

interface CycleSymptom {
    type: string;
    severity: string;
    date: string;
}

interface CycleRecordRow {
    id: string;
    userId: string;
    startDate: Date;
    endDate: Date | null;
    cycleLength: number | null;
    periodLength: number | null;
    flowIntensity: string | null;
    symptoms: unknown;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface CyclePrediction {
    predictedNextStart: Date;
    averageCycleLength: number;
    averagePeriodLength: number;
    confidence: number;
}

interface SymptomFrequency {
    type: string;
    count: number;
    severities: string[];
}

interface CycleStats {
    totalCycles: number;
    averageCycleLength: number;
    averagePeriodLength: number;
    shortestCycle: number | null;
    longestCycle: number | null;
}

const CACHE_TTL = 300; // 5 minutes
const MAX_RECORDS_FOR_PREDICTION = 6;

@Injectable()
export class CycleService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService
    ) {}

    async listCycleRecords(
        userId: string,
        filter: FilterCycleDto
    ): Promise<{ records: unknown[]; total: number; limit: number; offset: number }> {
        const { startDate, endDate, limit = 20, offset = 0 } = filter;

        const where: Record<string, unknown> = { userId };

        if (startDate || endDate) {
            where['startDate'] = {};
            if (startDate) {
                (where['startDate'] as Record<string, Date>).gte = new Date(startDate);
            }
            if (endDate) {
                (where['startDate'] as Record<string, Date>).lte = new Date(endDate);
            }
        }

        const [records, total] = await Promise.all([
            this.prismaService.cycleRecord.findMany({
                where,
                orderBy: { startDate: 'desc' },
                take: limit,
                skip: offset,
            }),
            this.prismaService.cycleRecord.count({ where }),
        ]);

        return { records, total, limit, offset };
    }

    async getCycleRecord(userId: string, id: string): Promise<unknown> {
        const record = await this.prismaService.cycleRecord.findFirst({
            where: { id, userId },
        });

        if (!record) {
            throw new NotFoundException(`Cycle record ${id} not found`);
        }

        return record;
    }

    async createCycleRecord(userId: string, dto: CreateCycleRecordDto): Promise<unknown> {
        const record = await this.prismaService.cycleRecord.create({
            data: {
                userId,
                startDate: dto.startDate,
                endDate: dto.endDate ?? null,
                cycleLength: dto.cycleLength ?? null,
                periodLength: dto.periodLength ?? null,
                flowIntensity: dto.flowIntensity ?? null,
                symptoms: dto.symptoms ? (dto.symptoms as unknown as object) : undefined,
                notes: dto.notes ?? null,
            },
        });

        await this.invalidateUserCache(userId);

        return record;
    }

    async updateCycleRecord(
        userId: string,
        id: string,
        dto: UpdateCycleRecordDto
    ): Promise<unknown> {
        await this.getCycleRecord(userId, id);

        const updated = await this.prismaService.cycleRecord.update({
            where: { id },
            data: {
                ...(dto.startDate !== undefined && { startDate: dto.startDate }),
                ...(dto.endDate !== undefined && { endDate: dto.endDate }),
                ...(dto.cycleLength !== undefined && { cycleLength: dto.cycleLength }),
                ...(dto.periodLength !== undefined && { periodLength: dto.periodLength }),
                ...(dto.flowIntensity !== undefined && { flowIntensity: dto.flowIntensity }),
                ...(dto.symptoms !== undefined && { symptoms: dto.symptoms as unknown as object }),
                ...(dto.notes !== undefined && { notes: dto.notes }),
            },
        });

        await this.invalidateUserCache(userId);

        return updated;
    }

    async getPredictions(userId: string): Promise<CyclePrediction> {
        const cacheKey = `cycle:predictions:${userId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as CyclePrediction;
        }

        const recentRecords = await this.prismaService.cycleRecord.findMany({
            where: { userId, cycleLength: { not: null } },
            orderBy: { startDate: 'desc' },
            take: MAX_RECORDS_FOR_PREDICTION,
        });

        const defaultPrediction: CyclePrediction = {
            predictedNextStart: new Date(),
            averageCycleLength: 28,
            averagePeriodLength: 5,
            confidence: 0,
        };

        if (recentRecords.length === 0) {
            return defaultPrediction;
        }

        const typedRecords = recentRecords as CycleRecordRow[];
        const cycleLengths = typedRecords
            .filter((r: CycleRecordRow) => r.cycleLength !== null)
            .map((r: CycleRecordRow) => r.cycleLength as number);

        const periodLengths = typedRecords
            .filter((r: CycleRecordRow) => r.periodLength !== null)
            .map((r: CycleRecordRow) => r.periodLength as number);

        const averageCycleLength =
            cycleLengths.length > 0
                ? Math.round(
                      cycleLengths.reduce((a: number, b: number) => a + b, 0) / cycleLengths.length
                  )
                : 28;

        const averagePeriodLength =
            periodLengths.length > 0
                ? Math.round(
                      periodLengths.reduce((a: number, b: number) => a + b, 0) /
                          periodLengths.length
                  )
                : 5;

        const lastRecord = typedRecords[0];
        const predictedNextStart = new Date(lastRecord.startDate);
        predictedNextStart.setDate(predictedNextStart.getDate() + averageCycleLength);

        const confidence = Math.min(recentRecords.length / MAX_RECORDS_FOR_PREDICTION, 1);

        const prediction: CyclePrediction = {
            predictedNextStart,
            averageCycleLength,
            averagePeriodLength,
            confidence,
        };

        await this.redisService.set(cacheKey, JSON.stringify(prediction), CACHE_TTL);

        return prediction;
    }

    async getCycleHistory(
        userId: string
    ): Promise<{ records: CycleRecordRow[]; stats: CycleStats }> {
        const cacheKey = `cycle:history:${userId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as { records: CycleRecordRow[]; stats: CycleStats };
        }

        const records = await this.prismaService.cycleRecord.findMany({
            where: { userId },
            orderBy: { startDate: 'desc' },
        });

        const typedHistoryRecords = records as CycleRecordRow[];
        const cycleLengths = typedHistoryRecords
            .filter((r: CycleRecordRow) => r.cycleLength !== null)
            .map((r: CycleRecordRow) => r.cycleLength as number);

        const periodLengths = typedHistoryRecords
            .filter((r: CycleRecordRow) => r.periodLength !== null)
            .map((r: CycleRecordRow) => r.periodLength as number);

        const stats: CycleStats = {
            totalCycles: typedHistoryRecords.length,
            averageCycleLength:
                cycleLengths.length > 0
                    ? Math.round(
                          cycleLengths.reduce((a: number, b: number) => a + b, 0) /
                              cycleLengths.length
                      )
                    : 0,
            averagePeriodLength:
                periodLengths.length > 0
                    ? Math.round(
                          periodLengths.reduce((a: number, b: number) => a + b, 0) /
                              periodLengths.length
                      )
                    : 0,
            shortestCycle: cycleLengths.length > 0 ? Math.min(...cycleLengths) : null,
            longestCycle: cycleLengths.length > 0 ? Math.max(...cycleLengths) : null,
        };

        const result = { records: typedHistoryRecords, stats };
        await this.redisService.set(cacheKey, JSON.stringify(result), CACHE_TTL);

        return result;
    }

    async getSymptomsSummary(userId: string): Promise<SymptomFrequency[]> {
        const cacheKey = `cycle:symptoms:${userId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as SymptomFrequency[];
        }

        const records = await this.prismaService.cycleRecord.findMany({
            where: { userId, symptoms: { not: undefined } },
            select: { symptoms: true },
        });

        const frequencyMap = new Map<string, SymptomFrequency>();

        for (const record of records) {
            if (!record.symptoms) {
                continue;
            }

            const symptoms = record.symptoms as unknown as CycleSymptom[];
            if (!Array.isArray(symptoms)) {
                continue;
            }

            for (const symptom of symptoms) {
                if (!symptom.type) {
                    continue;
                }

                const existing = frequencyMap.get(symptom.type);
                if (existing) {
                    existing.count += 1;
                    if (symptom.severity && !existing.severities.includes(symptom.severity)) {
                        existing.severities.push(symptom.severity);
                    }
                } else {
                    frequencyMap.set(symptom.type, {
                        type: symptom.type,
                        count: 1,
                        severities: symptom.severity ? [symptom.severity] : [],
                    });
                }
            }
        }

        const summary = Array.from(frequencyMap.values()).sort((a, b) => b.count - a.count);
        await this.redisService.set(cacheKey, JSON.stringify(summary), CACHE_TTL);

        return summary;
    }

    private async invalidateUserCache(userId: string): Promise<void> {
        await Promise.all([
            this.redisService.del(`cycle:predictions:${userId}`),
            this.redisService.del(`cycle:history:${userId}`),
            this.redisService.del(`cycle:symptoms:${userId}`),
        ]);
    }
}
