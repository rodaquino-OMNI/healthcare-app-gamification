import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

type FilterPeriod = 'week' | 'month' | 'all';

const DIARY_ENTRIES = [
    {
        date: 'Feb 23, 2026',
        meals: [
            { id: '5', name: 'Oatmeal with Berries', calories: 310, type: 'Breakfast' },
            { id: '6', name: 'Grilled Chicken Bowl', calories: 420, type: 'Lunch' },
        ],
    },
    {
        date: 'Feb 22, 2026',
        meals: [
            { id: '3', name: 'Scrambled Eggs', calories: 280, type: 'Breakfast' },
            { id: '4', name: 'Caesar Salad', calories: 350, type: 'Lunch' },
            { id: '4b', name: 'Salmon Fillet', calories: 480, type: 'Dinner' },
        ],
    },
    {
        date: 'Feb 21, 2026',
        meals: [
            { id: '1', name: 'Greek Yogurt Parfait', calories: 260, type: 'Breakfast' },
            { id: '2', name: 'Turkey Sandwich', calories: 390, type: 'Lunch' },
        ],
    },
];

const FILTERS: FilterPeriod[] = ['week', 'month', 'all'];

const typeColor = (type: string): string => {
    if (type === 'Breakfast') return colors.semantic.warning;
    if (type === 'Lunch') return colors.journeys.health.primary;
    if (type === 'Dinner') return colors.journeys.health.secondary;
    return colors.gray[40];
};

const FoodDiaryPage: React.FC = () => {
    const router = useRouter();
    const [filter, setFilter] = useState<FilterPeriod>('week');

    const entries = filter === 'all' ? DIARY_ENTRIES : DIARY_ENTRIES.slice(0, filter === 'week' ? 3 : 3);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/nutrition')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to nutrition home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Food Diary
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Your daily meal records
            </Text>

            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
                {FILTERS.map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? 'primary' : 'secondary'}
                        journey="health"
                        onPress={() => setFilter(f)}
                        accessibilityLabel={`Filter by ${f}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </Button>
                ))}
            </Box>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                {entries.map((entry) => (
                    <div key={entry.date}>
                        <Text
                            fontSize="sm"
                            fontWeight="semiBold"
                            color={colors.gray[50]}
                            style={{ marginBottom: spacing.xs }}
                        >
                            {entry.date}
                        </Text>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                            {entry.meals.map((meal) => (
                                <div
                                    key={meal.id}
                                    onClick={() => router.push(`/health/nutrition/${meal.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Card journey="health" elevation="sm" padding="md">
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Text fontWeight="semiBold" fontSize="md">
                                                    {meal.name}
                                                </Text>
                                                <div
                                                    style={{
                                                        marginTop: 2,
                                                        padding: `2px ${spacing.xs}`,
                                                        borderRadius: '10px',
                                                        backgroundColor: `${typeColor(meal.type)}22`,
                                                        display: 'inline-block',
                                                    }}
                                                >
                                                    <Text fontSize="xs" color={typeColor(meal.type)}>
                                                        {meal.type}
                                                    </Text>
                                                </div>
                                            </Box>
                                            <Text
                                                fontSize="md"
                                                fontWeight="bold"
                                                color={colors.journeys.health.primary}
                                            >
                                                {meal.calories} kcal
                                            </Text>
                                        </Box>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodDiaryPage;
