import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

type Filter = 'all' | 'running' | 'cycling' | 'gym';

const FILTERS: Array<{ id: Filter; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'running', label: 'Running' },
    { id: 'cycling', label: 'Cycling' },
    { id: 'gym', label: 'Gym' },
];

const WORKOUTS = [
    { id: '1', type: 'Running', date: 'Feb 23, 2026', duration: '45 min', calories: '380 kcal', category: 'running' },
    { id: '2', type: 'Gym', date: 'Feb 22, 2026', duration: '60 min', calories: '450 kcal', category: 'gym' },
    { id: '3', type: 'Cycling', date: 'Feb 21, 2026', duration: '35 min', calories: '290 kcal', category: 'cycling' },
    { id: '4', type: 'Running', date: 'Feb 20, 2026', duration: '30 min', calories: '260 kcal', category: 'running' },
    { id: '5', type: 'Gym', date: 'Feb 19, 2026', duration: '55 min', calories: '410 kcal', category: 'gym' },
    { id: '6', type: 'Cycling', date: 'Feb 18, 2026', duration: '40 min', calories: '320 kcal', category: 'cycling' },
];

const WorkoutHistoryPage: React.FC = () => {
    const router = useRouter();
    const [filter, setFilter] = useState<Filter>('all');

    const filtered = filter === 'all' ? WORKOUTS : WORKOUTS.filter((w) => w.category === filter);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/activity')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to activity home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Workout History
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Browse your past workouts
            </Text>

            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
                {FILTERS.map((f) => (
                    <Button
                        key={f.id}
                        variant={filter === f.id ? 'primary' : 'secondary'}
                        journey="health"
                        onPress={() => setFilter(f.id)}
                        accessibilityLabel={f.label}
                    >
                        {f.label}
                    </Button>
                ))}
            </Box>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {filtered.map((w) => (
                    <div
                        key={w.id}
                        onClick={() => router.push(`/health/activity/${w.id}`)}
                        role="link"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') router.push(`/health/activity/${w.id}`);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text}>
                                        {w.type}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {w.date}
                                    </Text>
                                </Box>
                                <Box style={{ textAlign: 'right' }}>
                                    <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.primary}>
                                        {w.duration}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        {w.calories}
                                    </Text>
                                </Box>
                            </Box>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutHistoryPage;
