import { Card } from 'design-system/components/Card/Card';
import { AchievementBadge } from 'design-system/gamification/AchievementBadge';
import { LevelIndicator } from 'design-system/gamification/LevelIndicator';
import { XPCounter } from 'design-system/gamification/XPCounter';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Achievement, Quest } from 'shared/types/gamification.types';

import { useGameProfile } from '@/hooks/useGamification';

const JOURNEY_LABEL_KEYS: Record<string, string> = {
    health: 'gamification.achievements.journeyLabel.health',
    care: 'gamification.achievements.journeyLabel.care',
    plan: 'gamification.achievements.journeyLabel.plan',
};

/**
 * Achievements hub page displaying the user's gamification profile,
 * achievements grouped by journey, and quick links to leaderboard/quests/rewards.
 */
const AchievementsPage: React.FC = () => {
    const { t } = useTranslation();
    const userId = 'user-123'; // Replace with actual auth context
    const { data, loading, error } = useGameProfile(userId);

    if (loading) {
        return (
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="lg">{t('gamification.achievements.loading')}</Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="lg" color={colors.semantic.error}>
                    {t('gamification.achievements.error')}
                </Text>
            </div>
        );
    }

    const profile = data?.gameProfile;
    const achievements = profile?.achievements ?? [];

    const achievementsByJourney = achievements.reduce<Record<string, Achievement[]>>(
        (acc: Record<string, Achievement[]>, achievement: Achievement) => {
            const key = achievement.journey;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(achievement);
            return acc;
        },
        {}
    );

    const xpForNextLevel = (profile?.level ?? 1) * 1000;
    const activeQuestCount = profile?.quests?.filter((q: Quest) => !q.completed).length ?? 0;

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl }}>
            {/* Page header */}
            <Text fontSize="2xl" fontWeight="bold" style={{ marginBottom: spacing.lg }}>
                {t('gamification.achievements.title')}
            </Text>

            {/* Level and XP section */}
            <Card elevation="md" padding="lg" style={{ marginBottom: spacing['2xl'] }}>
                <Box display="flex" alignItems="center" style={{ gap: spacing.xl, flexWrap: 'wrap' }}>
                    <LevelIndicator
                        level={profile?.level ?? 1}
                        currentXp={profile?.xp ?? 0}
                        nextLevelXp={xpForNextLevel}
                        journey="health"
                    />
                    <Box>
                        <Text fontSize="lg" fontWeight="bold">
                            {t('gamification.level', { level: profile?.level ?? 1 })}
                        </Text>
                        <XPCounter currentXP={profile?.xp ?? 0} nextLevelXP={xpForNextLevel} journey="health" />
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                            {t('gamification.achievements.xpToNext', { value: xpForNextLevel - (profile?.xp ?? 0) })}
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
                            {t('gamification.leaderboard.title')}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('gamification.leaderboard.subtitle')}
                        </Text>
                    </Card>
                </Link>
                <Link href="/achievements/quests" passHref>
                    <Card
                        padding="md"
                        style={{ flex: 1, minWidth: '200px', cursor: 'pointer', textDecoration: 'none' }}
                    >
                        <Text fontWeight="bold" fontSize="md">
                            {t('gamification.quests.title')}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('gamification.quests.activeCount', { count: activeQuestCount })}
                        </Text>
                    </Card>
                </Link>
                <Link href="/achievements/rewards" passHref>
                    <Card
                        padding="md"
                        style={{ flex: 1, minWidth: '200px', cursor: 'pointer', textDecoration: 'none' }}
                    >
                        <Text fontWeight="bold" fontSize="md">
                            {t('gamification.rewards.title')}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('gamification.rewards.subtitle')}
                        </Text>
                    </Card>
                </Link>
            </Box>

            {/* Achievements by journey */}
            {Object.entries(achievementsByJourney).map(([journey, journeyAchievements]) => (
                <div key={journey} style={{ marginBottom: spacing['2xl'] }}>
                    <Text fontWeight="bold" fontSize="xl" style={{ marginBottom: spacing.md }}>
                        {t(JOURNEY_LABEL_KEYS[journey] ?? journey)} {t('gamification.achievements.title')}
                    </Text>
                    <Box display="flex" style={{ gap: spacing.md, flexWrap: 'wrap' }}>
                        {journeyAchievements.map((achievement: Achievement) => (
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
                        {t('gamification.achievements.empty')}
                    </Text>
                </Card>
            )}
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default AchievementsPage;
