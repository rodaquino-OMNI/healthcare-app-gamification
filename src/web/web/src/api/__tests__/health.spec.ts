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
} from '../health';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
