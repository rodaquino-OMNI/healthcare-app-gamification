import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { Button } from 'design-system/components/Button/Button';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

const MOOD_FILTERS = ['All Moods', 'Happy', 'Calm', 'Anxious', 'Sad', 'Energetic', 'Tired'];

interface JournalEntry {
    id: string;
    date: string;
    preview: string;
    mood: string;
    wordCount: number;
}

const ENTRIES: JournalEntry[] = [
    {
        id: '1',
        date: 'Feb 23, 2026',
        preview: 'Today was productive. I managed to complete my morning routine and felt great about it...',
        mood: 'Happy',
        wordCount: 142,
    },
    {
        id: '2',
        date: 'Feb 22, 2026',
        preview: 'Had a tough day at work. Feeling overwhelmed with the deadlines approaching...',
        mood: 'Anxious',
        wordCount: 98,
    },
    {
        id: '3',
        date: 'Feb 21, 2026',
        preview: 'Went for a long walk in the park. The weather was beautiful and I felt at peace...',
        mood: 'Calm',
        wordCount: 167,
    },
    {
        id: '4',
        date: 'Feb 20, 2026',
        preview: 'Started a new meditation routine. It is hard to focus but I will keep practicing...',
        mood: 'Calm',
        wordCount: 85,
    },
    {
        id: '5',
        date: 'Feb 19, 2026',
        preview: 'Feeling tired after a poor night of sleep. Need to work on my sleep hygiene...',
        mood: 'Tired',
        wordCount: 73,
    },
    {
        id: '6',
        date: 'Feb 18, 2026',
        preview: 'Great workout session today. Ran 5km and did some stretching afterwards...',
        mood: 'Energetic',
        wordCount: 120,
    },
    {
        id: '7',
        date: 'Feb 17, 2026',
        preview: 'Missing home today. Called my family and it helped a lot...',
        mood: 'Sad',
        wordCount: 56,
    },
    {
        id: '8',
        date: 'Feb 16, 2026',
        preview: 'Cooked a healthy meal for the first time this week. Feeling proud of myself...',
        mood: 'Happy',
        wordCount: 94,
    },
];

const MOOD_COLORS: Record<string, string> = {
    Happy: colors.journeys.health.primary,
    Calm: colors.journeys.health.secondary,
    Anxious: colors.semantic.warning,
    Sad: colors.gray[50],
    Energetic: colors.journeys.health.primary,
    Tired: colors.gray[40],
};

const JournalHistoryPage: React.FC = () => {
    const router = useRouter();
    const [activeMood, setActiveMood] = useState('All Moods');

    const filtered = activeMood === 'All Moods' ? ENTRIES : ENTRIES.filter((e) => e.mood === activeMood);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/wellness/journal')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to journal"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Journal History
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                {ENTRIES.length} entries total
            </Text>

            <div
                style={{
                    display: 'flex',
                    gap: spacing.xs,
                    overflowX: 'auto',
                    marginBottom: spacing.lg,
                    paddingBottom: spacing.xs,
                }}
                role="tablist"
                aria-label="Filter by mood"
            >
                {MOOD_FILTERS.map((mood) => (
                    <button
                        key={mood}
                        onClick={() => setActiveMood(mood)}
                        role="tab"
                        aria-selected={activeMood === mood}
                        style={{
                            padding: `${spacing.xs} ${spacing.md}`,
                            borderRadius: '20px',
                            border: `1px solid ${activeMood === mood ? colors.journeys.health.primary : colors.gray[20]}`,
                            backgroundColor: activeMood === mood ? colors.journeys.health.background : colors.gray[0],
                            color: activeMood === mood ? colors.journeys.health.primary : colors.gray[60],
                            fontWeight: activeMood === mood ? 600 : 400,
                            fontSize: '14px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {mood}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <Card journey="health" elevation="sm" padding="lg">
                    <Text fontSize="md" color={colors.gray[40]} style={{ textAlign: 'center' }}>
                        No journal entries yet
                    </Text>
                </Card>
            ) : (
                <div
                    style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}
                >
                    {filtered.map((entry) => (
                        <Card key={entry.id} journey="health" elevation="sm" padding="md">
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                style={{ marginBottom: spacing.xs }}
                            >
                                <Text fontWeight="semiBold" fontSize="sm" color={colors.gray[70]}>
                                    {entry.date}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    fontWeight="semiBold"
                                    color={MOOD_COLORS[entry.mood] ?? colors.gray[50]}
                                >
                                    {entry.mood}
                                </Text>
                            </Box>
                            <Text fontSize="sm" color={colors.gray[60]} style={{ lineHeight: '1.5' }}>
                                {entry.preview}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing.xs }}>
                                {entry.wordCount} words
                            </Text>
                        </Card>
                    ))}
                </div>
            )}

            <Box display="flex" justifyContent="center">
                <Button
                    variant="primary"
                    journey="health"
                    onPress={() => router.push('/wellness/journal')}
                    accessibilityLabel="New entry"
                >
                    New Entry
                </Button>
            </Box>
        </div>
    );
};

export default JournalHistoryPage;
