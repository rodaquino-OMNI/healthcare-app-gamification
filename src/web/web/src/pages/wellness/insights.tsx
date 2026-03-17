import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState, useEffect } from 'react';

import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { useWellness } from '@/hooks/useWellness';

type TimePeriod = 'week' | 'month';

const PLACEHOLDER_USER_ID = 'me';

const InsightsPage: React.FC = () => {
    const router = useRouter();
    const [period, setPeriod] = useState<TimePeriod>('week');
    const { insights, loadInsights } = useWellness();

    useEffect(() => {
        void loadInsights(PLACEHOLDER_USER_ID);
    }, [loadInsights]);

    const metrics = insights.slice(0, 4);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/wellness')}
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
                {metrics.map((insight) => (
                    <Card key={insight.id} journey="health" elevation="sm" padding="md">
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {insight.title}
                        </Text>
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={colors.journeys.health.primary}
                            style={{ marginTop: spacing['3xs'] }}
                        >
                            {insight.metric ?? insight.type}
                        </Text>
                        <Text
                            fontSize="xs"
                            color={
                                insight.trend === 'improving' ? colors.journeys.health.primary : colors.semantic.error
                            }
                            style={{ marginTop: spacing['3xs'] }}
                        >
                            {insight.description}
                        </Text>
                    </Card>
                ))}
                {metrics.length === 0 && (
                    <Text fontSize="sm" color={colors.gray[40]}>
                        No insights available for {period === 'week' ? 'this week' : 'this month'}
                    </Text>
                )}
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
                {insights.slice(4).map((tip) => (
                    <div
                        key={tip.id}
                        onClick={() => void router.push(`/wellness/tip/${tip.id}`)}
                        style={{ cursor: 'pointer' }}
                        role="link"
                        tabIndex={0}
                        aria-label={tip.title}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                void router.push(`/wellness/tip/${tip.id}`);
                            }
                        }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <Text fontWeight="semiBold" fontSize="md">
                                {tip.title}
                            </Text>
                            <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing['3xs'] }}>
                                <Text fontSize="xs" color={colors.journeys.health.primary}>
                                    {tip.type}
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
                    onPress={() => void router.push('/wellness/goals')}
                    accessibilityLabel="View goals"
                >
                    View Goals
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default InsightsPage;
