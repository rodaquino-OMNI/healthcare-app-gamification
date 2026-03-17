import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

import { useTelemedicine } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface ControlButton {
    id: string;
    label: string;
    icon: string;
    variant: 'secondary' | 'tertiary';
}

const CONTROLS: ControlButton[] = [
    { id: 'mute', label: 'Mute', icon: 'Mic', variant: 'secondary' },
    { id: 'camera', label: 'Camera', icon: 'Cam', variant: 'secondary' },
    { id: 'speaker', label: 'Speaker', icon: 'Vol', variant: 'secondary' },
    { id: 'chat', label: 'Chat', icon: 'Msg', variant: 'tertiary' },
];

const MOCK_DOCTOR = {
    name: 'Dr. Maria Santos',
    specialty: 'General Practitioner',
};

/** Video consultation page with camera controls and call management. */
const ControlsPage: React.FC = () => {
    const router = useRouter();
    const { isLoading, error, endSession } = useTelemedicine();

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading consultation...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    Session error. Please try again.
                </Text>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing.lg }}>
                <div>
                    <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                        Video Consultation
                    </Text>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        {MOCK_DOCTOR.name} - {MOCK_DOCTOR.specialty}
                    </Text>
                </div>
                <Text fontSize="md" fontWeight="medium" color={colors.journeys.care.primary}>
                    12:34
                </Text>
            </Box>

            <Card journey="care" elevation="md" padding="lg" style={{ marginBottom: spacing.lg }}>
                <div
                    style={{
                        width: '100%',
                        height: '360px',
                        backgroundColor: colors.gray[70],
                        borderRadius: spacing.xs,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: spacing.lg,
                    }}
                >
                    <Text fontSize="lg" color={colors.neutral.white}>
                        Video Feed
                    </Text>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        bottom: spacing['4xl'],
                        right: spacing.xl,
                        width: '120px',
                        height: '90px',
                        backgroundColor: colors.gray[60],
                        borderRadius: spacing.xs,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text fontSize="sm" color={colors.neutral.white}>
                        You
                    </Text>
                </div>
            </Card>

            <Box display="flex" justifyContent="center" style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
                {CONTROLS.map((control) => (
                    <Button
                        key={control.id}
                        variant={control.variant}
                        journey="care"
                        onPress={() => {}}
                        accessibilityLabel={control.label}
                        data-testid={`control-${control.id}-btn`}
                    >
                        {control.icon}
                    </Button>
                ))}
            </Box>

            <Box display="flex" justifyContent="center">
                <Button
                    journey="care"
                    onPress={() => {
                        void endSession();
                        void router.push('/care/telemedicine/end');
                    }}
                    accessibilityLabel="End call"
                    data-testid="control-end-call-btn"
                    style={{ backgroundColor: colors.semantic.error }}
                >
                    End Call
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default ControlsPage;
