import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { GamificationResolvers } from './gamification.resolvers';

describe('GamificationResolvers', () => {
    let resolvers: GamificationResolvers;
    let httpService: jest.Mocked<HttpService>;

    const mockUser = { id: 'user-1', email: 'test@example.com' };

    const mockCacheManager = {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(undefined),
        del: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        mockCacheManager.get.mockResolvedValue(null);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GamificationResolvers,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                        post: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('http://gamification-engine:3005'),
                    },
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile();

        resolvers = module.get<GamificationResolvers>(GamificationResolvers);
        httpService = module.get(HttpService);
    });

    it('should be defined', () => {
        expect(resolvers).toBeDefined();
    });

    describe('getGameProfile', () => {
        it('should return game profile for a user', async () => {
            const mockData = { userId: 'user-1', level: 5, xp: 500 };
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getGameProfile(mockUser, 'user-1');

            expect(result).toEqual(mockData);
        });
    });

    describe('getAchievements', () => {
        it('should return achievements for a user', async () => {
            const mockData = [{ id: 'ach-1', title: 'First Steps' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getAchievements(mockUser, 'user-1');

            expect(result).toEqual(mockData);
        });
    });

    describe('getQuests', () => {
        it('should return quests for a user', async () => {
            const mockData = [{ id: 'quest-1' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getQuests(mockUser, 'user-1');

            expect(result).toEqual(mockData);
        });
    });

    describe('getRewards', () => {
        it('should return rewards for a user', async () => {
            const mockData = [{ id: 'reward-1' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getRewards(mockUser, 'user-1');

            expect(result).toEqual(mockData);
        });
    });

    describe('claimReward', () => {
        it('should claim a reward', async () => {
            const mockData = { rewardId: 'reward-1', claimed: true };
            httpService.post.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.claimReward(mockUser, 'reward-1');

            expect(result).toEqual(mockData);
            expect(httpService.post).toHaveBeenCalledWith(
                'http://gamification-engine:3005/rewards/reward-1/claim',
                expect.objectContaining({ userId: 'user-1' })
            );
        });
    });

    describe('completeQuestTask', () => {
        it('should complete a quest task', async () => {
            const mockData = { questId: 'quest-1', taskId: 'task-1', completed: true };
            httpService.post.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.completeQuestTask(mockUser, 'quest-1', 'task-1');

            expect(result).toEqual(mockData);
        });
    });

    describe('acknowledgeAchievement', () => {
        it('should acknowledge an achievement', async () => {
            const mockData = { achievementId: 'ach-1', acknowledged: true };
            httpService.post.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.acknowledgeAchievement(mockUser, 'ach-1');

            expect(result).toEqual(mockData);
        });
    });

    // -------------------------------------------------------------------------
    // Error handling tests
    // -------------------------------------------------------------------------
    describe('getGameProfile - error handling', () => {
        it('should propagate errors', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('Profile not found')));

            await expect(resolvers.getGameProfile(mockUser, 'user-1')).rejects.toThrow(
                'Profile not found'
            );
        });
    });

    describe('getAchievements - error handling', () => {
        it('should propagate errors', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('Service down')));

            await expect(resolvers.getAchievements(mockUser, 'user-1')).rejects.toThrow(
                'Service down'
            );
        });
    });

    describe('getQuests - error handling', () => {
        it('should propagate errors', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('Not Found')));

            await expect(resolvers.getQuests(mockUser, 'user-1')).rejects.toThrow('Not Found');
        });
    });

    describe('getRewards - error handling', () => {
        it('should propagate errors', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('Not Found')));

            await expect(resolvers.getRewards(mockUser, 'user-1')).rejects.toThrow('Not Found');
        });
    });

    describe('claimReward - error handling', () => {
        it('should propagate errors when reward already claimed', async () => {
            httpService.post.mockReturnValue(throwError(() => new Error('Already claimed')));

            await expect(resolvers.claimReward(mockUser, 'reward-1')).rejects.toThrow(
                'Already claimed'
            );
        });
    });

    describe('completeQuestTask - error handling', () => {
        it('should propagate errors for invalid task', async () => {
            httpService.post.mockReturnValue(throwError(() => new Error('Task not found')));

            await expect(
                resolvers.completeQuestTask(mockUser, 'quest-1', 'task-99')
            ).rejects.toThrow('Task not found');
        });
    });

    describe('acknowledgeAchievement - error handling', () => {
        it('should propagate errors', async () => {
            httpService.post.mockReturnValue(throwError(() => new Error('Not Found')));

            await expect(resolvers.acknowledgeAchievement(mockUser, 'ach-99')).rejects.toThrow(
                'Not Found'
            );
        });
    });
});
