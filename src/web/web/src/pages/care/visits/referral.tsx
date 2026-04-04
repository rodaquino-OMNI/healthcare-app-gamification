import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useVisits } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

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
    const { currentVisit, isLoading, error } = useVisits();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    {t('common.loading')}
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    {t('common.error')}
                </Text>
            </div>
        );
    }

    const referral = {
        referringDoctor: currentVisit?.doctor ?? '',
        referringSpecialty: currentVisit?.specialty ?? '',
        specialist: '',
        specialistField: '',
        specialistClinic: '',
        specialistAddress: '',
        reason: '',
        urgency: 'routine' as const,
        referralDate: currentVisit?.date ?? '',
        validUntil: '',
        notes: currentVisit?.notes ?? '',
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing.xl }}>
                <div>
                    <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                        Specialist Referral
                    </Text>
                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                        Issued {referral.referralDate}
                    </Text>
                </div>
                <Badge variant="status" status={getUrgencyStatus(referral.urgency)}>
                    {getUrgencyLabel(referral.urgency)}
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
                    {referral.referringDoctor}
                </Text>
                <Text fontSize="sm" color={colors.gray[50]}>
                    {referral.referringSpecialty}
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
                    {referral.specialist}
                </Text>
                <Text fontSize="sm" color={colors.journeys.care.primary}>
                    {referral.specialistField}
                </Text>
                <Text fontSize="sm" color={colors.gray[60]} style={{ marginTop: spacing.xs }}>
                    {referral.specialistClinic}
                </Text>
                <Text fontSize="sm" color={colors.gray[50]}>
                    {referral.specialistAddress}
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
                    {referral.reason}
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
                    {referral.notes}
                </Text>
                <Text fontSize="sm" color={colors.gray[40]} style={{ marginTop: spacing.sm }}>
                    Valid until: {referral.validUntil}
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

export const getServerSideProps = () => ({ props: {} });

export default ReferralPage;
