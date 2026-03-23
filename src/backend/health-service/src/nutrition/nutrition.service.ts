import { PrismaService } from '@app/shared/database/prisma.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateNutritionRecordDto } from './dto/create-nutrition-record.dto';
import { FilterNutritionDto } from './dto/filter-nutrition.dto';
import { UpdateNutritionRecordDto } from './dto/update-nutrition-record.dto';

const CACHE_TTL_SECONDS = 300;
const DAILY_SUMMARY_CACHE_TTL = 60;

interface NutritionRecord {
    id: string;
    userId: string;
    mealType: string;
    foods: object;
    calories: number;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
    date: Date;
    notes: string | null;
}

interface NutritionListResult {
    records: NutritionRecord[];
    total: number;
    limit: number;
    offset: number;
}

interface DailySummary {
    date: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    mealCount: number;
}

interface NutritionGoals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

@Injectable()
export class NutritionService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService
    ) {}

    async listNutritionRecords(
        userId: string,
        filters: FilterNutritionDto
    ): Promise<NutritionListResult> {
        const { startDate, endDate, limit = 20, offset = 0 } = filters;

        const cacheKey = `nutrition:list:${userId}:${startDate ?? ''}:${endDate ?? ''}:${limit}:${offset}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as NutritionListResult;
        }

        const where: Record<string, unknown> = { userId };
        if (startDate || endDate) {
            where['date'] = {};
            if (startDate) {
                (where['date'] as Record<string, unknown>)['gte'] = new Date(startDate);
            }
            if (endDate) {
                (where['date'] as Record<string, unknown>)['lte'] = new Date(endDate);
            }
        }

        const [records, total] = await Promise.all([
            this.prismaService.nutritionLog.findMany({
                where,
                orderBy: { date: 'desc' },
                take: limit,
                skip: offset,
            }),
            this.prismaService.nutritionLog.count({ where }),
        ]);

        const result = { records: records as unknown as NutritionRecord[], total, limit, offset };
        await this.redisService.set(cacheKey, JSON.stringify(result), CACHE_TTL_SECONDS);
        return result;
    }

    async getNutritionRecord(id: string, userId: string): Promise<NutritionRecord> {
        const cacheKey = `nutrition:record:${id}:${userId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as NutritionRecord;
        }

        const record = await this.prismaService.nutritionLog.findFirst({
            where: { id, userId },
        });

        if (!record) {
            throw new NotFoundException(`Nutrition record ${id} not found`);
        }

        await this.redisService.set(cacheKey, JSON.stringify(record), CACHE_TTL_SECONDS);
        return record as unknown as NutritionRecord;
    }

    async createNutritionRecord(
        userId: string,
        dto: CreateNutritionRecordDto
    ): Promise<NutritionRecord> {
        const record = await this.prismaService.nutritionLog.create({
            data: {
                userId,
                mealType: dto.mealType,
                foods: dto.foods as object,
                calories: dto.calories,
                protein: dto.protein,
                carbs: dto.carbs,
                fat: dto.fat,
                date: dto.date,
                notes: dto.notes,
            },
        });

        await this.invalidateUserCache(userId);
        return record as unknown as NutritionRecord;
    }

    async updateNutritionRecord(
        id: string,
        userId: string,
        dto: UpdateNutritionRecordDto
    ): Promise<NutritionRecord> {
        const existing = await this.prismaService.nutritionLog.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            throw new NotFoundException(`Nutrition record ${id} not found`);
        }

        const updated = await this.prismaService.nutritionLog.update({
            where: { id },
            data: {
                ...(dto.mealType !== undefined && { mealType: dto.mealType }),
                ...(dto.foods !== undefined && { foods: dto.foods as object }),
                ...(dto.calories !== undefined && { calories: dto.calories }),
                ...(dto.protein !== undefined && { protein: dto.protein }),
                ...(dto.carbs !== undefined && { carbs: dto.carbs }),
                ...(dto.fat !== undefined && { fat: dto.fat }),
                ...(dto.date !== undefined && { date: dto.date }),
                ...(dto.notes !== undefined && { notes: dto.notes }),
            },
        });

        await this.invalidateUserCache(userId);
        await this.redisService.del(`nutrition:record:${id}:${userId}`);
        return updated as unknown as NutritionRecord;
    }

    async getDailySummary(userId: string, dateStr?: string): Promise<DailySummary> {
        const targetDate = dateStr ? new Date(dateStr) : new Date();
        const dayStart = new Date(targetDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(targetDate);
        dayEnd.setHours(23, 59, 59, 999);

        const cacheKey = `nutrition:daily:${userId}:${dayStart.toISOString().split('T')[0]}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as DailySummary;
        }

        const records = await this.prismaService.nutritionLog.findMany({
            where: {
                userId,
                date: { gte: dayStart, lte: dayEnd },
            },
        });

        const summary: DailySummary = {
            date: dayStart.toISOString().split('T')[0] ?? '',
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            mealCount: records.length,
        };

        for (const record of records) {
            summary.totalCalories += record.calories;
            summary.totalProtein += record.protein ?? 0;
            summary.totalCarbs += record.carbs ?? 0;
            summary.totalFat += record.fat ?? 0;
        }

        summary.totalCalories = Math.round(summary.totalCalories * 10) / 10;
        summary.totalProtein = Math.round(summary.totalProtein * 10) / 10;
        summary.totalCarbs = Math.round(summary.totalCarbs * 10) / 10;
        summary.totalFat = Math.round(summary.totalFat * 10) / 10;

        await this.redisService.set(cacheKey, JSON.stringify(summary), DAILY_SUMMARY_CACHE_TTL);
        return summary;
    }

    async getNutritionGoals(userId: string): Promise<NutritionGoals> {
        const cacheKey = `nutrition:goals:${userId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as NutritionGoals;
        }

        // Default recommended daily values; in production from a user-profile service
        const goals: NutritionGoals = {
            calories: 2000,
            protein: 50,
            carbs: 275,
            fat: 78,
        };

        await this.redisService.set(cacheKey, JSON.stringify(goals), CACHE_TTL_SECONDS);
        return goals;
    }

    private async invalidateUserCache(userId: string): Promise<void> {
        const pattern = `nutrition:list:${userId}:*`;
        await this.redisService.del(pattern);
        await this.redisService.del(`nutrition:daily:${userId}:*`);
    }
}
