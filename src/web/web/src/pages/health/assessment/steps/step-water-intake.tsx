import React from 'react';
import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const WATER_INTAKE = [
    { label: 'Less than 1L', value: '<1', icon: '\uD83D\uDCA7' },
    { label: '1-2 liters', value: '1-2', icon: '\uD83D\uDCA7\uD83D\uDCA7' },
    { label: '2-3 liters', value: '2-3', icon: '\uD83D\uDCA7\uD83D\uDCA7\uD83D\uDCA7' },
    { label: '3+ liters', value: '3+', icon: '\uD83D\uDCA7\uD83D\uDCA7\uD83D\uDCA7\uD83D\uDCA7' },
];

const CAFFEINE_INTAKE = [
    { label: 'None', value: 'none' },
    { label: '1-2 cups/day', value: '1-2' },
    { label: '3-4 cups/day', value: '3-4' },
    { label: '5+ cups/day', value: '5+' },
];

const SUGARY_DRINKS = [
    { label: 'Never', value: 'never' },
    { label: 'Rarely (1-2/week)', value: 'rarely' },
    { label: 'Often (3-5/week)', value: 'often' },
    { label: 'Daily', value: 'daily' },
];

const StepWaterIntakePage: React.FC<StepProps> = ({ data, onUpdate }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Hydration & Beverages
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Proper hydration is fundamental to every body function.
            </Text>

            {/* Water intake */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Daily water intake
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {WATER_INTAKE.map((opt) => {
                        const isActive = data.waterIntake === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => onUpdate('waterIntake', opt.value)}
                                style={{
                                    padding: spacing.sm,
                                    borderRadius: 8,
                                    border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                    backgroundColor: isActive
                                        ? colors.journeys.health.background
                                        : colors.neutral.white,
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: spacing.sm,
                                }}
                                aria-pressed={isActive}
                                aria-label={opt.label}
                            >
                                <span style={{ fontSize: 18, minWidth: 40 }}>{opt.icon}</span>
                                <Text
                                    fontSize="sm"
                                    fontWeight={isActive ? 'semiBold' : 'regular'}
                                    color={colors.neutral.gray900}
                                >
                                    {opt.label}
                                </Text>
                                {isActive && (
                                    <Text
                                        fontSize="md"
                                        color={colors.journeys.health.primary}
                                        style={{ marginLeft: 'auto' }}
                                    >
                                        {'\u2713'}
                                    </Text>
                                )}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Caffeine */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Caffeine intake (coffee, tea, energy drinks)
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                    {CAFFEINE_INTAKE.map((opt) => {
                        const isActive = data.caffeineIntake === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => onUpdate('caffeineIntake', opt.value)}
                                style={{
                                    flex: 1,
                                    minWidth: 100,
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

            {/* Sugary drinks */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Sugary drink consumption (soda, juice, sweetened beverages)
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                    {SUGARY_DRINKS.map((opt) => {
                        const isActive = data.sugaryDrinks === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => onUpdate('sugaryDrinks', opt.value)}
                                style={{
                                    flex: 1,
                                    minWidth: 100,
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

export default StepWaterIntakePage;
