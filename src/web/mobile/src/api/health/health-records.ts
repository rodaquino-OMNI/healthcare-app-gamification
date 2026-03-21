/**
 * Health Records API — sleep tracking and activity session functions.
 */

import { AxiosResponse } from 'axios';

import { getAuthSession } from '../care';
import { restClient } from '../client';
import type { HealthMetric } from './health-metrics';

// ---------------------------------------------------------------------------
// Sleep Interfaces
// ---------------------------------------------------------------------------

export interface SleepLog {
    id: string;
    userId: string;
    date: string;
    bedtime: string;
    wakeTime: string;
    duration: number;
    quality: number;
    stages?: SleepStage[];
    notes?: string;
}

export interface SleepStage {
    stage: 'awake' | 'light' | 'deep' | 'rem';
    startTime: string;
    duration: number;
}

export interface SleepQuality {
    date: string;
    score: number;
    factors: { name: string; impact: 'positive' | 'negative' | 'neutral' }[];
}

export interface SleepDiaryEntry {
    id: string;
    date: string;
    bedtime: string;
    wakeTime: string;
    sleepLatency: number;
    awakenings: number;
    notes: string;
    mood: string;
}

export interface SleepTrend {
    period: string;
    averageDuration: number;
    averageQuality: number;
    data: { date: string; duration: number; quality: number }[];
}

export interface SleepGoal {
    id: string;
    userId: string;
    targetBedtime: string;
    targetWakeTime: string;
    targetDuration: number;
    currentStreak: number;
}

export interface BedtimeRoutine {
    id: string;
    userId: string;
    steps: { order: number; activity: string; duration: number }[];
    reminderTime: string;
    enabled: boolean;
}

export interface SmartAlarm {
    id: string;
    userId: string;
    targetTime: string;
    windowMinutes: number;
    sound: string;
    vibration: boolean;
    enabled: boolean;
}

export interface SleepInsight {
    id: string;
    type: string;
    title: string;
    description: string;
    recommendation: string;
    createdAt: string;
}

// ---------------------------------------------------------------------------
// Activity Interfaces
// ---------------------------------------------------------------------------

export interface ActivitySession {
    id: string;
    userId: string;
    type: string;
    startTime: string;
    endTime?: string;
    duration: number;
    caloriesBurned: number;
    distance?: number;
    steps?: number;
    heartRateAvg?: number;
}

export interface ActivityGoal {
    id: string;
    userId: string;
    type: string;
    target: number;
    current: number;
    unit: string;
    period: 'daily' | 'weekly' | 'monthly';
}

export interface ActivityTrend {
    period: string;
    totalCalories: number;
    totalDuration: number;
    totalSteps: number;
    sessions: number;
    data: { date: string; calories: number; duration: number; steps: number }[];
}

export interface Workout {
    id: string;
    name: string;
    type: string;
    exercises: { name: string; sets: number; reps: number; weight?: number }[];
    duration: number;
}

export interface ActivityChallenge {
    id: string;
    name: string;
    description: string;
    type: string;
    target: number;
    progress: number;
    startDate: string;
    endDate: string;
    participants: number;
}

export interface WeeklySummary {
    weekStart: string;
    weekEnd: string;
    totalCalories: number;
    totalDuration: number;
    totalSteps: number;
    activeDays: number;
    topActivity: string;
}

// ---------------------------------------------------------------------------
// Shared types (used across modules)
// ---------------------------------------------------------------------------

export interface DeviceSyncResult {
    deviceId: string;
    syncedAt: string;
    metricsCount: number;
    status: 'success' | 'partial' | 'failed';
    errors?: string[];
}

export interface ExportResult {
    url: string;
    format: string;
    generatedAt: string;
    expiresAt: string;
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
// SLEEP FUNCTIONS (12)
// ===========================================================================

export async function getSleepLogs(userId: string, startDate?: string, endDate?: string): Promise<SleepLog[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<SleepLog[]> = await restClient.get('/health/sleep/logs', {
        params: { userId, startDate, endDate },
        headers,
    });
    return response.data;
}

export async function createSleepLog(userId: string, log: Omit<SleepLog, 'id' | 'userId'>): Promise<SleepLog> {
    const headers = await authHeaders();
    const response: AxiosResponse<SleepLog> = await restClient.post(
        '/health/sleep/logs',
        { userId, ...log },
        { headers }
    );
    return response.data;
}

export async function getSleepQuality(userId: string, date: string): Promise<SleepQuality> {
    const headers = await authHeaders();
    const response: AxiosResponse<SleepQuality> = await restClient.get('/health/sleep/quality', {
        params: { userId, date },
        headers,
    });
    return response.data;
}

export async function getSleepDiary(userId: string, startDate?: string, endDate?: string): Promise<SleepDiaryEntry[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<SleepDiaryEntry[]> = await restClient.get('/health/sleep/diary', {
        params: { userId, startDate, endDate },
        headers,
    });
    return response.data;
}

export async function getSleepTrends(userId: string, period: string): Promise<SleepTrend> {
    const headers = await authHeaders();
    const response: AxiosResponse<SleepTrend> = await restClient.get('/health/sleep/trends', {
        params: { userId, period },
        headers,
    });
    return response.data;
}

export async function getSleepGoals(userId: string): Promise<SleepGoal> {
    const headers = await authHeaders();
    const response: AxiosResponse<SleepGoal> = await restClient.get('/health/sleep/goals', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getSleepDetail(logId: string): Promise<SleepLog> {
    const headers = await authHeaders();
    const response: AxiosResponse<SleepLog> = await restClient.get(`/health/sleep/logs/${logId}`, { headers });
    return response.data;
}

export async function getBedtimeRoutine(userId: string): Promise<BedtimeRoutine> {
    const headers = await authHeaders();
    const response: AxiosResponse<BedtimeRoutine> = await restClient.get('/health/sleep/routine', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getSmartAlarm(userId: string): Promise<SmartAlarm> {
    const headers = await authHeaders();
    const response: AxiosResponse<SmartAlarm> = await restClient.get('/health/sleep/alarm', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getSleepInsights(userId: string): Promise<SleepInsight[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<SleepInsight[]> = await restClient.get('/health/sleep/insights', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function syncSleepDevice(userId: string, deviceId: string): Promise<DeviceSyncResult> {
    const headers = await authHeaders();
    const response: AxiosResponse<DeviceSyncResult> = await restClient.post(
        '/health/sleep/sync',
        { userId, deviceId },
        { headers }
    );
    return response.data;
}

export async function exportSleepData(
    userId: string,
    format: string,
    startDate: string,
    endDate: string
): Promise<ExportResult> {
    const headers = await authHeaders();
    const response: AxiosResponse<ExportResult> = await restClient.post(
        '/health/sleep/export',
        { userId, format, startDate, endDate },
        { headers }
    );
    return response.data;
}

// ===========================================================================
// ACTIVITY FUNCTIONS (10)
// ===========================================================================

export async function getActivitySessions(
    userId: string,
    startDate?: string,
    endDate?: string
): Promise<ActivitySession[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<ActivitySession[]> = await restClient.get('/health/activity/sessions', {
        params: { userId, startDate, endDate },
        headers,
    });
    return response.data;
}

export async function createActivitySession(
    userId: string,
    session: Omit<ActivitySession, 'id' | 'userId'>
): Promise<ActivitySession> {
    const headers = await authHeaders();
    const response: AxiosResponse<ActivitySession> = await restClient.post(
        '/health/activity/sessions',
        { userId, ...session },
        { headers }
    );
    return response.data;
}

export async function getActivityGoals(userId: string): Promise<ActivityGoal[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<ActivityGoal[]> = await restClient.get('/health/activity/goals', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getActivityHistory(userId: string, page?: number): Promise<ActivitySession[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<ActivitySession[]> = await restClient.get('/health/activity/history', {
        params: { userId, page },
        headers,
    });
    return response.data;
}

export async function getActivityTrends(userId: string, period: string): Promise<ActivityTrend> {
    const headers = await authHeaders();
    const response: AxiosResponse<ActivityTrend> = await restClient.get('/health/activity/trends', {
        params: { userId, period },
        headers,
    });
    return response.data;
}

export async function getActivityDetail(sessionId: string): Promise<ActivitySession> {
    const headers = await authHeaders();
    const response: AxiosResponse<ActivitySession> = await restClient.get(`/health/activity/sessions/${sessionId}`, {
        headers,
    });
    return response.data;
}

export async function getWorkouts(userId: string): Promise<Workout[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<Workout[]> = await restClient.get('/health/activity/workouts', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getActivityChallenges(userId: string): Promise<ActivityChallenge[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<ActivityChallenge[]> = await restClient.get('/health/activity/challenges', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getActivityDeviceData(userId: string, deviceId: string): Promise<HealthMetric[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<HealthMetric[]> = await restClient.get('/health/activity/device-data', {
        params: { userId, deviceId },
        headers,
    });
    return response.data;
}

export async function getActivityWeeklySummary(userId: string): Promise<WeeklySummary> {
    const headers = await authHeaders();
    const response: AxiosResponse<WeeklySummary> = await restClient.get('/health/activity/weekly-summary', {
        params: { userId },
        headers,
    });
    return response.data;
}
