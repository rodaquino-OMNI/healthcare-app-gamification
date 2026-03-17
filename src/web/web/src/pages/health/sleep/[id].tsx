import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import type { GetStaticPaths } from 'next';
import React from 'react';

import { useSleep } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

const STAGES = [
    { label: 'Deep Sleep', hours: '1h 32m', pct: 20, color: colors.journeys.health.accent },
    { label: 'Light Sleep', hours: '3h 24m', pct: 45, color: colors.journeys.health.primary },
    { label: 'REM', hours: '1h 53m', pct: 25, color: colors.journeys.health.secondary },
    { label: 'Awake', hours: '0h 45m', pct: 10, color: colors.semantic.warning },
];

const ENVIRONMENT = [
    { label: 'Temperature', value: '21\u00b0C' },
    { label: 'Humidity', value: '45%' },
    { label: 'Noise Level', value: 'Low' },
];

const SleepDetailPage: React.FC = () => {
    const { data: sleepData, loading, error, refetch } = useSleep();
    const router = useRouter();
    const { id } = router.query;

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
                onClick={() => void router.push('/health/sleep/diary')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to sleep diary"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Sleep Detail
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Session #{id || '—'}
            </Text>

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ marginBottom: spacing.xl, textAlign: 'center' }}
            >
                <Text fontSize="sm" color={colors.gray[50]}>
                    Sleep Score
                </Text>
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={colors.journeys.health.primary}
                    style={{ margin: `${spacing.xs} 0` }}
                >
                    85
                </Text>
                <Text fontSize="sm" fontWeight="semiBold" color={colors.semantic.success}>
                    Good
                </Text>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing.xl }}>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="xs" color={colors.gray[50]}>
                        Time in Bed
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                        8h 00m
                    </Text>
                    <Text fontSize="xs" color={colors.gray[40]}>
                        23:00 - 07:00
                    </Text>
                </Card>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="xs" color={colors.gray[50]}>
                        Time Asleep
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                        7h 34m
                    </Text>
                    <Text fontSize="xs" color={colors.gray[40]}>
                        94% efficiency
                    </Text>
                </Card>
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Sleep Stages
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {STAGES.map((stage) => (
                        <Box key={stage.label} display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center" style={{ gap: spacing.xs }}>
                                <div
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '2px',
                                        backgroundColor: stage.color,
                                        flexShrink: 0,
                                    }}
                                />
                                <Text fontSize="sm" color={colors.gray[60]}>
                                    {stage.label}
                                </Text>
                            </Box>
                            <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                                <Text fontSize="sm" fontWeight="semiBold">
                                    {stage.hours}
                                </Text>
                                <Text fontSize="xs" color={colors.gray[40]}>
                                    {stage.pct}%
                                </Text>
                            </Box>
                        </Box>
                    ))}
                </div>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Environment
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.sm }}>
                {ENVIRONMENT.map((env) => (
                    <Card key={env.label} journey="health" elevation="sm" padding="md" style={{ textAlign: 'center' }}>
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {env.label}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                            {env.value}
                        </Text>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = () => ({
    paths: [],
    fallback: 'blocking' as const,
});

export const getStaticProps = () => ({ props: {} });

export default SleepDetailPage;
