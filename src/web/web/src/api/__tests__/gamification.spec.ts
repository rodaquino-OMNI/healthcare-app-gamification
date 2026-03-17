/* eslint-disable @typescript-eslint/unbound-method */
/**
 * Tests for src/web/web/src/api/gamification.ts
 *
 * The web gamification module uses axios directly (not restClient).
 * We mock axios to validate endpoints, methods, and error handling.
 */

import axios from 'axios';

import {
    getGameProfile,
    getUserAchievements,
    getUserQuests,
    getUserRewards,
    getJourneyAchievements,
    acknowledgeAchievement,
    triggerGamificationEvent,
    getAchievementDetail,
    getQuestDetail,
    getRewardDetail,
    getXpHistory,
    getLevelProgress,
    getJourneyQuests,
    acknowledgeReward,
    getAchievementProgress,
    getDailyChallenge,
    getWeeklyChallenge,
} from '../gamification';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
    jest.clearAllMocks();
});

const BASE_URL = 'https://api.austa.com.br/gamification';

// ---------------------------------------------------------------------------
// getGameProfile
// ---------------------------------------------------------------------------

describe('getGameProfile', () => {
    it('should GET /gamification/profiles/:userId', async () => {
        const profile = { id: 'gp1', userId: 'u1', level: 5 };
        mockedAxios.get.mockResolvedValue({ data: profile });

        const result = await getGameProfile('u1');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/profiles/u1`);
        expect(result).toEqual(profile);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Network error'));

        await expect(getGameProfile('u1')).rejects.toThrow('Failed to retrieve game profile. Please try again later.');
    });
});

// ---------------------------------------------------------------------------
// getUserAchievements
// ---------------------------------------------------------------------------

describe('getUserAchievements', () => {
    it('should GET /gamification/users/:userId/achievements', async () => {
        const achievements = [{ id: 'a1', title: 'First Step' }];
        mockedAxios.get.mockResolvedValue({ data: achievements });

        const result = await getUserAchievements('u1');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/u1/achievements`);
        expect(result).toEqual(achievements);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('timeout'));

        await expect(getUserAchievements('u1')).rejects.toThrow(
            'Failed to retrieve achievements. Please try again later.'
        );
    });
});

// ---------------------------------------------------------------------------
// getUserQuests
// ---------------------------------------------------------------------------

describe('getUserQuests', () => {
    it('should GET /gamification/users/:userId/quests', async () => {
        const quests = [{ id: 'q1', title: 'Daily Quest' }];
        mockedAxios.get.mockResolvedValue({ data: quests });

        const result = await getUserQuests('u1');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/u1/quests`);
        expect(result).toEqual(quests);
    });
});

// ---------------------------------------------------------------------------
// getUserRewards
// ---------------------------------------------------------------------------

describe('getUserRewards', () => {
    it('should GET /gamification/users/:userId/rewards', async () => {
        const rewards = [{ id: 'r1', title: 'Badge' }];
        mockedAxios.get.mockResolvedValue({ data: rewards });

        const result = await getUserRewards('u1');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/u1/rewards`);
        expect(result).toEqual(rewards);
    });
});

// ---------------------------------------------------------------------------
// getJourneyAchievements
// ---------------------------------------------------------------------------

describe('getJourneyAchievements', () => {
    it('should GET /gamification/users/:userId/journeys/:journey/achievements', async () => {
        const achievements = [{ id: 'a1', journey: 'health' }];
        mockedAxios.get.mockResolvedValue({ data: achievements });

        const result = await getJourneyAchievements('u1', 'health');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/u1/journeys/health/achievements`);
        expect(result).toEqual(achievements);
    });
});

// ---------------------------------------------------------------------------
// acknowledgeAchievement
// ---------------------------------------------------------------------------

describe('acknowledgeAchievement', () => {
    it('should POST /gamification/users/:userId/achievements/:id/acknowledge', async () => {
        mockedAxios.post.mockResolvedValue({});

        await acknowledgeAchievement('u1', 'a1');

        expect(mockedAxios.post).toHaveBeenCalledWith(`${BASE_URL}/users/u1/achievements/a1/acknowledge`);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.post.mockRejectedValue(new Error('fail'));

        await expect(acknowledgeAchievement('u1', 'a1')).rejects.toThrow(
            'Failed to acknowledge achievement. Please try again later.'
        );
    });
});

// ---------------------------------------------------------------------------
// triggerGamificationEvent
// ---------------------------------------------------------------------------

describe('triggerGamificationEvent', () => {
    it('should POST /gamification/events with event data', async () => {
        const response = { achievements: [], rewards: [] };
        mockedAxios.post.mockResolvedValue({ data: response });

        const result = await triggerGamificationEvent('u1', 'quest_complete', { questId: 'q1' });

        expect(mockedAxios.post).toHaveBeenCalledWith(`${BASE_URL}/events`, {
            userId: 'u1',
            eventType: 'quest_complete',
            eventData: { questId: 'q1' },
        });
        expect(result).toEqual(response);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.post.mockRejectedValue(new Error('fail'));

        await expect(triggerGamificationEvent('u1', 'test', {})).rejects.toThrow(
            'Failed to record your activity. Please try again later.'
        );
    });
});

// ---------------------------------------------------------------------------
// getAchievementDetail (new)
// ---------------------------------------------------------------------------

describe('getAchievementDetail', () => {
    it('should GET /gamification/achievements/:id', async () => {
        const detail = { id: 'a1', title: 'First Step', criteria: ['Login once'], tips: ['Open the app'] };
        mockedAxios.get.mockResolvedValue({ data: detail });

        const result = await getAchievementDetail('a1');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/achievements/a1`);
        expect(result).toEqual(detail);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('fail'));

        await expect(getAchievementDetail('a1')).rejects.toThrow(
            'Failed to retrieve achievement detail. Please try again later.'
        );
    });
});

// ---------------------------------------------------------------------------
// getQuestDetail (new)
// ---------------------------------------------------------------------------

describe('getQuestDetail', () => {
    it('should GET /gamification/quests/:id', async () => {
        const detail = { id: 'q1', title: 'Daily Quest', steps: [{ description: 'Step 1', completed: false }] };
        mockedAxios.get.mockResolvedValue({ data: detail });

        const result = await getQuestDetail('q1');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/quests/q1`);
        expect(result).toEqual(detail);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('fail'));

        await expect(getQuestDetail('q1')).rejects.toThrow('Failed to retrieve quest detail. Please try again later.');
    });
});

// ---------------------------------------------------------------------------
// getRewardDetail (new)
// ---------------------------------------------------------------------------

describe('getRewardDetail', () => {
    it('should GET /gamification/rewards/:id', async () => {
        const detail = { id: 'r1', title: 'Badge', terms: 'T&C', redemptionInstructions: 'Click redeem' };
        mockedAxios.get.mockResolvedValue({ data: detail });

        const result = await getRewardDetail('r1');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/rewards/r1`);
        expect(result).toEqual(detail);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('fail'));

        await expect(getRewardDetail('r1')).rejects.toThrow(
            'Failed to retrieve reward detail. Please try again later.'
        );
    });
});

// ---------------------------------------------------------------------------
// getXpHistory (new)
// ---------------------------------------------------------------------------

describe('getXpHistory', () => {
    it('should GET /gamification/users/:userId/xp-history', async () => {
        const history = [{ amount: 50, reason: 'quest_complete', timestamp: '2026-01-01' }];
        mockedAxios.get.mockResolvedValue({ data: history });

        const result = await getXpHistory('u1', 10);

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/u1/xp-history`, { params: { limit: 10 } });
        expect(result).toEqual(history);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('fail'));

        await expect(getXpHistory('u1')).rejects.toThrow('Failed to retrieve XP history. Please try again later.');
    });
});

// ---------------------------------------------------------------------------
// getLevelProgress (new)
// ---------------------------------------------------------------------------

describe('getLevelProgress', () => {
    it('should GET /gamification/users/:userId/level-progress', async () => {
        const progress = { currentLevel: 5, currentXp: 450, nextLevelXp: 500, progress: 0.9 };
        mockedAxios.get.mockResolvedValue({ data: progress });

        const result = await getLevelProgress('u1');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/u1/level-progress`);
        expect(result).toEqual(progress);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('fail'));

        await expect(getLevelProgress('u1')).rejects.toThrow(
            'Failed to retrieve level progress. Please try again later.'
        );
    });
});

// ---------------------------------------------------------------------------
// getJourneyQuests (new)
// ---------------------------------------------------------------------------

describe('getJourneyQuests', () => {
    it('should GET /gamification/users/:userId/journeys/:journey/quests', async () => {
        const quests = [{ id: 'q1', title: 'Health Quest', journey: 'health' }];
        mockedAxios.get.mockResolvedValue({ data: quests });

        const result = await getJourneyQuests('u1', 'health');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/u1/journeys/health/quests`);
        expect(result).toEqual(quests);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('fail'));

        await expect(getJourneyQuests('u1', 'health')).rejects.toThrow(
            'Failed to retrieve health journey quests. Please try again later.'
        );
    });
});

// ---------------------------------------------------------------------------
// acknowledgeReward (new)
// ---------------------------------------------------------------------------

describe('acknowledgeReward', () => {
    it('should POST /gamification/users/:userId/rewards/:rewardId/acknowledge', async () => {
        mockedAxios.post.mockResolvedValue({});

        await acknowledgeReward('u1', 'r1');

        expect(mockedAxios.post).toHaveBeenCalledWith(`${BASE_URL}/users/u1/rewards/r1/acknowledge`);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.post.mockRejectedValue(new Error('fail'));

        await expect(acknowledgeReward('u1', 'r1')).rejects.toThrow(
            'Failed to acknowledge reward. Please try again later.'
        );
    });
});

// ---------------------------------------------------------------------------
// getAchievementProgress (new)
// ---------------------------------------------------------------------------

describe('getAchievementProgress', () => {
    it('should GET /gamification/users/:userId/achievements/:id/progress', async () => {
        const progress = { current: 3, target: 10, percentage: 30 };
        mockedAxios.get.mockResolvedValue({ data: progress });

        const result = await getAchievementProgress('u1', 'a1');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/u1/achievements/a1/progress`);
        expect(result).toEqual(progress);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('fail'));

        await expect(getAchievementProgress('u1', 'a1')).rejects.toThrow(
            'Failed to retrieve achievement progress. Please try again later.'
        );
    });
});

// ---------------------------------------------------------------------------
// getDailyChallenge (new)
// ---------------------------------------------------------------------------

describe('getDailyChallenge', () => {
    it('should GET /gamification/users/:userId/daily-challenge', async () => {
        const challenge = { id: 'dc1', title: 'Daily Steps', progress: 0, completed: false };
        mockedAxios.get.mockResolvedValue({ data: challenge });

        const result = await getDailyChallenge('u1');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/u1/daily-challenge`);
        expect(result).toEqual(challenge);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('fail'));

        await expect(getDailyChallenge('u1')).rejects.toThrow(
            'Failed to retrieve daily challenge. Please try again later.'
        );
    });
});

// ---------------------------------------------------------------------------
// getWeeklyChallenge (new)
// ---------------------------------------------------------------------------

describe('getWeeklyChallenge', () => {
    it('should GET /gamification/users/:userId/weekly-challenge', async () => {
        const challenge = { id: 'wc1', title: 'Weekly Workout', progress: 2, completed: false };
        mockedAxios.get.mockResolvedValue({ data: challenge });

        const result = await getWeeklyChallenge('u1');

        expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/u1/weekly-challenge`);
        expect(result).toEqual(challenge);
    });

    it('should throw user-friendly error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('fail'));

        await expect(getWeeklyChallenge('u1')).rejects.toThrow(
            'Failed to retrieve weekly challenge. Please try again later.'
        );
    });
});
