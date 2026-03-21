/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { fontSizeValues } from '@design-system/tokens/typography';
import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useTheme } from 'styled-components/native';

import { FrequencyType, FrequencyPicker, DAYS_OF_WEEK } from './MedicationReminderForm';
import { SnoozePicker, ReminderPreview } from './MedicationSchedulePicker';
import { restClient } from '../../api/client';
import { useJourney } from '../../context/JourneyContext';

/**
 * Route params for MedicationReminder screen.
 */
interface MedicationReminderParams {
    medicationName?: string;
    medicationDosage?: string;
}

/**
 * MedicationReminderScreen allows users to configure reminders for their medications,
 * including time, frequency, and snooze options.
 */
export const MedicationReminderScreen: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { _journey } = useJourney();

    const [_loading, setLoading] = useState(false);
    const [_error, setError] = useState<string | null>(null);

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
        setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
    };

    /**
     * Handle save reminder action.
     */
    const handleSave = async (): Promise<void> => {
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
        setLoading(true);
        setError(null);
        try {
            await restClient.post('/health/medication-reminders', reminderConfig);
            navigation.goBack();
        } catch (err) {
            setError(t('common.error'));
            Alert.alert(t('common.error'), t('common.tryAgain'));
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle cancel action.
     */
    const handleCancel = (): void => {
        navigation.goBack();
    };

    /**
     * Get the frequency label for preview.
     */
    const getFrequencyLabel = (): string => {
        switch (frequency) {
            case 'daily':
                return t('journeys.health.medication.frequency.daily');
            case 'weekly':
                return selectedDays.length > 0
                    ? DAYS_OF_WEEK.filter((d) => selectedDays.includes(d.value))
                          .map((d) => d.label)
                          .join(', ')
                    : t('journeys.health.medication.frequency.selectDays');
            case 'interval':
                return t('journeys.health.medication.frequency.everyXHours', { hours: intervalHours });
            case 'custom':
                return t('journeys.health.medication.frequency.custom');
            default:
                return '';
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Medication name header */}
            <View style={styles.header}>
                <Text style={[styles.medicationName, { color: journeyColors.primary }]}>{medicationName}</Text>
                {medicationDosage ? <Text style={styles.medicationDosage}>{medicationDosage}</Text> : null}
            </View>

            {/* Section: Horario do Lembrete */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: journeyColors.accent }]}>
                    {t('journeys.health.medication.reminderTime')}
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
                    <Text style={styles.timeHint}>{t('journeys.health.medication.timeHint')}</Text>
                </View>
            </View>

            {/* Section: Frequencia */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: journeyColors.accent }]}>
                    {t('journeys.care.medications.frequency')}
                </Text>
                <FrequencyPicker
                    frequency={frequency}
                    onFrequencyChange={setFrequency}
                    selectedDays={selectedDays}
                    onToggleDay={toggleDay}
                    intervalHours={intervalHours}
                    onIntervalChange={setIntervalHours}
                    journeyColors={journeyColors}
                />
            </View>

            {/* Section: Opcoes de Soneca */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: journeyColors.accent }]}>
                    {t('journeys.health.medication.snoozeOptions')}
                </Text>
                <SnoozePicker
                    snoozeEnabled={snoozeEnabled}
                    onSnoozeToggle={setSnoozeEnabled}
                    snoozeDuration={snoozeDuration}
                    onSnoozeDurationChange={setSnoozeDuration}
                    journeyColors={journeyColors}
                />
            </View>

            {/* Section: Pre-visualizacao */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: journeyColors.accent }]}>
                    {t('journeys.health.medication.preview')}
                </Text>
                <ReminderPreview
                    medicationName={medicationName}
                    medicationDosage={medicationDosage}
                    time={time}
                    frequencyLabel={getFrequencyLabel()}
                    journeyColors={journeyColors}
                />
            </View>

            {/* Action buttons */}
            <View style={styles.buttonContainer}>
                <View style={[styles.primaryButton, { backgroundColor: journeyColors.primary }]}>
                    <Text style={styles.primaryButtonText} onPress={handleSave}>
                        {t('journeys.health.medication.saveReminder')}
                    </Text>
                </View>
                <View style={[styles.secondaryButton, { borderColor: journeyColors.primary }]}>
                    <Text style={[styles.secondaryButtonText, { color: journeyColors.primary }]} onPress={handleCancel}>
                        {t('common.buttons.cancel')}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background.default,
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
            color: theme.colors.text.muted,
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
            color: theme.colors.text.subtle,
            marginTop: spacingValues['3xs'],
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
            color: theme.colors.text.onBrand,
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
