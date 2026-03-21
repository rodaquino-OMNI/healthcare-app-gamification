/**
 * Health Metrics API Module
 *
 * GraphQL health metric functions, assessment functions, and medication functions.
 */

import axios from 'axios'; // axios 1.6.7
import { API_BASE_URL, API_TIMEOUT } from 'shared/constants/api';
import { CREATE_HEALTH_METRIC } from 'shared/graphql/mutations/health.mutations';
import {
    GET_HEALTH_METRICS,
    GET_HEALTH_GOALS,
    GET_MEDICAL_HISTORY,
    GET_CONNECTED_DEVICES,
} from 'shared/graphql/queries/health.queries';
import { HealthMetric, HealthGoal, MedicalEvent, DeviceConnection } from 'shared/types/health.types';

import { restClient } from '../client';

// ---------------------------------------------------------------------------
// GraphQL helpers
// ---------------------------------------------------------------------------

interface GraphQLError {
    message: string;
}

interface GraphQLResponse<T> {
    data: T;
    errors?: GraphQLError[];
}

interface HealthMetricsData {
    getHealthMetrics: HealthMetric[];
}

interface HealthGoalsData {
    getHealthGoals: HealthGoal[];
}

interface MedicalHistoryData {
    getMedicalHistory: MedicalEvent[];
}

interface ConnectedDevicesData {
    getConnectedDevices: DeviceConnection[];
}

interface CreateHealthMetricData {
    createHealthMetric: HealthMetric;
}

interface CreateMetricDto {
    type: string;
    value: number;
    unit: string;
    source?: string;
    timestamp?: string;
}

// ---------------------------------------------------------------------------
// Assessment types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Medication types
// ---------------------------------------------------------------------------

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

// ===========================================================================
// 1. GRAPHQL FUNCTIONS (5)
// ===========================================================================

export const getHealthMetrics = async (
    userId: string,
    types: string[],
    startDate: string,
    endDate: string
): Promise<HealthMetric[]> => {
    try {
        const response = await axios.post<GraphQLResponse<HealthMetricsData>>(
            `${API_BASE_URL}/graphql`,
            {
                query: GET_HEALTH_METRICS,
                variables: { userId, types, startDate, endDate },
            },
            {
                timeout: API_TIMEOUT,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.getHealthMetrics;
    } catch (error) {
        console.error('Error fetching health metrics:', error);
        throw error;
    }
};

export const getHealthGoals = async (userId: string): Promise<HealthGoal[]> => {
    try {
        const response = await axios.post<GraphQLResponse<HealthGoalsData>>(
            `${API_BASE_URL}/graphql`,
            {
                query: GET_HEALTH_GOALS,
                variables: { userId },
            },
            {
                timeout: API_TIMEOUT,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.getHealthGoals;
    } catch (error) {
        console.error('Error fetching health goals:', error);
        throw error;
    }
};

export const getMedicalHistory = async (userId: string): Promise<MedicalEvent[]> => {
    try {
        const response = await axios.post<GraphQLResponse<MedicalHistoryData>>(
            `${API_BASE_URL}/graphql`,
            {
                query: GET_MEDICAL_HISTORY,
                variables: { userId },
            },
            {
                timeout: API_TIMEOUT,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.getMedicalHistory;
    } catch (error) {
        console.error('Error fetching medical history:', error);
        throw error;
    }
};

export const getConnectedDevices = async (userId: string): Promise<DeviceConnection[]> => {
    try {
        const response = await axios.post<GraphQLResponse<ConnectedDevicesData>>(
            `${API_BASE_URL}/graphql`,
            {
                query: GET_CONNECTED_DEVICES,
                variables: { userId },
            },
            {
                timeout: API_TIMEOUT,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.getConnectedDevices;
    } catch (error) {
        console.error('Error fetching connected devices:', error);
        throw error;
    }
};

export const createHealthMetric = async (recordId: string, createMetricDto: CreateMetricDto): Promise<HealthMetric> => {
    try {
        const response = await axios.post<GraphQLResponse<CreateHealthMetricData>>(
            `${API_BASE_URL}/graphql`,
            {
                query: CREATE_HEALTH_METRIC,
                variables: { recordId, createMetricDto },
            },
            {
                timeout: API_TIMEOUT,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.createHealthMetric;
    } catch (error) {
        console.error('Error creating health metric:', error);
        throw error;
    }
};

// ===========================================================================
// 7. ASSESSMENT FUNCTIONS (3)
// ===========================================================================

export async function submitAssessmentStep(userId: string, step: AssessmentStep): Promise<void> {
    await restClient.post('/health/assessment/steps', { userId, ...step });
}

export async function getAssessmentResults(userId: string): Promise<AssessmentResult> {
    const response = await restClient.get<AssessmentResult>('/health/assessment/results', {
        params: { userId },
    });
    return response.data;
}

export async function getHealthScore(
    userId: string
): Promise<{ score: number; breakdown: { category: string; score: number }[] }> {
    const response = await restClient.get<{ score: number; breakdown: { category: string; score: number }[] }>(
        '/health/assessment/score',
        { params: { userId } }
    );
    return response.data;
}

// ===========================================================================
// 8. MEDICATION FUNCTIONS (11)
// ===========================================================================

export async function getMedications(userId: string): Promise<Medication[]> {
    const response = await restClient.get<Medication[]>('/health/medications', {
        params: { userId },
    });
    return response.data;
}

export async function addMedication(
    userId: string,
    medication: Omit<Medication, 'id' | 'userId'>
): Promise<Medication> {
    const response = await restClient.post<Medication>('/health/medications', { userId, ...medication });
    return response.data;
}

export async function editMedication(medicationId: string, updates: Partial<Medication>): Promise<Medication> {
    const response = await restClient.put<Medication>(`/health/medications/${medicationId}`, updates);
    return response.data;
}

export async function deleteMedication(medicationId: string): Promise<void> {
    await restClient.delete(`/health/medications/${medicationId}`);
}

export async function logMedicationDose(medicationId: string, takenAt: string): Promise<MedicationDose> {
    const response = await restClient.post<MedicationDose>(`/health/medications/${medicationId}/doses`, { takenAt });
    return response.data;
}

export async function logMissedDose(medicationId: string, scheduledTime: string): Promise<MedicationDose> {
    const response = await restClient.post<MedicationDose>(`/health/medications/${medicationId}/missed`, {
        scheduledTime,
    });
    return response.data;
}

export async function getMedicationSideEffects(medicationId: string): Promise<SideEffect[]> {
    const response = await restClient.get<SideEffect[]>(`/health/medications/${medicationId}/side-effects`);
    return response.data;
}

export async function reportSideEffect(
    medicationId: string,
    description: string,
    severity: SideEffect['severity']
): Promise<SideEffect> {
    const response = await restClient.post<SideEffect>(`/health/medications/${medicationId}/side-effects`, {
        description,
        severity,
    });
    return response.data;
}

export async function getMedicationSchedule(userId: string): Promise<MedicationSchedule> {
    const response = await restClient.get<MedicationSchedule>('/health/medications/schedule', {
        params: { userId },
    });
    return response.data;
}

export async function getMedicationAlarms(userId: string): Promise<MedicationAlarm[]> {
    const response = await restClient.get<MedicationAlarm[]>('/health/medications/alarms', {
        params: { userId },
    });
    return response.data;
}

export async function getMedicationReminders(userId: string): Promise<MedicationAlarm[]> {
    const response = await restClient.get<MedicationAlarm[]>('/health/medications/reminders', {
        params: { userId },
    });
    return response.data;
}
