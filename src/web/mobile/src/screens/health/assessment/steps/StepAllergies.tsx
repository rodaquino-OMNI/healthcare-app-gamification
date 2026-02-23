import React, { useCallback } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';

interface StepProps {
  data: Record<string, any>;
  onUpdate: (field: string, value: any) => void;
}

const ALLERGEN_KEYS = [
  'penicillin',
  'sulfa',
  'latex',
  'peanuts',
  'shellfish',
  'eggs',
  'milk',
  'soy',
  'wheat',
  'treeNuts',
] as const;

type Severity = 'mild' | 'moderate' | 'severe';

const SEVERITY_OPTIONS: Severity[] = ['mild', 'moderate', 'severe'];

const SEVERITY_COLORS: Record<Severity, string> = {
  mild: colors.semantic.info,
  moderate: colors.semantic.warning,
  severe: colors.semantic.error,
};

/**
 * StepAllergies lets users select common allergens with severity levels.
 * Supports toggle selection and a free-text "other" input.
 */
export const StepAllergies: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const selected: string[] = data.selected || [];
  const severities: Record<string, Severity> = data.severities || {};

  const handleToggle = useCallback(
    (allergen: string) => {
      const isSelected = selected.includes(allergen);
      if (isSelected) {
        onUpdate(
          'selected',
          selected.filter((a: string) => a !== allergen),
        );
        const updatedSeverities = { ...severities };
        delete updatedSeverities[allergen];
        onUpdate('severities', updatedSeverities);
      } else {
        onUpdate('selected', [...selected, allergen]);
        onUpdate('severities', { ...severities, [allergen]: 'mild' });
      }
    },
    [selected, severities, onUpdate],
  );

  const handleSeverityChange = useCallback(
    (allergen: string, severity: Severity) => {
      onUpdate('severities', { ...severities, [allergen]: severity });
    },
    [severities, onUpdate],
  );

  return (
    <View style={styles.container} testID="step-allergies">
      {/* Title */}
      <Text variant="heading" fontSize="heading-lg" journey="health">
        {t('healthAssessment.allergies.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.allergies.subtitle')}
      </Text>

      {/* Allergen Chips */}
      <View style={styles.chipsContainer}>
        {ALLERGEN_KEYS.map((key) => {
          const isActive = selected.includes(key);
          return (
            <Touchable
              key={key}
              onPress={() => handleToggle(key)}
              accessibilityLabel={t(`healthAssessment.allergies.${key}`)}
              accessibilityRole="checkbox"
              testID={`allergen-${key}`}
              style={[
                styles.allergenChip,
                isActive && styles.allergenChipActive,
              ]}
            >
              <Text
                fontSize="sm"
                fontWeight={isActive ? 'semiBold' : 'regular'}
                color={
                  isActive
                    ? colors.neutral.white
                    : colors.neutral.gray700
                }
              >
                {t(`healthAssessment.allergies.${key}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Severity Selectors for Selected Allergens */}
      {selected.length > 0 && (
        <View style={styles.severitySection}>
          <Text fontWeight="semiBold" fontSize="md" style={styles.severityTitle}>
            {t('healthAssessment.allergies.severityTitle')}
          </Text>
          {selected.map((allergen: string) => {
            const currentSeverity = severities[allergen] || 'mild';
            return (
              <View
                key={`sev-${allergen}`}
                style={styles.severityRow}
                testID={`severity-row-${allergen}`}
              >
                <Text fontSize="sm" fontWeight="medium" style={styles.severityLabel}>
                  {t(`healthAssessment.allergies.${allergen}`)}
                </Text>
                <View style={styles.severityBadges}>
                  {SEVERITY_OPTIONS.map((sev) => (
                    <Touchable
                      key={sev}
                      onPress={() => handleSeverityChange(allergen, sev)}
                      accessibilityLabel={t(
                        `healthAssessment.allergies.severity_${sev}`,
                      )}
                      accessibilityRole="button"
                      testID={`sev-${allergen}-${sev}`}
                      style={[
                        styles.severityBadge,
                        {
                          backgroundColor:
                            currentSeverity === sev
                              ? SEVERITY_COLORS[sev]
                              : colors.neutral.gray200,
                        },
                      ]}
                    >
                      <Text
                        fontSize="xs"
                        fontWeight={
                          currentSeverity === sev ? 'semiBold' : 'regular'
                        }
                        color={
                          currentSeverity === sev
                            ? colors.neutral.white
                            : colors.neutral.gray600
                        }
                      >
                        {t(`healthAssessment.allergies.severity_${sev}`)}
                      </Text>
                    </Touchable>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Other Allergies Input */}
      <View style={styles.otherSection}>
        <Text fontWeight="medium" fontSize="sm" style={styles.label}>
          {t('healthAssessment.allergies.otherLabel')}
        </Text>
        <TextInput
          style={styles.textInput}
          value={data.other || ''}
          onChangeText={(text) => onUpdate('other', text)}
          placeholder={t('healthAssessment.allergies.otherPlaceholder')}
          placeholderTextColor={colors.neutral.gray500}
          multiline
          numberOfLines={2}
          testID="input-other-allergies"
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
  },
  allergenChip: {
    paddingVertical: spacingValues.xs,
    paddingHorizontal: spacingValues.md,
    borderRadius: borderRadiusValues.full,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  allergenChipActive: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  severitySection: {
    marginTop: spacingValues.xl,
  },
  severityTitle: {
    marginBottom: spacingValues.sm,
  },
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  severityLabel: {
    flex: 1,
  },
  severityBadges: {
    flexDirection: 'row',
    gap: spacingValues.xs,
  },
  severityBadge: {
    paddingVertical: spacingValues['3xs'],
    paddingHorizontal: spacingValues.sm,
    borderRadius: borderRadiusValues.full,
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

export default StepAllergies;
