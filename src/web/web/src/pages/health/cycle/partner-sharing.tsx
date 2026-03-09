import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface PrivacyOption {
    id: string;
    label: string;
    description: string;
}

const PRIVACY_OPTIONS: PrivacyOption[] = [
    { id: 'cycle_phase', label: 'Current Phase', description: 'Share which cycle phase you are in' },
    { id: 'period_dates', label: 'Period Dates', description: 'Share predicted and actual period dates' },
    { id: 'fertility', label: 'Fertility Window', description: 'Share fertile day predictions' },
    { id: 'symptoms', label: 'Symptoms', description: 'Share logged symptoms and mood' },
];

const toggleStyle = (enabled: boolean): React.CSSProperties => ({
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: enabled ? colors.journeys.health.primary : colors.gray[30],
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    border: 'none',
    flexShrink: 0,
});

const toggleKnobStyle = (enabled: boolean): React.CSSProperties => ({
    width: 22,
    height: 22,
    borderRadius: '50%',
    backgroundColor: colors.gray[0],
    position: 'absolute',
    top: 3,
    left: enabled ? 23 : 3,
    transition: 'left 0.2s ease',
});

const PartnerSharingPage: React.FC = () => {
    const router = useRouter();
    const [sharingEnabled, setSharingEnabled] = useState(false);
    const [privacySettings, setPrivacySettings] = useState<Record<string, boolean>>({
        cycle_phase: true,
        period_dates: true,
        fertility: false,
        symptoms: false,
    });
    const [partnerConnected] = useState(false);

    const togglePrivacy = (id: string): void => {
        setPrivacySettings((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleGenerateLink = (): void => {
        window.alert('Invite link copied to clipboard.');
    };

    const handleDisconnect = (): void => {
        window.alert('Partner disconnected.');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/cycle')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to cycle home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Partner Sharing
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Share cycle information with your partner
            </Text>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Text fontWeight="semiBold" fontSize="md">
                            Enable Sharing
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Allow your partner to view selected data
                        </Text>
                    </Box>
                    <button
                        onClick={() => setSharingEnabled(!sharingEnabled)}
                        style={toggleStyle(sharingEnabled)}
                        role="switch"
                        aria-checked={sharingEnabled}
                        aria-label="Toggle partner sharing"
                    >
                        <div style={toggleKnobStyle(sharingEnabled)} />
                    </button>
                </Box>
            </Card>

            {sharingEnabled && (
                <>
                    <Text
                        fontSize="lg"
                        fontWeight="semiBold"
                        color={colors.journeys.health.text}
                        style={{ marginBottom: spacing.sm }}
                    >
                        Privacy Controls
                    </Text>
                    <div
                        style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}
                    >
                        {PRIVACY_OPTIONS.map((opt) => (
                            <Card key={opt.id} journey="health" elevation="sm" padding="md">
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box style={{ flex: 1, marginRight: spacing.md }}>
                                        <Text fontWeight="semiBold" fontSize="sm">
                                            {opt.label}
                                        </Text>
                                        <Text fontSize="xs" color={colors.gray[50]}>
                                            {opt.description}
                                        </Text>
                                    </Box>
                                    <button
                                        onClick={() => togglePrivacy(opt.id)}
                                        style={toggleStyle(!!privacySettings[opt.id])}
                                        role="switch"
                                        aria-checked={!!privacySettings[opt.id]}
                                        aria-label={`Toggle ${opt.label}`}
                                    >
                                        <div style={toggleKnobStyle(!!privacySettings[opt.id])} />
                                    </button>
                                </Box>
                            </Card>
                        ))}
                    </div>

                    <Text
                        fontSize="lg"
                        fontWeight="semiBold"
                        color={colors.journeys.health.text}
                        style={{ marginBottom: spacing.sm }}
                    >
                        {partnerConnected ? 'Connected Partner' : 'Invite Partner'}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                        {partnerConnected ? (
                            <Box>
                                <Text fontWeight="semiBold" fontSize="md">
                                    Partner Name
                                </Text>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    Connected since Jan 15, 2026
                                </Text>
                                <Button
                                    variant="secondary"
                                    journey="health"
                                    onPress={handleDisconnect}
                                    accessibilityLabel="Disconnect partner"
                                    style={{ marginTop: spacing.sm }}
                                >
                                    Disconnect
                                </Button>
                            </Box>
                        ) : (
                            <Box>
                                <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.sm }}>
                                    Generate an invite link to share with your partner.
                                </Text>
                                <Button
                                    journey="health"
                                    onPress={handleGenerateLink}
                                    accessibilityLabel="Generate invite link"
                                >
                                    Generate Invite Link
                                </Button>
                            </Box>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
};

export default PartnerSharingPage;
