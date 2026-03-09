/**
 * Charts module for the AUSTA SuperApp design system.
 *
 * This module provides reusable chart components for visualizing data across all journeys,
 * with particular focus on health metrics, trends, and analytics. The components support
 * journey-specific theming and responsive design.
 *
 * @packageDocumentation
 */

// Export BarChart and its props
export { BarChart } from './BarChart';
export type { BarChartProps } from './BarChart';

// Import and re-export LineChart and its props
import LineChart, { type LineChartProps } from './LineChart';
export type { LineChartProps };
export { LineChart };

// Export RadialChart and its props
export { RadialChart } from './RadialChart';
export type { RadialChartProps } from './RadialChart';
export { DonutChart } from './DonutChart';
export type { DonutChartProps } from './DonutChart';

// Re-export HealthChart from health module for consumers that import from charts/index
export { HealthChart } from '../health/HealthChart';
export type { HealthChartProps } from '../health/HealthChart';
