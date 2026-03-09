import { ApolloError, useQuery } from '@apollo/client'; // 3.7.17
import { useContext } from 'react';
import { apiConfig } from 'shared/config/apiConfig';
import { GET_HEALTH_METRICS } from 'shared/graphql/queries/health.queries';
import { HealthMetric } from 'shared/types/health.types';

import { AuthContext } from '@/context/AuthContext';

/** Typed query data shape */
interface HealthMetricsResponse {
    getHealthMetrics: HealthMetric[];
}

/** Shape returned by the useHealthMetrics hook */
interface UseHealthMetricsReturn {
    loading: boolean;
    error: ApolloError | undefined;
    metrics: HealthMetric[];
    refetch: () => Promise<unknown>;
}

/**
 * A React hook that fetches and manages health metrics data
 * for the My Health journey.
 * Used to retrieve health metrics for display in the Health Dashboard.
 *
 * @param userId - The ID of the user whose health metrics to fetch
 * @param types - An array of metric types to filter the results
 * @param startDate - Optional start date to filter metrics
 * @param endDate - Optional end date to filter metrics
 * @returns An object containing loading, error, metrics, and refetch
 */
export const useHealthMetrics = (
    userId: string,
    types: string[] = [],
    startDate?: string,
    endDate?: string
): UseHealthMetricsReturn => {
    const auth = useContext(AuthContext);

    const { loading, error, data, refetch } = useQuery<HealthMetricsResponse>(GET_HEALTH_METRICS, {
        variables: {
            userId,
            types,
            startDate,
            endDate,
        },
        // Skip the query if there's no authenticated session
        skip: auth.status !== 'authenticated',
        // Cache and network strategy for optimal UX
        fetchPolicy: 'cache-and-network',
        // Ensure proper authorization headers
        context: {
            headers: {
                Authorization: auth.session?.accessToken ? `Bearer ${auth.session.accessToken}` : '',
                'Api-Base-Url': apiConfig.baseURL,
            },
        },
        // Log errors but let the component handle them
        onError: (apolloError: ApolloError) => {
            console.error('[Health Metrics] Error:', { userId, error: apolloError.message });
        },
    });

    return {
        loading,
        error,
        metrics: data?.getHealthMetrics || [],
        refetch,
    };
};
