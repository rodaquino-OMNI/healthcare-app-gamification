import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizingValues } from '@design-system/tokens/sizing';
import { spacingValues } from '@design-system/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Reward } from '@shared/types/gamification.types';
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import type { GamificationStackParamList } from '../../navigation/types';

type JourneyFilter = 'all' | 'health' | 'care' | 'plan';
type SortOption = 'low-high' | 'high-low' | 'popular';

const JOURNEY_TABS: { key: JourneyFilter; labelKey: string }[] = [
    { key: 'all', labelKey: 'gamification.rewards.filterAll' },
    { key: 'health', labelKey: 'gamification.rewards.filterHealth' },
    { key: 'care', labelKey: 'gamification.rewards.filterCare' },
    { key: 'plan', labelKey: 'gamification.rewards.filterPlan' },
];

const SORT_OPTIONS: { key: SortOption; labelKey: string }[] = [
    { key: 'low-high', labelKey: 'gamification.rewards.sortLowHigh' },
    { key: 'high-low', labelKey: 'gamification.rewards.sortHighLow' },
    { key: 'popular', labelKey: 'gamification.rewards.sortPopular' },
];

/** Mock reward data for development and immediate rendering. */
const MOCK_REWARDS: Reward[] = [
    {
        id: 'r-001',
        title: 'Priority Scheduling',
        description: 'Priority access for your next appointment',
        journey: 'care',
        icon: '\u{1F4C5}',
        xp: 500,
    },
    {
        id: 'r-002',
        title: 'Health Report',
        description: 'Detailed monthly health insights report',
        journey: 'health',
        icon: '\u{1F4CA}',
        xp: 300,
    },
    {
        id: 'r-003',
        title: 'Plan Upgrade',
        description: 'One month premium plan features',
        journey: 'plan',
        icon: '\u{1F31F}',
        xp: 1000,
    },
    {
        id: 'r-004',
        title: 'Wellness Kit',
        description: 'Digital wellness resource pack',
        journey: 'health',
        icon: '\u{1F381}',
        xp: 750,
    },
    {
        id: 'r-005',
        title: 'Telehealth Credit',
        description: 'Credit for your next telemedicine visit',
        journey: 'care',
        icon: '\u{1F4F1}',
        xp: 600,
    },
    {
        id: 'r-006',
        title: 'Copay Discount',
        description: 'Discount on your next copayment',
        journey: 'plan',
        icon: '\u{1F4B0}',
        xp: 800,
    },
    {
        id: 'r-007',
        title: 'Fitness Badge',
        description: 'Exclusive digital badge for your profile',
        journey: 'health',
        icon: '\u{1F3C5}',
        xp: 150,
    },
    {
        id: 'r-008',
        title: 'Care Package',
        description: 'Personalized care recommendations',
        journey: 'care',
        icon: '\u{1F49D}',
        xp: 400,
    },
    {
        id: 'r-009',
        title: 'Custom Avatar',
        description: 'Special avatar frame for your profile',
        journey: 'health',
        icon: '\u{1F464}',
        xp: 200,
    },
    {
        id: 'r-010',
        title: 'Benefits Guide',
        description: 'Plan benefits optimization guide',
        journey: 'plan',
        icon: '\u{1F4D6}',
        xp: 350,
    },
];

const MOCK_USER_XP = 1250;
const MOCK_USER_LEVEL = 5;
const MOCK_XP_NEXT_LEVEL = 1500;

const JOURNEY_COLORS: Record<string, string> = {
    health: colors.journeys.health.primary,
    care: colors.journeys.care.primary,
    plan: colors.journeys.plan.primary,
};
const getJourneyColor = (journey: string): string => JOURNEY_COLORS[journey] || colors.brand.primary;

const POPULARITY: Record<string, number> = {
    'r-003': 95,
    'r-006': 88,
    'r-001': 82,
    'r-005': 78,
    'r-004': 70,
    'r-002': 65,
    'r-008': 60,
    'r-010': 50,
    'r-009': 45,
    'r-007': 40,
};

/**
 * RewardCatalog screen displays all available rewards in a 2-column grid
 * with journey filters, sort options, and search functionality.
 */
const RewardCatalog: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<GamificationStackParamList>>();
    const { theme } = useTheme();
    const styles = createStyles(theme as Theme);
    const [journeyFilter, setJourneyFilter] = useState<JourneyFilter>('all');
    const [sortOption, setSortOption] = useState<SortOption>('popular');
    const [searchQuery, setSearchQuery] = useState('');

    const userXP = MOCK_USER_XP;
    const levelProgress = userXP / MOCK_XP_NEXT_LEVEL;

    const filteredRewards = useMemo(() => {
        let result = [...MOCK_REWARDS];

        if (journeyFilter !== 'all') {
            result = result.filter((r) => r.journey === journeyFilter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (r) => r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query)
            );
        }

        switch (sortOption) {
            case 'low-high':
                result.sort((a, b) => a.xp - b.xp);
                break;
            case 'high-low':
                result.sort((a, b) => b.xp - a.xp);
                break;
            case 'popular':
                result.sort((a, b) => (POPULARITY[b.id] || 0) - (POPULARITY[a.id] || 0));
                break;
        }

        return result;
    }, [journeyFilter, sortOption, searchQuery]);

    const handleRewardPress = useCallback(
        (rewardId: string) => {
            navigation.navigate('GamificationRewardDetail', { rewardId });
        },
        [navigation]
    );

    const renderXPHeader = (): React.ReactElement | null => (
        <View style={styles.xpHeader}>
            <View style={styles.xpMain}>
                <Text style={styles.xpValue}>{userXP.toLocaleString()}</Text>
                <Text style={styles.xpLabel}>{t('gamification.rewards.xpAvailable')}</Text>
            </View>
            <View style={styles.levelRow}>
                <Text style={styles.levelText}>{t('gamification.rewards.level', { level: MOCK_USER_LEVEL })}</Text>
                <View style={styles.levelBarBg}>
                    <View style={[styles.levelBarFill, { width: `${Math.min(levelProgress * 100, 100)}%` }]} />
                </View>
                <Text style={styles.levelText}>{t('gamification.rewards.level', { level: MOCK_USER_LEVEL + 1 })}</Text>
            </View>
            <Text style={styles.xpToNext}>
                {t('gamification.rewards.xpToNextLevel', { xp: MOCK_XP_NEXT_LEVEL - userXP })}
            </Text>
        </View>
    );

    const renderJourneyTabs = (): React.ReactElement | null => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
            contentContainerStyle={styles.tabsContent}
        >
            {JOURNEY_TABS.map((tab) => {
                const isActive = journeyFilter === tab.key;
                const tabColor = tab.key === 'all' ? colors.brand.primary : getJourneyColor(tab.key);
                return (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => setJourneyFilter(tab.key)}
                        style={[styles.tab, { borderColor: tabColor }, isActive && { backgroundColor: tabColor }]}
                        accessibilityLabel={t('gamification.rewards.filterBy', { label: t(tab.labelKey) })}
                        accessibilityState={{ selected: isActive }}
                    >
                        <Text style={[styles.tabText, { color: tabColor }, isActive && styles.tabTextActive]}>
                            {t(tab.labelKey)}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );

    const renderSortChips = (): React.ReactElement | null => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.sortContainer}
            contentContainerStyle={styles.sortContent}
        >
            {SORT_OPTIONS.map((option) => {
                const isActive = sortOption === option.key;
                return (
                    <TouchableOpacity
                        key={option.key}
                        onPress={() => setSortOption(option.key)}
                        style={[styles.sortChip, isActive && styles.sortChipActive]}
                        accessibilityLabel={t('gamification.rewards.sortBy', { label: t(option.labelKey) })}
                        accessibilityState={{ selected: isActive }}
                    >
                        <Text style={[styles.sortChipText, isActive && styles.sortChipTextActive]}>
                            {t(option.labelKey)}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );

    const renderRewardItem = ({ item }: { item: Reward }): React.ReactElement | null => {
        const journeyColor = getJourneyColor(item.journey);
        const canAfford = userXP >= item.xp;
        const deficit = item.xp - userXP;

        return (
            <TouchableOpacity
                testID="gamification-reward-card"
                onPress={() => handleRewardPress(item.id)}
                style={[styles.rewardCard, !canAfford && styles.rewardCardDisabled]}
                accessibilityLabel={
                    canAfford
                        ? t('gamification.rewards.rewardAccessibility', { title: item.title, xp: item.xp })
                        : t('gamification.rewards.rewardAccessibilityDeficit', {
                              title: item.title,
                              xp: item.xp,
                              deficit,
                          })
                }
                accessibilityHint={t('gamification.rewards.rewardHint')}
            >
                <View style={styles.rewardIconContainer}>
                    <Text style={styles.rewardIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.rewardTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <View
                    testID="gamification-reward-redeem"
                    style={[styles.rewardXPBadge, { backgroundColor: journeyColor + '20' }]}
                >
                    <Text style={[styles.rewardXPText, { color: journeyColor }]}>{item.xp} XP</Text>
                </View>
                <View style={styles.rewardJourneyRow}>
                    <View style={[styles.journeyDot, { backgroundColor: journeyColor }]} />
                    <Text style={styles.rewardJourneyText}>
                        {item.journey.charAt(0).toUpperCase() + item.journey.slice(1)}
                    </Text>
                </View>
                {!canAfford && (
                    <Text style={styles.deficitText}>{t('gamification.rewards.needMoreXP', { xp: deficit })}</Text>
                )}
            </TouchableOpacity>
        );
    };

    const renderEmptyState = (): React.ReactElement | null => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{'\u{1F50D}'}</Text>
            <Text style={styles.emptyTitle}>{t('gamification.rewards.emptyTitle')}</Text>
            <Text style={styles.emptySubtitle}>{t('gamification.rewards.emptySubtitle')}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerBar}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    accessibilityLabel={t('common.buttons.back')}
                >
                    <Text style={styles.backArrow}>{'\u2190'}</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>{t('gamification.rewards.screenTitle')}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <FlatList
                testID="gamification-reward-list"
                data={filteredRewards}
                keyExtractor={(item) => item.id}
                renderItem={renderRewardItem}
                numColumns={2}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <>
                        {renderXPHeader()}
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder={t('gamification.rewards.searchPlaceholder')}
                                placeholderTextColor={colors.neutral.gray500}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                accessibilityLabel={t('gamification.rewards.searchLabel')}
                            />
                        </View>
                        {renderJourneyTabs()}
                        {renderSortChips()}
                    </>
                }
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background.subtle },
        headerBar: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
            backgroundColor: colors.brand.primary,
        },
        backButton: {
            width: sizingValues.component.sm,
            height: sizingValues.component.sm,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backArrow: { fontSize: 20, color: theme.colors.text.onBrand, fontWeight: '600' },
        screenTitle: {
            flex: 1,
            fontSize: 20,
            fontWeight: '700',
            color: theme.colors.text.onBrand,
            textAlign: 'center',
        },
        headerSpacer: { width: sizingValues.component.sm },
        xpHeader: {
            backgroundColor: theme.colors.background.default,
            marginHorizontal: spacingValues.md,
            marginTop: spacingValues.md,
            borderRadius: borderRadiusValues.lg,
            padding: spacingValues.md,
            alignItems: 'center',
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
        },
        xpMain: { alignItems: 'center', marginBottom: spacingValues.sm },
        xpValue: { fontSize: 36, fontWeight: '700', color: colors.brand.primary },
        xpLabel: { fontSize: 14, color: theme.colors.text.muted, marginTop: spacingValues['4xs'] },
        levelRow: { flexDirection: 'row', alignItems: 'center', width: '100%', gap: spacingValues.xs },
        levelBarBg: {
            flex: 1,
            height: 8,
            backgroundColor: theme.colors.background.subtle,
            borderRadius: borderRadiusValues.full,
            overflow: 'hidden',
        },
        levelBarFill: { height: 8, backgroundColor: colors.brand.primary, borderRadius: borderRadiusValues.full },
        levelText: { fontSize: 11, fontWeight: '600', color: theme.colors.text.muted, minWidth: 44 },
        xpToNext: { fontSize: 12, color: theme.colors.text.muted, marginTop: spacingValues.xs },
        searchContainer: { paddingHorizontal: spacingValues.md, marginTop: spacingValues.md },
        searchInput: {
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.md,
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
            fontSize: 15,
            color: theme.colors.text.default,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
        },
        tabsContainer: { maxHeight: 48, marginTop: spacingValues.md },
        tabsContent: { paddingHorizontal: spacingValues.md, gap: spacingValues.xs, alignItems: 'center' },
        tab: {
            paddingVertical: spacingValues.xs,
            paddingHorizontal: spacingValues.lg,
            borderRadius: borderRadiusValues.full,
            borderWidth: 1,
            backgroundColor: 'transparent',
        },
        tabText: { fontSize: 14, fontWeight: '500' },
        tabTextActive: { color: theme.colors.text.onBrand },
        sortContainer: { maxHeight: 40, marginTop: spacingValues.sm, marginBottom: spacingValues.sm },
        sortContent: { paddingHorizontal: spacingValues.md, gap: spacingValues.xs, alignItems: 'center' },
        sortChip: {
            paddingVertical: spacingValues['3xs'],
            paddingHorizontal: spacingValues.sm,
            borderRadius: borderRadiusValues.full,
            backgroundColor: theme.colors.background.subtle,
        },
        sortChipActive: { backgroundColor: colors.neutral.gray700 },
        sortChipText: { fontSize: 12, fontWeight: '500', color: theme.colors.text.muted },
        sortChipTextActive: { color: theme.colors.text.onBrand },
        listContent: { paddingBottom: spacingValues['5xl'] },
        gridRow: { paddingHorizontal: spacingValues.md, gap: spacingValues.sm, marginBottom: spacingValues.sm },
        rewardCard: {
            flex: 1,
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.lg,
            padding: spacingValues.sm,
            alignItems: 'center',
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 2,
            elevation: 2,
        },
        rewardCardDisabled: { opacity: 0.55 },
        rewardIconContainer: {
            width: sizingValues.component.xl,
            height: sizingValues.component.xl,
            borderRadius: borderRadiusValues.lg,
            backgroundColor: theme.colors.background.subtle,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacingValues.xs,
        },
        rewardIcon: { fontSize: 28 },
        rewardTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text.default,
            textAlign: 'center',
            marginBottom: spacingValues.xs,
            minHeight: 36,
        },
        rewardXPBadge: {
            paddingVertical: spacingValues['4xs'],
            paddingHorizontal: spacingValues.xs,
            borderRadius: borderRadiusValues.full,
            marginBottom: spacingValues['3xs'],
        },
        rewardXPText: { fontSize: 12, fontWeight: '700' },
        rewardJourneyRow: { flexDirection: 'row', alignItems: 'center' },
        journeyDot: { width: 6, height: 6, borderRadius: 3, marginRight: spacingValues['4xs'] },
        rewardJourneyText: { fontSize: 11, color: theme.colors.text.muted },
        deficitText: { fontSize: 11, fontWeight: '500', color: colors.semantic.error, marginTop: spacingValues['3xs'] },
        emptyContainer: { paddingTop: spacingValues['5xl'], alignItems: 'center', gap: spacingValues.xs },
        emptyIcon: { fontSize: 48 },
        emptyTitle: { fontSize: 18, fontWeight: '600', color: theme.colors.text.default },
        emptySubtitle: {
            fontSize: 14,
            color: theme.colors.text.muted,
            textAlign: 'center',
            paddingHorizontal: spacingValues['2xl'],
        },
    });

export default RewardCatalog;
