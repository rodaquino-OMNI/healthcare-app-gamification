import { Test, TestingModule } from '@nestjs/testing';

import { AchievementsService } from './achievements.service';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { PrismaService } from '../../../shared/src/database/prisma.service';
import { AppException } from '../../../shared/src/exceptions/exceptions.types';
import { GameProfile } from '../profiles/entities/game-profile.entity';
import { ProfilesService } from '../profiles/profiles.service';

describe('AchievementsService', () => {
    let service: AchievementsService;
    let _prismaService: PrismaService;
    let _profilesService: ProfilesService;

    const mockAchievement: Achievement = {
        id: 'achievement-1',
        title: 'First Steps',
        description: 'Complete your first health check',
        journey: 'health',
        icon: 'star',
        xpReward: 100,
    };

    const mockGameProfile: GameProfile = {
        id: 'profile-1',
        userId: 'user-1',
        level: 3,
        xp: 200,
        achievements: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    const mockUserAchievement: UserAchievement = {
        profileId: 'profile-1',
        achievementId: 'achievement-1',
        profile: mockGameProfile,
        achievement: mockAchievement,
        progress: 100,
        unlocked: true,
        unlockedAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
    };

    const mockPrismaService = {
        achievement: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        userAchievement: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    const mockProfilesService = {
        findById: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AchievementsService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: ProfilesService, useValue: mockProfilesService },
            ],
        }).compile();

        service = module.get<AchievementsService>(AchievementsService);
        _prismaService = module.get<PrismaService>(PrismaService);
        _profilesService = module.get<ProfilesService>(ProfilesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ----------------------------------------------------------------
    // findById
    // ----------------------------------------------------------------
    describe('findById', () => {
        it('should return an achievement when it exists', async () => {
            mockPrismaService.achievement.findUnique.mockResolvedValue(mockAchievement);

            const result = await service.findById('achievement-1');

            expect(mockPrismaService.achievement.findUnique).toHaveBeenCalledWith({
                where: { id: 'achievement-1' },
            });
            expect(result).toEqual(mockAchievement);
        });

        it('should throw AppException when achievement is not found', async () => {
            mockPrismaService.achievement.findUnique.mockResolvedValue(null);

            await expect(service.findById('nonexistent-id')).rejects.toThrow(AppException);
        });

        it('should re-throw AppException from the database layer', async () => {
            mockPrismaService.achievement.findUnique.mockRejectedValue(
                new Error('Database connection failed')
            );

            await expect(service.findById('achievement-1')).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // findAll
    // ----------------------------------------------------------------
    describe('findAll', () => {
        it('should return a list of achievements with total count', async () => {
            const mockAchievements = [mockAchievement];
            mockPrismaService.achievement.count.mockResolvedValue(1);
            mockPrismaService.achievement.findMany.mockResolvedValue(mockAchievements);

            const result = await service.findAll();

            expect(result).toEqual({ items: mockAchievements, total: 1 });
        });

        it('should filter achievements by journey when provided', async () => {
            mockPrismaService.achievement.count.mockResolvedValue(1);
            mockPrismaService.achievement.findMany.mockResolvedValue([mockAchievement]);

            await service.findAll({ journey: 'health', where: {} });

            expect(mockPrismaService.achievement.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ journey: 'health' }),
                })
            );
        });

        it('should apply pagination parameters', async () => {
            mockPrismaService.achievement.count.mockResolvedValue(20);
            mockPrismaService.achievement.findMany.mockResolvedValue([]);

            await service.findAll({}, { page: 2, limit: 5 });

            expect(mockPrismaService.achievement.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ skip: 5, take: 5 })
            );
        });

        it('should throw AppException when database query fails', async () => {
            mockPrismaService.achievement.count.mockRejectedValue(new Error('Query failed'));

            await expect(service.findAll()).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // create
    // ----------------------------------------------------------------
    describe('create', () => {
        it('should create and return a new achievement', async () => {
            mockPrismaService.achievement.create.mockResolvedValue(mockAchievement);

            const result = await service.create({
                title: 'First Steps',
                description: 'Complete your first health check',
                journey: 'health',
                icon: 'star',
                xpReward: 100,
            });

            expect(mockPrismaService.achievement.create).toHaveBeenCalled();
            expect(result).toEqual(mockAchievement);
        });

        it('should throw AppException when creation fails', async () => {
            mockPrismaService.achievement.create.mockRejectedValue(
                new Error('Unique constraint violation')
            );

            await expect(
                service.create({ title: 'Test', journey: 'health', xpReward: 50 })
            ).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // update
    // ----------------------------------------------------------------
    describe('update', () => {
        it('should update and return the modified achievement', async () => {
            const updatedAchievement = { ...mockAchievement, title: 'Updated Title' };
            mockPrismaService.achievement.findUnique.mockResolvedValue(mockAchievement);
            mockPrismaService.achievement.update.mockResolvedValue(updatedAchievement);

            const result = await service.update('achievement-1', { title: 'Updated Title' });

            expect(mockPrismaService.achievement.update).toHaveBeenCalledWith({
                where: { id: 'achievement-1' },
                data: { title: 'Updated Title' },
            });
            expect(result.title).toBe('Updated Title');
        });

        it('should throw AppException when achievement does not exist', async () => {
            mockPrismaService.achievement.findUnique.mockResolvedValue(null);

            await expect(service.update('nonexistent-id', { title: 'Updated' })).rejects.toThrow(
                AppException
            );
        });
    });

    // ----------------------------------------------------------------
    // delete
    // ----------------------------------------------------------------
    describe('delete', () => {
        it('should delete an achievement and return true', async () => {
            mockPrismaService.achievement.findUnique.mockResolvedValue(mockAchievement);
            mockPrismaService.achievement.delete.mockResolvedValue(mockAchievement);

            const result = await service.delete('achievement-1');

            expect(mockPrismaService.achievement.delete).toHaveBeenCalledWith({
                where: { id: 'achievement-1' },
            });
            expect(result).toBe(true);
        });

        it('should throw AppException when achievement does not exist', async () => {
            mockPrismaService.achievement.findUnique.mockResolvedValue(null);

            await expect(service.delete('nonexistent-id')).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // unlockAchievement
    // ----------------------------------------------------------------
    describe('unlockAchievement', () => {
        it('should unlock an achievement and award XP to the user', async () => {
            mockPrismaService.achievement.findUnique.mockResolvedValue(mockAchievement);
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.userAchievement.findUnique.mockResolvedValue(null);
            mockPrismaService.userAchievement.create.mockResolvedValue(mockUserAchievement);
            mockProfilesService.update.mockResolvedValue({
                ...mockGameProfile,
                xp: mockGameProfile.xp + mockAchievement.xpReward,
            });

            const result = await service.unlockAchievement('user-1', 'achievement-1');

            expect(mockPrismaService.userAchievement.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    profileId: mockGameProfile.id,
                    achievementId: mockAchievement.id,
                    unlocked: true,
                    progress: 100,
                }),
            });
            expect(mockProfilesService.update).toHaveBeenCalledWith('user-1', {
                xp: mockGameProfile.xp + mockAchievement.xpReward,
            });
            expect(result).toEqual(mockUserAchievement);
        });

        it('should be idempotent — return existing record if already unlocked', async () => {
            mockPrismaService.achievement.findUnique.mockResolvedValue(mockAchievement);
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.userAchievement.findUnique.mockResolvedValue({
                ...mockUserAchievement,
                unlocked: true,
            });

            const result = await service.unlockAchievement('user-1', 'achievement-1');

            expect(mockPrismaService.userAchievement.create).not.toHaveBeenCalled();
            expect(mockProfilesService.update).not.toHaveBeenCalled();
            expect(result.unlocked).toBe(true);
        });

        it('should update existing in-progress record when achievement is completed', async () => {
            const inProgressRecord = { ...mockUserAchievement, unlocked: false, progress: 50 };
            const unlockedRecord = { ...mockUserAchievement, unlocked: true, progress: 100 };

            mockPrismaService.achievement.findUnique.mockResolvedValue(mockAchievement);
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.userAchievement.findUnique.mockResolvedValue(inProgressRecord);
            mockPrismaService.userAchievement.update.mockResolvedValue(unlockedRecord);
            mockProfilesService.update.mockResolvedValue({
                ...mockGameProfile,
                xp: mockGameProfile.xp + mockAchievement.xpReward,
            });

            const result = await service.unlockAchievement('user-1', 'achievement-1');

            expect(mockPrismaService.userAchievement.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ unlocked: true, progress: 100 }),
                })
            );
            expect(mockProfilesService.update).toHaveBeenCalledWith('user-1', {
                xp: mockGameProfile.xp + mockAchievement.xpReward,
            });
            expect(result.unlocked).toBe(true);
        });

        it('should throw AppException when achievement is not found', async () => {
            mockPrismaService.achievement.findUnique.mockResolvedValue(null);

            await expect(
                service.unlockAchievement('user-1', 'nonexistent-achievement')
            ).rejects.toThrow(AppException);
        });

        it('should throw AppException when user profile is not found', async () => {
            mockPrismaService.achievement.findUnique.mockResolvedValue(mockAchievement);
            mockProfilesService.findById.mockRejectedValue(new Error('Profile not found'));

            await expect(
                service.unlockAchievement('nonexistent-user', 'achievement-1')
            ).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // findByJourney
    // ----------------------------------------------------------------
    describe('findByJourney', () => {
        it('should return paginated achievements for a specific journey', async () => {
            const mockAchievements = [mockAchievement];
            mockPrismaService.achievement.count.mockResolvedValue(1);
            mockPrismaService.achievement.findMany.mockResolvedValue(mockAchievements);

            const result = await service.findByJourney('health');

            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('meta');
            expect(result.data).toEqual(mockAchievements);
            expect(result.meta.total).toBe(1);
        });

        it('should use pagination parameters when provided', async () => {
            mockPrismaService.achievement.count.mockResolvedValue(30);
            mockPrismaService.achievement.findMany.mockResolvedValue([mockAchievement]);

            const result = await service.findByJourney('care', { page: 2, limit: 10 });

            expect(result.meta.page).toBe(2);
            expect(result.meta.limit).toBe(10);
        });
    });

    // ----------------------------------------------------------------
    // search
    // ----------------------------------------------------------------
    describe('search', () => {
        it('should return achievements matching the search term', async () => {
            const mockAchievements = [mockAchievement];
            mockPrismaService.achievement.count.mockResolvedValue(1);
            mockPrismaService.achievement.findMany.mockResolvedValue(mockAchievements);

            const result = await service.search('health');

            expect(mockPrismaService.achievement.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ OR: expect.any(Array) }),
                })
            );
            expect(result.data).toEqual(mockAchievements);
        });

        it('should return empty results when no achievements match', async () => {
            mockPrismaService.achievement.count.mockResolvedValue(0);
            mockPrismaService.achievement.findMany.mockResolvedValue([]);

            const result = await service.search('nonexistent-term');

            expect(result.data).toHaveLength(0);
            expect(result.meta.total).toBe(0);
        });

        it('should throw AppException when search fails', async () => {
            mockPrismaService.achievement.count.mockRejectedValue(
                new Error('Search index unavailable')
            );

            await expect(service.search('test')).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // count
    // ----------------------------------------------------------------
    describe('count', () => {
        it('should return the total count of achievements', async () => {
            mockPrismaService.achievement.count.mockResolvedValue(42);

            const result = await service.count();

            expect(result).toBe(42);
        });

        it('should count achievements filtered by journey', async () => {
            mockPrismaService.achievement.count.mockResolvedValue(10);

            const result = await service.count({ journey: 'care', where: {} });

            expect(mockPrismaService.achievement.count).toHaveBeenCalledWith(
                expect.objectContaining({ where: expect.objectContaining({ journey: 'care' }) })
            );
            expect(result).toBe(10);
        });

        it('should throw AppException when count query fails', async () => {
            mockPrismaService.achievement.count.mockRejectedValue(new Error('Count query failed'));

            await expect(service.count()).rejects.toThrow(AppException);
        });
    });
});
