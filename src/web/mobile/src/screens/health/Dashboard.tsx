import React from 'react';
import { useNavigation } from '@react-navigation/native'; // version ^6.0.0
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native'; // react-native version 0.71+
import { LoadingIndicator } from '../components/shared/LoadingIndicator';
import { ErrorState } from '../components/shared/ErrorState';
import {
  Card,
  CardProps,
} from 'src/web/design-system/src/components/Card/Card.tsx';
import {
  MetricCard,
  MetricCardProps,
} from 'src/web/design-system/src/health/MetricCard/MetricCard.tsx';
import {
  HealthChart,
  HealthChartProps,
} from 'src/web/design-system/src/health/HealthChart/HealthChart.tsx';
import { useHealthMetrics } from '../hooks/useHealthMetrics';
import { useGameProfile } from '../hooks/useGamification';
import {
  AchievementBadge,
  AchievementBadgeProps,
} from 'src/web/design-system/src/gamification/AchievementBadge/AchievementBadge.tsx';
import { useJourney } from '../context/JourneyContext';
import { JOURNEY_IDS } from '../../shared/constants/journeys';
import { JourneyHeader, JourneyHeaderProps } from '../components/shared/JourneyHeader';

/**
 * Displays the main dashboard for the My Health journey.
 *
 * @returns The rendered dashboard component.
 */
export const Dashboard: React.FC = () => {
  // Access the navigation object
  const navigation = useNavigation();

  // Access safe area insets for handling notch and status bar
  const insets = useSafeAreaInsets();

  // Fetch health metrics data using the useHealthMetrics hook
  const { data: healthMetricsData, loading: healthMetricsLoading, error: healthMetricsError } = useHealthMetrics(
    'user-123', // Replace with actual user ID
    null,
    null,
    []
  );

  // Fetch the user's game profile using the useGameProfile hook
  const gameProfile = useGameProfile();

  // Access the current journey context
  const { journey } = useJourney();

  // Handle loading state
  if (healthMetricsLoading || !gameProfile) {
    return <LoadingIndicator journey={journey} />;
  }

  // Handle error state
  if (healthMetricsError) {
    return <ErrorState message="Failed to load health metrics." />;
  }

  // Extract health metrics from the fetched data
  const healthMetrics = healthMetricsData?.getHealthMetrics || [];

  // Define styles for the dashboard
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0FFF4', // Light green background
      paddingBottom: insets.bottom,
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    metricCard: {
      marginBottom: 16,
    },
  });

  // Render the dashboard
  return (
    <View style={styles.container}>
      <JourneyHeader title="Minha Saúde" showBackButton={false} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {healthMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            metricName={metric.type}
            value={metric.value}
            unit={metric.unit}
            trend={metric.trend}
            journey={journey}
            style={styles.metricCard}
          />
        ))}
      </ScrollView>
    </View>
  );
};