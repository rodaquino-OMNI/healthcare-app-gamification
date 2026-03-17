import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState, useEffect } from 'react';

import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { useWellness } from '@/hooks/useWellness';

const CATEGORY_COLORS: Record<string, string> = {
    exercise: colors.journeys.health.primary,
    nutrition: colors.semantic.warning,
    meditation: colors.journeys.health.secondary,
    journal: colors.journeys.health.secondary,
    sleep: colors.gray[50],
    social: colors.gray[50],
    breathing: colors.journeys.health.primary,
};

const PLACEHOLDER_USER_ID = 'me';

const DailyPlanPage: React.FC = () => {
    const router = useRouter();
    const { dailyPlan, loadDailyPlan } = useWellness();
    const [localCompleted, setLocalCompleted] = useState<Record<string, boolean>>({});

    useEffect(() => {
        void loadDailyPlan(PLACEHOLDER_USER_ID);
    }, [loadDailyPlan]);

    const activities = dailyPlan?.activities ?? [];
    const completedCount = activities.filter((a) => localCompleted[a.id] ?? a.completed).length;
    const allDone = activities.length > 0 && completedCount === activities.length;
    const progressPercent = activities.length > 0 ? Math.round((completedCount / activities.length) * 100) : 0;

    const toggleTask = (id: string): void => {
        setLocalCompleted((prev) => ({ ...prev, [id]: !(prev[id] ?? activities.find((a) => a.id === id)?.completed) }));
    };

    const categories = ['exercise', 'nutrition', 'meditation', 'sleep'];
    const categoryCounts = categories.map((cat) => ({
        category: cat,
        completed: activities.filter((a) => a.type === cat && (localCompleted[a.id] ?? a.completed)).length,
        total: activities.filter((a) => a.type === cat).length,
    }));

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
                Daily Wellness Plan
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                {allDone ? 'All tasks completed!' : `${completedCount} of ${activities.length} complete`}
            </Text>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ marginBottom: spacing.sm }}
                >
                    <Text fontWeight="semiBold" fontSize="md">
                        Today&apos;s Progress
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" color={colors.journeys.health.primary}>
                        {progressPercent}%
                    </Text>
                </Box>
                <div style={{ width: '100%', height: 8, backgroundColor: colors.gray[10], borderRadius: 4 }}>
                    <div
                        style={{
                            width: `${progressPercent}%`,
                            height: 8,
                            backgroundColor: colors.journeys.health.primary,
                            borderRadius: 4,
                            transition: 'width 0.3s ease',
                        }}
                    />
                </div>
            </Card>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    gap: spacing.xs,
                    marginBottom: spacing.lg,
                }}
            >
                {categoryCounts.map((cc) => (
                    <Card key={cc.category} journey="health" elevation="sm" padding="sm">
                        <Text fontSize="xs" color={CATEGORY_COLORS[cc.category]} fontWeight="semiBold">
                            {cc.category}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={colors.journeys.health.text}>
                            {cc.completed}/{cc.total}
                        </Text>
                    </Card>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                {activities.map((task) => {
                    const isCompleted = localCompleted[task.id] ?? task.completed;
                    return (
                        <Card key={task.id} journey="health" elevation="sm" padding="md">
                            <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                                <input
                                    type="checkbox"
                                    checked={isCompleted}
                                    onChange={() => toggleTask(task.id)}
                                    aria-label={`Mark ${task.title} ${isCompleted ? 'incomplete' : 'complete'}`}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        cursor: 'pointer',
                                        accentColor: colors.journeys.health.primary,
                                    }}
                                />
                                <Box style={{ flex: 1 }}>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color={isCompleted ? colors.gray[40] : colors.gray[70]}
                                        style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}
                                    >
                                        {task.title}
                                    </Text>
                                    <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing['3xs'] }}>
                                        <Text fontSize="xs" color={CATEGORY_COLORS[task.type] ?? colors.gray[50]}>
                                            {task.type}
                                        </Text>
                                        {task.scheduledTime && (
                                            <Text fontSize="xs" color={colors.gray[40]}>
                                                {task.scheduledTime}
                                            </Text>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    );
                })}
                {activities.length === 0 && (
                    <Text fontSize="sm" color={colors.gray[40]}>
                        No activities for today
                    </Text>
                )}
            </div>

            <Box display="flex" justifyContent="center">
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => void router.push('/wellness/goals')}
                    accessibilityLabel="View goals"
                >
                    View Goals
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default DailyPlanPage;
