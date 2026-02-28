import React from 'react';
import { HealthMetric } from 'src/web/shared/types/health.types.ts';
import { JOURNEY_IDS } from 'src/web/shared/constants/journeys.ts';
import { Card } from 'src/web/design-system/src/components/Card/Card.tsx';
import { MetricCard } from 'src/web/design-system/src/health/MetricCard/MetricCard.tsx';
import { useAuth } from 'src/web/web/src/hooks/useAuth';
import { useHealthMetrics } from 'src/web/web/src/hooks/useHealthMetrics.ts';
import { useJourney } from 'src/web/web/src/hooks/useJourney.ts';

/**
 * A widget component that displays a summary of key health metrics.
 *
 * @returns The rendered MetricsWidget component.
 */
export const MetricsWidget: React.FC = () => {
  // LD1: Call the `useJourney` hook to get the current journey context.
  const { journey } = useJourney();

  // Get authenticated user ID for personalized metrics
  const { user } = useAuth();
  const { loading, error, metrics } = useHealthMetrics(
    user?.id ?? '',
    [], // Fetch all metric types
  );

  // Compute trend from metrics history
  const computeTrend = (metric: HealthMetric): 'up' | 'down' | 'stable' => {
    if (metric.previousValue === undefined) return 'stable';
    if (metric.value > metric.previousValue) return 'up';
    if (metric.value < metric.previousValue) return 'down';
    return 'stable';
  };

  // LD1: Render a `Card` component with journey-specific styling.
  return (
    <Card journey={JOURNEY_IDS.HEALTH} elevation="sm">
      {loading && (
        // LD1: Display a loading indicator while the data is being fetched.
        <div>Loading metrics...</div>
      )}
      {error && (
        // LD1: Display an error message if there is an error fetching the data.
        <div>Error fetching metrics: {error.message}</div>
      )}
      {!loading && !error && (
        // LD1: Render a list of `MetricCard` components for each health metric.
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {metrics.map((metric: HealthMetric) => (
            <MetricCard
              key={metric.id}
              metricName={metric.type}
              value={metric.value}
              unit={metric.unit}
              trend={computeTrend(metric)}
              journey={JOURNEY_IDS.HEALTH}
            />
          ))}
        </div>
      )}
    </Card>
  );
};