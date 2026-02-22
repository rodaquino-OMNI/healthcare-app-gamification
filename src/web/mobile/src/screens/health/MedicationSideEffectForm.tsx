import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

type SeverityLevel = 'mild' | 'moderate' | 'severe';

interface EffectType {
  id: string;
  label: string;
}

const COMMON_EFFECTS: EffectType[] = [
  { id: 'nausea', label: 'Nausea' },
  { id: 'headache', label: 'Headache' },
  { id: 'dizziness', label: 'Dizziness' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'insomnia', label: 'Insomnia' },
  { id: 'rash', label: 'Rash' },
  { id: 'other', label: 'Other' },
];

const SEVERITY_OPTIONS: { key: SeverityLevel; label: string; color: string }[] = [
  { key: 'mild', label: 'Mild', color: colors.semantic.info },
  { key: 'moderate', label: 'Moderate', color: colors.semantic.warning },
  { key: 'severe', label: 'Severe', color: colors.semantic.error },
];

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * MedicationSideEffectForm provides a form for reporting a new side effect
 * with type selection, severity, date, and notes.
 */
export const MedicationSideEffectForm: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [severity, setSeverity] = useState<SeverityLevel | null>(null);
  const [date] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');

  const handleSubmit = useCallback(() => {
    if (!selectedEffect) {
      Alert.alert(
        t('medication.validationError'),
        t('medication.selectSideEffect'),
      );
      return;
    }
    if (!severity) {
      Alert.alert(
        t('medication.validationError'),
        t('medication.selectSeverity'),
      );
      return;
    }
    // In production, send to API
    navigation.goBack();
  }, [selectedEffect, severity, navigation, t]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('medication.goBack')}
          accessibilityRole="button"
          testID="back-button"
        >
          <Text fontSize="lg" color={colors.journeys.health.primary}>
            {t('medication.back')}
          </Text>
        </Touchable>
        <Text variant="heading" journey="health">
          {t('medication.reportSideEffect')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Effect Type Selector */}
        <View style={styles.sectionContainer}>
          <Text fontWeight="semiBold" fontSize="lg" journey="health">
            {t('medication.sideEffectType')}
          </Text>
          <View style={styles.effectGrid}>
            {COMMON_EFFECTS.map((effect) => (
              <Touchable
                key={effect.id}
                onPress={() => setSelectedEffect(effect.id)}
                accessibilityLabel={`${t('medication.select')} ${effect.label}`}
                accessibilityRole="button"
                testID={`effect-${effect.id}`}
                style={[
                  styles.effectChip,
                  selectedEffect === effect.id && styles.effectChipSelected,
                ]}
              >
                <Text
                  fontSize="sm"
                  fontWeight={selectedEffect === effect.id ? 'semiBold' : 'regular'}
                  color={
                    selectedEffect === effect.id
                      ? colors.journeys.health.primary
                      : colors.neutral.gray700
                  }
                >
                  {effect.label}
                </Text>
              </Touchable>
            ))}
          </View>
        </View>

        {/* Severity Selector */}
        <View style={styles.sectionContainer}>
          <Text fontWeight="semiBold" fontSize="lg" journey="health">
            {t('medication.severity')}
          </Text>
          <View style={styles.severityRow}>
            {SEVERITY_OPTIONS.map((option) => (
              <Touchable
                key={option.key}
                onPress={() => setSeverity(option.key)}
                accessibilityLabel={`${t('medication.severity')}: ${option.label}`}
                accessibilityRole="button"
                testID={`severity-${option.key}`}
                style={[
                  styles.severityOption,
                  severity === option.key && {
                    backgroundColor: option.color,
                    borderColor: option.color,
                  },
                ]}
              >
                <Text
                  fontSize="sm"
                  fontWeight={severity === option.key ? 'semiBold' : 'regular'}
                  color={
                    severity === option.key
                      ? colors.neutral.white
                      : colors.neutral.gray700
                  }
                >
                  {option.label}
                </Text>
              </Touchable>
            ))}
          </View>
        </View>

        {/* Date Display */}
        <View style={styles.sectionContainer}>
          <Text fontWeight="semiBold" fontSize="lg" journey="health">
            {t('medication.date')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <Text fontSize="md" color={colors.neutral.gray700} testID="date-display">
              {formatDate(date)}
            </Text>
          </Card>
        </View>

        {/* Notes Input */}
        <View style={styles.sectionContainer}>
          <Text fontWeight="semiBold" fontSize="lg" journey="health">
            {t('medication.notes')}
          </Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder={t('medication.notesPlaceholder')}
            placeholderTextColor={colors.neutral.gray500}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            accessibilityLabel={t('medication.notes')}
            testID="notes-input"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            variant="primary"
            journey="health"
            onPress={handleSubmit}
            accessibilityLabel={t('medication.submitReport')}
            testID="submit-button"
          >
            {t('medication.submitReport')}
          </Button>
          <View style={styles.actionSpacer} />
          <Button
            variant="secondary"
            journey="health"
            onPress={handleCancel}
            accessibilityLabel={t('medication.cancel')}
            testID="cancel-button"
          >
            {t('medication.cancel')}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
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
  },
  effectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.sm,
    marginTop: spacingValues.sm,
  },
  effectChip: {
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  effectChipSelected: {
    borderColor: colors.journeys.health.primary,
    backgroundColor: colors.journeys.health.background,
  },
  severityRow: {
    flexDirection: 'row',
    gap: spacingValues.sm,
    marginTop: spacingValues.sm,
  },
  severityOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacingValues.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  notesInput: {
    marginTop: spacingValues.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: 8,
    padding: spacingValues.md,
    minHeight: 100,
    fontSize: 14,
    color: theme.colors.text.default,
    backgroundColor: theme.colors.background.default,
  },
  actionsContainer: {
    marginTop: spacingValues['2xl'],
    paddingBottom: spacingValues.xl,
  },
  actionSpacer: {
    height: spacingValues.sm,
  },
});

export default MedicationSideEffectForm;
