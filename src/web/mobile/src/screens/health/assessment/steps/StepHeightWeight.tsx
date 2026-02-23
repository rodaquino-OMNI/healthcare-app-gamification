import React, { useCallback, useMemo } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
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

type UnitSystem = 'metric' | 'imperial';

const UNIT_OPTIONS: UnitSystem[] = ['metric', 'imperial'];

interface BmiCategory {
  key: string;
  min: number;
  max: number;
  color: string;
}

const BMI_CATEGORIES: BmiCategory[] = [
  { key: 'underweight', min: 0, max: 18.5, color: colors.semantic.info },
  { key: 'normal', min: 18.5, max: 25, color: colors.semantic.success },
  { key: 'overweight', min: 25, max: 30, color: colors.semantic.warning },
  { key: 'obese', min: 30, max: 100, color: colors.semantic.error },
];

const getBmiCategory = (bmi: number): BmiCategory | null => {
  return BMI_CATEGORIES.find((cat) => bmi >= cat.min && bmi < cat.max) || null;
};

/**
 * StepHeightWeight collects height and weight, auto-calculates BMI.
 * Supports metric (cm/kg) and imperial (ft-in/lbs) units.
 */
export const StepHeightWeight: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const unit: UnitSystem = data.unit || 'metric';

  const handleUnitToggle = useCallback(
    (selected: UnitSystem) => {
      onUpdate('unit', selected);
      onUpdate('height', '');
      onUpdate('weight', '');
    },
    [onUpdate],
  );

  const bmi = useMemo(() => {
    const h = parseFloat(data.height || '0');
    const w = parseFloat(data.weight || '0');
    if (h <= 0 || w <= 0) return null;

    if (unit === 'metric') {
      const heightM = h / 100;
      return w / (heightM * heightM);
    }
    // Imperial: height in inches, weight in lbs
    return (w / (h * h)) * 703;
  }, [data.height, data.weight, unit]);

  const bmiCategory = useMemo(() => {
    if (bmi === null) return null;
    return getBmiCategory(bmi);
  }, [bmi]);

  return (
    <View style={styles.container} testID="step-height-weight">
      {/* Title */}
      <Text variant="heading" fontSize="heading-lg" journey="health">
        {t('healthAssessment.heightWeight.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.heightWeight.subtitle')}
      </Text>

      {/* Unit Toggle */}
      <View style={styles.unitToggle}>
        {UNIT_OPTIONS.map((opt) => (
          <Touchable
            key={opt}
            onPress={() => handleUnitToggle(opt)}
            accessibilityLabel={t(`healthAssessment.heightWeight.unit_${opt}`)}
            accessibilityRole="button"
            testID={`unit-${opt}`}
            style={[
              styles.unitTab,
              unit === opt && styles.unitTabActive,
            ]}
          >
            <Text
              fontSize="sm"
              fontWeight={unit === opt ? 'semiBold' : 'regular'}
              color={
                unit === opt
                  ? colors.neutral.white
                  : colors.neutral.gray700
              }
            >
              {t(`healthAssessment.heightWeight.unit_${opt}`)}
            </Text>
          </Touchable>
        ))}
      </View>

      {/* Height Input */}
      <View style={styles.fieldGroup}>
        <Text fontWeight="medium" fontSize="sm" style={styles.label}>
          {t('healthAssessment.heightWeight.height')}
          {' ('}
          {unit === 'metric'
            ? t('healthAssessment.heightWeight.cm')
            : t('healthAssessment.heightWeight.inches')}
          {')'}
        </Text>
        <TextInput
          style={styles.textInput}
          value={data.height || ''}
          onChangeText={(text) => onUpdate('height', text)}
          placeholder={
            unit === 'metric'
              ? t('healthAssessment.heightWeight.heightPlaceholderCm')
              : t('healthAssessment.heightWeight.heightPlaceholderIn')
          }
          placeholderTextColor={colors.neutral.gray500}
          keyboardType="numeric"
          testID="input-height"
        />
      </View>

      {/* Weight Input */}
      <View style={styles.fieldGroup}>
        <Text fontWeight="medium" fontSize="sm" style={styles.label}>
          {t('healthAssessment.heightWeight.weight')}
          {' ('}
          {unit === 'metric'
            ? t('healthAssessment.heightWeight.kg')
            : t('healthAssessment.heightWeight.lbs')}
          {')'}
        </Text>
        <TextInput
          style={styles.textInput}
          value={data.weight || ''}
          onChangeText={(text) => onUpdate('weight', text)}
          placeholder={
            unit === 'metric'
              ? t('healthAssessment.heightWeight.weightPlaceholderKg')
              : t('healthAssessment.heightWeight.weightPlaceholderLbs')
          }
          placeholderTextColor={colors.neutral.gray500}
          keyboardType="numeric"
          testID="input-weight"
        />
      </View>

      {/* BMI Result */}
      {bmi !== null && bmiCategory !== null && (
        <Card journey="health" elevation="sm" padding="md">
          <Text
            fontSize="sm"
            color={colors.neutral.gray600}
            textAlign="center"
          >
            {t('healthAssessment.heightWeight.bmiLabel')}
          </Text>
          <Text
            fontSize="heading-2xl"
            fontWeight="bold"
            color={bmiCategory.color}
            textAlign="center"
            testID="bmi-value"
          >
            {bmi.toFixed(1)}
          </Text>
          <View style={[styles.bmiTag, { backgroundColor: bmiCategory.color }]}>
            <Text
              fontSize="sm"
              fontWeight="semiBold"
              color={colors.neutral.white}
              textAlign="center"
            >
              {t(`healthAssessment.heightWeight.bmi_${bmiCategory.key}`)}
            </Text>
          </View>
        </Card>
      )}
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingTop: spacingValues.xl,
  },
  subtitle: {
    marginTop: spacingValues.xs,
    marginBottom: spacingValues.xl,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.muted,
    borderRadius: borderRadiusValues.full,
    padding: spacingValues['3xs'],
    marginBottom: spacingValues.xl,
  },
  unitTab: {
    flex: 1,
    paddingVertical: spacingValues.sm,
    borderRadius: borderRadiusValues.full,
    alignItems: 'center',
  },
  unitTabActive: {
    backgroundColor: colors.journeys.health.primary,
  },
  fieldGroup: {
    marginBottom: spacingValues.lg,
  },
  label: {
    marginBottom: spacingValues.xs,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: borderRadiusValues.md,
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    fontSize: 16,
    color: theme.colors.text.default,
    backgroundColor: theme.colors.background.default,
  },
  bmiTag: {
    alignSelf: 'center',
    marginTop: spacingValues.sm,
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderRadius: borderRadiusValues.full,
  },
});

export default StepHeightWeight;
