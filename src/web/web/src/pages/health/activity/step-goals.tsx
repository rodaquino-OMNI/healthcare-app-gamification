import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

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
    const [goal, setGoal] = useState('10000');

    const handleUpdate = () => {
        window.alert(`Step goal updated to ${goal} steps`);
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
                    Today's Progress
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
