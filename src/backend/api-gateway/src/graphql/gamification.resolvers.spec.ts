import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

import { GamificationResolvers } from './gamification.resolvers';

describe('GamificationResolvers', () => {
    let resolvers: GamificationResolvers;
    let httpService: jest.Mocked<HttpService>;

    const mockUser = { id: 'user-1', email: 'test@example.com' };

    beforeEach(async () => {
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
                expect.objectContaining({ userId: 'user-1' }),
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
});
