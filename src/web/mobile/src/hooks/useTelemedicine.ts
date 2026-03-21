/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
/**
 * @file useTelemedicine.ts
 * @description Custom React hook for managing telemedicine sessions within the AUSTA SuperApp.
 * Uses @tanstack/react-query v5 for data fetching, caching, and mutations.
 * Handles the Care Now Journey (F-102) with permission checking and session polling.
 */

import { TelemedicineSession } from '@shared/types/care.types';
import { useQuery, useMutation } from '@tanstack/react-query'; // v5.22+
import { useEffect } from 'react';

import { useAuth } from './useAuth';
import { createTelemedicineSession, getTelemedicineSession } from '../api/care';
import { config } from '../constants/config';
import { useJourney } from '../context/JourneyContext';
import { checkAndroidPermissions } from '../utils/permissions';

/**
 * Custom hook for managing telemedicine sessions within the AUSTA SuperApp.
 *
 * @param sessionId - Optional ID of an existing session to retrieve and poll
 * @returns Object containing session data, loading state, error state, and session management functions
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- hook return type inferred
export function useTelemedicineSession(sessionId?: string) {
    const { session: authSession, isAuthenticated } = useAuth();

    // Access journey context for journey-specific behaviour
    const { journey: _journey } = useJourney();

    // Fetch (and poll) an existing session when sessionId is provided
    const {
        data: session,
        isPending,
        error: queryError,
        refetch,
    } = useQuery<TelemedicineSession, Error>({
        queryKey: ['telemedicineSession', sessionId],
        // Cast required because the API's local TelemedicineSession has more fields
        // than the shared type; the shared type is a structural subset that is safe to use.
        queryFn: () => getTelemedicineSession(sessionId as string) as Promise<TelemedicineSession>,
        enabled: !!sessionId && isAuthenticated && !!authSession,
        staleTime: 0, // Always re-fetch for live session data
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes after unmount
        refetchInterval: 10000, // Poll every 10 seconds (replaces manual setInterval)
    });

    // Log session fetch errors via useEffect (v5 removed onError from useQuery)
    useEffect(() => {
        if (queryError) {
            console.error('Failed to fetch telemedicine session:', queryError);
        }
    }, [queryError]);

    // Mutation for creating a new telemedicine session
    const createMutation = useMutation<TelemedicineSession, Error, string>({
        mutationFn: async (appointmentId: string): Promise<TelemedicineSession> => {
            // Verify user is authenticated
            if (!authSession) {
                throw new Error('Authentication required for telemedicine session');
            }

            // Check required permissions on Android
            if (config.platform === 'android') {
                const hasPermissions = await checkAndroidPermissions();
                if (!hasPermissions) {
                    throw new Error('Camera and microphone permissions are required for telemedicine');
                }
            }

            return createTelemedicineSession(appointmentId) as Promise<TelemedicineSession>;
        },
        onError: (err) => {
            console.error('Failed to create telemedicine session:', err);
        },
    });

    /**
     * Creates a new telemedicine session for the specified appointment.
     *
     * @param appointmentId - ID of the appointment to create a session for
     * @returns Promise resolving to the created session, or null on failure
     */
    const createSession = async (appointmentId: string): Promise<TelemedicineSession | null> => {
        try {
            return await createMutation.mutateAsync(appointmentId);
        } catch {
            return null;
        }
    };

    return {
        session: session ?? null,
        isLoading: isPending,
        error: queryError ?? createMutation.error,
        createSession,
        refetch,
    };
}
