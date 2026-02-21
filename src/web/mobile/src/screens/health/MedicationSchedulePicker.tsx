import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Snooze duration options in minutes.
 */
export const SNOOZE_OPTIONS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
];

// ---------------------------------------------------------------------------
// SnoozePicker
// ---------------------------------------------------------------------------

interface SnoozePickerProps {
  snoozeEnabled: boolean;
  onSnoozeToggle: (v: boolean) => void;
  snoozeDuration: number;
  onSnoozeDurationChange: (d: number) => void;
  journeyColors: typeof colors.journeys.health;
}

/**
 * SnoozePicker renders the snooze toggle and duration chip selector.
 */
export const SnoozePicker: React.FC<SnoozePickerProps> = ({
  snoozeEnabled,
  onSnoozeToggle,
  snoozeDuration,
  onSnoozeDurationChange,
  journeyColors,
}) => (
  <>
    <View style={styles.snoozeToggleRow}>
      <Text style={styles.snoozeLabel}>Permitir soneca</Text>
      <Switch
        value={snoozeEnabled}
        onValueChange={onSnoozeToggle}
        trackColor={{ false: colors.gray[30], true: journeyColors.primary }}
        thumbColor={colors.neutral.white}
        accessibilityLabel="Permitir soneca"
      />
    </View>
    {snoozeEnabled && (
      <View style={styles.snoozeOptionsRow}>
        <Text style={styles.snoozeOptionLabel}>Tempo de soneca:</Text>
        <View style={styles.snoozeChips}>
          {SNOOZE_OPTIONS.map((option) => (
            <View
              key={option.value}
              style={[
                styles.snoozeChip,
                snoozeDuration === option.value && {
                  backgroundColor: journeyColors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.snoozeChipText,
                  snoozeDuration === option.value && { color: colors.neutral.white },
                ]}
                onPress={() => onSnoozeDurationChange(option.value)}
              >
                {option.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )}
  </>
);

// ---------------------------------------------------------------------------
// ReminderPreview
// ---------------------------------------------------------------------------

interface ReminderPreviewProps {
  medicationName: string;
  medicationDosage: string;
  time: string;
  frequencyLabel: string;
  journeyColors: typeof colors.journeys.health;
}

/**
 * ReminderPreview renders a preview card of the configured reminder.
 */
export const ReminderPreview: React.FC<ReminderPreviewProps> = ({
  medicationName,
  medicationDosage,
  time,
  frequencyLabel,
  journeyColors,
}) => (
  <View style={[styles.previewCard, { borderLeftColor: journeyColors.primary }]}>
    <Text style={styles.previewTitle}>Lembrete de Medicamento</Text>
    <Text style={styles.previewMedName}>{medicationName}</Text>
    {medicationDosage ? (
      <Text style={styles.previewDosage}>{medicationDosage}</Text>
    ) : null}
    <View style={styles.previewTimeRow}>
      <Text style={[styles.previewTime, { color: journeyColors.primary }]}>
        {time}
      </Text>
      <Text style={styles.previewFrequency}>{frequencyLabel}</Text>
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  snoozeToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues.sm,
  },
  snoozeLabel: {
    fontSize: fontSizeValues.md,
    color: colors.gray[60],
  },
  snoozeOptionsRow: {
    marginTop: spacingValues['3xs'],
  },
  snoozeOptionLabel: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
    marginBottom: spacingValues.xs,
  },
  snoozeChips: {
    flexDirection: 'row',
    gap: spacingValues.xs,
  },
  snoozeChip: {
    borderWidth: 1,
    borderColor: colors.gray[20],
    borderRadius: borderRadiusValues.md,
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues['3xs'],
  },
  snoozeChipText: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[60],
  },
  previewCard: {
    backgroundColor: colors.gray[5],
    borderRadius: borderRadiusValues.md,
    borderLeftWidth: 4,
    padding: spacingValues.md,
  },
  previewTitle: {
    fontSize: fontSizeValues.xs,
    color: colors.gray[40],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacingValues['3xs'],
  },
  previewMedName: {
    fontSize: fontSizeValues.lg,
    fontWeight: 'bold',
    color: colors.gray[70],
  },
  previewDosage: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
    marginTop: spacingValues['4xs'],
  },
  previewTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacingValues.sm,
  },
  previewTime: {
    fontSize: fontSizeValues.xl,
    fontWeight: 'bold',
  },
  previewFrequency: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
  },
});
