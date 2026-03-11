import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';

import { useCycle } from '@/hooks';

const PHASE_INFO = {
    luteal: {
        label: 'Luteal Phase',
        description: 'Your body is preparing for the next cycle. You may experience PMS symptoms.',
        color: colors.journeys.health.secondary,
        dayRange: '15-28',
    },
};

const PREDICTIONS = [
    { label: 'Next Period', value: 'In 6 days', icon: 'calendar' },
    { label: 'Fertile Window', value: 'Ended 9 days ago', icon: 'heart' },
    { label: 'PMS Window', value: 'Starting in 2 days', icon: 'alert' },
];

const TodayPage: React.FC = () => {
    const router = useRouter();
    const { data: cycleData, loading, error, refetch } = useCycle();

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

    void cycleData;

    const cycleDay = 22;
    const phase = PHASE_INFO.luteal;

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
                Today
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Your daily cycle summary
            </Text>

            <Card journey="health" elevation="sm" padding="lg">
                <Box display="flex" alignItems="center" style={{ gap: spacing.md }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            backgroundColor: `${phase.color}20`,
                            border: `3px solid ${phase.color}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text fontSize="xl" fontWeight="bold" color={phase.color}>
                            {cycleDay}
                        </Text>
                    </div>
                    <Box>
                        <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text}>
                            Day {cycleDay} of 28
                        </Text>
                        <Text fontSize="md" color={phase.color} fontWeight="medium">
                            {phase.label}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                            Days {phase.dayRange}
                        </Text>
                    </Box>
                </Box>
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.md }}>
                    {phase.description}
                </Text>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing['2xl'], marginBottom: spacing.sm }}
            >
                Predictions
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {PREDICTIONS.map((item) => (
                    <Card key={item.label} journey="health" elevation="sm" padding="md">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {item.label}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.primary}>
                                {item.value}
                            </Text>
                        </Box>
                    </Card>
                ))}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing['2xl'], marginBottom: spacing.sm }}
            >
                Quick Actions
            </Text>
            <div style={{ display: 'flex', gap: spacing.sm }}>
                <Button
                    journey="health"
                    onPress={() => void router.push('/health/cycle/log-period')}
                    accessibilityLabel="Log period"
                >
                    Log Period
                </Button>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => void router.push('/health/cycle/log-symptoms')}
                    accessibilityLabel="Log symptoms"
                >
                    Log Symptoms
                </Button>
            </div>
        </div>
    );
};

export default TodayPage;
