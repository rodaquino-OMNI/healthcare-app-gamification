import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizingValues } from '@design-system/tokens/sizing';
import { spacingValues } from '@design-system/tokens/spacing';
import { fontSizeValues } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from 'styled-components/native';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TimeframeFilter = 'week' | 'month' | 'all';
type JourneyFilter = 'all' | 'health' | 'care' | 'plan';

interface LeaderboardEntry {
    id: string;
    rank: number;
    username: string;
    avatarInitials: string;
    xp: number;
    level: number;
    badgeCount: number;
    journey: string;
    isCurrentUser: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TIMEFRAME_TABS: { key: TimeframeFilter; labelKey: string }[] = [
    { key: 'week', labelKey: 'gamification.leaderboard.thisWeek' },
    { key: 'month', labelKey: 'gamification.leaderboard.thisMonth' },
    { key: 'all', labelKey: 'gamification.leaderboard.allTime' },
];

const JOURNEY_TABS: { key: JourneyFilter; labelKey: string }[] = [
    { key: 'all', labelKey: 'gamification.leaderboard.filterAll' },
    { key: 'health', labelKey: 'gamification.leaderboard.filterHealth' },
    { key: 'care', labelKey: 'gamification.leaderboard.filterCare' },
    { key: 'plan', labelKey: 'gamification.leaderboard.filterPlan' },
];

const PODIUM_COLORS = {
    1: colors.semantic.warning, // Gold
    2: colors.gray[30], // Silver
    3: colors.journeys.care.primary, // Bronze (warm orange)
};

/** Mock leaderboard entries. In production these come from the API. */
const MOCK_ENTRIES: LeaderboardEntry[] = [
    {
        id: 'u1',
        rank: 1,
        username: 'Maria Silva',
        avatarInitials: 'MS',
        xp: 12450,
        level: 15,
        badgeCount: 24,
        journey: 'health',
        isCurrentUser: false,
    },
    {
        id: 'u2',
        rank: 2,
        username: 'Joao Santos',
        avatarInitials: 'JS',
        xp: 11200,
        level: 14,
        badgeCount: 21,
        journey: 'care',
        isCurrentUser: false,
    },
    {
        id: 'u3',
        rank: 3,
        username: 'Ana Oliveira',
        avatarInitials: 'AO',
        xp: 10800,
        level: 13,
        badgeCount: 19,
        journey: 'health',
        isCurrentUser: false,
    },
    {
        id: 'u4',
        rank: 4,
        username: 'Carlos Souza',
        avatarInitials: 'CS',
        xp: 9750,
        level: 12,
        badgeCount: 17,
        journey: 'plan',
        isCurrentUser: false,
    },
    {
        id: 'u5',
        rank: 5,
        username: 'Lucia Pereira',
        avatarInitials: 'LP',
        xp: 9100,
        level: 11,
        badgeCount: 15,
        journey: 'health',
        isCurrentUser: false,
    },
    {
        id: 'u6',
        rank: 6,
        username: 'Pedro Costa',
        avatarInitials: 'PC',
        xp: 8500,
        level: 10,
        badgeCount: 14,
        journey: 'care',
        isCurrentUser: false,
    },
    {
        id: 'u7',
        rank: 7,
        username: 'Voce',
        avatarInitials: 'EU',
        xp: 7800,
        level: 9,
        badgeCount: 12,
        journey: 'health',
        isCurrentUser: true,
    },
    {
        id: 'u8',
        rank: 8,
        username: 'Fernanda Lima',
        avatarInitials: 'FL',
        xp: 7200,
        level: 9,
        badgeCount: 11,
        journey: 'plan',
        isCurrentUser: false,
    },
    {
        id: 'u9',
        rank: 9,
        username: 'Rafael Mendes',
        avatarInitials: 'RM',
        xp: 6900,
        level: 8,
        badgeCount: 10,
        journey: 'care',
        isCurrentUser: false,
    },
    {
        id: 'u10',
        rank: 10,
        username: 'Beatriz Alves',
        avatarInitials: 'BA',
        xp: 6400,
        level: 8,
        badgeCount: 9,
        journey: 'health',
        isCurrentUser: false,
    },
    {
        id: 'u11',
        rank: 11,
        username: 'Diego Rocha',
        avatarInitials: 'DR',
        xp: 5800,
        level: 7,
        badgeCount: 8,
        journey: 'plan',
        isCurrentUser: false,
    },
    {
        id: 'u12',
        rank: 12,
        username: 'Camila Dias',
        avatarInitials: 'CD',
        xp: 5200,
        level: 7,
        badgeCount: 7,
        journey: 'care',
        isCurrentUser: false,
    },
    {
        id: 'u13',
        rank: 13,
        username: 'Thiago Nunes',
        avatarInitials: 'TN',
        xp: 4600,
        level: 6,
        badgeCount: 6,
        journey: 'health',
        isCurrentUser: false,
    },
    {
        id: 'u14',
        rank: 14,
        username: 'Juliana Ribeiro',
        avatarInitials: 'JR',
        xp: 4100,
        level: 5,
        badgeCount: 5,
        journey: 'plan',
        isCurrentUser: false,
    },
    {
        id: 'u15',
        rank: 15,
        username: 'Bruno Martins',
        avatarInitials: 'BM',
        xp: 3500,
        level: 5,
        badgeCount: 4,
        journey: 'care',
        isCurrentUser: false,
    },
];

function getJourneyColor(journey: string): string {
    const key = journey.toLowerCase() as keyof typeof colors.journeys;
    return colors.journeys[key]?.primary ?? colors.brand.primary;
}

/** Leaderboard screen with top-3 podium, timeframe and journey filters. */
const LeaderboardScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const [timeframe, setTimeframe] = useState<TimeframeFilter>('week');
    const [journeyFilter, setJourneyFilter] = useState<JourneyFilter>('all');

    const filteredEntries = useMemo(() => {
        let entries = [...MOCK_ENTRIES];
        if (journeyFilter !== 'all') {
            entries = entries.filter((e) => e.journey === journeyFilter);
        }
        // Re-rank after filtering
        return entries.map((e, idx) => ({ ...e, rank: idx + 1 }));
    }, [journeyFilter]);

    const topThree = filteredEntries.slice(0, 3);
    const restEntries = filteredEntries.slice(3);

    const currentUser = filteredEntries.find((e) => e.isCurrentUser);

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    const renderTimeframeTab = (tab: { key: TimeframeFilter; labelKey: string }): React.ReactElement | null => {
        const isActive = timeframe === tab.key;
        return (
            <TouchableOpacity
                key={tab.key}
                style={[styles.timeframeTab, isActive && styles.timeframeTabActive]}
                onPress={() => setTimeframe(tab.key)}
                accessibilityRole="button"
                accessibilityLabel={t('gamification.leaderboard.period', { period: t(tab.labelKey) })}
                accessibilityState={{ selected: isActive }}
            >
                <Text style={[styles.timeframeText, isActive && styles.timeframeTextActive]}>{t(tab.labelKey)}</Text>
            </TouchableOpacity>
        );
    };

    const renderJourneyTab = (tab: { key: JourneyFilter; labelKey: string }): React.ReactElement | null => {
        const isActive = journeyFilter === tab.key;
        return (
            <TouchableOpacity
                key={tab.key}
                style={[styles.journeyTab, isActive && styles.journeyTabActive]}
                onPress={() => setJourneyFilter(tab.key)}
                accessibilityRole="button"
                accessibilityLabel={t('gamification.leaderboard.filterBy', { label: t(tab.labelKey) })}
                accessibilityState={{ selected: isActive }}
            >
                <Text style={[styles.journeyTabText, isActive && styles.journeyTabTextActive]}>{t(tab.labelKey)}</Text>
            </TouchableOpacity>
        );
    };

    const renderPodiumItem = (entry: LeaderboardEntry, position: number): React.ReactElement | null => {
        const medalColor = PODIUM_COLORS[position as keyof typeof PODIUM_COLORS] ?? colors.gray[30];
        const isFirst = position === 1;
        const avatarSize = isFirst ? 72 : 56;

        return (
            <View
                key={entry.id}
                style={[styles.podiumItem, isFirst && styles.podiumItemFirst]}
                accessibilityLabel={`${entry.rank} lugar: ${entry.username}, ${entry.xp.toLocaleString('pt-BR')} XP`}
            >
                {/* Medal circle */}
                <View
                    style={[
                        styles.podiumAvatar,
                        {
                            width: avatarSize,
                            height: avatarSize,
                            borderRadius: avatarSize / 2,
                            borderColor: medalColor,
                        },
                    ]}
                >
                    <Text style={[styles.podiumAvatarText, { fontSize: isFirst ? 22 : 18 }]}>
                        {entry.avatarInitials}
                    </Text>
                </View>
                <View style={[styles.rankBadge, { backgroundColor: medalColor }]}>
                    <Text style={styles.rankBadgeText}>{entry.rank}</Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>
                    {entry.username}
                </Text>
                <Text style={styles.podiumXP}>{entry.xp.toLocaleString('pt-BR')} XP</Text>
                <View style={styles.podiumBadges}>
                    <Text style={styles.podiumBadgeIcon}>{'🏅'}</Text>
                    <Text style={styles.podiumBadgeCount}>{entry.badgeCount}</Text>
                </View>
            </View>
        );
    };

    const renderListItem = ({ item }: { item: LeaderboardEntry }): React.ReactElement | null => {
        const journeyColor = getJourneyColor(item.journey);

        return (
            <View
                testID="gamification-leaderboard-item"
                style={[styles.listRow, item.isCurrentUser && styles.listRowHighlight]}
                accessibilityLabel={`${item.rank} lugar: ${item.username}, ${item.xp.toLocaleString('pt-BR')} XP`}
            >
                {/* Rank */}
                <Text testID="gamification-leaderboard-rank" style={styles.listRank}>
                    {item.rank}
                </Text>

                {/* Avatar */}
                <View style={[styles.listAvatar, { borderColor: journeyColor }]}>
                    <Text style={styles.listAvatarText}>{item.avatarInitials}</Text>
                </View>

                {/* Info */}
                <View style={styles.listInfo}>
                    <Text style={[styles.listName, item.isCurrentUser && styles.listNameHighlight]}>
                        {item.username}
                        {item.isCurrentUser ? ` (${t('gamification.leaderboard.you')})` : ''}
                    </Text>
                    <Text style={styles.listLevel}>{t('gamification.leaderboard.level', { level: item.level })}</Text>
                </View>

                {/* XP + Badges */}
                <View style={styles.listStats}>
                    <Text style={styles.listXP}>{item.xp.toLocaleString('pt-BR')} XP</Text>
                    <View style={styles.listBadgesRow}>
                        <Text style={styles.listBadgeIcon}>{'🏅'}</Text>
                        <Text style={styles.listBadgeCount}>{item.badgeCount}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderHeader = (): React.ReactElement | null => (
        <View>
            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={handleGoBack}
                    style={styles.backButton}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.buttons.back')}
                >
                    <Text style={styles.backButtonText}>
                        {'<'} {t('common.buttons.back')}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>{t('gamification.leaderboard.title')}</Text>
                <View style={styles.headerSpacer} />
            </View>
            <View style={styles.timeframeRow}>{TIMEFRAME_TABS.map(renderTimeframeTab)}</View>
            <View style={styles.journeyRow}>{JOURNEY_TABS.map(renderJourneyTab)}</View>
            {topThree.length >= 3 && (
                <View style={styles.podiumContainer}>
                    {renderPodiumItem(topThree[1], 2)}
                    {renderPodiumItem(topThree[0], 1)}
                    {renderPodiumItem(topThree[2], 3)}
                </View>
            )}
            {currentUser && currentUser.rank > 3 && (
                <View style={styles.currentUserBanner}>
                    <Text style={styles.currentUserText}>
                        {t('gamification.leaderboard.yourPosition', {
                            rank: currentUser.rank,
                            xp: currentUser.xp.toLocaleString('pt-BR'),
                        })}
                    </Text>
                </View>
            )}
            <View style={styles.listSectionHeader}>
                <Text style={styles.listSectionTitle}>{t('gamification.leaderboard.fullRanking')}</Text>
            </View>
        </View>
    );

    const renderEmpty = (): React.ReactElement | null => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{'🏆'}</Text>
            <Text style={styles.emptyTitle}>{t('gamification.leaderboard.emptyTitle')}</Text>
            <Text style={styles.emptySubtitle}>{t('gamification.leaderboard.emptySubtitle')}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                testID="gamification-leaderboard-list"
                data={restEntries}
                renderItem={renderListItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                accessibilityLabel={t('gamification.leaderboard.listLabel')}
            />
        </SafeAreaView>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background.default },
        listContent: { paddingBottom: spacingValues['4xl'] },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.default,
        },
        backButton: { paddingVertical: spacingValues.xs, paddingRight: spacingValues.md },
        backButtonText: { fontSize: fontSizeValues.md, fontWeight: '600', color: colors.brand.primary },
        screenTitle: { fontSize: fontSizeValues.lg, fontWeight: '700', color: theme.colors.text.default },
        headerSpacer: { width: 80 },
        timeframeRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.default,
        },
        timeframeTab: {
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.xs,
            borderRadius: borderRadiusValues.full,
            marginHorizontal: spacingValues['3xs'],
        },
        timeframeTabActive: { backgroundColor: colors.brand.primary },
        timeframeText: { fontSize: fontSizeValues.sm, fontWeight: '500', color: theme.colors.text.muted },
        timeframeTextActive: { color: theme.colors.text.onBrand, fontWeight: '600' },
        journeyRow: { flexDirection: 'row', paddingVertical: spacingValues.xs, paddingHorizontal: spacingValues.md },
        journeyTab: {
            paddingHorizontal: spacingValues.sm,
            paddingVertical: spacingValues['2xs'],
            borderRadius: borderRadiusValues.full,
            backgroundColor: theme.colors.background.subtle,
            marginRight: spacingValues.xs,
        },
        journeyTabActive: { backgroundColor: colors.brand.secondary },
        journeyTabText: { fontSize: fontSizeValues.xs, fontWeight: '500', color: theme.colors.text.muted },
        journeyTabTextActive: { color: theme.colors.text.onBrand, fontWeight: '600' },
        podiumContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingVertical: spacingValues.xl,
            paddingHorizontal: spacingValues.md,
        },
        podiumItem: { alignItems: 'center', flex: 1, paddingHorizontal: spacingValues['3xs'] },
        podiumItemFirst: { marginBottom: spacingValues.md },
        podiumAvatar: {
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background.muted,
            marginBottom: spacingValues['3xs'],
        },
        podiumAvatarText: { fontWeight: '700', color: theme.colors.text.default },
        rankBadge: {
            width: sizingValues.component.xs,
            height: sizingValues.component.xs,
            borderRadius: sizingValues.component.xs / 2,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -spacingValues.sm,
            marginBottom: spacingValues['3xs'],
        },
        rankBadgeText: { fontSize: fontSizeValues.xs, fontWeight: '700', color: theme.colors.text.onBrand },
        podiumName: {
            fontSize: fontSizeValues.xs,
            fontWeight: '600',
            color: theme.colors.text.default,
            textAlign: 'center',
            marginBottom: spacingValues['4xs'],
        },
        podiumXP: { fontSize: fontSizeValues.xs, color: theme.colors.text.muted, marginBottom: spacingValues['4xs'] },
        podiumBadges: { flexDirection: 'row', alignItems: 'center' },
        podiumBadgeIcon: { fontSize: 12, marginRight: spacingValues['4xs'] },
        podiumBadgeCount: { fontSize: 10, fontWeight: '600', color: theme.colors.text.muted },
        currentUserBanner: {
            backgroundColor: colors.brand.primary + '15',
            paddingVertical: spacingValues.xs,
            paddingHorizontal: spacingValues.md,
            marginHorizontal: spacingValues.md,
            borderRadius: borderRadiusValues.md,
            marginBottom: spacingValues.sm,
        },
        currentUserText: {
            fontSize: fontSizeValues.sm,
            fontWeight: '600',
            color: colors.brand.primary,
            textAlign: 'center',
        },
        listSectionHeader: {
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.xs,
            backgroundColor: theme.colors.background.muted,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme.colors.border.default,
        },
        listSectionTitle: {
            fontSize: fontSizeValues.xs,
            fontWeight: '600',
            color: theme.colors.text.muted,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        listRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.default,
        },
        listRowHighlight: { backgroundColor: colors.brand.primary + '10' },
        listRank: {
            fontSize: fontSizeValues.md,
            fontWeight: '700',
            color: theme.colors.text.muted,
            width: 28,
            textAlign: 'center',
        },
        listAvatar: {
            width: sizingValues.component.md,
            height: sizingValues.component.md,
            borderRadius: sizingValues.component.md / 2,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background.muted,
            marginLeft: spacingValues.xs,
        },
        listAvatarText: { fontSize: fontSizeValues.sm, fontWeight: '600', color: theme.colors.text.default },
        listInfo: { flex: 1, marginLeft: spacingValues.sm },
        listName: { fontSize: fontSizeValues.sm, fontWeight: '500', color: theme.colors.text.default },
        listNameHighlight: { fontWeight: '700', color: colors.brand.primary },
        listLevel: { fontSize: fontSizeValues.xs, color: theme.colors.text.subtle, marginTop: spacingValues['4xs'] },
        listStats: { alignItems: 'flex-end' },
        listXP: { fontSize: fontSizeValues.sm, fontWeight: '600', color: theme.colors.text.default },
        listBadgesRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacingValues['4xs'] },
        listBadgeIcon: { fontSize: 10, marginRight: spacingValues['4xs'] },
        listBadgeCount: { fontSize: 10, fontWeight: '600', color: theme.colors.text.muted },
        emptyContainer: { alignItems: 'center', paddingVertical: spacingValues['5xl'] },
        emptyIcon: { fontSize: 48, marginBottom: spacingValues.md },
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

export default LeaderboardScreen;
