import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const NEXT_STEPS = [
    {
        key: 'doctorReview',
        title: 'Doctor Review',
        description: 'A healthcare professional will review your assessment within 24 hours.',
    },
    {
        key: 'personalizedPlan',
        title: 'Personalized Care Plan',
        description: 'Based on your results, we will create a tailored health plan for you.',
    },
    {
        key: 'healthInsights',
        title: 'Health Insights',
        description: 'Receive actionable insights and recommendations to improve your health.',
    },
];

const StepSubmissionConfirmPage: React.FC<StepProps> = ({ onUpdate }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, alignItems: 'center' }}>
            {/* Success Icon */}
            <div
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: colors.semantic.success,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: spacing.xl,
                }}
            >
                <span style={{ fontSize: 36, color: colors.neutral.white }}>{'\u2713'}</span>
            </div>

            {/* Success Message */}
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text} style={{ textAlign: 'center' }}>
                Your Assessment Has Been Submitted!
            </Text>
            <Text fontSize="sm" color={colors.gray[50]} style={{ textAlign: 'center', maxWidth: 400 }}>
                Thank you for completing your health assessment. Your information is being processed securely.
            </Text>

            {/* Processing Time */}
            <Card journey="health" elevation="sm" padding="lg" style={{ width: '100%' }}>
                <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
                    Estimated Processing Time
                </Text>
                <Text fontSize="sm" color={colors.neutral.gray600} style={{ marginTop: spacing['3xs'] }}>
                    Your results will be available within 24-48 hours. You will receive a notification when ready.
                </Text>
            </Card>

            {/* Next Steps */}
            <div style={{ width: '100%' }}>
                <Text
                    fontSize="md"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    What Happens Next
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {NEXT_STEPS.map((step, index) => (
                        <div
                            key={step.key}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: spacing.sm,
                            }}
                        >
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 14,
                                    backgroundColor: colors.journeys.health.primary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    color: colors.neutral.white,
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                {index + 1}
                            </div>
                            <div>
                                <Text fontSize="sm" fontWeight="medium" color={colors.neutral.gray900}>
                                    {step.title}
                                </Text>
                                <Text fontSize="xs" color={colors.neutral.gray600}>
                                    {step.description}
                                </Text>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Results Button */}
            <button
                onClick={() => onUpdate('viewResults', true)}
                style={{
                    width: '100%',
                    padding: spacing.md,
                    borderRadius: 8,
                    border: 'none',
                    backgroundColor: colors.journeys.health.primary,
                    color: colors.neutral.white,
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 600,
                    marginTop: spacing.sm,
                }}
                aria-label="View my results"
            >
                View My Results
            </button>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default StepSubmissionConfirmPage;
