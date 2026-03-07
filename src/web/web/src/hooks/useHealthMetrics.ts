import { useQuery } from '@apollo/client'; // 3.7.17
import { useContext } from 'react';
import { HealthMetric } from 'src/web/shared/types/health.types';
import { GET_HEALTH_METRICS } from 'src/web/shared/graphql/queries/health.queries';
import { useAuth } from 'src/web/web/src/context/AuthContext';
import { apiConfig } from 'src/web/shared/config/apiConfig';

/**
 * A React hook that fetches and manages health metrics data for the My Health journey.
 * Used to retrieve health metrics for display in the Health Dashboard.
 *
 * @param userId - The ID of the user whose health metrics to fetch
 * @param types - An array of metric types to filter the results
 * @param startDate - Optional start date to filter metrics by time range
 * @param endDate - Optional end date to filter metrics by time range
 * @returns An object containing loading state, error state, metrics data, and refetch function
 */
export const useHealthMetrics = (userId: string, types: string[] = [], startDate?: string, endDate?: string) => {
    const auth = useContext(AuthContext);

    // Define the response type for type safety
    interface HealthMetricsResponse {
        getHealthMetrics: HealthMetric[];
    }

    const { loading, error, data, refetch } = useQuery<HealthMetricsResponse>(GET_HEALTH_METRICS, {
        variables: {
            userId,
            types,
            startDate,
            endDate,
        },
        // Skip the query if there's no authenticated session
        skip: auth.status !== 'authenticated',
        // Cache and network strategy for optimal user experience with health metrics
        fetchPolicy: 'cache-and-network',
        // Keep data fresh by refetching when the user returns to the app
        refetchOnWindowFocus: true,
        // Ensure proper authorization headers are sent with the request
        context: {
            headers: {
                Authorization: auth.session?.accessToken ? `Bearer ${auth.session.accessToken}` : '',
                'Api-Base-Url': apiConfig.baseURL, // Include base URL for monitoring and logging
            },
        },
        // Log errors but let the component handle them for user feedback
        onError: (error) => {
            console.error(`[Health Metrics] Error fetching metrics for user ${userId}:`, error);
        },
    });

    return {
        loading,
        error,
        metrics: data?.getHealthMetrics || [],
        refetch,
    };
};
