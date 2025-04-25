import { useQuery } from '@apollo/client'; // version 3.7.17
import { HealthMetric, HealthMetricType } from '../../../shared/types/health.types';
import { GET_HEALTH_METRICS } from '../../../shared/graphql/queries/health.queries';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../constants/config';
import { isValidDate } from '../../../shared/utils/date';
import { useJourney } from '../context/JourneyContext';

/**
 * Fetches health metrics for a given user and time range using a GraphQL query.
 * Supports the Health Journey (F-101) dashboard and health data visualization (F-405).
 * 
 * @param userId - ID of the user to fetch metrics for
 * @param startDate - Start date for the metrics time range
 * @param endDate - End date for the metrics time range
 * @param types - Array of metric types to fetch
 * @returns Object containing the loading state, error, and health metrics data
 */
export const useHealthMetrics = (
  userId: string,
  startDate: Date | string | null,
  endDate: Date | string | null,
  types: HealthMetricType[]
) => {
  const { journey } = useJourney();
  
  // Execute the GraphQL query to fetch health metrics
  return useQuery<{ getHealthMetrics: HealthMetric[] }>(GET_HEALTH_METRICS, {
    variables: {
      userId,
      startDate: startDate && isValidDate(new Date(startDate)) ? new Date(startDate).toISOString() : null,
      endDate: endDate && isValidDate(new Date(endDate)) ? new Date(endDate).toISOString() : null,
      types: types.length > 0 ? types : Object.values(HealthMetricType)
    },
    // Skip the query if no userId is provided
    skip: !userId,
    // Cache configuration aligned with Health journey requirements
    fetchPolicy: 'cache-and-network',
    // Health journey has a 5-minute cache timeout as specified in config
    context: {
      // Using the API base URL from config to ensure correct endpoint targeting
      uri: `${API_BASE_URL}/graphql`
    },
    // Error handling with journey context for better error reporting
    onError: (error) => {
      console.error(`Error fetching health metrics for journey ${journey}:`, error.message);
    }
  });
};