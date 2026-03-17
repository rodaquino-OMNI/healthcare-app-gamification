import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const DIET_TYPES = [
    'No specific diet',
    'Vegetarian',
    'Vegan',
    'Pescatarian',
    'Mediterranean',
    'Low-carb / Keto',
    'Gluten-free',
    'Lactose-free',
    'Paleo',
    'Intermittent fasting',
];

const MEAL_FREQUENCY = [
    { label: '1-2 meals/day', value: '1-2' },
    { label: '3 meals/day', value: '3' },
    { label: '4-5 meals/day', value: '4-5' },
    { label: '6+ meals/day', value: '6+' },
];

const PRODUCE_INTAKE = [
    { label: 'Rarely', value: 'rarely' },
    { label: '1-2 servings/day', value: '1-2' },
    { label: '3-4 servings/day', value: '3-4' },
    { label: '5+ servings/day', value: '5+' },
];

const radioButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: spacing.sm,
    borderRadius: 8,
    border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
    backgroundColor: isActive ? colors.journeys.health.background : colors.neutral.white,
    textAlign: 'left',
    cursor: 'pointer',
    fontWeight: isActive ? 600 : 400,
    color: colors.neutral.gray900,
    fontSize: 14,
    width: '100%',
});

const StepDietPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Diet & Nutrition
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Your dietary habits help us understand nutritional health and potential deficiencies.
            </Text>

            {/* Diet type */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    What best describes your diet?
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {DIET_TYPES.map((diet) => {
                        const isActive = (data.dietType as string) === diet;
                        return (
                            <button
                                key={diet}
                                onClick={() => onUpdate('dietType', diet)}
                                style={radioButtonStyle(isActive)}
                                aria-pressed={isActive}
                                aria-label={diet}
                            >
                                {diet}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Meal frequency */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    How many meals do you eat per day?
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                    {MEAL_FREQUENCY.map((opt) => {
                        const isActive = (data.mealFrequency as string) === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => onUpdate('mealFrequency', opt.value)}
                                style={{
                                    flex: 1,
                                    minWidth: 120,
                                    padding: spacing.xs,
                                    borderRadius: 8,
                                    border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                    backgroundColor: isActive ? colors.journeys.health.primary : colors.neutral.white,
                                    color: isActive ? colors.neutral.white : colors.neutral.gray900,
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: isActive ? 600 : 400,
                                }}
                                aria-pressed={isActive}
                                aria-label={opt.label}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Produce intake */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Fruits & vegetables intake
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                    {PRODUCE_INTAKE.map((opt) => {
                        const isActive = (data.produceIntake as string) === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => onUpdate('produceIntake', opt.value)}
                                style={{
                                    flex: 1,
                                    minWidth: 120,
                                    padding: spacing.xs,
                                    borderRadius: 8,
                                    border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                    backgroundColor: isActive ? colors.journeys.health.primary : colors.neutral.white,
                                    color: isActive ? colors.neutral.white : colors.neutral.gray900,
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: isActive ? 600 : 400,
                                }}
                                aria-pressed={isActive}
                                aria-label={opt.label}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default StepDietPage;
