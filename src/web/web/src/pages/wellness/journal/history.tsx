import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import { useWellness } from '@/hooks/useWellness';

const MOOD_FILTERS = ['All Moods', 'Happy', 'Calm', 'Anxious', 'Sad', 'Energetic', 'Tired'];

const MOOD_COLORS: Record<string, string> = {
    Happy: colors.journeys.health.primary,
    Calm: colors.journeys.health.secondary,
    Anxious: colors.semantic.warning,
    Sad: colors.gray[50],
    Energetic: colors.journeys.health.primary,
    Tired: colors.gray[40],
};

const PLACEHOLDER_USER_ID = 'me';

const JournalHistoryPage: React.FC = () => {
    const router = useRouter();
    const [activeMood, setActiveMood] = useState('All Moods');
    const { journalHistory, loadJournalHistory } = useWellness();

    useEffect(() => {
        void loadJournalHistory(PLACEHOLDER_USER_ID);
    }, [loadJournalHistory]);

    const filtered = activeMood === 'All Moods' ? journalHistory : journalHistory.filter((e) => e.mood === activeMood);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/wellness/journal')}
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
                {journalHistory.length} entries total
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
                                    {entry.createdAt}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    fontWeight="semiBold"
                                    color={entry.mood ? (MOOD_COLORS[entry.mood] ?? colors.gray[50]) : colors.gray[50]}
                                >
                                    {entry.mood ?? ''}
                                </Text>
                            </Box>
                            <Text fontSize="sm" color={colors.gray[60]} style={{ lineHeight: '1.5' }}>
                                {entry.content.slice(0, 120)}
                                {entry.content.length > 120 ? '...' : ''}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing.xs }}>
                                {entry.content.trim().split(/\s+/).length} words
                            </Text>
                        </Card>
                    ))}
                </div>
            )}

            <Box display="flex" justifyContent="center">
                <Button
                    variant="primary"
                    journey="health"
                    onPress={() => void router.push('/wellness/journal')}
                    accessibilityLabel="New entry"
                >
                    New Entry
                </Button>
            </Box>
        </div>
    );
};

export default JournalHistoryPage;
