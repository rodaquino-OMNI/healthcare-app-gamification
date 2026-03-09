/**
 * @file LineChart index
 *
 * This file exports the LineChart component and its props interface from
 * the design system's charts module. The LineChart is used for visualizing
 * time-series data, particularly for health metrics, treatment progress,
 * and other trend-based information across all journeys.
 *
 * @packageVersion 1.0.0
 */

import LineChart, { type LineChartProps } from './LineChart';

// Export the LineChart props interface for type checking and documentation
export type { LineChartProps };

// Export the LineChart component as the default export
export default LineChart;
