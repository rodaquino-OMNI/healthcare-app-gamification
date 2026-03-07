import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const QUICK_STATS = [
    { label: 'Sleep Score', value: '85' },
    { label: 'Hours Slept', value: '7.4h' },
    { label: 'Sleep Quality', value: 'Good' },
    { label: 'Streak', value: '12 days' },
];

const NAV_LINKS = [
    { label: 'Log Sleep', href: '/health/sleep/log' },
    { label: 'Quality', href: '/health/sleep/quality' },
    { label: 'Diary', href: '/health/sleep/diary' },
    { label: 'Trends', href: '/health/sleep/trends' },
    { label: 'Goals', href: '/health/sleep/goals' },
    { label: 'Bedtime Routine', href: '/health/sleep/bedtime-routine' },
    { label: 'Smart Alarm', href: '/health/sleep/smart-alarm' },
    { label: 'Insights', href: '/health/sleep/insights' },
    { label: 'Device Sync', href: '/health/sleep/device-sync' },
    { label: 'Export', href: '/health/sleep/export' },
];

const SleepHomePage: React.FC = () => {
    const router = useRouter();

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to health home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Sleep Management
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Track and improve your sleep patterns for better health
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Quick Stats
            </Text>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: spacing.sm,
                    marginBottom: spacing['2xl'],
                }}
            >
                {QUICK_STATS.map((stat) => (
                    <Card key={stat.label} journey="health" elevation="sm" padding="md">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {stat.label}
                        </Text>
                        <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                            {stat.value}
                        </Text>
                    </Card>
                ))}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Navigation
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.sm }}>
                {NAV_LINKS.map((link) => (
                    <Button
                        key={link.href}
                        variant="secondary"
                        journey="health"
                        onPress={() => router.push(link.href)}
                        accessibilityLabel={link.label}
                    >
                        {link.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default SleepHomePage;
