import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import { useTheme } from 'styled-components/native';

/**
 * Filter period options.
 */
type FilterPeriod = 'week' | 'month' | 'all';

/**
 * Meal type classification.
 */
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * A single meal within a diary day.
 */
interface DiaryMeal {
    id: string;
    name: string;
    mealType: MealType;
    calories: number;
    icon: keyof typeof Ionicons.glyphMap;
}

/**
 * A diary day grouping with all meals and daily total.
 */
interface DiaryDay {
    id: string;
    date: string;
    totalCalories: number;
    meals: DiaryMeal[];
}

const MEAL_TYPE_ICONS: Record<MealType, keyof typeof Ionicons.glyphMap> = {
    breakfast: 'sunny-outline',
    lunch: 'restaurant-outline',
    dinner: 'moon-outline',
    snack: 'nutrition-outline',
};

const MOCK_DIARY_ENTRIES: DiaryDay[] = [
    {
        id: 'day-1',
        date: '2026-02-23',
        totalCalories: 1950,
        meals: [
            {
                id: 'meal-1-1',
                name: 'journeys.health.nutrition.diary.mockMeal1',
                mealType: 'breakfast',
                calories: 420,
                icon: 'sunny-outline',
            },
            {
                id: 'meal-1-2',
                name: 'journeys.health.nutrition.diary.mockMeal2',
                mealType: 'lunch',
                calories: 680,
                icon: 'restaurant-outline',
            },
            {
                id: 'meal-1-3',
                name: 'journeys.health.nutrition.diary.mockMeal3',
                mealType: 'snack',
                calories: 180,
                icon: 'nutrition-outline',
            },
            {
                id: 'meal-1-4',
                name: 'journeys.health.nutrition.diary.mockMeal4',
                mealType: 'dinner',
                calories: 670,
                icon: 'moon-outline',
            },
        ],
    },
    {
        id: 'day-2',
        date: '2026-02-22',
        totalCalories: 1780,
        meals: [
            {
                id: 'meal-2-1',
                name: 'journeys.health.nutrition.diary.mockMeal5',
                mealType: 'breakfast',
                calories: 380,
                icon: 'sunny-outline',
            },
            {
                id: 'meal-2-2',
                name: 'journeys.health.nutrition.diary.mockMeal6',
                mealType: 'lunch',
                calories: 720,
                icon: 'restaurant-outline',
            },
            {
                id: 'meal-2-3',
                name: 'journeys.health.nutrition.diary.mockMeal7',
                mealType: 'dinner',
                calories: 680,
                icon: 'moon-outline',
            },
        ],
    },
    {
        id: 'day-3',
        date: '2026-02-21',
        totalCalories: 2100,
        meals: [
            {
                id: 'meal-3-1',
                name: 'journeys.health.nutrition.diary.mockMeal8',
                mealType: 'breakfast',
                calories: 510,
                icon: 'sunny-outline',
            },
            {
                id: 'meal-3-2',
                name: 'journeys.health.nutrition.diary.mockMeal9',
                mealType: 'lunch',
                calories: 750,
                icon: 'restaurant-outline',
            },
            {
                id: 'meal-3-3',
                name: 'journeys.health.nutrition.diary.mockMeal10',
                mealType: 'snack',
                calories: 220,
                icon: 'nutrition-outline',
            },
            {
                id: 'meal-3-4',
                name: 'journeys.health.nutrition.diary.mockMeal11',
                mealType: 'dinner',
                calories: 620,
                icon: 'moon-outline',
            },
        ],
    },
    {
        id: 'day-4',
        date: '2026-02-17',
        totalCalories: 1650,
        meals: [
            {
                id: 'meal-4-1',
                name: 'journeys.health.nutrition.diary.mockMeal12',
                mealType: 'breakfast',
                calories: 340,
                icon: 'sunny-outline',
            },
            {
                id: 'meal-4-2',
                name: 'journeys.health.nutrition.diary.mockMeal13',
                mealType: 'lunch',
                calories: 620,
                icon: 'restaurant-outline',
            },
            {
                id: 'meal-4-3',
                name: 'journeys.health.nutrition.diary.mockMeal14',
                mealType: 'dinner',
                calories: 690,
                icon: 'moon-outline',
            },
        ],
    },
];

const FILTERS: { key: FilterPeriod; labelKey: string }[] = [
    { key: 'week', labelKey: 'journeys.health.nutrition.diary.week' },
    { key: 'month', labelKey: 'journeys.health.nutrition.diary.month' },
    { key: 'all', labelKey: 'journeys.health.nutrition.diary.all' },
];

/**
 * FoodDiary displays a filterable list of daily meal entries,
 * grouped by date with calorie totals and meal type icons.
 */
export const FoodDiary: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const _theme = useTheme();
    const [activeFilter, setActiveFilter] = useState<FilterPeriod>('week');

    const filteredEntries = useMemo(() => {
        if (activeFilter === 'week') {
            return MOCK_DIARY_ENTRIES.slice(0, 3);
        }
        if (activeFilter === 'month') {
            return MOCK_DIARY_ENTRIES;
        }
        return MOCK_DIARY_ENTRIES;
    }, [activeFilter]);

    const handleFilterPress = useCallback((filter: FilterPeriod) => {
        setActiveFilter(filter);
    }, []);

    const renderDayEntry = useCallback(
        ({ item }: ListRenderItemInfo<DiaryDay>) => (
            <View style={styles.dayGroup}>
                {/* Day header */}
                <View style={styles.dayHeader}>
                    <Text fontSize="sm" fontWeight="semiBold" color={colors.gray[60]}>
                        {item.date}
                    </Text>
                    <View style={styles.dayTotalRow}>
                        <Ionicons name="flame-outline" size={14} color={colors.journeys.health.primary} />
                        <Text fontSize="sm" fontWeight="bold" color={colors.journeys.health.primary}>
                            {item.totalCalories} {t('journeys.health.nutrition.home.kcal')}
                        </Text>
                    </View>
                </View>

                {/* Meals under this day */}
                {item.meals.map((meal) => (
                    <Card key={meal.id} journey="health" elevation="sm" padding="md">
                        <View style={styles.mealRow}>
                            <View style={styles.mealIconContainer}>
                                <Ionicons
                                    name={MEAL_TYPE_ICONS[meal.mealType]}
                                    size={20}
                                    color={colors.journeys.health.primary}
                                />
                            </View>
                            <Text fontSize="md" style={styles.mealName}>
                                {t(meal.name)}
                            </Text>
                            <View style={styles.mealTypeTag}>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {t(`journeys.health.nutrition.log.${meal.mealType}`)}
                                </Text>
                            </View>
                            <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.primary}>
                                {meal.calories}
                            </Text>
                        </View>
                    </Card>
                ))}
            </View>
        ),
        [t]
    );

    const keyExtractor = useCallback((item: DiaryDay) => item.id, []);

    const renderEmpty = useCallback(
        () => (
            <View style={styles.emptyContainer}>
                <Ionicons name="restaurant-outline" size={48} color={colors.gray[30]} />
                <Text fontSize="md" color={colors.gray[50]}>
                    {t('journeys.health.nutrition.diary.noEntries')}
                </Text>
            </View>
        ),
        [t]
    );

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
                    {t('journeys.health.nutrition.diary.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterRow}>
                {FILTERS.map((filter) => {
                    const isActive = activeFilter === filter.key;
                    return (
                        <Touchable
                            key={filter.key}
                            onPress={() => handleFilterPress(filter.key)}
                            accessibilityLabel={t(filter.labelKey)}
                            accessibilityRole="button"
                            testID={`nutrition-diary-filter-${filter.key}`}
                            style={[styles.filterTab, isActive && styles.filterTabActive] as any}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={isActive ? 'semiBold' : 'regular'}
                                color={isActive ? colors.journeys.health.primary : colors.gray[50]}
                            >
                                {t(filter.labelKey)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Diary List */}
            <FlatList
                data={filteredEntries}
                renderItem={renderDayEntry}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                testID="nutrition-diary-list"
                ListEmptyComponent={renderEmpty}
            />
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
    filterRow: {
        flexDirection: 'row',
        marginHorizontal: spacingValues.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[20],
        overflow: 'hidden',
        marginBottom: spacingValues.sm,
    },
    filterTab: {
        flex: 1,
        paddingVertical: spacingValues.sm,
        alignItems: 'center',
        backgroundColor: colors.gray[0],
    },
    filterTabActive: {
        backgroundColor: colors.journeys.health.background,
    },
    listContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
        gap: spacingValues.md,
    },
    dayGroup: {
        gap: spacingValues.xs,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues.xs,
    },
    dayTotalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    mealRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
    },
    mealIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mealName: {
        flex: 1,
    },
    mealTypeTag: {
        paddingHorizontal: spacingValues.xs,
        paddingVertical: spacingValues['4xs'],
        backgroundColor: colors.gray[10],
        borderRadius: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacingValues['3xl'],
        gap: spacingValues.md,
    },
});

export default FoodDiary;
