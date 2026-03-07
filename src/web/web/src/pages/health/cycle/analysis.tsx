import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface StatItem {
    label: string;
    value: string;
    detail: string;
}

const STATS: StatItem[] = [
    { label: 'Average Cycle Length', value: '28.0 days', detail: 'Based on 6 cycles' },
    { label: 'Average Period Length', value: '4.7 days', detail: 'Range: 4-5 days' },
    { label: 'Shortest Cycle', value: '27 days', detail: 'Nov 2025' },
    { label: 'Longest Cycle', value: '29 days', detail: 'Dec 2025' },
];

const REGULARITY = {
    score: 92,
    label: 'Very Regular',
    description: 'Your cycle is highly predictable with minimal variation.',
};

const CYCLE_LENGTHS = [28, 28, 29, 27, 28, 28];
const MAX_BAR = 30;

const TREND_ITEMS = [
    { label: 'Cycle Consistency', value: 'Stable', color: colors.semantic.success },
    { label: 'Flow Pattern', value: 'Light to Medium', color: colors.journeys.health.primary },
    { label: 'PMS Severity', value: 'Moderate', color: colors.semantic.warning },
    { label: 'Symptom Frequency', value: 'Decreasing', color: colors.semantic.success },
];

const AnalysisPage: React.FC = () => {
    const router = useRouter();

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/cycle')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to cycle home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Cycle Analysis
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Statistics and patterns from your tracked data
            </Text>

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ marginBottom: spacing.xl, textAlign: 'center' }}
            >
                <Text fontSize="sm" color={colors.gray[50]}>
                    Regularity Score
                </Text>
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={colors.journeys.health.primary}
                    style={{ margin: `${spacing.xs} 0` }}
                >
                    {REGULARITY.score}%
                </Text>
                <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text}>
                    {REGULARITY.label}
                </Text>
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                    {REGULARITY.description}
                </Text>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Key Statistics
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing.xl }}>
                {STATS.map((s) => (
                    <Card key={s.label} journey="health" elevation="sm" padding="md">
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {s.label}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                            {s.value}
                        </Text>
                        <Text fontSize="xs" color={colors.gray[40]}>
                            {s.detail}
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
                Cycle Length Chart
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: spacing.sm, height: 120 }}>
                    {CYCLE_LENGTHS.map((len, i) => (
                        <div
                            key={i}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                            <Text fontSize="xs" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                                {len}
                            </Text>
                            <div
                                style={{
                                    width: '100%',
                                    height: `${(len / MAX_BAR) * 100}%`,
                                    backgroundColor: colors.journeys.health.primary,
                                    borderRadius: '4px 4px 0 0',
                                    minHeight: 8,
                                }}
                            />
                            <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                                C{i + 1}
                            </Text>
                        </div>
                    ))}
                </div>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Trends
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {TREND_ITEMS.map((item) => (
                    <Card key={item.label} journey="health" elevation="sm" padding="md">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Text fontSize="md" color={colors.journeys.health.text}>
                                {item.label}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold" color={item.color}>
                                {item.value}
                            </Text>
                        </Box>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AnalysisPage;
