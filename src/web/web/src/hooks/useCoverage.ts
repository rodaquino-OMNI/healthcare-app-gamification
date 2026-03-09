import { UseQueryResult, useQuery } from '@tanstack/react-query'; // v4.0
import { Coverage } from 'shared/types/plan.types';

import { useAuth } from '@/hooks/useAuth';

/**
 * A React hook that fetches insurance coverage data for a given plan ID.
 * This hook implements the Display detailed insurance coverage information
 * requirement for the My Plan & Benefits journey.
 *
 * @param planId - The ID of the plan to fetch coverage data for
 * @returns A React Query result object containing coverage data
 */
export const useCoverage = (planId: string): UseQueryResult<Coverage[]> => {
    const { session } = useAuth();

    return useQuery<Coverage[]>({
        queryKey: ['coverage', planId],
        queryFn: async () => {
            try {
                const response = await fetch(`/api/plans/${planId}/coverage`);
                if (!response.ok) {
                    throw new Error('Failed to fetch coverage data: ' + `${response.statusText}`);
                }
                return (await response.json()) as Coverage[];
            } catch (error) {
                console.error('Error fetching coverage data:', error);
                throw error;
            }
        },
        enabled: !!planId && !!session,
        staleTime: 15 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 2,
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};
