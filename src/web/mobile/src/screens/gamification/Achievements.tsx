import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useGameProfile, useAchievements } from '../../hooks/useGamification';
import { Achievement } from '../../../../shared/types/gamification.types';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { sizingValues } from '../../../../design-system/src/tokens/sizing';

type JourneyFilter = 'all' | 'health' | 'care' | 'plan';

const FILTER_TABS: { key: JourneyFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'health', label: 'Saude' },
  { key: 'care', label: 'Cuidado' },
  { key: 'plan', label: 'Plano' },
];

const LEVEL_TITLES: { maxLevel: number; title: string }[] = [
  { maxLevel: 5, title: 'Iniciante' },
  { maxLevel: 10, title: 'Aventureiro' },
  { maxLevel: 15, title: 'Explorador' },
  { maxLevel: 20, title: 'Especialista' },
  { maxLevel: 25, title: 'Mestre' },
];

const XP_PER_LEVEL = 1000;
const NUM_COLUMNS = 3;

function getLevelTitle(level: number): string {
  for (const entry of LEVEL_TITLES) {
    if (level < entry.maxLevel) {
      return entry.title;
    }
  }
  return 'Lendario';
}

function getJourneyColor(journey: string): string {
  const journeyKey = journey.toLowerCase() as keyof typeof colors.journeys;
  return colors.journeys[journeyKey]?.primary ?? colors.brand.primary;
}

/** Achievements screen with level indicator, XP progress, and filterable grid. */
const AchievementsScreen: React.FC = () => {
  const navigation = useNavigation();
  const profile = useGameProfile();
  const achievements: Achievement[] | undefined = useAchievements();

  const [activeFilter, setActiveFilter] = useState<JourneyFilter>('all');

  const level = profile?.level ?? 1;
  const currentXP = profile?.xp ?? 0;
  const xpForNextLevel = level * XP_PER_LEVEL;
  const xpProgress = Math.min(currentXP / xpForNextLevel, 1);
  const levelTitle = getLevelTitle(level);

  const filteredAchievements = useMemo(() => {
    if (!achievements) return [];
    if (activeFilter === 'all') return achievements;
    return achievements.filter(
      (a) => a.journey.toLowerCase() === activeFilter,
    );
  }, [achievements, activeFilter]);

  const unlockedCount = useMemo(() => {
    return (achievements ?? []).filter((a) => a.unlocked).length;
  }, [achievements]);

  const totalCount = achievements?.length ?? 0;

  const handleAchievementPress = (item: Achievement) => {
    navigation.navigate('GamificationAchievementDetail' as never, {
      achievementId: item.id,
    } as never);
  };

  const handleLeaderboardPress = () => {
    navigation.navigate('GamificationLeaderboard' as never);
  };

  const handleQuestsPress = () => {
    navigation.navigate('GamificationQuests' as never);
  };

  const handleRewardsPress = () => {
    navigation.navigate('GamificationRewards' as never);
  };

  const renderFilterTab = (tab: { key: JourneyFilter; label: string }) => {
    const isActive = activeFilter === tab.key;
    return (
      <TouchableOpacity
        key={tab.key}
        style={[styles.filterTab, isActive && styles.filterTabActive]}
        onPress={() => setActiveFilter(tab.key)}
        accessibilityRole="button"
        accessibilityLabel={`Filtrar por ${tab.label}`}
        accessibilityState={{ selected: isActive }}
      >
        <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAchievementItem = ({ item }: { item: Achievement }) => {
    const journeyColor = getJourneyColor(item.journey);
    const progressPercent = item.total > 0 ? item.progress / item.total : 0;

    return (
      <TouchableOpacity
        style={[styles.achievementCard, !item.unlocked && styles.achievementCardLocked]}
        onPress={() => handleAchievementPress(item)}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.unlocked ? 'Desbloqueado' : `${item.progress} de ${item.total}`}`}
      >
        <View
          style={[
            styles.achievementIcon,
            { borderColor: item.unlocked ? journeyColor : colors.gray[20] },
          ]}
        >
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

  const renderHeader = () => (
    <View>
      {/* Level Indicator */}
      <View style={styles.levelSection}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>
        <View style={styles.levelInfo}>
          <Text style={styles.levelTitle}>{levelTitle}</Text>
          <Text style={styles.levelSubtitle}>Nivel {level}</Text>
        </View>
      </View>

      {/* XP Progress */}
      <View style={styles.xpSection}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpLabel}>Experiencia</Text>
          <Text style={styles.xpValue}>
            {currentXP.toLocaleString('pt-BR')} / {xpForNextLevel.toLocaleString('pt-BR')} XP
          </Text>
        </View>
        <View style={styles.xpBarTrack}>
          <View
            style={[
              styles.xpBarFill,
              { width: `${Math.round(xpProgress * 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.xpNextLevel}>
          {(xpForNextLevel - currentXP).toLocaleString('pt-BR')} XP para o proximo nivel
        </Text>
      </View>

      {/* Unlocked Count */}
      <View style={styles.unlockedBadge}>
        <Text style={styles.unlockedBadgeText}>
          {unlockedCount} de {totalCount} desbloqueados
        </Text>
      </View>

      {/* Quick nav buttons */}
      <View style={styles.quickNav}>
        <TouchableOpacity
          style={styles.quickNavButton}
          onPress={handleLeaderboardPress}
          accessibilityRole="button"
          accessibilityLabel="Ver ranking"
        >
          <Text style={styles.quickNavIcon}>{'🏆'}</Text>
          <Text style={styles.quickNavLabel}>Ranking</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickNavButton}
          onPress={handleQuestsPress}
          accessibilityRole="button"
          accessibilityLabel="Ver missoes"
        >
          <Text style={styles.quickNavIcon}>{'⚔️'}</Text>
          <Text style={styles.quickNavLabel}>Missoes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickNavButton}
          onPress={handleRewardsPress}
          accessibilityRole="button"
          accessibilityLabel="Ver recompensas"
        >
          <Text style={styles.quickNavIcon}>{'🎁'}</Text>
          <Text style={styles.quickNavLabel}>Recompensas</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>{FILTER_TABS.map(renderFilterTab)}</View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>{'🏅'}</Text>
      <Text style={styles.emptyTitle}>Nenhuma conquista encontrada</Text>
      <Text style={styles.emptySubtitle}>
        {activeFilter === 'all'
          ? 'Complete atividades para desbloquear conquistas.'
          : `Nenhuma conquista na jornada "${FILTER_TABS.find((t) => t.key === activeFilter)?.label ?? activeFilter}".`}
      </Text>
    </View>
  );

  if (!achievements && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando conquistas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredAchievements}
        renderItem={renderAchievementItem}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Lista de conquistas"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.white },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: fontSizeValues.md, color: colors.gray[50] },
  listContent: { paddingHorizontal: spacingValues.md, paddingBottom: spacingValues['4xl'] },
  columnWrapper: { justifyContent: 'space-between', marginBottom: spacingValues.sm },
  levelSection: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacingValues.xl, paddingHorizontal: spacingValues.xs },
  levelBadge: { width: sizingValues.component.xl, height: sizingValues.component.xl, borderRadius: sizingValues.component.xl / 2, backgroundColor: colors.brand.primary, justifyContent: 'center', alignItems: 'center' },
  levelNumber: { fontSize: fontSizeValues['2xl'], fontWeight: '700', color: colors.neutral.white },
  levelInfo: { marginLeft: spacingValues.md, flex: 1 },
  levelTitle: { fontSize: fontSizeValues.xl, fontWeight: '700', color: colors.neutral.gray900 },
  levelSubtitle: { fontSize: fontSizeValues.sm, color: colors.gray[50], marginTop: spacingValues['4xs'] },
  xpSection: { paddingHorizontal: spacingValues.xs, marginBottom: spacingValues.md },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacingValues.xs },
  xpLabel: { fontSize: fontSizeValues.sm, fontWeight: '600', color: colors.neutral.gray900 },
  xpValue: { fontSize: fontSizeValues.sm, color: colors.gray[50] },
  xpBarTrack: { height: 8, backgroundColor: colors.gray[10], borderRadius: borderRadiusValues.sm, overflow: 'hidden' },
  xpBarFill: { height: 8, backgroundColor: colors.brand.primary, borderRadius: borderRadiusValues.sm },
  xpNextLevel: { fontSize: fontSizeValues.xs, color: colors.gray[40], marginTop: spacingValues['3xs'], textAlign: 'right' },
  unlockedBadge: { alignSelf: 'flex-start', backgroundColor: colors.semantic.successBg, borderRadius: borderRadiusValues.full, paddingHorizontal: spacingValues.sm, paddingVertical: spacingValues['3xs'], marginLeft: spacingValues.xs, marginBottom: spacingValues.md },
  unlockedBadgeText: { fontSize: fontSizeValues.xs, fontWeight: '600', color: colors.semantic.success },
  quickNav: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacingValues.md, marginBottom: spacingValues.xs, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.gray[10] },
  quickNavButton: { alignItems: 'center', paddingHorizontal: spacingValues.md },
  quickNavIcon: { fontSize: fontSizeValues['2xl'], marginBottom: spacingValues['3xs'] },
  quickNavLabel: { fontSize: fontSizeValues.xs, fontWeight: '600', color: colors.gray[60] },
  filterRow: { flexDirection: 'row', paddingVertical: spacingValues.sm, marginBottom: spacingValues.sm },
  filterTab: { paddingHorizontal: spacingValues.md, paddingVertical: spacingValues.xs, borderRadius: borderRadiusValues.full, backgroundColor: colors.gray[10], marginRight: spacingValues.xs },
  filterTabActive: { backgroundColor: colors.brand.primary },
  filterTabText: { fontSize: fontSizeValues.sm, fontWeight: '500', color: colors.gray[50] },
  filterTabTextActive: { color: colors.neutral.white },
  achievementCard: { flex: 1, maxWidth: '31%', alignItems: 'center', backgroundColor: colors.gray[5], borderRadius: borderRadiusValues.lg, padding: spacingValues.sm, marginHorizontal: spacingValues['4xs'] },
  achievementCardLocked: { opacity: 0.55 },
  achievementIcon: { width: sizingValues.component.lg, height: sizingValues.component.lg, borderRadius: sizingValues.component.lg / 2, borderWidth: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.neutral.white, marginBottom: spacingValues.xs },
  achievementIconText: { fontSize: fontSizeValues.xl },
  achievementTitle: { fontSize: fontSizeValues.xs, fontWeight: '600', color: colors.neutral.gray900, textAlign: 'center', marginBottom: spacingValues['3xs'], minHeight: fontSizeValues.xs * 2.5 },
  achievementProgressContainer: { width: '100%', alignItems: 'center' },
  achievementProgressTrack: { width: '100%', height: 4, backgroundColor: colors.gray[20], borderRadius: borderRadiusValues.xs, overflow: 'hidden', marginBottom: spacingValues['4xs'] },
  achievementProgressFill: { height: 4, borderRadius: borderRadiusValues.xs },
  achievementProgressText: { fontSize: 10, color: colors.gray[40] },
  emptyContainer: { alignItems: 'center', paddingVertical: spacingValues['5xl'] },
  emptyIcon: { fontSize: 48, marginBottom: spacingValues.md },
  emptyTitle: { fontSize: fontSizeValues.lg, fontWeight: '600', color: colors.neutral.gray900, marginBottom: spacingValues.xs },
  emptySubtitle: { fontSize: fontSizeValues.sm, color: colors.gray[50], textAlign: 'center', paddingHorizontal: spacingValues['2xl'] },
});

export default AchievementsScreen;
