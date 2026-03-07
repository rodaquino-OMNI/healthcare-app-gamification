import React, { useState } from 'react';
import Link from 'next/link';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Leaderboard } from 'design-system/gamification/Leaderboard';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

type Timeframe = 'weekly' | 'monthly' | 'allTime';
type JourneyFilter = 'all' | 'health' | 'care' | 'plan';

const MOCK_USERS = [
    { id: 'u1', name: 'Ana Silva', xp: 4850, level: 12, avatar: '' },
    { id: 'u2', name: 'Carlos Mendes', xp: 4200, level: 11, avatar: '' },
    { id: 'u3', name: 'Maria Santos', xp: 3900, level: 10, avatar: '' },
    { id: 'user-123', name: 'You', xp: 3750, level: 10, avatar: '' },
    { id: 'u4', name: 'Pedro Costa', xp: 3500, level: 9, avatar: '' },
    { id: 'u5', name: 'Julia Oliveira', xp: 3100, level: 9, avatar: '' },
    { id: 'u6', name: 'Rafael Lima', xp: 2800, level: 8, avatar: '' },
    { id: 'u7', name: 'Beatriz Rocha', xp: 2500, level: 7, avatar: '' },
    { id: 'u8', name: 'Lucas Ferreira', xp: 2300, level: 7, avatar: '' },
    { id: 'u9', name: 'Camila Alves', xp: 2100, level: 6, avatar: '' },
];

const TIMEFRAME_LABELS: Record<Timeframe, string> = {
    weekly: 'This Week',
    monthly: 'This Month',
    allTime: 'All Time',
};

const JOURNEY_LABELS: Record<JourneyFilter, string> = {
    all: 'All Journeys',
    health: 'My Health',
    care: 'Care Now',
    plan: 'My Plan',
};

/**
 * Leaderboard page showing user rankings filtered by timeframe and journey.
 * Uses the DS Leaderboard component for rendering the ranked list.
 */
const LeaderboardPage: React.FC = () => {
    const [timeframe, setTimeframe] = useState<Timeframe>('weekly');
    const [journeyFilter, setJourneyFilter] = useState<JourneyFilter>('all');

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" alignItems="center" style={{ marginBottom: spacing.lg, gap: spacing.md }}>
                <Link href="/achievements">
                    <Button variant="secondary" onPress={() => {}}>
                        Back
                    </Button>
                </Link>
                <Text fontSize="2xl" fontWeight="bold">
                    Leaderboard
                </Text>
            </Box>

            {/* Timeframe tabs */}
            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
                {(Object.keys(TIMEFRAME_LABELS) as Timeframe[]).map((tf) => (
                    <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        style={{
                            padding: `${spacing.sm} ${spacing.md}`,
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: timeframe === tf ? 700 : 400,
                            backgroundColor:
                                timeframe === tf
                                    ? (colors.brand?.primary ?? '#6C63FF')
                                    : (colors.gray[10] ?? '#f0f0f0'),
                            color: timeframe === tf ? '#fff' : (colors.gray[70] ?? '#333'),
                            fontSize: '14px',
                        }}
                    >
                        {TIMEFRAME_LABELS[tf]}
                    </button>
                ))}
            </Box>

            {/* Journey filter */}
            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                {(Object.keys(JOURNEY_LABELS) as JourneyFilter[]).map((jf) => (
                    <button
                        key={jf}
                        onClick={() => setJourneyFilter(jf)}
                        style={{
                            padding: `${spacing.xs} ${spacing.md}`,
                            borderRadius: '16px',
                            border: journeyFilter === jf ? '2px solid #6C63FF' : '1px solid #e0e0e0',
                            cursor: 'pointer',
                            backgroundColor: journeyFilter === jf ? '#f0eeff' : '#fff',
                            color: journeyFilter === jf ? '#6C63FF' : (colors.gray[70] ?? '#333'),
                            fontSize: '13px',
                            fontWeight: journeyFilter === jf ? 600 : 400,
                        }}
                    >
                        {JOURNEY_LABELS[jf]}
                    </button>
                ))}
            </Box>

            {/* Leaderboard */}
            <Card elevation="md" padding="lg">
                <Leaderboard
                    users={MOCK_USERS}
                    currentUserId="user-123"
                    journey={journeyFilter === 'all' ? undefined : journeyFilter}
                    title={`${TIMEFRAME_LABELS[timeframe]} Rankings`}
                />
            </Card>

            {/* Your position highlight */}
            <Card padding="md" style={{ marginTop: spacing.lg, backgroundColor: '#f0eeff' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Text fontWeight="bold">Your Position</Text>
                    <Text fontSize="xl" fontWeight="bold" color="#6C63FF">
                        #4
                    </Text>
                </Box>
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                    250 XP behind 3rd place. Keep it up!
                </Text>
            </Card>
        </div>
    );
};

export default LeaderboardPage;
