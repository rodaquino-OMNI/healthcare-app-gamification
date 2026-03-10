import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useActivity } from '@/hooks';

const CURRENT_STEPS = 8432;
const GOAL_STEPS = 10000;
const PROGRESS_PCT = Math.round((CURRENT_STEPS / GOAL_STEPS) * 100);

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.xs,
    border: `1px solid ${colors.gray[20]}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: colors.gray[60],
};

const StepGoalsPage: React.FC = () => {
    const router = useRouter();
    const { data: activityData, loading, error, refetch } = useActivity();
    const [goal, setGoal] = useState('10000');

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

    void activityData;

    const handleUpdate = (): void => {
        window.alert(`Step goal updated to ${goal} steps`);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/activity')}
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
                Step Goals
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Set and track your daily step targets
            </Text>

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ marginBottom: spacing.xl, textAlign: 'center' }}
            >
                <Text fontSize="sm" color={colors.gray[50]}>
                    Today&apos;s Progress
                </Text>
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={colors.journeys.health.primary}
                    style={{ margin: `${spacing.xs} 0` }}
                >
                    {CURRENT_STEPS.toLocaleString()} / {GOAL_STEPS.toLocaleString()}
                </Text>
                <div
                    style={{
                        width: '100%',
                        height: 12,
                        borderRadius: '6px',
                        backgroundColor: colors.gray[10],
                        overflow: 'hidden',
                        marginTop: spacing.sm,
                    }}
                >
                    <div
                        style={{
                            width: `${PROGRESS_PCT}%`,
                            height: '100%',
                            borderRadius: '6px',
                            backgroundColor: colors.journeys.health.primary,
                        }}
                    />
                </div>
                <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing.xs }}>
                    {PROGRESS_PCT}% complete
                </Text>
            </Card>

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ marginBottom: spacing.xl, textAlign: 'center' }}
            >
                <Text fontSize="sm" color={colors.gray[50]}>
                    Current Streak
                </Text>
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={colors.journeys.health.primary}
                    style={{ margin: `${spacing.xs} 0` }}
                >
                    7 days
                </Text>
                <Text fontSize="xs" color={colors.semantic.success}>
                    Goal met every day this week
                </Text>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Update Goal
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing['2xl'] }}>
                <Box display="flex" alignItems="center" style={{ gap: spacing.md }}>
                    <Box style={{ flex: 1 }}>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                            Daily Step Target
                        </Text>
                        <input
                            type="number"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            aria-label="Daily step target"
                            style={inputStyle}
                        />
                    </Box>
                    <Text fontSize="sm" color={colors.gray[40]}>
                        steps/day
                    </Text>
                </Box>
            </Card>

            <Button journey="health" onPress={handleUpdate} accessibilityLabel="Update step goal">
                Update Goal
            </Button>
        </div>
    );
};

export default StepGoalsPage;
