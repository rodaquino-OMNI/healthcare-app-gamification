import { Button } from '@austa/design-system/src/components/Button/Button';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

import { StepAlcoholTobacco } from './steps/StepAlcoholTobacco';
import { StepAllergies } from './steps/StepAllergies';
import { StepAnxietyScale } from './steps/StepAnxietyScale';
import { StepChronicPain } from './steps/StepChronicPain';
import { StepConsentPrivacy } from './steps/StepConsentPrivacy';
import { StepDiet } from './steps/StepDiet';
import { StepEmergencyContacts } from './steps/StepEmergencyContacts';
import { StepExercise } from './steps/StepExercise';
import { StepExistingConditions } from './steps/StepExistingConditions';
import { StepFamilyHistory } from './steps/StepFamilyHistory';
import { StepHealthGoals } from './steps/StepHealthGoals';
import { StepHeightWeight } from './steps/StepHeightWeight';
import { StepInsuranceInfo } from './steps/StepInsuranceInfo';
import { StepIntroduction } from './steps/StepIntroduction';
import { StepMedications } from './steps/StepMedications';
import { StepMentalScreening } from './steps/StepMentalScreening';
import { StepMoodAssessment } from './steps/StepMoodAssessment';
import { StepPersonalInfo } from './steps/StepPersonalInfo';
import { StepReproductiveHealth } from './steps/StepReproductiveHealth';
import { StepResultsHealthScore } from './steps/StepResultsHealthScore';
import { StepReviewSummary } from './steps/StepReviewSummary';
import { StepSleep } from './steps/StepSleep';
import { StepStress } from './steps/StepStress';
import { StepSubmissionConfirm } from './steps/StepSubmissionConfirm';
import { StepVaccination } from './steps/StepVaccination';
import { StepWaterIntake } from './steps/StepWaterIntake';
import type { HealthStackParamList } from '../../../navigation/types';

const TOTAL_STEPS = 26;

// Each step's data is a loose record (values are typed per-step component).
// Using Record<string, unknown> here is safe: the wizard only forwards data
// to typed step components, which validate the shape via their own interfaces.
type StepRecord = Record<string, unknown>;

interface FormData {
    introduction: StepRecord;
    personalInfo: StepRecord;
    heightWeight: StepRecord;
    conditions: StepRecord;
    medications: StepRecord;
    allergies: StepRecord;
    familyHistory: StepRecord;
    exercise: StepRecord;
    diet: StepRecord;
    sleep: StepRecord;
    stress: StepRecord;
    alcoholTobacco: StepRecord;
    waterIntake: StepRecord;
    healthGoals: StepRecord;
    mentalScreening: StepRecord;
    moodAssessment: StepRecord;
    anxietyScale: StepRecord;
    reproductiveHealth: StepRecord;
    chronicPain: StepRecord;
    vaccination: StepRecord;
    insuranceInfo: StepRecord;
    emergencyContacts: StepRecord;
    consentPrivacy: StepRecord;
    reviewSummary: StepRecord;
    submissionConfirm: StepRecord;
    resultsHealthScore: StepRecord;
}

const INITIAL_FORM_DATA: FormData = {
    introduction: {},
    personalInfo: { fullName: '', dateOfBirth: '', gender: '', bloodType: '' },
    heightWeight: { height: '', weight: '', unit: 'metric' },
    conditions: { selected: [], other: '' },
    medications: { takesMedications: false, list: [] },
    allergies: { selected: [], severities: {}, other: '' },
    familyHistory: { conditions: {} },
    exercise: {},
    diet: {},
    sleep: {},
    stress: {},
    alcoholTobacco: {},
    waterIntake: {},
    healthGoals: {},
    mentalScreening: {},
    moodAssessment: {},
    anxietyScale: {},
    reproductiveHealth: {},
    chronicPain: {},
    vaccination: {},
    insuranceInfo: {},
    emergencyContacts: {},
    consentPrivacy: {},
    reviewSummary: {},
    submissionConfirm: {},
    resultsHealthScore: {},
};

const STEP_KEYS: (keyof FormData)[] = [
    'introduction',
    'personalInfo',
    'heightWeight',
    'conditions',
    'medications',
    'allergies',
    'familyHistory',
    'exercise',
    'diet',
    'sleep',
    'stress',
    'alcoholTobacco',
    'waterIntake',
    'healthGoals',
    'mentalScreening',
    'moodAssessment',
    'anxietyScale',
    'reproductiveHealth',
    'chronicPain',
    'vaccination',
    'insuranceInfo',
    'emergencyContacts',
    'consentPrivacy',
    'reviewSummary',
    'submissionConfirm',
    'resultsHealthScore',
];

const validateStep = (step: number, data: FormData): boolean => {
    switch (step) {
        case 0:
            return true;
        case 1: {
            const pi = data.personalInfo;
            return !!(pi['fullName'] && pi['dateOfBirth'] && pi['gender']);
        }
        case 2: {
            const hw = data.heightWeight;
            return !!(hw['height'] && hw['weight']);
        }
        case 3:
            return true;
        case 4:
            return true;
        case 5:
            return true;
        case 6:
            return true;
        default:
            return true;
    }
};

/**
 * AssessmentWizard orchestrates the multi-step health assessment flow.
 * Renders a progress bar, step content, and navigation controls.
 */
export const AssessmentWizard: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const { t } = useTranslation();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

    const handleUpdate = useCallback(
        (field: string, value: unknown) => {
            const stepKey = STEP_KEYS[activeStep];
            setFormData((prev) => ({
                ...prev,
                [stepKey]: {
                    ...prev[stepKey],
                    [field]: value,
                },
            }));
        },
        [activeStep]
    );

    const isStepValid = useMemo(() => validateStep(activeStep, formData), [activeStep, formData]);

    const handleNext = useCallback(() => {
        if (!isStepValid) {
            return;
        }
        if (activeStep < TOTAL_STEPS - 1) {
            setActiveStep((prev) => prev + 1);
        }
    }, [activeStep, isStepValid]);

    const handleBack = useCallback(() => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
        } else {
            navigation.goBack();
        }
    }, [activeStep, navigation]);

    const handleSubmit = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const isLastStep = activeStep === TOTAL_STEPS - 1;
    const progress = (activeStep + 1) / TOTAL_STEPS;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const castData = <T,>(d: StepRecord): T => d as unknown as T;

    const renderStep = (): React.ReactElement | null => {
        const stepKey = STEP_KEYS[activeStep];
        const stepData = formData[stepKey];

        switch (activeStep) {
            case 0:
                return <StepIntroduction data={castData(stepData)} onUpdate={handleUpdate} />;
            case 1:
                return <StepPersonalInfo data={castData(stepData)} onUpdate={handleUpdate} />;
            case 2:
                return <StepHeightWeight data={castData(stepData)} onUpdate={handleUpdate} />;
            case 3:
                return <StepExistingConditions data={castData(stepData)} onUpdate={handleUpdate} />;
            case 4:
                return <StepMedications data={castData(stepData)} onUpdate={handleUpdate} />;
            case 5:
                return <StepAllergies data={castData(stepData)} onUpdate={handleUpdate} />;
            case 6:
                return <StepFamilyHistory data={castData(stepData)} onUpdate={handleUpdate} />;
            case 7:
                return <StepExercise data={castData(stepData)} onUpdate={handleUpdate} />;
            case 8:
                return <StepDiet data={castData(stepData)} onUpdate={handleUpdate} />;
            case 9:
                return <StepSleep data={castData(stepData)} onUpdate={handleUpdate} />;
            case 10:
                return <StepStress data={castData(stepData)} onUpdate={handleUpdate} />;
            case 11:
                return <StepAlcoholTobacco data={castData(stepData)} onUpdate={handleUpdate} />;
            case 12:
                return <StepWaterIntake data={castData(stepData)} onUpdate={handleUpdate} />;
            case 13:
                return <StepHealthGoals data={castData(stepData)} onUpdate={handleUpdate} />;
            case 14:
                return <StepMentalScreening data={castData(stepData)} onUpdate={handleUpdate} />;
            case 15:
                return <StepMoodAssessment data={castData(stepData)} onUpdate={handleUpdate} />;
            case 16:
                return <StepAnxietyScale data={castData(stepData)} onUpdate={handleUpdate} />;
            case 17:
                return <StepReproductiveHealth data={castData(stepData)} onUpdate={handleUpdate} />;
            case 18:
                return <StepChronicPain data={castData(stepData)} onUpdate={handleUpdate} />;
            case 19:
                return <StepVaccination data={castData(stepData)} onUpdate={handleUpdate} />;
            case 20:
                return <StepInsuranceInfo data={castData(stepData)} onUpdate={handleUpdate} />;
            case 21:
                return <StepEmergencyContacts data={castData(stepData)} onUpdate={handleUpdate} />;
            case 22:
                return <StepConsentPrivacy data={castData(stepData)} onUpdate={handleUpdate} />;
            case 23:
                return <StepReviewSummary data={castData(stepData)} onUpdate={handleUpdate} />;
            case 24:
                return <StepSubmissionConfirm data={castData(stepData)} onUpdate={handleUpdate} />;
            case 25:
                return <StepResultsHealthScore data={castData(stepData)} onUpdate={handleUpdate} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Touchable
                        onPress={handleBack}
                        accessibilityLabel={t('common.buttons.back')}
                        accessibilityRole="button"
                        testID="wizard-back-button"
                    >
                        <Text fontSize="lg" color={colors.journeys.health.primary}>
                            {activeStep > 0 ? t('common.buttons.back') : t('common.buttons.close')}
                        </Text>
                    </Touchable>
                    <Text variant="heading" journey="health">
                        {t('healthAssessment.wizard.title')}
                    </Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Progress Bar */}
                <View style={styles.progressSection}>
                    <View style={styles.progressBarTrack}>
                        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                    </View>
                    <Text
                        fontSize="sm"
                        color={colors.neutral.gray600}
                        style={styles.progressLabel}
                        testID="progress-label"
                    >
                        {t('healthAssessment.wizard.stepOf', {
                            current: activeStep + 1,
                            total: TOTAL_STEPS,
                        })}
                    </Text>
                </View>

                {/* Step Content */}
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    testID={`step-${activeStep}-content`}
                >
                    {renderStep()}
                </ScrollView>

                {/* Navigation Buttons */}
                <View style={styles.footer}>
                    {isLastStep ? (
                        <Button
                            variant="primary"
                            journey="health"
                            onPress={handleSubmit}
                            accessibilityLabel={t('healthAssessment.wizard.submit')}
                            testID="wizard-submit-button"
                        >
                            {t('healthAssessment.wizard.submit')}
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            journey="health"
                            onPress={handleNext}
                            disabled={!isStepValid}
                            accessibilityLabel={t('healthAssessment.wizard.next')}
                            testID="wizard-next-button"
                        >
                            {t('healthAssessment.wizard.next')}
                        </Button>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.journeys.health.background,
    },
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
    progressSection: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues.sm,
    },
    progressBarTrack: {
        height: 6,
        backgroundColor: colors.neutral.gray300,
        borderRadius: borderRadiusValues.full,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 6,
        backgroundColor: colors.journeys.health.primary,
        borderRadius: borderRadiusValues.full,
    },
    progressLabel: {
        marginTop: spacingValues.xs,
        textAlign: 'right',
    },
    scrollContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    footer: {
        paddingHorizontal: spacingValues.md,
        paddingVertical: spacingValues.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.gray300,
        backgroundColor: colors.journeys.health.background,
    },
});

export default AssessmentWizard;
