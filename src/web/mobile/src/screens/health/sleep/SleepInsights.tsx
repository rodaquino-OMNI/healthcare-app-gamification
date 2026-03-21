import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../hooks/useTheme';

/**
 * Trend direction for a sleep metric.
 */
type TrendDirection = 'improving' | 'declining' | 'stable';

/**
 * A weekly tip item.
 */
interface WeeklyTip {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    titleKey: string;
    descKey: string;
}

/**
 * A trend metric display.
 */
interface TrendMetric {
    id: string;
    labelKey: string;
    value: string;
    trend: TrendDirection;
}

/**
 * A personalized recommendation.
 */
interface Recommendation {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    titleKey: string;
    descKey: string;
}

const TREND_CONFIG: Record<TrendDirection, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
    improving: { icon: 'arrow-up-outline', color: colors.semantic.success },
    declining: { icon: 'arrow-down-outline', color: colors.semantic.error },
    stable: { icon: 'remove-outline', color: colors.semantic.info },
};

const MOCK_TIPS: WeeklyTip[] = [
    {
        id: 'tip-1',
        icon: 'moon-outline',
        titleKey: 'journeys.health.sleep.insights.tipConsistencyTitle',
        descKey: 'journeys.health.sleep.insights.tipConsistencyDesc',
    },
    {
        id: 'tip-2',
        icon: 'cafe-outline',
        titleKey: 'journeys.health.sleep.insights.tipCaffeineTitle',
        descKey: 'journeys.health.sleep.insights.tipCaffeineDesc',
    },
    {
        id: 'tip-3',
        icon: 'phone-portrait-outline',
        titleKey: 'journeys.health.sleep.insights.tipScreenTitle',
        descKey: 'journeys.health.sleep.insights.tipScreenDesc',
    },
];

const MOCK_TRENDS: TrendMetric[] = [
    { id: 'duration', labelKey: 'journeys.health.sleep.insights.trendDuration', value: '7h 30m', trend: 'improving' },
    { id: 'quality', labelKey: 'journeys.health.sleep.insights.trendQuality', value: '85%', trend: 'stable' },
    {
        id: 'consistency',
        labelKey: 'journeys.health.sleep.insights.trendConsistency',
        value: '78%',
        trend: 'declining',
    },
];

const MOCK_RECOMMENDATIONS: Recommendation[] = [
    {
        id: 'rec-1',
        icon: 'bed-outline',
        titleKey: 'journeys.health.sleep.insights.recEarlierTitle',
        descKey: 'journeys.health.sleep.insights.recEarlierDesc',
    },
    {
        id: 'rec-2',
        icon: 'fitness-outline',
        titleKey: 'journeys.health.sleep.insights.recExerciseTitle',
        descKey: 'journeys.health.sleep.insights.recExerciseDesc',
    },
    {
        id: 'rec-3',
        icon: 'thermometer-outline',
        titleKey: 'journeys.health.sleep.insights.recTempTitle',
        descKey: 'journeys.health.sleep.insights.recTempDesc',
    },
];

/**
 * SleepInsights displays weekly sleep tips, trend arrows for key metrics,
 * and personalized recommendations to improve sleep quality.
 */
export const SleepInsights: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const _theme = useTheme();
    const [expandedTip, setExpandedTip] = useState<string | null>(null);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleToggleTip = useCallback((tipId: string) => {
        setExpandedTip((prev) => (prev === tipId ? null : tipId));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
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
                    {t('journeys.health.sleep.insights.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                testID="sleep-insights-scroll"
            >
                {/* Weekly Tips */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.insights.weeklyTips')}
                    </Text>
                    {MOCK_TIPS.map((tip, index) => (
                        <Touchable
                            key={tip.id}
                            onPress={() => handleToggleTip(tip.id)}
                            accessibilityLabel={t(tip.titleKey)}
                            accessibilityRole="button"
                            testID={`sleep-insights-tip-${index}`}
                        >
                            <Card journey="health" elevation="sm" padding="md">
                                <View style={styles.tipHeader}>
                                    <View style={styles.tipIconContainer}>
                                        <Ionicons name={tip.icon} size={20} color={colors.journeys.health.primary} />
                                    </View>
                                    <Text fontSize="md" fontWeight="semiBold" style={styles.tipTitle}>
                                        {t(tip.titleKey)}
                                    </Text>
                                    <Ionicons
                                        name={expandedTip === tip.id ? 'chevron-up-outline' : 'chevron-down-outline'}
                                        size={20}
                                        color={colors.gray[40]}
                                    />
                                </View>
                                {expandedTip === tip.id && (
                                    <View style={styles.tipBody}>
                                        <Text fontSize="sm" color={colors.gray[50]}>
                                            {t(tip.descKey)}
                                        </Text>
                                        <Touchable
                                            onPress={() => {}}
                                            accessibilityLabel={t('journeys.health.sleep.insights.readMore')}
                                            accessibilityRole="button"
                                            testID={`sleep-insights-tip-read-more-${index}`}
                                        >
                                            <Text
                                                fontSize="sm"
                                                fontWeight="semiBold"
                                                color={colors.journeys.health.primary}
                                            >
                                                {t('journeys.health.sleep.insights.readMore')}
                                            </Text>
                                        </Touchable>
                                    </View>
                                )}
                            </Card>
                        </Touchable>
                    ))}
                </View>

                {/* Trend Arrows */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.insights.trends')}
                    </Text>
                    <Card journey="health" elevation="md" padding="md">
                        {MOCK_TRENDS.map((metric, index) => {
                            const trendConfig = TREND_CONFIG[metric.trend];
                            return (
                                <View key={metric.id}>
                                    <View style={styles.trendRow} testID={`sleep-insights-trend-${metric.id}`}>
                                        <View style={styles.trendLabel}>
                                            <Text fontSize="md" fontWeight="medium">
                                                {t(metric.labelKey)}
                                            </Text>
                                        </View>
                                        <Text fontSize="md" fontWeight="bold" color={colors.gray[60]}>
                                            {metric.value}
                                        </Text>
                                        <View
                                            style={[styles.trendArrow, { backgroundColor: trendConfig.color + '20' }]}
                                        >
                                            <Ionicons name={trendConfig.icon} size={16} color={trendConfig.color} />
                                        </View>
                                    </View>
                                    {index < MOCK_TRENDS.length - 1 && <View style={styles.divider} />}
                                </View>
                            );
                        })}
                    </Card>
                </View>

                {/* Personalized Recommendations */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.insights.recommendations')}
                    </Text>
                    {MOCK_RECOMMENDATIONS.map((rec, index) => (
                        <Card key={rec.id} journey="health" elevation="sm" padding="md">
                            <View style={styles.recRow} testID={`sleep-insights-rec-${index}`}>
                                <View style={styles.recIconContainer}>
                                    <Ionicons name={rec.icon} size={22} color={colors.journeys.health.primary} />
                                </View>
                                <View style={styles.recInfo}>
                                    <Text fontSize="md" fontWeight="semiBold">
                                        {t(rec.titleKey)}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {t(rec.descKey)}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}
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
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tipIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.sm,
    },
    tipTitle: {
        flex: 1,
    },
    tipBody: {
        marginTop: spacingValues.sm,
        paddingTop: spacingValues.sm,
        borderTopWidth: 1,
        borderTopColor: colors.gray[10],
        gap: spacingValues.sm,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacingValues.sm,
    },
    trendLabel: {
        flex: 1,
    },
    trendArrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacingValues.sm,
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[10],
    },
    recRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.md,
    },
    recInfo: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
});

export default SleepInsights;
