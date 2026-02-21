import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';

import { StepIntroduction } from './steps/StepIntroduction';
import { StepPersonalInfo } from './steps/StepPersonalInfo';
import { StepHeightWeight } from './steps/StepHeightWeight';
import { StepExistingConditions } from './steps/StepExistingConditions';
import { StepMedications } from './steps/StepMedications';
import { StepAllergies } from './steps/StepAllergies';
import { StepFamilyHistory } from './steps/StepFamilyHistory';
import { StepExercise } from './steps/StepExercise';
import { StepDiet } from './steps/StepDiet';
import { StepSleep } from './steps/StepSleep';
import { StepStress } from './steps/StepStress';
import { StepAlcoholTobacco } from './steps/StepAlcoholTobacco';
import { StepWaterIntake } from './steps/StepWaterIntake';
import { StepHealthGoals } from './steps/StepHealthGoals';
import { StepMentalScreening } from './steps/StepMentalScreening';
import { StepMoodAssessment } from './steps/StepMoodAssessment';
import { StepAnxietyScale } from './steps/StepAnxietyScale';
import { StepReproductiveHealth } from './steps/StepReproductiveHealth';
import { StepChronicPain } from './steps/StepChronicPain';
import { StepVaccination } from './steps/StepVaccination';
import { StepInsuranceInfo } from './steps/StepInsuranceInfo';
import { StepEmergencyContacts } from './steps/StepEmergencyContacts';
import { StepConsentPrivacy } from './steps/StepConsentPrivacy';
import { StepReviewSummary } from './steps/StepReviewSummary';
import { StepSubmissionConfirm } from './steps/StepSubmissionConfirm';
import { StepResultsHealthScore } from './steps/StepResultsHealthScore';

const TOTAL_STEPS = 26;

interface FormData {
  introduction: Record<string, any>;
  personalInfo: Record<string, any>;
  heightWeight: Record<string, any>;
  conditions: Record<string, any>;
  medications: Record<string, any>;
  allergies: Record<string, any>;
  familyHistory: Record<string, any>;
  exercise: Record<string, any>;
  diet: Record<string, any>;
  sleep: Record<string, any>;
  stress: Record<string, any>;
  alcoholTobacco: Record<string, any>;
  waterIntake: Record<string, any>;
  healthGoals: Record<string, any>;
  mentalScreening: Record<string, any>;
  moodAssessment: Record<string, any>;
  anxietyScale: Record<string, any>;
  reproductiveHealth: Record<string, any>;
  chronicPain: Record<string, any>;
  vaccination: Record<string, any>;
  insuranceInfo: Record<string, any>;
  emergencyContacts: Record<string, any>;
  consentPrivacy: Record<string, any>;
  reviewSummary: Record<string, any>;
  submissionConfirm: Record<string, any>;
  resultsHealthScore: Record<string, any>;
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
      return !!(pi.fullName && pi.dateOfBirth && pi.gender);
    }
    case 2: {
      const hw = data.heightWeight;
      return !!(hw.height && hw.weight);
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
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const handleUpdate = useCallback(
    (field: string, value: any) => {
      const stepKey = STEP_KEYS[activeStep];
      setFormData((prev) => ({
        ...prev,
        [stepKey]: {
          ...prev[stepKey],
          [field]: value,
        },
      }));
    },
    [activeStep],
  );

  const isStepValid = useMemo(
    () => validateStep(activeStep, formData),
    [activeStep, formData],
  );

  const handleNext = useCallback(() => {
    if (!isStepValid) return;
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

  const renderStep = () => {
    const stepKey = STEP_KEYS[activeStep];
    const stepData = formData[stepKey];

    switch (activeStep) {
      case 0:
        return <StepIntroduction data={stepData} onUpdate={handleUpdate} />;
      case 1:
        return <StepPersonalInfo data={stepData} onUpdate={handleUpdate} />;
      case 2:
        return <StepHeightWeight data={stepData} onUpdate={handleUpdate} />;
      case 3:
        return (
          <StepExistingConditions data={stepData} onUpdate={handleUpdate} />
        );
      case 4:
        return <StepMedications data={stepData} onUpdate={handleUpdate} />;
      case 5:
        return <StepAllergies data={stepData} onUpdate={handleUpdate} />;
      case 6:
        return <StepFamilyHistory data={stepData} onUpdate={handleUpdate} />;
      case 7:
        return <StepExercise data={stepData} onUpdate={handleUpdate} />;
      case 8:
        return <StepDiet data={stepData} onUpdate={handleUpdate} />;
      case 9:
        return <StepSleep data={stepData} onUpdate={handleUpdate} />;
      case 10:
        return <StepStress data={stepData} onUpdate={handleUpdate} />;
      case 11:
        return <StepAlcoholTobacco data={stepData} onUpdate={handleUpdate} />;
      case 12:
        return <StepWaterIntake data={stepData} onUpdate={handleUpdate} />;
      case 13:
        return <StepHealthGoals data={stepData} onUpdate={handleUpdate} />;
      case 14:
        return <StepMentalScreening data={stepData} onUpdate={handleUpdate} />;
      case 15:
        return <StepMoodAssessment data={stepData} onUpdate={handleUpdate} />;
      case 16:
        return <StepAnxietyScale data={stepData} onUpdate={handleUpdate} />;
      case 17:
        return <StepReproductiveHealth data={stepData} onUpdate={handleUpdate} />;
      case 18:
        return <StepChronicPain data={stepData} onUpdate={handleUpdate} />;
      case 19:
        return <StepVaccination data={stepData} onUpdate={handleUpdate} />;
      case 20:
        return <StepInsuranceInfo data={stepData} onUpdate={handleUpdate} />;
      case 21:
        return <StepEmergencyContacts data={stepData} onUpdate={handleUpdate} />;
      case 22:
        return <StepConsentPrivacy data={stepData} onUpdate={handleUpdate} />;
      case 23:
        return <StepReviewSummary data={stepData} onUpdate={handleUpdate} />;
      case 24:
        return <StepSubmissionConfirm data={stepData} onUpdate={handleUpdate} />;
      case 25:
        return <StepResultsHealthScore data={stepData} onUpdate={handleUpdate} />;
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
              {activeStep > 0
                ? t('common.buttons.back')
                : t('common.buttons.close')}
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
            <View
              style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
            />
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
