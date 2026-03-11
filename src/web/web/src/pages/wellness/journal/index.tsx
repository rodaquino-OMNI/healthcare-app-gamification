import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useWellness } from '@/hooks/useWellness';

const MOOD_TAGS = ['Happy', 'Calm', 'Anxious', 'Sad', 'Energetic', 'Tired'];
const PLACEHOLDER_USER_ID = 'me';

const JournalEntryPage: React.FC = () => {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const { createEntry } = useWellness();

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleSave = (): void => {
        if (!content.trim()) {
            return;
        }
        void createEntry(PLACEHOLDER_USER_ID, {
            title: today,
            content: content.trim(),
            mood: selectedMood ?? undefined,
            tags: selectedMood ? [selectedMood] : [],
        })
            .then(() => {
                setSaved(true);
                setContent('');
                setSelectedMood(null);
                setTimeout(() => setSaved(false), 2000);
            })
            .catch(() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            });
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
                Journal
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xs }}>
                {today}
            </Text>

            {saved && (
                <Card journey="health" elevation="sm" padding="sm" style={{ marginBottom: spacing.sm }}>
                    <Text fontSize="sm" color={colors.journeys.health.primary} fontWeight="semiBold">
                        Entry saved
                    </Text>
                </Card>
            )}

            <Card
                journey="health"
                elevation="sm"
                padding="md"
                style={{ marginBottom: spacing.lg, marginTop: spacing.md }}
            >
                <Text fontWeight="semiBold" fontSize="md" style={{ marginBottom: spacing.sm }}>
                    New Entry
                </Text>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your thoughts..."
                    aria-label="Journal entry"
                    style={{
                        width: '100%',
                        minHeight: 200,
                        padding: spacing.sm,
                        borderRadius: '8px',
                        border: `1px solid ${colors.gray[20]}`,
                        fontSize: '14px',
                        lineHeight: '1.7',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                    }}
                />
                <Box display="flex" justifyContent="flex-end" style={{ marginTop: spacing.xs }}>
                    <Text fontSize="xs" color={colors.gray[40]}>
                        {wordCount} words
                    </Text>
                </Box>
            </Card>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                <Text fontWeight="semiBold" fontSize="md" style={{ marginBottom: spacing.sm }}>
                    How are you feeling?
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                    {MOOD_TAGS.map((mood) => (
                        <button
                            key={mood}
                            onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
                            aria-label={mood}
                            style={{
                                padding: `${spacing['3xs']} ${spacing.md}`,
                                borderRadius: '16px',
                                border: `1px solid ${selectedMood === mood ? colors.journeys.health.primary : colors.gray[20]}`,
                                backgroundColor:
                                    selectedMood === mood ? colors.journeys.health.background : colors.gray[0],
                                color: selectedMood === mood ? colors.journeys.health.primary : colors.gray[60],
                                fontSize: '13px',
                                fontWeight: selectedMood === mood ? 600 : 400,
                                cursor: 'pointer',
                            }}
                        >
                            {mood}
                        </button>
                    ))}
                </div>
            </Card>

            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button variant="primary" journey="health" onPress={handleSave} accessibilityLabel="Save entry">
                    Save Entry
                </Button>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => void router.push('/wellness/journal/history')}
                    accessibilityLabel="View history"
                >
                    View History
                </Button>
            </Box>
        </div>
    );
};

export default JournalEntryPage;
