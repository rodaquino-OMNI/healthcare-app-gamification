/**
 * Tests for src/web/mobile/src/api/gamification.ts
 *
 * The mobile gamification module uses restClient (axios) with auth headers via getAuthSession.
 * We mock restClient and AsyncStorage to validate endpoints, auth, and error handling.
 */

import { restClient } from '../client';
import {
    getGameProfile,
    updateGameProfile,
    getAchievements,
    getQuests,
    getRewards,
    getLeaderboard,
    updateQuestProgress,
    completeQuest,
    redeemReward,
    getRewardHistory,
    getStreakStatus,
    updateStreak,
} from '../gamification';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../client', () => ({
    restClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
    },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AsyncStorage = require('@react-native-async-storage/async-storage');

const MOCK_SESSION = { accessToken: 'test-token', refreshToken: 'rt', expiresAt: Date.now() + 3600000, userId: 'u1' };

beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(MOCK_SESSION));
});

// ---------------------------------------------------------------------------
// getGameProfile
// ---------------------------------------------------------------------------

describe('getGameProfile', () => {
    it('should GET /api/gamification/profiles/:userId with auth', async () => {
        const profile = { id: 'gp1', userId: 'u1', level: 5 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: profile });

        const result = await getGameProfile('u1');

        expect(restClient.get).toHaveBeenCalledWith('/api/gamification/profiles/u1', {
            headers: { Authorization: 'Bearer test-token' },
        });
        expect(result).toEqual(profile);
    });

    it('should throw when not authenticated', async () => {
        AsyncStorage.getItem.mockResolvedValue(null);

        await expect(getGameProfile('u1')).rejects.toThrow('Authentication required');
    });
});

// ---------------------------------------------------------------------------
// updateGameProfile
// ---------------------------------------------------------------------------

describe('updateGameProfile', () => {
    it('should PATCH /api/gamification/profiles/:userId', async () => {
        const updated = { id: 'gp1', userId: 'u1', level: 6 };
        (restClient.patch as jest.Mock).mockResolvedValue({ data: updated });

        const result = await updateGameProfile('u1', { level: 6 } as any);

        expect(restClient.patch).toHaveBeenCalledWith(
            '/api/gamification/profiles/u1',
            { level: 6 },
            { headers: { Authorization: 'Bearer test-token' } }
        );
        expect(result).toEqual(updated);
    });
});

// ---------------------------------------------------------------------------
// getAchievements
// ---------------------------------------------------------------------------

describe('getAchievements', () => {
    it('should GET /api/gamification/profiles/:userId/achievements', async () => {
        const achievements = [{ id: 'a1', title: 'First Step' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: achievements });

        const result = await getAchievements('u1');

        expect(restClient.get).toHaveBeenCalledWith('/api/gamification/profiles/u1/achievements', {
            headers: { Authorization: 'Bearer test-token' },
        });
        expect(result).toEqual(achievements);
    });
});

// ---------------------------------------------------------------------------
// getQuests
// ---------------------------------------------------------------------------

describe('getQuests', () => {
    it('should GET /api/gamification/profiles/:userId/quests', async () => {
        const quests = [{ id: 'q1', title: 'Daily Quest' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: quests });

        const result = await getQuests('u1');

        expect(restClient.get).toHaveBeenCalledWith('/api/gamification/profiles/u1/quests', {
            headers: { Authorization: 'Bearer test-token' },
        });
        expect(result).toEqual(quests);
    });
});

// ---------------------------------------------------------------------------
// getRewards
// ---------------------------------------------------------------------------

describe('getRewards', () => {
    it('should GET /api/gamification/profiles/:userId/rewards', async () => {
        const rewards = [{ id: 'r1', title: 'Gold Badge' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: rewards });

        const result = await getRewards('u1');

        expect(restClient.get).toHaveBeenCalledWith('/api/gamification/profiles/u1/rewards', {
            headers: { Authorization: 'Bearer test-token' },
        });
        expect(result).toEqual(rewards);
    });
});

// ---------------------------------------------------------------------------
// getLeaderboard
// ---------------------------------------------------------------------------

describe('getLeaderboard', () => {
    it('should GET /api/gamification/leaderboard with optional period', async () => {
        const leaderboard = [{ rank: 1, userId: 'u2', displayName: 'Jane', points: 500 }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: leaderboard });

        const result = await getLeaderboard('weekly');

        expect(restClient.get).toHaveBeenCalledWith('/api/gamification/leaderboard', {
            params: { period: 'weekly' },
            headers: { Authorization: 'Bearer test-token' },
        });
        expect(result).toEqual(leaderboard);
    });

    it('should work without period parameter', async () => {
        (restClient.get as jest.Mock).mockResolvedValue({ data: [] });

        await getLeaderboard();

        expect(restClient.get).toHaveBeenCalledWith(
            '/api/gamification/leaderboard',
            expect.objectContaining({ params: { period: undefined } })
        );
    });
});

// ---------------------------------------------------------------------------
// updateQuestProgress
// ---------------------------------------------------------------------------

describe('updateQuestProgress', () => {
    it('should POST /api/gamification/profiles/:userId/quests/:questId/progress', async () => {
        const quest = { id: 'q1', progress: 75 };
        (restClient.post as jest.Mock).mockResolvedValue({ data: quest });

        const result = await updateQuestProgress('u1', 'q1', 75);

        expect(restClient.post).toHaveBeenCalledWith(
            '/api/gamification/profiles/u1/quests/q1/progress',
            { progress: 75 },
            { headers: { Authorization: 'Bearer test-token' } }
        );
        expect(result).toEqual(quest);
    });
});

// ---------------------------------------------------------------------------
// completeQuest
// ---------------------------------------------------------------------------

describe('completeQuest', () => {
    it('should POST /api/gamification/profiles/:userId/quests/:questId/complete', async () => {
        const quest = { id: 'q1', completed: true };
        (restClient.post as jest.Mock).mockResolvedValue({ data: quest });

        const result = await completeQuest('u1', 'q1');

        expect(restClient.post).toHaveBeenCalledWith(
            '/api/gamification/profiles/u1/quests/q1/complete',
            {},
            { headers: { Authorization: 'Bearer test-token' } }
        );
        expect(result).toEqual(quest);
    });
});

// ---------------------------------------------------------------------------
// redeemReward
// ---------------------------------------------------------------------------

describe('redeemReward', () => {
    it('should POST /api/gamification/profiles/:userId/rewards/:rewardId/redeem', async () => {
        const redemption = { id: 'rd1', rewardId: 'r1', status: 'pending' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: redemption });

        const result = await redeemReward('u1', 'r1');

        expect(restClient.post).toHaveBeenCalledWith(
            '/api/gamification/profiles/u1/rewards/r1/redeem',
            {},
            { headers: { Authorization: 'Bearer test-token' } }
        );
        expect(result).toEqual(redemption);
    });
});

// ---------------------------------------------------------------------------
// getRewardHistory
// ---------------------------------------------------------------------------

describe('getRewardHistory', () => {
    it('should GET /api/gamification/profiles/:userId/rewards/history', async () => {
        const history = [{ id: 'rd1', rewardId: 'r1' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: history });

        const result = await getRewardHistory('u1');

        expect(restClient.get).toHaveBeenCalledWith('/api/gamification/profiles/u1/rewards/history', {
            headers: { Authorization: 'Bearer test-token' },
        });
        expect(result).toEqual(history);
    });
});

// ---------------------------------------------------------------------------
// getStreakStatus
// ---------------------------------------------------------------------------

describe('getStreakStatus', () => {
    it('should GET /api/gamification/profiles/:userId/streak', async () => {
        const streak = { currentStreak: 5, longestStreak: 10 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: streak });

        const result = await getStreakStatus('u1');

        expect(restClient.get).toHaveBeenCalledWith('/api/gamification/profiles/u1/streak', {
            headers: { Authorization: 'Bearer test-token' },
        });
        expect(result).toEqual(streak);
    });
});

// ---------------------------------------------------------------------------
// updateStreak
// ---------------------------------------------------------------------------

describe('updateStreak', () => {
    it('should POST /api/gamification/profiles/:userId/streak/update', async () => {
        const streak = { currentStreak: 6, longestStreak: 10 };
        (restClient.post as jest.Mock).mockResolvedValue({ data: streak });

        const result = await updateStreak('u1', 'daily_login');

        expect(restClient.post).toHaveBeenCalledWith(
            '/api/gamification/profiles/u1/streak/update',
            { streakType: 'daily_login' },
            { headers: { Authorization: 'Bearer test-token' } }
        );
        expect(result).toEqual(streak);
    });
});
