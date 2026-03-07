import React, { useState } from 'react';
import Link from 'next/link';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { QuestCard } from 'design-system/gamification/QuestCard';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import type { Quest } from 'shared/types/gamification.types';

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
    const [statusFilter, setStatusFilter] = useState<QuestFilter>('all');
    const [journeyFilter, setJourneyFilter] = useState<JourneyFilter>('all');

    const filteredQuests = MOCK_QUESTS.filter((quest) => {
        if (statusFilter === 'active' && quest.completed) return false;
        if (statusFilter === 'completed' && !quest.completed) return false;
        if (journeyFilter !== 'all' && quest.journey !== journeyFilter) return false;
        return true;
    });

    const activeCount = MOCK_QUESTS.filter((q) => !q.completed).length;
    const completedCount = MOCK_QUESTS.filter((q) => q.completed).length;

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
                    <Text fontSize="2xl" fontWeight="bold" color="#6C63FF">
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
                            backgroundColor: statusFilter === f ? '#6C63FF' : (colors.gray[10] ?? '#f0f0f0'),
                            color: statusFilter === f ? '#fff' : (colors.gray[70] ?? '#333'),
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

            {/* Quest list */}
            <Box style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {filteredQuests.map((quest) => (
                    <Link key={quest.id} href={`/achievements/quests/${quest.id}`} passHref>
                        <div style={{ cursor: 'pointer' }}>
                            <QuestCard
                                quest={quest}
                                progress={quest.total > 0 ? quest.progress / quest.total : 0}
                                journey={quest.journey}
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

export default QuestsPage;
