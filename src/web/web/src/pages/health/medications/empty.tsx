import React from 'react';
import { useRouter } from 'next/router';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { WEB_HEALTH_ROUTES } from 'shared/constants/routes';

/**
 * Empty state page displayed when the user has no medications.
 * Provides a clear CTA to add the first medication.
 */
const MedicationEmptyPage: React.FC = () => {
    const router = useRouter();

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
                {/* Pill Icon Placeholder */}
                <div
                    style={{
                        width: 96,
                        height: 96,
                        borderRadius: 48,
                        border: `2px solid ${colors.journeys.health.primary}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: spacing.xl,
                        backgroundColor: colors.journeys.health.background,
                    }}
                >
                    <span style={{ fontSize: 40 }}>{'\uD83D\uDC8A'}</span>
                </div>

                <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                    No Medications Yet
                </Text>

                <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.sm, maxWidth: 360 }}>
                    Start tracking your health by adding your first medication. We will help you stay on schedule with
                    reminders and dose tracking.
                </Text>

                <Box style={{ marginTop: spacing['2xl'], width: '100%', maxWidth: 300 }}>
                    <Button
                        journey="health"
                        onPress={() => router.push(WEB_HEALTH_ROUTES.MEDICATION_ADD)}
                        accessibilityLabel="Add your first medication"
                    >
                        Add Your First Medication
                    </Button>
                </Box>

                <Box style={{ marginTop: spacing.md }}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={() => router.push(WEB_HEALTH_ROUTES.MEDICATIONS)}
                        accessibilityLabel="Back to medications"
                    >
                        Back to Medications
                    </Button>
                </Box>
            </div>
        </div>
    );
};

export default MedicationEmptyPage;
