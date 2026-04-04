import { HealthChart } from 'design-system/charts/index';
import { Text } from 'design-system/components/index';
import { MetricCard } from 'design-system/health/index';
import type { GetStaticPaths } from 'next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HealthMetric } from 'shared/types/health.types';
import { formatRelativeDate } from 'shared/utils/date';
import { formatHealthMetric } from 'shared/utils/format';

import { useHealthMetrics } from '@/hooks/useHealthMetrics';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter'; // next/router v13.0.0
import HealthLayout from '@/layouts/HealthLayout';

/**
 * LD1: MetricDetail component displays detailed information for a specific health metric.
 * It fetches the metric ID from the URL and uses the useHealthMetrics hook to retrieve data.
 */
const MetricDetail: React.FC = () => {
    const { t } = useTranslation();
    // IE1: Access the Next.js router object
    const router = useRouter();
    // IE1: Extract the metric ID from the dynamic route
    const { id } = router.query;
    const metricId = typeof id === 'string' ? id : '';

    // IE1: Fetch health metrics data using the useHealthMetrics hook
    const { loading, error, metrics } = useHealthMetrics(metricId);

    // Check if the ID is valid before proceeding
    if (!metricId) {
        return <div>{t('common.error')}</div>;
    }

    // Find the specific metric based on the ID
    const metric = metrics.find((m: HealthMetric) => m.id === metricId);

    // Handle loading state
    if (loading) {
        return <div>{t('common.loading')}</div>;
    }

    // Handle error state
    if (error) {
        return <div>{t('common.error')}</div>;
    }

    // Handle case where metric is not found
    if (!metric) {
        return <div>{t('common.error')}</div>;
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
                    data={[metric as unknown as Record<string, unknown>]}
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

export const getStaticPaths: GetStaticPaths = () => ({
    paths: [],
    fallback: 'blocking' as const,
});

export const getStaticProps = () => ({ props: {} });

export default MetricDetail;
