/**
 * @file useCoverage.ts
 * @description Custom hook to fetch insurance coverage details for a given plan ID.
 * This hook addresses the Coverage Information requirement (F-103-RQ-001) by providing
 * a clean interface to access and display detailed insurance coverage information.
 * 
 * @todo Optimization: This hook currently fetches all plans for a user and then filters 
 * by planId. For better performance, consider implementing a dedicated API endpoint 
 * for fetching a single plan by ID directly.
 */

import { useQuery } from '@tanstack/react-query'; // v4.0+
import { Plan } from 'src/web/shared/types/plan.types';
import { getPlans } from 'src/web/mobile/src/api/plan';
import { useAuth } from 'src/web/mobile/src/context/AuthContext';

/**
 * Custom hook to fetch and manage insurance coverage data for a specific plan.
 * 
 * @param planId - The ID of the plan for which to retrieve coverage details
 * @returns Object containing loading state, error, coverage data, and plan details
 */
export const useCoverage = (planId: string) => {
  // Get the current auth context
  const { session, getUserFromToken } = useAuth();
  
  // Extract user ID from the token if a session exists
  const decodedToken = session ? getUserFromToken(session.accessToken) : null;
  
  // Assuming the token contains either an 'id' or 'sub' claim for the user ID
  const userId = decodedToken?.id || decodedToken?.sub;
  
  // Use React Query to fetch and cache the plan data
  // TData = Plan[], TError = Error, TResult = Plan | undefined
  const { 
    data: plan, // Rename data to plan for clarity
    isLoading, 
    error, 
    refetch 
  } = useQuery<Plan[], Error, Plan | undefined>(
    // Query key includes userId and planId for proper caching
    ['plans', userId, planId],
    
    // Query function fetches all plans and the select function filters for the specific plan
    async () => {
      // Ensure we have a user ID before making the request
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Fetch all plans for the user
      return getPlans(userId);
    },
    {
      // Configuration options
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      staleTime: 5 * 60 * 1000,    // Consider data fresh for 5 minutes
      retry: 3,                    // Retry failed requests up to 3 times
      enabled: !!userId && !!planId, // Only run query if we have userId and planId
      
      // Transform the array of plans to the specific plan we want
      select: (plans) => plans.find(p => p.id === planId)
    }
  );
  
  // Extract coverage information from the plan, or empty array if plan is undefined
  const coverage = plan?.coverages || [];
  
  // Return all relevant data and states
  return {
    coverage,   // The coverage details
    plan,       // The full plan object
    isLoading,  // Loading state
    error,      // Any error that occurred
    refetch     // Function to manually refetch the data
  };
};