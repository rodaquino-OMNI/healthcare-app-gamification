import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

const NUTRIENTS = [
    { label: 'Calories', value: '420 kcal' },
    { label: 'Protein', value: '32g' },
    { label: 'Carbs', value: '48g' },
    { label: 'Fat', value: '11g' },
    { label: 'Fiber', value: '6g' },
    { label: 'Sugar', value: '9g' },
];

const INGREDIENTS = ['Chicken breast (150g)', 'Brown rice (80g)', 'Broccoli (100g)', 'Olive oil (10ml)'];

const MealDetailPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const handleEdit = () => {
        router.push('/health/nutrition/meal-log');
    };

    const handleDelete = () => {
        window.alert(`Meal #${id} deleted`);
        router.push('/health/nutrition/food-diary');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/nutrition/food-diary')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to food diary"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Meal Detail
            </Text>
            <Box
                display="flex"
                alignItems="center"
                style={{ gap: spacing.sm, marginTop: spacing.xs, marginBottom: spacing.xl }}
            >
                <Text fontSize="md" color={colors.gray[50]}>
                    Meal #{id || '—'}
                </Text>
                <div
                    style={{
                        padding: `2px ${spacing.xs}`,
                        borderRadius: '12px',
                        backgroundColor: `${colors.journeys.health.primary}22`,
                    }}
                >
                    <Text fontSize="xs" fontWeight="semiBold" color={colors.journeys.health.primary}>
                        Lunch
                    </Text>
                </div>
            </Box>

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ marginBottom: spacing.xl, textAlign: 'center' }}
            >
                <Text fontSize="sm" color={colors.gray[50]}>
                    Grilled Chicken Bowl
                </Text>
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={colors.journeys.health.primary}
                    style={{ margin: `${spacing.xs} 0` }}
                >
                    420 kcal
                </Text>
                <Text fontSize="sm" color={colors.gray[40]}>
                    Feb 23, 2026 at 12:30 PM
                </Text>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Nutrients
            </Text>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: spacing.sm,
                    marginBottom: spacing.xl,
                }}
            >
                {NUTRIENTS.map((nutrient) => (
                    <Card
                        key={nutrient.label}
                        journey="health"
                        elevation="sm"
                        padding="md"
                        style={{ textAlign: 'center' }}
                    >
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {nutrient.label}
                        </Text>
                        <Text fontSize="md" fontWeight="bold" color={colors.journeys.health.primary}>
                            {nutrient.value}
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
                Ingredients
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing['2xl'] }}>
                {INGREDIENTS.map((item, idx) => (
                    <div key={item}>
                        <Text fontSize="sm" color={colors.gray[60]}>
                            {item}
                        </Text>
                        {idx < INGREDIENTS.length - 1 && (
                            <div style={{ height: 1, backgroundColor: colors.gray[10], margin: `${spacing.xs} 0` }} />
                        )}
                    </div>
                ))}
            </Card>

            <Box display="flex" style={{ gap: spacing.sm }}>
                <Box style={{ flex: 1 }}>
                    <Button journey="health" onPress={handleEdit} accessibilityLabel="Edit meal">
                        Edit Meal
                    </Button>
                </Box>
                <Box style={{ flex: 1 }}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleDelete}
                        accessibilityLabel="Delete meal"
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default MealDetailPage;
