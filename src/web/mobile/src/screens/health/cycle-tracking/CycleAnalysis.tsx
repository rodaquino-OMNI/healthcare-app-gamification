import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';

import { ROUTES } from '../../../constants/routes';

/**
 * Regularity classification thresholds.
 */
type RegularityLevel = 'regular' | 'somewhat_irregular' | 'irregular';

/**
 * Cycle statistics data.
 */
interface CycleStats {
    averageCycleLength: number;
    averagePeriodDuration: number;
    longestCycle: number;
    shortestCycle: number;
    regularityScore: number;
    totalCyclesTracked: number;
}

/**
 * Distribution bucket for cycle length chart.
 */
interface DistributionBucket {
    id: string;
    range: string;
    count: number;
    percentage: number;
}

/**
 * Monthly comparison entry.
 */
interface MonthComparison {
    id: string;
    month: string;
    cycleLength: number;
    periodDuration: number;
}

const MOCK_STATS: CycleStats = {
    averageCycleLength: 28,
    averagePeriodDuration: 5,
    longestCycle: 32,
    shortestCycle: 25,
    regularityScore: 82,
    totalCyclesTracked: 12,
};

const MOCK_DISTRIBUTION: DistributionBucket[] = [
    { id: 'dist-1', range: '25-26', count: 2, percentage: 17 },
    { id: 'dist-2', range: '27-28', count: 6, percentage: 50 },
    { id: 'dist-3', range: '29-30', count: 3, percentage: 25 },
    { id: 'dist-4', range: '31-32', count: 1, percentage: 8 },
];

const MOCK_MONTHLY: MonthComparison[] = [
    { id: 'month-1', month: 'Sep', cycleLength: 27, periodDuration: 5 },
    { id: 'month-2', month: 'Oct', cycleLength: 28, periodDuration: 4 },
    { id: 'month-3', month: 'Nov', cycleLength: 30, periodDuration: 5 },
    { id: 'month-4', month: 'Dec', cycleLength: 28, periodDuration: 5 },
    { id: 'month-5', month: 'Jan', cycleLength: 25, periodDuration: 6 },
    { id: 'month-6', month: 'Feb', cycleLength: 29, periodDuration: 5 },
];

const MAX_BAR_WIDTH = 200;

/**
 * Classify regularity based on score percentage.
 */
const getRegularityLevel = (score: number): RegularityLevel => {
    if (score >= 80) {
        return 'regular';
    }
    if (score >= 50) {
        return 'somewhat_irregular';
    }
    return 'irregular';
};

const getRegularityColor = (level: RegularityLevel): string => {
    switch (level) {
        case 'regular':
            return colors.semantic.success;
        case 'somewhat_irregular':
            return colors.semantic.warning;
        case 'irregular':
            return colors.semantic.error;
    }
};

/**
 * CycleAnalysis displays cycle statistics: average length, regularity metrics,
 * cycle length distribution, and month-over-month comparisons.
 */
export const CycleAnalysis: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const [selectedPeriod, setSelectedPeriod] = useState<'3m' | '6m' | '12m'>('6m');

    const stats = useMemo(() => MOCK_STATS, []);
    const regularityLevel = useMemo(() => getRegularityLevel(stats.regularityScore), [stats]);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleExport = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_CYCLE_EXPORT_REPORT);
    }, [navigation]);

    const handlePeriodChange = useCallback((period: '3m' | '6m' | '12m') => {
        setSelectedPeriod(period);
    }, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={handleGoBack}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.cycle.analysis.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                testID="cycle-analysis-scroll"
            >
                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    {(['3m', '6m', '12m'] as const).map((period) => (
                        <Touchable
                            key={period}
                            onPress={() => handlePeriodChange(period)}
                            accessibilityLabel={t('journeys.health.cycle.analysis.periodOption', { period })}
                            accessibilityRole="button"
                            testID={`period-${period}`}
                            style={[styles.periodOption, selectedPeriod === period && styles.periodOptionActive] as any}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={selectedPeriod === period ? 'semiBold' : 'regular'}
                                color={selectedPeriod === period ? colors.journeys.health.primary : colors.gray[50]}
                            >
                                {period.toUpperCase()}
                            </Text>
                        </Touchable>
                    ))}
                </View>

                {/* Key Metrics */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.analysis.keyMetrics')}
                    </Text>
                    <View style={styles.metricsGrid}>
                        <Card journey="health" elevation="sm" padding="md">
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.cycle.analysis.avgCycleLength')}
                            </Text>
                            <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                                {stats.averageCycleLength}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {t('journeys.health.cycle.analysis.days')}
                            </Text>
                        </Card>
                        <Card journey="health" elevation="sm" padding="md">
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.cycle.analysis.avgPeriodDuration')}
                            </Text>
                            <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                                {stats.averagePeriodDuration}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {t('journeys.health.cycle.analysis.days')}
                            </Text>
                        </Card>
                        <Card journey="health" elevation="sm" padding="md">
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.cycle.analysis.longestCycle')}
                            </Text>
                            <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.secondary}>
                                {stats.longestCycle}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {t('journeys.health.cycle.analysis.days')}
                            </Text>
                        </Card>
                        <Card journey="health" elevation="sm" padding="md">
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.cycle.analysis.shortestCycle')}
                            </Text>
                            <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.secondary}>
                                {stats.shortestCycle}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {t('journeys.health.cycle.analysis.days')}
                            </Text>
                        </Card>
                    </View>
                </View>

                {/* Regularity Score */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.analysis.regularity')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.regularityRow}>
                            <View style={styles.scoreCircle}>
                                <Text fontSize="xl" fontWeight="bold" color={getRegularityColor(regularityLevel)}>
                                    {stats.regularityScore}%
                                </Text>
                            </View>
                            <View style={styles.regularityInfo}>
                                <Text fontSize="md" fontWeight="semiBold" color={getRegularityColor(regularityLevel)}>
                                    {t(`journeys.health.cycle.analysis.${regularityLevel}`)}
                                </Text>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    {t('journeys.health.cycle.analysis.basedOn', {
                                        count: stats.totalCyclesTracked,
                                    })}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    {
                                        width: `${stats.regularityScore}%`,
                                        backgroundColor: getRegularityColor(regularityLevel),
                                    },
                                ]}
                            />
                        </View>
                    </Card>
                </View>

                {/* Cycle Length Distribution */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.analysis.distribution')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        {MOCK_DISTRIBUTION.map((bucket) => (
                            <View key={bucket.id} style={styles.distributionRow} testID={`dist-${bucket.id}`}>
                                <Text fontSize="sm" style={styles.distLabel}>
                                    {bucket.range}
                                </Text>
                                <View style={styles.barContainer}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                width: (bucket.percentage / 100) * MAX_BAR_WIDTH,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text fontSize="xs" color={colors.gray[50]} style={styles.distPercent}>
                                    {bucket.percentage}%
                                </Text>
                            </View>
                        ))}
                    </Card>
                </View>

                {/* Month-over-Month Comparison */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.analysis.monthlyComparison')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.comparisonHeader}>
                            <Text fontSize="xs" fontWeight="semiBold" color={colors.gray[50]} style={styles.compMonth}>
                                {t('journeys.health.cycle.analysis.month')}
                            </Text>
                            <Text fontSize="xs" fontWeight="semiBold" color={colors.gray[50]} style={styles.compValue}>
                                {t('journeys.health.cycle.analysis.cycleLen')}
                            </Text>
                            <Text fontSize="xs" fontWeight="semiBold" color={colors.gray[50]} style={styles.compValue}>
                                {t('journeys.health.cycle.analysis.periodLen')}
                            </Text>
                        </View>
                        {MOCK_MONTHLY.map((entry) => (
                            <View key={entry.id} style={styles.comparisonRow} testID={`month-${entry.id}`}>
                                <Text fontSize="sm" fontWeight="medium" style={styles.compMonth}>
                                    {entry.month}
                                </Text>
                                <Text fontSize="sm" style={styles.compValue}>
                                    {entry.cycleLength} {t('journeys.health.cycle.analysis.daysShort')}
                                </Text>
                                <Text fontSize="sm" style={styles.compValue}>
                                    {entry.periodDuration} {t('journeys.health.cycle.analysis.daysShort')}
                                </Text>
                            </View>
                        ))}
                    </Card>
                </View>

                {/* Export Button */}
                <View style={styles.actionsContainer}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleExport}
                        accessibilityLabel={t('journeys.health.cycle.analysis.exportReport')}
                        testID="export-report-button"
                    >
                        {t('journeys.health.cycle.analysis.exportReport')}
                    </Button>
                </View>
            </ScrollView>
        </View>
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
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacingValues.sm,
    },
    regularityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacingValues.sm,
    },
    scoreCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 3,
        borderColor: colors.gray[20],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.md,
    },
    regularityInfo: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.gray[10],
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 8,
        borderRadius: 4,
    },
    distributionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacingValues['3xs'],
    },
    distLabel: {
        width: 50,
    },
    barContainer: {
        flex: 1,
        height: 16,
        marginHorizontal: spacingValues.xs,
    },
    bar: {
        height: 16,
        borderRadius: 4,
        backgroundColor: colors.journeys.health.primary,
    },
    distPercent: {
        width: 36,
        textAlign: 'right',
    },
    comparisonHeader: {
        flexDirection: 'row',
        paddingBottom: spacingValues.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[10],
    },
    comparisonRow: {
        flexDirection: 'row',
        paddingVertical: spacingValues.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[10],
    },
    compMonth: {
        flex: 1,
    },
    compValue: {
        width: 80,
        textAlign: 'center',
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
        marginBottom: spacingValues.xl,
    },
});

export default CycleAnalysis;
