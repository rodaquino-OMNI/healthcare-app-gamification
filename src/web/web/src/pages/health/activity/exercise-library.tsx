import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

type Category = 'all' | 'cardio' | 'strength' | 'flexibility';

const CATEGORIES: Array<{ id: Category; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'strength', label: 'Strength' },
    { id: 'flexibility', label: 'Flexibility' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
    Beginner: colors.semantic.success,
    Intermediate: colors.semantic.warning,
    Advanced: colors.semantic.error,
};

const EXERCISES = [
    { id: '1', name: 'Running', category: 'cardio', difficulty: 'Beginner' },
    { id: '2', name: 'Jump Rope', category: 'cardio', difficulty: 'Intermediate' },
    { id: '3', name: 'Push-Ups', category: 'strength', difficulty: 'Beginner' },
    { id: '4', name: 'Deadlift', category: 'strength', difficulty: 'Advanced' },
    { id: '5', name: 'Yoga Flow', category: 'flexibility', difficulty: 'Beginner' },
    { id: '6', name: 'Pilates Core', category: 'flexibility', difficulty: 'Intermediate' },
];

const ExerciseLibraryPage: React.FC = () => {
    const router = useRouter();
    const [category, setCategory] = useState<Category>('all');

    const filtered = category === 'all' ? EXERCISES : EXERCISES.filter((e) => e.category === category);

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
                Exercise Library
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Browse exercises by category
            </Text>

            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
                {CATEGORIES.map((c) => (
                    <Button
                        key={c.id}
                        variant={category === c.id ? 'primary' : 'secondary'}
                        journey="health"
                        onPress={() => setCategory(c.id)}
                        accessibilityLabel={c.label}
                    >
                        {c.label}
                    </Button>
                ))}
            </Box>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
                {filtered.map((ex) => (
                    <div
                        key={ex.id}
                        onClick={() => router.push('/health/activity/exercise-detail')}
                        role="link"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') router.push('/health/activity/exercise-detail');
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <div
                                style={{
                                    width: '100%',
                                    height: 80,
                                    borderRadius: '8px',
                                    backgroundColor: colors.gray[10],
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: spacing.sm,
                                }}
                            >
                                <Text fontSize="sm" color={colors.gray[40]}>
                                    {ex.category}
                                </Text>
                            </div>
                            <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text}>
                                {ex.name}
                            </Text>
                            <div
                                style={{
                                    display: 'inline-block',
                                    marginTop: spacing.xs,
                                    padding: `${spacing['3xs']} ${spacing.xs}`,
                                    borderRadius: '12px',
                                    backgroundColor: DIFFICULTY_COLORS[ex.difficulty],
                                }}
                            >
                                <Text fontSize="xs" color={colors.gray[0]}>
                                    {ex.difficulty}
                                </Text>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExerciseLibraryPage;
