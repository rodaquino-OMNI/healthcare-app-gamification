import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { ProgressBar } from 'design-system/components/ProgressBar/ProgressBar';
import { AchievementBadge } from 'design-system/gamification/AchievementBadge';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import type { Achievement } from 'shared/types/gamification.types';

import { useGameProfile } from '@/hooks/useGamification';

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
 * Achievement detail page displaying the full info for a single achievement,
 * including progress, requirements, and journey context.
 */
const AchievementDetailPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const userId = 'user-123';
    const { data, loading, error } = useGameProfile(userId);

    if (loading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="lg">Loading achievement...</Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="lg" color={colors.semantic.error}>
                    Error loading achievement details.
                </Text>
            </div>
        );
    }

    const achievement = data?.gameProfile?.achievements?.find((a: Achievement) => a.id === id);

    if (!achievement) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="lg" color={colors.gray[50]}>
                    Achievement not found.
                </Text>
                <Link href="/achievements">
                    <Button variant="secondary" onPress={() => void router.push('/achievements')}>
                        Back to Achievements
                    </Button>
                </Link>
            </div>
        );
    }

    const ratio = achievement.progress / achievement.total;
    const progressPercent = achievement.total > 0 ? Math.round(ratio * 100) : 0;

    const journeyColor = JOURNEY_COLORS[achievement.journey] ?? colors.gray[50];

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Button
                variant="secondary"
                onPress={() => void router.push('/achievements')}
                accessibilityLabel="Back to achievements"
                style={{ marginBottom: spacing.lg }}
            >
                Back to Achievements
            </Button>

            <Card elevation="md" padding="lg" style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                <Box display="flex" justifyContent="center" style={{ marginBottom: spacing.lg }}>
                    <AchievementBadge achievement={achievement} size="lg" showProgress />
                </Box>
                <Text fontSize="2xl" fontWeight="bold" style={{ marginBottom: spacing.sm }}>
                    {achievement.title}
                </Text>
                <span
                    style={{
                        display: 'inline-block',
                        backgroundColor: journeyColor,
                        color: colors.gray[0],
                        padding: `${spacing.xs} ${spacing.sm}`,
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        marginBottom: spacing.md,
                    }}
                >
                    {JOURNEY_LABELS[achievement.journey] ?? achievement.journey}
                </span>
                <Text fontSize="md" color={colors.gray[50]} style={{ marginBottom: spacing.lg }}>
                    {achievement.description}
                </Text>
            </Card>

            <Card elevation="sm" padding="lg" style={{ marginBottom: spacing.xl }}>
                <Text fontWeight="bold" fontSize="lg" style={{ marginBottom: spacing.md }}>
                    Progress
                </Text>
                <ProgressBar
                    current={achievement.progress}
                    total={achievement.total}
                    journey={
                        achievement.journey === 'health' ||
                        achievement.journey === 'care' ||
                        achievement.journey === 'plan'
                            ? achievement.journey
                            : undefined
                    }
                />
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.sm }}>
                    {achievement.progress} / {achievement.total} completed ({progressPercent}%)
                </Text>
            </Card>

            <Card elevation="sm" padding="lg">
                <Text fontWeight="bold" fontSize="lg" style={{ marginBottom: spacing.md }}>
                    Status
                </Text>
                <Text fontSize="md">
                    {achievement.unlocked
                        ? 'You have unlocked this achievement!'
                        : 'Keep going to unlock this achievement.'}
                </Text>
            </Card>
        </div>
    );
};

export default AchievementDetailPage;
