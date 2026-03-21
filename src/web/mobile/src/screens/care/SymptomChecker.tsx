import { Input, Button, Card, Text } from '@austa/design-system';
import { Stepper } from '@austa/design-system/src/components/Stepper/Stepper';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';

import { ROUTES } from '@constants/routes';
import { useJourney } from '@hooks/useJourney';

/**
 * A screen component that allows users to input their symptoms and receive a preliminary assessment.
 * This implements requirement F-102-RQ-001: Allow users to input symptoms and receive preliminary guidance.
 * Step 1 of the symptom checker flow.
 */
const SymptomChecker: React.FC = () => {
    const [symptoms, setSymptoms] = useState('');
    const [_selectedSymptoms, _setSelectedSymptoms] = useState<Array<{ id: string; name: string }>>([]);
    const [isLoading, _setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const navigation = useNavigation<any>();
    const { journey: _journey } = useJourney();
    const { t } = useTranslation();

    const SYMPTOM_STEPS = [
        { label: t('journeys.care.symptomChecker.steps.symptoms') },
        { label: t('journeys.care.symptomChecker.steps.bodyMap') },
        { label: t('journeys.care.symptomChecker.steps.details') },
        { label: t('journeys.care.symptomChecker.steps.questions') },
        { label: t('journeys.care.symptomChecker.steps.severity') },
        { label: t('journeys.care.symptomChecker.steps.results') },
        { label: t('journeys.care.symptomChecker.steps.actions') },
    ];

    /**
     * Handles the submission of symptoms for the symptom flow.
     * Navigates to the body map screen with the entered symptoms.
     */
    const handleContinue = (): void => {
        if (!symptoms.trim()) {
            setError(new Error(t('journeys.care.symptomChecker.describeSymptoms')));
            return;
        }

        setError(null);

        const symptomList = symptoms
            .split(',')
            .map((s, index) => ({
                id: `symptom-${index}`,
                name: s.trim(),
            }))
            .filter((s) => s.name.length > 0);

        navigation.navigate(ROUTES.CARE_SYMPTOM_BODY_MAP, {
            symptoms: symptomList,
            description: symptoms,
        });
    };

    /**
     * Navigates to the appointment booking screen
     */
    const handleBookAppointment = (): void => {
        navigation.navigate(ROUTES.CARE_APPOINTMENT_BOOKING);
    };

    return (
        <View style={styles.root}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.stepperContainer}>
                    <Stepper
                        steps={SYMPTOM_STEPS}
                        activeStep={0}
                        journey="care"
                        accessibilityLabel="Symptom checker progress"
                    />
                </View>

                <Text variant="heading" journey="care" testID="symptom-checker-title">
                    {t('journeys.care.symptomChecker.title')}
                </Text>

                <Text variant="body" journey="care" testID="symptom-checker-subtitle">
                    {t('journeys.care.symptomChecker.subtitle')}
                </Text>

                <View style={styles.inputContainer}>
                    <Card journey="care" elevation="sm">
                        <Input
                            label={t('journeys.care.symptomChecker.yourSymptoms')}
                            value={symptoms}
                            onChange={(e: any) => setSymptoms(e.target?.value ?? e)}
                            placeholder={t('journeys.care.symptomChecker.placeholder')}
                            journey="care"
                            testID="symptom-input"
                            aria-label="Field to describe your symptoms"
                        />

                        {error && (
                            <Text fontSize="sm" color={colors.semantic.error} testID="symptom-error">
                                {error.message}
                            </Text>
                        )}

                        <View style={styles.buttonRow}>
                            <Button
                                onPress={handleContinue}
                                journey="care"
                                disabled={isLoading || !symptoms.trim()}
                                loading={isLoading}
                                accessibilityLabel="Continue to body map"
                                testID="continue-button"
                            >
                                {t('common.buttons.next')}
                            </Button>
                        </View>
                    </Card>
                </View>

                <View style={styles.infoContainer}>
                    <Card journey="care" elevation="sm">
                        <Text variant="body" journey="care">
                            {t('journeys.care.symptomChecker.disclaimer')}
                        </Text>
                        <View style={styles.appointmentButton}>
                            <Button
                                variant="secondary"
                                onPress={handleBookAppointment}
                                journey="care"
                                accessibilityLabel="Book appointment directly"
                                testID="book-appointment-button"
                            >
                                {t('journeys.care.symptomChecker.bookAppointmentDirectly')}
                            </Button>
                        </View>
                    </Card>
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
    stepperContainer: {
        marginBottom: spacingValues.xl,
    },
    inputContainer: {
        marginTop: spacingValues.md,
    },
    buttonRow: {
        marginTop: spacingValues.md,
        alignItems: 'flex-end',
    },
    infoContainer: {
        marginTop: spacingValues.xl,
    },
    appointmentButton: {
        marginTop: spacingValues.md,
    },
});

export default SymptomChecker;
