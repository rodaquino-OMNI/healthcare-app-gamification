import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const STATS = [
    { label: 'Duration', value: '45 min' },
    { label: 'Calories', value: '380 kcal' },
    { label: 'Avg Heart Rate', value: '142 bpm' },
    { label: 'Distance', value: '5.8 km' },
];

const WorkoutDetailPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const handleDelete = () => {
        window.alert('Workout deleted');
        router.push('/health/activity/workout-history');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/activity/workout-history')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to workout history"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Workout Detail
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Review your workout session #{id || '\u2014'}
            </Text>

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ marginBottom: spacing.xl, textAlign: 'center' }}
            >
                <div
                    style={{
                        display: 'inline-block',
                        padding: `${spacing['3xs']} ${spacing.sm}`,
                        borderRadius: '16px',
                        backgroundColor: colors.journeys.health.primary,
                    }}
                >
                    <Text fontSize="sm" fontWeight="semiBold" color={colors.gray[0]}>
                        Running
                    </Text>
                </div>
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.sm }}>
                    Feb 23, 2026 at 07:30 AM
                </Text>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Session Stats
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing.xl }}>
                {STATS.map((stat) => (
                    <Card key={stat.label} journey="health" elevation="sm" padding="md">
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {stat.label}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
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
                Notes
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing['2xl'] }}>
                <Text fontSize="sm" color={colors.gray[60]}>
                    Morning run in the park. Felt great, maintained a steady pace throughout. Weather was clear and
                    cool.
                </Text>
            </Card>

            <Box display="flex" style={{ gap: spacing.sm }}>
                <Box style={{ flex: 1 }}>
                    <Button
                        journey="health"
                        onPress={() => router.push('/health/activity/workout-log')}
                        accessibilityLabel="Log another workout"
                    >
                        Log Another
                    </Button>
                </Box>
                <Box style={{ flex: 1 }}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleDelete}
                        accessibilityLabel="Delete workout"
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default WorkoutDetailPage;
