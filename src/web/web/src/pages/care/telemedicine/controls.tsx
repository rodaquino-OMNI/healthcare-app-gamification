import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

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

      <Card
        journey="care"
        elevation="md"
        padding="lg"
        style={{ marginBottom: spacing.lg }}
      >
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
          onPress={() => router.push('/care/telemedicine/end')}
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

export default ControlsPage;
