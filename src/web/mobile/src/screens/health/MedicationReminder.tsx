import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { useJourney } from '../../context/JourneyContext';

/**
 * Route params for MedicationReminder screen.
 */
interface MedicationReminderParams {
  medicationName?: string;
  medicationDosage?: string;
}

/**
 * Frequency options for the reminder.
 */
type FrequencyType = 'daily' | 'weekly' | 'interval' | 'custom';

/**
 * Snooze duration options in minutes.
 */
const SNOOZE_OPTIONS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
];

/**
 * Days of the week for weekly frequency selection.
 */
const DAYS_OF_WEEK = [
  { label: 'Dom', value: 'sunday' },
  { label: 'Seg', value: 'monday' },
  { label: 'Ter', value: 'tuesday' },
  { label: 'Qua', value: 'wednesday' },
  { label: 'Qui', value: 'thursday' },
  { label: 'Sex', value: 'friday' },
  { label: 'Sab', value: 'saturday' },
];

/**
 * Frequency options for the dropdown.
 */
const FREQUENCY_OPTIONS: Array<{ label: string; value: FrequencyType }> = [
  { label: 'Diariamente', value: 'daily' },
  { label: 'Semanalmente', value: 'weekly' },
  { label: 'A cada X horas', value: 'interval' },
  { label: 'Personalizado', value: 'custom' },
];

/**
 * MedicationReminderScreen allows users to configure reminders for their medications,
 * including time, frequency, and snooze options.
 */
export const MedicationReminderScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { journey } = useJourney();

  const params = (route.params ?? {}) as MedicationReminderParams;
  const medicationName = params.medicationName ?? 'Medicamento';
  const medicationDosage = params.medicationDosage ?? '';

  // Form state
  const [time, setTime] = useState('08:00');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [intervalHours, setIntervalHours] = useState('8');
  const [snoozeEnabled, setSnoozeEnabled] = useState(true);
  const [snoozeDuration, setSnoozeDuration] = useState(10);

  const journeyColors = colors.journeys.health;

  /**
   * Toggle a day selection for weekly frequency.
   */
  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  /**
   * Handle save reminder action.
   */
  const handleSave = () => {
    // TODO: Persist reminder configuration to backend/local storage
    const reminderConfig = {
      medicationName,
      medicationDosage,
      time,
      frequency,
      selectedDays: frequency === 'weekly' ? selectedDays : [],
      intervalHours: frequency === 'interval' ? parseInt(intervalHours, 10) : null,
      snoozeEnabled,
      snoozeDuration: snoozeEnabled ? snoozeDuration : null,
    };
    console.log('Reminder saved:', reminderConfig);
    navigation.goBack();
  };

  /**
   * Handle cancel action.
   */
  const handleCancel = () => {
    navigation.goBack();
  };

  /**
   * Get the frequency label for preview.
   */
  const getFrequencyLabel = (): string => {
    switch (frequency) {
      case 'daily':
        return 'Todos os dias';
      case 'weekly':
        return selectedDays.length > 0
          ? DAYS_OF_WEEK.filter(d => selectedDays.includes(d.value)).map(d => d.label).join(', ')
          : 'Selecione os dias';
      case 'interval':
        return `A cada ${intervalHours} horas`;
      case 'custom':
        return 'Personalizado';
      default:
        return '';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Medication name header */}
      <View style={styles.header}>
        <Text style={[styles.medicationName, { color: journeyColors.primary }]}>
          {medicationName}
        </Text>
        {medicationDosage ? (
          <Text style={styles.medicationDosage}>{medicationDosage}</Text>
        ) : null}
      </View>

      {/* Section: Horario do Lembrete */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: journeyColors.accent }]}>
          Horario do Lembrete
        </Text>
        <View style={styles.timeInputContainer}>
          <TextInput
            style={[styles.timeInput, { borderColor: journeyColors.primary }]}
            value={time}
            onChangeText={setTime}
            placeholder="HH:MM"
            placeholderTextColor={colors.gray[40]}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            accessibilityLabel="Horario do lembrete"
          />
          <Text style={styles.timeHint}>Formato 24h (ex: 08:00, 14:30)</Text>
        </View>
      </View>

      {/* Section: Frequencia */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: journeyColors.accent }]}>
          Frequencia
        </Text>
        <View style={styles.frequencyOptions}>
          {FREQUENCY_OPTIONS.map(option => (
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
                onPress={() => setFrequency(option.value)}
              >
                {option.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Weekly day selector */}
        {frequency === 'weekly' && (
          <View style={styles.daysContainer}>
            {DAYS_OF_WEEK.map(day => (
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
                  onPress={() => toggleDay(day.value)}
                >
                  {day.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Interval input */}
        {frequency === 'interval' && (
          <View style={styles.intervalContainer}>
            <Text style={styles.intervalLabel}>A cada</Text>
            <TextInput
              style={[styles.intervalInput, { borderColor: journeyColors.primary }]}
              value={intervalHours}
              onChangeText={setIntervalHours}
              keyboardType="numeric"
              maxLength={2}
              accessibilityLabel="Intervalo em horas"
            />
            <Text style={styles.intervalLabel}>horas</Text>
          </View>
        )}
      </View>

      {/* Section: Opcoes de Soneca */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: journeyColors.accent }]}>
          Opcoes de Soneca
        </Text>
        <View style={styles.snoozeToggleRow}>
          <Text style={styles.snoozeLabel}>Permitir soneca</Text>
          <Switch
            value={snoozeEnabled}
            onValueChange={setSnoozeEnabled}
            trackColor={{ false: colors.gray[30], true: journeyColors.primary }}
            thumbColor={colors.neutral.white}
            accessibilityLabel="Permitir soneca"
          />
        </View>
        {snoozeEnabled && (
          <View style={styles.snoozeOptionsRow}>
            <Text style={styles.snoozeOptionLabel}>Tempo de soneca:</Text>
            <View style={styles.snoozeChips}>
              {SNOOZE_OPTIONS.map(option => (
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
                    onPress={() => setSnoozeDuration(option.value)}
                  >
                    {option.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Section: Pre-visualizacao */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: journeyColors.accent }]}>
          Pre-visualizacao
        </Text>
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
            <Text style={styles.previewFrequency}>{getFrequencyLabel()}</Text>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <View style={[styles.primaryButton, { backgroundColor: journeyColors.primary }]}>
          <Text style={styles.primaryButtonText} onPress={handleSave}>
            Salvar Lembrete
          </Text>
        </View>
        <View style={[styles.secondaryButton, { borderColor: journeyColors.primary }]}>
          <Text
            style={[styles.secondaryButtonText, { color: journeyColors.primary }]}
            onPress={handleCancel}
          >
            Cancelar
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  contentContainer: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['4xl'],
  },
  header: {
    marginBottom: spacingValues.xl,
    alignItems: 'center',
  },
  medicationName: {
    fontSize: fontSizeValues.xl,
    fontWeight: 'bold',
  },
  medicationDosage: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
    marginTop: spacingValues['3xs'],
  },
  section: {
    marginBottom: spacingValues.xl,
  },
  sectionTitle: {
    fontSize: fontSizeValues.lg,
    fontWeight: '600',
    marginBottom: spacingValues.sm,
  },
  timeInputContainer: {
    alignItems: 'flex-start',
  },
  timeInput: {
    fontSize: fontSizeValues['2xl'],
    fontWeight: 'bold',
    borderWidth: 2,
    borderRadius: borderRadiusValues.md,
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    textAlign: 'center',
    minWidth: 120,
    color: colors.gray[70],
  },
  timeHint: {
    fontSize: fontSizeValues.xs,
    color: colors.gray[40],
    marginTop: spacingValues['3xs'],
  },
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
  buttonContainer: {
    marginTop: spacingValues.lg,
    gap: spacingValues.sm,
  },
  primaryButton: {
    borderRadius: borderRadiusValues.md,
    paddingVertical: spacingValues.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.neutral.white,
    fontSize: fontSizeValues.md,
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: borderRadiusValues.md,
    borderWidth: 2,
    paddingVertical: spacingValues.md,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: fontSizeValues.md,
    fontWeight: '600',
  },
});

export default MedicationReminderScreen;
