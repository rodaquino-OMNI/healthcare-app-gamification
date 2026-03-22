/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
/**
 * @file useDevices.ts
 * @description Custom React hook for fetching connected devices and connecting new ones.
 * Uses @tanstack/react-query v5 for data fetching, caching, and mutations.
 * Supports the My Health Journey functionality (F-101) for device management.
 */

import { DeviceConnection } from '@shared/types/health.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // v5.22+
import { useEffect } from 'react';

import { useAuth } from './useAuth';
import { getConnectedDevices, connectDevice } from '../api/health';

/** Minimal shape of a decoded JWT used in this hook. */
interface DecodedToken {
    sub?: string;
    [key: string]: unknown;
}

/**
 * Custom hook that fetches connected devices for the current user and provides
 * a function to connect new devices.
 *
 * @returns An object containing the list of connected devices, loading state, error state,
 * and a function to connect new devices.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- hook return type inferred
export function useDevices() {
    const queryClient = useQueryClient();
    const auth = useAuth();

    // Derive userId from the JWT in the current session
    const decoded = auth.session?.accessToken
        ? (auth.getUserFromToken(auth.session.accessToken) as DecodedToken | null)
        : null;
    const userId: string | undefined = decoded?.sub ?? undefined;

    const { data, isPending, error, refetch } = useQuery<DeviceConnection[], Error>({
        queryKey: ['devices', userId],
        // The API returns HealthDevice[] which is structurally compatible with DeviceConnection[]
        queryFn: () => getConnectedDevices(userId as string) as Promise<DeviceConnection[]>,
        enabled: !!userId && auth.isAuthenticated,
        staleTime: 5 * 60 * 1000, // Device list is fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Unused data remains in cache for 30 minutes
    });

    // Log fetch errors via useEffect (v5 removed onError from useQuery)
    useEffect(() => {
        if (error) {
            console.error('Error fetching devices:', error);
        }
    }, [error]);

    // Mutation for connecting a new device
    const connectMutation = useMutation<DeviceConnection, Error, { deviceType: string; deviceId: string }>({
        mutationFn: async (deviceData: { deviceType: string; deviceId: string }): Promise<DeviceConnection> => {
            if (!userId) {
                throw new Error('User must be authenticated to connect a device');
            }
            // The API returns HealthDevice which is structurally compatible with DeviceConnection
            return connectDevice(userId, deviceData) as Promise<DeviceConnection>;
        },
        onSuccess: () => {
            // Invalidate and re-fetch the devices list to include the newly connected device
            queryClient.invalidateQueries({ queryKey: ['devices', userId] });
        },
        onError: (err) => {
            console.error('Error connecting device:', err);
        },
    });

    /**
     * Connect a new device to the user's account.
     *
     * @param deviceData - Data needed to connect the device (deviceType, deviceId, etc.)
     * @returns The newly connected device object
     * @throws Error if connection fails or user is not authenticated
     */
    const connect = (deviceData: { deviceType: string; deviceId: string }): Promise<DeviceConnection> =>
        connectMutation.mutateAsync(deviceData);

    return {
        devices: data ?? [],
        isLoading: isPending,
        error,
        connect,
        refetch,
    };
}
