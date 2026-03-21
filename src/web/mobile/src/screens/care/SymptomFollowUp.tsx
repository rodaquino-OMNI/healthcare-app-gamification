import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useRoute, RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';

interface PossibleCondition {
    id: string;
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
}

type SymptomFollowUpRouteParams = {
    conditions: PossibleCondition[];
    overallSeverity: number;
};

interface ReminderOption {
    key: string;
    labelKey: string;
    days: number;
}

const REMINDER_OPTIONS: ReminderOption[] = [
    { key: 'tomorrow', labelKey: 'journeys.care.symptomChecker.followUp.tomorrow', days: 1 },
    { key: '3days', labelKey: 'journeys.care.symptomChecker.followUp.in3Days', days: 3 },
    { key: '1week', labelKey: 'journeys.care.symptomChecker.followUp.in1Week', days: 7 },
    { key: '2weeks', labelKey: 'journeys.care.symptomChecker.followUp.in2Weeks', days: 14 },
    { key: 'custom', labelKey: 'journeys.care.symptomChecker.followUp.custom', days: 0 },
];

interface WatchSymptom {
    id: string;
    name: string;
    checked: boolean;
}

const getWarningSignsBySeverity = (severity: number): string[] => {
    const signs: string[] = [
        'Sudden worsening of symptoms',
        'Fever above 39\u00B0C (102.2\u00B0F)',
        'Difficulty breathing or shortness of breath',
    ];

    if (severity >= 5) {
        signs.push(
            'Chest pain or pressure',
            'Confusion or difficulty staying awake',
            'Inability to keep fluids down for 24+ hours'
        );
    }

    if (severity >= 7) {
        signs.push('Loss of consciousness', 'Severe allergic reaction (swelling, hives)', 'Uncontrollable bleeding');
    }

    return signs;
};

/**
 * Follow-up reminder screen for symptom monitoring.
 * Allows users to set follow-up reminders and review symptoms to watch.
 */
const SymptomFollowUp: React.FC = () => {
    const route = useRoute<RouteProp<{ params: SymptomFollowUpRouteParams }, 'params'>>();
    const { t } = useTranslation();

    const { conditions: _conditions = [], overallSeverity = 5 } = route.params || {};

    const [selectedReminder, setSelectedReminder] = useState<string | null>(null);

    const [watchSymptoms, setWatchSymptoms] = useState<WatchSymptom[]>([
        { id: 'ws1', name: 'Fever or chills', checked: true },
        { id: 'ws2', name: 'Pain level changes', checked: true },
        { id: 'ws3', name: 'New symptoms appearing', checked: true },
        { id: 'ws4', name: 'Sleep quality', checked: false },
        { id: 'ws5', name: 'Appetite changes', checked: false },
        { id: 'ws6', name: 'Energy levels', checked: false },
    ]);

    const warningSignsList = getWarningSignsBySeverity(overallSeverity);

    const handleToggleSymptom = (symptomId: string): void => {
        setWatchSymptoms((prev) => prev.map((s) => (s.id === symptomId ? { ...s, checked: !s.checked } : s)));
    };

    const handleSetReminder = (): void => {
        if (!selectedReminder) {
            Alert.alert(
                t('journeys.care.symptomChecker.followUp.selectReminderTitle'),
                t('journeys.care.symptomChecker.followUp.selectReminderMessage')
            );
            return;
        }

        const option = REMINDER_OPTIONS.find((o) => o.key === selectedReminder);
        const checkedSymptoms = watchSymptoms.filter((s) => s.checked);

        Alert.alert(
            t('journeys.care.symptomChecker.followUp.reminderSetTitle'),
            `${t('journeys.care.symptomChecker.followUp.reminderSetMessage')} ${option ? t(option.labelKey) : ''}. ${t('journeys.care.symptomChecker.followUp.tracking')} ${checkedSymptoms.length} ${t('journeys.care.symptomChecker.followUp.symptoms')}.`,
            [{ text: t('journeys.care.symptomChecker.followUp.ok') }]
        );
    };

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text variant="heading" journey="care" testID="followup-title">
                    {t('journeys.care.symptomChecker.followUp.title')}
                </Text>

                {/* Reminder timing */}
                <Card journey="care" elevation="md">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.followUp.whenToFollowUp')}
                    </Text>
                    <View style={styles.reminderOptions}>
                        {REMINDER_OPTIONS.map((option) => {
                            const isSelected = selectedReminder === option.key;
                            return (
                                <Touchable
                                    key={option.key}
                                    onPress={() => setSelectedReminder(option.key)}
                                    accessibilityLabel={t(option.labelKey)}
                                    accessibilityRole="button"
                                    testID={`reminder-${option.key}`}
                                >
                                    <View style={[styles.reminderOption, isSelected && styles.reminderOptionActive]}>
                                        <Text
                                            fontSize="text-sm"
                                            fontWeight={isSelected ? 'semiBold' : 'regular'}
                                            color={isSelected ? colors.neutral.white : colors.journeys.care.text}
                                        >
                                            {t(option.labelKey)}
                                        </Text>
                                    </View>
                                </Touchable>
                            );
                        })}
                    </View>
                </Card>

                {/* Symptoms to watch */}
                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.followUp.symptomsToWatch')}
                    </Text>
                    {watchSymptoms.map((symptom) => (
                        <Touchable
                            key={symptom.id}
                            onPress={() => handleToggleSymptom(symptom.id)}
                            accessibilityLabel={`${symptom.name}: ${symptom.checked ? t('journeys.care.symptomChecker.followUp.checked') : t('journeys.care.symptomChecker.followUp.unchecked')}`}
                            accessibilityRole="checkbox"
                            testID={`watch-symptom-${symptom.id}`}
                        >
                            <View style={styles.checkboxRow}>
                                <View style={[styles.checkbox, symptom.checked && styles.checkboxChecked]}>
                                    {symptom.checked && (
                                        <Text fontSize="text-xs" color={colors.neutral.white}>
                                            {'\u2713'}
                                        </Text>
                                    )}
                                </View>
                                <Text variant="body" journey="care">
                                    {symptom.name}
                                </Text>
                            </View>
                        </Touchable>
                    ))}
                </Card>

                {/* Warning signs */}
                <Card journey="care" elevation="sm" borderColor={colors.semantic.error}>
                    <View style={styles.warningHeader}>
                        <Text variant="body" fontWeight="semiBold" journey="care">
                            {t('journeys.care.symptomChecker.followUp.warningSigns')}
                        </Text>
                        <Badge
                            variant="status"
                            status="error"
                            testID="warning-badge"
                            accessibilityLabel={t('journeys.care.symptomChecker.followUp.seekCare')}
                        >
                            {t('journeys.care.symptomChecker.followUp.seekCare')}
                        </Badge>
                    </View>
                    <Text variant="caption" color={colors.neutral.gray600} style={styles.warningSubtext}>
                        {t('journeys.care.symptomChecker.followUp.warningDescription')}
                    </Text>
                    {warningSignsList.map((sign, index) => (
                        <View key={`sign-${index}`} style={styles.warningItem}>
                            <Text fontSize="text-sm" color={colors.semantic.error}>
                                {'\u26A0'}
                            </Text>
                            <Text variant="body" journey="care" testID={`warning-sign-${index}`}>
                                {sign}
                            </Text>
                        </View>
                    ))}
                </Card>

                {/* Set reminder button */}
                <View style={styles.buttonContainer}>
                    <Button
                        onPress={handleSetReminder}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.followUp.setReminder')}
                        testID="set-reminder-button"
                    >
                        {t('journeys.care.symptomChecker.followUp.setReminder')}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.journeys.care.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    reminderOptions: {
        marginTop: spacingValues.sm,
        gap: spacingValues.xs,
    },
    reminderOption: {
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.md,
        borderRadius: spacingValues.xs,
        borderWidth: 1,
        borderColor: colors.neutral.gray300,
        alignItems: 'center',
    },
    reminderOptionActive: {
        backgroundColor: colors.journeys.care.primary,
        borderColor: colors.journeys.care.primary,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
        paddingVertical: spacingValues['3xs'],
    },
    checkbox: {
        width: spacingValues.xl,
        height: spacingValues.xl,
        borderRadius: spacingValues['3xs'],
        borderWidth: 2,
        borderColor: colors.neutral.gray400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.journeys.care.primary,
        borderColor: colors.journeys.care.primary,
    },
    warningHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    warningSubtext: {
        marginTop: spacingValues['3xs'],
        marginBottom: spacingValues.sm,
    },
    warningItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacingValues.xs,
        paddingVertical: spacingValues['4xs'],
    },
    buttonContainer: {
        marginTop: spacingValues.xl,
    },
});

export { SymptomFollowUp };
export default SymptomFollowUp;
