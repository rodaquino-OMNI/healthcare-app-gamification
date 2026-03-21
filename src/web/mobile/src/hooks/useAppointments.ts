/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
/**
 * @file useAppointments.ts
 * @description Custom React hook for fetching and managing appointment data within
 * the Care Now Journey (F-102). Encapsulates TanStack Query logic for listing
 * appointments and mutating (cancelling) them via the REST API layer.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useAuth } from './useAuth';
import { getAppointments, cancelAppointment, Appointment } from '../api/care';

/**
 * Provides the list of appointments for the currently authenticated user,
 * plus a cancel function backed by a mutation that invalidates the cache.
 *
 * @returns An object containing appointments, loading state, error, refetch, and cancel.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- hook return type inferred
export function useAppointments() {
    const auth = useAuth();
    const queryClient = useQueryClient();

    // Derive userId from the decoded access token
    const userId: string | undefined = auth.session?.accessToken
        ? auth.getUserFromToken(auth.session.accessToken)?.sub
        : undefined;

    const { data, isPending, error, refetch } = useQuery<Appointment[], Error>({
        queryKey: ['appointments', userId],
        queryFn: () => getAppointments(userId as string),
        // Only fetch when authenticated and userId is available
        enabled: !!userId && auth.isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    });

    // Handle fetch errors via useEffect (TanStack Query v5 removed onError)
    useEffect(() => {
        if (error) {
            console.error('Error fetching appointments:', error);
        }
    }, [error]);

    const cancelMutation = useMutation<void, Error, { id: string; reason?: string }>({
        mutationFn: ({ id, reason }) => cancelAppointment(id, reason),
        onSuccess: () => {
            // Invalidate the appointments query so the list refreshes after cancellation
            queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
        },
        onError: (err) => {
            console.error('Error cancelling appointment:', err);
        },
    });

    /**
     * Cancel an appointment by ID.
     *
     * @param id - ID of the appointment to cancel
     * @param reason - Optional cancellation reason
     * @returns Promise that resolves when the cancellation is complete
     */
    const cancel = async (id: string, reason?: string): Promise<void> => {
        if (!auth.isAuthenticated) {
            throw new Error('Authentication required');
        }
        await cancelMutation.mutateAsync({ id, reason });
    };

    return {
        appointments: data ?? [],
        isLoading: isPending,
        error,
        refetch,
        cancel,
    };
}
