import { useQuery } from '@tanstack/react-query'; // v4.0
import { Coverage } from 'src/web/shared/types/plan.types';
import { useAuth } from 'src/web/web/src/context/AuthContext';

/**
 * A React hook that fetches insurance coverage data for a given plan ID.
 * This hook implements the Display detailed insurance coverage information requirement
 * for the My Plan & Benefits journey.
 * 
 * @param planId - The ID of the plan to fetch coverage data for
 * @returns A React Query result object containing coverage data, loading state, and error information
 */
export const useCoverage = (planId: string) => {
  const { session } = useAuth();
  
  return useQuery<Coverage[]>(
    // Query key includes planId to ensure proper cache invalidation
    ['coverage', planId],
    
    // Query function that fetches the coverage data
    async () => {
      try {
        // This would typically call an API client function
        // Example implementation using fetch:
        const response = await fetch(`/api/plans/${planId}/coverage`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch coverage data: ${response.statusText}`);
        }
        
        return await response.json() as Coverage[];
      } catch (error) {
        console.error('Error fetching coverage data:', error);
        throw error;
      }
    },
    
    // Query options
    {
      // Only run the query if we have a planId and user is authenticated
      enabled: !!planId && !!session,
      
      // Coverage data doesn't change frequently, so we can cache it for a while
      staleTime: 15 * 60 * 1000, // 15 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      
      // Error handling
      onError: (error) => {
        console.error('Error in coverage query:', error);
      },
      
      // Set a retry policy for transient errors
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  );
};