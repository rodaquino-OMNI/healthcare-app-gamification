import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useWellness } from '@/hooks/useWellness';

interface Milestone {
    label: string;
    days: number;
}

const MILESTONES: Milestone[] = [
    { label: '7 Day Streak', days: 7 },
    { label: '30 Day Streak', days: 30 },
    { label: '90 Day Streak', days: 90 },
];

const PLACEHOLDER_USER_ID = 'me';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateCalendarHeatmap = (): { day: number; active: boolean }[][] => {
    const weeks: { day: number; active: boolean }[][] = [];
    let dayCounter = 1;
    for (let w = 0; w < 4; w++) {
        const week: { day: number; active: boolean }[] = [];
        for (let d = 0; d < 7; d++) {
            week.push({ day: dayCounter, active: dayCounter <= 23 && Math.random() > 0.2 });
            dayCounter++;
        }
        weeks.push(week);
    }
    return weeks;
};

const StreaksPage: React.FC = () => {
    const router = useRouter();
    const { streaks, loadStreaks } = useWellness();
    const calendarWeeks = generateCalendarHeatmap();

    useEffect(() => {
        void loadStreaks(PLACEHOLDER_USER_ID);
    }, [loadStreaks]);

    const primaryStreak = streaks[0];
    const currentStreak = primaryStreak?.currentCount ?? 0;
    const bestStreak = primaryStreak?.longestCount ?? 0;

    const handleShare = (): void => {
        window.alert('Share feature coming soon.');
    };

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
                Streaks &amp; Rewards
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Stay consistent and earn rewards
            </Text>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing.lg }}>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="xs" color={colors.gray[50]}>
                        Current Streak
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        {currentStreak} days
                    </Text>
                </Card>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="xs" color={colors.gray[50]}>
                        Best Streak
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.secondary}>
                        {bestStreak} days
                    </Text>
                </Card>
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Milestones
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
                {MILESTONES.map((milestone) => {
                    const earned = currentStreak >= milestone.days;
                    return (
                        <Card key={milestone.label} journey="health" elevation="sm" padding="md">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Text fontWeight="semiBold" fontSize="md">
                                        {milestone.label}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        {milestone.days} consecutive days
                                    </Text>
                                </Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="semiBold"
                                    color={earned ? colors.journeys.health.primary : colors.gray[30]}
                                >
                                    {earned ? 'Earned' : `${milestone.days - currentStreak} days away`}
                                </Text>
                            </Box>
                            <div
                                style={{
                                    width: '100%',
                                    height: 4,
                                    backgroundColor: colors.gray[10],
                                    borderRadius: 2,
                                    marginTop: spacing.xs,
                                }}
                            >
                                <div
                                    style={{
                                        width: `${Math.min((currentStreak / milestone.days) * 100, 100)}%`,
                                        height: 4,
                                        backgroundColor: earned
                                            ? colors.journeys.health.primary
                                            : colors.semantic.warning,
                                        borderRadius: 2,
                                    }}
                                />
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Activity Calendar
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: spacing['3xs'],
                        textAlign: 'center',
                    }}
                >
                    {DAY_LABELS.map((d) => (
                        <Text key={d} fontSize="xs" fontWeight="semiBold" color={colors.gray[40]}>
                            {d}
                        </Text>
                    ))}
                    {calendarWeeks.flat().map((cell, i) => (
                        <div
                            key={i}
                            style={{
                                height: 28,
                                borderRadius: 4,
                                backgroundColor: cell.active ? `${colors.journeys.health.primary}` : colors.gray[10],
                                opacity: cell.active ? 0.3 + (cell.day / 28) * 0.7 : 1,
                            }}
                        />
                    ))}
                </div>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Streaks Breakdown
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                {streaks.map((streak) => (
                    <Card key={streak.id} journey="health" elevation="sm" padding="md">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Text fontWeight="semiBold" fontSize="md">
                                {streak.type}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {streak.currentCount} days current
                            </Text>
                        </Box>
                    </Card>
                ))}
                {streaks.length === 0 && (
                    <Text fontSize="sm" color={colors.gray[40]}>
                        No streak data yet
                    </Text>
                )}
            </div>

            <Box display="flex" justifyContent="center">
                <Button variant="secondary" journey="health" onPress={handleShare} accessibilityLabel="Share streak">
                    Share Streak
                </Button>
            </Box>
        </div>
    );
};

export default StreaksPage;
