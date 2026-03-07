import { useQuery } from '@apollo/client'; // v3.7.17
import { DeviceConnection } from 'src/web/shared/types/health.types';
import { useAuth } from 'src/web/web/src/hooks/useAuth';
import { getConnectedDevices } from 'src/web/web/src/api/health';

/**
 * Hook for fetching connected devices for a specific user
 * Supports the Wearable Device Integration requirement in the Health Journey.
 *
 * This hook leverages React Query patterns for efficient data fetching with
 * caching, background refreshing, and error handling.
 *
 * @returns Query result containing connected devices data or error information
 */
export const useDevices = () => {
    // Get the current authentication context
    const { session } = useAuth();

    // Extract user ID from session
    // Note: We assume the user ID is available from the session
    // This may need to be adjusted based on actual auth implementation
    const userId = session?.userId || '';

    // Use React Query to fetch and cache connected devices data
    return useQuery<DeviceConnection[]>(
        ['connectedDevices', userId], // Unique query key based on userId
        () => getConnectedDevices(userId), // Function to fetch the data
        {
            // Only fetch if we have a valid userId
            enabled: Boolean(userId),

            // Keep data fresh for 5 minutes before considering it stale
            staleTime: 5 * 60 * 1000,

            // Keep cached data for 30 minutes even if unused
            cacheTime: 30 * 60 * 1000,

            // Automatically refetch when window regains focus
            refetchOnWindowFocus: true,

            // Handle fetch errors
            onError: (error) => {
                console.error('Error fetching connected devices:', error);
                // Here you could add a toast notification or other user feedback
            },
        }
    );
};
