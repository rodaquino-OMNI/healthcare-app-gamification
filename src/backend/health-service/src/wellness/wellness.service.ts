import { PrismaService } from '@app/shared/database/prisma.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MetricType, GoalType, GoalPeriod, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { CreateMoodCheckInDto } from './dto/create-mood-checkin.dto';
import { FilterWellnessDto } from './dto/filter-wellness.dto';
import { MetricSource } from '../health/types/health.types';

const MOOD_TYPE: MetricType = MetricType.MOOD;
const JOURNAL_TYPE: MetricType = MetricType.JOURNAL;

interface MoodCheckIn {
    id: string;
    userId: string;
    moodLevel: number;
    notes: string | null;
    tags: string[];
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface JournalEntry {
    id: string;
    userId: string;
    title: string;
    content: string;
    moodLevel: number | null;
    tags: string[];
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface WellnessTip {
    id: string;
    title: string;
    description: string;
    category: string;
}

interface DailyPlanItem {
    id: string;
    time: string;
    activity: string;
    completed: boolean;
}

interface WellnessInsight {
    id: string;
    title: string;
    description: string;
    severity: string;
    createdAt: string;
}

interface WellnessChallenge {
    id: string;
    title: string;
    description: string;
    durationDays: number;
    category: string;
    difficulty: string;
}

interface WellnessStreak {
    type: string;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string;
}

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

type MoodMetadata = {
    moodLevel: number;
    notes: string | null;
    tags: string[];
};

type JournalMetadata = {
    title: string;
    content: string;
    moodLevel: number | null;
    tags: string[];
};

@Injectable()
export class WellnessService {
    private readonly CACHE_TTL = 300;

    private readonly cannedChallenges: WellnessChallenge[] = [
        {
            id: 'challenge-mindfulness-7d',
            title: '7-Day Mindfulness',
            description: 'Practice mindfulness meditation for 10 minutes daily',
            durationDays: 7,
            category: 'MEDITATION',
            difficulty: 'BEGINNER',
        },
        {
            id: 'challenge-gratitude-14d',
            title: '14-Day Gratitude Journal',
            description: 'Write three things you are grateful for each day',
            durationDays: 14,
            category: 'JOURNALING',
            difficulty: 'BEGINNER',
        },
        {
            id: 'challenge-breathing-21d',
            title: '21-Day Breathing Challenge',
            description: 'Complete a breathing exercise every morning and evening',
            durationDays: 21,
            category: 'BREATHING',
            difficulty: 'INTERMEDIATE',
        },
        {
            id: 'challenge-sleep-30d',
            title: '30-Day Sleep Hygiene',
            description: 'Follow a consistent bedtime routine for 30 days',
            durationDays: 30,
            category: 'SLEEP',
            difficulty: 'ADVANCED',
        },
    ];

    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService
    ) {}

    async logMoodCheckIn(userId: string, dto: CreateMoodCheckInDto): Promise<MoodCheckIn> {
        const metadata: MoodMetadata = {
            moodLevel: dto.moodLevel,
            notes: dto.notes ?? null,
            tags: dto.tags ?? [],
        };

        const metric = await this.prismaService.healthMetric.create({
            data: {
                id: uuidv4(),
                userId,
                type: MOOD_TYPE,
                value: dto.moodLevel,
                unit: 'level',
                timestamp: dto.timestamp,
                source: MetricSource.USER_INPUT,
                notes: dto.notes ?? null,
                isAbnormal: false,
                metadata: JSON.parse(JSON.stringify(metadata)) as MoodMetadata,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        await this.invalidateCache(userId);
        return this.transformToMoodCheckIn(metric as RawMetric);
    }

    async getMoodHistory(
        userId: string,
        filters: FilterWellnessDto
    ): Promise<{
        data: MoodCheckIn[];
        pagination: { limit: number; offset: number; total: number };
    }> {
        const limit = filters.limit ?? 10;
        const offset = filters.offset ?? 0;

        const where: Prisma.HealthMetricWhereInput = {
            userId,
            type: MOOD_TYPE,
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
            data: data.map((m) => this.transformToMoodCheckIn(m as unknown as RawMetric)),
            pagination: { limit, offset, total },
        };
    }

    getWellnessTips(_userId: string): WellnessTip[] {
        return [
            {
                id: 'tip-hydration',
                title: 'Stay Hydrated',
                description: 'Drink at least 8 glasses of water throughout the day',
                category: 'NUTRITION',
            },
            {
                id: 'tip-breathing',
                title: 'Deep Breathing',
                description: 'Take 5 deep breaths when feeling stressed',
                category: 'STRESS',
            },
            {
                id: 'tip-movement',
                title: 'Move Every Hour',
                description: 'Stand up and stretch for 2 minutes every hour',
                category: 'ACTIVITY',
            },
        ];
    }

    getDailyPlan(_userId: string): DailyPlanItem[] {
        return [
            { id: 'plan-morning', time: '07:00', activity: 'Morning meditation', completed: false },
            { id: 'plan-hydrate', time: '08:00', activity: 'Drink water', completed: false },
            { id: 'plan-walk', time: '12:00', activity: 'Midday walk', completed: false },
            { id: 'plan-journal', time: '21:00', activity: 'Evening journaling', completed: false },
        ];
    }

    async getInsights(userId: string): Promise<WellnessInsight[]> {
        const cacheKey = `wellness:insights:${userId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as WellnessInsight[];
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const records = await this.prismaService.healthMetric.findMany({
            where: {
                userId,
                type: MOOD_TYPE,
                timestamp: { gte: thirtyDaysAgo },
            },
            orderBy: { timestamp: 'desc' },
        });

        const totalMood = records.reduce((sum: number, r: { value: number }) => sum + r.value, 0);
        const avgMood = records.length > 0 ? totalMood / records.length : 0;

        const insights: WellnessInsight[] = [];

        if (records.length === 0) {
            insights.push({
                id: 'insight-start',
                title: 'Start Tracking',
                description: 'Begin logging your mood to get personalized insights',
                severity: 'INFO',
                createdAt: new Date().toISOString(),
            });
        } else if (avgMood < 2.5) {
            insights.push({
                id: 'insight-low-mood',
                title: 'Low Mood Detected',
                description:
                    'Your average mood has been below average. Consider speaking with a professional.',
                severity: 'WARNING',
                createdAt: new Date().toISOString(),
            });
        } else {
            insights.push({
                id: 'insight-positive',
                title: 'Positive Trend',
                description: `Your average mood score is ${avgMood.toFixed(1)} out of 5. Keep it up!`,
                severity: 'INFO',
                createdAt: new Date().toISOString(),
            });
        }

        await this.redisService.set(cacheKey, JSON.stringify(insights), this.CACHE_TTL);
        return insights;
    }

    async createJournalEntry(userId: string, dto: CreateJournalEntryDto): Promise<JournalEntry> {
        const metadata: JournalMetadata = {
            title: dto.title,
            content: dto.content,
            moodLevel: dto.moodLevel ?? null,
            tags: dto.tags ?? [],
        };

        const metric = await this.prismaService.healthMetric.create({
            data: {
                id: uuidv4(),
                userId,
                type: JOURNAL_TYPE,
                value: dto.moodLevel ?? 0,
                unit: 'entry',
                timestamp: dto.date,
                source: MetricSource.USER_INPUT,
                notes: dto.content,
                isAbnormal: false,
                metadata: JSON.parse(JSON.stringify(metadata)) as JournalMetadata,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        await this.invalidateCache(userId);
        return this.transformToJournalEntry(metric as RawMetric);
    }

    async getJournalEntries(
        userId: string,
        filters: FilterWellnessDto
    ): Promise<{
        data: JournalEntry[];
        pagination: { limit: number; offset: number; total: number };
    }> {
        const limit = filters.limit ?? 10;
        const offset = filters.offset ?? 0;

        const where: Prisma.HealthMetricWhereInput = {
            userId,
            type: JOURNAL_TYPE,
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
            data: data.map((m) => this.transformToJournalEntry(m as unknown as RawMetric)),
            pagination: { limit, offset, total },
        };
    }

    getChallenges(): WellnessChallenge[] {
        return this.cannedChallenges;
    }

    getChallengeById(id: string): WellnessChallenge {
        const challenge = this.cannedChallenges.find((c) => c.id === id);
        if (!challenge) {
            throw new NotFoundException(`Challenge with ID ${id} not found`);
        }
        return challenge;
    }

    async getStreaks(userId: string): Promise<WellnessStreak[]> {
        const cacheKey = `wellness:streaks:${userId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached) as WellnessStreak[];
        }

        const streaks: WellnessStreak[] = [
            {
                type: 'MOOD_CHECKIN',
                currentStreak: 0,
                longestStreak: 0,
                lastActivityDate: new Date().toISOString(),
            },
            {
                type: 'JOURNALING',
                currentStreak: 0,
                longestStreak: 0,
                lastActivityDate: new Date().toISOString(),
            },
        ];

        await this.redisService.set(cacheKey, JSON.stringify(streaks), this.CACHE_TTL);
        return streaks;
    }

    async createGoal(
        userId: string,
        goalData: { type: GoalType; targetValue: number; period: GoalPeriod }
    ): Promise<unknown> {
        return this.prismaService.healthGoal.create({
            data: {
                id: uuidv4(),
                recordId: userId,
                type: goalData.type,
                title: `Wellness ${goalData.type} Goal`,
                targetValue: goalData.targetValue,
                currentValue: 0,
                unit: 'count',
                period: goalData.period,
                startDate: new Date(),
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    private async invalidateCache(userId: string): Promise<void> {
        await Promise.all([
            this.redisService.del(`wellness:insights:${userId}`),
            this.redisService.del(`wellness:streaks:${userId}`),
        ]);
    }

    private transformToMoodCheckIn(metric: RawMetric): MoodCheckIn {
        const meta = (metric.metadata as Record<string, unknown>) ?? {};
        return {
            id: metric.id,
            userId: metric.userId,
            moodLevel: metric.value,
            notes: metric.notes,
            tags: (meta['tags'] as string[]) ?? [],
            timestamp: metric.timestamp,
            createdAt: metric.createdAt,
            updatedAt: metric.updatedAt,
        };
    }

    private transformToJournalEntry(metric: RawMetric): JournalEntry {
        const meta = (metric.metadata as Record<string, unknown>) ?? {};
        return {
            id: metric.id,
            userId: metric.userId,
            title: (meta['title'] as string) ?? '',
            content: (meta['content'] as string) ?? '',
            moodLevel: (meta['moodLevel'] as number) ?? null,
            tags: (meta['tags'] as string[]) ?? [],
            date: metric.timestamp,
            createdAt: metric.createdAt,
            updatedAt: metric.updatedAt,
        };
    }
}
