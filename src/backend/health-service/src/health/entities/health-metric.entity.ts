/* eslint-disable */
import { MetricType, MetricSource } from '../types/health.types';

/**
 * Represents a health metric recorded for a user.
 * This entity stores individual health measurements such as heart rate,
 * blood pressure, blood glucose, steps, etc.
 *
 * Addresses requirement F-101-RQ-001: Defines the data structure for storing
 * and displaying key health metrics with trends and gamification indicators.
 */
export class HealthMetric {
    /**
     * Unique identifier for the health metric record
     */
    id!: string;

    /**
     * ID of the user this metric belongs to
     */
    userId!: string;

    /**
     * Type of health metric (e.g., HEART_RATE, BLOOD_PRESSURE, etc.)
     */
    type!: MetricType;

    /**
     * Numerical value of the metric
     */
    value!: number;

    /**
     * Unit of measurement (e.g., 'bpm', 'mg/dL', etc.)
     */
    unit!: string;

    /**
     * Timestamp when the metric was recorded
     */
    timestamp!: Date;

    /**
     * Source of the metric data (e.g., MANUAL_ENTRY, WEARABLE_DEVICE, etc.)
     */
    source?: MetricSource;

    /**
     * Optional additional information or comments
     */
    notes?: string;

    /**
     * Percentage change from previous measurement, if available
     */
    trend?: number;

    /**
     * Indicates if the value is outside normal/healthy range
     */
    isAbnormal?: boolean;

    /**
     * Additional metadata for the metric
     */
    metadata?: Record<string, unknown>;

    /**
     * Created timestamp
     */
    createdAt!: Date;

    /**
     * Last updated timestamp
     */
    updatedAt!: Date;
}
