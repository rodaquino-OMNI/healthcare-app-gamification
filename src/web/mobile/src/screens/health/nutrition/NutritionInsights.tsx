import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { NutritionNavigationProp } from '../../../navigation/types';

/**
 * An AI-generated nutrition insight.
 */
interface NutritionInsight {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    titleKey: string;
    descKey: string;
    trending: 'up' | 'down';
}

/**
 * A personalized nutrition tip.
 */
interface NutritionTip {
    id: string;
    titleKey: string;
    descKey: string;
}

/**
 * A suggested meal.
 */
interface MealSuggestion {
    id: string;
    nameKey: string;
    reasonKey: string;
    calories: number;
}

const INSIGHTS: NutritionInsight[] = [
    {
        id: 'protein',
        icon: 'barbell-outline',
        titleKey: 'journeys.health.nutrition.insights.proteinTitle',
        descKey: 'journeys.health.nutrition.insights.proteinDesc',
        trending: 'up',
    },
    {
        id: 'fiber',
        icon: 'leaf-outline',
        titleKey: 'journeys.health.nutrition.insights.fiberTitle',
        descKey: 'journeys.health.nutrition.insights.fiberDesc',
        trending: 'down',
    },
    {
        id: 'hydration',
        icon: 'water-outline',
        titleKey: 'journeys.health.nutrition.insights.hydrationTitle',
        descKey: 'journeys.health.nutrition.insights.hydrationDesc',
        trending: 'up',
    },
];

const TIPS: NutritionTip[] = [
    {
        id: 'tip-1',
        titleKey: 'journeys.health.nutrition.insights.tip1Title',
        descKey: 'journeys.health.nutrition.insights.tip1Desc',
    },
    {
        id: 'tip-2',
        titleKey: 'journeys.health.nutrition.insights.tip2Title',
        descKey: 'journeys.health.nutrition.insights.tip2Desc',
    },
    {
        id: 'tip-3',
        titleKey: 'journeys.health.nutrition.insights.tip3Title',
        descKey: 'journeys.health.nutrition.insights.tip3Desc',
    },
];

const SUGGESTIONS: MealSuggestion[] = [
    {
        id: 'sug-1',
        nameKey: 'journeys.health.nutrition.insights.sug1Name',
        reasonKey: 'journeys.health.nutrition.insights.sug1Reason',
        calories: 420,
    },
    {
        id: 'sug-2',
        nameKey: 'journeys.health.nutrition.insights.sug2Name',
        reasonKey: 'journeys.health.nutrition.insights.sug2Reason',
        calories: 310,
    },
    {
        id: 'sug-3',
        nameKey: 'journeys.health.nutrition.insights.sug3Name',
        reasonKey: 'journeys.health.nutrition.insights.sug3Reason',
        calories: 185,
    },
];

const STREAK_DAYS = 12;

/**
 * NutritionInsights shows AI-generated insights, personalised tips,
 * meal suggestions and an achievement streak display.
 */
export const NutritionInsights: React.FC = () => {
    const navigation = useNavigation<NutritionNavigationProp>();
    const { t } = useTranslation();

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleViewAll = useCallback(() => {
        navigation.navigate('HealthNutritionFoodDiary');
    }, [navigation]);

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
                    <Ionicons name="chevron-back" size={24} color={colors.journeys.health.primary} />
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.nutrition.insights.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                testID="nutrition-insights-scroll"
            >
                {/* Weekly Summary */}
                <Card journey="health" elevation="md" padding="md" testID="nutrition-insights-weekly-card">
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.insights.weeklySummary')}
                    </Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryItem}>
                            <Ionicons name="flame-outline" size={20} color={colors.semantic.warning} />
                            <Text fontSize="xl" fontWeight="bold" color={colors.semantic.warning}>
                                1840
                            </Text>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.nutrition.insights.avgCalories')}
                            </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Ionicons name="trophy-outline" size={20} color={colors.semantic.success} />
                            <Text fontSize="xl" fontWeight="bold" color={colors.semantic.success}>
                                {t('journeys.health.nutrition.insights.wednesday')}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.nutrition.insights.bestDay')}
                            </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={20}
                                color={colors.journeys.health.primary}
                            />
                            <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                                82%
                            </Text>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.nutrition.insights.consistency')}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* AI Insights */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.insights.aiInsights')}
                    </Text>
                    {INSIGHTS.map((insight, _idx) => (
                        <Card key={insight.id} journey="health" elevation="sm" padding="md">
                            <View style={styles.insightRow}>
                                <View style={styles.insightIconCircle}>
                                    <Ionicons name={insight.icon} size={22} color={colors.journeys.health.primary} />
                                </View>
                                <View style={styles.insightContent}>
                                    <Text fontSize="md" fontWeight="semiBold">
                                        {t(insight.titleKey)}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {t(insight.descKey)}
                                    </Text>
                                </View>
                                <Ionicons
                                    name={insight.trending === 'up' ? 'trending-up' : 'trending-down'}
                                    size={22}
                                    color={insight.trending === 'up' ? colors.semantic.success : colors.semantic.error}
                                />
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Personalised Tips */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.insights.tips')}
                    </Text>
                    {TIPS.map((tip, idx) => (
                        <Card
                            key={tip.id}
                            journey="health"
                            elevation="sm"
                            padding="md"
                            testID={`nutrition-insights-tip-${idx}`}
                        >
                            <View style={styles.tipRow}>
                                <Ionicons name="leaf-outline" size={20} color={colors.semantic.success} />
                                <View style={styles.tipContent}>
                                    <Text fontSize="sm" fontWeight="semiBold">
                                        {t(tip.titleKey)}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {t(tip.descKey)}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Meal Suggestions */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.insights.mealSuggestions')}
                    </Text>
                    {SUGGESTIONS.map((sug, idx) => (
                        <Card
                            key={sug.id}
                            journey="health"
                            elevation="sm"
                            padding="md"
                            testID={`nutrition-insights-suggestion-${idx}`}
                        >
                            <View style={styles.sugRow}>
                                <View style={styles.sugContent}>
                                    <Text fontSize="md" fontWeight="semiBold">
                                        {t(sug.nameKey)}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {t(sug.reasonKey)}
                                    </Text>
                                </View>
                                <View style={styles.calorieBadge}>
                                    <Text fontSize="sm" fontWeight="bold" color={colors.semantic.warning}>
                                        {sug.calories}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        {t('journeys.health.nutrition.insights.kcal')}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Achievement Streak */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.insights.achievement')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.streakRow}>
                            <Ionicons name="flame" size={36} color={colors.semantic.warning} />
                            <View style={styles.streakContent}>
                                <Text fontSize="heading-2xl" fontWeight="bold" color={colors.semantic.warning}>
                                    {STREAK_DAYS}
                                </Text>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    {t('journeys.health.nutrition.insights.streakDays')}
                                </Text>
                            </View>
                            <Ionicons name="medal-outline" size={36} color={colors.journeys.health.primary} />
                        </View>
                    </Card>
                </View>

                {/* View All Button */}
                <View style={styles.actionsContainer}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleViewAll}
                        accessibilityLabel={t('journeys.health.nutrition.insights.viewAll')}
                        testID="nutrition-insights-view-all"
                    >
                        {t('journeys.health.nutrition.insights.viewAll')}
                    </Button>
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
    summaryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: spacingValues.md,
    },
    summaryItem: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
        flex: 1,
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    insightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
    },
    insightIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    insightContent: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacingValues.sm,
    },
    tipContent: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    sugRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
    },
    sugContent: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    calorieBadge: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: spacingValues.md,
    },
    streakContent: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
        marginBottom: spacingValues.xl,
    },
});

export default NutritionInsights;
