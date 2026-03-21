/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizingValues } from '@design-system/tokens/sizing';
import { spacingValues } from '@design-system/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';

import { ROUTES } from '../../constants/routes';
import type { WellnessNavigationProp } from '../../navigation/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MetricCard {
    id: string;
    labelKey: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    icon: string;
}

interface InsightItem {
    id: string;
    titleKey: string;
    descriptionKey: string;
    icon: string;
}

type TimePeriod = 'week' | 'month';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_METRICS: MetricCard[] = [
    {
        id: 'm-1',
        labelKey: 'journeys.health.wellness.insights.moodTrend',
        value: '7.2',
        trend: 'up',
        icon: '\u{1F60A}',
    },
    {
        id: 'm-2',
        labelKey: 'journeys.health.wellness.insights.activityScore',
        value: '85%',
        trend: 'up',
        icon: '\u{1F3C3}',
    },
    {
        id: 'm-3',
        labelKey: 'journeys.health.wellness.insights.sleepQuality',
        value: '6.8',
        trend: 'down',
        icon: '\u{1F634}',
    },
    {
        id: 'm-4',
        labelKey: 'journeys.health.wellness.insights.stressLevel',
        value: '3.1',
        trend: 'stable',
        icon: '\u{1F9D8}',
    },
];

const MOCK_INSIGHTS: InsightItem[] = [
    {
        id: 'i-1',
        titleKey: 'journeys.health.wellness.insights.moodImproved',
        descriptionKey: 'journeys.health.wellness.insights.moodImprovedDesc',
        icon: '\u{2B06}',
    },
    {
        id: 'i-2',
        titleKey: 'journeys.health.wellness.insights.sleepPatterns',
        descriptionKey: 'journeys.health.wellness.insights.sleepPatternsDesc',
        icon: '\u{1F319}',
    },
    {
        id: 'i-3',
        titleKey: 'journeys.health.wellness.insights.activityGoal',
        descriptionKey: 'journeys.health.wellness.insights.activityGoalDesc',
        icon: '\u{1F3AF}',
    },
];

const MOCK_CHART_BARS = [4, 6, 5, 7, 8, 6, 7];

const TREND_ARROWS: Record<string, string> = { up: '\u2191', down: '\u2193', stable: '\u2192' };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CompanionInsightsScreen: React.FC = () => {
    const navigation = useNavigation<WellnessNavigationProp>();
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    const [period, setPeriod] = useState<TimePeriod>('week');

    const handlePeriodChange = useCallback((newPeriod: TimePeriod) => {
        setPeriod(newPeriod);
    }, []);

    const handleGoToGoals = useCallback(() => {
        navigation.navigate(ROUTES.WELLNESS_GOALS as 'WellnessGoals');
    }, [navigation]);

    const maxBar = Math.max(...MOCK_CHART_BARS);

    return (
        <SafeAreaView style={styles.container} testID="wellness-insights-screen">
            {/* Header */}
            <View style={styles.headerBar}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    accessibilityLabel={t('common.buttons.back')}
                >
                    <Text style={styles.backArrow}>{'\u2190'}</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>{t('journeys.health.wellness.insights.title')}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Time Period Selector */}
                <View style={styles.periodContainer}>
                    {(['week', 'month'] as TimePeriod[]).map((p) => {
                        const isActive = period === p;
                        return (
                            <TouchableOpacity
                                key={p}
                                onPress={() => handlePeriodChange(p)}
                                style={[styles.periodTab, isActive && styles.periodTabActive]}
                                accessibilityLabel={t(`journeys.health.wellness.insights.period.${p}`)}
                                accessibilityState={{ selected: isActive }}
                            >
                                <Text style={[styles.periodTabText, isActive && styles.periodTabTextActive]}>
                                    {t(`journeys.health.wellness.insights.period.${p}`)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Key Metrics */}
                <View style={styles.metricsGrid}>
                    {MOCK_METRICS.map((metric) => (
                        <View key={metric.id} style={styles.metricCard}>
                            <Text style={styles.metricIcon}>{metric.icon}</Text>
                            <Text style={styles.metricValue}>{metric.value}</Text>
                            <Text style={styles.metricLabel}>{t(metric.labelKey)}</Text>
                            <Text
                                style={[
                                    styles.metricTrend,
                                    {
                                        color:
                                            metric.trend === 'up'
                                                ? colors.semantic.success
                                                : metric.trend === 'down'
                                                  ? colors.semantic.error
                                                  : colors.semantic.info,
                                    },
                                ]}
                            >
                                {TREND_ARROWS[metric.trend]}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Chart Area */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>{t('journeys.health.wellness.insights.moodOverTime')}</Text>
                    <View style={styles.chartContainer}>
                        {MOCK_CHART_BARS.map((value, index) => (
                            <View key={`bar-${index}`} style={styles.barWrapper}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: (value / maxBar) * 100,
                                            backgroundColor: colors.brand.primary,
                                        },
                                    ]}
                                />
                                <Text style={styles.barLabel}>
                                    {t(`journeys.health.wellness.insights.dayLabels.${index}`)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* AI Insights */}
                <Text style={styles.sectionTitle}>{t('journeys.health.wellness.insights.aiSummary')}</Text>
                {MOCK_INSIGHTS.map((insight) => (
                    <View key={insight.id} style={styles.insightCard}>
                        <Text style={styles.insightIcon}>{insight.icon}</Text>
                        <View style={styles.insightContent}>
                            <Text style={styles.insightTitle}>{t(insight.titleKey)}</Text>
                            <Text style={styles.insightDescription}>{t(insight.descriptionKey)}</Text>
                        </View>
                    </View>
                ))}

                {/* Goal Suggestions CTA */}
                <TouchableOpacity
                    onPress={handleGoToGoals}
                    style={styles.ctaButton}
                    accessibilityLabel={t('journeys.health.wellness.insights.viewGoals')}
                >
                    <Text style={styles.ctaText}>{t('journeys.health.wellness.insights.viewGoals')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background.subtle,
        },
        headerBar: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
            backgroundColor: colors.brand.primary,
        },
        backButton: {
            width: sizingValues.component.sm,
            height: sizingValues.component.sm,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backArrow: {
            fontSize: 20,
            color: theme.colors.text.onBrand,
            fontWeight: '600',
        },
        screenTitle: {
            flex: 1,
            fontSize: 20,
            fontWeight: '700',
            color: theme.colors.text.onBrand,
            textAlign: 'center',
        },
        headerSpacer: {
            width: sizingValues.component.sm,
        },
        scrollContent: {
            paddingHorizontal: spacingValues.md,
            paddingBottom: spacingValues['5xl'],
        },
        periodContainer: {
            flexDirection: 'row',
            marginTop: spacingValues.md,
            gap: spacingValues.xs,
        },
        periodTab: {
            flex: 1,
            paddingVertical: spacingValues.sm,
            borderRadius: borderRadiusValues.full,
            borderWidth: 1,
            borderColor: colors.brand.primary,
            alignItems: 'center',
        },
        periodTabActive: {
            backgroundColor: colors.brand.primary,
        },
        periodTabText: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.brand.primary,
        },
        periodTabTextActive: {
            color: theme.colors.text.onBrand,
        },
        metricsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: spacingValues.md,
            gap: spacingValues.xs,
        },
        metricCard: {
            width: '48%',
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.lg,
            padding: spacingValues.md,
            alignItems: 'center',
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
        },
        metricIcon: {
            fontSize: 24,
            marginBottom: spacingValues['3xs'],
        },
        metricValue: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.colors.text.default,
        },
        metricLabel: {
            fontSize: 12,
            color: theme.colors.text.muted,
            textAlign: 'center',
            marginTop: spacingValues['4xs'],
        },
        metricTrend: {
            fontSize: 16,
            fontWeight: '700',
            marginTop: spacingValues['3xs'],
        },
        chartCard: {
            marginTop: spacingValues.lg,
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.lg,
            padding: spacingValues.md,
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
        },
        chartTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text.default,
            marginBottom: spacingValues.sm,
        },
        chartContainer: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            height: 120,
            gap: spacingValues.xs,
        },
        barWrapper: {
            flex: 1,
            alignItems: 'center',
        },
        bar: {
            width: '70%',
            borderRadius: borderRadiusValues.xs,
        },
        barLabel: {
            fontSize: 10,
            color: theme.colors.text.muted,
            marginTop: spacingValues['4xs'],
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text.default,
            marginTop: spacingValues.xl,
            marginBottom: spacingValues.sm,
        },
        insightCard: {
            flexDirection: 'row',
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.lg,
            padding: spacingValues.md,
            marginBottom: spacingValues.xs,
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        insightIcon: {
            fontSize: 24,
            marginRight: spacingValues.sm,
        },
        insightContent: {
            flex: 1,
        },
        insightTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text.default,
        },
        insightDescription: {
            fontSize: 12,
            color: theme.colors.text.muted,
            marginTop: spacingValues['4xs'],
        },
        ctaButton: {
            marginTop: spacingValues.xl,
            backgroundColor: colors.brand.primary,
            borderRadius: borderRadiusValues.full,
            paddingVertical: spacingValues.sm,
            alignItems: 'center',
        },
        ctaText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text.onBrand,
        },
    });

export default CompanionInsightsScreen;
