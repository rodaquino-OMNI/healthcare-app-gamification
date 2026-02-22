import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { useTranslation } from 'react-i18next';

/**
 * Route params for MedicationAlarm screen.
 */
interface MedicationAlarmParams {
  medicationName?: string;
  medicationDosage?: string;
  nextDoseTime?: string;
  snoozeDuration?: number;
}

/**
 * MedicationAlarmScreen displays a fullscreen alarm-style notification
 * when it is time for the user to take their medication.
 *
 * Actions available:
 * - "Tomar Agora" (take now) - confirms the dose was taken
 * - "Soneca" (snooze) - snooze the alarm for a configured duration
 * - "Pular" (skip) - skip this dose
 */
export const MedicationAlarmScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const route = useRoute<any>();
  const navigation = useNavigation();

  const params = (route.params ?? {}) as MedicationAlarmParams;
  const medicationName = params.medicationName ?? 'Medicamento';
  const medicationDosage = params.medicationDosage ?? '1 comprimido de 500mg';
  const nextDoseTime = params.nextDoseTime ?? '';
  const snoozeDuration = params.snoozeDuration ?? 10;

  const journeyColors = colors.journeys.health;

  // Current time display
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Handle "Tomar Agora" (take now) action.
   */
  const handleTakeNow = () => {
    // TODO: Record dose taken event to backend
    console.log('Dose taken:', { medicationName, time: new Date().toISOString() });
    navigation.goBack();
  };

  /**
   * Handle "Soneca" (snooze) action.
   */
  const handleSnooze = () => {
    // TODO: Schedule a new alarm after snoozeDuration minutes
    console.log('Snoozed for', snoozeDuration, 'minutes');
    navigation.goBack();
  };

  /**
   * Handle "Pular" (skip) action.
   */
  const handleSkip = () => {
    // TODO: Record skipped dose event to backend
    console.log('Dose skipped:', { medicationName, time: new Date().toISOString() });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Medication icon placeholder */}
        <View style={[styles.iconContainer, { backgroundColor: journeyColors.background }]}>
          <Text style={[styles.iconText, { color: journeyColors.primary }]}>+</Text>
        </View>

        {/* Medication name */}
        <Text style={[styles.medicationName, { color: journeyColors.primary }]}>
          {medicationName}
        </Text>

        {/* Dosage info */}
        <Text style={styles.dosageText}>{medicationDosage}</Text>

        {/* Current time */}
        <Text style={styles.currentTime}>{currentTime}</Text>

        {/* Action buttons */}
        <View style={styles.actionsContainer}>
          {/* Tomar Agora - primary action */}
          <View style={[styles.actionButton, styles.takeNowButton, { backgroundColor: journeyColors.primary }]}>
            <Text style={styles.takeNowText} onPress={handleTakeNow}>
              {t('journeys.health.medication.doseTaken.takeNow')}
            </Text>
          </View>

          {/* Soneca - secondary action */}
          <View style={[styles.actionButton, styles.snoozeButton, { borderColor: journeyColors.secondary }]}>
            <Text
              style={[styles.snoozeText, { color: journeyColors.secondary }]}
              onPress={handleSnooze}
            >
              {t('journeys.health.medication.doseTaken.snooze', { duration: snoozeDuration })}
            </Text>
          </View>

          {/* Pular - ghost action */}
          <View style={[styles.actionButton, styles.skipButton]}>
            <Text style={styles.skipText} onPress={handleSkip}>
              {t('journeys.health.medication.doseTaken.skip')}
            </Text>
          </View>
        </View>

        {/* Next dose countdown */}
        {nextDoseTime ? (
          <View style={styles.nextDoseContainer}>
            <Text style={styles.nextDoseLabel}>{t('journeys.health.medication.doseTaken.nextDose')}</Text>
            <Text style={[styles.nextDoseTime, { color: journeyColors.primary }]}>
              {nextDoseTime}
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacingValues['2xl'],
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingValues.xl,
  },
  iconText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  medicationName: {
    fontSize: fontSizeValues['2xl'],
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacingValues.xs,
  },
  dosageText: {
    fontSize: fontSizeValues.md,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginBottom: spacingValues.xl,
  },
  currentTime: {
    fontSize: 56,
    fontWeight: 'bold',
    color: colors.gray[70],
    marginBottom: spacingValues['3xl'],
  },
  actionsContainer: {
    width: '100%',
    gap: spacingValues.sm,
  },
  actionButton: {
    borderRadius: borderRadiusValues.lg,
    paddingVertical: spacingValues.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  takeNowButton: {
    // backgroundColor set dynamically
  },
  takeNowText: {
    color: theme.colors.text.onBrand,
    fontSize: fontSizeValues.lg,
    fontWeight: 'bold',
  },
  snoozeButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  snoozeText: {
    fontSize: fontSizeValues.md,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: 'transparent',
  },
  skipText: {
    fontSize: fontSizeValues.md,
    color: theme.colors.text.subtle,
    fontWeight: '500',
  },
  nextDoseContainer: {
    marginTop: spacingValues['3xl'],
    alignItems: 'center',
  },
  nextDoseLabel: {
    fontSize: fontSizeValues.sm,
    color: theme.colors.text.subtle,
    marginBottom: spacingValues['3xs'],
  },
  nextDoseTime: {
    fontSize: fontSizeValues.lg,
    fontWeight: '600',
  },
});

export default MedicationAlarmScreen;
