import React, { useState, useEffect } from 'react'; // react v18.0+
import { View, Text } from 'react-native'; // react-native version 0.71.0
import { useRoute, useNavigation } from '@react-navigation/native'; // @react-navigation/native version 6.0+

import { ROUTES } from '../../constants/routes';
import { JourneyHeader } from '../../components/shared/JourneyHeader';
import { useHealthMetrics } from '../../hooks/useHealthMetrics';
import { HealthMetric } from '../../../shared/types/health.types';
import { Card } from '../../../design-system/src/components/Card/Card';
import { LineChart } from '../../../design-system/src/charts/LineChart/LineChart';
import { formatDate, formatHealthMetric } from '../../utils/format';
import { colors } from '../../../design-system/src/tokens/colors';
import { useJourney } from '../../context/JourneyContext';
import { getHealthMetrics } from '../../api/health';

/**
 * Interface defining the route parameters expected by this screen.
 */
interface MetricDetailRouteParams {
  metricId: string;
}

/**
 * Displays detailed information for a selected health metric.
 */
export const MetricDetailScreen: React.FC = () => {
  // 1. Retrieves the route object using `useRoute` to access the `metricId` parameter.
  const route = useRoute<any>();
  const { metricId } = route.params as MetricDetailRouteParams;

  // 2. Retrieves the navigation object using `useNavigation` for navigation purposes.
  const navigation = useNavigation();

  // 3. Retrieves the current journey using `useJourney` for theming.
  const { journey } = useJourney();

  // 4. Defines state variables for the selected metric and time range.
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | undefined>(undefined);
  const [timeRange, setTimeRange] = useState<Date[] | null>(null);

  // 5. Uses `useHealthMetrics` to fetch health metrics data for the specified `metricId` and time range.
  const { data, loading, error } = useHealthMetrics(
    'user-123', // TODO: Replace with actual user ID
    timeRange ? timeRange[0] : null,
    timeRange ? timeRange[1] : null,
    [] // Fetch all metric types
  );

  // 6. Filters the fetched health metrics to find the selected metric.
  useEffect(() => {
    if (data?.getHealthMetrics) {
      setSelectedMetric(data.getHealthMetrics.find(metric => metric.id === metricId));
    }
  }, [data, metricId]);

  // 7. Formats the start and end dates for the API request.
  const startDate = timeRange ? formatDate(timeRange[0]) : 'N/A';
  const endDate = timeRange ? formatDate(timeRange[1]) : 'N/A';

  // 8. If the selected metric is found, renders a `JourneyHeader` with a back button and the metric name as the title.
  if (selectedMetric) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.journeys[journey].background }}>
        <JourneyHeader
          title={selectedMetric.type}
          showBackButton
          onBackPress={() => navigation.navigate(ROUTES.HEALTH_DASHBOARD)}
        />

        {/* 9. Renders a `Card` component to display the metric details, including the current value and a `LineChart` to visualize the historical data. */}
        <Card journey={journey}>
          <Text>
            {formatHealthMetric(selectedMetric.value, selectedMetric.type, selectedMetric.unit)}
          </Text>
          <LineChart
            data={data?.getHealthMetrics || []}
            xAxisKey="timestamp"
            yAxisKey="value"
            xAxisLabel="Date"
            yAxisLabel="Value"
            journey={journey}
          />
        </Card>
      </View>
    );
  }

  // 10. If the selected metric is not found, renders an error message.
  return (
    <View>
      <Text>Metric not found</Text>
    </View>
  );
};