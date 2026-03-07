import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const EMERGENCY_SYMPTOMS = [
    'Difficulty breathing or shortness of breath',
    'Persistent chest pain or pressure',
    'Sudden confusion or inability to stay alert',
    'Severe or persistent vomiting',
    'Signs of low blood pressure (dizziness, fainting)',
    'High fever (above 39.4C / 103F) not responding to medication',
    'Sudden severe headache with stiff neck',
    'Seizures',
];

/** Emergency warning screen with red alert styling and call-to-action buttons. */
const EmergencyWarningPage: React.FC = () => {
    const router = useRouter();

    const handleCallEmergency = () => {
        window.open('tel:192', '_self');
    };

    const handleCallSAMU = () => {
        window.open('tel:192', '_self');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Card
                journey="care"
                elevation="md"
                padding="lg"
                borderColor={colors.semantic.error}
                backgroundColor={colors.semantic.errorBg}
            >
                <Box display="flex" alignItems="center" style={{ gap: spacing.sm, marginBottom: spacing.md }}>
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: colors.semantic.error,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.neutral.white,
                            fontWeight: 'bold',
                            fontSize: '20px',
                        }}
                    >
                        !
                    </div>
                    <Text fontSize="2xl" fontWeight="bold" color={colors.semantic.error}>
                        Emergency Warning
                    </Text>
                </Box>

                <Text fontSize="md" color={colors.journeys.care.text} style={{ marginBottom: spacing.lg }}>
                    Based on your symptoms, you may need immediate medical attention. If you are experiencing any of the
                    following, call emergency services or go to the nearest emergency room.
                </Text>

                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
                    {EMERGENCY_SYMPTOMS.map((symptom, index) => (
                        <Box key={index} display="flex" alignItems="flex-start" style={{ gap: spacing.xs }}>
                            <div
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: colors.semantic.error,
                                    marginTop: '6px',
                                    flexShrink: 0,
                                }}
                            />
                            <Text fontSize="sm" color={colors.journeys.care.text}>
                                {symptom}
                            </Text>
                        </Box>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    <Button
                        journey="care"
                        onPress={handleCallEmergency}
                        accessibilityLabel="Call emergency services 192"
                        data-testid="emergency-call-192-btn"
                        style={{ backgroundColor: colors.semantic.error }}
                    >
                        Call SAMU (192)
                    </Button>
                    <Button
                        variant="secondary"
                        journey="care"
                        onPress={handleCallSAMU}
                        accessibilityLabel="Call emergency services"
                        data-testid="emergency-call-btn"
                    >
                        Call Emergency (192)
                    </Button>
                </div>
            </Card>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginTop: spacing.lg }}>
                <Text fontWeight="medium" fontSize="md" style={{ marginBottom: spacing.sm }}>
                    Find Nearest Emergency Room
                </Text>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => router.push('/care/symptom-checker/er-locator')}
                    accessibilityLabel="Find nearest emergency room"
                    data-testid="emergency-er-locator-btn"
                >
                    ER Locator
                </Button>
            </Card>

            <Box display="flex" justifyContent="center" style={{ marginTop: spacing.xl }}>
                <Button
                    variant="tertiary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                    data-testid="emergency-back-btn"
                >
                    Back to Results
                </Button>
            </Box>
        </div>
    );
};

export default EmergencyWarningPage;
