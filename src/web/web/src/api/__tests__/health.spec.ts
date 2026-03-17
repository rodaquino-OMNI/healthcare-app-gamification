/* eslint-disable @typescript-eslint/unbound-method */
/**
 * Tests for src/web/web/src/api/health.ts
 *
 * The web health module uses axios.post for GraphQL requests.
 * We mock axios to validate request payloads and error handling.
 */

import axios from 'axios';

import {
    getHealthMetrics,
    getHealthGoals,
    getMedicalHistory,
    getConnectedDevices,
    createHealthMetric,
    updateSleepGoals,
    updateSmartAlarm,
    updateBedtimeRoutine,
    createSleepDiaryEntry,
    deleteSleepLog,
    createActivityGoal,
    updateActivityGoal,
    joinActivityChallenge,
    createWorkout,
    deleteActivitySession,
    deleteNutritionLog,
    updateNutritionGoals,
    createMealPlan,
    getRecipeDetail,
    getWaterIntake,
    updateCycleReminder,
    getCycleSettings,
    deleteHealthGoal,
    disconnectDevice,
    getDeviceSyncHistory,
} from '../health';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockRestClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../client', () => ({
    restClient: mockRestClient,
}));

jest.mock('shared/constants/api', () => ({
    API_BASE_URL: 'https://api.austa.com.br',
    API_TIMEOUT: 30000,
}));

jest.mock('shared/graphql/mutations/health.mutations', () => ({
    CREATE_HEALTH_METRIC: 'mutation CreateHealthMetric { ... }',
}));

jest.mock('shared/graphql/queries/health.queries', () => ({
    GET_HEALTH_METRICS: 'query GetHealthMetrics { ... }',
    GET_HEALTH_GOALS: 'query GetHealthGoals { ... }',
    GET_MEDICAL_HISTORY: 'query GetMedicalHistory { ... }',
    GET_CONNECTED_DEVICES: 'query GetConnectedDevices { ... }',
}));

beforeEach(() => {
    jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// getHealthMetrics
// ---------------------------------------------------------------------------

describe('getHealthMetrics', () => {
    it('should POST to /graphql with correct variables', async () => {
        const metrics = [{ id: 'm1', type: 'weight', value: 75 }];
        mockedAxios.post.mockResolvedValue({
            data: { data: { getHealthMetrics: metrics } },
        });

        const result = await getHealthMetrics('u1', ['weight'], '2025-01-01', '2025-01-31');

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'https://api.austa.com.br/graphql',
            expect.objectContaining({
                variables: {
                    userId: 'u1',
                    types: ['weight'],
                    startDate: '2025-01-01',
                    endDate: '2025-01-31',
                },
            }),
            expect.objectContaining({
                timeout: 30000,
                headers: { 'Content-Type': 'application/json' },
            })
        );
        expect(result).toEqual(metrics);
    });

    it('should throw on GraphQL errors', async () => {
        mockedAxios.post.mockResolvedValue({
            data: { data: {}, errors: [{ message: 'Invalid query' }] },
        });

        await expect(getHealthMetrics('u1', ['weight'], '2025-01-01', '2025-01-31')).rejects.toThrow('Invalid query');
    });

    it('should throw on network error', async () => {
        mockedAxios.post.mockRejectedValue(new Error('Network error'));

        await expect(getHealthMetrics('u1', ['weight'], '2025-01-01', '2025-01-31')).rejects.toThrow('Network error');
    });
});

// ---------------------------------------------------------------------------
// getHealthGoals
// ---------------------------------------------------------------------------

describe('getHealthGoals', () => {
    it('should POST to /graphql with userId', async () => {
        const goals = [{ id: 'g1', name: 'Walk more' }];
        mockedAxios.post.mockResolvedValue({
            data: { data: { getHealthGoals: goals } },
        });

        const result = await getHealthGoals('u1');

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'https://api.austa.com.br/graphql',
            expect.objectContaining({ variables: { userId: 'u1' } }),
            expect.any(Object)
        );
        expect(result).toEqual(goals);
    });
});

// ---------------------------------------------------------------------------
// getMedicalHistory
// ---------------------------------------------------------------------------

describe('getMedicalHistory', () => {
    it('should POST to /graphql with userId', async () => {
        const events = [{ id: 'e1', type: 'visit' }];
        mockedAxios.post.mockResolvedValue({
            data: { data: { getMedicalHistory: events } },
        });

        const result = await getMedicalHistory('u1');

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'https://api.austa.com.br/graphql',
            expect.objectContaining({ variables: { userId: 'u1' } }),
            expect.any(Object)
        );
        expect(result).toEqual(events);
    });
});

// ---------------------------------------------------------------------------
// getConnectedDevices
// ---------------------------------------------------------------------------

describe('getConnectedDevices', () => {
    it('should POST to /graphql with userId', async () => {
        const devices = [{ id: 'd1', type: 'fitbit' }];
        mockedAxios.post.mockResolvedValue({
            data: { data: { getConnectedDevices: devices } },
        });

        const result = await getConnectedDevices('u1');

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'https://api.austa.com.br/graphql',
            expect.objectContaining({ variables: { userId: 'u1' } }),
            expect.any(Object)
        );
        expect(result).toEqual(devices);
    });
});

// ---------------------------------------------------------------------------
// createHealthMetric
// ---------------------------------------------------------------------------

describe('createHealthMetric', () => {
    it('should POST to /graphql with mutation variables', async () => {
        const metric = { id: 'm1', type: 'weight', value: 75, unit: 'kg' };
        mockedAxios.post.mockResolvedValue({
            data: { data: { createHealthMetric: metric } },
        });

        const dto = { type: 'weight', value: 75, unit: 'kg' };
        const result = await createHealthMetric('record-1', dto);

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'https://api.austa.com.br/graphql',
            expect.objectContaining({
                variables: { recordId: 'record-1', createMetricDto: dto },
            }),
            expect.any(Object)
        );
        expect(result).toEqual(metric);
    });
});

// ===========================================================================
// NEW REST-based health functions (use mockRestClient)
// ===========================================================================

// ---------------------------------------------------------------------------
// updateSleepGoals
// ---------------------------------------------------------------------------

describe('updateSleepGoals', () => {
    it('should PUT /health/sleep/goals with userId and goals', async () => {
        const goal = {
            id: 'sg1',
            userId: 'u1',
            targetBedtime: '22:00',
            targetWakeTime: '06:00',
            targetDuration: 8,
            currentStreak: 3,
        };
        mockRestClient.put.mockResolvedValue({ data: goal });

        const result = await updateSleepGoals('u1', { targetBedtime: '22:00' });

        expect(mockRestClient.put).toHaveBeenCalledWith('/health/sleep/goals', {
            userId: 'u1',
            targetBedtime: '22:00',
        });
        expect(result).toEqual(goal);
    });
});

// ---------------------------------------------------------------------------
// updateSmartAlarm
// ---------------------------------------------------------------------------

describe('updateSmartAlarm', () => {
    it('should PUT /health/sleep/alarm with userId and alarm settings', async () => {
        const alarm = {
            id: 'sa1',
            userId: 'u1',
            targetTime: '06:30',
            windowMinutes: 15,
            sound: 'birds',
            vibration: true,
            enabled: true,
        };
        mockRestClient.put.mockResolvedValue({ data: alarm });

        const result = await updateSmartAlarm('u1', { targetTime: '06:30' });

        expect(mockRestClient.put).toHaveBeenCalledWith('/health/sleep/alarm', { userId: 'u1', targetTime: '06:30' });
        expect(result).toEqual(alarm);
    });
});

// ---------------------------------------------------------------------------
// updateBedtimeRoutine
// ---------------------------------------------------------------------------

describe('updateBedtimeRoutine', () => {
    it('should PUT /health/sleep/routine with userId and routine', async () => {
        const routine = { id: 'br1', userId: 'u1', steps: [], reminderTime: '21:30', enabled: true };
        mockRestClient.put.mockResolvedValue({ data: routine });

        const result = await updateBedtimeRoutine('u1', { reminderTime: '21:30' });

        expect(mockRestClient.put).toHaveBeenCalledWith('/health/sleep/routine', {
            userId: 'u1',
            reminderTime: '21:30',
        });
        expect(result).toEqual(routine);
    });
});

// ---------------------------------------------------------------------------
// createSleepDiaryEntry
// ---------------------------------------------------------------------------

describe('createSleepDiaryEntry', () => {
    it('should POST /health/sleep/diary with userId and entry', async () => {
        const entry = {
            id: 'sde1',
            date: '2026-01-15',
            bedtime: '22:00',
            wakeTime: '06:00',
            sleepLatency: 15,
            awakenings: 2,
            notes: 'Good',
            mood: 'happy',
        };
        mockRestClient.post.mockResolvedValue({ data: entry });

        const input = {
            date: '2026-01-15',
            bedtime: '22:00',
            wakeTime: '06:00',
            sleepLatency: 15,
            awakenings: 2,
            notes: 'Good',
            mood: 'happy',
        };
        const result = await createSleepDiaryEntry('u1', input);

        expect(mockRestClient.post).toHaveBeenCalledWith('/health/sleep/diary', { userId: 'u1', ...input });
        expect(result).toEqual(entry);
    });
});

// ---------------------------------------------------------------------------
// deleteSleepLog
// ---------------------------------------------------------------------------

describe('deleteSleepLog', () => {
    it('should DELETE /health/sleep/logs/:logId', async () => {
        mockRestClient.delete.mockResolvedValue({});

        await deleteSleepLog('log1');

        expect(mockRestClient.delete).toHaveBeenCalledWith('/health/sleep/logs/log1');
    });
});

// ---------------------------------------------------------------------------
// createActivityGoal
// ---------------------------------------------------------------------------

describe('createActivityGoal', () => {
    it('should POST /health/activity/goals with userId and goal data', async () => {
        const goal = {
            id: 'ag1',
            userId: 'u1',
            type: 'steps',
            target: 10000,
            current: 0,
            unit: 'steps',
            period: 'daily',
        };
        mockRestClient.post.mockResolvedValue({ data: goal });

        const input = { type: 'steps', target: 10000, unit: 'steps', period: 'daily' as const };
        const result = await createActivityGoal('u1', input);

        expect(mockRestClient.post).toHaveBeenCalledWith('/health/activity/goals', { userId: 'u1', ...input });
        expect(result).toEqual(goal);
    });
});

// ---------------------------------------------------------------------------
// updateActivityGoal
// ---------------------------------------------------------------------------

describe('updateActivityGoal', () => {
    it('should PUT /health/activity/goals/:goalId with updates', async () => {
        const goal = {
            id: 'ag1',
            userId: 'u1',
            type: 'steps',
            target: 15000,
            current: 5000,
            unit: 'steps',
            period: 'daily',
        };
        mockRestClient.put.mockResolvedValue({ data: goal });

        const result = await updateActivityGoal('ag1', { target: 15000 });

        expect(mockRestClient.put).toHaveBeenCalledWith('/health/activity/goals/ag1', { target: 15000 });
        expect(result).toEqual(goal);
    });
});

// ---------------------------------------------------------------------------
// joinActivityChallenge
// ---------------------------------------------------------------------------

describe('joinActivityChallenge', () => {
    it('should POST /health/activity/challenges/:id/join with userId', async () => {
        const challenge = {
            id: 'ch1',
            name: '10K Steps',
            description: 'Walk 10K',
            type: 'steps',
            target: 10000,
            progress: 0,
            startDate: '2026-01-01',
            endDate: '2026-01-31',
            participants: 50,
        };
        mockRestClient.post.mockResolvedValue({ data: challenge });

        const result = await joinActivityChallenge('u1', 'ch1');

        expect(mockRestClient.post).toHaveBeenCalledWith('/health/activity/challenges/ch1/join', { userId: 'u1' });
        expect(result).toEqual(challenge);
    });
});

// ---------------------------------------------------------------------------
// createWorkout
// ---------------------------------------------------------------------------

describe('createWorkout', () => {
    it('should POST /health/activity/workouts with userId and workout data', async () => {
        const workout = { id: 'w1', name: 'Morning Run', type: 'running', exercises: [], duration: 30 };
        mockRestClient.post.mockResolvedValue({ data: workout });

        const input = { name: 'Morning Run', type: 'running', exercises: [] as never[], duration: 30 };
        const result = await createWorkout('u1', input);

        expect(mockRestClient.post).toHaveBeenCalledWith('/health/activity/workouts', { userId: 'u1', ...input });
        expect(result).toEqual(workout);
    });
});

// ---------------------------------------------------------------------------
// deleteActivitySession
// ---------------------------------------------------------------------------

describe('deleteActivitySession', () => {
    it('should DELETE /health/activity/sessions/:sessionId', async () => {
        mockRestClient.delete.mockResolvedValue({});

        await deleteActivitySession('sess1');

        expect(mockRestClient.delete).toHaveBeenCalledWith('/health/activity/sessions/sess1');
    });
});

// ---------------------------------------------------------------------------
// deleteNutritionLog
// ---------------------------------------------------------------------------

describe('deleteNutritionLog', () => {
    it('should DELETE /health/nutrition/logs/:logId', async () => {
        mockRestClient.delete.mockResolvedValue({});

        await deleteNutritionLog('nlog1');

        expect(mockRestClient.delete).toHaveBeenCalledWith('/health/nutrition/logs/nlog1');
    });
});

// ---------------------------------------------------------------------------
// updateNutritionGoals
// ---------------------------------------------------------------------------

describe('updateNutritionGoals', () => {
    it('should PUT /health/nutrition/goals with userId and goals', async () => {
        const goals = {
            id: 'ng1',
            userId: 'u1',
            dailyCalories: 2000,
            proteinGrams: 100,
            carbsGrams: 250,
            fatGrams: 70,
        };
        mockRestClient.put.mockResolvedValue({ data: goals });

        const result = await updateNutritionGoals('u1', { dailyCalories: 2000 });

        expect(mockRestClient.put).toHaveBeenCalledWith('/health/nutrition/goals', {
            userId: 'u1',
            dailyCalories: 2000,
        });
        expect(result).toEqual(goals);
    });
});

// ---------------------------------------------------------------------------
// createMealPlan
// ---------------------------------------------------------------------------

describe('createMealPlan', () => {
    it('should POST /health/nutrition/meal-plan with userId and plan data', async () => {
        const plan = { id: 'mp1', userId: 'u1', date: '2026-01-15', meals: [] };
        mockRestClient.post.mockResolvedValue({ data: plan });

        const input = { date: '2026-01-15', meals: [] as never[] };
        const result = await createMealPlan('u1', input);

        expect(mockRestClient.post).toHaveBeenCalledWith('/health/nutrition/meal-plan', { userId: 'u1', ...input });
        expect(result).toEqual(plan);
    });
});

// ---------------------------------------------------------------------------
// getRecipeDetail
// ---------------------------------------------------------------------------

describe('getRecipeDetail', () => {
    it('should GET /health/nutrition/recipes/:recipeId', async () => {
        const recipe = {
            id: 'r1',
            name: 'Salad',
            description: 'Green salad',
            ingredients: [],
            instructions: [],
            calories: 150,
            prepTime: 10,
        };
        mockRestClient.get.mockResolvedValue({ data: recipe });

        const result = await getRecipeDetail('r1');

        expect(mockRestClient.get).toHaveBeenCalledWith('/health/nutrition/recipes/r1');
        expect(result).toEqual(recipe);
    });
});

// ---------------------------------------------------------------------------
// getWaterIntake
// ---------------------------------------------------------------------------

describe('getWaterIntake', () => {
    it('should GET /health/nutrition/water with userId and date', async () => {
        const water = { consumed: 1500, target: 2000, unit: 'ml' };
        mockRestClient.get.mockResolvedValue({ data: water });

        const result = await getWaterIntake('u1', '2026-01-15');

        expect(mockRestClient.get).toHaveBeenCalledWith('/health/nutrition/water', {
            params: { userId: 'u1', date: '2026-01-15' },
        });
        expect(result).toEqual(water);
    });
});

// ---------------------------------------------------------------------------
// updateCycleReminder
// ---------------------------------------------------------------------------

describe('updateCycleReminder', () => {
    it('should PUT /health/cycle/reminders/:reminderId with updates', async () => {
        const reminder = { id: 'cr1', type: 'period', daysBefore: 2, enabled: true, time: '09:00' };
        mockRestClient.put.mockResolvedValue({ data: reminder });

        const result = await updateCycleReminder('cr1', { enabled: true });

        expect(mockRestClient.put).toHaveBeenCalledWith('/health/cycle/reminders/cr1', { enabled: true });
        expect(result).toEqual(reminder);
    });
});

// ---------------------------------------------------------------------------
// getCycleSettings
// ---------------------------------------------------------------------------

describe('getCycleSettings', () => {
    it('should GET /health/cycle/settings with userId', async () => {
        const settings = {
            cycleLength: 28,
            periodLength: 5,
            trackSymptoms: true,
            trackMood: true,
            trackTemperature: false,
            notifications: true,
        };
        mockRestClient.get.mockResolvedValue({ data: settings });

        const result = await getCycleSettings('u1');

        expect(mockRestClient.get).toHaveBeenCalledWith('/health/cycle/settings', { params: { userId: 'u1' } });
        expect(result).toEqual(settings);
    });
});

// ---------------------------------------------------------------------------
// deleteHealthGoal
// ---------------------------------------------------------------------------

describe('deleteHealthGoal', () => {
    it('should DELETE /health/goals/:goalId', async () => {
        mockRestClient.delete.mockResolvedValue({});

        await deleteHealthGoal('goal1');

        expect(mockRestClient.delete).toHaveBeenCalledWith('/health/goals/goal1');
    });
});

// ---------------------------------------------------------------------------
// disconnectDevice
// ---------------------------------------------------------------------------

describe('disconnectDevice', () => {
    it('should DELETE /health/devices/:deviceId with userId param', async () => {
        mockRestClient.delete.mockResolvedValue({});

        await disconnectDevice('u1', 'dev1');

        expect(mockRestClient.delete).toHaveBeenCalledWith('/health/devices/dev1', { params: { userId: 'u1' } });
    });
});

// ---------------------------------------------------------------------------
// getDeviceSyncHistory
// ---------------------------------------------------------------------------

describe('getDeviceSyncHistory', () => {
    it('should GET /health/devices/:deviceId/sync-history with userId', async () => {
        const history = [{ deviceId: 'dev1', syncedAt: '2026-01-15', metricsCount: 10, status: 'success' }];
        mockRestClient.get.mockResolvedValue({ data: history });

        const result = await getDeviceSyncHistory('u1', 'dev1');

        expect(mockRestClient.get).toHaveBeenCalledWith('/health/devices/dev1/sync-history', {
            params: { userId: 'u1' },
        });
        expect(result).toEqual(history);
    });
});
