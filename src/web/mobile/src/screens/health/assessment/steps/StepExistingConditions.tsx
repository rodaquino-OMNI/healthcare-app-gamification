import React, { useCallback } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../../design-system/src/themes/base.theme';

interface StepProps {
  data: Record<string, any>;
  onUpdate: (field: string, value: any) => void;
}

const CONDITION_KEYS = [
  'diabetes',
  'hypertension',
  'asthma',
  'heartDisease',
  'arthritis',
  'depression',
  'anxiety',
  'thyroid',
  'migraine',
  'backPain',
  'allergicRhinitis',
  'gastritis',
] as const;

/**
 * StepExistingConditions lets users select from common conditions
 * and add custom ones. Selected conditions appear as highlighted chips.
 */
export const StepExistingConditions: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const selected: string[] = data.selected || [];

  const handleToggle = useCallback(
    (condition: string) => {
      const isSelected = selected.includes(condition);
      const updated = isSelected
        ? selected.filter((c: string) => c !== condition)
        : [...selected, condition];
      onUpdate('selected', updated);
    },
    [selected, onUpdate],
  );

  return (
    <View style={styles.container} testID="step-existing-conditions">
      {/* Title */}
      <Text variant="heading" fontSize="heading-lg" journey="health">
        {t('healthAssessment.conditions.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.conditions.subtitle')}
      </Text>

      {/* Conditions Grid */}
      <View style={styles.conditionsGrid}>
        {CONDITION_KEYS.map((key) => {
          const isActive = selected.includes(key);
          return (
            <Touchable
              key={key}
              onPress={() => handleToggle(key)}
              accessibilityLabel={t(`healthAssessment.conditions.${key}`)}
              accessibilityRole="checkbox"
              testID={`condition-${key}`}
              style={[
                styles.conditionChip,
                isActive && styles.conditionChipActive,
              ]}
            >
              <View style={styles.chipContent}>
                <View
                  style={[
                    styles.checkbox,
                    isActive && styles.checkboxActive,
                  ]}
                >
                  {isActive && (
                    <Text
                      fontSize="xs"
                      color={colors.neutral.white}
                      textAlign="center"
                    >
                      {'\u2713'}
                    </Text>
                  )}
                </View>
                <Text
                  fontSize="sm"
                  fontWeight={isActive ? 'semiBold' : 'regular'}
                  color={
                    isActive
                      ? colors.journeys.health.primary
                      : colors.neutral.gray700
                  }
                >
                  {t(`healthAssessment.conditions.${key}`)}
                </Text>
              </View>
            </Touchable>
          );
        })}
      </View>

      {/* Selected Tags */}
      {selected.length > 0 && (
        <View style={styles.tagsSection}>
          <Text fontWeight="medium" fontSize="sm" style={styles.tagsLabel}>
            {t('healthAssessment.conditions.selectedLabel')}
          </Text>
          <View style={styles.tagsRow}>
            {selected.map((key: string) => (
              <View key={key} style={styles.tag}>
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color={colors.neutral.white}
                >
                  {t(`healthAssessment.conditions.${key}`)}
                </Text>
                <Touchable
                  onPress={() => handleToggle(key)}
                  accessibilityLabel={t('healthAssessment.conditions.remove')}
                  accessibilityRole="button"
                  testID={`remove-${key}`}
                  style={styles.tagRemove}
                >
                  <Text fontSize="xs" color={colors.neutral.white}>
                    {'\u2715'}
                  </Text>
                </Touchable>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Other Input */}
      <View style={styles.otherSection}>
        <Text fontWeight="medium" fontSize="sm" style={styles.label}>
          {t('healthAssessment.conditions.otherLabel')}
        </Text>
        <TextInput
          style={styles.textInput}
          value={data.other || ''}
          onChangeText={(text) => onUpdate('other', text)}
          placeholder={t('healthAssessment.conditions.otherPlaceholder')}
          placeholderTextColor={colors.neutral.gray500}
          multiline
          numberOfLines={2}
          testID="input-other-conditions"
        />
      </View>
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
  conditionsGrid: {
    gap: spacingValues.xs,
  },
  conditionChip: {
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.md,
    borderRadius: borderRadiusValues.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  conditionChipActive: {
    borderColor: colors.journeys.health.primary,
    backgroundColor: colors.journeys.health.background,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: borderRadiusValues.xs,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingValues.sm,
  },
  checkboxActive: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  tagsSection: {
    marginTop: spacingValues.xl,
  },
  tagsLabel: {
    marginBottom: spacingValues.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.journeys.health.primary,
    borderRadius: borderRadiusValues.full,
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues.xs,
  },
  tagRemove: {
    marginLeft: spacingValues.xs,
  },
  otherSection: {
    marginTop: spacingValues.xl,
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
    minHeight: 60,
    textAlignVertical: 'top',
  },
});

export default StepExistingConditions;
