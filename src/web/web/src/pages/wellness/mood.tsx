import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

const MOOD_SCALE = [
    { value: 1, label: 'Very Bad', color: colors.semantic.error },
    { value: 2, label: 'Bad', color: colors.semantic.warning },
    { value: 3, label: 'Neutral', color: colors.gray[40] },
    { value: 4, label: 'Good', color: colors.journeys.health.secondary },
    { value: 5, label: 'Very Good', color: colors.journeys.health.primary },
];

interface MoodEntry {
    id: string;
    date: string;
    value: number;
    note: string;
}

const MOOD_HISTORY: MoodEntry[] = [
    { id: '1', date: 'Today, 9:00 AM', value: 4, note: 'Feeling productive' },
    { id: '2', date: 'Yesterday, 8:30 PM', value: 3, note: '' },
    { id: '3', date: 'Yesterday, 12:00 PM', value: 2, note: 'Work stress' },
    { id: '4', date: 'Feb 21, 7:00 AM', value: 5, note: 'Great morning run' },
    { id: '5', date: 'Feb 20, 9:00 PM', value: 3, note: '' },
    { id: '6', date: 'Feb 20, 1:00 PM', value: 4, note: 'Good lunch break' },
];

const WEEKLY_AVERAGE = 3.6;
const ENTRIES_THIS_WEEK = 12;

const MoodCheckInPage: React.FC = () => {
    const router = useRouter();
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [note, setNote] = useState('');

    const handleSave = () => {
        if (selectedMood === null) return;
        window.alert(`Mood logged: ${MOOD_SCALE[selectedMood - 1].label}`);
        setSelectedMood(null);
        setNote('');
    };

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
                        {WEEKLY_AVERAGE.toFixed(1)}
                    </Text>
                </Card>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="xs" color={colors.gray[50]}>
                        Entries This Week
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        {ENTRIES_THIS_WEEK}
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
                {MOOD_HISTORY.map((entry) => {
                    const mood = MOOD_SCALE[entry.value - 1];
                    return (
                        <Card key={entry.id} journey="health" elevation="sm" padding="md">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium">
                                        {entry.date}
                                    </Text>
                                    {entry.note && (
                                        <Text
                                            fontSize="xs"
                                            color={colors.gray[50]}
                                            style={{ marginTop: spacing['3xs'] }}
                                        >
                                            {entry.note}
                                        </Text>
                                    )}
                                </Box>
                                <Box style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                                    <div
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            backgroundColor: mood.color,
                                        }}
                                    />
                                    <Text fontSize="sm" fontWeight="semiBold" color={mood.color}>
                                        {mood.label}
                                    </Text>
                                </Box>
                            </Box>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default MoodCheckInPage;
