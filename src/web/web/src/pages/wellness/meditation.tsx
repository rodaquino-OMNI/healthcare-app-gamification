import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { useWellness } from '@/hooks/useWellness';

const CATEGORIES = ['All', 'Sleep', 'Focus', 'Calm', 'Energy'];

interface MeditationTrack {
    id: string;
    title: string;
    category: string;
    duration: string;
    description: string;
}

const TRACKS: MeditationTrack[] = [
    {
        id: '1',
        title: 'Deep Sleep Journey',
        category: 'Sleep',
        duration: '15 min',
        description: 'A calming guided meditation to help you drift off to sleep.',
    },
    {
        id: '2',
        title: 'Morning Focus',
        category: 'Focus',
        duration: '10 min',
        description: 'Start your day with clarity and intention.',
    },
    {
        id: '3',
        title: 'Calm Waters',
        category: 'Calm',
        duration: '12 min',
        description: 'Visualize peaceful waters to reduce anxiety.',
    },
    {
        id: '4',
        title: 'Energy Boost',
        category: 'Energy',
        duration: '8 min',
        description: 'A quick meditation to recharge your energy.',
    },
    {
        id: '5',
        title: 'Body Scan Relaxation',
        category: 'Calm',
        duration: '20 min',
        description: 'Progressive body scan for deep relaxation.',
    },
    {
        id: '6',
        title: 'Concentration Builder',
        category: 'Focus',
        duration: '15 min',
        description: 'Improve your focus with this guided session.',
    },
];

interface SessionRecord {
    id: string;
    track: string;
    date: string;
    duration: string;
}

const SESSION_HISTORY: SessionRecord[] = [
    { id: '1', track: 'Deep Sleep Journey', date: 'Today, 9:30 PM', duration: '15 min' },
    { id: '2', track: 'Morning Focus', date: 'Today, 7:00 AM', duration: '10 min' },
    { id: '3', track: 'Calm Waters', date: 'Yesterday', duration: '12 min' },
];

const chipStyle = (selected: boolean): React.CSSProperties => ({
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: '20px',
    border: `1px solid ${selected ? colors.journeys.health.primary : colors.gray[20]}`,
    backgroundColor: selected ? colors.journeys.health.background : colors.gray[0],
    color: selected ? colors.journeys.health.primary : colors.gray[60],
    fontWeight: selected ? 600 : 400,
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
});

const PLACEHOLDER_USER_ID = 'me';

const MeditationPage: React.FC = () => {
    const { t: _t } = useTranslation();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('All');
    const [playing, setPlaying] = useState<string | null>(null);
    const { startMeditation } = useWellness();

    const filtered = activeCategory === 'All' ? TRACKS : TRACKS.filter((t) => t.category === activeCategory);

    const handlePlay = (track: MeditationTrack): void => {
        if (playing === track.id) {
            setPlaying(null);
        } else {
            setPlaying(track.id);
            const durationMins = parseInt(track.duration, 10) || 10;
            void startMeditation(PLACEHOLDER_USER_ID, track.category, durationMins).catch(() => {});
        }
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
                Meditation
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Guided meditation sessions for mind and body
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
                aria-label="Meditation categories"
            >
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={chipStyle(activeCategory === cat)}
                        role="tab"
                        aria-selected={activeCategory === cat}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                {filtered.map((track) => (
                    <Card key={track.id} journey="health" elevation="sm" padding="md">
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Box style={{ flex: 1 }}>
                                <Text fontWeight="semiBold" fontSize="md">
                                    {track.title}
                                </Text>
                                <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                                    {track.description}
                                </Text>
                                <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing.xs }}>
                                    <Text fontSize="xs" color={colors.journeys.health.primary}>
                                        {track.category}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        {track.duration}
                                    </Text>
                                </Box>
                            </Box>
                            <Button
                                variant={playing === track.id ? 'secondary' : 'primary'}
                                journey="health"
                                onPress={() => handlePlay(track)}
                                accessibilityLabel={playing === track.id ? 'Pause' : 'Play'}
                            >
                                {playing === track.id ? 'Pause' : 'Play'}
                            </Button>
                        </Box>
                    </Card>
                ))}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Session History
            </Text>
            {SESSION_HISTORY.length === 0 ? (
                <Text fontSize="sm" color={colors.gray[40]}>
                    No sessions yet
                </Text>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {SESSION_HISTORY.map((session) => (
                        <Card key={session.id} journey="health" elevation="sm" padding="md">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Text fontWeight="medium" fontSize="sm">
                                        {session.track}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        {session.date}
                                    </Text>
                                </Box>
                                <Text fontSize="sm" color={colors.journeys.health.primary}>
                                    {session.duration}
                                </Text>
                            </Box>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default MeditationPage;
