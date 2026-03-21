import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import { useTheme } from 'styled-components/native';

/**
 * Meal type classification.
 */
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * A recent meal entry shown on the dashboard.
 */
interface RecentMeal {
    id: string;
    name: string;
    calories: number;
    mealType: MealType;
    icon: keyof typeof Ionicons.glyphMap;
}

/**
 * Summary of today's nutrition totals.
 */
interface DailySummary {
    caloriesConsumed: number;
    caloriesGoal: number;
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
    carbsGoal: number;
    proteinGoal: number;
    fatGoal: number;
}

const MEAL_TYPE_ICONS: Record<MealType, keyof typeof Ionicons.glyphMap> = {
    breakfast: 'sunny-outline',
    lunch: 'restaurant-outline',
    dinner: 'moon-outline',
    snack: 'nutrition-outline',
};

const MOCK_DAILY_SUMMARY: DailySummary = {
    caloriesConsumed: 1450,
    caloriesGoal: 2000,
    carbsGrams: 165,
    proteinGrams: 72,
    fatGrams: 52,
    carbsGoal: 250,
    proteinGoal: 100,
    fatGoal: 67,
};

const MOCK_RECENT_MEALS: RecentMeal[] = [
    {
        id: 'meal-1',
        name: 'journeys.health.nutrition.home.mockMeal1',
        calories: 420,
        mealType: 'breakfast',
        icon: 'sunny-outline',
    },
    {
        id: 'meal-2',
        name: 'journeys.health.nutrition.home.mockMeal2',
        calories: 650,
        mealType: 'lunch',
        icon: 'restaurant-outline',
    },
    {
        id: 'meal-3',
        name: 'journeys.health.nutrition.home.mockMeal3',
        calories: 180,
        mealType: 'snack',
        icon: 'nutrition-outline',
    },
];

/**
 * NutritionHome displays a dashboard with today's calorie budget,
 * macro breakdown, recent meals, and quick action buttons.
 */
export const NutritionHome: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const _theme = useTheme();

    const [summary] = useState<DailySummary>(MOCK_DAILY_SUMMARY);

    const caloriePercent = useMemo(() => Math.min(summary.caloriesConsumed / summary.caloriesGoal, 1), [summary]);

    const caloriesRemaining = useMemo(() => summary.caloriesGoal - summary.caloriesConsumed, [summary]);

    const handleLogMeal = useCallback(() => {
        navigation.navigate('HealthNutritionMealLog');
    }, [navigation]);

    const handleViewDiary = useCallback(() => {
        navigation.navigate('HealthNutritionFoodDiary');
    }, [navigation]);

    const renderMeal = useCallback(
        ({ item }: ListRenderItemInfo<RecentMeal>) => (
            <Card journey="health" elevation="sm" padding="md">
                <View style={styles.mealRow}>
                    <View style={styles.mealIconContainer}>
                        <Ionicons
                            name={MEAL_TYPE_ICONS[item.mealType]}
                            size={22}
                            color={colors.journeys.health.primary}
                        />
                    </View>
                    <Text fontSize="md" fontWeight="semiBold" style={styles.mealName}>
                        {t(item.name)}
                    </Text>
                    <Text fontSize="md" fontWeight="bold" color={colors.journeys.health.primary}>
                        {item.calories}
                    </Text>
                    <Text fontSize="xs" color={colors.gray[50]}>
                        {t('journeys.health.nutrition.home.kcal')}
                    </Text>
                </View>
            </Card>
        ),
        [t]
    );

    const keyExtractor = useCallback((item: RecentMeal) => item.id, []);

    return (
        <View style={styles.container}>
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
                    {t('journeys.health.nutrition.home.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Calorie Budget Card */}
                <Card journey="health" elevation="md" padding="md">
                    <View style={styles.calorieSummaryRow}>
                        <View style={styles.calorieCenter}>
                            <Ionicons name="flame-outline" size={20} color={colors.journeys.health.primary} />
                            <Text fontSize="heading-2xl" fontWeight="bold" color={colors.journeys.health.primary}>
                                {summary.caloriesConsumed}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.nutrition.home.ofGoal', { goal: summary.caloriesGoal })}
                            </Text>
                        </View>
                        <View style={styles.calorieRight}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.nutrition.home.remaining')}
                            </Text>
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color={caloriesRemaining >= 0 ? colors.semantic.success : colors.semantic.error}
                            >
                                {caloriesRemaining >= 0 ? caloriesRemaining : 0}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.nutrition.home.kcal')}
                            </Text>
                        </View>
                    </View>

                    {/* Calorie progress bar */}
                    <View style={styles.progressBarTrack}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${caloriePercent * 100}%`,
                                    backgroundColor:
                                        caloriePercent >= 1 ? colors.semantic.error : colors.journeys.health.primary,
                                },
                            ]}
                        />
                    </View>
                </Card>

                {/* Macro Breakdown */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.home.macros')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        {/* Stacked macro bar */}
                        <View style={styles.macroStackedBar}>
                            <View
                                style={[
                                    styles.macroSegment,
                                    {
                                        flex: summary.carbsGrams,
                                        backgroundColor: colors.semantic.success,
                                    },
                                ]}
                            />
                            <View
                                style={[
                                    styles.macroSegment,
                                    {
                                        flex: summary.proteinGrams,
                                        backgroundColor: colors.semantic.info,
                                    },
                                ]}
                            />
                            <View
                                style={[
                                    styles.macroSegment,
                                    {
                                        flex: summary.fatGrams,
                                        backgroundColor: colors.semantic.warning,
                                    },
                                ]}
                            />
                        </View>

                        {/* Macro labels row */}
                        <View style={styles.macroBarsRow}>
                            <View style={styles.macroBarCol}>
                                <Text fontSize="sm" fontWeight="semiBold" color={colors.semantic.success}>
                                    {summary.carbsGrams}g
                                </Text>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {t('journeys.health.nutrition.home.carbs')}
                                </Text>
                            </View>
                            <View style={styles.macroBarCol}>
                                <Text fontSize="sm" fontWeight="semiBold" color={colors.semantic.info}>
                                    {summary.proteinGrams}g
                                </Text>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {t('journeys.health.nutrition.home.protein')}
                                </Text>
                            </View>
                            <View style={styles.macroBarCol}>
                                <Text fontSize="sm" fontWeight="semiBold" color={colors.semantic.warning}>
                                    {summary.fatGrams}g
                                </Text>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {t('journeys.health.nutrition.home.fat')}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Recent Meals */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.home.recentMeals')}
                    </Text>
                    <FlatList
                        data={MOCK_RECENT_MEALS}
                        renderItem={renderMeal}
                        keyExtractor={keyExtractor}
                        scrollEnabled={false}
                        contentContainerStyle={styles.mealListContent}
                        testID="nutrition-home-meals-list"
                    />
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={handleLogMeal}
                        accessibilityLabel={t('journeys.health.nutrition.home.logMeal')}
                        testID="nutrition-home-log-button"
                    >
                        {t('journeys.health.nutrition.home.logMeal')}
                    </Button>
                    <View style={styles.buttonSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleViewDiary}
                        accessibilityLabel={t('journeys.health.nutrition.home.viewDiary')}
                        testID="nutrition-home-diary-button"
                    >
                        {t('journeys.health.nutrition.home.viewDiary')}
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
    calorieSummaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    calorieCenter: {
        flex: 1,
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    calorieRight: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
        paddingLeft: spacingValues.md,
    },
    progressBarTrack: {
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.gray[20],
        marginTop: spacingValues.md,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 8,
        borderRadius: 4,
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    macroStackedBar: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: spacingValues.md,
    },
    macroSegment: {
        height: 8,
    },
    macroBarsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },
    macroBarCol: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
        flex: 1,
    },
    mealListContent: {
        gap: spacingValues.sm,
    },
    mealRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
    },
    mealIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mealName: {
        flex: 1,
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
    },
    buttonSpacer: {
        height: spacingValues.sm,
    },
});

export default NutritionHome;
