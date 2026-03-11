import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';

import { useTelemedicine } from '@/hooks';

/** Telemedicine session detail page. */
const TelemedicineSessionPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const { isLoading, error } = useTelemedicine();

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading session...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    Failed to load session. Please try again.
                </Text>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Button
                variant="secondary"
                journey="care"
                onPress={() => void router.push('/care/telemedicine')}
                accessibilityLabel="Back to telemedicine"
                style={{ marginBottom: spacing.lg }}
            >
                Back
            </Button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.care.text}
                style={{ marginBottom: spacing.lg }}
            >
                Telemedicine Session
            </Text>

            <Card journey="care" elevation="md" padding="lg">
                <Text fontSize="md" color={colors.gray[50]}>
                    Session ID: {id}
                </Text>
                <Text fontSize="sm" color={colors.gray[40]} style={{ marginTop: spacing.sm }}>
                    Preparing your telemedicine session...
                </Text>
            </Card>
        </div>
    );
};

export default TelemedicineSessionPage;
