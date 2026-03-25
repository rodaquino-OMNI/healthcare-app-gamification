import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { CreateMoodCheckInDto } from './dto/create-mood-checkin.dto';
import { FilterWellnessDto } from './dto/filter-wellness.dto';
import { WellnessController } from './wellness.controller';
import { WellnessService } from './wellness.service';

const mockWellnessService = {
    logMoodCheckIn: jest.fn(),
    getMoodHistory: jest.fn(),
    getWellnessTips: jest.fn(),
    getDailyPlan: jest.fn(),
    getInsights: jest.fn(),
    createJournalEntry: jest.fn(),
    getJournalEntries: jest.fn(),
    getChallenges: jest.fn(),
    getChallengeById: jest.fn(),
    getStreaks: jest.fn(),
    createGoal: jest.fn(),
};

const mockUser = { id: 'user-123' };
const mockRequest = { user: mockUser };

const mockMoodCheckIn = {
    id: 'mood-001',
    userId: 'user-123',
    moodLevel: 4,
    notes: 'Feeling great',
    tags: ['happy', 'productive'],
    timestamp: new Date('2024-01-15T10:00:00Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockJournalEntry = {
    id: 'journal-001',
    userId: 'user-123',
    title: 'My Day',
    content: 'Had a wonderful day at work.',
    moodLevel: 4,
    tags: ['work', 'positive'],
    date: new Date('2024-01-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('WellnessController', () => {
    let controller: WellnessController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WellnessController],
            providers: [
                {
                    provide: WellnessService,
                    useValue: mockWellnessService,
                },
            ],
        }).compile();

        controller = module.get<WellnessController>(WellnessController);
        jest.clearAllMocks();
    });

    describe('logMoodCheckIn', () => {
        it('should create a mood check-in and return it', async () => {
            const dto: CreateMoodCheckInDto = {
                moodLevel: 4,
                notes: 'Feeling great',
                tags: ['happy', 'productive'],
                timestamp: new Date('2024-01-15T10:00:00Z'),
            };
            mockWellnessService.logMoodCheckIn.mockResolvedValue(mockMoodCheckIn);

            const result = await controller.logMoodCheckIn(mockRequest, dto);

            expect(mockWellnessService.logMoodCheckIn).toHaveBeenCalledWith('user-123', dto);
            expect(result).toEqual(mockMoodCheckIn);
        });
    });

    describe('getMoodHistory', () => {
        it('should return paginated mood history', async () => {
            const filters: FilterWellnessDto = { limit: 5, offset: 0 };
            const expected = {
                data: [mockMoodCheckIn],
                pagination: { limit: 5, offset: 0, total: 1 },
            };
            mockWellnessService.getMoodHistory.mockResolvedValue(expected);

            const result = await controller.getMoodHistory(mockRequest, filters);

            expect(mockWellnessService.getMoodHistory).toHaveBeenCalledWith('user-123', filters);
            expect(result).toEqual(expected);
        });

        it('should pass date range filters to the service', async () => {
            const filters: FilterWellnessDto = {
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
            };
            mockWellnessService.getMoodHistory.mockResolvedValue({
                data: [],
                pagination: { limit: 10, offset: 0, total: 0 },
            });

            await controller.getMoodHistory(mockRequest, filters);

            expect(mockWellnessService.getMoodHistory).toHaveBeenCalledWith('user-123', filters);
        });
    });

    describe('getWellnessTips', () => {
        it('should return wellness tips', async () => {
            const tips = [
                {
                    id: 'tip-1',
                    title: 'Stay Hydrated',
                    description: 'Drink water',
                    category: 'NUTRITION',
                },
            ];
            mockWellnessService.getWellnessTips.mockResolvedValue(tips);

            const result = await controller.getWellnessTips(mockRequest);

            expect(mockWellnessService.getWellnessTips).toHaveBeenCalledWith('user-123');
            expect(result).toEqual(tips);
        });
    });

    describe('getDailyPlan', () => {
        it('should return the daily wellness plan', async () => {
            const plan = [
                { id: 'plan-1', time: '07:00', activity: 'Meditation', completed: false },
            ];
            mockWellnessService.getDailyPlan.mockResolvedValue(plan);

            const result = await controller.getDailyPlan(mockRequest);

            expect(mockWellnessService.getDailyPlan).toHaveBeenCalledWith('user-123');
            expect(result).toEqual(plan);
        });
    });

    describe('getInsights', () => {
        it('should return wellness insights', async () => {
            const insights = [
                {
                    id: 'insight-1',
                    title: 'Positive Trend',
                    description: 'Your mood is improving',
                    severity: 'INFO',
                    createdAt: new Date().toISOString(),
                },
            ];
            mockWellnessService.getInsights.mockResolvedValue(insights);

            const result = await controller.getInsights(mockRequest);

            expect(mockWellnessService.getInsights).toHaveBeenCalledWith('user-123');
            expect(result).toEqual(insights);
        });
    });

    describe('createJournalEntry', () => {
        it('should create a journal entry and return it', async () => {
            const dto: CreateJournalEntryDto = {
                title: 'My Day',
                content: 'Had a wonderful day at work.',
                moodLevel: 4,
                tags: ['work', 'positive'],
                date: new Date('2024-01-15'),
            };
            mockWellnessService.createJournalEntry.mockResolvedValue(mockJournalEntry);

            const result = await controller.createJournalEntry(mockRequest, dto);

            expect(mockWellnessService.createJournalEntry).toHaveBeenCalledWith('user-123', dto);
            expect(result).toEqual(mockJournalEntry);
        });
    });

    describe('getJournalEntries', () => {
        it('should return paginated journal entries', async () => {
            const filters: FilterWellnessDto = { limit: 10, offset: 0 };
            const expected = {
                data: [mockJournalEntry],
                pagination: { limit: 10, offset: 0, total: 1 },
            };
            mockWellnessService.getJournalEntries.mockResolvedValue(expected);

            const result = await controller.getJournalEntries(mockRequest, filters);

            expect(mockWellnessService.getJournalEntries).toHaveBeenCalledWith('user-123', filters);
            expect(result).toEqual(expected);
        });
    });

    describe('getChallenges', () => {
        it('should return the list of available challenges', async () => {
            const challenges = [
                {
                    id: 'challenge-1',
                    title: '7-Day Mindfulness',
                    description: 'Practice mindfulness',
                    durationDays: 7,
                    category: 'MEDITATION',
                    difficulty: 'BEGINNER',
                },
            ];
            mockWellnessService.getChallenges.mockResolvedValue(challenges);

            const result = await controller.getChallenges();

            expect(mockWellnessService.getChallenges).toHaveBeenCalled();
            expect(result).toEqual(challenges);
        });
    });

    describe('getChallengeById', () => {
        it('should return a single challenge by ID', async () => {
            const challenge = {
                id: 'challenge-1',
                title: '7-Day Mindfulness',
                description: 'Practice mindfulness',
                durationDays: 7,
                category: 'MEDITATION',
                difficulty: 'BEGINNER',
            };
            mockWellnessService.getChallengeById.mockResolvedValue(challenge);

            const result = await controller.getChallengeById('challenge-1');

            expect(mockWellnessService.getChallengeById).toHaveBeenCalledWith('challenge-1');
            expect(result).toEqual(challenge);
        });

        it('should propagate NotFoundException when challenge does not exist', async () => {
            mockWellnessService.getChallengeById.mockRejectedValue(
                new NotFoundException('Challenge with ID nonexistent not found')
            );

            await expect(controller.getChallengeById('nonexistent')).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe('getStreaks', () => {
        it('should return wellness streaks for the authenticated user', async () => {
            const streaks = [
                {
                    type: 'MOOD_CHECKIN',
                    currentStreak: 5,
                    longestStreak: 10,
                    lastActivityDate: '2024-01-15',
                },
            ];
            mockWellnessService.getStreaks.mockResolvedValue(streaks);

            const result = await controller.getStreaks(mockRequest);

            expect(mockWellnessService.getStreaks).toHaveBeenCalledWith('user-123');
            expect(result).toEqual(streaks);
        });
    });

    describe('createGoal', () => {
        it('should create a wellness goal and return it', async () => {
            const goalData = {
                type: 'MOOD_CHECKIN' as const,
                targetValue: 30,
                period: 'MONTHLY' as const,
            };
            const createdGoal = {
                id: 'goal-1',
                recordId: 'user-123',
                ...goalData,
                currentValue: 0,
            };
            mockWellnessService.createGoal.mockResolvedValue(createdGoal);

            const result = await controller.createGoal(mockRequest, goalData);

            expect(mockWellnessService.createGoal).toHaveBeenCalledWith('user-123', goalData);
            expect(result).toEqual(createdGoal);
        });
    });
});
