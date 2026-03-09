import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

type ChallengeStatus = 'Active' | 'Upcoming' | 'Completed';

interface Challenge {
    id: string;
    title: string;
    category: string;
    status: ChallengeStatus;
    participants: number;
    daysLeft: number;
    progress: number;
    reward: string;
}

const STATUS_TABS: ChallengeStatus[] = ['Active', 'Upcoming', 'Completed'];

const CHALLENGES: Challenge[] = [
    {
        id: '1',
        title: '7-Day Meditation Streak',
        category: 'Mindfulness',
        status: 'Active',
        participants: 234,
        daysLeft: 4,
        progress: 43,
        reward: 'Zen Master Badge',
    },
    {
        id: '2',
        title: '10K Steps Daily',
        category: 'Fitness',
        status: 'Active',
        participants: 567,
        daysLeft: 12,
        progress: 60,
        reward: 'Step Champion Badge',
    },
    {
        id: '3',
        title: 'Hydration Hero',
        category: 'Nutrition',
        status: 'Active',
        participants: 189,
        daysLeft: 8,
        progress: 75,
        reward: 'Hydration Pro Badge',
    },
    {
        id: '4',
        title: '30-Day Yoga Journey',
        category: 'Fitness',
        status: 'Upcoming',
        participants: 412,
        daysLeft: 30,
        progress: 0,
        reward: 'Yoga Warrior Badge',
    },
    {
        id: '5',
        title: 'Mindful Eating Week',
        category: 'Nutrition',
        status: 'Upcoming',
        participants: 156,
        daysLeft: 15,
        progress: 0,
        reward: 'Mindful Eater Badge',
    },
    {
        id: '6',
        title: 'Sleep Better Challenge',
        category: 'Sleep',
        status: 'Completed',
        participants: 890,
        daysLeft: 0,
        progress: 100,
        reward: 'Sleep Master Badge',
    },
    {
        id: '7',
        title: '5K Running Goal',
        category: 'Fitness',
        status: 'Completed',
        participants: 345,
        daysLeft: 0,
        progress: 100,
        reward: 'Runner Badge',
    },
];

const ChallengesPage: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ChallengeStatus>('Active');

    const filtered = CHALLENGES.filter((c) => c.status === activeTab);

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
                Wellness Challenges
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Join challenges and earn rewards
            </Text>

            <Box
                display="flex"
                style={{ gap: spacing.sm, marginBottom: spacing.lg }}
                role="tablist"
                aria-label="Challenge status"
            >
                {STATUS_TABS.map((tab) => (
                    <Button
                        key={tab}
                        variant={activeTab === tab ? 'primary' : 'secondary'}
                        journey="health"
                        onPress={() => setActiveTab(tab)}
                        accessibilityLabel={tab}
                    >
                        {tab}
                    </Button>
                ))}
            </Box>

            {filtered.length === 0 ? (
                <Card journey="health" elevation="sm" padding="lg">
                    <Text fontSize="md" color={colors.gray[40]} style={{ textAlign: 'center' }}>
                        No {activeTab.toLowerCase()} challenges
                    </Text>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {filtered.map((challenge) => (
                        <div
                            key={challenge.id}
                            onClick={() => void router.push(`/wellness/challenges/${challenge.id}`)}
                            style={{ cursor: 'pointer' }}
                            role="link"
                            tabIndex={0}
                            aria-label={challenge.title}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    void router.push(`/wellness/challenges/${challenge.id}`);
                                }
                            }}
                        >
                            <Card journey="health" elevation="sm" padding="md">
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box style={{ flex: 1 }}>
                                        <Text fontWeight="semiBold" fontSize="md">
                                            {challenge.title}
                                        </Text>
                                        <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing['3xs'] }}>
                                            <Text fontSize="xs" color={colors.journeys.health.primary}>
                                                {challenge.category}
                                            </Text>
                                            <Text fontSize="xs" color={colors.gray[40]}>
                                                {challenge.participants} participants
                                            </Text>
                                        </Box>
                                    </Box>
                                    {challenge.daysLeft > 0 && (
                                        <Text fontSize="xs" fontWeight="semiBold" color={colors.semantic.warning}>
                                            {challenge.daysLeft} days left
                                        </Text>
                                    )}
                                </Box>
                                {challenge.progress > 0 && (
                                    <div style={{ marginTop: spacing.sm }}>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            style={{ marginBottom: spacing['3xs'] }}
                                        >
                                            <Text fontSize="xs" color={colors.gray[50]}>
                                                Progress
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                fontWeight="semiBold"
                                                color={colors.journeys.health.primary}
                                            >
                                                {challenge.progress}%
                                            </Text>
                                        </Box>
                                        <div
                                            style={{
                                                width: '100%',
                                                height: 6,
                                                backgroundColor: colors.gray[10],
                                                borderRadius: 3,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: `${challenge.progress}%`,
                                                    height: 6,
                                                    backgroundColor: colors.journeys.health.primary,
                                                    borderRadius: 3,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <Box display="flex" style={{ marginTop: spacing.xs }}>
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        Reward: {challenge.reward}
                                    </Text>
                                </Box>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChallengesPage;
