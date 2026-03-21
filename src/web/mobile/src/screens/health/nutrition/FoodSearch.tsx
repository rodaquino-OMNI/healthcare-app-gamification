import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, FlatList, StyleSheet, TextInput, ListRenderItemInfo, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../hooks/useTheme';

/**
 * A food item returned from search results.
 */
interface FoodItem {
    id: string;
    name: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
}

const MOCK_FOODS: FoodItem[] = [
    { id: 'f1', name: 'Chicken Breast', calories: 165, carbs: 0, protein: 31, fat: 3 },
    { id: 'f2', name: 'Brown Rice', calories: 130, carbs: 28, protein: 3, fat: 1 },
    { id: 'f3', name: 'Avocado', calories: 160, carbs: 9, protein: 2, fat: 15 },
    { id: 'f4', name: 'Greek Yogurt', calories: 59, carbs: 3, protein: 10, fat: 1 },
    { id: 'f5', name: 'Sweet Potato', calories: 86, carbs: 20, protein: 2, fat: 0 },
    { id: 'f6', name: 'Salmon Fillet', calories: 208, carbs: 0, protein: 20, fat: 13 },
    { id: 'f7', name: 'Quinoa', calories: 120, carbs: 22, protein: 4, fat: 2 },
    { id: 'f8', name: 'Almonds', calories: 579, carbs: 22, protein: 21, fat: 50 },
    { id: 'f9', name: 'Banana', calories: 89, carbs: 23, protein: 1, fat: 0 },
    { id: 'f10', name: 'Eggs', calories: 155, carbs: 1, protein: 13, fat: 11 },
];

const MOCK_RECENT_SEARCHES = ['Chicken', 'Rice', 'Salad', 'Yogurt', 'Fruit'];

/**
 * FoodSearch allows users to search for foods by name and add them to their
 * daily log, with recent searches and macro bar visualisations per result.
 */
export const FoodSearch: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const _theme = useTheme();

    const [query, setQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState(MOCK_RECENT_SEARCHES);

    const results = useMemo(() => {
        if (!query.trim()) {
            return [];
        }
        const lower = query.toLowerCase();
        return MOCK_FOODS.filter((f) => f.name.toLowerCase().includes(lower));
    }, [query]);

    const handleRecentPress = useCallback((term: string) => {
        setQuery(term);
    }, []);

    const handleAddFood = useCallback(
        (food: FoodItem) => {
            Alert.alert(
                t('journeys.health.nutrition.search.addedTitle'),
                t('journeys.health.nutrition.search.addedMessage', { name: food.name })
            );
            if (!recentSearches.includes(food.name)) {
                setRecentSearches((prev) => [food.name, ...prev].slice(0, 5));
            }
        },
        [recentSearches, t]
    );

    const renderFoodItem = useCallback(
        ({ item, index }: ListRenderItemInfo<FoodItem>) => {
            const total = item.carbs + item.protein + item.fat || 1;
            const carbsWidth = Math.round((item.carbs / total) * 100);
            const proteinWidth = Math.round((item.protein / total) * 100);
            const fatWidth = Math.round((item.fat / total) * 100);

            return (
                <Card journey="health" elevation="sm" padding="md" testID={`nutrition-search-food-${index}`}>
                    <View style={styles.foodItemRow}>
                        <View style={styles.foodInfo}>
                            <Text fontSize="md" fontWeight="semiBold">
                                {item.name}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {item.calories} {t('journeys.health.nutrition.search.kcalPer100g')}
                            </Text>
                            {/* Mini macro bars */}
                            <View style={styles.macroBarsRow}>
                                <View
                                    style={[
                                        styles.macroBar,
                                        {
                                            width: `${carbsWidth}%`,
                                            backgroundColor: colors.semantic.info,
                                        },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.macroBar,
                                        {
                                            width: `${proteinWidth}%`,
                                            backgroundColor: colors.semantic.success,
                                        },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.macroBar,
                                        {
                                            width: `${fatWidth}%`,
                                            backgroundColor: colors.semantic.warning,
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                        <Touchable
                            onPress={() => handleAddFood(item)}
                            accessibilityLabel={t('journeys.health.nutrition.search.add', { name: item.name })}
                            accessibilityRole="button"
                            testID={`nutrition-search-add-${index}`}
                            style={styles.addButton}
                        >
                            <View style={styles.addButtonInner}>
                                <Ionicons name="add" size={20} color={colors.neutral.white} />
                            </View>
                        </Touchable>
                    </View>
                </Card>
            );
        },
        [handleAddFood, t]
    );

    const keyExtractor = useCallback((item: FoodItem) => item.id, []);

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
                    {t('journeys.health.nutrition.search.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputRow}>
                    <Ionicons name="search" size={20} color={colors.gray[40]} />
                    <TextInput
                        style={styles.searchInput}
                        value={query}
                        onChangeText={setQuery}
                        placeholder={t('journeys.health.nutrition.search.placeholder')}
                        placeholderTextColor={colors.gray[30]}
                        accessibilityLabel={t('journeys.health.nutrition.search.placeholder')}
                        testID="nutrition-search-input"
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <Touchable
                            onPress={() => setQuery('')}
                            accessibilityLabel={t('common.buttons.clear')}
                            accessibilityRole="button"
                            testID="nutrition-search-clear"
                        >
                            <Ionicons name="close-circle" size={18} color={colors.gray[40]} />
                        </Touchable>
                    )}
                </View>
            </View>

            {/* Recent Searches */}
            {query.length === 0 && (
                <View style={styles.recentContainer}>
                    <Text fontSize="sm" fontWeight="semiBold" color={colors.gray[50]} style={styles.recentLabel}>
                        {t('journeys.health.nutrition.search.recent')}
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.recentScroll}
                    >
                        {recentSearches.map((term) => (
                            <Touchable
                                key={term}
                                onPress={() => handleRecentPress(term)}
                                accessibilityLabel={term}
                                accessibilityRole="button"
                                testID={`nutrition-search-recent-${term.toLowerCase()}`}
                                style={styles.recentChip}
                            >
                                <Text fontSize="sm" color={colors.journeys.health.primary}>
                                    {term}
                                </Text>
                            </Touchable>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Results */}
            {query.length > 0 && results.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={48} color={colors.gray[30]} />
                    <Text fontSize="md" color={colors.gray[50]}>
                        {t('journeys.health.nutrition.search.noResults')}
                    </Text>
                </View>
            )}

            {query.length > 0 && results.length > 0 && (
                <FlatList
                    data={results}
                    keyExtractor={keyExtractor}
                    renderItem={renderFoodItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    testID="nutrition-search-results-list"
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}

            {/* Macro Legend */}
            {query.length > 0 && results.length > 0 && (
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: colors.semantic.info }]} />
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {t('journeys.health.nutrition.search.carbs')}
                        </Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: colors.semantic.success }]} />
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {t('journeys.health.nutrition.search.protein')}
                        </Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: colors.semantic.warning }]} />
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {t('journeys.health.nutrition.search.fat')}
                        </Text>
                    </View>
                </View>
            )}
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
    searchContainer: {
        paddingHorizontal: spacingValues.md,
        marginBottom: spacingValues.sm,
    },
    searchInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
        backgroundColor: colors.gray[0],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray[20],
        paddingHorizontal: spacingValues.md,
        paddingVertical: spacingValues.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.gray[70],
    },
    recentContainer: {
        paddingTop: spacingValues.xs,
    },
    recentLabel: {
        paddingHorizontal: spacingValues.md,
        marginBottom: spacingValues.xs,
    },
    recentScroll: {
        paddingHorizontal: spacingValues.md,
        gap: spacingValues.sm,
    },
    recentChip: {
        paddingVertical: spacingValues.xs,
        paddingHorizontal: spacingValues.sm,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.journeys.health.primary,
        backgroundColor: colors.journeys.health.background,
    },
    listContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    separator: {
        height: spacingValues.sm,
    },
    foodItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
    },
    foodInfo: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    macroBarsRow: {
        flexDirection: 'row',
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: colors.gray[10],
        marginTop: spacingValues['4xs'],
    },
    macroBar: {
        height: 6,
    },
    addButton: {
        flexShrink: 0,
    },
    addButtonInner: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.journeys.health.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacingValues.md,
        paddingHorizontal: spacingValues.md,
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacingValues.md,
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.md,
        borderTopWidth: 1,
        borderTopColor: colors.gray[10],
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});

export default FoodSearch;
