import React from 'react';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface StepProps {
    data: Record<string, any>;
    onUpdate: (field: string, value: any) => void;
}

const BENEFITS = [
    'Personalized health insights based on your profile',
    'Risk factor identification and prevention tips',
    'Tailored wellness goals and action plans',
    'Better communication with your healthcare providers',
];

const StepIntroductionPage: React.FC<StepProps> = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <div
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: colors.journeys.health.background,
                    border: `2px solid ${colors.journeys.health.primary}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                }}
            >
                <span style={{ fontSize: 36 }}>{'\uD83C\uDFE5'}</span>
            </div>

            <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.text} style={{ textAlign: 'center' }}>
                Welcome to Your Health Assessment
            </Text>

            <Text fontSize="md" color={colors.gray[50]} style={{ textAlign: 'center' }}>
                This comprehensive assessment helps us understand your health profile and provide personalized
                recommendations.
            </Text>

            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="md"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    What you will get:
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {BENEFITS.map((benefit, idx) => (
                        <div
                            key={`benefit-${idx}`}
                            style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.xs }}
                        >
                            <Text fontSize="md" color={colors.journeys.health.primary} style={{ lineHeight: '24px' }}>
                                {'\u2713'}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[60]}>
                                {benefit}
                            </Text>
                        </div>
                    ))}
                </div>
            </Card>

            <Card journey="health" elevation="sm" padding="md">
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <Text fontSize="lg">{'\u23F1'}</Text>
                    <div>
                        <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
                            Estimated time: 10-15 minutes
                        </Text>
                        <Text fontSize="xs" color={colors.gray[50]}>
                            You can save progress and continue later
                        </Text>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default StepIntroductionPage;
