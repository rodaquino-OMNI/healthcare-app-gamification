/**
 * Tests for src/web/shared/api/gamification.ts
 *
 * This module uses the native fetch API (not axios/restClient).
 * We mock global.fetch to validate endpoint calls, request shapes, and error handling.
 */

import {
    getGameProfile,
    getUserAchievements,
    getUserQuests,
    getUserRewards,
    submitGamificationEvent,
} from '../gamification';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
    jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// getGameProfile
// ---------------------------------------------------------------------------

describe('getGameProfile', () => {
    it('should call the correct endpoint with GET method', async () => {
        const mockProfile = { id: '1', userId: 'u1', level: 5, xp: 100 };
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockProfile),
        });

        const result = await getGameProfile('u1');

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/gamification/profiles/u1');
        expect(options.method).toBe('GET');
        expect(result).toEqual(mockProfile);
    });

    it('should throw a user-friendly error on network failure', async () => {
        mockFetch.mockRejectedValue(new Error('Network error'));

        await expect(getGameProfile('u1')).rejects.toThrow('Failed to retrieve game profile. Please try again later.');
    });

    it('should throw on HTTP error status', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValue({}),
        });

        await expect(getGameProfile('u1')).rejects.toThrow('Failed to retrieve game profile. Please try again later.');
    });
});

// ---------------------------------------------------------------------------
// getUserAchievements
// ---------------------------------------------------------------------------

describe('getUserAchievements', () => {
    it('should call the achievements endpoint with userId query param', async () => {
        const mockAchievements = [{ id: 'a1', title: 'First Step' }];
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockAchievements),
        });

        const result = await getUserAchievements('u1');

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [url] = mockFetch.mock.calls[0];
        expect(url).toContain('/gamification/achievements');
        expect(url).toContain('userId=u1');
        expect(result).toEqual(mockAchievements);
    });

    it('should throw a user-friendly error on failure', async () => {
        mockFetch.mockRejectedValue(new Error('timeout'));

        await expect(getUserAchievements('u1')).rejects.toThrow(
            'Failed to retrieve achievements. Please try again later.'
        );
    });
});

// ---------------------------------------------------------------------------
// getUserQuests
// ---------------------------------------------------------------------------

describe('getUserQuests', () => {
    it('should call the quests endpoint with userId query param', async () => {
        const mockQuests = [{ id: 'q1', title: 'Daily Check' }];
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockQuests),
        });

        const result = await getUserQuests('u1');

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [url] = mockFetch.mock.calls[0];
        expect(url).toContain('/gamification/quests');
        expect(url).toContain('userId=u1');
        expect(result).toEqual(mockQuests);
    });

    it('should throw a user-friendly error on failure', async () => {
        mockFetch.mockRejectedValue(new Error('timeout'));

        await expect(getUserQuests('u1')).rejects.toThrow('Failed to retrieve quests. Please try again later.');
    });
});

// ---------------------------------------------------------------------------
// getUserRewards
// ---------------------------------------------------------------------------

describe('getUserRewards', () => {
    it('should call the rewards endpoint with userId query param', async () => {
        const mockRewards = [{ id: 'r1', title: 'Badge' }];
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockRewards),
        });

        const result = await getUserRewards('u1');

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [url] = mockFetch.mock.calls[0];
        expect(url).toContain('/gamification/rewards');
        expect(url).toContain('userId=u1');
        expect(result).toEqual(mockRewards);
    });

    it('should throw a user-friendly error on failure', async () => {
        mockFetch.mockRejectedValue(new Error('fail'));

        await expect(getUserRewards('u1')).rejects.toThrow('Failed to retrieve rewards. Please try again later.');
    });
});

// ---------------------------------------------------------------------------
// submitGamificationEvent
// ---------------------------------------------------------------------------

describe('submitGamificationEvent', () => {
    it('should POST to the events endpoint with correct body', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({}),
        });

        await submitGamificationEvent('u1', 'quest_complete', { questId: 'q1' });

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/gamification/events');
        expect(options.method).toBe('POST');
        expect(options.headers['Content-Type']).toBe('application/json');

        const body = JSON.parse(options.body);
        expect(body.userId).toBe('u1');
        expect(body.eventType).toBe('quest_complete');
        expect(body.eventData).toEqual({ questId: 'q1' });
        expect(body.timestamp).toBeDefined();
    });

    it('should throw a user-friendly error on failure', async () => {
        mockFetch.mockRejectedValue(new Error('fail'));

        await expect(submitGamificationEvent('u1', 'test', {})).rejects.toThrow(
            'Failed to record activity. Your progress will be updated later.'
        );
    });

    it('should throw on HTTP error response', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 400,
            json: jest.fn().mockResolvedValue({}),
        });

        await expect(submitGamificationEvent('u1', 'test', {})).rejects.toThrow(
            'Failed to record activity. Your progress will be updated later.'
        );
    });
});
