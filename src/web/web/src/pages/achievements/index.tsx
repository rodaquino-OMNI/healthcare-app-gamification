import React from 'react';
import Link from 'next/link';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { AchievementBadge } from 'src/web/design-system/src/gamification/AchievementBadge';
import { LevelIndicator } from 'src/web/design-system/src/gamification/LevelIndicator';
import { XPCounter } from 'src/web/design-system/src/gamification/XPCounter';
import { useGameProfile } from 'src/web/web/src/hooks/useGamification';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import type { Achievement } from 'src/web/shared/types/gamification.types';

const JOURNEY_LABELS: Record<string, string> = {
    health: 'My Health',
    care: 'Care Now',
    plan: 'My Plan',
};

/**
 * Achievements hub page displaying the user's gamification profile,
 * achievements grouped by journey, and quick links to leaderboard/quests/rewards.
 */
const AchievementsPage: React.FC = () => {
    const userId = 'user-123'; // Replace with actual auth context
    const { data, loading, error } = useGameProfile(userId);

    if (loading) {
        return (
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="lg">Loading achievements...</Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="lg" color={colors.semantic.error}>
                    Error loading achievements. Please try again later.
                </Text>
            </div>
        );
    }

    const profile = data?.gameProfile;
    const achievements = profile?.achievements ?? [];

    const achievementsByJourney = achievements.reduce<Record<string, Achievement[]>>((acc, achievement) => {
        const key = achievement.journey;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(achievement);
        return acc;
    }, {});

    const xpForNextLevel = (profile?.level ?? 1) * 1000;

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl }}>
            {/* Page header */}
            <Text fontSize="2xl" fontWeight="bold" style={{ marginBottom: spacing.lg }}>
                Achievements
            </Text>

            {/* Level and XP section */}
            <Card elevation="md" padding="lg" style={{ marginBottom: spacing['2xl'] }}>
                <Box display="flex" alignItems="center" style={{ gap: spacing.xl, flexWrap: 'wrap' }}>
                    <LevelIndicator
                        level={profile?.level ?? 1}
                        currentXp={profile?.xp ?? 0}
                        nextLevelXp={xpForNextLevel}
                    />
                    <Box>
                        <Text fontSize="lg" fontWeight="bold">
                            Level {profile?.level ?? 1}
                        </Text>
                        <XPCounter value={profile?.xp ?? 0} size="md" />
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                            {xpForNextLevel - (profile?.xp ?? 0)} XP to next level
                        </Text>
                    </Box>
                </Box>
            </Card>

            {/* Quick links */}
            <Box display="flex" style={{ gap: spacing.md, marginBottom: spacing['2xl'], flexWrap: 'wrap' }}>
                <Link href="/achievements/leaderboard" passHref>
                    <Card
                        padding="md"
                        style={{ flex: 1, minWidth: '200px', cursor: 'pointer', textDecoration: 'none' }}
                    >
                        <Text fontWeight="bold" fontSize="md">
                            Leaderboard
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            See how you rank
                        </Text>
                    </Card>
                </Link>
                <Link href="/achievements/quests" passHref>
                    <Card
                        padding="md"
                        style={{ flex: 1, minWidth: '200px', cursor: 'pointer', textDecoration: 'none' }}
                    >
                        <Text fontWeight="bold" fontSize="md">
                            Quests
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {profile?.quests?.filter((q) => !q.completed).length ?? 0} active quests
                        </Text>
                    </Card>
                </Link>
                <Link href="/achievements/rewards" passHref>
                    <Card
                        padding="md"
                        style={{ flex: 1, minWidth: '200px', cursor: 'pointer', textDecoration: 'none' }}
                    >
                        <Text fontWeight="bold" fontSize="md">
                            Rewards
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Redeem your XP
                        </Text>
                    </Card>
                </Link>
            </Box>

            {/* Achievements by journey */}
            {Object.entries(achievementsByJourney).map(([journey, journeyAchievements]) => (
                <div key={journey} style={{ marginBottom: spacing['2xl'] }}>
                    <Text fontWeight="bold" fontSize="xl" style={{ marginBottom: spacing.md }}>
                        {JOURNEY_LABELS[journey] ?? journey} Achievements
                    </Text>
                    <Box display="flex" style={{ gap: spacing.md, flexWrap: 'wrap' }}>
                        {journeyAchievements.map((achievement) => (
                            <Link key={achievement.id} href={`/achievements/${achievement.id}`} passHref>
                                <div style={{ cursor: 'pointer' }}>
                                    <AchievementBadge achievement={achievement} size="md" showProgress />
                                </div>
                            </Link>
                        ))}
                    </Box>
                </div>
            ))}

            {achievements.length === 0 && (
                <Card padding="lg" style={{ textAlign: 'center' }}>
                    <Text fontSize="lg" color={colors.gray[50]}>
                        No achievements earned yet. Start completing quests to unlock achievements!
                    </Text>
                </Card>
            )}
        </div>
    );
};

export default AchievementsPage;
