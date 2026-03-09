import { Button } from 'design-system/components/Button/Button';
import { Stepper } from 'design-system/components/Stepper/Stepper';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState, useCallback } from 'react';
import { WEB_HEALTH_ROUTES } from 'shared/constants/routes';

import StepAlcoholTobacco from './steps/step-alcohol-tobacco';
import StepAllergies from './steps/step-allergies';
import StepDiet from './steps/step-diet';
import StepExercise from './steps/step-exercise';
import StepExistingConditions from './steps/step-existing-conditions';
import StepFamilyHistory from './steps/step-family-history';
import StepHeightWeight from './steps/step-height-weight';
import StepIntroduction from './steps/step-introduction';
import StepMedications from './steps/step-medications';
import StepPersonalInfo from './steps/step-personal-info';
import StepSleep from './steps/step-sleep';
import StepStress from './steps/step-stress';
import StepWaterIntake from './steps/step-water-intake';

/** Step configuration for the wizard Stepper */
const STEPS = [
    { label: 'Intro' },
    { label: 'Personal' },
    { label: 'Body' },
    { label: 'Conditions' },
    { label: 'Medications' },
    { label: 'Allergies' },
    { label: 'Family' },
    { label: 'Exercise' },
    { label: 'Diet' },
    { label: 'Sleep' },
    { label: 'Stress' },
    { label: 'Substances' },
    { label: 'Hydration' },
];

/** Step components indexed by step number */
const STEP_COMPONENTS = [
    StepIntroduction,
    StepPersonalInfo,
    StepHeightWeight,
    StepExistingConditions,
    StepMedications,
    StepAllergies,
    StepFamilyHistory,
    StepExercise,
    StepDiet,
    StepSleep,
    StepStress,
    StepAlcoholTobacco,
    StepWaterIntake,
];

const TOTAL_STEPS = STEPS.length;

/**
 * Health Assessment Wizard page.
 * Uses the Stepper DS component for progress indication,
 * rendering 13 step sub-components with shared form data state.
 */
const HealthAssessmentPage: React.FC = () => {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = useCallback((field: string, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleNext = (): void => {
        if (activeStep < TOTAL_STEPS - 1) {
            setActiveStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = (): void => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleStepPress = (index: number): void => {
        if (index <= activeStep) {
            setActiveStep(index);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (): Promise<void> => {
        setIsSubmitting(true);
        // Simulate submission delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        void router.push(WEB_HEALTH_ROUTES.DASHBOARD);
    };

    const isLastStep = activeStep === TOTAL_STEPS - 1;
    const isFirstStep = activeStep === 0;
    const ActiveComponent = STEP_COMPONENTS[activeStep];
    const progressPercent = Math.round(((activeStep + 1) / TOTAL_STEPS) * 100);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            {/* Header */}
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Health Assessment
            </Text>
            <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'], marginBottom: spacing.lg }}>
                Step {activeStep + 1} of {TOTAL_STEPS} ({progressPercent}% complete)
            </Text>

            {/* Progress bar */}
            <div
                style={{
                    width: '100%',
                    height: 6,
                    backgroundColor: colors.neutral.gray200,
                    borderRadius: 3,
                    marginBottom: spacing.lg,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        backgroundColor: colors.journeys.health.primary,
                        borderRadius: 3,
                        transition: 'width 0.3s ease-in-out',
                    }}
                />
            </div>

            {/* Stepper */}
            <div style={{ marginBottom: spacing['2xl'], overflowX: 'auto', paddingBottom: spacing.xs }}>
                <Stepper
                    steps={STEPS}
                    activeStep={activeStep}
                    orientation="horizontal"
                    journey="health"
                    onStepPress={handleStepPress}
                    accessibilityLabel="Health assessment progress"
                />
            </div>

            {/* Active step content */}
            <div style={{ marginBottom: spacing['2xl'] }}>
                <ActiveComponent data={formData} onUpdate={handleUpdate} />
            </div>

            {/* Navigation buttons */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: spacing.lg,
                    borderTop: `1px solid ${colors.neutral.gray200}`,
                }}
            >
                <div style={{ minWidth: 120 }}>
                    {!isFirstStep && (
                        <Button
                            variant="secondary"
                            journey="health"
                            onPress={handleBack}
                            accessibilityLabel="Go to previous step"
                        >
                            Back
                        </Button>
                    )}
                </div>

                <div style={{ minWidth: 120, display: 'flex', justifyContent: 'flex-end' }}>
                    {isLastStep ? (
                        <Button
                            journey="health"
                            onPress={() => {
                                void handleSubmit();
                            }}
                            accessibilityLabel="Submit health assessment"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                        </Button>
                    ) : (
                        <Button journey="health" onPress={handleNext} accessibilityLabel="Go to next step">
                            {isFirstStep ? 'Get Started' : 'Next'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Save progress hint */}
            <Box display="flex" justifyContent="center" style={{ marginTop: spacing.lg }}>
                <Text fontSize="xs" color={colors.gray[40]}>
                    Your progress is saved automatically
                </Text>
            </Box>
        </div>
    );
};

export default HealthAssessmentPage;
