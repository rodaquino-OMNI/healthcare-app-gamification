import React, { useState, useEffect } from 'react'; // react v18.0+
import { View, Text } from 'react-native'; // react-native version 0.71.0
import { useRoute, useNavigation } from '@react-navigation/native'; // @react-navigation/native version 6.0+
import { RouteProp } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';

import { ROUTES } from '../../constants/routes';
import { JourneyHeader } from '../../components/shared/JourneyHeader';
import { useHealthMetrics } from '../../hooks/useHealthMetrics';
import { HealthMetric } from '@shared/types/health.types';
import { Card } from '@design-system/components/Card/Card';
import { LineChart } from '@design-system/charts/LineChart/LineChart';
import { formatHealthMetric } from '../../utils/format';
import { formatDate } from '../../utils/date';
import { colors } from '@design-system/tokens/colors';
import { useTranslation } from 'react-i18next';
import { useJourney } from '../../context/JourneyContext';
import { useAuth } from '../../hooks/useAuth';

/**
 * Type definition for the Health stack param list used by this screen.
 */
type HealthStackParamList = {
  [key: string]: undefined | { metricId: string };
  HealthMetricDetail: { metricId: string };
};

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
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  // 1. Retrieves the route object using `useRoute` to access the `metricId` parameter.
  const route = useRoute<RouteProp<HealthStackParamList, 'HealthMetricDetail'>>();
  const { metricId } = (route.params ?? {}) as Partial<MetricDetailRouteParams>;

  // 2. Retrieves the navigation object using `useNavigation` for navigation purposes.
  const navigation = useNavigation();

  // 3. Retrieves the current journey using `useJourney` for theming.
  const { journey } = useJourney();

  // 4. Retrieves authenticated user info for API calls.
  const { session, getUserFromToken } = useAuth();

  // 5. Derive userId from authentication token.
  // TODO: Replace fallback with proper error handling when auth is fully integrated
  const userId = (() => {
    try {
      if (session?.accessToken) {
        const user = getUserFromToken(session.accessToken);
        return user?.id ?? 'unknown';
      }
    } catch {
      // Fallback if token parsing fails
    }
    return 'unknown';
  })();

  // 6. Defines state variables for the selected metric and time range.
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | undefined>(undefined);
  const [timeRange, setTimeRange] = useState<Date[] | null>(null);

  // 7. Uses `useHealthMetrics` to fetch health metrics data for the specified `metricId` and time range.
  const { data, isLoading, error } = useHealthMetrics(
    userId,
    timeRange ? timeRange[0] : null,
    timeRange ? timeRange[1] : null,
    [] // Fetch all metric types
  );

  // 8. Filters the fetched health metrics to find the selected metric.
  useEffect(() => {
    if (data && metricId) {
      setSelectedMetric(data.find(metric => metric.id === metricId));
    }
  }, [data, metricId]);

  // 9. Formats the start and end dates for the API request.
  const startDate = timeRange ? formatDate(timeRange[0], 'dd/MM/yyyy') : 'N/A';
  const endDate = timeRange ? formatDate(timeRange[1], 'dd/MM/yyyy') : 'N/A';

  // 10. Guard: if no metricId was provided via route params, show an error.
  if (!metricId) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background.default }}>
        <JourneyHeader
          title={t('journeys.health.metrics.title')}
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.text.muted, fontSize: 16 }}>
            {t('journeys.health.metrics.noSelection')}
          </Text>
        </View>
      </View>
    );
  }

  // 11. If the selected metric is found, renders a `JourneyHeader` with a back button and the metric name as the title.
  if (selectedMetric) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.journeys[journey].background }}>
        <JourneyHeader
          title={selectedMetric.type}
          showBackButton
          onBackPress={() => (navigation as any).navigate(ROUTES.HEALTH_DASHBOARD)}
        />

        {/* 12. Renders a `Card` component to display the metric details, including the current value and a `LineChart` to visualize the historical data. */}
        <Card journey={journey as 'health' | 'care' | 'plan'}>
          <Text style={{ color: colors.journeys[journey].text }}>
            {formatHealthMetric(selectedMetric.value, selectedMetric.unit)}
          </Text>
          <LineChart
            data={data || []}
            xAxisKey="timestamp"
            yAxisKey="value"
            xAxisLabel="Date"
            yAxisLabel="Value"
            journey={journey as 'health' | 'care' | 'plan'}
          />
        </Card>
      </View>
    );
  }

  // 13. Loading state.
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.journeys[journey].background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.text.muted }}>{t('journeys.health.metrics.loading')}</Text>
      </View>
    );
  }

  // 14. If the selected metric is not found, renders an error message.
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.default, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: theme.colors.text.muted, fontSize: 16 }}>{t('journeys.health.metrics.notFound')}</Text>
    </View>
  );
};

/**
 * Named export matching the HealthNavigator import `{ MetricDetail }`.
 */
export const MetricDetail = MetricDetailScreen;

export default MetricDetailScreen;
