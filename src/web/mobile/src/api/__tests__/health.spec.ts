/**
 * Tests for src/web/mobile/src/api/health.ts
 *
 * The mobile health module uses both graphQLClient and restClient.
 * GraphQL functions (metrics, devices, history) use graphQLClient.query/mutate.
 * REST functions (sleep, activity, nutrition, cycle, etc.) use restClient.
 */

import { graphQLClient, restClient } from '../client';
import {
    // GraphQL functions
    getHealthMetrics,
    createHealthMetric,
    // REST - Sleep
    getSleepLogs,
    createSleepLog,
    getSleepQuality,
    getSleepTrends,
    getSleepGoals,
    getSleepInsights,
    // REST - Activity
    getActivitySessions,
    createActivitySession,
    getActivityGoals,
    getActivityTrends,
    // REST - Nutrition
    getNutritionLogs,
    createNutritionLog,
    getMealPlan,
    getRecipes,
    searchFood,
    // REST - Cycle
    getCycleDays,
    logCycleDay,
    getCyclePredictions,
    getCycleInsights,
    // REST - Wellness Resources
    getWellnessArticles,
    getWellnessVideos,
    // REST - Assessment
    getAssessmentResults,
    getHealthScore,
    // REST - Medication
    getMedications,
    addMedication,
    editMedication,
    deleteMedication,
    logMedicationDose,
    // REST - Health Goals
    getHealthGoals,
    createHealthGoal,
    updateHealthGoal,
    getHealthGoalProgress,
} from '../health';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../client', () => ({
    graphQLClient: {
        query: jest.fn(),
        mutate: jest.fn(),
    },
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

// ===========================================================================
// GraphQL functions
// ===========================================================================

describe('getHealthMetrics (GraphQL)', () => {
    it('should query GraphQL with correct variables', async () => {
        const metrics = [{ id: 'm1', type: 'weight', value: 75 }];
        (graphQLClient.query as jest.Mock).mockResolvedValue({
            data: { getHealthMetrics: metrics },
        });

        const result = await getHealthMetrics('u1', ['weight'], '2025-01-01', '2025-01-31');

        expect(graphQLClient.query).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: { userId: 'u1', types: ['weight'], startDate: '2025-01-01', endDate: '2025-01-31' },
                fetchPolicy: 'network-only',
            })
        );
        expect(result).toEqual(metrics);
    });

    it('should throw on GraphQL error', async () => {
        (graphQLClient.query as jest.Mock).mockRejectedValue(new Error('GraphQL error'));

        await expect(getHealthMetrics('u1', ['weight'])).rejects.toThrow('GraphQL error');
    });
});

describe('createHealthMetric (GraphQL)', () => {
    it('should mutate with correct variables', async () => {
        const metric = { id: 'm1', type: 'weight', value: 75, unit: 'kg' };
        (graphQLClient.mutate as jest.Mock).mockResolvedValue({
            data: { createHealthMetric: metric },
        });

        const dto = { type: 'weight', value: 75, unit: 'kg' };
        const result = await createHealthMetric('record-1', dto);

        expect(graphQLClient.mutate).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: { recordId: 'record-1', createMetricDto: dto },
            })
        );
        expect(result).toEqual(metric);
    });
});

// ===========================================================================
// Sleep REST functions
// ===========================================================================

describe('getSleepLogs', () => {
    it('should GET /health/sleep/logs with params', async () => {
        const logs = [{ id: 'sl1', duration: 480 }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: logs });

        const result = await getSleepLogs('u1', '2025-01-01', '2025-01-31');

        expect(restClient.get).toHaveBeenCalledWith(
            '/health/sleep/logs',
            expect.objectContaining({
                params: { userId: 'u1', startDate: '2025-01-01', endDate: '2025-01-31' },
            })
        );
        expect(result).toEqual(logs);
    });
});

describe('createSleepLog', () => {
    it('should POST /health/sleep/logs', async () => {
        const log = { id: 'sl1', date: '2025-01-15' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: log });

        const logData = { date: '2025-01-15', bedtime: '22:00', wakeTime: '06:00', duration: 480, quality: 8 };
        const result = await createSleepLog('u1', logData);

        expect(restClient.post).toHaveBeenCalledWith(
            '/health/sleep/logs',
            expect.objectContaining({ userId: 'u1', date: '2025-01-15' }),
            expect.any(Object)
        );
        expect(result).toEqual(log);
    });
});

describe('getSleepQuality', () => {
    it('should GET /health/sleep/quality', async () => {
        const quality = { date: '2025-01-15', score: 85 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: quality });

        const result = await getSleepQuality('u1', '2025-01-15');

        expect(restClient.get).toHaveBeenCalledWith(
            '/health/sleep/quality',
            expect.objectContaining({
                params: { userId: 'u1', date: '2025-01-15' },
            })
        );
        expect(result).toEqual(quality);
    });
});

describe('getSleepTrends', () => {
    it('should GET /health/sleep/trends', async () => {
        const trends = { period: 'weekly', averageDuration: 450 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: trends });

        const result = await getSleepTrends('u1', 'weekly');

        expect(restClient.get).toHaveBeenCalledWith(
            '/health/sleep/trends',
            expect.objectContaining({
                params: { userId: 'u1', period: 'weekly' },
            })
        );
        expect(result).toEqual(trends);
    });
});

describe('getSleepGoals', () => {
    it('should GET /health/sleep/goals', async () => {
        const goals = { targetDuration: 480 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: goals });

        const result = await getSleepGoals('u1');
        expect(restClient.get).toHaveBeenCalledWith('/health/sleep/goals', expect.any(Object));
        expect(result).toEqual(goals);
    });
});

describe('getSleepInsights', () => {
    it('should GET /health/sleep/insights', async () => {
        const insights = [{ id: 'si1', title: 'Good consistency' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: insights });

        const result = await getSleepInsights('u1');
        expect(restClient.get).toHaveBeenCalledWith('/health/sleep/insights', expect.any(Object));
        expect(result).toEqual(insights);
    });
});

// ===========================================================================
// Activity REST functions
// ===========================================================================

describe('getActivitySessions', () => {
    it('should GET /health/activity/sessions', async () => {
        const sessions = [{ id: 'as1', type: 'running' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: sessions });

        const result = await getActivitySessions('u1');
        expect(restClient.get).toHaveBeenCalledWith('/health/activity/sessions', expect.any(Object));
        expect(result).toEqual(sessions);
    });
});

describe('createActivitySession', () => {
    it('should POST /health/activity/sessions', async () => {
        const session = { id: 'as1', type: 'running', duration: 1800 };
        (restClient.post as jest.Mock).mockResolvedValue({ data: session });

        const data = { type: 'running', startTime: '08:00', duration: 1800, caloriesBurned: 300 };
        const result = await createActivitySession('u1', data);

        expect(restClient.post).toHaveBeenCalledWith(
            '/health/activity/sessions',
            expect.objectContaining({ userId: 'u1', type: 'running' }),
            expect.any(Object)
        );
        expect(result).toEqual(session);
    });
});

describe('getActivityGoals', () => {
    it('should GET /health/activity/goals', async () => {
        const goals = [{ id: 'ag1', type: 'steps', target: 10000 }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: goals });

        const result = await getActivityGoals('u1');
        expect(restClient.get).toHaveBeenCalledWith('/health/activity/goals', expect.any(Object));
        expect(result).toEqual(goals);
    });
});

describe('getActivityTrends', () => {
    it('should GET /health/activity/trends', async () => {
        const trends = { period: 'monthly', totalCalories: 30000 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: trends });

        const result = await getActivityTrends('u1', 'monthly');
        expect(restClient.get).toHaveBeenCalledWith(
            '/health/activity/trends',
            expect.objectContaining({
                params: { userId: 'u1', period: 'monthly' },
            })
        );
        expect(result).toEqual(trends);
    });
});

// ===========================================================================
// Nutrition REST functions
// ===========================================================================

describe('getNutritionLogs', () => {
    it('should GET /health/nutrition/logs', async () => {
        const logs = [{ id: 'nl1', mealType: 'breakfast' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: logs });

        const result = await getNutritionLogs('u1', '2025-01-15');
        expect(restClient.get).toHaveBeenCalledWith(
            '/health/nutrition/logs',
            expect.objectContaining({
                params: { userId: 'u1', date: '2025-01-15' },
            })
        );
        expect(result).toEqual(logs);
    });
});

describe('createNutritionLog', () => {
    it('should POST /health/nutrition/logs', async () => {
        const log = { id: 'nl1' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: log });

        const data = { date: '2025-01-15', mealType: 'breakfast' as const, foods: [], totalCalories: 400 };
        const result = await createNutritionLog('u1', data);

        expect(restClient.post).toHaveBeenCalledWith(
            '/health/nutrition/logs',
            expect.objectContaining({ userId: 'u1' }),
            expect.any(Object)
        );
        expect(result).toEqual(log);
    });
});

describe('getMealPlan', () => {
    it('should GET /health/nutrition/meal-plan', async () => {
        const plan = { id: 'mp1', meals: [] };
        (restClient.get as jest.Mock).mockResolvedValue({ data: plan });

        const result = await getMealPlan('u1');
        expect(restClient.get).toHaveBeenCalledWith('/health/nutrition/meal-plan', expect.any(Object));
        expect(result).toEqual(plan);
    });
});

describe('getRecipes', () => {
    it('should GET /health/nutrition/recipes', async () => {
        const recipes = [{ id: 'r1', name: 'Salad' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: recipes });

        const result = await getRecipes('healthy', 'salad');
        expect(restClient.get).toHaveBeenCalledWith(
            '/health/nutrition/recipes',
            expect.objectContaining({
                params: { category: 'healthy', query: 'salad' },
            })
        );
        expect(result).toEqual(recipes);
    });
});

describe('searchFood', () => {
    it('should GET /health/nutrition/food-search', async () => {
        const results = [{ id: 'f1', name: 'Apple' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: results });

        const result = await searchFood('apple');
        expect(restClient.get).toHaveBeenCalledWith(
            '/health/nutrition/food-search',
            expect.objectContaining({
                params: { query: 'apple' },
            })
        );
        expect(result).toEqual(results);
    });
});

// ===========================================================================
// Cycle Tracking REST functions
// ===========================================================================

describe('getCycleDays', () => {
    it('should GET /health/cycle/days', async () => {
        const days = [{ id: 'cd1', flow: 'light' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: days });

        const result = await getCycleDays('u1', '2025-01-01', '2025-01-31');
        expect(restClient.get).toHaveBeenCalledWith(
            '/health/cycle/days',
            expect.objectContaining({
                params: { userId: 'u1', startDate: '2025-01-01', endDate: '2025-01-31' },
            })
        );
        expect(result).toEqual(days);
    });
});

describe('logCycleDay', () => {
    it('should POST /health/cycle/days', async () => {
        const day = { id: 'cd1', flow: 'medium' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: day });

        const data = { date: '2025-01-15', flow: 'medium' as const, symptoms: [], mood: 'okay' };
        const result = await logCycleDay('u1', data);

        expect(restClient.post).toHaveBeenCalledWith(
            '/health/cycle/days',
            expect.objectContaining({ userId: 'u1', flow: 'medium' }),
            expect.any(Object)
        );
        expect(result).toEqual(day);
    });
});

describe('getCyclePredictions', () => {
    it('should GET /health/cycle/predictions', async () => {
        const predictions = { nextPeriodStart: '2025-02-01', cycleLength: 28 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: predictions });

        const result = await getCyclePredictions('u1');
        expect(restClient.get).toHaveBeenCalledWith('/health/cycle/predictions', expect.any(Object));
        expect(result).toEqual(predictions);
    });
});

describe('getCycleInsights', () => {
    it('should GET /health/cycle/insights', async () => {
        const insights = [{ id: 'ci1', title: 'Regular cycle' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: insights });

        const result = await getCycleInsights('u1');
        expect(restClient.get).toHaveBeenCalledWith('/health/cycle/insights', expect.any(Object));
        expect(result).toEqual(insights);
    });
});

// ===========================================================================
// Wellness Resources
// ===========================================================================

describe('getWellnessArticles', () => {
    it('should GET /health/wellness/articles', async () => {
        const articles = [{ id: 'wa1', title: 'Sleep Tips' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: articles });

        const result = await getWellnessArticles('sleep');
        expect(restClient.get).toHaveBeenCalledWith(
            '/health/wellness/articles',
            expect.objectContaining({
                params: { category: 'sleep', page: undefined },
            })
        );
        expect(result).toEqual(articles);
    });
});

describe('getWellnessVideos', () => {
    it('should GET /health/wellness/videos', async () => {
        const videos = [{ id: 'wv1', title: 'Yoga for Beginners' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: videos });

        const result = await getWellnessVideos('fitness');
        expect(restClient.get).toHaveBeenCalledWith(
            '/health/wellness/videos',
            expect.objectContaining({
                params: { category: 'fitness' },
            })
        );
        expect(result).toEqual(videos);
    });
});

// ===========================================================================
// Assessment
// ===========================================================================

describe('getAssessmentResults', () => {
    it('should GET /health/assessment/results', async () => {
        const results = { id: 'ar1', healthScore: 85 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: results });

        const result = await getAssessmentResults('u1');
        expect(restClient.get).toHaveBeenCalledWith('/health/assessment/results', expect.any(Object));
        expect(result).toEqual(results);
    });
});

describe('getHealthScore', () => {
    it('should GET /health/assessment/score', async () => {
        const score = { score: 85, breakdown: [{ category: 'sleep', score: 90 }] };
        (restClient.get as jest.Mock).mockResolvedValue({ data: score });

        const result = await getHealthScore('u1');
        expect(restClient.get).toHaveBeenCalledWith('/health/assessment/score', expect.any(Object));
        expect(result).toEqual(score);
    });
});

// ===========================================================================
// Medication
// ===========================================================================

describe('getMedications', () => {
    it('should GET /health/medications', async () => {
        const meds = [{ id: 'med1', name: 'Aspirin' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: meds });

        const result = await getMedications('u1');
        expect(restClient.get).toHaveBeenCalledWith(
            '/health/medications',
            expect.objectContaining({
                params: { userId: 'u1' },
            })
        );
        expect(result).toEqual(meds);
    });
});

describe('addMedication', () => {
    it('should POST /health/medications', async () => {
        const med = { id: 'med1', name: 'Aspirin' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: med });

        const data = { name: 'Aspirin', dosage: '100mg', frequency: 'daily', startDate: '2025-01-01' };
        const result = await addMedication('u1', data);

        expect(restClient.post).toHaveBeenCalledWith(
            '/health/medications',
            expect.objectContaining({ userId: 'u1', name: 'Aspirin' }),
            expect.any(Object)
        );
        expect(result).toEqual(med);
    });
});

describe('editMedication', () => {
    it('should PUT /health/medications/:id', async () => {
        const med = { id: 'med1', dosage: '200mg' };
        (restClient.put as jest.Mock).mockResolvedValue({ data: med });

        const result = await editMedication('med1', { dosage: '200mg' });

        expect(restClient.put).toHaveBeenCalledWith(
            '/health/medications/med1',
            { dosage: '200mg' },
            expect.any(Object)
        );
        expect(result).toEqual(med);
    });
});

describe('deleteMedication', () => {
    it('should DELETE /health/medications/:id', async () => {
        (restClient.delete as jest.Mock).mockResolvedValue({});

        await deleteMedication('med1');

        expect(restClient.delete).toHaveBeenCalledWith('/health/medications/med1', expect.any(Object));
    });
});

describe('logMedicationDose', () => {
    it('should POST /health/medications/:id/doses', async () => {
        const dose = { id: 'd1', status: 'taken' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: dose });

        const result = await logMedicationDose('med1', '2025-01-15T08:00:00Z');

        expect(restClient.post).toHaveBeenCalledWith(
            '/health/medications/med1/doses',
            { takenAt: '2025-01-15T08:00:00Z' },
            expect.any(Object)
        );
        expect(result).toEqual(dose);
    });
});

// ===========================================================================
// Health Goals
// ===========================================================================

describe('getHealthGoals', () => {
    it('should GET /health/goals', async () => {
        const goals = [{ id: 'hg1', title: 'Walk 10k steps' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: goals });

        const result = await getHealthGoals('u1');
        expect(restClient.get).toHaveBeenCalledWith(
            '/health/goals',
            expect.objectContaining({
                params: { userId: 'u1' },
            })
        );
        expect(result).toEqual(goals);
    });
});

describe('createHealthGoal', () => {
    it('should POST /health/goals', async () => {
        const goal = { id: 'hg1', title: 'Walk 10k steps' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: goal });

        const data = { category: 'fitness', title: 'Walk 10k steps', target: 10000, unit: 'steps' };
        const result = await createHealthGoal('u1', data);

        expect(restClient.post).toHaveBeenCalledWith(
            '/health/goals',
            expect.objectContaining({ userId: 'u1', title: 'Walk 10k steps' }),
            expect.any(Object)
        );
        expect(result).toEqual(goal);
    });
});

describe('updateHealthGoal', () => {
    it('should PUT /health/goals/:id', async () => {
        const goal = { id: 'hg1', target: 15000 };
        (restClient.put as jest.Mock).mockResolvedValue({ data: goal });

        const result = await updateHealthGoal('hg1', { target: 15000 });

        expect(restClient.put).toHaveBeenCalledWith('/health/goals/hg1', { target: 15000 }, expect.any(Object));
        expect(result).toEqual(goal);
    });
});

describe('getHealthGoalProgress', () => {
    it('should GET /health/goals/:id/progress', async () => {
        const progress = { goalId: 'hg1', percentComplete: 75 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: progress });

        const result = await getHealthGoalProgress('hg1');

        expect(restClient.get).toHaveBeenCalledWith('/health/goals/hg1/progress', expect.any(Object));
        expect(result).toEqual(progress);
    });
});

// ===========================================================================
// Auth error handling
// ===========================================================================

describe('auth error handling', () => {
    it('should throw when not authenticated (REST function)', async () => {
        AsyncStorage.getItem.mockResolvedValue(null);

        await expect(getMedications('u1')).rejects.toThrow('Authentication required');
    });
});
