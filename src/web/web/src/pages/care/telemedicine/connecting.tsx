import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

import { useTelemedicine } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

const MOCK_DOCTOR = {
    name: 'Dr. Maria Santos',
    specialty: 'General Practitioner',
    avatar: 'MS',
};

/** Connecting screen shown while establishing telemedicine video call. */
const ConnectingPage: React.FC = () => {
    const router = useRouter();
    const { isLoading, error } = useTelemedicine();

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Establishing connection...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    Connection failed. Please try again.
                </Text>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Connecting to Your Doctor
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing['2xl'] }}>
                Please wait while we establish a secure connection.
            </Text>

            <Card journey="care" elevation="md" padding="lg">
                <Box display="flex" alignItems="center" style={{ gap: spacing.md, marginBottom: spacing.xl }}>
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: colors.journeys.care.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text fontSize="lg" fontWeight="bold" color={colors.neutral.white}>
                            {MOCK_DOCTOR.avatar}
                        </Text>
                    </div>
                    <div>
                        <Text fontWeight="bold" fontSize="lg" color={colors.journeys.care.text}>
                            {MOCK_DOCTOR.name}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {MOCK_DOCTOR.specialty}
                        </Text>
                    </div>
                </Box>

                <Box display="flex" justifyContent="center" style={{ marginBottom: spacing.lg }}>
                    <Text fontSize="md" fontWeight="medium" color={colors.journeys.care.primary}>
                        Connecting...
                    </Text>
                </Box>

                <Text fontSize="sm" color={colors.gray[40]} style={{ textAlign: 'center', marginBottom: spacing.lg }}>
                    This usually takes less than 30 seconds. If the connection fails, you will be automatically retried.
                </Text>

                <Text fontSize="sm" color={colors.gray[40]} style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                    Connection timeout in 2:00
                </Text>

                <Box display="flex" justifyContent="center">
                    <Button
                        variant="secondary"
                        journey="care"
                        onPress={() => router.back()}
                        accessibilityLabel="Cancel connection"
                        data-testid="connecting-cancel-btn"
                    >
                        Cancel
                    </Button>
                </Box>
            </Card>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default ConnectingPage;
