import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { QuestCard } from 'design-system/gamification/QuestCard';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quest } from 'shared/types/gamification.types';

import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';

type QuestFilter = 'all' | 'active' | 'completed';
type JourneyFilter = 'all' | 'health' | 'care' | 'plan';

const MOCK_QUESTS: Quest[] = [
    {
        id: 'q1',
        title: 'First Steps',
        description: 'Complete your health profile and connect a device',
        journey: 'health',
        icon: 'heart',
        progress: 2,
        total: 3,
        completed: false,
    },
    {
        id: 'q2',
        title: 'Health Tracker',
        description: 'Log your vitals for 7 consecutive days',
        journey: 'health',
        icon: 'activity',
        progress: 5,
        total: 7,
        completed: false,
    },
    {
        id: 'q3',
        title: 'Wellness Check',
        description: 'Schedule and attend a preventive care appointment',
        journey: 'care',
        icon: 'calendar',
        progress: 1,
        total: 1,
        completed: true,
    },
    {
        id: 'q4',
        title: 'Know Your Coverage',
        description: 'Review all sections of your insurance plan',
        journey: 'plan',
        icon: 'shield',
        progress: 3,
        total: 5,
        completed: false,
    },
    {
        id: 'q5',
        title: 'Medication Master',
        description: 'Set up reminders for all your medications',
        journey: 'health',
        icon: 'pill',
        progress: 4,
        total: 4,
        completed: true,
    },
    {
        id: 'q6',
        title: 'Symptom Scholar',
        description: 'Use the symptom checker 3 times',
        journey: 'care',
        icon: 'search',
        progress: 1,
        total: 3,
        completed: false,
    },
    {
        id: 'q7',
        title: 'Claim Champion',
        description: 'Submit and track an insurance claim',
        journey: 'plan',
        icon: 'file',
        progress: 0,
        total: 2,
        completed: false,
    },
    {
        id: 'q8',
        title: 'Community Helper',
        description: 'Share a health tip with another user',
        journey: 'health',
        icon: 'users',
        progress: 0,
        total: 1,
        completed: false,
    },
];

const FILTER_LABELS: Record<QuestFilter, string> = {
    all: 'All',
    active: 'Active',
    completed: 'Completed',
};

const JOURNEY_LABELS: Record<JourneyFilter, string> = {
    all: 'All Journeys',
    health: 'My Health',
    care: 'Care Now',
    plan: 'My Plan',
};

/**
 * Quest list page displaying all available quests with filter controls
 * for status (active/completed) and journey.
 */
const QuestsPage: React.FC = () => {
    const { t: _t } = useTranslation();
    const { userId } = useAuth();
    const { gameProfile, loading: _loading } = useGamification(userId || 'user-123');
    const [statusFilter, setStatusFilter] = useState<QuestFilter>('all');
    const [journeyFilter, setJourneyFilter] = useState<JourneyFilter>('all');

    const quests: Quest[] = useMemo(() => {
        const profileQuests = gameProfile?.quests;
        return profileQuests && profileQuests.length > 0 ? profileQuests : MOCK_QUESTS;
    }, [gameProfile]);

    const filteredQuests = quests.filter((quest) => {
        if (statusFilter === 'active' && quest.completed) {
            return false;
        }
        if (statusFilter === 'completed' && !quest.completed) {
            return false;
        }
        if (journeyFilter !== 'all' && quest.journey !== journeyFilter) {
            return false;
        }
        return true;
    });

    const activeCount = quests.filter((q) => !q.completed).length;
    const completedCount = quests.filter((q) => q.completed).length;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" alignItems="center" style={{ marginBottom: spacing.lg, gap: spacing.md }}>
                <Link href="/achievements">
                    <Button variant="secondary" onPress={() => {}}>
                        Back
                    </Button>
                </Link>
                <Text fontSize="2xl" fontWeight="bold">
                    Quests
                </Text>
            </Box>

            {/* Summary bar */}
            <Box display="flex" style={{ gap: spacing.md, marginBottom: spacing.xl }}>
                <Card padding="md" style={{ flex: 1, textAlign: 'center' }}>
                    <Text fontSize="2xl" fontWeight="bold" color={colors.gamification.primary}>
                        {activeCount}
                    </Text>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Active
                    </Text>
                </Card>
                <Card padding="md" style={{ flex: 1, textAlign: 'center' }}>
                    <Text fontSize="2xl" fontWeight="bold" color={colors.semantic.success}>
                        {completedCount}
                    </Text>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Completed
                    </Text>
                </Card>
                <Card padding="md" style={{ flex: 1, textAlign: 'center' }}>
                    <Text fontSize="2xl" fontWeight="bold">
                        {MOCK_QUESTS.length}
                    </Text>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Total
                    </Text>
                </Card>
            </Box>

            {/* Status filter tabs */}
            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing.md }}>
                {(Object.keys(FILTER_LABELS) as QuestFilter[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        style={{
                            padding: `${spacing.sm} ${spacing.md}`,
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: statusFilter === f ? 700 : 400,
                            backgroundColor: statusFilter === f ? colors.gamification.primary : colors.gray[10],
                            color: statusFilter === f ? colors.gray[0] : colors.gray[70],
                            fontSize: '14px',
                        }}
                    >
                        {FILTER_LABELS[f]}
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
                            border:
                                journeyFilter === jf
                                    ? `2px solid ${colors.gamification.primary}`
                                    : `1px solid ${colors.gray[20]}`,
                            cursor: 'pointer',
                            backgroundColor: journeyFilter === jf ? colors.gamification.background : colors.gray[0],
                            color: journeyFilter === jf ? colors.gamification.primary : colors.gray[70],
                            fontSize: '13px',
                            fontWeight: journeyFilter === jf ? 600 : 400,
                        }}
                    >
                        {JOURNEY_LABELS[jf]}
                    </button>
                ))}
            </Box>

            {/* Quest list */}
            <Box style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {filteredQuests.map((quest) => (
                    <Link key={quest.id} href={`/achievements/quests/${quest.id}`} passHref>
                        <div style={{ cursor: 'pointer' }}>
                            <QuestCard
                                quest={{
                                    ...quest,
                                    journey:
                                        quest.journey === 'health' ||
                                        quest.journey === 'care' ||
                                        quest.journey === 'plan'
                                            ? quest.journey
                                            : 'health',
                                }}
                            />
                        </div>
                    </Link>
                ))}
            </Box>

            {filteredQuests.length === 0 && (
                <Card padding="lg" style={{ textAlign: 'center', marginTop: spacing.lg }}>
                    <Text fontSize="md" color={colors.gray[50]}>
                        No quests match your current filters.
                    </Text>
                </Card>
            )}
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default QuestsPage;
