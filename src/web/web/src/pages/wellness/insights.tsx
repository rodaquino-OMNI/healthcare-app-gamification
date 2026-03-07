import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

type TimePeriod = 'week' | 'month';

interface MetricCard {
    label: string;
    value: string;
    trend: string;
    trendUp: boolean;
}

const WEEKLY_METRICS: MetricCard[] = [
    { label: 'Mood Trend', value: '3.8 / 5', trend: '+0.3 from last week', trendUp: true },
    { label: 'Activity Level', value: '72%', trend: '+5% from last week', trendUp: true },
    { label: 'Sleep Quality', value: '7.2h avg', trend: '-0.3h from last week', trendUp: false },
    { label: 'Mindfulness', value: '45 min', trend: '+10 min from last week', trendUp: true },
];

const MONTHLY_METRICS: MetricCard[] = [
    { label: 'Mood Trend', value: '3.6 / 5', trend: '+0.2 from last month', trendUp: true },
    { label: 'Activity Level', value: '68%', trend: '+8% from last month', trendUp: true },
    { label: 'Sleep Quality', value: '7.0h avg', trend: '+0.2h from last month', trendUp: true },
    { label: 'Mindfulness', value: '180 min', trend: '+30 min from last month', trendUp: true },
];

interface TipItem {
    id: string;
    title: string;
    category: string;
    readTime: string;
}

const WELLNESS_TIPS: TipItem[] = [
    { id: '1', title: 'The Power of Deep Breathing', category: 'Stress Management', readTime: '3 min' },
    { id: '2', title: 'Mindful Meditation for Beginners', category: 'Mindfulness', readTime: '5 min' },
    { id: '3', title: 'Morning Routines for Wellness', category: 'Daily Habits', readTime: '4 min' },
    { id: '4', title: 'Sleep Hygiene Essentials', category: 'Sleep', readTime: '4 min' },
];

const InsightsPage: React.FC = () => {
    const router = useRouter();
    const [period, setPeriod] = useState<TimePeriod>('week');

    const metrics = period === 'week' ? WEEKLY_METRICS : MONTHLY_METRICS;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/wellness')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to wellness home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Health Insights
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Your wellness report
            </Text>

            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
                <Button
                    variant={period === 'week' ? 'primary' : 'secondary'}
                    journey="health"
                    onPress={() => setPeriod('week')}
                    accessibilityLabel="This week"
                >
                    This Week
                </Button>
                <Button
                    variant={period === 'month' ? 'primary' : 'secondary'}
                    journey="health"
                    onPress={() => setPeriod('month')}
                    accessibilityLabel="This month"
                >
                    This Month
                </Button>
            </Box>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: spacing.sm,
                    marginBottom: spacing['2xl'],
                }}
            >
                {metrics.map((metric) => (
                    <Card key={metric.label} journey="health" elevation="sm" padding="md">
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {metric.label}
                        </Text>
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={colors.journeys.health.primary}
                            style={{ marginTop: spacing['3xs'] }}
                        >
                            {metric.value}
                        </Text>
                        <Text
                            fontSize="xs"
                            color={metric.trendUp ? colors.journeys.health.primary : colors.semantic.error}
                            style={{ marginTop: spacing['3xs'] }}
                        >
                            {metric.trend}
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
                Wellness Tips
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                {WELLNESS_TIPS.map((tip) => (
                    <div
                        key={tip.id}
                        onClick={() => router.push(`/wellness/tip/${tip.id}`)}
                        style={{ cursor: 'pointer' }}
                        role="link"
                        tabIndex={0}
                        aria-label={tip.title}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') router.push(`/wellness/tip/${tip.id}`);
                        }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <Text fontWeight="semiBold" fontSize="md">
                                {tip.title}
                            </Text>
                            <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing['3xs'] }}>
                                <Text fontSize="xs" color={colors.journeys.health.primary}>
                                    {tip.category}
                                </Text>
                                <Text fontSize="xs" color={colors.gray[40]}>
                                    {tip.readTime} read
                                </Text>
                            </Box>
                        </Card>
                    </div>
                ))}
            </div>

            <Box display="flex" justifyContent="center">
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => router.push('/wellness/goals')}
                    accessibilityLabel="View goals"
                >
                    View Goals
                </Button>
            </Box>
        </div>
    );
};

export default InsightsPage;
