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
import { LoadingIndicator } from '@components/shared/LoadingIndicator';
import { ErrorState } from '@components/shared/ErrorState';
import {
  Card,
  CardProps,
} from '@design-system/components/Card/Card';
import {
  MetricCard,
  MetricCardProps,
} from '@design-system/health/MetricCard/MetricCard';
import {
  HealthChart,
  HealthChartProps,
} from '@design-system/health/HealthChart/HealthChart';
import { useHealthMetrics } from '@hooks/useHealthMetrics';
import { useGameProfile } from '@hooks/useGamification';
import {
  AchievementBadge,
} from '@design-system/gamification/AchievementBadge/AchievementBadge';
import { useTranslation } from 'react-i18next';
import { useJourney } from '@context/JourneyContext';
import { JOURNEY_IDS } from '@shared/constants/journeys';
import { JourneyHeader, JourneyHeaderProps } from '@components/shared/JourneyHeader';
import { colors } from '@design-system/tokens/colors';

/**
 * Displays the main dashboard for the My Health journey.
 *
 * @returns The rendered dashboard component.
 */
export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  // Access the navigation object
  const navigation = useNavigation();

  // Access safe area insets for handling notch and status bar
  const insets = useSafeAreaInsets();

  // Fetch health metrics data using the useHealthMetrics hook
  const { data: healthMetrics, isLoading: healthMetricsLoading, error: healthMetricsError } = useHealthMetrics(
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
    return <LoadingIndicator journey={journey as 'health' | 'care' | 'plan'} />;
  }

  // Handle error state
  if (healthMetricsError) {
    return <ErrorState message={t('common.errors.default')} />;
  }

  // Define styles for the dashboard
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.journeys.health.background, // Light green background
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
      <JourneyHeader title={t('journeys.health.title')} showBackButton={false} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {healthMetrics.map((metric, index) => (
          <View key={index} style={styles.metricCard}>
            <MetricCard
              metricName={metric.type}
              value={metric.value}
              unit={metric.unit}
              trend={metric.trend}
              journey={journey as 'health' | 'care' | 'plan'}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};