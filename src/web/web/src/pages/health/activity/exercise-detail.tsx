import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';

import { useActivity } from '@/hooks';

const MUSCLE_GROUPS = ['Quadriceps', 'Hamstrings', 'Calves', 'Glutes', 'Core'];

const ExerciseDetailPage: React.FC = () => {
    const router = useRouter();
    const { data: activityData, loading, error, refetch } = useActivity();

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

    const handleStart = (): void => {
        window.alert('Starting exercise session...');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/activity/exercise-library')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to exercise library"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Exercise Detail
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Learn proper form and technique
            </Text>

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ marginBottom: spacing.xl, textAlign: 'center' }}
            >
                <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                    Running
                </Text>
                <div
                    style={{
                        display: 'inline-block',
                        marginTop: spacing.sm,
                        padding: `${spacing['3xs']} ${spacing.sm}`,
                        borderRadius: '16px',
                        backgroundColor: colors.semantic.success,
                    }}
                >
                    <Text fontSize="xs" fontWeight="semiBold" color={colors.gray[0]}>
                        Beginner
                    </Text>
                </div>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Description
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <Text fontSize="sm" color={colors.gray[60]}>
                    Running is a fundamental cardiovascular exercise that improves heart health, builds endurance, and
                    burns calories efficiently. Start with a comfortable pace and gradually increase distance and speed
                    over time.
                </Text>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Muscle Groups
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <Box display="flex" style={{ flexWrap: 'wrap', gap: spacing.xs }}>
                    {MUSCLE_GROUPS.map((muscle) => (
                        <div
                            key={muscle}
                            style={{
                                padding: `${spacing['3xs']} ${spacing.sm}`,
                                borderRadius: '16px',
                                backgroundColor: colors.gray[10],
                            }}
                        >
                            <Text fontSize="sm" color={colors.journeys.health.text}>
                                {muscle}
                            </Text>
                        </div>
                    ))}
                </Box>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Video Guide
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing['2xl'] }}>
                <div
                    style={{
                        width: '100%',
                        height: 200,
                        borderRadius: '8px',
                        backgroundColor: colors.gray[10],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text fontSize="lg" color={colors.gray[40]}>
                        Play Video
                    </Text>
                </div>
            </Card>

            <Button journey="health" onPress={handleStart} accessibilityLabel="Start exercise">
                Start Exercise
            </Button>
        </div>
    );
};

export default ExerciseDetailPage;
