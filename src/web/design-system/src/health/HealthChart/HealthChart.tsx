import React from 'react';

import { BarChart } from '../../charts/BarChart/BarChart';
import { LineChart as LineChartComponent } from '../../charts/LineChart/LineChart';
import { RadialChart } from '../../charts/RadialChart/RadialChart';
import { Box } from '../../primitives/Box/Box';
import { Text } from '../../primitives/Text/Text';
import { colors } from '../../tokens/colors';

// Local type stub for HealthMetric (shared package not available at build time)
interface HealthMetric {
    id: string;
    type: string;
    value: number;
    unit: string;
    timestamp: string;
    journey?: 'health' | 'care' | 'plan';
}

/**
 * Props interface for the HealthChart component.
 */
export interface HealthChartProps {
    /**
     * The type of chart to render (line, bar, or radial).
     */
    type: 'line' | 'bar' | 'radial';

    /**
     * The data to display in the chart.
     */
    data: HealthMetric[];

    /**
     * The key in the data for the x-axis values.
     */
    xAxisKey: string;

    /**
     * The key in the data for the y-axis values.
     */
    yAxisKey: string;

    /**
     * The label for the x-axis.
     */
    xAxisLabel?: string;

    /**
     * The label for the y-axis.
     */
    yAxisLabel?: string;

    /**
     * The color of the line (for line charts).
     */
    lineColor?: string;

    /**
     * The journey context for theming the chart.
     */
    journey?: 'health' | 'care' | 'plan';
}

/**
 * HealthChart is a reusable component for rendering various types of health charts
 * in the AUSTA SuperApp. It supports line, bar, and radial chart types with
 * journey-specific theming.
 *
 * @example
 * ```jsx
 * <HealthChart
 *   type="line"
 *   data={healthMetrics}
 *   xAxisKey="timestamp"
 *   yAxisKey="value"
 *   xAxisLabel="Time"
 *   yAxisLabel="Heart Rate (BPM)"
 *   journey="health"
 * />
 * ```
 */
export const HealthChart: React.FC<HealthChartProps> = ({
    type,
    data,
    xAxisKey,
    yAxisKey,
    xAxisLabel = '',
    yAxisLabel = '',
    lineColor,
    journey = 'health',
}) => {
    // Handle empty data case
    if (!data || data.length === 0) {
        return (
            <Box
                padding="md"
                backgroundColor="gray100"
                borderRadius="md"
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
                data-testid="health-chart-empty"
            >
                <Text color="gray600">No data available</Text>
            </Box>
        );
    }

    // Build accessible description
    const chartDescription = `${type} chart showing ${yAxisLabel || 'data'} over ${xAxisLabel || 'time'}`;

    // Render the appropriate chart based on type
    switch (type) {
        case 'line':
            return (
                <Box role="figure" aria-label={chartDescription}>
                    <LineChartComponent
                        data={data as unknown as Array<Record<string, unknown>>}
                        xAxisKey={xAxisKey}
                        yAxisKey={yAxisKey}
                        xAxisLabel={xAxisLabel}
                        yAxisLabel={yAxisLabel}
                        lineColor={lineColor}
                        journey={journey}
                    />
                </Box>
            );

        case 'bar': {
            // Transform data for BarChart
            const values = data.map((item) => Number(item[yAxisKey as keyof HealthMetric]));
            const labels = data.map((item) => String(item[xAxisKey as keyof HealthMetric]));
            const journeyColor = colors.journeys[journey].primary;

            return (
                <Box role="figure" aria-label={chartDescription}>
                    <BarChart
                        data={values}
                        labels={labels}
                        colors={[lineColor || journeyColor]}
                        journey={journey}
                        title={`${yAxisLabel || 'Value'} by ${xAxisLabel || 'Category'}`}
                    />
                </Box>
            );
        }

        case 'radial': {
            // Transform data for RadialChart
            const pieData = data.map((item) => ({
                x: String(item[xAxisKey as keyof HealthMetric]),
                y: Number(item[yAxisKey as keyof HealthMetric]),
            }));

            return (
                <Box role="figure" aria-label={chartDescription}>
                    <RadialChart data={pieData} journey={journey} labelType="percentage" />
                </Box>
            );
        }

        default:
            // This should never happen due to TypeScript, but added for safety
            return (
                <Box
                    padding="md"
                    backgroundColor="gray100"
                    borderRadius="md"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="200px"
                    data-testid="health-chart-error"
                >
                    <Text color="gray600">Invalid chart type</Text>
                </Box>
            );
    }
};

export default HealthChart;
