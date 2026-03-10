/**
 * Tests for src/web/mobile/src/api/wellness.ts
 *
 * The mobile wellness module uses restClient (axios) with auth from care.getAuthSession.
 * We mock restClient and AsyncStorage to validate endpoints, auth, and error handling.
 */

import { restClient } from '../client';
import {
    sendCompanionMessage,
    getCompanionHistory,
    getMoodCheckInPrompt,
    submitMoodCheckIn,
    startBreathingSession,
    startMeditationSession,
    getDailyPlan,
    getWellnessInsights,
    getWellnessGoals,
    updateWellnessGoal,
    getJournalEntries,
    createJournalEntry,
    getJournalHistory,
    getWellnessChallenges,
    getWellnessChallengeDetail,
    joinWellnessChallenge,
    getWellnessStreaks,
    updateWellnessStreak,
    getWellnessTip,
    getCompanionQuickReplies,
} from '../wellness';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../client', () => ({
    restClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

const AsyncStorage = require('@react-native-async-storage/async-storage');

const MOCK_SESSION = { accessToken: 'test-token', refreshToken: 'rt', expiresAt: Date.now() + 3600000, userId: 'u1' };

beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(MOCK_SESSION));
});

// ---------------------------------------------------------------------------
// Companion Chat
// ---------------------------------------------------------------------------

describe('sendCompanionMessage', () => {
    it('should POST /wellness/companion/messages', async () => {
        const message = { id: 'm1', role: 'assistant', content: 'Hello!' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: message });

        const result = await sendCompanionMessage('u1', 'Hi', 'session-1');

        expect(restClient.post).toHaveBeenCalledWith(
            '/wellness/companion/messages',
            { userId: 'u1', content: 'Hi', sessionId: 'session-1' },
            expect.objectContaining({
                headers: { Authorization: 'Bearer test-token' },
            })
        );
        expect(result).toEqual(message);
    });
});

describe('getCompanionHistory', () => {
    it('should GET /wellness/companion/history', async () => {
        const history = { sessionId: 's1', messages: [] };
        (restClient.get as jest.Mock).mockResolvedValue({ data: history });

        const result = await getCompanionHistory('u1', 's1');

        expect(restClient.get).toHaveBeenCalledWith(
            '/wellness/companion/history',
            expect.objectContaining({
                params: { userId: 'u1', sessionId: 's1' },
            })
        );
        expect(result).toEqual(history);
    });
});

describe('getMoodCheckInPrompt', () => {
    it('should GET /wellness/companion/mood-prompt', async () => {
        const prompt = { questions: [{ id: 'q1', text: 'How are you?', type: 'choice' }] };
        (restClient.get as jest.Mock).mockResolvedValue({ data: prompt });

        const result = await getMoodCheckInPrompt('u1');

        expect(restClient.get).toHaveBeenCalledWith(
            '/wellness/companion/mood-prompt',
            expect.objectContaining({ params: { userId: 'u1' } })
        );
        expect(result).toEqual(prompt);
    });
});

describe('submitMoodCheckIn', () => {
    it('should POST /wellness/companion/mood', async () => {
        const checkIn = { id: 'mc1', mood: 'good', energy: 7, stress: 3 };
        (restClient.post as jest.Mock).mockResolvedValue({ data: checkIn });

        const result = await submitMoodCheckIn('u1', { mood: 'good', energy: 7, stress: 3 });

        expect(restClient.post).toHaveBeenCalledWith(
            '/wellness/companion/mood',
            { userId: 'u1', mood: 'good', energy: 7, stress: 3 },
            expect.any(Object)
        );
        expect(result).toEqual(checkIn);
    });
});

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

describe('startBreathingSession', () => {
    it('should POST /wellness/sessions/breathing', async () => {
        const session = { id: 'bs1', technique: '4-7-8', duration: 300 };
        (restClient.post as jest.Mock).mockResolvedValue({ data: session });

        const result = await startBreathingSession('u1', '4-7-8', 300);

        expect(restClient.post).toHaveBeenCalledWith(
            '/wellness/sessions/breathing',
            { userId: 'u1', technique: '4-7-8', duration: 300 },
            expect.any(Object)
        );
        expect(result).toEqual(session);
    });
});

describe('startMeditationSession', () => {
    it('should POST /wellness/sessions/meditation', async () => {
        const session = { id: 'ms1', type: 'guided', duration: 600 };
        (restClient.post as jest.Mock).mockResolvedValue({ data: session });

        const result = await startMeditationSession('u1', 'guided', 600);

        expect(restClient.post).toHaveBeenCalledWith(
            '/wellness/sessions/meditation',
            { userId: 'u1', type: 'guided', duration: 600 },
            expect.any(Object)
        );
        expect(result).toEqual(session);
    });
});

describe('getDailyPlan', () => {
    it('should GET /wellness/daily-plan', async () => {
        const plan = { id: 'dp1', activities: [], completedCount: 0 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: plan });

        const result = await getDailyPlan('u1', '2025-01-15');

        expect(restClient.get).toHaveBeenCalledWith(
            '/wellness/daily-plan',
            expect.objectContaining({ params: { userId: 'u1', date: '2025-01-15' } })
        );
        expect(result).toEqual(plan);
    });
});

// ---------------------------------------------------------------------------
// Insights & Goals
// ---------------------------------------------------------------------------

describe('getWellnessInsights', () => {
    it('should GET /wellness/insights', async () => {
        const insights = [{ id: 'i1', title: 'Sleep improved' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: insights });

        const result = await getWellnessInsights('u1');

        expect(restClient.get).toHaveBeenCalledWith(
            '/wellness/insights',
            expect.objectContaining({ params: { userId: 'u1' } })
        );
        expect(result).toEqual(insights);
    });
});

describe('getWellnessGoals', () => {
    it('should GET /wellness/goals', async () => {
        const goals = [{ id: 'g1', title: 'Meditate daily' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: goals });

        const result = await getWellnessGoals('u1');

        expect(restClient.get).toHaveBeenCalledWith(
            '/wellness/goals',
            expect.objectContaining({ params: { userId: 'u1' } })
        );
        expect(result).toEqual(goals);
    });
});

describe('updateWellnessGoal', () => {
    it('should PUT /wellness/goals/:goalId', async () => {
        const goal = { id: 'g1', title: 'Updated goal' };
        (restClient.put as jest.Mock).mockResolvedValue({ data: goal });

        const result = await updateWellnessGoal('g1', { title: 'Updated goal' } as any);

        expect(restClient.put).toHaveBeenCalledWith(
            '/wellness/goals/g1',
            { title: 'Updated goal' },
            expect.any(Object)
        );
        expect(result).toEqual(goal);
    });
});

// ---------------------------------------------------------------------------
// Journal
// ---------------------------------------------------------------------------

describe('getJournalEntries', () => {
    it('should GET /wellness/journal with pagination', async () => {
        const history = { entries: [], totalCount: 0, page: 1, pageSize: 10 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: history });

        const result = await getJournalEntries('u1', 1, 10);

        expect(restClient.get).toHaveBeenCalledWith(
            '/wellness/journal',
            expect.objectContaining({ params: { userId: 'u1', page: 1, pageSize: 10 } })
        );
        expect(result).toEqual(history);
    });
});

describe('createJournalEntry', () => {
    it('should POST /wellness/journal', async () => {
        const entry = { id: 'je1', title: 'Today', content: 'Good day' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: entry });

        const result = await createJournalEntry('u1', { title: 'Today', content: 'Good day', tags: [] } as any);

        expect(restClient.post).toHaveBeenCalledWith(
            '/wellness/journal',
            expect.objectContaining({ userId: 'u1', title: 'Today' }),
            expect.any(Object)
        );
        expect(result).toEqual(entry);
    });
});

describe('getJournalHistory', () => {
    it('should GET /wellness/journal/history with date range', async () => {
        const entries = [{ id: 'je1' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: entries });

        const result = await getJournalHistory('u1', '2025-01-01', '2025-01-31');

        expect(restClient.get).toHaveBeenCalledWith(
            '/wellness/journal/history',
            expect.objectContaining({
                params: { userId: 'u1', startDate: '2025-01-01', endDate: '2025-01-31' },
            })
        );
        expect(result).toEqual(entries);
    });
});

// ---------------------------------------------------------------------------
// Challenges
// ---------------------------------------------------------------------------

describe('getWellnessChallenges', () => {
    it('should GET /wellness/challenges', async () => {
        const challenges = [{ id: 'ch1', name: '7-Day Meditation' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: challenges });

        const result = await getWellnessChallenges('u1');

        expect(restClient.get).toHaveBeenCalledWith(
            '/wellness/challenges',
            expect.objectContaining({ params: { userId: 'u1' } })
        );
        expect(result).toEqual(challenges);
    });
});

describe('getWellnessChallengeDetail', () => {
    it('should GET /wellness/challenges/:id', async () => {
        const detail = { id: 'ch1', name: '7-Day Meditation', rules: [] };
        (restClient.get as jest.Mock).mockResolvedValue({ data: detail });

        const result = await getWellnessChallengeDetail('ch1');

        expect(restClient.get).toHaveBeenCalledWith('/wellness/challenges/ch1', expect.any(Object));
        expect(result).toEqual(detail);
    });
});

describe('joinWellnessChallenge', () => {
    it('should POST /wellness/challenges/:id/join', async () => {
        const challenge = { id: 'ch1', joined: true };
        (restClient.post as jest.Mock).mockResolvedValue({ data: challenge });

        const result = await joinWellnessChallenge('u1', 'ch1');

        expect(restClient.post).toHaveBeenCalledWith(
            '/wellness/challenges/ch1/join',
            { userId: 'u1' },
            expect.any(Object)
        );
        expect(result).toEqual(challenge);
    });
});

// ---------------------------------------------------------------------------
// Streaks
// ---------------------------------------------------------------------------

describe('getWellnessStreaks', () => {
    it('should GET /wellness/streaks', async () => {
        const streaks = [{ id: 's1', type: 'meditation', currentCount: 5 }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: streaks });

        const result = await getWellnessStreaks('u1');

        expect(restClient.get).toHaveBeenCalledWith(
            '/wellness/streaks',
            expect.objectContaining({ params: { userId: 'u1' } })
        );
        expect(result).toEqual(streaks);
    });
});

describe('updateWellnessStreak', () => {
    it('should POST /wellness/streaks/update', async () => {
        const streak = { id: 's1', currentCount: 6 };
        (restClient.post as jest.Mock).mockResolvedValue({ data: streak });

        const result = await updateWellnessStreak('u1', 'meditation');

        expect(restClient.post).toHaveBeenCalledWith(
            '/wellness/streaks/update',
            { userId: 'u1', type: 'meditation' },
            expect.any(Object)
        );
        expect(result).toEqual(streak);
    });
});

// ---------------------------------------------------------------------------
// Tips & Quick Replies
// ---------------------------------------------------------------------------

describe('getWellnessTip', () => {
    it('should GET /wellness/tips with optional category', async () => {
        const tip = { id: 't1', title: 'Drink more water' };
        (restClient.get as jest.Mock).mockResolvedValue({ data: tip });

        const result = await getWellnessTip('u1', 'hydration');

        expect(restClient.get).toHaveBeenCalledWith(
            '/wellness/tips',
            expect.objectContaining({ params: { userId: 'u1', category: 'hydration' } })
        );
        expect(result).toEqual(tip);
    });
});

describe('getCompanionQuickReplies', () => {
    it('should GET /wellness/companion/quick-replies', async () => {
        const replies = ['Tell me more', 'Thanks'];
        (restClient.get as jest.Mock).mockResolvedValue({ data: replies });

        const result = await getCompanionQuickReplies('u1', 's1');

        expect(restClient.get).toHaveBeenCalledWith(
            '/wellness/companion/quick-replies',
            expect.objectContaining({ params: { userId: 'u1', sessionId: 's1' } })
        );
        expect(result).toEqual(replies);
    });
});

// ---------------------------------------------------------------------------
// Auth error
// ---------------------------------------------------------------------------

describe('auth error handling', () => {
    it('should throw Authentication required when not logged in', async () => {
        AsyncStorage.getItem.mockResolvedValue(null);

        await expect(getWellnessGoals('u1')).rejects.toThrow('Authentication required');
    });
});
