import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useSymptomChecker } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface AnalysisStep {
    id: string;
    label: string;
    duration: number;
}

const ANALYSIS_STEPS: AnalysisStep[] = [
    { id: 'symptoms', label: 'Analyzing symptoms...', duration: 1200 },
    { id: 'history', label: 'Reviewing medical history...', duration: 1000 },
    { id: 'vitals', label: 'Processing vital signs...', duration: 800 },
    { id: 'matching', label: 'Matching conditions...', duration: 1500 },
    { id: 'generating', label: 'Generating assessment...', duration: 1000 },
];

/** Analyzing page showing animated progress steps before redirecting to results. */
const AnalyzingPage: React.FC = () => {
    const router = useRouter();
    const { submitSymptoms: _submitSymptoms, isLoading: _isLoading, error } = useSymptomChecker();
    const { t: _t } = useTranslation();
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (error) {
            return;
        }
    }, [error]);

    useEffect(() => {
        if (activeStep >= ANALYSIS_STEPS.length) {
            const timer = setTimeout(() => {
                void router.push({
                    pathname: '/care/symptom-checker/conditions-list',
                    query: router.query,
                });
            }, 500);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            setActiveStep((prev) => prev + 1);
        }, ANALYSIS_STEPS[activeStep].duration);

        return () => clearTimeout(timer);
    }, [activeStep, router]);

    const progress = Math.round((activeStep / ANALYSIS_STEPS.length) * 100);

    return (
        <div
            style={{
                maxWidth: '720px',
                margin: '0 auto',
                padding: spacing.xl,
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Analyzing Your Symptoms
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing['2xl'] }}>
                Please wait while we process your information.
            </Text>

            <div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: colors.neutral.gray200,
                    overflow: 'hidden',
                    marginBottom: spacing.xl,
                }}
                data-testid="analyzing-progress-bar"
            >
                <div
                    style={{
                        width: `${progress}%`,
                        height: '100%',
                        borderRadius: '4px',
                        backgroundColor: colors.journeys.care.primary,
                        transition: 'width 0.5s ease-in-out',
                    }}
                />
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm,
                    width: '100%',
                    maxWidth: '400px',
                }}
            >
                {ANALYSIS_STEPS.map((step, index) => {
                    const isComplete = index < activeStep;
                    const isActive = index === activeStep;
                    return (
                        <Box key={step.id} display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                            <div
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    backgroundColor: isComplete
                                        ? colors.semantic.success
                                        : isActive
                                          ? colors.journeys.care.primary
                                          : colors.neutral.gray300,
                                    color: colors.neutral.white,
                                }}
                                data-testid={`step-${step.id}`}
                            >
                                {isComplete ? '\u2713' : index + 1}
                            </div>
                            <Text
                                fontSize="sm"
                                color={
                                    isComplete
                                        ? colors.semantic.success
                                        : isActive
                                          ? colors.journeys.care.text
                                          : colors.gray[40]
                                }
                                fontWeight={isActive ? 'medium' : 'regular'}
                            >
                                {step.label}
                            </Text>
                        </Box>
                    );
                })}
            </div>

            <Text fontSize="sm" color={colors.gray[40]} style={{ marginTop: spacing.xl }}>
                {progress}% complete
            </Text>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default AnalyzingPage;
