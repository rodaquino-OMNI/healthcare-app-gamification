import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface PlanTask {
    id: string;
    title: string;
    category: 'Exercise' | 'Nutrition' | 'Mindfulness' | 'Sleep';
    time: string;
    completed: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
    Exercise: colors.journeys.health.primary,
    Nutrition: colors.semantic.warning,
    Mindfulness: colors.journeys.health.secondary,
    Sleep: colors.gray[50],
};

const INITIAL_TASKS: PlanTask[] = [
    { id: '1', title: 'Morning stretching (10 min)', category: 'Exercise', time: '7:00 AM', completed: true },
    { id: '2', title: 'Drink 500ml water', category: 'Nutrition', time: '7:30 AM', completed: true },
    { id: '3', title: '5-minute breathing exercise', category: 'Mindfulness', time: '8:00 AM', completed: true },
    { id: '4', title: 'Healthy breakfast with protein', category: 'Nutrition', time: '8:30 AM', completed: false },
    { id: '5', title: '30-minute walk or jog', category: 'Exercise', time: '12:00 PM', completed: false },
    { id: '6', title: 'Balanced lunch', category: 'Nutrition', time: '1:00 PM', completed: false },
    { id: '7', title: 'Afternoon meditation (10 min)', category: 'Mindfulness', time: '3:00 PM', completed: false },
    { id: '8', title: 'Evening yoga (15 min)', category: 'Exercise', time: '7:00 PM', completed: false },
    { id: '9', title: 'No screens 30 min before bed', category: 'Sleep', time: '10:00 PM', completed: false },
    { id: '10', title: 'Sleep by 10:30 PM', category: 'Sleep', time: '10:30 PM', completed: false },
];

const DailyPlanPage: React.FC = () => {
    const router = useRouter();
    const [tasks, setTasks] = useState<PlanTask[]>(INITIAL_TASKS);

    const completedCount = tasks.filter((t) => t.completed).length;
    const allDone = completedCount === tasks.length;
    const progressPercent = Math.round((completedCount / tasks.length) * 100);

    const toggleTask = (id: string): void => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    };

    const categories = ['Exercise', 'Nutrition', 'Mindfulness', 'Sleep'];
    const categoryCounts = categories.map((cat) => ({
        category: cat,
        completed: tasks.filter((t) => t.category === cat && t.completed).length,
        total: tasks.filter((t) => t.category === cat).length,
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
                {allDone ? 'All tasks completed!' : `${completedCount} of ${tasks.length} complete`}
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
                {tasks.map((task) => (
                    <Card key={task.id} journey="health" elevation="sm" padding="md">
                        <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                aria-label={`Mark ${task.title} ${task.completed ? 'incomplete' : 'complete'}`}
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
                                    color={task.completed ? colors.gray[40] : colors.gray[70]}
                                    style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                                >
                                    {task.title}
                                </Text>
                                <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing['3xs'] }}>
                                    <Text fontSize="xs" color={CATEGORY_COLORS[task.category]}>
                                        {task.category}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        {task.time}
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                ))}
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

export default DailyPlanPage;
