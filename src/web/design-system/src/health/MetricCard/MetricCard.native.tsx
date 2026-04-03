import React from 'react';
import { View } from 'react-native';

import type { MetricCardProps } from './MetricCard';
import { Badge } from '../../components/Badge/Badge';
import { Card } from '../../components/Card/Card';
import { Icon } from '../../primitives/Icon/Icon';
import { Text } from '../../primitives/Text/Text';
import { colors } from '../../tokens/colors';
import { sizingValues } from '../../tokens/sizing';
import { spacingValues } from '../../tokens/spacing';

const getMetricIcon = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('heart') || n.includes('pulse')) {
        return 'heart';
    }
    if (n.includes('blood pressure')) {
        return 'pulse';
    }
    if (n.includes('weight')) {
        return 'weight';
    }
    if (n.includes('sleep')) {
        return 'sleep';
    }
    if (n.includes('steps') || n.includes('walk')) {
        return 'steps';
    }
    if (n.includes('glucose')) {
        return 'glucose';
    }
    return 'pulse';
};

const getTrendIcon = (trend?: string): { icon: string; color: string } => {
    if (!trend) {
        return { icon: '', color: '' };
    }
    const t = trend.toLowerCase();
    if (t.includes('up') || t.includes('increase')) {
        return { icon: 'arrow-forward', color: colors.semantic.warning };
    }
    if (t.includes('down') || t.includes('decrease')) {
        return { icon: 'arrow-back', color: colors.semantic.info };
    }
    if (t.includes('stable') || t.includes('normal')) {
        return { icon: 'check', color: colors.semantic.success };
    }
    return { icon: 'info', color: colors.neutral.gray600 };
};

export const MetricCard: React.FC<MetricCardProps> = ({
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

    const hasAchievement =
        trend?.toLowerCase().includes('record') ||
        trend?.toLowerCase().includes('goal') ||
        trend?.toLowerCase().includes('milestone');

    const mockAchievement = hasAchievement
        ? {
              id: `${metricName.toLowerCase().replace(/\s/g, '-')}-achievement`,
              title: `${metricName} Achievement`,
              description: `Reached an achievement in ${metricName.toLowerCase()}`,
              icon: metricIcon,
              progress: 100,
              total: 100,
              unlocked: true,
              journey,
          }
        : undefined;

    return (
        <Card
            journey={journey}
            elevation="sm"
            onPress={onPress}
            interactive={!!onPress}
            padding="md"
            accessibilityLabel={`${metricName}: ${value} ${unit}${trend ? `, trend: ${trend}` : ''}`}
            testID="metric-card"
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: spacingValues.sm,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacingValues.xs }}>
                    <Icon name={metricIcon} color={journeyColor.primary} size={sizingValues.icon.md} />
                    <Text fontWeight="medium" color="gray900">
                        {metricName}
                    </Text>
                </View>
                {mockAchievement && (
                    <Badge variant="status" status="success" testID="metric-achievement">
                        <Text fontSize="xs" color={colors.semantic.success}>
                            {mockAchievement.title}
                        </Text>
                    </Badge>
                )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: trend ? spacingValues.sm : 0 }}>
                <Text fontSize="2xl" fontWeight="bold" color="gray900">
                    {value}
                </Text>
                <Text fontSize="lg" color="gray600" style={{ marginLeft: spacingValues.xs }}>
                    {unit}
                </Text>
            </View>

            {trend && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacingValues.xs }}>
                    {trendInfo.icon ? (
                        <Icon name={trendInfo.icon} color={trendInfo.color} size={sizingValues.icon.xs} />
                    ) : null}
                    <Text fontSize="sm" color={trendInfo.color || colors.neutral.gray600}>
                        {trend}
                    </Text>
                </View>
            )}

            {/* HealthChart requires web-only chart libs; omitted on native.
           TODO: Create HealthChart.native.tsx using victory-native when needed. */}
        </Card>
    );
};

export default MetricCard;
