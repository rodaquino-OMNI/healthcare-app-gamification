import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const MOCK_MACROS = [
    { label: 'Calories', value: '320 kcal' },
    { label: 'Protein', value: '18g' },
    { label: 'Carbs', value: '42g' },
    { label: 'Fat', value: '8g' },
];

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.xs,
    border: `1px solid ${colors.gray[20]}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: colors.gray[60],
};

const MealLogPage: React.FC = () => {
    const router = useRouter();
    const [foodName, setFoodName] = useState('');
    const [portion, setPortion] = useState('');
    const [mealType, setMealType] = useState('Breakfast');

    const handleSave = () => {
        window.alert(`Meal logged: ${foodName}, ${portion}, ${mealType}`);
    };

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
                Log Meal
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Record what you ate and track your nutrition
            </Text>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                    Food Name
                </Text>
                <input
                    type="text"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g. Grilled chicken breast"
                    aria-label="Food name"
                    style={{ ...inputStyle, marginBottom: spacing.md }}
                />
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                    Portion Size
                </Text>
                <input
                    type="text"
                    value={portion}
                    onChange={(e) => setPortion(e.target.value)}
                    placeholder="e.g. 150g or 1 cup"
                    aria-label="Portion size"
                    style={inputStyle}
                />
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Meal Type
            </Text>
            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
                {MEAL_TYPES.map((type) => (
                    <Button
                        key={type}
                        variant={mealType === type ? 'primary' : 'secondary'}
                        journey="health"
                        onPress={() => setMealType(type)}
                        accessibilityLabel={type}
                    >
                        {type}
                    </Button>
                ))}
            </Box>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Estimated Nutrition
            </Text>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: spacing.sm,
                    marginBottom: spacing['2xl'],
                }}
            >
                {MOCK_MACROS.map((macro) => (
                    <Card key={macro.label} journey="health" elevation="sm" padding="md">
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {macro.label}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                            {macro.value}
                        </Text>
                    </Card>
                ))}
            </div>

            <Button journey="health" onPress={handleSave} accessibilityLabel="Save meal log">
                Save Meal
            </Button>
        </div>
    );
};

export default MealLogPage;
