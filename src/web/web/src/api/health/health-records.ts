/**
 * Health Records API Module
 *
 * Sleep tracking and activity tracking types and functions.
 */

import { HealthMetric } from 'shared/types/health.types';

import { restClient } from '../client';

// ---------------------------------------------------------------------------
// Sleep types
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
// Activity types
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
// Shared export/sync types
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

// ===========================================================================
// 2. SLEEP FUNCTIONS (12)
// ===========================================================================

export async function getSleepLogs(userId: string, startDate?: string, endDate?: string): Promise<SleepLog[]> {
    const response = await restClient.get<SleepLog[]>('/health/sleep/logs', {
        params: { userId, startDate, endDate },
    });
    return response.data;
}

export async function createSleepLog(userId: string, log: Omit<SleepLog, 'id' | 'userId'>): Promise<SleepLog> {
    const response = await restClient.post<SleepLog>('/health/sleep/logs', { userId, ...log });
    return response.data;
}

export async function getSleepQuality(userId: string, date: string): Promise<SleepQuality> {
    const response = await restClient.get<SleepQuality>('/health/sleep/quality', {
        params: { userId, date },
    });
    return response.data;
}

export async function getSleepDiary(userId: string, startDate?: string, endDate?: string): Promise<SleepDiaryEntry[]> {
    const response = await restClient.get<SleepDiaryEntry[]>('/health/sleep/diary', {
        params: { userId, startDate, endDate },
    });
    return response.data;
}

export async function getSleepTrends(userId: string, period: string): Promise<SleepTrend> {
    const response = await restClient.get<SleepTrend>('/health/sleep/trends', {
        params: { userId, period },
    });
    return response.data;
}

export async function getSleepGoals(userId: string): Promise<SleepGoal> {
    const response = await restClient.get<SleepGoal>('/health/sleep/goals', {
        params: { userId },
    });
    return response.data;
}

export async function getSleepDetail(logId: string): Promise<SleepLog> {
    const response = await restClient.get<SleepLog>(`/health/sleep/logs/${logId}`);
    return response.data;
}

export async function getBedtimeRoutine(userId: string): Promise<BedtimeRoutine> {
    const response = await restClient.get<BedtimeRoutine>('/health/sleep/routine', {
        params: { userId },
    });
    return response.data;
}

export async function getSmartAlarm(userId: string): Promise<SmartAlarm> {
    const response = await restClient.get<SmartAlarm>('/health/sleep/alarm', {
        params: { userId },
    });
    return response.data;
}

export async function getSleepInsights(userId: string): Promise<SleepInsight[]> {
    const response = await restClient.get<SleepInsight[]>('/health/sleep/insights', {
        params: { userId },
    });
    return response.data;
}

export async function syncSleepDevice(userId: string, deviceId: string): Promise<DeviceSyncResult> {
    const response = await restClient.post<DeviceSyncResult>('/health/sleep/sync', { userId, deviceId });
    return response.data;
}

export async function exportSleepData(
    userId: string,
    format: string,
    startDate: string,
    endDate: string
): Promise<ExportResult> {
    const response = await restClient.post<ExportResult>('/health/sleep/export', {
        userId,
        format,
        startDate,
        endDate,
    });
    return response.data;
}

// ===========================================================================
// 10. ADDITIONAL SLEEP FUNCTIONS (5)
// ===========================================================================

/** Update sleep goals for a user. */
export async function updateSleepGoals(userId: string, goals: Partial<SleepGoal>): Promise<SleepGoal> {
    const response = await restClient.put<SleepGoal>('/health/sleep/goals', { userId, ...goals });
    return response.data;
}

/** Update smart alarm settings for a user. */
export async function updateSmartAlarm(userId: string, alarm: Partial<SmartAlarm>): Promise<SmartAlarm> {
    const response = await restClient.put<SmartAlarm>('/health/sleep/alarm', { userId, ...alarm });
    return response.data;
}

/** Update bedtime routine for a user. */
export async function updateBedtimeRoutine(userId: string, routine: Partial<BedtimeRoutine>): Promise<BedtimeRoutine> {
    const response = await restClient.put<BedtimeRoutine>('/health/sleep/routine', { userId, ...routine });
    return response.data;
}

/** Create a new sleep diary entry. */
export async function createSleepDiaryEntry(
    userId: string,
    entry: Omit<SleepDiaryEntry, 'id'>
): Promise<SleepDiaryEntry> {
    const response = await restClient.post<SleepDiaryEntry>('/health/sleep/diary', { userId, ...entry });
    return response.data;
}

/** Delete a sleep log by its ID. */
export async function deleteSleepLog(logId: string): Promise<void> {
    await restClient.delete(`/health/sleep/logs/${logId}`);
}

// ===========================================================================
// 3. ACTIVITY FUNCTIONS (10)
// ===========================================================================

export async function getActivitySessions(
    userId: string,
    startDate?: string,
    endDate?: string
): Promise<ActivitySession[]> {
    const response = await restClient.get<ActivitySession[]>('/health/activity/sessions', {
        params: { userId, startDate, endDate },
    });
    return response.data;
}

export async function createActivitySession(
    userId: string,
    session: Omit<ActivitySession, 'id' | 'userId'>
): Promise<ActivitySession> {
    const response = await restClient.post<ActivitySession>('/health/activity/sessions', { userId, ...session });
    return response.data;
}

export async function getActivityGoals(userId: string): Promise<ActivityGoal[]> {
    const response = await restClient.get<ActivityGoal[]>('/health/activity/goals', {
        params: { userId },
    });
    return response.data;
}

export async function getActivityHistory(userId: string, page?: number): Promise<ActivitySession[]> {
    const response = await restClient.get<ActivitySession[]>('/health/activity/history', {
        params: { userId, page },
    });
    return response.data;
}

export async function getActivityTrends(userId: string, period: string): Promise<ActivityTrend> {
    const response = await restClient.get<ActivityTrend>('/health/activity/trends', {
        params: { userId, period },
    });
    return response.data;
}

export async function getActivityDetail(sessionId: string): Promise<ActivitySession> {
    const response = await restClient.get<ActivitySession>(`/health/activity/sessions/${sessionId}`);
    return response.data;
}

export async function getWorkouts(userId: string): Promise<Workout[]> {
    const response = await restClient.get<Workout[]>('/health/activity/workouts', {
        params: { userId },
    });
    return response.data;
}

export async function getActivityChallenges(userId: string): Promise<ActivityChallenge[]> {
    const response = await restClient.get<ActivityChallenge[]>('/health/activity/challenges', {
        params: { userId },
    });
    return response.data;
}

export async function getActivityDeviceData(userId: string, deviceId: string): Promise<HealthMetric[]> {
    const response = await restClient.get<HealthMetric[]>('/health/activity/device-data', {
        params: { userId, deviceId },
    });
    return response.data;
}

export async function getActivityWeeklySummary(userId: string): Promise<WeeklySummary> {
    const response = await restClient.get<WeeklySummary>('/health/activity/weekly-summary', {
        params: { userId },
    });
    return response.data;
}

// ===========================================================================
// 11. ADDITIONAL ACTIVITY FUNCTIONS (5)
// ===========================================================================

/** Create a new activity goal for a user. */
export async function createActivityGoal(
    userId: string,
    goal: Omit<ActivityGoal, 'id' | 'userId' | 'current'>
): Promise<ActivityGoal> {
    const response = await restClient.post<ActivityGoal>('/health/activity/goals', { userId, ...goal });
    return response.data;
}

/** Update an existing activity goal. */
export async function updateActivityGoal(goalId: string, updates: Partial<ActivityGoal>): Promise<ActivityGoal> {
    const response = await restClient.put<ActivityGoal>(`/health/activity/goals/${goalId}`, updates);
    return response.data;
}

/** Join an activity challenge. */
export async function joinActivityChallenge(userId: string, challengeId: string): Promise<ActivityChallenge> {
    const response = await restClient.post<ActivityChallenge>(`/health/activity/challenges/${challengeId}/join`, {
        userId,
    });
    return response.data;
}

/** Create a new workout. */
export async function createWorkout(userId: string, workout: Omit<Workout, 'id'>): Promise<Workout> {
    const response = await restClient.post<Workout>('/health/activity/workouts', { userId, ...workout });
    return response.data;
}

/** Delete an activity session by its ID. */
export async function deleteActivitySession(sessionId: string): Promise<void> {
    await restClient.delete(`/health/activity/sessions/${sessionId}`);
}
