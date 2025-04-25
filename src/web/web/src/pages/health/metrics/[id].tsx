# src/web/web/src/pages/health/metrics/[id].tsx
```tsx
import React from 'react';
import { useRouter } from 'next/router'; // next/router v13.0.0
import {
  HealthMetric,
} from 'src/web/shared/types/health.types.ts';
import {
  HealthChart,
} from 'src/web/design-system/src/charts/index.ts';
import { useHealthMetrics } from 'src/web/web/src/hooks/useHealthMetrics.ts';
import { formatRelativeDate } from 'src/web/shared/utils/date.ts';
import { formatHealthMetric } from 'src/web/shared/utils/format.ts';
import HealthLayout from 'src/web/web/src/layouts/HealthLayout.tsx';
import { WEB_HEALTH_ROUTES } from 'src/web/shared/constants/routes.ts';
import { Text } from 'src/web/design-system/src/components/index.ts';
import { MetricCard } from 'src/web/design-system/src/health/index.ts';

/**
 * LD1: MetricDetail component displays detailed information for a specific health metric.
 * It fetches the metric ID from the URL and uses the useHealthMetrics hook to retrieve data.
 */
const MetricDetail = () => {
  // IE1: Access the Next.js router object
  const router = useRouter();
  // IE1: Extract the metric ID from the dynamic route
  const { id } = router.query;

  // Check if the ID is valid before proceeding
  if (!id || typeof id !== 'string') {
    return <div>Invalid metric ID</div>;
  }

  // IE1: Fetch health metrics data using the useHealthMetrics hook
  const { loading, error, metrics } = useHealthMetrics(id);

  // Find the specific metric based on the ID
  const metric = metrics.find((m) => m.id === id);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Handle case where metric is not found
  if (!metric) {
    return <div>Metric not found</div>;
  }

  // IE1: Format the metric value and timestamp
  const formattedValue = formatHealthMetric(metric.value, metric.type, metric.unit);
  const formattedDate = formatRelativeDate(metric.timestamp);

  // LD1: Render the metric details
  return (
    <HealthLayout>
      <div>
        <Text as="h1" fontSize="2xl" fontWeight="bold">
          {metric.type} Details
        </Text>
        <MetricCard
          metricName={metric.type}
          value={metric.value}
          unit={metric.unit}
          trend={metric.source}
          journey="health"
        />
        <Text>Value: {formattedValue}</Text>
        <Text>Last Updated: {formattedDate}</Text>
        <HealthChart
          type="line"
          data={[metric]}
          xAxisKey="timestamp"
          yAxisKey="value"
          xAxisLabel="Time"
          yAxisLabel={metric.type}
          journey="health"
        />
      </div>
    </HealthLayout>
  );
};

export default MetricDetail;