import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';

const MOCK_REFERRAL = {
    referringDoctor: 'Dr. Maria Santos',
    referringSpecialty: 'General Practitioner',
    specialist: 'Dr. Carlos Mendes',
    specialistField: 'Neurology',
    specialistClinic: 'NeuroHealth Center',
    specialistAddress: '789 Medical Park Blvd, Suite 301',
    reason: 'Persistent tension-type headaches unresponsive to initial treatment, requiring neurological evaluation to rule out secondary causes.',
    urgency: 'moderate' as const,
    referralDate: 'Feb 21, 2026',
    validUntil: 'May 21, 2026',
    notes: 'Patient has been experiencing recurrent headaches for the past 3 weeks. Initial treatment with analgesics has shown limited improvement. MRI recommended if symptoms persist.',
};

const getUrgencyLabel = (urgency: string): string => {
    switch (urgency) {
        case 'high':
            return 'High Priority';
        case 'moderate':
            return 'Moderate';
        default:
            return 'Routine';
    }
};

const getUrgencyStatus = (urgency: string): 'error' | 'warning' | 'success' => {
    switch (urgency) {
        case 'high':
            return 'error';
        case 'moderate':
            return 'warning';
        default:
            return 'success';
    }
};

/** Specialist referral page with referring doctor and specialist details. */
const ReferralPage: React.FC = () => {
    const router = useRouter();

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing.xl }}>
                <div>
                    <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                        Specialist Referral
                    </Text>
                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                        Issued {MOCK_REFERRAL.referralDate}
                    </Text>
                </div>
                <Badge variant="status" status={getUrgencyStatus(MOCK_REFERRAL.urgency)}>
                    {getUrgencyLabel(MOCK_REFERRAL.urgency)}
                </Badge>
            </Box>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Referring Doctor
                </Text>
                <Text fontSize="md" color={colors.journeys.care.text}>
                    {MOCK_REFERRAL.referringDoctor}
                </Text>
                <Text fontSize="sm" color={colors.gray[50]}>
                    {MOCK_REFERRAL.referringSpecialty}
                </Text>
            </Card>

            <Card journey="care" elevation="md" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Specialist
                </Text>
                <Text fontSize="lg" fontWeight="medium" color={colors.journeys.care.text}>
                    {MOCK_REFERRAL.specialist}
                </Text>
                <Text fontSize="sm" color={colors.journeys.care.primary}>
                    {MOCK_REFERRAL.specialistField}
                </Text>
                <Text fontSize="sm" color={colors.gray[60]} style={{ marginTop: spacing.xs }}>
                    {MOCK_REFERRAL.specialistClinic}
                </Text>
                <Text fontSize="sm" color={colors.gray[50]}>
                    {MOCK_REFERRAL.specialistAddress}
                </Text>
            </Card>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.xs }}
                >
                    Reason for Referral
                </Text>
                <Text fontSize="sm" color={colors.gray[60]}>
                    {MOCK_REFERRAL.reason}
                </Text>
            </Card>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.xs }}
                >
                    Additional Notes
                </Text>
                <Text fontSize="sm" color={colors.gray[60]}>
                    {MOCK_REFERRAL.notes}
                </Text>
                <Text fontSize="sm" color={colors.gray[40]} style={{ marginTop: spacing.sm }}>
                    Valid until: {MOCK_REFERRAL.validUntil}
                </Text>
            </Card>

            <div style={{ display: 'flex', gap: spacing.sm }}>
                <Button
                    journey="care"
                    onPress={() => void router.push('/care/appointments/search')}
                    accessibilityLabel="Book with specialist"
                    data-testid="referral-book-btn"
                >
                    Book with Specialist
                </Button>
                <Button
                    variant="tertiary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                    data-testid="referral-back-btn"
                >
                    Back
                </Button>
            </div>
        </div>
    );
};

export default ReferralPage;
