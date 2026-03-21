/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { fontSizeValues } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { useTheme } from 'styled-components/native';

import type { HomeTabScreenNavigationProp } from '../../navigation/types';

/**
 * Category for filtering health metrics.
 */
type MetricCategory = 'all' | 'vitals' | 'activity' | 'nutrition';

/**
 * Trend direction for a health metric.
 */
type TrendDirection = 'up' | 'down' | 'stable';

/**
 * Shape of a single health metric item.
 */
interface HealthMetric {
    id: string;
    name: string;
    value: string;
    unit: string;
    trend: TrendDirection;
    category: Exclude<MetricCategory, 'all'>;
    icon: string;
}

const FILTER_TABS: { key: MetricCategory; labelKey: string }[] = [
    { key: 'all', labelKey: 'journeys.health.metrics.filterAll' },
    { key: 'vitals', labelKey: 'journeys.health.metrics.filterVitals' },
    { key: 'activity', labelKey: 'journeys.health.metrics.filterActivity' },
    { key: 'nutrition', labelKey: 'journeys.health.metrics.filterNutrition' },
];

/**
 * Mock health metric data.
 */
const MOCK_METRICS: HealthMetric[] = [
    {
        id: '1',
        name: 'Frequencia Cardiaca',
        value: '72',
        unit: 'bpm',
        trend: 'stable',
        category: 'vitals',
        icon: '\u2764\uFE0F',
    },
    {
        id: '2',
        name: 'Passos',
        value: '8.432',
        unit: 'passos',
        trend: 'up',
        category: 'activity',
        icon: '\uD83D\uDEB6',
    },
    {
        id: '3',
        name: 'Sono',
        value: '7.5',
        unit: 'horas',
        trend: 'up',
        category: 'vitals',
        icon: '\uD83C\uDF19',
    },
    {
        id: '4',
        name: 'Pressao Arterial',
        value: '120/80',
        unit: 'mmHg',
        trend: 'down',
        category: 'vitals',
        icon: '\uD83E\uDE7A',
    },
    {
        id: '5',
        name: 'Calorias',
        value: '1.850',
        unit: 'kcal',
        trend: 'stable',
        category: 'nutrition',
        icon: '\uD83D\uDD25',
    },
    {
        id: '6',
        name: 'Agua',
        value: '2.1',
        unit: 'litros',
        trend: 'up',
        category: 'nutrition',
        icon: '\uD83D\uDCA7',
    },
];

/**
 * Returns a trend indicator string and color for a given trend direction.
 */
const getTrendInfo = (trend: TrendDirection): { textKey: string; color: string } => {
    switch (trend) {
        case 'up':
            return { textKey: 'journeys.health.metrics.trendUp', color: colors.semantic.success };
        case 'down':
            return { textKey: 'journeys.health.metrics.trendDown', color: colors.semantic.error };
        case 'stable':
            return { textKey: 'journeys.health.metrics.trendStable', color: colors.gray[50] };
        default:
            return { textKey: 'journeys.health.metrics.trendStable', color: colors.gray[50] };
    }
};

/**
 * Screen component that displays all health metrics with category filtering.
 * Users can filter by vitals, activity, or nutrition categories and navigate
 * to individual metric details.
 */
export const HomeMetricsScreen: React.FC = () => {
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const { t } = useTranslation();
    const navigation = useNavigation<HomeTabScreenNavigationProp>();
    const [activeFilter, setActiveFilter] = useState<MetricCategory>('all');

    const filteredMetrics = useMemo(() => {
        if (activeFilter === 'all') {
            return MOCK_METRICS;
        }
        return MOCK_METRICS.filter((m) => m.category === activeFilter);
    }, [activeFilter]);

    const handleMetricPress = useCallback(
        (metricId: string) => {
            navigation.navigate('Health', { screen: 'HealthMetricDetail', params: { metricType: metricId } });
        },
        [navigation]
    );

    const handleAddMetric = useCallback(() => {
        navigation.navigate('Health', { screen: 'HealthAddMetric' });
    }, [navigation]);

    const renderMetricCard = useCallback(
        ({ item }: { item: HealthMetric }) => {
            const trendInfo = getTrendInfo(item.trend);
            return (
                <TouchableOpacity
                    style={styles.metricCard}
                    onPress={() => handleMetricPress(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.name}: ${item.value} ${item.unit}`}
                >
                    <View style={styles.metricColorBar} />
                    <View style={styles.metricIconArea}>
                        <Text style={styles.metricIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.metricInfo}>
                        <Text style={styles.metricName}>{item.name}</Text>
                        <View style={styles.metricValueRow}>
                            <Text style={styles.metricValue}>{item.value}</Text>
                            <Text style={styles.metricUnit}> {item.unit}</Text>
                        </View>
                        <Text style={[styles.metricTrend, { color: trendInfo.color }]}>{t(trendInfo.textKey)}</Text>
                    </View>
                </TouchableOpacity>
            );
        },
        [handleMetricPress]
    );

    const keyExtractor = useCallback((item: HealthMetric) => item.id, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.buttons.back')}
                    style={styles.backButton}
                >
                    <Text style={styles.backText}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('journeys.health.metrics.title')}</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScrollContent}
                >
                    {FILTER_TABS.map((tab) => {
                        const isActive = activeFilter === tab.key;
                        return (
                            <TouchableOpacity
                                key={tab.key}
                                style={[styles.filterPill, isActive && styles.filterPillActive]}
                                onPress={() => setActiveFilter(tab.key)}
                                accessibilityRole="tab"
                                accessibilityState={{ selected: isActive }}
                                accessibilityLabel={t(tab.labelKey)}
                            >
                                <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                                    {t(tab.labelKey)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Metrics List */}
            <FlatList
                data={filteredMetrics}
                renderItem={renderMetricCard}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{t('journeys.health.metrics.emptyCategory')}</Text>
                    </View>
                }
            />

            {/* Add Metric Button */}
            <View style={styles.addButtonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddMetric}
                    accessibilityRole="button"
                    accessibilityLabel={t('journeys.health.metrics.addMetric')}
                >
                    <Text style={styles.addButtonText}>{t('journeys.health.metrics.addMetric')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme.colors.background.default,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.default,
        },
        backButton: {
            width: spacingValues['2xl'],
            height: spacingValues['2xl'],
            alignItems: 'center',
            justifyContent: 'center',
        },
        backText: {
            fontSize: fontSizeValues.xl,
            fontWeight: '600',
            color: theme.colors.text.default,
        },
        headerTitle: {
            flex: 1,
            fontSize: fontSizeValues.lg,
            fontWeight: '700',
            color: theme.colors.text.default,
            textAlign: 'center',
        },
        headerSpacer: {
            width: spacingValues['2xl'],
        },
        filterContainer: {
            paddingVertical: spacingValues.sm,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.default,
        },
        filterScrollContent: {
            paddingHorizontal: spacingValues.md,
            gap: spacingValues.xs,
        },
        filterPill: {
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.xs,
            borderRadius: borderRadiusValues.full,
            backgroundColor: theme.colors.background.subtle,
            marginRight: spacingValues.xs,
        },
        filterPillActive: {
            backgroundColor: colors.journeys.health.primary,
        },
        filterPillText: {
            fontSize: fontSizeValues.sm,
            fontWeight: '600',
            color: theme.colors.text.muted,
        },
        filterPillTextActive: {
            color: theme.colors.text.onBrand,
        },
        listContent: {
            padding: spacingValues.md,
            paddingBottom: spacingValues['4xl'],
        },
        metricCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.md,
            marginBottom: spacingValues.sm,
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
            overflow: 'hidden',
        },
        metricColorBar: {
            width: spacingValues['3xs'],
            alignSelf: 'stretch',
            backgroundColor: colors.journeys.health.primary,
        },
        metricIconArea: {
            width: spacingValues['3xl'],
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: spacingValues.xs,
        },
        metricIcon: {
            fontSize: fontSizeValues.xl,
        },
        metricInfo: {
            flex: 1,
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues.sm,
        },
        metricName: {
            fontSize: fontSizeValues.sm,
            color: theme.colors.text.muted,
            marginBottom: spacingValues['3xs'],
        },
        metricValueRow: {
            flexDirection: 'row',
            alignItems: 'baseline',
        },
        metricValue: {
            fontSize: fontSizeValues.xl,
            fontWeight: '700',
            color: theme.colors.text.default,
        },
        metricUnit: {
            fontSize: fontSizeValues.xs,
            color: theme.colors.text.muted,
        },
        metricTrend: {
            fontSize: fontSizeValues.xs,
            fontWeight: '500',
            marginTop: spacingValues['3xs'],
        },
        emptyContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: spacingValues['4xl'],
        },
        emptyText: {
            fontSize: fontSizeValues.md,
            color: theme.colors.text.muted,
        },
        addButtonContainer: {
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.default,
        },
        addButton: {
            backgroundColor: colors.journeys.health.primary,
            borderRadius: borderRadiusValues.md,
            paddingVertical: spacingValues.sm,
            alignItems: 'center',
        },
        addButtonText: {
            fontSize: fontSizeValues.md,
            fontWeight: '700',
            color: theme.colors.text.onBrand,
        },
    });

export default HomeMetricsScreen;
