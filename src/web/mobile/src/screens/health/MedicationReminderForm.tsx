import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { fontSizeValues } from '@design-system/tokens/typography';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Frequency options for the reminder.
 */
export type FrequencyType = 'daily' | 'weekly' | 'interval' | 'custom';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Frequency options for the dropdown.
 */
export const FREQUENCY_OPTIONS: Array<{ label: string; value: FrequencyType }> = [
  { label: 'Diariamente', value: 'daily' },
  { label: 'Semanalmente', value: 'weekly' },
  { label: 'A cada X horas', value: 'interval' },
  { label: 'Personalizado', value: 'custom' },
];

/**
 * Days of the week for weekly frequency selection.
 */
export const DAYS_OF_WEEK = [
  { label: 'Dom', value: 'sunday' },
  { label: 'Seg', value: 'monday' },
  { label: 'Ter', value: 'tuesday' },
  { label: 'Qua', value: 'wednesday' },
  { label: 'Qui', value: 'thursday' },
  { label: 'Sex', value: 'friday' },
  { label: 'Sab', value: 'saturday' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface FrequencyPickerProps {
  frequency: FrequencyType;
  onFrequencyChange: (f: FrequencyType) => void;
  selectedDays: string[];
  onToggleDay: (day: string) => void;
  intervalHours: string;
  onIntervalChange: (h: string) => void;
  journeyColors: typeof colors.journeys.health;
}

/**
 * FrequencyPicker renders frequency options, weekly day selector,
 * and interval input for medication reminders.
 */
export const FrequencyPicker: React.FC<FrequencyPickerProps> = ({
  frequency,
  onFrequencyChange,
  selectedDays,
  onToggleDay,
  intervalHours,
  onIntervalChange,
  journeyColors,
}) => {
  const { t } = useTranslation();

  const frequencyLabels: Record<FrequencyType, string> = {
    daily: t('journeys.health.medication.reminder.frequency.daily'),
    weekly: t('journeys.health.medication.reminder.frequency.weekly'),
    interval: t('journeys.health.medication.reminder.frequency.interval'),
    custom: t('journeys.health.medication.reminder.frequency.custom'),
  };

  const dayLabels: Record<string, string> = {
    sunday: t('common.days.sun'),
    monday: t('common.days.mon'),
    tuesday: t('common.days.tue'),
    wednesday: t('common.days.wed'),
    thursday: t('common.days.thu'),
    friday: t('common.days.fri'),
    saturday: t('common.days.sat'),
  };

  return (
  <>
    <View style={styles.frequencyOptions}>
      {FREQUENCY_OPTIONS.map((option) => (
        <View
          key={option.value}
          style={[
            styles.frequencyOption,
            frequency === option.value && {
              backgroundColor: journeyColors.background,
              borderColor: journeyColors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.frequencyOptionText,
              frequency === option.value && { color: journeyColors.primary, fontWeight: '600' as const },
            ]}
            onPress={() => onFrequencyChange(option.value)}
          >
            {frequencyLabels[option.value] || option.label}
          </Text>
        </View>
      ))}
    </View>

    {/* Weekly day selector */}
    {frequency === 'weekly' && (
      <View style={styles.daysContainer}>
        {DAYS_OF_WEEK.map((day) => (
          <View
            key={day.value}
            style={[
              styles.dayChip,
              selectedDays.includes(day.value) && {
                backgroundColor: journeyColors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.dayChipText,
                selectedDays.includes(day.value) && { color: colors.neutral.white },
              ]}
              onPress={() => onToggleDay(day.value)}
            >
              {dayLabels[day.value] || day.label}
            </Text>
          </View>
        ))}
      </View>
    )}

    {/* Interval input */}
    {frequency === 'interval' && (
      <View style={styles.intervalContainer}>
        <Text style={styles.intervalLabel}>{t('journeys.health.medication.reminder.every')}</Text>
        <TextInput
          style={[styles.intervalInput, { borderColor: journeyColors.primary }]}
          value={intervalHours}
          onChangeText={onIntervalChange}
          keyboardType="numeric"
          maxLength={2}
          accessibilityLabel={t('journeys.health.medication.reminder.intervalHours')}
        />
        <Text style={styles.intervalLabel}>{t('journeys.health.medication.reminder.hours')}</Text>
      </View>
    )}
  </>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  frequencyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
  },
  frequencyOption: {
    borderWidth: 1,
    borderColor: colors.gray[20],
    borderRadius: borderRadiusValues.md,
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
  },
  frequencyOptionText: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[60],
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
    marginTop: spacingValues.sm,
  },
  dayChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.gray[20],
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayChipText: {
    fontSize: fontSizeValues.xs,
    color: colors.gray[60],
    textAlign: 'center',
  },
  intervalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.xs,
    marginTop: spacingValues.sm,
  },
  intervalLabel: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[60],
  },
  intervalInput: {
    fontSize: fontSizeValues.lg,
    fontWeight: 'bold',
    borderWidth: 2,
    borderRadius: borderRadiusValues.md,
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues['3xs'],
    textAlign: 'center',
    width: 60,
    color: colors.gray[70],
  },
});
