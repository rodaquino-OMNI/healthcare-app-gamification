import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTelemedicine } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

/** Telemedicine landing page listing active and upcoming sessions. */
const TelemedicinePage: React.FC = () => {
    const router = useRouter();
    const { isLoading, error } = useTelemedicine();
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

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.care.text}
                style={{ marginBottom: spacing.lg }}
            >
                Telemedicine
            </Text>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.md }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    No active telemedicine sessions. Book an appointment to get started.
                </Text>
            </Card>

            <Button
                journey="care"
                onPress={() => void router.push('/care/appointments/book')}
                accessibilityLabel="Book telemedicine appointment"
            >
                Book Appointment
            </Button>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default TelemedicinePage;
