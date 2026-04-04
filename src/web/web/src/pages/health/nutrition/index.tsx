import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useNutrition } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

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
    const { t } = useTranslation();
    const { data: nutritionData, loading, error, refetch } = useNutrition();
    const router = useRouter();

    const stats = nutritionData
        ? [
              {
                  label: 'Calories Today',
                  value: String(nutritionData.find((m) => String(m.type) === 'calories')?.value ?? '—') + ' kcal',
              },
              {
                  label: 'Protein',
                  value: String(nutritionData.find((m) => String(m.type) === 'protein')?.value ?? '—') + 'g',
              },
              {
                  label: 'Hydration',
                  value: String(nutritionData.find((m) => String(m.type) === 'hydration')?.value ?? '—'),
              },
              {
                  label: 'Streak',
                  value:
                      String(nutritionData.find((m) => String(m.type) === 'nutrition_streak')?.value ?? '—') + ' days',
              },
          ]
        : [];

    const calorieTarget = nutritionData?.find((m) => String(m.type) === 'calorie_target')?.value;
    const calorieProgress = nutritionData?.find((m) => String(m.type) === 'calorie_progress')?.value;

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>{t('common.loading')}</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    {t('common.error')} <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health')}
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
                {stats.map((stat) => (
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
                            {calorieTarget ? `${String(calorieTarget)} kcal target` : '2,000 kcal target'}
                        </Text>
                    </Box>
                    <Text fontSize="lg" fontWeight="bold" color={colors.semantic.success}>
                        {calorieProgress ? `${String(calorieProgress)}%` : '—'}
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
                        onPress={() => void router.push(link.href)}
                        accessibilityLabel={link.label}
                    >
                        {link.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default NutritionHomePage;
