import React, { useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Meal type classification.
 */
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * A single ingredient in the meal.
 */
interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

/**
 * Nutrient card display item.
 */
interface NutrientCard {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
  value: number;
  unit: string;
  color: string;
}

/**
 * Full meal data for the detail view.
 */
interface MealData {
  id: string;
  name: string;
  mealType: MealType;
  dateTime: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  ingredients: Ingredient[];
}

const MEAL_TYPE_COLORS: Record<MealType, string> = {
  breakfast: colors.semantic.success,
  lunch: colors.journeys.health.primary,
  dinner: colors.journeys.health.secondary,
  snack: colors.semantic.warning,
};

const MOCK_MEAL: MealData = {
  id: 'meal-detail-1',
  name: 'journeys.health.nutrition.detail.mockMealName',
  mealType: 'lunch',
  dateTime: '2026-02-23 12:30',
  calories: 650,
  proteinGrams: 35,
  carbsGrams: 72,
  fatGrams: 18,
  fiberGrams: 8,
  ingredients: [
    { id: 'ing-1', name: 'journeys.health.nutrition.detail.ingredient1', amount: '150g' },
    { id: 'ing-2', name: 'journeys.health.nutrition.detail.ingredient2', amount: '80g' },
    { id: 'ing-3', name: 'journeys.health.nutrition.detail.ingredient3', amount: '200ml' },
    { id: 'ing-4', name: 'journeys.health.nutrition.detail.ingredient4', amount: '30g' },
  ],
};

/**
 * MealDetail displays a comprehensive view of a single meal,
 * including nutrient breakdown, ingredient list, and edit/delete actions.
 */
export const MealDetail: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();

  const nutrientCards: NutrientCard[] = useMemo(
    () => [
      {
        id: 'calories',
        icon: 'flame-outline',
        labelKey: 'journeys.health.nutrition.detail.calories',
        value: MOCK_MEAL.calories,
        unit: t('journeys.health.nutrition.home.kcal'),
        color: colors.journeys.health.primary,
      },
      {
        id: 'protein',
        icon: 'barbell-outline',
        labelKey: 'journeys.health.nutrition.detail.protein',
        value: MOCK_MEAL.proteinGrams,
        unit: 'g',
        color: colors.semantic.info,
      },
      {
        id: 'carbs',
        icon: 'leaf-outline',
        labelKey: 'journeys.health.nutrition.detail.carbs',
        value: MOCK_MEAL.carbsGrams,
        unit: 'g',
        color: colors.semantic.success,
      },
      {
        id: 'fat',
        icon: 'water-outline',
        labelKey: 'journeys.health.nutrition.detail.fat',
        value: MOCK_MEAL.fatGrams,
        unit: 'g',
        color: colors.semantic.warning,
      },
      {
        id: 'fiber',
        icon: 'nutrition-outline',
        labelKey: 'journeys.health.nutrition.detail.fiber',
        value: MOCK_MEAL.fiberGrams,
        unit: 'g',
        color: colors.semantic.success,
      },
    ],
    [t],
  );

  const mealTypeColor = useMemo(
    () => MEAL_TYPE_COLORS[MOCK_MEAL.mealType],
    [],
  );

  const handleEdit = useCallback(() => {
    navigation.navigate('HealthNutritionMealLog');
  }, [navigation]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      t('journeys.health.nutrition.detail.deleteTitle'),
      t('journeys.health.nutrition.detail.deleteMessage'),
      [
        { text: t('common.buttons.cancel'), style: 'cancel' },
        {
          text: t('common.buttons.delete'),
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  }, [navigation, t]);

  const renderIngredient = useCallback(
    ({ item, index }: ListRenderItemInfo<Ingredient>) => (
      <View>
        <View style={styles.ingredientRow}>
          <Ionicons
            name="ellipse"
            size={8}
            color={colors.journeys.health.primary}
          />
          <Text fontSize="md" style={styles.ingredientName}>
            {t(item.name)}
          </Text>
          <Text fontSize="sm" color={colors.gray[50]}>
            {item.amount}
          </Text>
        </View>
        {index < MOCK_MEAL.ingredients.length - 1 && (
          <View style={styles.divider} />
        )}
      </View>
    ),
    [t],
  );

  const keyExtractor = useCallback((item: Ingredient) => item.id, []);

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
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.journeys.health.primary}
          />
        </Touchable>
        <Text variant="heading" journey="health">
          {t('journeys.health.nutrition.detail.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID="nutrition-detail-scroll"
      >
        {/* Meal Name + Type Badge */}
        <View style={styles.mealHeader}>
          <Text fontSize="xl" fontWeight="bold" journey="health">
            {t(MOCK_MEAL.name)}
          </Text>
          <View style={styles.mealMetaRow}>
            <View
              style={[styles.mealTypeBadge, { backgroundColor: mealTypeColor }]}
            >
              <Text fontSize="xs" fontWeight="semiBold" color={colors.neutral.white}>
                {t(`journeys.health.nutrition.log.${MOCK_MEAL.mealType}`)}
              </Text>
            </View>
            <Text fontSize="sm" color={colors.gray[50]}>
              {MOCK_MEAL.dateTime}
            </Text>
          </View>
        </View>

        {/* Nutrient Cards */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.nutrition.detail.nutrients')}
          </Text>
          <View style={styles.nutrientGrid}>
            {nutrientCards.map((card) => (
              <Card key={card.id} journey="health" elevation="sm" padding="md">
                <View
                  style={styles.nutrientCard}
                  testID={card.id === 'calories' ? 'nutrition-detail-calories' : undefined}
                >
                  <Ionicons name={card.icon} size={22} color={card.color} />
                  <Text fontSize="lg" fontWeight="bold" color={card.color}>
                    {card.value}
                    <Text fontSize="xs" color={colors.gray[50]}>
                      {card.unit}
                    </Text>
                  </Text>
                  <Text fontSize="xs" color={colors.gray[50]}>
                    {t(card.labelKey)}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.nutrition.detail.ingredients')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <FlatList
              data={MOCK_MEAL.ingredients}
              renderItem={renderIngredient}
              keyExtractor={keyExtractor}
              scrollEnabled={false}
            />
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            journey="health"
            onPress={handleEdit}
            accessibilityLabel={t('journeys.health.nutrition.detail.edit')}
            testID="nutrition-detail-edit-button"
          >
            {t('journeys.health.nutrition.detail.edit')}
          </Button>
          <View style={styles.buttonSpacer} />
          <Button
            variant="secondary"
            journey="health"
            onPress={handleDelete}
            accessibilityLabel={t('journeys.health.nutrition.detail.delete')}
            testID="nutrition-detail-delete-button"
          >
            {t('journeys.health.nutrition.detail.delete')}
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
  mealHeader: {
    marginTop: spacingValues.md,
    gap: spacingValues.xs,
  },
  mealMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
    marginTop: spacingValues.xs,
  },
  mealTypeBadge: {
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues['4xs'],
    borderRadius: 12,
  },
  sectionContainer: {
    marginTop: spacingValues.xl,
    gap: spacingValues.sm,
  },
  nutrientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.sm,
  },
  nutrientCard: {
    alignItems: 'center',
    gap: spacingValues['4xs'],
    minWidth: 80,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
    gap: spacingValues.sm,
  },
  ingredientName: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[10],
  },
  actionsContainer: {
    marginTop: spacingValues['2xl'],
  },
  buttonSpacer: {
    height: spacingValues.sm,
  },
});

export default MealDetail;
