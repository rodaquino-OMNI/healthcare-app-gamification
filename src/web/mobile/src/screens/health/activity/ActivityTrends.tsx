import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../hooks/useTheme';

/**
 * Period selector options.
 */
type TrendPeriod = '7d' | '30d';

/**
 * Daily activity data point for the chart.
 */
interface DailyData {
    id: string;
    label: string;
    steps: number;
    calories: number;
}

/**
 * Summary stat for trends display.
 */
interface TrendStat {
    id: string;
    labelKey: string;
    value: string;
    color: string;
}

/**
 * Monthly comparison metric.
 */
interface MonthComparison {
    id: string;
    labelKey: string;
    thisMonth: string;
    lastMonth: string;
    trend: 'up' | 'down';
}

/**
 * Generate mock data for 7 days.
 */
const generate7DayData = (): DailyData[] => [
    { id: 'd-1', label: 'M', steps: 8200, calories: 320 },
    { id: 'd-2', label: 'T', steps: 10500, calories: 410 },
    { id: 'd-3', label: 'W', steps: 6100, calories: 250 },
    { id: 'd-4', label: 'T', steps: 12300, calories: 480 },
    { id: 'd-5', label: 'F', steps: 7800, calories: 305 },
    { id: 'd-6', label: 'S', steps: 14200, calories: 550 },
    { id: 'd-7', label: 'S', steps: 9500, calories: 370 },
];

/**
 * Generate mock data for 30 days.
 */
const generate30DayData = (): DailyData[] =>
    Array.from({ length: 30 }, (_, i) => ({
        id: `d-${i + 1}`,
        label: `${i + 1}`,
        steps: 4000 + Math.floor(Math.random() * 12000),
        calories: 150 + Math.floor(Math.random() * 500),
    }));

const MOCK_MONTH_COMPARISONS: MonthComparison[] = [
    {
        id: 'cmp-steps',
        labelKey: 'journeys.health.activity.trends.totalSteps',
        thisMonth: '245,800',
        lastMonth: '218,400',
        trend: 'up',
    },
    {
        id: 'cmp-calories',
        labelKey: 'journeys.health.activity.trends.totalCalories',
        thisMonth: '9,620',
        lastMonth: '10,150',
        trend: 'down',
    },
    {
        id: 'cmp-active',
        labelKey: 'journeys.health.activity.trends.activeDaysLabel',
        thisMonth: '22',
        lastMonth: '19',
        trend: 'up',
    },
    {
        id: 'cmp-distance',
        labelKey: 'journeys.health.activity.trends.totalDistance',
        thisMonth: '187 km',
        lastMonth: '165 km',
        trend: 'up',
    },
];

const MAX_BAR_HEIGHT = 80;
const MAX_STEPS = 16000;

/**
 * ActivityTrends displays activity trend charts with period selection,
 * summary statistics, and monthly comparison data.
 */
export const ActivityTrends: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const _theme = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState<TrendPeriod>('7d');

    const chartData = useMemo(
        () => (selectedPeriod === '7d' ? generate7DayData() : generate30DayData()),
        [selectedPeriod]
    );

    const avgSteps = useMemo(() => {
        const total = chartData.reduce((sum, d) => sum + d.steps, 0);
        return Math.round(total / chartData.length).toLocaleString();
    }, [chartData]);

    const avgCalories = useMemo(() => {
        const total = chartData.reduce((sum, d) => sum + d.calories, 0);
        return Math.round(total / chartData.length).toLocaleString();
    }, [chartData]);

    const bestDay = useMemo(() => {
        const best = chartData.reduce((max, d) => (d.steps > max.steps ? d : max), chartData[0]);
        return best.steps.toLocaleString();
    }, [chartData]);

    const activeDays = useMemo(() => {
        const active = chartData.filter((d) => d.steps >= 8000);
        return `${active.length}`;
    }, [chartData]);

    const trendStats: TrendStat[] = useMemo(
        () => [
            {
                id: 'avg-steps',
                labelKey: 'journeys.health.activity.trends.avgSteps',
                value: avgSteps,
                color: colors.journeys.health.primary,
            },
            {
                id: 'avg-cal',
                labelKey: 'journeys.health.activity.trends.avgCalories',
                value: avgCalories,
                color: colors.journeys.health.primary,
            },
            {
                id: 'best-day',
                labelKey: 'journeys.health.activity.trends.bestDay',
                value: bestDay,
                color: colors.semantic.success,
            },
            {
                id: 'active-days',
                labelKey: 'journeys.health.activity.trends.activeDays',
                value: activeDays,
                color: colors.semantic.info,
            },
        ],
        [avgSteps, avgCalories, bestDay, activeDays]
    );

    const handlePeriodChange = useCallback((period: TrendPeriod) => {
        setSelectedPeriod(period);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Ionicons name="chevron-back" size={24} color={colors.journeys.health.primary} />
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.activity.trends.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    {(['7d', '30d'] as TrendPeriod[]).map((period) => (
                        <Touchable
                            key={period}
                            onPress={() => handlePeriodChange(period)}
                            accessibilityLabel={t('journeys.health.activity.trends.periodOption', { period })}
                            accessibilityRole="button"
                            testID={`activity-trends-period-${period}`}
                            style={[styles.periodOption, selectedPeriod === period && styles.periodOptionActive]}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={selectedPeriod === period ? 'semiBold' : 'regular'}
                                color={selectedPeriod === period ? colors.journeys.health.primary : colors.gray[50]}
                            >
                                {period === '7d'
                                    ? t('journeys.health.activity.trends.sevenDays')
                                    : t('journeys.health.activity.trends.thirtyDays')}
                            </Text>
                        </Touchable>
                    ))}
                </View>

                {/* Bar Chart */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.trends.stepsOverTime')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.chartContainer} testID="activity-trends-chart">
                            {chartData.map((d) => {
                                const barHeight = (d.steps / MAX_STEPS) * MAX_BAR_HEIGHT;
                                return (
                                    <View key={d.id} style={styles.chartBarWrapper}>
                                        <View
                                            style={[
                                                styles.chartBar,
                                                {
                                                    height: barHeight,
                                                    backgroundColor: colors.journeys.health.primary,
                                                },
                                            ]}
                                        />
                                        {selectedPeriod === '7d' && (
                                            <Text fontSize="xs" color={colors.gray[50]}>
                                                {d.label}
                                            </Text>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </Card>
                </View>

                {/* Summary Stats Grid */}
                <View style={styles.sectionContainer} testID="activity-trends-summary">
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.trends.summary')}
                    </Text>
                    <View style={styles.statsGrid}>
                        {trendStats.map((stat) => (
                            <Card key={stat.id} journey="health" elevation="sm" padding="md">
                                <View style={styles.statItem}>
                                    <Text fontSize="xs" color={colors.gray[50]}>
                                        {t(stat.labelKey)}
                                    </Text>
                                    <Text fontSize="xl" fontWeight="bold" color={stat.color}>
                                        {stat.value}
                                    </Text>
                                </View>
                            </Card>
                        ))}
                    </View>
                </View>

                {/* Monthly Comparison */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.trends.monthlyComparison')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        {MOCK_MONTH_COMPARISONS.map((cmp, index) => (
                            <View key={cmp.id}>
                                <View style={styles.comparisonRow}>
                                    <View style={styles.comparisonLabel}>
                                        <Text fontSize="sm" color={colors.gray[50]}>
                                            {t(cmp.labelKey)}
                                        </Text>
                                    </View>
                                    <View style={styles.comparisonValues}>
                                        <Text fontSize="sm" fontWeight="semiBold">
                                            {cmp.thisMonth}
                                        </Text>
                                        <Ionicons
                                            name={cmp.trend === 'up' ? 'trending-up-outline' : 'trending-down-outline'}
                                            size={16}
                                            color={
                                                cmp.trend === 'up' ? colors.semantic.success : colors.semantic.warning
                                            }
                                        />
                                        <Text fontSize="xs" color={colors.gray[40]}>
                                            {cmp.lastMonth}
                                        </Text>
                                    </View>
                                </View>
                                {index < MOCK_MONTH_COMPARISONS.length - 1 && <View style={styles.divider} />}
                            </View>
                        ))}
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.health.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues['3xl'],
        paddingBottom: spacingValues.sm,
    },
    headerSpacer: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    periodSelector: {
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[20],
        overflow: 'hidden',
        marginTop: spacingValues.sm,
    },
    periodOption: {
        flex: 1,
        paddingVertical: spacingValues.sm,
        alignItems: 'center',
        backgroundColor: colors.gray[0],
    },
    periodOptionActive: {
        backgroundColor: colors.journeys.health.background,
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: MAX_BAR_HEIGHT + 20,
        paddingTop: spacingValues.xs,
    },
    chartBarWrapper: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
        flex: 1,
    },
    chartBar: {
        width: 12,
        borderRadius: 4,
        minWidth: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacingValues.sm,
    },
    statItem: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    comparisonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues.sm,
    },
    comparisonLabel: {
        flex: 1,
    },
    comparisonValues: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.xs,
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[10],
    },
});

export default ActivityTrends;
