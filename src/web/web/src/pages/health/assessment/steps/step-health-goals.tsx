import React from 'react';
import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const MAX_PRIORITIES = 3;

const GOALS = [
    { key: 'weightLoss', label: 'Weight Loss', emoji: '\u2696\uFE0F' },
    { key: 'fitness', label: 'Fitness', emoji: '\uD83C\uDFCB\uFE0F' },
    { key: 'sleepImprovement', label: 'Sleep Improvement', emoji: '\uD83D\uDCA4' },
    { key: 'stressManagement', label: 'Stress Management', emoji: '\uD83E\uDDD8' },
    { key: 'nutrition', label: 'Nutrition', emoji: '\uD83E\uDD57' },
    { key: 'diseasePrevention', label: 'Disease Prevention', emoji: '\uD83D\uDEE1\uFE0F' },
    { key: 'mentalHealth', label: 'Mental Health', emoji: '\uD83E\uDDE0' },
    { key: 'energy', label: 'More Energy', emoji: '\u26A1' },
    { key: 'flexibility', label: 'Flexibility', emoji: '\uD83E\uDD38' },
];

const chipStyle = (selected: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: 20,
    border: `1px solid ${selected ? colors.journeys.health.primary : colors.neutral.gray300}`,
    backgroundColor: selected ? colors.journeys.health.background : colors.neutral.white,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: selected ? 600 : 400,
    color: selected ? colors.journeys.health.accent : colors.neutral.gray900,
});

const StepHealthGoalsPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    const selectedGoals: string[] = data.healthGoals || [];
    const priorities: string[] = data.goalPriorities || [];

    const toggleGoal = (key: string) => {
        const updated = selectedGoals.includes(key) ? selectedGoals.filter((g) => g !== key) : [...selectedGoals, key];
        onUpdate('healthGoals', updated);
        if (selectedGoals.includes(key)) {
            onUpdate(
                'goalPriorities',
                priorities.filter((p) => p !== key)
            );
        }
    };

    const togglePriority = (key: string) => {
        if (!selectedGoals.includes(key)) return;
        if (priorities.includes(key)) {
            onUpdate(
                'goalPriorities',
                priorities.filter((p) => p !== key)
            );
        } else if (priorities.length < MAX_PRIORITIES) {
            onUpdate('goalPriorities', [...priorities, key]);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Health Goals
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Select the health goals most important to you.
            </Text>

            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Choose your goals
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                    {GOALS.map(({ key, label, emoji }) => {
                        const selected = selectedGoals.includes(key);
                        return (
                            <button
                                key={key}
                                onClick={() => toggleGoal(key)}
                                style={chipStyle(selected)}
                                aria-pressed={selected}
                                aria-label={`${label} ${selected ? 'selected' : 'not selected'}`}
                            >
                                <span>{emoji}</span>
                                {selected ? '\u2713 ' : ''}
                                {label}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {selectedGoals.length > 0 && (
                <Card journey="health" elevation="sm" padding="lg">
                    <Text
                        fontSize="sm"
                        fontWeight="semiBold"
                        color={colors.journeys.health.text}
                        style={{ marginBottom: spacing.sm }}
                    >
                        Top {MAX_PRIORITIES} Priorities (click to prioritize)
                    </Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                        {selectedGoals.map((key) => {
                            const isPriority = priorities.includes(key);
                            const rank = priorities.indexOf(key) + 1;
                            const goal = GOALS.find((g) => g.key === key);
                            return (
                                <button
                                    key={key}
                                    onClick={() => togglePriority(key)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: spacing.xs,
                                        padding: `${spacing.xs} ${spacing.sm}`,
                                        borderRadius: 20,
                                        border: `1px solid ${isPriority ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                        backgroundColor: isPriority
                                            ? colors.journeys.health.primary
                                            : colors.neutral.white,
                                        color: isPriority ? colors.neutral.white : colors.neutral.gray900,
                                        cursor: 'pointer',
                                        fontSize: 13,
                                        fontWeight: isPriority ? 600 : 400,
                                    }}
                                    aria-pressed={isPriority}
                                    aria-label={`${goal?.label} priority ${isPriority ? rank : 'not set'}`}
                                >
                                    {isPriority && <span style={{ fontWeight: 700 }}>#{rank}</span>}
                                    {goal?.label}
                                </button>
                            );
                        })}
                    </div>
                </Card>
            )}

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ borderLeft: `3px solid ${colors.journeys.health.primary}` }}
            >
                <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
                    Tip
                </Text>
                <Text fontSize="xs" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                    Focusing on fewer goals increases your chances of success. We recommend choosing up to 3 priorities.
                </Text>
            </Card>
        </div>
    );
};

export default StepHealthGoalsPage;
