import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useSleep } from '@/hooks';

type Period = '7d' | '30d';

const WEEKLY_HOURS = [7.5, 6.2, 8.0, 7.1, 5.5, 7.8, 7.4];
const WEEKLY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MAX_HOURS = 10;

const STATS = [
    { label: 'Avg Sleep', value: '7.1h' },
    { label: 'Avg Score', value: '82' },
    { label: 'Best Night', value: '8.0h' },
    { label: 'Worst Night', value: '5.5h' },
];

const STAGES = [
    { label: 'Deep Sleep', pct: 20, color: colors.journeys.health.accent },
    { label: 'Light Sleep', pct: 45, color: colors.journeys.health.primary },
    { label: 'REM', pct: 25, color: colors.journeys.health.secondary },
    { label: 'Awake', pct: 10, color: colors.semantic.warning },
];

const SleepTrendsPage: React.FC = () => {
    const { data: sleepData, loading, error, refetch } = useSleep();
    const router = useRouter();
    const [period, setPeriod] = useState<Period>('7d');

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>Loading...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    Error loading data. <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void sleepData;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/sleep')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to sleep home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Sleep Trends
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Analyze your sleep patterns over time
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
                Hours Slept
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: spacing.sm, height: 120 }}>
                    {WEEKLY_HOURS.map((hrs, i) => (
                        <div
                            key={i}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                            <Text fontSize="xs" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                                {hrs}
                            </Text>
                            <div
                                style={{
                                    width: '100%',
                                    height: `${(hrs / MAX_HOURS) * 100}%`,
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
                Sleep Stage Distribution
            </Text>
            <Card journey="health" elevation="sm" padding="md">
                <div
                    style={{
                        display: 'flex',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        height: 24,
                        marginBottom: spacing.sm,
                    }}
                >
                    {STAGES.map((stage) => (
                        <div key={stage.label} style={{ width: `${stage.pct}%`, backgroundColor: stage.color }} />
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.xs }}>
                    {STAGES.map((stage) => (
                        <Box key={stage.label} display="flex" alignItems="center" style={{ gap: spacing.xs }}>
                            <div
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '2px',
                                    backgroundColor: stage.color,
                                    flexShrink: 0,
                                }}
                            />
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {stage.label} ({stage.pct}%)
                            </Text>
                        </Box>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default SleepTrendsPage;
