/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Reward } from './entities/reward.entity';
import { RewardsService } from './rewards.service';
import { PrismaService } from '../../../shared/src/database/prisma.service';
import { AppException } from '../../../shared/src/exceptions/exceptions.types';
import { KafkaService } from '../../../shared/src/kafka/kafka.service';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { AchievementsService } from '../achievements/achievements.service';
import { GameProfile } from '../profiles/entities/game-profile.entity';
import { ProfilesService } from '../profiles/profiles.service';

describe('RewardsService', () => {
    let service: RewardsService;
    let _prismaService: PrismaService;
    let _profilesService: ProfilesService;
    let _kafkaService: KafkaService;

    const mockReward: Reward = {
        id: 'reward-1',
        title: 'Health Champion',
        description: 'Complete 30 days of healthy habits',
        xpReward: 500,
        icon: 'trophy',
        journey: 'health',
    } as Reward;

    const mockGameProfile: GameProfile = {
        id: 'profile-1',
        userId: 'user-1',
        level: 5,
        xp: 400,
        achievements: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    const mockPrismaService = {
        reward: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        userReward: {
            create: jest.fn(),
        },
    };

    const mockProfilesService = {
        findById: jest.fn(),
        update: jest.fn(),
    };

    const mockKafkaService = {
        produce: jest.fn(),
    };

    const mockLoggerService = {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };

    const mockAchievementsService = {
        findAll: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn().mockReturnValue('some-value'),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RewardsService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: ProfilesService, useValue: mockProfilesService },
                { provide: KafkaService, useValue: mockKafkaService },
                { provide: LoggerService, useValue: mockLoggerService },
                { provide: AchievementsService, useValue: mockAchievementsService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<RewardsService>(RewardsService);
        _prismaService = module.get<PrismaService>(PrismaService);
        _profilesService = module.get<ProfilesService>(ProfilesService);
        _kafkaService = module.get<KafkaService>(KafkaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ----------------------------------------------------------------
    // create
    // ----------------------------------------------------------------
    describe('create', () => {
        it('should create and return a new reward', async () => {
            mockPrismaService.reward.create.mockResolvedValue(mockReward);

            const result = await service.create(mockReward);

            expect(mockPrismaService.reward.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ title: 'Health Champion', journey: 'health' }),
                })
            );
            expect(result).toEqual(mockReward);
        });

        it('should throw AppException when creation fails', async () => {
            mockPrismaService.reward.create.mockRejectedValue(new Error('Constraint violation'));

            await expect(service.create(mockReward)).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // findAll
    // ----------------------------------------------------------------
    describe('findAll', () => {
        it('should return all rewards', async () => {
            const rewards = [mockReward, { ...mockReward, id: 'reward-2', title: 'Care Star' }];
            mockPrismaService.reward.findMany.mockResolvedValue(rewards);

            const result = await service.findAll();

            expect(mockPrismaService.reward.findMany).toHaveBeenCalled();
            expect(result).toHaveLength(2);
        });

        it('should return empty array when no rewards exist', async () => {
            mockPrismaService.reward.findMany.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });

        it('should throw AppException when database query fails', async () => {
            mockPrismaService.reward.findMany.mockRejectedValue(new Error('DB error'));

            await expect(service.findAll()).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // findOne
    // ----------------------------------------------------------------
    describe('findOne', () => {
        it('should return a reward when found by ID', async () => {
            mockPrismaService.reward.findUnique.mockResolvedValue(mockReward);

            const result = await service.findOne('reward-1');

            expect(mockPrismaService.reward.findUnique).toHaveBeenCalledWith({
                where: { id: 'reward-1' },
            });
            expect(result).toEqual(mockReward);
        });

        it('should throw AppException with BUSINESS type when reward not found', async () => {
            mockPrismaService.reward.findUnique.mockResolvedValue(null);

            await expect(service.findOne('nonexistent')).rejects.toThrow(AppException);
        });

        it('should throw AppException with TECHNICAL type on database failure', async () => {
            mockPrismaService.reward.findUnique.mockRejectedValue(new Error('Connection error'));

            await expect(service.findOne('reward-1')).rejects.toThrow(AppException);
        });

        it('should re-throw AppException without wrapping', async () => {
            const appException = new AppException(
                'Already thrown',
                'BUSINESS' as any,
                'REWARD_003',
                {}
            );
            mockPrismaService.reward.findUnique.mockRejectedValue(appException);

            await expect(service.findOne('reward-1')).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // grantReward
    // ----------------------------------------------------------------
    describe('grantReward', () => {
        it('should grant a reward to a user and publish kafka event', async () => {
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.reward.findUnique.mockResolvedValue(mockReward);
            mockKafkaService.produce.mockResolvedValue(undefined);

            const result = await service.grantReward('user-1', 'reward-1');

            expect(mockKafkaService.produce).toHaveBeenCalledWith(
                'reward-events',
                expect.objectContaining({
                    type: 'REWARD_GRANTED',
                    userId: 'user-1',
                    rewardId: 'reward-1',
                }),
                'user-1'
            );
            expect(result).toBeDefined();
            expect(result.reward).toEqual(mockReward);
        });

        it('should attach correct profile to the user reward', async () => {
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.reward.findUnique.mockResolvedValue(mockReward);
            mockKafkaService.produce.mockResolvedValue(undefined);

            const result = await service.grantReward('user-1', 'reward-1');

            expect(result.profile).toEqual(mockGameProfile);
        });

        it('should set earnedAt timestamp on the user reward', async () => {
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.reward.findUnique.mockResolvedValue(mockReward);
            mockKafkaService.produce.mockResolvedValue(undefined);

            const result = await service.grantReward('user-1', 'reward-1');

            expect(result.earnedAt).toBeInstanceOf(Date);
        });

        it('should throw AppException when user profile is not found', async () => {
            mockProfilesService.findById.mockRejectedValue(new Error('Profile not found'));

            await expect(service.grantReward('nonexistent-user', 'reward-1')).rejects.toThrow(
                AppException
            );
        });

        it('should throw AppException when reward is not found', async () => {
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockPrismaService.reward.findUnique.mockResolvedValue(null);

            await expect(service.grantReward('user-1', 'nonexistent-reward')).rejects.toThrow(
                AppException
            );
        });
    });
});
