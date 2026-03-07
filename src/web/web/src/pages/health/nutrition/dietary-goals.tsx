import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const MACRO_SPLITS = [
    { label: 'Carbohydrates', pct: 45, color: colors.semantic.warning },
    { label: 'Protein', pct: 30, color: colors.journeys.health.primary },
    { label: 'Fat', pct: 25, color: colors.journeys.health.secondary },
];

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.xs,
    border: `1px solid ${colors.gray[20]}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: colors.gray[60],
};

const DietaryGoalsPage: React.FC = () => {
    const router = useRouter();
    const [calorieTarget, setCalorieTarget] = useState('2000');

    const handleSave = () => {
        window.alert(`Goals saved: ${calorieTarget} kcal/day`);
    };

    const handleReset = () => {
        setCalorieTarget('2000');
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
                Dietary Goals
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Set your daily calorie and macronutrient targets
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Calorie Target
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                    Daily Calories (kcal)
                </Text>
                <input
                    type="number"
                    value={calorieTarget}
                    onChange={(e) => setCalorieTarget(e.target.value)}
                    min="1200"
                    max="4000"
                    aria-label="Calorie target"
                    style={inputStyle}
                />
                <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                    Recommended: 1,800 – 2,200 kcal for adults
                </Text>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Macro Distribution
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                {MACRO_SPLITS.map((macro) => (
                    <Card key={macro.label} journey="health" elevation="sm" padding="md">
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ marginBottom: spacing.xs }}
                        >
                            <Text fontSize="md" color={colors.journeys.health.text}>
                                {macro.label}
                            </Text>
                            <Text fontSize="md" fontWeight="bold" color={macro.color}>
                                {macro.pct}%
                            </Text>
                        </Box>
                        <div
                            style={{
                                height: 8,
                                borderRadius: '4px',
                                backgroundColor: colors.gray[10],
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: `${macro.pct}%`,
                                    borderRadius: '4px',
                                    backgroundColor: macro.color,
                                }}
                            />
                        </div>
                        <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                            {Math.round(
                                (parseInt(calorieTarget || '2000') * macro.pct) / 100 / (macro.label === 'Fat' ? 9 : 4)
                            )}
                            g / day
                        </Text>
                    </Card>
                ))}
            </div>

            <Box display="flex" style={{ gap: spacing.sm }}>
                <Box style={{ flex: 1 }}>
                    <Button journey="health" onPress={handleSave} accessibilityLabel="Save goals">
                        Save Goals
                    </Button>
                </Box>
                <Box style={{ flex: 1 }}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleReset}
                        accessibilityLabel="Reset to defaults"
                    >
                        Reset
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default DietaryGoalsPage;
