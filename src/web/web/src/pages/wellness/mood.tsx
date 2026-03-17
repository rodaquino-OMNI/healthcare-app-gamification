import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState, useEffect } from 'react';

import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { useWellness } from '@/hooks/useWellness';

const MOOD_SCALE = [
    { value: 1, label: 'Very Bad', color: colors.semantic.error },
    { value: 2, label: 'Bad', color: colors.semantic.warning },
    { value: 3, label: 'Neutral', color: colors.gray[40] },
    { value: 4, label: 'Good', color: colors.journeys.health.secondary },
    { value: 5, label: 'Very Good', color: colors.journeys.health.primary },
];

const MOOD_VALUE_MAP: Record<number, 'great' | 'good' | 'okay' | 'bad' | 'terrible'> = {
    5: 'great',
    4: 'good',
    3: 'okay',
    2: 'bad',
    1: 'terrible',
};

const MOOD_LABEL_MAP: Record<string, number> = {
    great: 5,
    good: 4,
    okay: 3,
    bad: 2,
    terrible: 1,
};

const PLACEHOLDER_USER_ID = 'me';

const MoodCheckInPage: React.FC = () => {
    const router = useRouter();
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [note, setNote] = useState('');
    const { moodPrompt, loadMoodPrompt, submitMood } = useWellness();

    useEffect(() => {
        void loadMoodPrompt(PLACEHOLDER_USER_ID);
    }, [loadMoodPrompt]);

    const previousMoodValue = moodPrompt?.previousMood ? (MOOD_LABEL_MAP[moodPrompt.previousMood.mood] ?? null) : null;

    const moodHistory = moodPrompt?.previousMood ? [moodPrompt.previousMood] : [];

    const weeklyAverage = previousMoodValue ?? 0;
    const entriesThisWeek = moodHistory.length;

    const handleSave = (): void => {
        if (selectedMood === null) {
            return;
        }
        void submitMood(PLACEHOLDER_USER_ID, {
            mood: MOOD_VALUE_MAP[selectedMood] ?? 'okay',
            energy: selectedMood,
            stress: 6 - selectedMood,
            notes: note || undefined,
        });
        setSelectedMood(null);
        setNote('');
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
                Mood Check-In
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                How are you feeling right now?
            </Text>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                <Box display="flex" justifyContent="space-between" style={{ marginBottom: spacing.md }}>
                    {MOOD_SCALE.map((mood) => (
                        <button
                            key={mood.value}
                            onClick={() => setSelectedMood(mood.value)}
                            aria-label={mood.label}
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                border: `3px solid ${selectedMood === mood.value ? mood.color : colors.gray[20]}`,
                                backgroundColor: selectedMood === mood.value ? `${mood.color}22` : colors.gray[0],
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <Text fontSize="lg" fontWeight="bold" color={mood.color}>
                                {mood.value}
                            </Text>
                        </button>
                    ))}
                </Box>
                <Box display="flex" justifyContent="space-between" style={{ marginBottom: spacing.md }}>
                    {MOOD_SCALE.map((mood) => (
                        <Text
                            key={mood.value}
                            fontSize="xs"
                            color={colors.gray[50]}
                            style={{ width: 60, textAlign: 'center' }}
                        >
                            {mood.label}
                        </Text>
                    ))}
                </Box>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note (optional)"
                    aria-label="Mood note"
                    style={{
                        width: '100%',
                        minHeight: 80,
                        padding: spacing.sm,
                        borderRadius: '8px',
                        border: `1px solid ${colors.gray[20]}`,
                        fontSize: '14px',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                    }}
                />
                <Box display="flex" justifyContent="flex-end" style={{ marginTop: spacing.sm }}>
                    <Button variant="primary" journey="health" onPress={handleSave} accessibilityLabel="Log mood">
                        Log Mood
                    </Button>
                </Box>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing.lg }}>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="xs" color={colors.gray[50]}>
                        Weekly Average
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        {weeklyAverage.toFixed(1)}
                    </Text>
                </Card>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="xs" color={colors.gray[50]}>
                        Entries This Week
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        {entriesThisWeek}
                    </Text>
                </Card>
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Mood History
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {moodHistory.map((entry) => {
                    const moodValue = MOOD_LABEL_MAP[entry.mood] ?? 3;
                    const moodScale = MOOD_SCALE[moodValue - 1];
                    return (
                        <Card key={entry.id} journey="health" elevation="sm" padding="md">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium">
                                        {entry.timestamp}
                                    </Text>
                                    {entry.notes && (
                                        <Text
                                            fontSize="xs"
                                            color={colors.gray[50]}
                                            style={{ marginTop: spacing['3xs'] }}
                                        >
                                            {entry.notes}
                                        </Text>
                                    )}
                                </Box>
                                <Box style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                                    <div
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            backgroundColor: moodScale?.color ?? colors.gray[40],
                                        }}
                                    />
                                    <Text
                                        fontSize="sm"
                                        fontWeight="semiBold"
                                        color={moodScale?.color ?? colors.gray[40]}
                                    >
                                        {moodScale?.label ?? entry.mood}
                                    </Text>
                                </Box>
                            </Box>
                        </Card>
                    );
                })}
                {moodHistory.length === 0 && (
                    <Text fontSize="sm" color={colors.gray[40]}>
                        No mood history yet
                    </Text>
                )}
            </div>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default MoodCheckInPage;
