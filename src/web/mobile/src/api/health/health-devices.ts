/**
 * Health Devices API — device disconnect and sync history functions.
 */

import { AxiosResponse } from 'axios';

import { getAuthSession } from '../care';
import { restClient } from '../client';
import type { DeviceSyncResult } from './health-records';

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
// DEVICE FUNCTIONS
// ===========================================================================

export async function disconnectDevice(deviceId: string): Promise<void> {
    const headers = await authHeaders();
    await restClient.delete(`/health/devices/${deviceId}`, { headers });
}

export async function getDeviceSyncHistory(deviceId: string): Promise<DeviceSyncResult[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<DeviceSyncResult[]> = await restClient.get(
        `/health/devices/${deviceId}/sync-history`,
        { headers }
    );
    return response.data;
}
