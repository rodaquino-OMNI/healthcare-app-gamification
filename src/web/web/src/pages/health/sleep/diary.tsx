import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

type FilterPeriod = 'week' | 'month' | 'all';

const QUALITY_EMOJI: Record<string, string> = {
    Excellent: '\ud83e\udd29',
    Good: '\ud83d\ude0a',
    Fair: '\ud83d\ude10',
    Poor: '\ud83d\ude1f',
    Terrible: '\ud83d\ude29',
};

const MOCK_ENTRIES = [
    { id: '1', date: 'Feb 22, 2026', score: 92, hours: '7h 45m', quality: 'Excellent' },
    { id: '2', date: 'Feb 21, 2026', score: 85, hours: '7h 20m', quality: 'Good' },
    { id: '3', date: 'Feb 20, 2026', score: 78, hours: '6h 50m', quality: 'Good' },
    { id: '4', date: 'Feb 19, 2026', score: 65, hours: '6h 10m', quality: 'Fair' },
    { id: '5', date: 'Feb 18, 2026', score: 88, hours: '7h 30m', quality: 'Good' },
    { id: '6', date: 'Feb 17, 2026', score: 45, hours: '5h 15m', quality: 'Poor' },
    { id: '7', date: 'Feb 16, 2026', score: 91, hours: '8h 00m', quality: 'Excellent' },
    { id: '8', date: 'Feb 15, 2026', score: 72, hours: '6h 40m', quality: 'Fair' },
    { id: '9', date: 'Feb 14, 2026', score: 83, hours: '7h 10m', quality: 'Good' },
    { id: '10', date: 'Feb 13, 2026', score: 30, hours: '4h 30m', quality: 'Terrible' },
];

const FILTERS: FilterPeriod[] = ['week', 'month', 'all'];

const scoreColor = (score: number): string => {
    if (score >= 80) return colors.semantic.success;
    if (score >= 60) return colors.semantic.warning;
    return colors.semantic.error;
};

const SleepDiaryPage: React.FC = () => {
    const router = useRouter();
    const [filter, setFilter] = useState<FilterPeriod>('week');

    const filtered = filter === 'week' ? MOCK_ENTRIES.slice(0, 7) : MOCK_ENTRIES;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/sleep')}
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
                Sleep Diary
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Your nightly sleep records
            </Text>

            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
                {FILTERS.map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? 'primary' : 'secondary'}
                        journey="health"
                        onPress={() => setFilter(f)}
                        accessibilityLabel={`Filter by ${f}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </Button>
                ))}
            </Box>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {filtered.map((entry) => (
                    <div
                        key={entry.id}
                        onClick={() => router.push(`/health/sleep/${entry.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Text fontWeight="semiBold" fontSize="md">
                                        {entry.date}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {entry.hours}
                                    </Text>
                                </Box>
                                <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                                    <Text fontSize="lg">{QUALITY_EMOJI[entry.quality]}</Text>
                                    <div
                                        style={{
                                            padding: `${spacing['3xs']} ${spacing.xs}`,
                                            borderRadius: '12px',
                                            backgroundColor: `${scoreColor(entry.score)}22`,
                                        }}
                                    >
                                        <Text fontSize="sm" fontWeight="bold" color={scoreColor(entry.score)}>
                                            {entry.score}
                                        </Text>
                                    </div>
                                </Box>
                            </Box>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SleepDiaryPage;
