import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const CONSENT_ITEMS = [
    {
        key: 'shareHealthData',
        label: 'I consent to share my health data with my healthcare team',
        description: 'Your data will be securely shared with your assigned doctors and care coordinators.',
    },
    {
        key: 'receiveInsights',
        label: 'I agree to receive health insights and recommendations',
        description: 'We will analyze your data to provide personalized health suggestions.',
    },
    {
        key: 'dataProtection',
        label: 'I understand my data is protected under LGPD/HIPAA',
        description: 'Your health information is encrypted and stored in compliance with data protection regulations.',
    },
];

const checkboxStyle = (checked: boolean): React.CSSProperties => ({
    width: 22,
    height: 22,
    borderRadius: 4,
    border: `2px solid ${checked ? colors.journeys.health.primary : colors.neutral.gray400}`,
    backgroundColor: checked ? colors.journeys.health.primary : colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
});

const StepConsentPrivacyPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Consent & Privacy
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Please review and accept the following to proceed with your health assessment.
            </Text>

            {/* Consent Toggles */}
            <Card journey="health" elevation="sm" padding="lg">
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {CONSENT_ITEMS.map((item) => {
                        const checked = !!(data[item.key] as boolean);
                        return (
                            <button
                                key={item.key}
                                onClick={() => onUpdate(item.key, !(data[item.key] as boolean))}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: spacing.sm,
                                    padding: spacing.md,
                                    borderRadius: 8,
                                    border: `1px solid ${checked ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                    backgroundColor: checked ? colors.journeys.health.background : colors.neutral.white,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    width: '100%',
                                }}
                                aria-pressed={checked}
                                aria-label={`${item.label} ${checked ? 'accepted' : 'not accepted'}`}
                            >
                                <div style={checkboxStyle(checked)}>
                                    {checked && (
                                        <Text fontSize="xs" color={colors.neutral.white}>
                                            {'\u2713'}
                                        </Text>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text
                                        fontSize="sm"
                                        fontWeight={checked ? 'semiBold' : 'regular'}
                                        color={colors.neutral.gray900}
                                    >
                                        {item.label}
                                    </Text>
                                    <Text
                                        fontSize="xs"
                                        color={colors.neutral.gray600}
                                        style={{ marginTop: spacing['3xs'] }}
                                    >
                                        {item.description}
                                    </Text>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Data Usage Info */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.xs }}
                >
                    How We Use Your Data
                </Text>
                <Text fontSize="sm" color={colors.neutral.gray600} style={{ lineHeight: '20px' }}>
                    Your health assessment data is used to generate personalized health insights, connect you with the
                    right healthcare professionals, and improve the quality of your care plan. We never sell your data
                    to third parties.
                </Text>
            </Card>

            {/* Privacy Policy Link */}
            <div style={{ textAlign: 'center' }}>
                <button
                    onClick={() => onUpdate('viewPrivacyPolicy', true)}
                    style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: colors.journeys.health.primary,
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: 'underline',
                    }}
                    aria-label="View privacy policy"
                >
                    View Full Privacy Policy
                </button>
            </div>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default StepConsentPrivacyPage;
