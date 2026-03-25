import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { CreateMoodCheckInDto } from './dto/create-mood-checkin.dto';
import { FilterWellnessDto } from './dto/filter-wellness.dto';
import { WellnessService } from './wellness.service';

const mockPrismaService = {
    healthMetric: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
    },
    healthGoal: {
        create: jest.fn(),
    },
};

const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
};

const userId = 'user-abc';
const now = new Date('2024-01-15T00:00:00Z');

const rawMoodMetric = {
    id: 'mood-xyz',
    userId,
    type: 'MOOD',
    value: 4,
    unit: 'level',
    timestamp: now,
    source: 'USER_INPUT',
    notes: 'Feeling good',
    isAbnormal: false,
    metadata: {
        moodLevel: 4,
        notes: 'Feeling good',
        tags: ['happy'],
    },
    createdAt: now,
    updatedAt: now,
};

const rawJournalMetric = {
    id: 'journal-xyz',
    userId,
    type: 'JOURNAL',
    value: 4,
    unit: 'entry',
    timestamp: now,
    source: 'USER_INPUT',
    notes: 'Had a good day at work.',
    isAbnormal: false,
    metadata: {
        title: 'Good Day',
        content: 'Had a good day at work.',
        moodLevel: 4,
        tags: ['work'],
    },
    createdAt: now,
    updatedAt: now,
};

describe('WellnessService', () => {
    let service: WellnessService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WellnessService,
                { provide: 'PrismaService', useValue: mockPrismaService },
                { provide: 'RedisService', useValue: mockRedisService },
            ],
        })
            .overrideProvider(WellnessService)
            .useFactory({
                factory: () =>
                    new WellnessService(mockPrismaService as never, mockRedisService as never),
            })
            .compile();

        service = module.get<WellnessService>(WellnessService);
        jest.clearAllMocks();
    });

    describe('logMoodCheckIn', () => {
        it('should create a mood check-in with all fields and return transformed result', async () => {
            const dto: CreateMoodCheckInDto = {
                moodLevel: 4,
                notes: 'Feeling good',
                tags: ['happy'],
                timestamp: now,
            };

            mockPrismaService.healthMetric.create.mockResolvedValue(rawMoodMetric);
            mockRedisService.del.mockResolvedValue(1);

            const result = await service.logMoodCheckIn(userId, dto);

            expect(mockPrismaService.healthMetric.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        userId,
                        type: 'MOOD',
                        value: 4,
                        unit: 'level',
                        source: 'USER_INPUT',
                    }),
                })
            );
            expect(mockRedisService.del).toHaveBeenCalledWith(`wellness:insights:${userId}`);
            expect(result.moodLevel).toBe(4);
            expect(result.notes).toBe('Feeling good');
            expect(result.tags).toEqual(['happy']);
            expect(result.userId).toBe(userId);
        });
    });

    describe('getMoodHistory', () => {
        it('should return paginated mood records with default limit and offset', async () => {
            const filters: FilterWellnessDto = {};
            mockPrismaService.healthMetric.findMany.mockResolvedValue([rawMoodMetric]);
            mockPrismaService.healthMetric.count.mockResolvedValue(1);

            const result = await service.getMoodHistory(userId, filters);

            expect(mockPrismaService.healthMetric.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { userId, type: 'MOOD' },
                    take: 10,
                    skip: 0,
                    orderBy: { timestamp: 'desc' },
                })
            );
            expect(result.pagination).toEqual({ limit: 10, offset: 0, total: 1 });
            expect(result.data).toHaveLength(1);
        });

        it('should apply date range filter when startDate and endDate are provided', async () => {
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-01-31');
            const filters: FilterWellnessDto = { startDate, endDate, limit: 5, offset: 0 };

            mockPrismaService.healthMetric.findMany.mockResolvedValue([]);
            mockPrismaService.healthMetric.count.mockResolvedValue(0);

            await service.getMoodHistory(userId, filters);

            expect(mockPrismaService.healthMetric.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        userId,
                        type: 'MOOD',
                        timestamp: { gte: new Date(startDate), lte: new Date(endDate) },
                    },
                })
            );
        });
    });

    describe('createJournalEntry', () => {
        it('should create a journal entry with all fields and return transformed result', async () => {
            const dto: CreateJournalEntryDto = {
                title: 'Good Day',
                content: 'Had a good day at work.',
                moodLevel: 4,
                tags: ['work'],
                date: now,
            };

            mockPrismaService.healthMetric.create.mockResolvedValue(rawJournalMetric);
            mockRedisService.del.mockResolvedValue(1);

            const result = await service.createJournalEntry(userId, dto);

            expect(mockPrismaService.healthMetric.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        userId,
                        type: 'JOURNAL',
                        unit: 'entry',
                        source: 'USER_INPUT',
                    }),
                })
            );
            expect(result.title).toBe('Good Day');
            expect(result.content).toBe('Had a good day at work.');
            expect(result.moodLevel).toBe(4);
            expect(result.tags).toEqual(['work']);
        });
    });

    describe('getJournalEntries', () => {
        it('should return empty list when no journal entries exist', async () => {
            mockPrismaService.healthMetric.findMany.mockResolvedValue([]);
            mockPrismaService.healthMetric.count.mockResolvedValue(0);

            const result = await service.getJournalEntries(userId, {});

            expect(result.data).toHaveLength(0);
            expect(result.pagination.total).toBe(0);
        });
    });

    describe('getChallengeById', () => {
        it('should return a challenge when found', async () => {
            const result = await service.getChallengeById('challenge-mindfulness-7d');

            expect(result.id).toBe('challenge-mindfulness-7d');
            expect(result.title).toBe('7-Day Mindfulness');
        });

        it('should throw NotFoundException when challenge does not exist', async () => {
            await expect(service.getChallengeById('nonexistent')).rejects.toThrow(
                new NotFoundException('Challenge with ID nonexistent not found')
            );
        });
    });

    describe('getStreaks', () => {
        it('should return cached streaks when available', async () => {
            const cachedStreaks = [
                {
                    type: 'MOOD_CHECKIN',
                    currentStreak: 5,
                    longestStreak: 10,
                    lastActivityDate: '2024-01-15',
                },
            ];
            mockRedisService.get.mockResolvedValue(JSON.stringify(cachedStreaks));

            const result = await service.getStreaks(userId);

            expect(mockRedisService.get).toHaveBeenCalledWith(`wellness:streaks:${userId}`);
            expect(result).toEqual(cachedStreaks);
        });

        it('should compute and cache streaks when no cache hit', async () => {
            mockRedisService.get.mockResolvedValue(null);
            mockRedisService.set.mockResolvedValue('OK');

            const result = await service.getStreaks(userId);

            expect(mockRedisService.set).toHaveBeenCalledWith(
                `wellness:streaks:${userId}`,
                expect.any(String),
                300
            );
            expect(result).toHaveLength(2);
            expect(result[0].type).toBe('MOOD_CHECKIN');
            expect(result[1].type).toBe('JOURNALING');
        });
    });

    describe('getInsights', () => {
        it('should compute insights from DB when no cache hit', async () => {
            mockRedisService.get.mockResolvedValue(null);
            mockPrismaService.healthMetric.findMany.mockResolvedValue([
                { ...rawMoodMetric, value: 4 },
                { ...rawMoodMetric, value: 3 },
            ]);
            mockRedisService.set.mockResolvedValue('OK');

            const result = await service.getInsights(userId);

            expect(mockPrismaService.healthMetric.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ userId, type: 'MOOD' }),
                })
            );
            expect(mockRedisService.set).toHaveBeenCalledWith(
                `wellness:insights:${userId}`,
                expect.any(String),
                300
            );
            expect(result).toHaveLength(1);
            expect(result[0].severity).toBe('INFO');
        });

        it('should return start-tracking insight when no records exist', async () => {
            mockRedisService.get.mockResolvedValue(null);
            mockPrismaService.healthMetric.findMany.mockResolvedValue([]);
            mockRedisService.set.mockResolvedValue('OK');

            const result = await service.getInsights(userId);

            expect(result[0].title).toBe('Start Tracking');
        });

        it('should return cached insights when available', async () => {
            const cachedInsights = [
                {
                    id: 'insight-1',
                    title: 'Cached',
                    description: 'test',
                    severity: 'INFO',
                    createdAt: now.toISOString(),
                },
            ];
            mockRedisService.get.mockResolvedValue(JSON.stringify(cachedInsights));

            const result = await service.getInsights(userId);

            expect(mockPrismaService.healthMetric.findMany).not.toHaveBeenCalled();
            expect(result).toEqual(cachedInsights);
        });
    });

    describe('createGoal', () => {
        it('should create a wellness goal via Prisma', async () => {
            const goalData = {
                type: 'MOOD_CHECKIN' as const,
                targetValue: 30,
                period: 'MONTHLY' as const,
            };
            const createdGoal = {
                id: 'goal-xyz',
                recordId: userId,
                type: 'MOOD_CHECKIN',
                targetValue: 30,
                currentValue: 0,
                unit: 'count',
                frequency: 'MONTHLY',
                startDate: now,
                status: 'ACTIVE',
                createdAt: now,
                updatedAt: now,
            };
            mockPrismaService.healthGoal.create.mockResolvedValue(createdGoal);

            const result = await service.createGoal(userId, goalData);

            expect(mockPrismaService.healthGoal.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        recordId: userId,
                        type: 'MOOD_CHECKIN',
                        targetValue: 30,
                        currentValue: 0,
                        frequency: 'MONTHLY',
                        status: 'ACTIVE',
                    }),
                })
            );
            expect(result).toEqual(createdGoal);
        });
    });
});
