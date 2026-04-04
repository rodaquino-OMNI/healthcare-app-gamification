import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { useWellness } from '@/hooks/useWellness';

const CATEGORY_COLORS: Record<string, string> = {
    fitness: colors.journeys.health.primary,
    nutrition: colors.semantic.warning,
    sleep: colors.journeys.health.secondary,
    mindfulness: colors.gray[50],
};

const PLACEHOLDER_USER_ID = 'me';

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
    const { t: _t } = useTranslation();
    const router = useRouter();
    const [filter, setFilter] = useState('All');
    const { goals, loadGoals } = useWellness();
    const categories = ['All', 'fitness', 'nutrition', 'sleep', 'mindfulness'];

    useEffect(() => {
        void loadGoals(PLACEHOLDER_USER_ID);
    }, [loadGoals]);

    const filtered = filter === 'All' ? goals : goals.filter((g) => g.category === filter);
    const overallPercent =
        goals.length > 0
            ? Math.round(goals.reduce((sum, g) => sum + Math.round((g.current / g.target) * 100), 0) / goals.length)
            : 0;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/wellness')}
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
                {filtered.map((goal) => {
                    const percent = Math.round((goal.current / goal.target) * 100);
                    const categoryColor = CATEGORY_COLORS[goal.category] ?? colors.gray[50];
                    return (
                        <Card key={goal.id} journey="health" elevation="sm" padding="md">
                            <Box display="flex" alignItems="center" style={{ gap: spacing.md }}>
                                <CircularProgress percent={percent} color={categoryColor} />
                                <Box style={{ flex: 1 }}>
                                    <Text fontWeight="semiBold" fontSize="md">
                                        {goal.title}
                                    </Text>
                                    <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing['3xs'] }}>
                                        <Text fontSize="xs" color={categoryColor}>
                                            {goal.category}
                                        </Text>
                                        <Text fontSize="xs" color={colors.gray[40]}>
                                            {goal.current} / {goal.target} {goal.unit}
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
                                                width: `${Math.min(percent, 100)}%`,
                                                height: 4,
                                                backgroundColor: categoryColor,
                                                borderRadius: 2,
                                            }}
                                        />
                                    </div>
                                </Box>
                            </Box>
                        </Card>
                    );
                })}
                {filtered.length === 0 && (
                    <Text fontSize="sm" color={colors.gray[40]}>
                        No goals yet
                    </Text>
                )}
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
                    onPress={() => void router.push('/wellness/daily-plan')}
                    accessibilityLabel="View daily plan"
                >
                    View Daily Plan
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default GoalsPage;
