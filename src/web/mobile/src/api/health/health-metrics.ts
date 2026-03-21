/**
 * Health Metrics API — core GraphQL queries, types, and metric/assessment/medication functions.
 */

import { gql } from '@apollo/client';
import { AxiosResponse } from 'axios';

import { getAuthSession } from '../care';
import { graphQLClient, restClient } from '../client';

// ---------------------------------------------------------------------------
// GraphQL query/mutation constants
// ---------------------------------------------------------------------------

const GET_HEALTH_METRICS = gql`
    query GetHealthMetrics($userId: String!, $types: [String!], $startDate: String, $endDate: String) {
        getHealthMetrics(userId: $userId, types: $types, startDate: $startDate, endDate: $endDate) {
            id
            type
            value
            unit
            timestamp
            source
        }
    }
`;

const CREATE_HEALTH_METRIC = gql`
    mutation CreateHealthMetric($recordId: String!, $createMetricDto: CreateMetricInput!) {
        createHealthMetric(recordId: $recordId, createMetricDto: $createMetricDto) {
            id
            type
            value
            unit
            timestamp
            source
        }
    }
`;

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface HealthMetric {
    id: string;
    type: string;
    value: number;
    unit: string;
    timestamp: string;
    source?: string;
    /** Optional trend indicator (e.g. 'up', 'down', 'stable') for UI display */
    trend?: string;
}

export interface CreateMetricInput {
    type: string;
    value: number;
    unit: string;
    timestamp?: string;
    source?: string;
}

export interface HealthDevice {
    id: string;
    userId: string;
    deviceType: string;
    deviceId: string;
    name: string;
    connected: boolean;
    lastSyncAt?: string;
}

export interface AssessmentStep {
    stepNumber: number;
    question: string;
    answer: string;
    category: string;
}

export interface AssessmentResult {
    id: string;
    userId: string;
    healthScore: number;
    categories: { name: string; score: number; recommendations: string[] }[];
    completedAt: string;
}

export interface Medication {
    id: string;
    userId: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    instructions?: string;
    prescribedBy?: string;
}

export interface MedicationDose {
    id: string;
    medicationId: string;
    scheduledTime: string;
    takenAt?: string;
    status: 'scheduled' | 'taken' | 'missed' | 'skipped';
}

export interface SideEffect {
    id: string;
    medicationId: string;
    description: string;
    severity: 'mild' | 'moderate' | 'severe';
    reportedAt: string;
}

export interface MedicationSchedule {
    medications: { medication: Medication; nextDose: string; doses: MedicationDose[] }[];
}

export interface MedicationAlarm {
    id: string;
    medicationId: string;
    time: string;
    enabled: boolean;
    sound: string;
}

// ---------------------------------------------------------------------------
// Helper: get auth headers or throw
// ---------------------------------------------------------------------------

async function authHeaders(): Promise<{ Authorization: string }> {
    const session = await getAuthSession();
    if (!session) {
        throw new Error('Authentication required');
    }
    return { Authorization: `Bearer ${session.accessToken}` };
}

// ===========================================================================
// 1. CORE GRAPHQL FUNCTIONS (5)
// ===========================================================================

export async function getHealthMetrics(
    userId: string,
    types: string[],
    startDate?: string,
    endDate?: string
): Promise<HealthMetric[]> {
    try {
        const { data } = await graphQLClient.query({
            query: GET_HEALTH_METRICS,
            variables: { userId, types, startDate, endDate },
            fetchPolicy: 'network-only',
        });
        return data.getHealthMetrics;
    } catch (error) {
        console.error('Error fetching health metrics:', error);
        throw error;
    }
}

export async function getConnectedDevices(userId: string): Promise<HealthDevice[]> {
    try {
        const { data } = await graphQLClient.query({
            query: GET_HEALTH_METRICS,
            variables: { userId, types: ['device'] },
            fetchPolicy: 'network-only',
        });
        return data.getConnectedDevices || [];
    } catch (error) {
        console.error('Error fetching connected devices:', error);
        throw error;
    }
}

export async function connectDevice(
    userId: string,
    deviceData: { deviceType: string; deviceId: string }
): Promise<HealthDevice> {
    try {
        const { data } = await graphQLClient.mutate({
            mutation: CREATE_HEALTH_METRIC,
            variables: { userId, ...deviceData },
        });
        return data.connectDevice;
    } catch (error) {
        console.error('Error connecting device:', error);
        throw error;
    }
}

export async function getMedicalHistory(userId: string): Promise<HealthMetric[]> {
    try {
        const { data } = await graphQLClient.query({
            query: GET_HEALTH_METRICS,
            variables: { userId, types: ['history'] },
            fetchPolicy: 'network-only',
        });
        return data.getMedicalHistory || [];
    } catch (error) {
        console.error('Error fetching medical history:', error);
        throw error;
    }
}

export async function createHealthMetric(recordId: string, createMetricDto: CreateMetricInput): Promise<HealthMetric> {
    try {
        const { data } = await graphQLClient.mutate({
            mutation: CREATE_HEALTH_METRIC,
            variables: { recordId, createMetricDto },
        });
        return data.createHealthMetric;
    } catch (error) {
        console.error('Error creating health metric:', error);
        throw error;
    }
}

// ===========================================================================
// 2. ASSESSMENT FUNCTIONS (3)
// ===========================================================================

export async function submitAssessmentStep(userId: string, step: AssessmentStep): Promise<void> {
    const headers = await authHeaders();
    await restClient.post('/health/assessment/steps', { userId, ...step }, { headers });
}

export async function getAssessmentResults(userId: string): Promise<AssessmentResult> {
    const headers = await authHeaders();
    const response: AxiosResponse<AssessmentResult> = await restClient.get('/health/assessment/results', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getHealthScore(
    userId: string
): Promise<{ score: number; breakdown: { category: string; score: number }[] }> {
    const headers = await authHeaders();
    const response: AxiosResponse<{ score: number; breakdown: { category: string; score: number }[] }> =
        await restClient.get('/health/assessment/score', { params: { userId }, headers });
    return response.data;
}

// ===========================================================================
// 3. MEDICATION FUNCTIONS (11)
// ===========================================================================

export async function getMedications(userId: string): Promise<Medication[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<Medication[]> = await restClient.get('/health/medications', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function addMedication(
    userId: string,
    medication: Omit<Medication, 'id' | 'userId'>
): Promise<Medication> {
    const headers = await authHeaders();
    const response: AxiosResponse<Medication> = await restClient.post(
        '/health/medications',
        { userId, ...medication },
        { headers }
    );
    return response.data;
}

export async function editMedication(medicationId: string, updates: Partial<Medication>): Promise<Medication> {
    const headers = await authHeaders();
    const response: AxiosResponse<Medication> = await restClient.put(`/health/medications/${medicationId}`, updates, {
        headers,
    });
    return response.data;
}

export async function deleteMedication(medicationId: string): Promise<void> {
    const headers = await authHeaders();
    await restClient.delete(`/health/medications/${medicationId}`, { headers });
}

export async function logMedicationDose(medicationId: string, takenAt: string): Promise<MedicationDose> {
    const headers = await authHeaders();
    const response: AxiosResponse<MedicationDose> = await restClient.post(
        `/health/medications/${medicationId}/doses`,
        { takenAt },
        { headers }
    );
    return response.data;
}

export async function logMissedDose(medicationId: string, scheduledTime: string): Promise<MedicationDose> {
    const headers = await authHeaders();
    const response: AxiosResponse<MedicationDose> = await restClient.post(
        `/health/medications/${medicationId}/missed`,
        { scheduledTime },
        { headers }
    );
    return response.data;
}

export async function getMedicationSideEffects(medicationId: string): Promise<SideEffect[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<SideEffect[]> = await restClient.get(
        `/health/medications/${medicationId}/side-effects`,
        { headers }
    );
    return response.data;
}

export async function reportSideEffect(
    medicationId: string,
    description: string,
    severity: SideEffect['severity']
): Promise<SideEffect> {
    const headers = await authHeaders();
    const response: AxiosResponse<SideEffect> = await restClient.post(
        `/health/medications/${medicationId}/side-effects`,
        { description, severity },
        { headers }
    );
    return response.data;
}

export async function getMedicationSchedule(userId: string): Promise<MedicationSchedule> {
    const headers = await authHeaders();
    const response: AxiosResponse<MedicationSchedule> = await restClient.get('/health/medications/schedule', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getMedicationAlarms(userId: string): Promise<MedicationAlarm[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<MedicationAlarm[]> = await restClient.get('/health/medications/alarms', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getMedicationReminders(userId: string): Promise<MedicationAlarm[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<MedicationAlarm[]> = await restClient.get('/health/medications/reminders', {
        params: { userId },
        headers,
    });
    return response.data;
}
