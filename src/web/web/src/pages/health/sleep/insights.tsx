import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSleep } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

const WEEKLY_TIPS = [
    {
        id: '1',
        title: 'Consistent Schedule',
        body: 'Going to bed and waking up at the same time every day helps regulate your internal clock.',
    },
    {
        id: '2',
        title: 'Limit Blue Light',
        body: 'Avoid screens 1 hour before bed. Blue light suppresses melatonin production.',
    },
    {
        id: '3',
        title: 'Cool Environment',
        body: 'Keep your bedroom between 18-20\u00b0C for optimal sleep conditions.',
    },
];

const TRENDS = [
    { label: 'Duration', value: '7.2h avg', trend: 'up', color: colors.semantic.success },
    { label: 'Quality', value: '82 score', trend: 'up', color: colors.semantic.success },
    { label: 'Consistency', value: '85%', trend: 'down', color: colors.semantic.warning },
];

const RECOMMENDATIONS = [
    {
        id: '1',
        title: 'Earlier Bedtime',
        body: 'Based on your data, shifting bedtime 30 minutes earlier could improve your deep sleep by 15%.',
    },
    {
        id: '2',
        title: 'Reduce Caffeine',
        body: 'You logged caffeine as a factor 3 times this week. Try cutting off caffeine after 2 PM.',
    },
    {
        id: '3',
        title: 'Add Exercise',
        body: 'Days with exercise show 20% higher sleep scores. Aim for 30 minutes of activity before 6 PM.',
    },
];

const trendArrow = (direction: string): string => (direction === 'up' ? '\u2191' : '\u2193');

const SleepInsightsPage: React.FC = () => {
    const { t } = useTranslation();
    const { data: sleepData, loading, error, refetch } = useSleep();
    const router = useRouter();

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

    void sleepData;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/sleep')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to sleep home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Sleep Insights
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Personalized tips and trends based on your data
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Trend Indicators
            </Text>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: spacing.sm,
                    marginBottom: spacing.xl,
                }}
            >
                {TRENDS.map((t) => (
                    <Card key={t.label} journey="health" elevation="sm" padding="md" style={{ textAlign: 'center' }}>
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {t.label}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                            {t.value}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={t.color}>
                            {trendArrow(t.trend)} {t.trend === 'up' ? 'Improving' : 'Declining'}
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
                Weekly Tips
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
                {WEEKLY_TIPS.map((tip) => (
                    <Card key={tip.id} journey="health" elevation="sm" padding="md">
                        <Text fontWeight="semiBold" fontSize="md" color={colors.journeys.health.text}>
                            {tip.title}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                            {tip.body}
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
                Personalized Recommendations
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {RECOMMENDATIONS.map((rec) => (
                    <Card key={rec.id} journey="health" elevation="sm" padding="md">
                        <Box display="flex" style={{ gap: spacing.sm }}>
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    backgroundColor: `${colors.journeys.health.primary}22`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <Text fontSize="sm" fontWeight="bold" color={colors.journeys.health.primary}>
                                    {rec.id}
                                </Text>
                            </div>
                            <Box>
                                <Text fontWeight="semiBold" fontSize="md" color={colors.journeys.health.text}>
                                    {rec.title}
                                </Text>
                                <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                                    {rec.body}
                                </Text>
                            </Box>
                        </Box>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default SleepInsightsPage;
