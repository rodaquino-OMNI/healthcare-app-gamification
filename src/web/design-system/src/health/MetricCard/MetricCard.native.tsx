import React from 'react';
import { View, StyleSheet } from 'react-native';

import type { MetricCardProps } from './MetricCard';
import { Card } from '../../components/Card/Card.native';
import { Icon } from '../../primitives/Icon/Icon.native';
import { Text } from '../../primitives/Text/Text.native';
import { colors } from '../../tokens/colors';
import { sizing } from '../../tokens/sizing';
import { spacingValues } from '../../tokens/spacing';

/**
 * Returns an icon name based on the metric name string.
 */
const getMetricIcon = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('heart') || lowerName.includes('pulse')) {
        return 'heart';
    } else if (lowerName.includes('blood pressure')) {
        return 'pulse';
    } else if (lowerName.includes('weight')) {
        return 'weight';
    } else if (lowerName.includes('sleep')) {
        return 'sleep';
    } else if (lowerName.includes('steps') || lowerName.includes('walk')) {
        return 'steps';
    } else if (lowerName.includes('glucose')) {
        return 'glucose';
    }
    return 'pulse';
};

/**
 * Returns the trend icon name and color based on the trend string.
 */
const getTrendIcon = (trendValue?: string): { icon: string; color: string } => {
    if (!trendValue) {
        return { icon: '', color: '' };
    }

    const lowerTrend = trendValue.toLowerCase();
    if (lowerTrend.includes('up') || lowerTrend.includes('increase')) {
        return { icon: 'arrow-forward', color: colors.semantic.warning };
    } else if (lowerTrend.includes('down') || lowerTrend.includes('decrease')) {
        return { icon: 'arrow-back', color: colors.semantic.info };
    } else if (lowerTrend.includes('stable') || lowerTrend.includes('normal')) {
        return { icon: 'check', color: colors.semantic.success };
    }

    return { icon: 'info', color: colors.neutral.gray600 };
};

/**
 * React Native implementation of MetricCard for displaying health metrics.
 * Displays a metric name, value, unit, and optional trend indicator.
 * The showChart prop is accepted but not rendered (native limitation).
 *
 * @example
 * ```tsx
 * <MetricCard
 *   metricName="Heart Rate"
 *   value={72}
 *   unit="bpm"
 *   trend="stable"
 *   journey="health"
 * />
 * ```
 */
const MetricCard: React.FC<MetricCardProps> = ({
    metricName,
    value,
    unit,
    trend,
    journey,
    showChart: _showChart = false,
    onPress,
}) => {
    const trendInfo = getTrendIcon(trend);
    const metricIcon = getMetricIcon(metricName);
    const journeyColor = colors.journeys[journey];

    const accessibilityLabel = `${metricName}: ${value} ${unit}${trend ? `, trend: ${trend}` : ''}`;

    return (
        <Card
            journey={journey}
            elevation="sm"
            onPress={onPress}
            interactive={!!onPress}
            padding="md"
            accessibilityLabel={accessibilityLabel}
            testID="metric-card"
        >
            {/* Header row: icon + metric name */}
            <View style={styles.headerRow}>
                <Icon name={metricIcon} color={journeyColor.primary} size={sizing.icon.md} accessibilityLabel="" />
                <Text fontWeight="medium" color="gray900" style={styles.metricName}>
                    {metricName}
                </Text>
            </View>

            {/* Value row: large value + unit */}
            <View style={[styles.valueRow, trend ? styles.valueRowWithMargin : undefined]}>
                <Text fontSize="2xl" fontWeight="bold" color="gray900">
                    {String(value)}
                </Text>
                <Text fontSize="lg" color="gray600" style={styles.unit}>
                    {unit}
                </Text>
            </View>

            {/* Trend row (conditional) */}
            {trend ? (
                <View style={styles.trendRow}>
                    {trendInfo.icon ? (
                        <Icon
                            name={trendInfo.icon}
                            color={trendInfo.color}
                            size={sizing.icon.xs}
                            accessibilityLabel=""
                        />
                    ) : null}
                    <Text
                        fontSize="sm"
                        color={trendInfo.color || colors.neutral.gray600}
                        style={trendInfo.icon ? styles.trendText : undefined}
                    >
                        {trend}
                    </Text>
                </View>
            ) : null}
        </Card>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacingValues.sm,
    },
    metricName: {
        marginLeft: spacingValues['3xs'],
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    valueRowWithMargin: {
        marginBottom: spacingValues.sm,
    },
    unit: {
        marginLeft: spacingValues['3xs'],
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trendText: {
        marginLeft: spacingValues['3xs'],
    },
});

export { MetricCard };
export type { MetricCardProps };
export default MetricCard;
