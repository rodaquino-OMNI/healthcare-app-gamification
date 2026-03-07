/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { PrismaService } from '../../../shared/src/database/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import { AchievementsService } from '../achievements/achievements.service';
import { KafkaService } from '../../../shared/src/kafka/kafka.service';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { AppException } from '../../../shared/src/exceptions/exceptions.types';
import { Quest } from './entities/quest.entity';
import { GameProfile } from '../profiles/entities/game-profile.entity';

describe('QuestsService', () => {
    let service: QuestsService;
    let prismaService: PrismaService;
    let profilesService: ProfilesService;

    const mockQuest: Quest = {
        id: 'quest-1',
        title: 'Daily Walk',
        description: 'Walk 10,000 steps in a day',
        journey: 'health',
        icon: 'walk',
        xpReward: 100,
    };

    const mockGameProfile: GameProfile = {
        id: 'profile-1',
        userId: 'user-1',
        level: 2,
        xp: 200,
        achievements: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    const mockUserQuest = {
        id: 'user-quest-1',
        profileId: 'profile-1',
        questId: 'quest-1',
        progress: 0,
        completed: false,
        quest: mockQuest,
    };

    const mockPrismaService = {
        quest: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
        userQuest: {
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    const mockProfilesService = {
        findById: jest.fn(),
        update: jest.fn(),
    };

    const mockAchievementsService = {
        findByJourney: jest.fn(),
    };

    const mockKafkaService = {
        produce: jest.fn(),
    };

    const mockLoggerService = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuestsService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: ProfilesService, useValue: mockProfilesService },
                { provide: AchievementsService, useValue: mockAchievementsService },
                { provide: KafkaService, useValue: mockKafkaService },
                { provide: LoggerService, useValue: mockLoggerService },
            ],
        }).compile();

        service = module.get<QuestsService>(QuestsService);
        prismaService = module.get<PrismaService>(PrismaService);
        profilesService = module.get<ProfilesService>(ProfilesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ----------------------------------------------------------------
    // findAll
    // ----------------------------------------------------------------
    describe('findAll', () => {
        it('should return all quests', async () => {
            mockPrismaService.quest.findMany.mockResolvedValue([mockQuest]);

            const result = await service.findAll();

            expect(mockPrismaService.quest.findMany).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockQuest);
        });

        it('should return empty array when no quests exist', async () => {
            mockPrismaService.quest.findMany.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });

        it('should throw AppException when database query fails', async () => {
            mockPrismaService.quest.findMany.mockRejectedValue(new Error('DB error'));

            await expect(service.findAll()).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // findOne
    // ----------------------------------------------------------------
    describe('findOne', () => {
        it('should return a quest when found by ID', async () => {
            mockPrismaService.quest.findUnique.mockResolvedValue(mockQuest);

            const result = await service.findOne('quest-1');

            expect(mockPrismaService.quest.findUnique).toHaveBeenCalledWith({ where: { id: 'quest-1' } });
            expect(result).toEqual(mockQuest);
        });

        it('should throw NotFoundException when quest does not exist', async () => {
            mockPrismaService.quest.findUnique.mockResolvedValue(null);

            await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
        });

        it('should throw AppException when database fails', async () => {
            mockPrismaService.quest.findUnique.mockRejectedValue(new Error('Connection error'));

            await expect(service.findOne('quest-1')).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // startQuest
    // ----------------------------------------------------------------
    describe('startQuest', () => {
        it('should start a new quest for a user', async () => {
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.quest.findUnique.mockResolvedValue(mockQuest);
            mockPrismaService.userQuest.findFirst.mockResolvedValue(null);
            mockPrismaService.userQuest.create.mockResolvedValue(mockUserQuest);
            mockKafkaService.produce.mockResolvedValue(undefined);

            const result = await service.startQuest('user-1', 'quest-1');

            expect(mockPrismaService.userQuest.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        profileId: 'profile-1',
                        questId: 'quest-1',
                        progress: 0,
                        completed: false,
                    }),
                })
            );
            expect(result).toEqual(mockUserQuest);
        });

        it('should return existing user quest without creating when already started', async () => {
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.quest.findUnique.mockResolvedValue(mockQuest);
            mockPrismaService.userQuest.findFirst.mockResolvedValue(mockUserQuest);

            const result = await service.startQuest('user-1', 'quest-1');

            expect(mockPrismaService.userQuest.create).not.toHaveBeenCalled();
            expect(result).toEqual(mockUserQuest);
        });

        it('should publish kafka event when quest is started', async () => {
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.quest.findUnique.mockResolvedValue(mockQuest);
            mockPrismaService.userQuest.findFirst.mockResolvedValue(null);
            mockPrismaService.userQuest.create.mockResolvedValue(mockUserQuest);
            mockKafkaService.produce.mockResolvedValue(undefined);

            await service.startQuest('user-1', 'quest-1');

            expect(mockKafkaService.produce).toHaveBeenCalledWith(
                'quest.started',
                expect.objectContaining({ userId: 'user-1', questId: 'quest-1' })
            );
        });

        it('should throw AppException when user profile not found', async () => {
            mockProfilesService.findById.mockRejectedValue(new Error('Profile not found'));

            await expect(service.startQuest('nonexistent-user', 'quest-1')).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // completeQuest
    // ----------------------------------------------------------------
    describe('completeQuest', () => {
        it('should complete an in-progress quest and award XP', async () => {
            const inProgressUserQuest = { ...mockUserQuest, completed: false };
            const completedUserQuest = { ...mockUserQuest, progress: 100, completed: true };

            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.userQuest.findFirst.mockResolvedValue(inProgressUserQuest);
            mockPrismaService.userQuest.update.mockResolvedValue(completedUserQuest);
            mockProfilesService.update.mockResolvedValue({ ...mockGameProfile, xp: 300 });
            mockAchievementsService.findByJourney.mockResolvedValue({ data: [], meta: { total: 0 } });
            mockKafkaService.produce.mockResolvedValue(undefined);

            const result = await service.completeQuest('user-1', 'quest-1');

            expect(mockPrismaService.userQuest.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { progress: 100, completed: true },
                })
            );
            expect(mockProfilesService.update).toHaveBeenCalledWith('user-1', {
                xp: mockGameProfile.xp + mockQuest.xpReward,
            });
            expect(result.completed).toBe(true);
        });

        it('should return already-completed quest without re-processing', async () => {
            const completedUserQuest = { ...mockUserQuest, completed: true, progress: 100 };
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.userQuest.findFirst.mockResolvedValue(completedUserQuest);

            const result = await service.completeQuest('user-1', 'quest-1');

            expect(mockPrismaService.userQuest.update).not.toHaveBeenCalled();
            expect(result.completed).toBe(true);
        });

        it('should throw NotFoundException when user quest not found', async () => {
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.userQuest.findFirst.mockResolvedValue(null);

            await expect(service.completeQuest('user-1', 'nonexistent-quest')).rejects.toThrow(NotFoundException);
        });

        it('should publish kafka event on successful completion', async () => {
            const inProgressUserQuest = { ...mockUserQuest, completed: false };
            const completedUserQuest = { ...mockUserQuest, progress: 100, completed: true };

            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.userQuest.findFirst.mockResolvedValue(inProgressUserQuest);
            mockPrismaService.userQuest.update.mockResolvedValue(completedUserQuest);
            mockProfilesService.update.mockResolvedValue({ ...mockGameProfile, xp: 300 });
            mockAchievementsService.findByJourney.mockResolvedValue({ data: [], meta: { total: 0 } });
            mockKafkaService.produce.mockResolvedValue(undefined);

            await service.completeQuest('user-1', 'quest-1');

            expect(mockKafkaService.produce).toHaveBeenCalledWith(
                'quest.completed',
                expect.objectContaining({ userId: 'user-1', questId: 'quest-1' })
            );
        });
    });
});
