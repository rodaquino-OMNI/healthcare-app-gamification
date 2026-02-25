import React, { useCallback } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';

interface StepProps {
  data: Record<string, any>;
  onUpdate: (field: string, value: any) => void;
}

interface MedicationEntry {
  name: string;
  dosage: string;
  frequency: string;
}

const FREQUENCY_OPTIONS = ['daily', 'weekly', 'monthly'] as const;
const createEmptyEntry = (): MedicationEntry => ({ name: '', dosage: '', frequency: 'daily' });

/**
 * StepMedications collects current medication information.
 * Supports a dynamic list of medication entries with add/remove.
 */
export const StepMedications: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const takesMedications: boolean = data.takesMedications || false;
  const medicationList: MedicationEntry[] = data.list || [];

  const handleToggleTakes = useCallback((value: boolean) => {
    onUpdate('takesMedications', value);
    if (value && medicationList.length === 0) onUpdate('list', [createEmptyEntry()]);
  }, [medicationList.length, onUpdate]);

  const handleAddMedication = useCallback(() => {
    onUpdate('list', [...medicationList, createEmptyEntry()]);
  }, [medicationList, onUpdate]);

  const handleRemoveMedication = useCallback((index: number) => {
    onUpdate('list', medicationList.filter((_, i) => i !== index));
  }, [medicationList, onUpdate]);

  const handleEntryUpdate = useCallback(
    (index: number, field: keyof MedicationEntry, value: string) => {
      const updated = medicationList.map((e, i) => (i === index ? { ...e, [field]: value } : e));
      onUpdate('list', updated);
    },
    [medicationList, onUpdate],
  );

  const renderToggleBtn = (value: boolean, labelKey: string, testId: string) => {
    const isActive = takesMedications === value;
    return (
      <Touchable
        onPress={() => handleToggleTakes(value)}
        accessibilityLabel={t(`healthAssessment.medications.${labelKey}`)}
        accessibilityRole="button"
        testID={testId}
        style={[styles.toggleOption, isActive && styles.toggleOptionActive] as any}
      >
        <Text
          fontSize="md"
          fontWeight={isActive ? 'semiBold' : 'regular'}
          color={isActive ? colors.neutral.white : colors.neutral.gray700}
        >
          {t(`healthAssessment.medications.${labelKey}`)}
        </Text>
      </Touchable>
    );
  };

  return (
    <View style={styles.container} testID="step-medications">
      <Text variant="heading" fontSize="heading-lg" journey="health">
        {t('healthAssessment.medications.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.medications.subtitle')}
      </Text>

      <View style={styles.toggleRow}>
        {renderToggleBtn(true, 'yes', 'medications-yes')}
        {renderToggleBtn(false, 'no', 'medications-no')}
      </View>

      {takesMedications && medicationList.map((entry, index) => (
        <Card key={`med-${index}`} journey="health" elevation="sm" padding="md">
          <View style={styles.entryHeader}>
            <Text fontWeight="semiBold" fontSize="sm">
              {t('healthAssessment.medications.medicationNumber', { number: index + 1 })}
            </Text>
            {medicationList.length > 1 && (
              <Touchable
                onPress={() => handleRemoveMedication(index)}
                accessibilityLabel={t('healthAssessment.medications.remove')}
                accessibilityRole="button"
                testID={`remove-med-${index}`}
              >
                <Text fontSize="md" color={colors.semantic.error}>{'\u2715'}</Text>
              </Touchable>
            )}
          </View>
          <View style={styles.entryField}>
            <Text fontSize="sm" fontWeight="medium" style={styles.entryLabel}>
              {t('healthAssessment.medications.name')}
            </Text>
            <TextInput
              style={styles.textInput}
              value={entry.name}
              onChangeText={(v) => handleEntryUpdate(index, 'name', v)}
              placeholder={t('healthAssessment.medications.namePlaceholder')}
              placeholderTextColor={colors.neutral.gray500}
              testID={`med-name-${index}`}
            />
          </View>
          <View style={styles.entryField}>
            <Text fontSize="sm" fontWeight="medium" style={styles.entryLabel}>
              {t('healthAssessment.medications.dosage')}
            </Text>
            <TextInput
              style={styles.textInput}
              value={entry.dosage}
              onChangeText={(v) => handleEntryUpdate(index, 'dosage', v)}
              placeholder={t('healthAssessment.medications.dosagePlaceholder')}
              placeholderTextColor={colors.neutral.gray500}
              testID={`med-dosage-${index}`}
            />
          </View>
          <View style={styles.entryField}>
            <Text fontSize="sm" fontWeight="medium" style={styles.entryLabel}>
              {t('healthAssessment.medications.frequency')}
            </Text>
            <View style={styles.frequencyRow}>
              {FREQUENCY_OPTIONS.map((freq) => (
                <Touchable
                  key={freq}
                  onPress={() => handleEntryUpdate(index, 'frequency', freq)}
                  accessibilityLabel={t(`healthAssessment.medications.freq_${freq}`)}
                  accessibilityRole="button"
                  testID={`med-freq-${freq}-${index}`}
                  style={[styles.freqPill, entry.frequency === freq && styles.freqPillActive] as any}
                >
                  <Text
                    fontSize="xs"
                    fontWeight={entry.frequency === freq ? 'semiBold' : 'regular'}
                    color={entry.frequency === freq ? colors.neutral.white : colors.neutral.gray700}
                  >
                    {t(`healthAssessment.medications.freq_${freq}`)}
                  </Text>
                </Touchable>
              ))}
            </View>
          </View>
        </Card>
      ))}

      {takesMedications && (
        <View style={styles.addContainer}>
          <Button
            variant="secondary"
            journey="health"
            onPress={handleAddMedication}
            accessibilityLabel={t('healthAssessment.medications.addAnother')}
            testID="add-medication-button"
          >
            {t('healthAssessment.medications.addAnother')}
          </Button>
        </View>
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
  toggleRow: {
    flexDirection: 'row',
    gap: spacingValues.sm,
    marginBottom: spacingValues.xl,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: spacingValues.md,
    borderRadius: borderRadiusValues.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
  },
  toggleOptionActive: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues.sm,
  },
  entryField: {
    marginBottom: spacingValues.sm,
  },
  entryLabel: {
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
  frequencyRow: {
    flexDirection: 'row',
    gap: spacingValues.xs,
  },
  freqPill: {
    flex: 1,
    paddingVertical: spacingValues.xs,
    borderRadius: borderRadiusValues.full,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
  },
  freqPillActive: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  addContainer: {
    marginTop: spacingValues.md,
  },
});

export default StepMedications;
