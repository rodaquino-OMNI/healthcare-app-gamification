/**
 * @file useClaims.ts
 * @description Custom React hook for fetching and managing claim data within the 'My Plan & Benefits' journey.
 * This hook encapsulates the logic for making API requests to retrieve claims and handles the loading and error states.
 */

import { useQuery } from 'react-query'; // v4.0+
import { getClaims } from '../api/plan';
import { Claim } from '../../shared/types/plan.types';
import { useAuth } from './useAuth';
import { AuthContextType } from '../context/AuthContext';

/**
 * Custom hook to fetch and manage claims data for a specific user.
 * 
 * @param planId - The ID of the plan for which to fetch claims
 * @returns An object containing the loading state, error, and claims data
 */
export function useClaims(planId: string) {
  // Get the authentication context to ensure the user is logged in
  const auth = useAuth();
  
  // Use react-query to fetch and cache the claims data
  const { 
    data, 
    isLoading,
    error,
    refetch 
  } = useQuery<Claim[], Error>(
    ['claims', planId],
    () => getClaims(planId),
    {
      // Only fetch if we have a plan ID and user is authenticated
      enabled: !!planId && auth.isAuthenticated,
      // Handle errors
      onError: (error) => {
        console.error(`Error fetching claims for plan ${planId}:`, error);
      },
      // Cache configuration for optimal performance
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Unused data remains in cache for 30 minutes
    }
  );
  
  return {
    claims: data || [],
    isLoading,
    error,
    refetch
  };
}