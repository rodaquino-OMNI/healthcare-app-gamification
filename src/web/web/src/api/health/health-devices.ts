/**
 * Health Devices & Goals API Module
 *
 * Device management functions (disconnect, sync history) and health goal functions.
 */

import { restClient } from '../client';
import type { DeviceSyncResult } from './health-records';

// ---------------------------------------------------------------------------
// Goal types
// ---------------------------------------------------------------------------

export interface HealthGoalLocal {
    id: string;
    userId: string;
    category: string;
    title: string;
    target: number;
    current: number;
    unit: string;
    deadline?: string;
    status: 'active' | 'completed' | 'paused';
}

export interface HealthGoalProgress {
    goalId: string;
    entries: { date: string; value: number }[];
    percentComplete: number;
    trend: 'improving' | 'stable' | 'declining';
}

// ===========================================================================
// 9. HEALTH GOALS FUNCTIONS (5)
// ===========================================================================

export async function getHealthGoalsRest(userId: string): Promise<HealthGoalLocal[]> {
    const response = await restClient.get<HealthGoalLocal[]>('/health/goals', {
        params: { userId },
    });
    return response.data;
}

export async function createHealthGoal(
    userId: string,
    goal: Omit<HealthGoalLocal, 'id' | 'userId' | 'current' | 'status'>
): Promise<HealthGoalLocal> {
    const response = await restClient.post<HealthGoalLocal>('/health/goals', { userId, ...goal });
    return response.data;
}

export async function updateHealthGoal(goalId: string, updates: Partial<HealthGoalLocal>): Promise<HealthGoalLocal> {
    const response = await restClient.put<HealthGoalLocal>(`/health/goals/${goalId}`, updates);
    return response.data;
}

export async function getHealthGoalProgress(goalId: string): Promise<HealthGoalProgress> {
    const response = await restClient.get<HealthGoalProgress>(`/health/goals/${goalId}/progress`);
    return response.data;
}

/** Delete a health goal by its ID. */
export async function deleteHealthGoal(goalId: string): Promise<void> {
    await restClient.delete(`/health/goals/${goalId}`);
}

// ===========================================================================
// 14. DEVICE FUNCTIONS (2)
// ===========================================================================

/** Disconnect a health device for a user. */
export async function disconnectDevice(userId: string, deviceId: string): Promise<void> {
    await restClient.delete(`/health/devices/${deviceId}`, { params: { userId } });
}

/** Get sync history for a specific device. */
export async function getDeviceSyncHistory(userId: string, deviceId: string): Promise<DeviceSyncResult[]> {
    const response = await restClient.get<DeviceSyncResult[]>(`/health/devices/${deviceId}/sync-history`, {
        params: { userId },
    });
    return response.data;
}
