import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';

import { useVisits } from '@/hooks';

interface Prescription {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    refills: number;
}

/** Prescriptions page listing medications prescribed during the visit. */
const PrescriptionsPage: React.FC = () => {
    const router = useRouter();
    const { isLoading, error } = useVisits();
    const prescriptions: Prescription[] = [];

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading prescriptions...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    Failed to load prescriptions.
                </Text>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Prescriptions
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Medications prescribed by Dr. Maria Santos on Feb 21, 2026.
            </Text>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {prescriptions.map((rx) => (
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
