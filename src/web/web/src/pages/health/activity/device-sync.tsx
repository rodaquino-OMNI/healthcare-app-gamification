import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const DATA_SOURCES = [
    { id: 'apple_health', label: 'Apple Health', description: 'Sync via HealthKit integration' },
    { id: 'google_fit', label: 'Google Fit', description: 'Connect your Google Fit account' },
    { id: 'manual', label: 'Manual Entry', description: 'Log activity data manually' },
];

const DeviceSyncPage: React.FC = () => {
    const router = useRouter();
    const [source, setSource] = useState('manual');
    const [connected, setConnected] = useState(false);

    const handleSync = () => {
        window.alert('Syncing activity data from device...');
    };

    const handleConnect = () => {
        if (source === 'manual') {
            window.alert('Manual entry is always available.');
            return;
        }
        setConnected(!connected);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/activity')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to activity home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Device Sync
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Connect and manage your fitness devices
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Connected Device
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                {connected ? (
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Text fontWeight="semiBold" fontSize="md">
                                    {DATA_SOURCES.find((s) => s.id === source)?.label}
                                </Text>
                                <Text fontSize="sm" color={colors.semantic.success}>
                                    Connected
                                </Text>
                            </Box>
                            <div
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: colors.semantic.success,
                                }}
                            />
                        </Box>
                        <div style={{ height: 1, backgroundColor: colors.gray[10], margin: `${spacing.sm} 0` }} />
                        <Text fontSize="xs" color={colors.gray[40]}>
                            Last synced: Today at 09:30 AM
                        </Text>
                    </Box>
                ) : (
                    <Box style={{ textAlign: 'center', padding: spacing.lg }}>
                        <Text fontSize="md" color={colors.gray[40]}>
                            No device connected
                        </Text>
                        <Text fontSize="sm" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                            Select a data source below to get started
                        </Text>
                    </Box>
                )}
            </Card>

            {connected && (
                <Box display="flex" justifyContent="center" style={{ marginBottom: spacing.xl }}>
                    <Button variant="secondary" journey="health" onPress={handleSync} accessibilityLabel="Sync now">
                        Sync Now
                    </Button>
                </Box>
            )}

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Data Source
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                {DATA_SOURCES.map((opt) => (
                    <div
                        key={opt.id}
                        onClick={() => setSource(opt.id)}
                        role="radio"
                        aria-checked={source === opt.id}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setSource(opt.id);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                                <div
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: '50%',
                                        border: `2px solid ${colors.journeys.health.primary}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    {source === opt.id && (
                                        <div
                                            style={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                backgroundColor: colors.journeys.health.primary,
                                            }}
                                        />
                                    )}
                                </div>
                                <Box>
                                    <Text fontWeight="semiBold" fontSize="md">
                                        {opt.label}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {opt.description}
                                    </Text>
                                </Box>
                            </Box>
                        </Card>
                    </div>
                ))}
            </div>

            <Button
                journey="health"
                onPress={handleConnect}
                accessibilityLabel={connected ? 'Disconnect device' : 'Connect device'}
            >
                {connected ? 'Disconnect' : 'Connect'}
            </Button>
        </div>
    );
};

export default DeviceSyncPage;
