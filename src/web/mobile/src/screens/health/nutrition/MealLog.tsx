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
import { View, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../hooks/useTheme';

/**
 * Meal type options for selector tabs.
 */
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * Mock nutrition lookup for a food item.
 */
interface NutritionData {
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
}

const MEAL_TYPES: { key: MealType; labelKey: string }[] = [
    { key: 'breakfast', labelKey: 'journeys.health.nutrition.log.breakfast' },
    { key: 'lunch', labelKey: 'journeys.health.nutrition.log.lunch' },
    { key: 'dinner', labelKey: 'journeys.health.nutrition.log.dinner' },
    { key: 'snack', labelKey: 'journeys.health.nutrition.log.snack' },
];

/**
 * Mock food database lookup.
 */
const MOCK_FOOD_DB: Record<string, NutritionData> = {
    default: { caloriesPer100g: 250, proteinPer100g: 12, carbsPer100g: 30, fatPer100g: 8 },
};

/**
 * Calculate nutrition values from portion and per-100g values.
 */
const calculateNutrition = (
    data: NutritionData,
    portionGrams: number
): { calories: number; protein: number; carbs: number; fat: number } => {
    const factor = portionGrams / 100;
    return {
        calories: Math.round(data.caloriesPer100g * factor),
        protein: Math.round(data.proteinPer100g * factor * 10) / 10,
        carbs: Math.round(data.carbsPer100g * factor * 10) / 10,
        fat: Math.round(data.fatPer100g * factor * 10) / 10,
    };
};

/**
 * MealLog allows users to log a meal with food name, portion size,
 * meal type, auto-calculated nutrition, and optional notes.
 */
export const MealLog: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const _theme = useTheme();

    const [foodName, setFoodName] = useState('');
    const [portionGrams, setPortionGrams] = useState('100');
    const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
    const [notes, setNotes] = useState('');

    const parsedPortion = useMemo(() => {
        const val = parseFloat(portionGrams);
        return isNaN(val) || val <= 0 ? 0 : val;
    }, [portionGrams]);

    const nutrition = useMemo(() => calculateNutrition(MOCK_FOOD_DB.default, parsedPortion), [parsedPortion]);

    const handleMealTypePress = useCallback((type: MealType) => {
        setSelectedMealType(type);
    }, []);

    const handleSave = useCallback(() => {
        if (!foodName.trim()) {
            Alert.alert(
                t('journeys.health.nutrition.log.errorTitle'),
                t('journeys.health.nutrition.log.errorFoodRequired'),
                [{ text: t('common.buttons.ok') }]
            );
            return;
        }

        Alert.alert(t('journeys.health.nutrition.log.savedTitle'), t('journeys.health.nutrition.log.savedMessage'), [
            { text: t('common.buttons.ok'), onPress: () => navigation.goBack() },
        ]);
    }, [foodName, navigation, t]);

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
                    {t('journeys.health.nutrition.log.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Food Name Input */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.log.foodName')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.inputRow}>
                            <Ionicons name="search-outline" size={20} color={colors.gray[40]} />
                            <TextInput
                                value={foodName}
                                onChangeText={setFoodName}
                                placeholder={t('journeys.health.nutrition.log.foodNamePlaceholder')}
                                placeholderTextColor={colors.gray[40]}
                                style={styles.textInput}
                                testID="nutrition-log-food-input"
                                accessibilityLabel={t('journeys.health.nutrition.log.foodName')}
                            />
                        </View>
                    </Card>
                </View>

                {/* Portion Size Input */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.log.portionSize')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.inputRow}>
                            <Ionicons name="scale-outline" size={20} color={colors.gray[40]} />
                            <TextInput
                                value={portionGrams}
                                onChangeText={setPortionGrams}
                                placeholder="100"
                                placeholderTextColor={colors.gray[40]}
                                keyboardType="numeric"
                                style={styles.textInput}
                                testID="nutrition-log-portion-input"
                                accessibilityLabel={t('journeys.health.nutrition.log.portionSize')}
                            />
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.nutrition.log.grams')}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Meal Type Selector */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.log.mealType')}
                    </Text>
                    <View style={styles.mealTypeRow}>
                        {MEAL_TYPES.map((mt) => {
                            const isActive = selectedMealType === mt.key;
                            return (
                                <Touchable
                                    key={mt.key}
                                    onPress={() => handleMealTypePress(mt.key)}
                                    accessibilityLabel={t(mt.labelKey)}
                                    accessibilityRole="button"
                                    testID={`nutrition-log-meal-${mt.key}`}
                                    style={[styles.mealTypeTab, isActive && styles.mealTypeTabActive]}
                                >
                                    <Text
                                        fontSize="xs"
                                        fontWeight={isActive ? 'semiBold' : 'regular'}
                                        color={isActive ? colors.journeys.health.primary : colors.gray[50]}
                                    >
                                        {t(mt.labelKey)}
                                    </Text>
                                </Touchable>
                            );
                        })}
                    </View>
                </View>

                {/* Nutrition Display */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.log.nutritionInfo')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        {/* Calories */}
                        <View style={styles.nutrientRow}>
                            <Ionicons name="flame-outline" size={18} color={colors.journeys.health.primary} />
                            <Text fontSize="md" style={styles.nutrientLabel}>
                                {t('journeys.health.nutrition.log.calories')}
                            </Text>
                            <Text fontSize="md" fontWeight="bold" color={colors.journeys.health.primary}>
                                {nutrition.calories} {t('journeys.health.nutrition.home.kcal')}
                            </Text>
                        </View>
                        <View style={styles.divider} />

                        {/* Protein */}
                        <View style={styles.nutrientRow}>
                            <Ionicons name="barbell-outline" size={18} color={colors.semantic.info} />
                            <Text fontSize="md" style={styles.nutrientLabel}>
                                {t('journeys.health.nutrition.home.protein')}
                            </Text>
                            <Text fontSize="md" fontWeight="semiBold" color={colors.semantic.info}>
                                {nutrition.protein}g
                            </Text>
                        </View>
                        <View style={styles.divider} />

                        {/* Carbs */}
                        <View style={styles.nutrientRow}>
                            <Ionicons name="leaf-outline" size={18} color={colors.semantic.success} />
                            <Text fontSize="md" style={styles.nutrientLabel}>
                                {t('journeys.health.nutrition.home.carbs')}
                            </Text>
                            <Text fontSize="md" fontWeight="semiBold" color={colors.semantic.success}>
                                {nutrition.carbs}g
                            </Text>
                        </View>
                        <View style={styles.divider} />

                        {/* Fat */}
                        <View style={styles.nutrientRow}>
                            <Ionicons name="water-outline" size={18} color={colors.semantic.warning} />
                            <Text fontSize="md" style={styles.nutrientLabel}>
                                {t('journeys.health.nutrition.home.fat')}
                            </Text>
                            <Text fontSize="md" fontWeight="semiBold" color={colors.semantic.warning}>
                                {nutrition.fat}g
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Notes */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.log.notes')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            placeholder={t('journeys.health.nutrition.log.notesPlaceholder')}
                            placeholderTextColor={colors.gray[40]}
                            multiline
                            numberOfLines={4}
                            style={styles.notesInput}
                            testID="nutrition-log-notes-input"
                            accessibilityLabel={t('journeys.health.nutrition.log.notes')}
                        />
                    </Card>
                </View>

                {/* Save Button */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={handleSave}
                        accessibilityLabel={t('journeys.health.nutrition.log.save')}
                        testID="nutrition-log-save-button"
                    >
                        {t('journeys.health.nutrition.log.save')}
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
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: colors.gray[60],
    },
    mealTypeRow: {
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[20],
        overflow: 'hidden',
    },
    mealTypeTab: {
        flex: 1,
        paddingVertical: spacingValues.sm,
        alignItems: 'center',
        backgroundColor: colors.gray[0],
    },
    mealTypeTabActive: {
        backgroundColor: colors.journeys.health.background,
    },
    nutrientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacingValues.sm,
        gap: spacingValues.sm,
    },
    nutrientLabel: {
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[10],
    },
    notesInput: {
        minHeight: 80,
        textAlignVertical: 'top',
        fontSize: 14,
        color: colors.gray[60],
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
    },
});

export default MealLog;
