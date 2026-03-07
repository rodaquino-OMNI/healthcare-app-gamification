import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Badge } from 'design-system/components/Badge/Badge';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

/** Screen share view during telemedicine consultation. */
const ScreenSharePage: React.FC = () => {
    const router = useRouter();

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing.lg }}>
                <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                    Screen Share
                </Text>
                <Badge variant="status" status="info">
                    Sharing Active
                </Badge>
            </Box>

            <Card journey="care" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                <Box display="flex" alignItems="center" style={{ gap: spacing.xs }}>
                    <div
                        style={{
                            width: spacing.xs,
                            height: spacing.xs,
                            borderRadius: '50%',
                            backgroundColor: colors.semantic.info,
                        }}
                    />
                    <Text fontSize="sm" fontWeight="medium" color={colors.semantic.info}>
                        Dr. Santos is sharing their screen
                    </Text>
                </Box>
            </Card>

            <Card journey="care" elevation="md" padding="lg" style={{ marginBottom: spacing.xl }}>
                <div
                    style={{
                        width: '100%',
                        height: '420px',
                        backgroundColor: colors.gray[10],
                        borderRadius: spacing.xs,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${colors.gray[20]}`,
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <Text fontSize="lg" fontWeight="medium" color={colors.gray[50]}>
                            Shared Content
                        </Text>
                        <Text fontSize="sm" color={colors.gray[40]} style={{ marginTop: spacing.xs }}>
                            The doctor is sharing lab results and diagnostic images
                        </Text>
                    </div>
                </div>
            </Card>

            <Text fontSize="sm" color={colors.gray[40]} style={{ textAlign: 'center', marginBottom: spacing.lg }}>
                You can still hear the doctor while viewing shared content. Your camera remains active.
            </Text>

            <Box display="flex" justifyContent="center">
                <Button
                    journey="care"
                    onPress={() => router.push('/care/telemedicine/controls')}
                    accessibilityLabel="Return to video call"
                    data-testid="screen-share-return-btn"
                >
                    Return to Video
                </Button>
            </Box>
        </div>
    );
};

export default ScreenSharePage;
