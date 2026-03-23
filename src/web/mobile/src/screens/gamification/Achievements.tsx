import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizingValues } from '@design-system/tokens/sizing';
import { spacingValues } from '@design-system/tokens/spacing';
import { fontSizeValues } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import { Achievement } from '@shared/types/gamification.types';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

import { useGameProfile, useAchievements } from '../../hooks/useGamification';
import { useTheme } from '../../hooks/useTheme';
import type { GamificationNavigationProp } from '../../navigation/types';
import { haptic } from '../../utils/haptics';

type JourneyFilter = 'all' | 'health' | 'care' | 'plan';

const FILTER_TABS: { key: JourneyFilter; labelKey: string }[] = [
    { key: 'all', labelKey: 'gamification.achievements.filterAll' },
    { key: 'health', labelKey: 'gamification.achievements.filterHealth' },
    { key: 'care', labelKey: 'gamification.achievements.filterCare' },
    { key: 'plan', labelKey: 'gamification.achievements.filterPlan' },
];

const LEVEL_TITLES: { maxLevel: number; titleKey: string }[] = [
    { maxLevel: 5, titleKey: 'gamification.achievements.levelBeginner' },
    { maxLevel: 10, titleKey: 'gamification.achievements.levelAdventurer' },
    { maxLevel: 15, titleKey: 'gamification.achievements.levelExplorer' },
    { maxLevel: 20, titleKey: 'gamification.achievements.levelSpecialist' },
    { maxLevel: 25, titleKey: 'gamification.achievements.levelMaster' },
];

const XP_PER_LEVEL = 1000;
const NUM_COLUMNS = 3;

function getLevelTitleKey(level: number): string {
    for (const entry of LEVEL_TITLES) {
        if (level < entry.maxLevel) {
            return entry.titleKey;
        }
    }
    return 'gamification.achievements.levelLegendary';
}

function getJourneyColor(journey: string): string {
    const journeyKey = journey.toLowerCase() as keyof typeof colors.journeys;
    return colors.journeys[journeyKey]?.primary ?? colors.brand.primary;
}

/** Achievements screen with level indicator, XP progress, and filterable grid. */
const AchievementsScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<GamificationNavigationProp>();
    const { theme } = useTheme();
    const styles = createStyles(theme as Theme);
    const profile = useGameProfile();
    const achievements: Achievement[] | undefined = useAchievements();

    const [activeFilter, setActiveFilter] = useState<JourneyFilter>('all');

    const level = profile?.level ?? 1;
    const currentXP = profile?.xp ?? 0;
    const xpForNextLevel = level * XP_PER_LEVEL;
    const xpProgress = Math.min(currentXP / xpForNextLevel, 1);
    const levelTitle = t(getLevelTitleKey(level));

    const filteredAchievements = useMemo(() => {
        if (!achievements) {
            return [];
        }
        if (activeFilter === 'all') {
            return achievements;
        }
        return achievements.filter((a) => a.journey.toLowerCase() === activeFilter);
    }, [achievements, activeFilter]);

    const unlockedCount = useMemo(() => {
        return (achievements ?? []).filter((a) => a.unlocked).length;
    }, [achievements]);

    const totalCount = achievements?.length ?? 0;

    const handleAchievementPress = (item: Achievement): void => {
        if (item.unlocked) {
            void haptic.success();
        } else {
            void haptic.selection();
        }
        navigation.navigate('GamificationAchievementDetail', {
            achievementId: item.id,
        });
    };

    const handleLeaderboardPress = (): void => {
        navigation.navigate('GamificationLeaderboard');
    };

    const handleQuestsPress = (): void => {
        navigation.navigate('GamificationQuests');
    };

    const handleRewardsPress = (): void => {
        navigation.navigate('GamificationRewards');
    };

    const renderFilterTab = (tab: { key: JourneyFilter; labelKey: string }): React.ReactElement | null => {
        const isActive = activeFilter === tab.key;
        return (
            <TouchableOpacity
                key={tab.key}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => setActiveFilter(tab.key)}
                accessibilityRole="button"
                accessibilityLabel={t('gamification.achievements.filterBy', { label: t(tab.labelKey) })}
                accessibilityState={{ selected: isActive }}
            >
                <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>{t(tab.labelKey)}</Text>
            </TouchableOpacity>
        );
    };

    const renderAchievementItem = ({ item }: { item: Achievement }): React.ReactElement | null => {
        const journeyColor = getJourneyColor(item.journey);
        const progressPercent = item.total > 0 ? item.progress / item.total : 0;

        return (
            <TouchableOpacity
                testID="gamification-achievement-card"
                style={[styles.achievementCard, !item.unlocked && styles.achievementCardLocked]}
                onPress={() => handleAchievementPress(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}, ${item.unlocked ? t('gamification.achievements.unlocked') : `${item.progress} / ${item.total}`}`}
            >
                <View style={[styles.achievementIcon, { borderColor: item.unlocked ? journeyColor : colors.gray[20] }]}>
                    <Text style={styles.achievementIconText}>{item.icon}</Text>
                </View>
                <Text style={styles.achievementTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                {/* Progress indicator */}
                <View style={styles.achievementProgressContainer}>
                    <View style={styles.achievementProgressTrack}>
                        <View
                            style={[
                                styles.achievementProgressFill,
                                {
                                    width: `${Math.round(progressPercent * 100)}%`,
                                    backgroundColor: item.unlocked ? journeyColor : colors.gray[30],
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.achievementProgressText}>
                        {item.progress}/{item.total}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderHeader = (): React.ReactElement | null => (
        <View>
            {/* Level Indicator */}
            <View style={styles.levelSection}>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelNumber}>{level}</Text>
                </View>
                <View style={styles.levelInfo}>
                    <Text style={styles.levelTitle}>{levelTitle}</Text>
                    <Text style={styles.levelSubtitle}>{t('gamification.achievements.level', { level })}</Text>
                </View>
            </View>

            {/* XP Progress */}
            <View style={styles.xpSection}>
                <View style={styles.xpHeader}>
                    <Text style={styles.xpLabel}>{t('gamification.achievements.experience')}</Text>
                    <Text style={styles.xpValue}>
                        {currentXP.toLocaleString('pt-BR')} / {xpForNextLevel.toLocaleString('pt-BR')} XP
                    </Text>
                </View>
                <View style={styles.xpBarTrack}>
                    <View style={[styles.xpBarFill, { width: `${Math.round(xpProgress * 100)}%` }]} />
                </View>
                <Text style={styles.xpNextLevel}>
                    {t('gamification.achievements.xpToNextLevel', {
                        xp: (xpForNextLevel - currentXP).toLocaleString('pt-BR'),
                    })}
                </Text>
            </View>

            {/* Unlocked Count */}
            <View style={styles.unlockedBadge}>
                <Text style={styles.unlockedBadgeText}>
                    {t('gamification.achievements.unlockedCount', { unlocked: unlockedCount, total: totalCount })}
                </Text>
            </View>

            {/* Quick nav buttons */}
            <View style={styles.quickNav}>
                <TouchableOpacity
                    testID="gamification-tab-leaderboard"
                    style={styles.quickNavButton}
                    onPress={handleLeaderboardPress}
                    accessibilityRole="button"
                    accessibilityLabel={t('gamification.achievements.viewRanking')}
                >
                    <Text style={styles.quickNavIcon}>{'🏆'}</Text>
                    <Text style={styles.quickNavLabel}>{t('gamification.achievements.ranking')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    testID="gamification-tab-quests"
                    style={styles.quickNavButton}
                    onPress={handleQuestsPress}
                    accessibilityRole="button"
                    accessibilityLabel={t('gamification.achievements.viewQuests')}
                >
                    <Text style={styles.quickNavIcon}>{'⚔️'}</Text>
                    <Text style={styles.quickNavLabel}>{t('gamification.achievements.quests')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    testID="gamification-tab-rewards"
                    style={styles.quickNavButton}
                    onPress={handleRewardsPress}
                    accessibilityRole="button"
                    accessibilityLabel={t('gamification.achievements.viewRewards')}
                >
                    <Text style={styles.quickNavIcon}>{'🎁'}</Text>
                    <Text style={styles.quickNavLabel}>{t('gamification.achievements.rewards')}</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterRow}>{FILTER_TABS.map(renderFilterTab)}</View>
        </View>
    );

    const renderEmpty = (): React.ReactElement | null => (
        <View style={styles.emptyContainer}>
            <Image
                source={require('@austa/design-system/assets/illustrations/achievements/achievements-01.png')}
                style={{ width: 120, height: 120, marginBottom: spacingValues.md }}
                resizeMode="contain"
                accessibilityLabel={t('gamification.achievements.emptyTitle')}
            />
            <Text style={styles.emptyTitle}>{t('gamification.achievements.emptyTitle')}</Text>
            <Text style={styles.emptySubtitle}>
                {activeFilter === 'all'
                    ? t('gamification.achievements.emptySubtitleAll')
                    : t('gamification.achievements.emptySubtitleFiltered', {
                          journey: t(FILTER_TABS.find((f) => f.key === activeFilter)?.labelKey ?? ''),
                      })}
            </Text>
        </View>
    );

    if (!achievements && !profile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>{t('gamification.achievements.loading')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                testID="gamification-achievements-list"
                data={filteredAchievements}
                renderItem={renderAchievementItem}
                keyExtractor={(item) => item.id}
                numColumns={NUM_COLUMNS}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                accessibilityLabel={t('gamification.achievements.listLabel')}
            />
        </SafeAreaView>
    );
};

const createStyles = (theme: Theme): ReturnType<typeof StyleSheet.create> =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background.default },
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        loadingText: { fontSize: fontSizeValues.md, color: theme.colors.text.muted },
        listContent: { paddingHorizontal: spacingValues.md, paddingBottom: spacingValues['4xl'] },
        columnWrapper: { justifyContent: 'space-between', marginBottom: spacingValues.sm },
        levelSection: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacingValues.xl,
            paddingHorizontal: spacingValues.xs,
        },
        levelBadge: {
            width: sizingValues.component.xl,
            height: sizingValues.component.xl,
            borderRadius: sizingValues.component.xl / 2,
            backgroundColor: colors.brand.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        levelNumber: { fontSize: fontSizeValues['2xl'], fontWeight: '700', color: theme.colors.text.onBrand },
        levelInfo: { marginLeft: spacingValues.md, flex: 1 },
        levelTitle: { fontSize: fontSizeValues.xl, fontWeight: '700', color: theme.colors.text.default },
        levelSubtitle: { fontSize: fontSizeValues.sm, color: theme.colors.text.muted, marginTop: spacingValues['4xs'] },
        xpSection: { paddingHorizontal: spacingValues.xs, marginBottom: spacingValues.md },
        xpHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacingValues.xs,
        },
        xpLabel: { fontSize: fontSizeValues.sm, fontWeight: '600', color: theme.colors.text.default },
        xpValue: { fontSize: fontSizeValues.sm, color: theme.colors.text.muted },
        xpBarTrack: {
            height: 8,
            backgroundColor: theme.colors.background.subtle,
            borderRadius: borderRadiusValues.sm,
            overflow: 'hidden',
        },
        xpBarFill: { height: 8, backgroundColor: colors.brand.primary, borderRadius: borderRadiusValues.sm },
        xpNextLevel: {
            fontSize: fontSizeValues.xs,
            color: theme.colors.text.subtle,
            marginTop: spacingValues['3xs'],
            textAlign: 'right',
        },
        unlockedBadge: {
            alignSelf: 'flex-start',
            backgroundColor: colors.semantic.successBg,
            borderRadius: borderRadiusValues.full,
            paddingHorizontal: spacingValues.sm,
            paddingVertical: spacingValues['3xs'],
            marginLeft: spacingValues.xs,
            marginBottom: spacingValues.md,
        },
        unlockedBadgeText: { fontSize: fontSizeValues.xs, fontWeight: '600', color: colors.semantic.success },
        quickNav: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: spacingValues.md,
            marginBottom: spacingValues.xs,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme.colors.border.default,
        },
        quickNavButton: { alignItems: 'center', paddingHorizontal: spacingValues.md },
        quickNavIcon: { fontSize: fontSizeValues['2xl'], marginBottom: spacingValues['3xs'] },
        quickNavLabel: { fontSize: fontSizeValues.xs, fontWeight: '600', color: theme.colors.text.default },
        filterRow: { flexDirection: 'row', paddingVertical: spacingValues.sm, marginBottom: spacingValues.sm },
        filterTab: {
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.xs,
            borderRadius: borderRadiusValues.full,
            backgroundColor: theme.colors.background.subtle,
            marginRight: spacingValues.xs,
        },
        filterTabActive: { backgroundColor: colors.brand.primary },
        filterTabText: { fontSize: fontSizeValues.sm, fontWeight: '500', color: theme.colors.text.muted },
        filterTabTextActive: { color: theme.colors.text.onBrand },
        achievementCard: {
            flex: 1,
            maxWidth: '31%',
            alignItems: 'center',
            backgroundColor: theme.colors.background.muted,
            borderRadius: borderRadiusValues.lg,
            padding: spacingValues.sm,
            marginHorizontal: spacingValues['4xs'],
        },
        achievementCardLocked: { opacity: 0.55 },
        achievementIcon: {
            width: sizingValues.component.lg,
            height: sizingValues.component.lg,
            borderRadius: sizingValues.component.lg / 2,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background.default,
            marginBottom: spacingValues.xs,
        },
        achievementIconText: { fontSize: fontSizeValues.xl },
        achievementTitle: {
            fontSize: fontSizeValues.xs,
            fontWeight: '600',
            color: theme.colors.text.default,
            textAlign: 'center',
            marginBottom: spacingValues['3xs'],
            minHeight: fontSizeValues.xs * 2.5,
        },
        achievementProgressContainer: { width: '100%', alignItems: 'center' },
        achievementProgressTrack: {
            width: '100%',
            height: 4,
            backgroundColor: theme.colors.border.default,
            borderRadius: borderRadiusValues.xs,
            overflow: 'hidden',
            marginBottom: spacingValues['4xs'],
        },
        achievementProgressFill: { height: 4, borderRadius: borderRadiusValues.xs },
        achievementProgressText: { fontSize: 10, color: theme.colors.text.subtle },
        emptyContainer: { alignItems: 'center', paddingVertical: spacingValues['5xl'] },
        emptyIllustration: { width: 120, height: 120, marginBottom: spacingValues.md },
        emptyTitle: {
            fontSize: fontSizeValues.lg,
            fontWeight: '600',
            color: theme.colors.text.default,
            marginBottom: spacingValues.xs,
        },
        emptySubtitle: {
            fontSize: fontSizeValues.sm,
            color: theme.colors.text.muted,
            textAlign: 'center',
            paddingHorizontal: spacingValues['2xl'],
        },
    });

export default AchievementsScreen;
