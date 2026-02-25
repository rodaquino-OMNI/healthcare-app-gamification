import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';

interface StepProps {
  data: Record<string, any>;
  onUpdate: (field: string, value: any) => void;
}

const DIET_TYPES = ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'other'] as const;

const MEAL_FREQUENCY = ['1-2', '3', '4-5', '6+'] as const;

const FRUIT_VEG_OPTIONS = [
  { key: 'rarely', indicator: colors.semantic.error },
  { key: '1-2', indicator: colors.semantic.warning },
  { key: '3-4', indicator: colors.semantic.success },
  { key: '5+', indicator: colors.semantic.success },
] as const;

const FAST_FOOD_OPTIONS = [
  { key: 'never', indicator: colors.semantic.success },
  { key: 'rarely', indicator: colors.semantic.success },
  { key: 'weekly', indicator: colors.semantic.warning },
  { key: 'daily', indicator: colors.semantic.error },
] as const;

export const StepDiet: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Diet Type */}
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.diet.typeTitle')}
      </Text>
      <View style={styles.optionRow}>
        {DIET_TYPES.map((opt) => {
          const selected = data.dietType === opt;
          return (
            <Touchable
              key={opt}
              onPress={() => onUpdate('dietType', opt)}
              accessibilityLabel={t(`healthAssessment.diet.type.${opt}`)}
              accessibilityRole="button"
              testID={`diet-type-${opt}`}
              style={[styles.optionChip, selected && styles.optionChipSelected] as any}
            >
              <Text
                fontSize="sm"
                fontWeight={selected ? 'semiBold' : 'regular'}
                color={selected ? colors.neutral.white : colors.neutral.gray700}
              >
                {t(`healthAssessment.diet.type.${opt}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Meal Frequency */}
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.diet.mealFrequencyTitle')}
      </Text>
      <View style={styles.optionRow}>
        {MEAL_FREQUENCY.map((opt) => {
          const selected = data.mealFrequency === opt;
          return (
            <Touchable
              key={opt}
              onPress={() => onUpdate('mealFrequency', opt)}
              accessibilityLabel={t(`healthAssessment.diet.mealFrequency.${opt}`)}
              accessibilityRole="button"
              testID={`meal-frequency-${opt}`}
              style={[styles.optionChip, selected && styles.optionChipSelected] as any}
            >
              <Text
                fontSize="sm"
                fontWeight={selected ? 'semiBold' : 'regular'}
                color={selected ? colors.neutral.white : colors.neutral.gray700}
              >
                {t(`healthAssessment.diet.mealFrequency.${opt}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Fruit/Vegetable Consumption */}
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.diet.fruitVegTitle')}
      </Text>
      {FRUIT_VEG_OPTIONS.map(({ key, indicator }) => {
        const selected = data.fruitVegConsumption === key;
        return (
          <Touchable
            key={key}
            onPress={() => onUpdate('fruitVegConsumption', key)}
            accessibilityLabel={t(`healthAssessment.diet.fruitVeg.${key}`)}
            accessibilityRole="button"
            testID={`fruit-veg-${key}`}
            style={[styles.indicatorRow, selected && styles.indicatorRowSelected] as any}
          >
            <View style={[styles.indicatorDot, { backgroundColor: indicator }]} />
            <Text
              fontSize="sm"
              fontWeight={selected ? 'semiBold' : 'regular'}
              color={selected ? colors.journeys.health.text : colors.neutral.gray700}
              style={styles.indicatorLabel}
            >
              {t(`healthAssessment.diet.fruitVeg.${key}`)}
            </Text>
          </Touchable>
        );
      })}

      {/* Fast Food Frequency */}
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.diet.fastFoodTitle')}
      </Text>
      {FAST_FOOD_OPTIONS.map(({ key, indicator }) => {
        const selected = data.fastFoodFrequency === key;
        return (
          <Touchable
            key={key}
            onPress={() => onUpdate('fastFoodFrequency', key)}
            accessibilityLabel={t(`healthAssessment.diet.fastFood.${key}`)}
            accessibilityRole="button"
            testID={`fast-food-${key}`}
            style={[styles.indicatorRow, selected && styles.indicatorRowSelected] as any}
          >
            <View style={[styles.indicatorDot, { backgroundColor: indicator }]} />
            <Text
              fontSize="sm"
              fontWeight={selected ? 'semiBold' : 'regular'}
              color={selected ? colors.journeys.health.text : colors.neutral.gray700}
              style={styles.indicatorLabel}
            >
              {t(`healthAssessment.diet.fastFood.${key}`)}
            </Text>
          </Touchable>
        );
      })}

      {/* Nutrition Tip */}
      <Card journey="health" elevation="sm" padding="md" style={styles.tipCard}>
        <Text fontSize="sm" color={colors.neutral.gray600}>
          {t('healthAssessment.diet.tip')}
        </Text>
      </Card>
    </ScrollView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  sectionTitle: {
    marginTop: spacingValues.xl,
    marginBottom: spacingValues.sm,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
  },
  optionChip: {
    paddingVertical: spacingValues.xs,
    paddingHorizontal: spacingValues.md,
    borderRadius: borderRadiusValues.full,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  optionChipSelected: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.md,
    marginBottom: spacingValues.xs,
    borderRadius: borderRadiusValues.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  indicatorRowSelected: {
    borderColor: colors.journeys.health.primary,
    backgroundColor: colors.journeys.health.background,
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadiusValues.full,
  },
  indicatorLabel: {
    marginLeft: spacingValues.sm,
    flex: 1,
  },
  tipCard: {
    marginTop: spacingValues.xl,
  },
});

export default StepDiet;
