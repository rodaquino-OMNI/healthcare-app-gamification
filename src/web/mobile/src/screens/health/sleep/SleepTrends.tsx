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
 * Sleep stage distribution data.
 */
interface SleepStage {
    id: string;
    labelKey: string;
    percentage: number;
    color: string;
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
 * Daily sleep data point for the chart.
 */
interface DailyData {
    id: string;
    label: string;
    hours: number;
    score: number;
}

/**
 * Generate mock data for 7 or 30 days.
 */
const generate7DayData = (): DailyData[] => [
    { id: 'd-1', label: 'M', hours: 7.2, score: 78 },
    { id: 'd-2', label: 'T', hours: 7.8, score: 82 },
    { id: 'd-3', label: 'W', hours: 6.0, score: 65 },
    { id: 'd-4', label: 'T', hours: 8.5, score: 91 },
    { id: 'd-5', label: 'F', hours: 6.8, score: 73 },
    { id: 'd-6', label: 'S', hours: 8.0, score: 88 },
    { id: 'd-7', label: 'S', hours: 7.5, score: 85 },
];

const generate30DayData = (): DailyData[] =>
    Array.from({ length: 30 }, (_, i) => ({
        id: `d-${i + 1}`,
        label: `${i + 1}`,
        hours: 5.5 + Math.random() * 3.5,
        score: 50 + Math.floor(Math.random() * 45),
    }));

const SLEEP_STAGES: SleepStage[] = [
    {
        id: 'deep',
        labelKey: 'journeys.health.sleep.trends.deep',
        percentage: 25,
        color: colors.journeys.health.secondary,
    },
    {
        id: 'light',
        labelKey: 'journeys.health.sleep.trends.light',
        percentage: 45,
        color: colors.journeys.health.primary,
    },
    { id: 'rem', labelKey: 'journeys.health.sleep.trends.rem', percentage: 20, color: colors.semantic.info },
    { id: 'awake', labelKey: 'journeys.health.sleep.trends.awake', percentage: 10, color: colors.semantic.warning },
];

const MAX_BAR_HEIGHT = 80;
const MAX_HOURS = 10;

/**
 * SleepTrends displays sleep trend charts with period selection,
 * summary statistics, and sleep stage distribution.
 */
export const SleepTrends: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const _theme = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState<TrendPeriod>('7d');

    const chartData = useMemo(
        () => (selectedPeriod === '7d' ? generate7DayData() : generate30DayData()),
        [selectedPeriod]
    );

    const avgHours = useMemo(() => {
        const total = chartData.reduce((sum, d) => sum + d.hours, 0);
        return (total / chartData.length).toFixed(1);
    }, [chartData]);

    const avgScore = useMemo(() => {
        const total = chartData.reduce((sum, d) => sum + d.score, 0);
        return Math.round(total / chartData.length);
    }, [chartData]);

    const bestNight = useMemo(() => {
        const best = chartData.reduce((max, d) => (d.score > max.score ? d : max), chartData[0]);
        return `${best.hours.toFixed(1)}h`;
    }, [chartData]);

    const worstNight = useMemo(() => {
        const worst = chartData.reduce((min, d) => (d.score < min.score ? d : min), chartData[0]);
        return `${worst.hours.toFixed(1)}h`;
    }, [chartData]);

    const trendStats: TrendStat[] = useMemo(
        () => [
            {
                id: 'avg-time',
                labelKey: 'journeys.health.sleep.trends.avgSleepTime',
                value: `${avgHours}h`,
                color: colors.journeys.health.primary,
            },
            {
                id: 'avg-score',
                labelKey: 'journeys.health.sleep.trends.avgScore',
                value: `${avgScore}`,
                color: colors.journeys.health.primary,
            },
            {
                id: 'best',
                labelKey: 'journeys.health.sleep.trends.bestNight',
                value: bestNight,
                color: colors.semantic.success,
            },
            {
                id: 'worst',
                labelKey: 'journeys.health.sleep.trends.worstNight',
                value: worstNight,
                color: colors.semantic.warning,
            },
        ],
        [avgHours, avgScore, bestNight, worstNight]
    );

    const handlePeriodChange = useCallback((period: TrendPeriod) => {
        setSelectedPeriod(period);
    }, []);

    const totalStageWidth = useMemo(() => SLEEP_STAGES.reduce((sum, s) => sum + s.percentage, 0), []);

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
                    {t('journeys.health.sleep.trends.title')}
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
                            accessibilityLabel={t('journeys.health.sleep.trends.periodOption', { period })}
                            accessibilityRole="button"
                            testID={`sleep-trends-period-${period}`}
                            style={{
                                ...styles.periodOption,
                                ...(selectedPeriod === period ? styles.periodOptionActive : {}),
                            }}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={selectedPeriod === period ? 'semiBold' : 'regular'}
                                color={selectedPeriod === period ? colors.journeys.health.primary : colors.gray[50]}
                            >
                                {period === '7d'
                                    ? t('journeys.health.sleep.trends.sevenDays')
                                    : t('journeys.health.sleep.trends.thirtyDays')}
                            </Text>
                        </Touchable>
                    ))}
                </View>

                {/* Bar Chart */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.trends.sleepDuration')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.chartContainer} testID="sleep-trends-chart">
                            {chartData.map((d) => {
                                const barHeight = (d.hours / MAX_HOURS) * MAX_BAR_HEIGHT;
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
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.trends.summary')}
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

                {/* Sleep Stage Distribution */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.trends.stageDistribution')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        {/* Stacked Horizontal Bar */}
                        <View style={styles.stackedBar}>
                            {SLEEP_STAGES.map((stage) => (
                                <View
                                    key={stage.id}
                                    style={[
                                        styles.stackedSegment,
                                        {
                                            flex: stage.percentage / totalStageWidth,
                                            backgroundColor: stage.color,
                                        },
                                    ]}
                                />
                            ))}
                        </View>

                        {/* Legend */}
                        <View style={styles.stageLegend}>
                            {SLEEP_STAGES.map((stage) => (
                                <View key={stage.id} style={styles.stageLegendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: stage.color }]} />
                                    <Text fontSize="xs" color={colors.gray[60]}>
                                        {t(stage.labelKey)}
                                    </Text>
                                    <Text fontSize="xs" fontWeight="semiBold" color={colors.gray[60]}>
                                        {stage.percentage}%
                                    </Text>
                                </View>
                            ))}
                        </View>
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
    stackedBar: {
        flexDirection: 'row',
        height: 24,
        borderRadius: 12,
        overflow: 'hidden',
    },
    stackedSegment: {
        height: 24,
    },
    stageLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: spacingValues.md,
        gap: spacingValues.md,
    },
    stageLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues['3xs'],
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});

export default SleepTrends;
