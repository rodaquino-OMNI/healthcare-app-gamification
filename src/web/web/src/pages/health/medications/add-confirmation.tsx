import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WEB_HEALTH_ROUTES } from 'shared/constants/routes';

import { useMedications } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

/**
 * Success page displayed after successfully adding a medication.
 * Shows the medication name/dosage and provides next step CTAs.
 */
const MedicationAddConfirmationPage: React.FC = () => {
    const { t } = useTranslation();
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();
    const { name, dosage } = router.query;

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>{t('common.loading')}</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    {t('common.error')} <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void medications;

    const medicationName = (name as string) || 'Medication';
    const medicationDosage = (dosage as string) || '';

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                }}
            >
                {/* Checkmark Icon */}
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: colors.semantic.success,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: spacing.xl,
                    }}
                >
                    <span style={{ fontSize: 36, color: colors.neutral.white }}>{'\u2713'}</span>
                </div>

                <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                    Medication Added!
                </Text>

                {/* Medication Details */}
                <Card
                    journey="health"
                    elevation="sm"
                    padding="lg"
                    style={{ marginTop: spacing.xl, width: '100%', maxWidth: 400 }}
                >
                    <Text fontWeight="semiBold" fontSize="lg" style={{ textAlign: 'center' }}>
                        {medicationName}
                    </Text>
                    {medicationDosage && (
                        <Text
                            fontSize="md"
                            color={colors.gray[50]}
                            style={{ textAlign: 'center', marginTop: spacing.xs }}
                        >
                            {medicationDosage}
                        </Text>
                    )}
                </Card>

                {/* Action Buttons */}
                <Box style={{ marginTop: spacing['2xl'], width: '100%', maxWidth: 400 }}>
                    <Button
                        journey="health"
                        onPress={() => void router.push(WEB_HEALTH_ROUTES.MEDICATION_REMINDER)}
                        accessibilityLabel="Set up reminders for this medication"
                    >
                        Set Up Reminders
                    </Button>
                </Box>

                <Box style={{ marginTop: spacing.sm, width: '100%', maxWidth: 400 }}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={() => void router.push(WEB_HEALTH_ROUTES.MEDICATIONS)}
                        accessibilityLabel="Back to medications list"
                    >
                        Back to Medications
                    </Button>
                </Box>
            </div>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default MedicationAddConfirmationPage;
