/**
 * Tests for src/web/web/src/api/wellness.ts
 *
 * The wellness module uses restClient (axios) with try/catch error wrapping.
 * We mock restClient to validate endpoints, methods, and error handling.
 */

import {
    deleteJournalEntry,
    updateJournalEntry,
    leaveWellnessChallenge,
    getWellnessChallengeLeaderboard,
    createWellnessGoal,
    deleteWellnessGoal,
    getMoodHistory,
    getBreathingTechniques,
    getMeditationTypes,
    completeWellnessActivity,
} from '../wellness';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRestClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../client', () => ({
    restClient: mockRestClient,
}));

beforeEach(() => {
    jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// deleteJournalEntry
// ---------------------------------------------------------------------------

describe('deleteJournalEntry', () => {
    it('should DELETE /wellness/journal/:entryId', async () => {
        mockRestClient.delete.mockResolvedValue({});

        await deleteJournalEntry('je1');

        expect(mockRestClient.delete).toHaveBeenCalledWith('/wellness/journal/je1');
    });

    it('should throw wrapped error on failure', async () => {
        mockRestClient.delete.mockRejectedValue(new Error('Server error'));

        await expect(deleteJournalEntry('je1')).rejects.toThrow('Server error');
    });

    it('should wrap non-Error rejections', async () => {
        mockRestClient.delete.mockRejectedValue('raw string');

        await expect(deleteJournalEntry('je1')).rejects.toThrow('Failed to delete journal entry');
    });
});

// ---------------------------------------------------------------------------
// updateJournalEntry
// ---------------------------------------------------------------------------

describe('updateJournalEntry', () => {
    it('should PUT /wellness/journal/:entryId with update data', async () => {
        const entry = {
            id: 'je1',
            userId: 'u1',
            title: 'Updated',
            content: 'New content',
            mood: 'happy',
            tags: ['wellness'],
            createdAt: '2026-01-01',
            updatedAt: '2026-01-15',
        };
        mockRestClient.put.mockResolvedValue({ data: entry });

        const updates = { title: 'Updated', content: 'New content' };
        const result = await updateJournalEntry('je1', updates);

        expect(mockRestClient.put).toHaveBeenCalledWith('/wellness/journal/je1', updates);
        expect(result).toEqual(entry);
    });

    it('should wrap non-Error rejections', async () => {
        mockRestClient.put.mockRejectedValue('raw string');

        await expect(updateJournalEntry('je1', { title: 'X' })).rejects.toThrow('Failed to update journal entry');
    });
});

// ---------------------------------------------------------------------------
// leaveWellnessChallenge
// ---------------------------------------------------------------------------

describe('leaveWellnessChallenge', () => {
    it('should POST /wellness/challenges/:id/leave with userId', async () => {
        mockRestClient.post.mockResolvedValue({});

        await leaveWellnessChallenge('u1', 'ch1');

        expect(mockRestClient.post).toHaveBeenCalledWith('/wellness/challenges/ch1/leave', { userId: 'u1' });
    });

    it('should wrap non-Error rejections', async () => {
        mockRestClient.post.mockRejectedValue('raw string');

        await expect(leaveWellnessChallenge('u1', 'ch1')).rejects.toThrow('Failed to leave wellness challenge');
    });
});

// ---------------------------------------------------------------------------
// getWellnessChallengeLeaderboard
// ---------------------------------------------------------------------------

describe('getWellnessChallengeLeaderboard', () => {
    it('should GET /wellness/challenges/:id/leaderboard', async () => {
        const leaderboard = [
            { userId: 'u1', name: 'John', progress: 85, rank: 1 },
            { userId: 'u2', name: 'Jane', progress: 70, rank: 2 },
        ];
        mockRestClient.get.mockResolvedValue({ data: leaderboard });

        const result = await getWellnessChallengeLeaderboard('ch1');

        expect(mockRestClient.get).toHaveBeenCalledWith('/wellness/challenges/ch1/leaderboard');
        expect(result).toEqual(leaderboard);
    });

    it('should wrap non-Error rejections', async () => {
        mockRestClient.get.mockRejectedValue('raw string');

        await expect(getWellnessChallengeLeaderboard('ch1')).rejects.toThrow(
            'Failed to retrieve challenge leaderboard'
        );
    });
});

// ---------------------------------------------------------------------------
// createWellnessGoal
// ---------------------------------------------------------------------------

describe('createWellnessGoal', () => {
    it('should POST /wellness/goals with userId and goal data', async () => {
        const goal = {
            id: 'wg1',
            userId: 'u1',
            category: 'mindfulness',
            title: 'Meditate daily',
            target: 30,
            current: 0,
            unit: 'minutes',
            status: 'active',
        };
        mockRestClient.post.mockResolvedValue({ data: goal });

        const input = { category: 'mindfulness', title: 'Meditate daily', target: 30, unit: 'minutes' };
        const result = await createWellnessGoal('u1', input);

        expect(mockRestClient.post).toHaveBeenCalledWith('/wellness/goals', { userId: 'u1', ...input });
        expect(result).toEqual(goal);
    });

    it('should wrap non-Error rejections', async () => {
        mockRestClient.post.mockRejectedValue('raw string');

        await expect(createWellnessGoal('u1', { category: 'x', title: 'x', target: 1, unit: 'x' })).rejects.toThrow(
            'Failed to create wellness goal'
        );
    });
});

// ---------------------------------------------------------------------------
// deleteWellnessGoal
// ---------------------------------------------------------------------------

describe('deleteWellnessGoal', () => {
    it('should DELETE /wellness/goals/:goalId', async () => {
        mockRestClient.delete.mockResolvedValue({});

        await deleteWellnessGoal('wg1');

        expect(mockRestClient.delete).toHaveBeenCalledWith('/wellness/goals/wg1');
    });

    it('should wrap non-Error rejections', async () => {
        mockRestClient.delete.mockRejectedValue('raw string');

        await expect(deleteWellnessGoal('wg1')).rejects.toThrow('Failed to delete wellness goal');
    });
});

// ---------------------------------------------------------------------------
// getMoodHistory
// ---------------------------------------------------------------------------

describe('getMoodHistory', () => {
    it('should GET /wellness/companion/mood-history with userId and optional dates', async () => {
        const history = [{ id: 'mc1', userId: 'u1', mood: 'good', energy: 7, stress: 3, timestamp: '2026-01-15' }];
        mockRestClient.get.mockResolvedValue({ data: history });

        const result = await getMoodHistory('u1', '2026-01-01', '2026-01-31');

        expect(mockRestClient.get).toHaveBeenCalledWith('/wellness/companion/mood-history', {
            params: { userId: 'u1', startDate: '2026-01-01', endDate: '2026-01-31' },
        });
        expect(result).toEqual(history);
    });

    it('should work without date parameters', async () => {
        const history = [{ id: 'mc1' }];
        mockRestClient.get.mockResolvedValue({ data: history });

        const result = await getMoodHistory('u1');

        expect(mockRestClient.get).toHaveBeenCalledWith('/wellness/companion/mood-history', {
            params: { userId: 'u1', startDate: undefined, endDate: undefined },
        });
        expect(result).toEqual(history);
    });

    it('should wrap non-Error rejections', async () => {
        mockRestClient.get.mockRejectedValue('raw string');

        await expect(getMoodHistory('u1')).rejects.toThrow('Failed to retrieve mood history');
    });
});

// ---------------------------------------------------------------------------
// getBreathingTechniques
// ---------------------------------------------------------------------------

describe('getBreathingTechniques', () => {
    it('should GET /wellness/sessions/breathing/techniques', async () => {
        const techniques = [{ id: 'bt1', name: '4-7-8 Breathing', description: 'Calm down', durationMinutes: 5 }];
        mockRestClient.get.mockResolvedValue({ data: techniques });

        const result = await getBreathingTechniques();

        expect(mockRestClient.get).toHaveBeenCalledWith('/wellness/sessions/breathing/techniques');
        expect(result).toEqual(techniques);
    });

    it('should wrap non-Error rejections', async () => {
        mockRestClient.get.mockRejectedValue('raw string');

        await expect(getBreathingTechniques()).rejects.toThrow('Failed to retrieve breathing techniques');
    });
});

// ---------------------------------------------------------------------------
// getMeditationTypes
// ---------------------------------------------------------------------------

describe('getMeditationTypes', () => {
    it('should GET /wellness/sessions/meditation/types', async () => {
        const types = [{ id: 'mt1', name: 'Body Scan', description: 'Full body scan', audioUrl: 'https://audio.url' }];
        mockRestClient.get.mockResolvedValue({ data: types });

        const result = await getMeditationTypes();

        expect(mockRestClient.get).toHaveBeenCalledWith('/wellness/sessions/meditation/types');
        expect(result).toEqual(types);
    });

    it('should wrap non-Error rejections', async () => {
        mockRestClient.get.mockRejectedValue('raw string');

        await expect(getMeditationTypes()).rejects.toThrow('Failed to retrieve meditation types');
    });
});

// ---------------------------------------------------------------------------
// completeWellnessActivity
// ---------------------------------------------------------------------------

describe('completeWellnessActivity', () => {
    it('should POST /wellness/daily-plan/activities/:activityId/complete with userId', async () => {
        const updatedPlan = {
            id: 'dp1',
            userId: 'u1',
            date: '2026-01-15',
            activities: [],
            completedCount: 3,
            totalCount: 5,
        };
        mockRestClient.post.mockResolvedValue({ data: updatedPlan });

        const result = await completeWellnessActivity('u1', 'act1');

        expect(mockRestClient.post).toHaveBeenCalledWith('/wellness/daily-plan/activities/act1/complete', {
            userId: 'u1',
        });
        expect(result).toEqual(updatedPlan);
    });

    it('should wrap non-Error rejections', async () => {
        mockRestClient.post.mockRejectedValue('raw string');

        await expect(completeWellnessActivity('u1', 'act1')).rejects.toThrow('Failed to complete wellness activity');
    });
});
