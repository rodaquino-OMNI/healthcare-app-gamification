/**
 * @file src/web/design-system/src/health/index.ts
 * @fileOverview Exports all health-related components from the design system.
 */

import { DeviceCard } from './DeviceCard';
import GoalCard, { type GoalCardProps } from './GoalCard';
import HealthChart from './HealthChart';
import { MetricCard } from './MetricCard';

export {
    DeviceCard, // Export the DeviceCard component
    GoalCard, // Export the GoalCard component
    HealthChart, // Export the HealthChart component
    MetricCard, // Export the MetricCard component
};

export type { GoalCardProps }; // Export the GoalCardProps interface
