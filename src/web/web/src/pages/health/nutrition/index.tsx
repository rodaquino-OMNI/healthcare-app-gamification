import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const QUICK_STATS = [
    { label: 'Calories Today', value: '1,840 kcal' },
    { label: 'Protein', value: '82g' },
    { label: 'Hydration', value: '6 / 8 glasses' },
    { label: 'Streak', value: '9 days' },
];

const NAV_LINKS = [
    { label: 'Log Meal', href: '/health/nutrition/meal-log' },
    { label: 'Food Diary', href: '/health/nutrition/food-diary' },
    { label: 'Macro Tracker', href: '/health/nutrition/macro-tracker' },
    { label: 'Water Intake', href: '/health/nutrition/water-intake' },
    { label: 'Goals', href: '/health/nutrition/dietary-goals' },
    { label: 'Insights', href: '/health/nutrition/insights' },
    { label: 'Food Search', href: '/health/nutrition/food-search' },
    { label: 'Export', href: '/health/nutrition/export' },
];

const NutritionHomePage: React.FC = () => {
    const router = useRouter();

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to health home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Nutrition Monitoring
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Track your meals, macros, and hydration for a healthier lifestyle
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Quick Stats
            </Text>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: spacing.sm,
                    marginBottom: spacing['2xl'],
                }}
            >
                {QUICK_STATS.map((stat) => (
                    <Card key={stat.label} journey="health" elevation="sm" padding="md">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {stat.label}
                        </Text>
                        <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                            {stat.value}
                        </Text>
                    </Card>
                ))}
            </div>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing['2xl'] }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text}>
                            Today&apos;s Goal
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            2,000 kcal target
                        </Text>
                    </Box>
                    <Text fontSize="lg" fontWeight="bold" color={colors.semantic.success}>
                        92%
                    </Text>
                </Box>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Navigation
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.sm }}>
                {NAV_LINKS.map((link) => (
                    <Button
                        key={link.href}
                        variant="secondary"
                        journey="health"
                        onPress={() => router.push(link.href)}
                        accessibilityLabel={link.label}
                    >
                        {link.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default NutritionHomePage;
