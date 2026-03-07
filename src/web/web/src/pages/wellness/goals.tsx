import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

interface Goal {
    id: string;
    title: string;
    category: 'Fitness' | 'Nutrition' | 'Sleep' | 'Mindfulness';
    percent: number;
    target: string;
    current: string;
}

const CATEGORY_COLORS: Record<string, string> = {
    Fitness: colors.journeys.health.primary,
    Nutrition: colors.semantic.warning,
    Sleep: colors.journeys.health.secondary,
    Mindfulness: colors.gray[50],
};

const GOALS: Goal[] = [
    {
        id: '1',
        title: 'Walk 10,000 steps daily',
        category: 'Fitness',
        percent: 72,
        target: '10,000 steps',
        current: '7,200 steps',
    },
    {
        id: '2',
        title: 'Drink 2L water daily',
        category: 'Nutrition',
        percent: 85,
        target: '2,000 ml',
        current: '1,700 ml',
    },
    {
        id: '3',
        title: 'Sleep 8 hours nightly',
        category: 'Sleep',
        percent: 90,
        target: '8 hours',
        current: '7.2 hours avg',
    },
    {
        id: '4',
        title: 'Meditate 15 min daily',
        category: 'Mindfulness',
        percent: 60,
        target: '15 min',
        current: '9 min avg',
    },
    {
        id: '5',
        title: 'Exercise 3x per week',
        category: 'Fitness',
        percent: 100,
        target: '3 sessions',
        current: '3 sessions',
    },
    {
        id: '6',
        title: 'Eat 5 servings of vegetables',
        category: 'Nutrition',
        percent: 40,
        target: '5 servings',
        current: '2 servings avg',
    },
];

const CircularProgress: React.FC<{ percent: number; color: string; size?: number }> = ({
    percent,
    color,
    size = 64,
}) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={colors.gray[10]} strokeWidth={6} />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={6}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
            />
        </svg>
    );
};

const GoalsPage: React.FC = () => {
    const router = useRouter();
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Fitness', 'Nutrition', 'Sleep', 'Mindfulness'];

    const filtered = filter === 'All' ? GOALS : GOALS.filter((g) => g.category === filter);
    const overallPercent = Math.round(GOALS.reduce((sum, g) => sum + g.percent, 0) / GOALS.length);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/wellness')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to wellness home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Wellness Goals
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Track your progress toward wellness targets
            </Text>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                <Box display="flex" alignItems="center" style={{ gap: spacing.md }}>
                    <CircularProgress percent={overallPercent} color={colors.journeys.health.primary} size={80} />
                    <Box>
                        <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.primary}>
                            {overallPercent}%
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Overall Progress
                        </Text>
                    </Box>
                </Box>
            </Card>

            <Box
                display="flex"
                style={{ gap: spacing.xs, marginBottom: spacing.lg, overflowX: 'auto', paddingBottom: spacing.xs }}
                role="tablist"
                aria-label="Goal categories"
            >
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        role="tab"
                        aria-selected={filter === cat}
                        style={{
                            padding: `${spacing.xs} ${spacing.md}`,
                            borderRadius: '20px',
                            border: `1px solid ${filter === cat ? colors.journeys.health.primary : colors.gray[20]}`,
                            backgroundColor: filter === cat ? colors.journeys.health.background : colors.gray[0],
                            color: filter === cat ? colors.journeys.health.primary : colors.gray[60],
                            fontWeight: filter === cat ? 600 : 400,
                            fontSize: '14px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </Box>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                {filtered.map((goal) => (
                    <Card key={goal.id} journey="health" elevation="sm" padding="md">
                        <Box display="flex" alignItems="center" style={{ gap: spacing.md }}>
                            <CircularProgress percent={goal.percent} color={CATEGORY_COLORS[goal.category]} />
                            <Box style={{ flex: 1 }}>
                                <Text fontWeight="semiBold" fontSize="md">
                                    {goal.title}
                                </Text>
                                <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing['3xs'] }}>
                                    <Text fontSize="xs" color={CATEGORY_COLORS[goal.category]}>
                                        {goal.category}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        {goal.current} / {goal.target}
                                    </Text>
                                </Box>
                                <div
                                    style={{
                                        width: '100%',
                                        height: 4,
                                        backgroundColor: colors.gray[10],
                                        borderRadius: 2,
                                        marginTop: spacing.xs,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${goal.percent}%`,
                                            height: 4,
                                            backgroundColor: CATEGORY_COLORS[goal.category],
                                            borderRadius: 2,
                                        }}
                                    />
                                </div>
                            </Box>
                        </Box>
                    </Card>
                ))}
            </div>

            <Box display="flex" justifyContent="center" style={{ gap: spacing.sm }}>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={() => window.alert('Add goal dialog')}
                    accessibilityLabel="Add goal"
                >
                    Add Goal
                </Button>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => router.push('/wellness/daily-plan')}
                    accessibilityLabel="View daily plan"
                >
                    View Daily Plan
                </Button>
            </Box>
        </div>
    );
};

export default GoalsPage;
