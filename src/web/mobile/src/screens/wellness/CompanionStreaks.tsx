import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { sizingValues } from '@design-system/tokens/sizing';
import type { WellnessNavigationProp } from '../../navigation/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Milestone {
  id: string;
  days: number;
  labelKey: string;
  icon: string;
  unlocked: boolean;
}

interface Reward {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  earnedDate: string;
}

type ActivityLevel = 0 | 1 | 2 | 3;

interface HeatMapDay {
  day: number;
  level: ActivityLevel;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const CURRENT_STREAK = 23;
const LONGEST_STREAK = 45;

const MOCK_MILESTONES: Milestone[] = [
  { id: 'ms-1', days: 7, labelKey: 'journeys.health.wellness.streaks.milestones.week', icon: '\u{1F31F}', unlocked: true },
  { id: 'ms-2', days: 14, labelKey: 'journeys.health.wellness.streaks.milestones.twoWeeks', icon: '\u{2B50}', unlocked: true },
  { id: 'ms-3', days: 30, labelKey: 'journeys.health.wellness.streaks.milestones.month', icon: '\u{1F3C5}', unlocked: false },
  { id: 'ms-4', days: 60, labelKey: 'journeys.health.wellness.streaks.milestones.twoMonths', icon: '\u{1F947}', unlocked: false },
  { id: 'ms-5', days: 90, labelKey: 'journeys.health.wellness.streaks.milestones.quarter', icon: '\u{1F3C6}', unlocked: false },
  { id: 'ms-6', days: 365, labelKey: 'journeys.health.wellness.streaks.milestones.year', icon: '\u{1F451}', unlocked: false },
];

const MOCK_REWARDS: Reward[] = [
  { id: 'rw-1', titleKey: 'journeys.health.wellness.streaks.rewards.weekStreak', descriptionKey: 'journeys.health.wellness.streaks.rewards.weekStreakDesc', icon: '\u{1F381}', earnedDate: '2026-02-01' },
  { id: 'rw-2', titleKey: 'journeys.health.wellness.streaks.rewards.twoWeekStreak', descriptionKey: 'journeys.health.wellness.streaks.rewards.twoWeekStreakDesc', icon: '\u{1F389}', earnedDate: '2026-02-08' },
  { id: 'rw-3', titleKey: 'journeys.health.wellness.streaks.rewards.consistencyBadge', descriptionKey: 'journeys.health.wellness.streaks.rewards.consistencyBadgeDesc', icon: '\u{1F396}', earnedDate: '2026-02-15' },
];

const ACTIVITY_COLORS: Record<ActivityLevel, string> = {
  0: 'transparent',
  1: colors.semantic.success + '40',
  2: colors.semantic.success + '80',
  3: colors.semantic.success,
};

/**
 * Generate mock heat map data for the current month.
 */
const generateHeatMapData = (): HeatMapDay[] => {
  const daysInMonth = 28;
  return Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    level: (i < CURRENT_STREAK ? ((i % 3) + 1) : 0) as ActivityLevel,
  }));
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CompanionStreaksScreen: React.FC = () => {
  const navigation = useNavigation<WellnessNavigationProp>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const heatMapData = useMemo(generateHeatMapData, []);

  const renderMilestone = (milestone: Milestone) => (
    <View
      key={milestone.id}
      style={[styles.milestoneItem, !milestone.unlocked && styles.milestoneLocked]}
      testID={`milestone-${milestone.id}`}
    >
      <Text style={styles.milestoneIcon}>{milestone.icon}</Text>
      <Text style={styles.milestoneDays}>{milestone.days}</Text>
      <Text style={styles.milestoneLabel}>{t(milestone.labelKey)}</Text>
      {milestone.unlocked && (
        <View style={styles.milestoneCheck}>
          <Text style={styles.milestoneCheckIcon}>{'\u2713'}</Text>
        </View>
      )}
    </View>
  );

  const renderReward = ({ item }: { item: Reward }) => (
    <View style={styles.rewardCard} testID={`reward-${item.id}`}>
      <Text style={styles.rewardIcon}>{item.icon}</Text>
      <View style={styles.rewardContent}>
        <Text style={styles.rewardTitle}>{t(item.titleKey)}</Text>
        <Text style={styles.rewardDescription}>{t(item.descriptionKey)}</Text>
        <Text style={styles.rewardDate}>
          {new Date(item.earnedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} testID="wellness-streaks-screen">
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel={t('common.buttons.back')}
        >
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>
          {t('journeys.health.wellness.streaks.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Streak Counter */}
        <View style={styles.streakCounter}>
          <Text style={styles.streakIcon}>{'\u{1F525}'}</Text>
          <Text style={styles.streakNumber}>{CURRENT_STREAK}</Text>
          <Text style={styles.streakLabel}>
            {t('journeys.health.wellness.streaks.currentStreak')}
          </Text>
          <Text style={styles.longestStreak}>
            {t('journeys.health.wellness.streaks.longestStreak', { count: LONGEST_STREAK })}
          </Text>
        </View>

        {/* Calendar Heat Map */}
        <View style={styles.heatMapCard}>
          <Text style={styles.sectionTitle}>
            {t('journeys.health.wellness.streaks.activityMap')}
          </Text>
          <View style={styles.heatMapGrid}>
            {heatMapData.map((day) => (
              <View
                key={`hm-${day.day}`}
                style={[
                  styles.heatMapCell,
                  {
                    backgroundColor: day.level > 0
                      ? ACTIVITY_COLORS[day.level]
                      : theme.colors.border.default,
                  },
                ]}
                testID={`heatmap-day-${day.day}`}
              >
                <Text style={styles.heatMapDayText}>{day.day}</Text>
              </View>
            ))}
          </View>
          {/* Legend */}
          <View style={styles.legendRow}>
            <Text style={styles.legendLabel}>
              {t('journeys.health.wellness.streaks.less')}
            </Text>
            {([0, 1, 2, 3] as ActivityLevel[]).map((level) => (
              <View
                key={`legend-${level}`}
                style={[
                  styles.legendCell,
                  {
                    backgroundColor: level > 0
                      ? ACTIVITY_COLORS[level]
                      : theme.colors.border.default,
                  },
                ]}
              />
            ))}
            <Text style={styles.legendLabel}>
              {t('journeys.health.wellness.streaks.more')}
            </Text>
          </View>
        </View>

        {/* Milestones */}
        <Text style={styles.sectionTitle}>
          {t('journeys.health.wellness.streaks.milestonesTitle')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.milestonesRow}
        >
          {MOCK_MILESTONES.map(renderMilestone)}
        </ScrollView>

        {/* Rewards Earned */}
        <Text style={styles.sectionTitle}>
          {t('journeys.health.wellness.streaks.rewardsTitle')}
        </Text>
        <FlatList
          data={MOCK_REWARDS}
          keyExtractor={(item) => item.id}
          renderItem={renderReward}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyRewards}>
              <Text style={styles.emptyRewardsText}>
                {t('journeys.health.wellness.streaks.noRewards')}
              </Text>
            </View>
          }
        />

        {/* Share Button */}
        <TouchableOpacity
          style={styles.shareButton}
          accessibilityLabel={t('journeys.health.wellness.streaks.share')}
        >
          <Text style={styles.shareButtonText}>
            {t('journeys.health.wellness.streaks.share')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.subtle,
    },
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
    backArrow: {
      fontSize: 20,
      color: theme.colors.text.onBrand,
      fontWeight: '600',
    },
    screenTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text.onBrand,
      textAlign: 'center',
    },
    headerSpacer: {
      width: sizingValues.component.sm,
    },
    scrollContent: {
      paddingHorizontal: spacingValues.md,
      paddingBottom: spacingValues['5xl'],
    },
    streakCounter: {
      alignItems: 'center',
      paddingVertical: spacingValues['2xl'],
    },
    streakIcon: {
      fontSize: 48,
    },
    streakNumber: {
      fontSize: 64,
      fontWeight: '800',
      color: theme.colors.text.default,
      marginTop: spacingValues.xs,
    },
    streakLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text.muted,
    },
    longestStreak: {
      fontSize: 13,
      color: theme.colors.text.muted,
      marginTop: spacingValues['3xs'],
    },
    heatMapCard: {
      backgroundColor: theme.colors.background.default,
      borderRadius: borderRadiusValues.lg,
      padding: spacingValues.md,
      marginBottom: spacingValues.lg,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.default,
      marginBottom: spacingValues.sm,
    },
    heatMapGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacingValues['4xs'],
    },
    heatMapCell: {
      width: '13%',
      aspectRatio: 1,
      borderRadius: borderRadiusValues.xs,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heatMapDayText: {
      fontSize: 10,
      color: theme.colors.text.muted,
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacingValues.sm,
      gap: spacingValues['3xs'],
    },
    legendCell: {
      width: 16,
      height: 16,
      borderRadius: borderRadiusValues['2xs'],
    },
    legendLabel: {
      fontSize: 10,
      color: theme.colors.text.muted,
    },
    milestonesRow: {
      gap: spacingValues.sm,
      paddingBottom: spacingValues.lg,
    },
    milestoneItem: {
      alignItems: 'center',
      backgroundColor: theme.colors.background.default,
      borderRadius: borderRadiusValues.lg,
      padding: spacingValues.md,
      width: 96,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    milestoneLocked: {
      opacity: 0.5,
    },
    milestoneIcon: {
      fontSize: 28,
    },
    milestoneDays: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.default,
      marginTop: spacingValues['3xs'],
    },
    milestoneLabel: {
      fontSize: 11,
      color: theme.colors.text.muted,
      textAlign: 'center',
      marginTop: spacingValues['4xs'],
    },
    milestoneCheck: {
      position: 'absolute',
      top: spacingValues.xs,
      right: spacingValues.xs,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.semantic.success,
      alignItems: 'center',
      justifyContent: 'center',
    },
    milestoneCheckIcon: {
      fontSize: 12,
      color: theme.colors.text.onBrand,
      fontWeight: '700',
    },
    rewardCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background.default,
      borderRadius: borderRadiusValues.lg,
      padding: spacingValues.md,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    rewardIcon: {
      fontSize: 28,
      marginRight: spacingValues.sm,
    },
    rewardContent: {
      flex: 1,
    },
    rewardTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.default,
    },
    rewardDescription: {
      fontSize: 12,
      color: theme.colors.text.muted,
      marginTop: spacingValues['4xs'],
    },
    rewardDate: {
      fontSize: 11,
      color: theme.colors.text.muted,
      marginTop: spacingValues['3xs'],
    },
    separator: {
      height: spacingValues.xs,
    },
    emptyRewards: {
      alignItems: 'center',
      paddingVertical: spacingValues.xl,
    },
    emptyRewardsText: {
      fontSize: 14,
      color: theme.colors.text.muted,
    },
    shareButton: {
      marginTop: spacingValues.xl,
      backgroundColor: colors.brand.primary,
      borderRadius: borderRadiusValues.full,
      paddingVertical: spacingValues.sm,
      alignItems: 'center',
    },
    shareButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.onBrand,
    },
  });

export default CompanionStreaksScreen;
