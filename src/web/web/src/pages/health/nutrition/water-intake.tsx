import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const DAILY_TARGET = 8;
const HISTORY = [
    { time: '08:00 AM', amount: '1 glass' },
    { time: '10:30 AM', amount: '2 glasses' },
    { time: '12:45 PM', amount: '1 glass' },
    { time: '03:00 PM', amount: '1 glass' },
    { time: '05:15 PM', amount: '1 glass' },
];

const WaterIntakePage: React.FC = () => {
    const router = useRouter();
    const [current, setCurrent] = useState(6);

    const handleAdd = (amount: number) => {
        setCurrent((prev) => Math.min(prev + amount, DAILY_TARGET + 4));
    };

    const pct = Math.min(Math.round((current / DAILY_TARGET) * 100), 100);

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
                Water Intake
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Stay hydrated throughout the day
            </Text>

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ textAlign: 'center', marginBottom: spacing.xl }}
            >
                <Text fontSize="sm" color={colors.gray[50]}>
                    Today's Hydration
                </Text>
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={colors.journeys.health.primary}
                    style={{ margin: `${spacing.xs} 0` }}
                >
                    {current} / {DAILY_TARGET} glasses
                </Text>
                <div
                    style={{
                        height: 12,
                        borderRadius: '6px',
                        backgroundColor: colors.gray[10],
                        overflow: 'hidden',
                        margin: `${spacing.xs} 0`,
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            width: `${pct}%`,
                            borderRadius: '6px',
                            backgroundColor: colors.journeys.health.primary,
                        }}
                    />
                </div>
                <Text fontSize="sm" color={colors.gray[40]}>
                    {pct}% of daily goal
                </Text>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Quick Add
            </Text>
            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
                {[1, 2, 3].map((amount) => (
                    <Button
                        key={amount}
                        variant="secondary"
                        journey="health"
                        onPress={() => handleAdd(amount)}
                        accessibilityLabel={`Add ${amount} glass`}
                    >
                        +{amount} glass{amount > 1 ? 'es' : ''}
                    </Button>
                ))}
            </Box>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Today's History
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                {HISTORY.map((entry, idx) => (
                    <div key={entry.time}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Text fontSize="sm" color={colors.gray[60]}>
                                {entry.time}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.primary}>
                                {entry.amount}
                            </Text>
                        </Box>
                        {idx < HISTORY.length - 1 && (
                            <div style={{ height: 1, backgroundColor: colors.gray[10], margin: `${spacing.xs} 0` }} />
                        )}
                    </div>
                ))}
            </Card>

            <Card journey="health" elevation="sm" padding="md">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text}>
                        Hydration Streak
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        9 days
                    </Text>
                </Box>
            </Card>
        </div>
    );
};

export default WaterIntakePage;
