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
