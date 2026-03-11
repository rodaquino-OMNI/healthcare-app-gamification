import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { ProgressBar } from 'design-system/components/ProgressBar/ProgressBar';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import type { Quest } from 'shared/types/gamification.types';

import { useGamification } from '@/hooks/useGamification';

const MOCK_QUESTS: Record<string, Quest & { requirements: string[]; rewardXp: number }> = {
    q1: {
        id: 'q1',
        title: 'First Steps',
        description:
            'Complete your health profile and connect a wearable device to start tracking your wellness journey.',
        journey: 'health',
        icon: 'heart',
        progress: 2,
        total: 3,
        completed: false,
        requirements: ['Complete health profile', 'Connect a device', 'Log first metric'],
        rewardXp: 200,
    },
    q2: {
        id: 'q2',
        title: 'Health Tracker',
        description: 'Build a healthy habit by logging your vitals every day for a full week.',
        journey: 'health',
        icon: 'activity',
        progress: 5,
        total: 7,
        completed: false,
        requirements: [
            'Log vitals on Day 1',
            'Log vitals on Day 2',
            'Log vitals on Day 3',
            'Log vitals on Day 4',
            'Log vitals on Day 5',
            'Log vitals on Day 6',
            'Log vitals on Day 7',
        ],
        rewardXp: 350,
    },
    q3: {
        id: 'q3',
        title: 'Wellness Check',
        description: 'Take a proactive step by scheduling and attending a preventive care appointment.',
        journey: 'care',
        icon: 'calendar',
        progress: 1,
        total: 1,
        completed: true,
        requirements: ['Schedule a preventive appointment', 'Attend the appointment'],
        rewardXp: 150,
    },
    q4: {
        id: 'q4',
        title: 'Know Your Coverage',
        description: 'Become an expert on your insurance plan by reviewing every section.',
        journey: 'plan',
        icon: 'shield',
        progress: 3,
        total: 5,
        completed: false,
        requirements: [
            'Review plan summary',
            'Check coverage limits',
            'View copay details',
            'Review network providers',
            'Read policy terms',
        ],
        rewardXp: 250,
    },
    q5: {
        id: 'q5',
        title: 'Medication Master',
        description: 'Set up reminders for all your active medications to never miss a dose.',
        journey: 'health',
        icon: 'pill',
        progress: 4,
        total: 4,
        completed: true,
        requirements: [
            'Add first medication',
            'Set reminder for medication 1',
            'Add all medications',
            'Set reminders for all',
        ],
        rewardXp: 300,
    },
    q6: {
        id: 'q6',
        title: 'Symptom Scholar',
        description: 'Use the symptom checker to learn about potential conditions.',
        journey: 'care',
        icon: 'search',
        progress: 1,
        total: 3,
        completed: false,
        requirements: ['Complete first symptom check', 'Complete second symptom check', 'Complete third symptom check'],
        rewardXp: 200,
    },
    q7: {
        id: 'q7',
        title: 'Claim Champion',
        description: 'Navigate the claims process by submitting and tracking an insurance claim.',
        journey: 'plan',
        icon: 'file',
        progress: 0,
        total: 2,
        completed: false,
        requirements: ['Submit a claim', 'Track claim to resolution'],
        rewardXp: 400,
    },
    q8: {
        id: 'q8',
        title: 'Community Helper',
        description: 'Share your health knowledge with the community.',
        journey: 'health',
        icon: 'users',
        progress: 0,
        total: 1,
        completed: false,
        requirements: ['Share a health tip'],
        rewardXp: 100,
    },
};

const JOURNEY_COLORS: Record<string, string> = {
    health: colors.journeys.health.primary,
    care: colors.journeys.care.primary,
    plan: colors.journeys.plan.primary,
};

const JOURNEY_LABELS: Record<string, string> = {
    health: 'My Health',
    care: 'Care Now',
    plan: 'My Plan',
};

/**
 * Quest detail page showing full quest information, progress tracking,
 * individual requirements, and reward preview.
 */
const QuestDetailPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const questId = Array.isArray(id) ? id[0] : id;
    const quest = questId ? MOCK_QUESTS[questId] : undefined;
    const { gameProfile, isLoading: profileLoading } = useGamification('');

    if (!quest) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="lg" color={colors.gray[50]}>
                    Quest not found.
                </Text>
                <Link href="/achievements/quests">
                    <Button variant="secondary" onPress={() => void router.push('/achievements/quests')}>
                        Back to Quests
                    </Button>
                </Link>
            </div>
        );
    }

    const progressPercent = quest.total > 0 ? Math.round((quest.progress / quest.total) * 100) : 0;

    const journeyColor = JOURNEY_COLORS[quest.journey] ?? colors.gamification.primary;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Button
                variant="secondary"
                onPress={() => void router.push('/achievements/quests')}
                accessibilityLabel="Back to quests"
                style={{ marginBottom: spacing.lg }}
            >
                Back to Quests
            </Button>

            {/* Quest header */}
            <Card elevation="md" padding="lg" style={{ marginBottom: spacing.xl }}>
                <Box display="flex" alignItems="center" style={{ gap: spacing.md, marginBottom: spacing.md }}>
                    <span
                        style={{
                            display: 'inline-block',
                            backgroundColor: journeyColor,
                            color: colors.gray[0],
                            padding: `${spacing.xs} ${spacing.sm}`,
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 600,
                        }}
                    >
                        {JOURNEY_LABELS[quest.journey] ?? quest.journey}
                    </span>
                    {quest.completed && (
                        <span
                            style={{
                                display: 'inline-block',
                                backgroundColor: colors.semantic.success,
                                color: colors.gray[0],
                                padding: `${spacing.xs} ${spacing.sm}`,
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 600,
                            }}
                        >
                            Completed
                        </span>
                    )}
                </Box>
                <Text fontSize="2xl" fontWeight="bold" style={{ marginBottom: spacing.sm }}>
                    {quest.title}
                </Text>
                <Text fontSize="md" color={colors.gray[50]}>
                    {quest.description}
                </Text>
            </Card>

            {/* Progress section */}
            <Card elevation="sm" padding="lg" style={{ marginBottom: spacing.xl }}>
                <Text fontWeight="bold" fontSize="lg" style={{ marginBottom: spacing.md }}>
                    Progress
                </Text>
                <ProgressBar
                    current={quest.progress}
                    total={quest.total}
                    journey={
                        quest.journey === 'health' || quest.journey === 'care' || quest.journey === 'plan'
                            ? quest.journey
                            : undefined
                    }
                />
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.sm }}>
                    {quest.progress} / {quest.total} steps completed ({progressPercent}%)
                </Text>
            </Card>

            {/* Requirements */}
            <Card elevation="sm" padding="lg" style={{ marginBottom: spacing.xl }}>
                <Text fontWeight="bold" fontSize="lg" style={{ marginBottom: spacing.md }}>
                    Requirements
                </Text>
                {quest.requirements.map((req, index) => {
                    const isComplete = index < quest.progress;
                    return (
                        <Box
                            key={req}
                            display="flex"
                            alignItems="center"
                            style={{
                                gap: spacing.sm,
                                padding: `${spacing.sm} 0`,
                                borderBottom:
                                    index < quest.requirements.length - 1 ? `1px solid ${colors.gray[10]}` : 'none',
                            }}
                        >
                            <span
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: isComplete ? colors.semantic.success : colors.gray[10],
                                    color: isComplete ? colors.gray[0] : colors.gray[50],
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    flexShrink: 0,
                                }}
                            >
                                {isComplete ? '\u2713' : index + 1}
                            </span>
                            <Text
                                fontSize="md"
                                color={isComplete ? colors.gray[50] : undefined}
                                style={{ textDecoration: isComplete ? 'line-through' : 'none' }}
                            >
                                {req}
                            </Text>
                        </Box>
                    );
                })}
            </Card>

            {/* Reward preview */}
            <Card elevation="sm" padding="lg" style={{ backgroundColor: colors.gamification.background }}>
                <Text fontWeight="bold" fontSize="lg" style={{ marginBottom: spacing.sm }}>
                    Reward
                </Text>
                <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                    <Text fontSize="2xl" fontWeight="bold" color={colors.gamification.primary}>
                        {quest.rewardXp} XP
                    </Text>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        upon completion
                    </Text>
                </Box>
                {!profileLoading && gameProfile && (
                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                        Current level: {gameProfile.level} ({gameProfile.xp} XP total)
                    </Text>
                )}
            </Card>
        </div>
    );
};

export default QuestDetailPage;
