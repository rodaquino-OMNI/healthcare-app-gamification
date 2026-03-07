import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

const AI_INSIGHTS = [
    {
        title: 'Protein Intake',
        description: 'Your protein intake is 18% below weekly target. Consider adding lean meats or legumes.',
        trend: 'down',
    },
    {
        title: 'Calorie Balance',
        description: 'You maintained a healthy calorie deficit this week, averaging 200 kcal below target.',
        trend: 'up',
    },
    {
        title: 'Meal Timing',
        description: 'You tend to skip breakfast on weekends. A consistent routine improves metabolism.',
        trend: 'neutral',
    },
];

const TIPS = [
    'Eat leafy greens with each meal for micronutrients',
    'Drink water before meals to support digestion',
    'Plan meals in advance to avoid unhealthy choices',
];

const SUGGESTED_MEALS = [
    { name: 'Quinoa & Black Bean Bowl', calories: 440 },
    { name: 'Salmon with Roasted Veg', calories: 520 },
    { name: 'Greek Yogurt Parfait', calories: 260 },
];

const trendColor = (trend: string): string => {
    if (trend === 'up') return colors.semantic.success;
    if (trend === 'down') return colors.semantic.error;
    return colors.semantic.warning;
};

const trendLabel = (trend: string): string => {
    if (trend === 'up') return 'Improving';
    if (trend === 'down') return 'Needs attention';
    return 'Stable';
};

const NutritionInsightsPage: React.FC = () => {
    const router = useRouter();

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
                Nutrition Insights
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                AI-powered analysis of your eating habits
            </Text>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text}>
                    Weekly Summary
                </Text>
                <div style={{ height: 1, backgroundColor: colors.gray[10], margin: `${spacing.xs} 0` }} />
                <Box display="flex" justifyContent="space-between">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Avg. Daily Calories
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold">
                        1,876 kcal
                    </Text>
                </Box>
                <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing.xs }}>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Meals Logged
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold">
                        18 / 21
                    </Text>
                </Box>
                <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing.xs }}>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Hydration Goal Met
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold" color={colors.semantic.success}>
                        5 / 7 days
                    </Text>
                </Box>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                AI Insights
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
                {AI_INSIGHTS.map((insight) => (
                    <Card key={insight.title} journey="health" elevation="sm" padding="md">
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ marginBottom: spacing.xs }}
                        >
                            <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text}>
                                {insight.title}
                            </Text>
                            <div
                                style={{
                                    padding: `2px ${spacing.xs}`,
                                    borderRadius: '10px',
                                    backgroundColor: `${trendColor(insight.trend)}22`,
                                }}
                            >
                                <Text fontSize="xs" color={trendColor(insight.trend)}>
                                    {trendLabel(insight.trend)}
                                </Text>
                            </div>
                        </Box>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {insight.description}
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
                Tips
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                {TIPS.map((tip, idx) => (
                    <div key={tip}>
                        <Text fontSize="sm" color={colors.gray[60]}>
                            {tip}
                        </Text>
                        {idx < TIPS.length - 1 && (
                            <div style={{ height: 1, backgroundColor: colors.gray[10], margin: `${spacing.xs} 0` }} />
                        )}
                    </div>
                ))}
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Suggested Meals
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {SUGGESTED_MEALS.map((meal) => (
                    <Card key={meal.name} journey="health" elevation="sm" padding="md">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Text fontSize="md" color={colors.journeys.health.text}>
                                {meal.name}
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color={colors.journeys.health.primary}>
                                {meal.calories} kcal
                            </Text>
                        </Box>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default NutritionInsightsPage;
