import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const QUICK_STATS = [
    { label: 'Daily Steps', value: '8,432' },
    { label: 'Calories Burned', value: '524' },
    { label: 'Active Minutes', value: '47 min' },
    { label: 'Distance', value: '5.2 km' },
];

const NAV_LINKS = [
    { label: 'Workout Log', href: '/health/activity/workout-log' },
    { label: 'Workout History', href: '/health/activity/workout-history' },
    { label: 'Step Goals', href: '/health/activity/step-goals' },
    { label: 'Trends', href: '/health/activity/trends' },
    { label: 'Exercise Library', href: '/health/activity/exercise-library' },
    { label: 'Device Sync', href: '/health/activity/device-sync' },
    { label: 'Export', href: '/health/activity/export' },
];

const ActivityHomePage: React.FC = () => {
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
                Activity Tracker
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Monitor your daily activity and fitness progress
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

export default ActivityHomePage;
