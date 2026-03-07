import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Badge } from 'design-system/components/Badge/Badge';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

interface Prescription {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    refills: number;
}

const MOCK_PRESCRIPTIONS: Prescription[] = [
    {
        id: 'rx1',
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Every 8 hours',
        duration: '7 days',
        instructions: 'Take with food. Do not exceed 3 doses per day.',
        refills: 1,
    },
    {
        id: 'rx2',
        name: 'Cyclobenzaprine',
        dosage: '10mg',
        frequency: 'Once daily at bedtime',
        duration: '14 days',
        instructions: 'May cause drowsiness. Do not operate heavy machinery.',
        refills: 0,
    },
    {
        id: 'rx3',
        name: 'Magnesium Citrate',
        dosage: '200mg',
        frequency: 'Twice daily',
        duration: '30 days',
        instructions: 'Take with a full glass of water. May be taken with or without food.',
        refills: 2,
    },
];

/** Prescriptions page listing medications prescribed during the visit. */
const PrescriptionsPage: React.FC = () => {
    const router = useRouter();

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Prescriptions
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Medications prescribed by Dr. Maria Santos on Feb 21, 2026.
            </Text>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {MOCK_PRESCRIPTIONS.map((rx) => (
                    <Card key={rx.id} journey="care" elevation="md" padding="lg">
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ marginBottom: spacing.sm }}
                        >
                            <Text fontWeight="bold" fontSize="lg" color={colors.journeys.care.text}>
                                {rx.name}
                            </Text>
                            <Badge variant="status" status="info">
                                {rx.dosage}
                            </Badge>
                        </Box>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: spacing['3xs'],
                                marginBottom: spacing.sm,
                            }}
                        >
                            <Box display="flex" justifyContent="space-between">
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    Frequency
                                </Text>
                                <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                                    {rx.frequency}
                                </Text>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    Duration
                                </Text>
                                <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                                    {rx.duration}
                                </Text>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    Refills
                                </Text>
                                <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                                    {rx.refills}
                                </Text>
                            </Box>
                        </div>

                        <Text
                            fontSize="sm"
                            color={colors.gray[60]}
                            style={{
                                padding: spacing.sm,
                                backgroundColor: colors.journeys.care.background,
                                borderRadius: spacing.xs,
                                marginBottom: spacing.md,
                            }}
                        >
                            {rx.instructions}
                        </Text>

                        <Button
                            variant="secondary"
                            journey="care"
                            onPress={() => {}}
                            accessibilityLabel={`Send ${rx.name} to pharmacy`}
                            data-testid={`rx-send-pharmacy-${rx.id}-btn`}
                        >
                            Send to Pharmacy
                        </Button>
                    </Card>
                ))}
            </div>

            <Box display="flex" justifyContent="center" style={{ marginTop: spacing.xl }}>
                <Button
                    variant="tertiary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                    data-testid="prescriptions-back-btn"
                >
                    Back
                </Button>
            </Box>
        </div>
    );
};

export default PrescriptionsPage;
