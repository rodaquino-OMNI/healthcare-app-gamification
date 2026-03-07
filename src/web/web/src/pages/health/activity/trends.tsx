import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

type Period = '7d' | '30d';

const WEEKLY_STEPS = [8432, 10210, 7650, 9100, 6300, 11500, 8900];
const WEEKLY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MAX_STEPS = 12000;

const STATS = [
    { label: 'Avg Steps', value: '8,870' },
    { label: 'Avg Calories', value: '495' },
    { label: 'Best Day', value: '11,500' },
    { label: 'Active Days', value: '6 / 7' },
];

const ActivityTrendsPage: React.FC = () => {
    const router = useRouter();
    const [period, setPeriod] = useState<Period>('7d');

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
                Activity Trends
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Track your activity patterns over time
            </Text>

            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
                <Button
                    variant={period === '7d' ? 'primary' : 'secondary'}
                    journey="health"
                    onPress={() => setPeriod('7d')}
                    accessibilityLabel="7 days"
                >
                    7 Days
                </Button>
                <Button
                    variant={period === '30d' ? 'primary' : 'secondary'}
                    journey="health"
                    onPress={() => setPeriod('30d')}
                    accessibilityLabel="30 days"
                >
                    30 Days
                </Button>
            </Box>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Daily Steps
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: spacing.sm, height: 120 }}>
                    {WEEKLY_STEPS.map((steps, i) => (
                        <div
                            key={i}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                            <Text fontSize="xs" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                                {(steps / 1000).toFixed(1)}k
                            </Text>
                            <div
                                style={{
                                    width: '100%',
                                    height: `${(steps / MAX_STEPS) * 100}%`,
                                    backgroundColor: colors.journeys.health.primary,
                                    borderRadius: '4px 4px 0 0',
                                    minHeight: 8,
                                }}
                            />
                            <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                                {WEEKLY_LABELS[i]}
                            </Text>
                        </div>
                    ))}
                </div>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Key Statistics
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing.xl }}>
                {STATS.map((s) => (
                    <Card key={s.label} journey="health" elevation="sm" padding="md">
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {s.label}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                            {s.value}
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
                Monthly Comparison
            </Text>
            <Card journey="health" elevation="sm" padding="md">
                <Box display="flex" justifyContent="space-between" style={{ marginBottom: spacing.sm }}>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        This Month
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.primary}>
                        248,600 steps
                    </Text>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Last Month
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold" color={colors.gray[60]}>
                        231,400 steps
                    </Text>
                </Box>
                <div style={{ height: 1, backgroundColor: colors.gray[10], margin: `${spacing.sm} 0` }} />
                <Box display="flex" justifyContent="space-between">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Change
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold" color={colors.semantic.success}>
                        +7.4%
                    </Text>
                </Box>
            </Card>
        </div>
    );
};

export default ActivityTrendsPage;
