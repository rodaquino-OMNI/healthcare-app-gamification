import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';

import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacingValues } from 'src/web/design-system/src/tokens/spacing';
import { borderRadiusValues } from 'src/web/design-system/src/tokens/borderRadius';
import { sizingValues } from 'src/web/design-system/src/tokens/sizing';
import { Quest } from 'src/web/shared/types/gamification.types';

/**
 * Route params for QuestDetail.
 */
interface QuestDetailRouteParams {
  questId: string;
}

/**
 * Requirement item for a quest.
 */
interface QuestRequirement {
  id: string;
  label: string;
  completed: boolean;
}

/** Mock quest data matching the QuestList mock data. */
const MOCK_QUESTS: Quest[] = [
  { id: 'q-001', title: 'Morning Health Check', description: 'Log your vitals before 9 AM every morning. Consistent records help your doctor understand trends and provide useful daily health insights.', journey: 'health', icon: '\u{1F3AF}', progress: 1, total: 1, completed: false },
  { id: 'q-002', title: 'Hydration Hero', description: 'Drink 8 glasses of water today to stay properly hydrated and improve energy levels.', journey: 'health', icon: '\u{1F4A7}', progress: 5, total: 8, completed: false },
  { id: 'q-003', title: 'Medication Adherence', description: 'Take all prescribed medications on time. Consistent adherence is crucial for treatment outcomes.', journey: 'care', icon: '\u{1F48A}', progress: 2, total: 3, completed: false },
  { id: 'q-004', title: 'Step Master', description: 'Walk 50,000 steps this week. Regular walking improves cardiovascular health and boosts mood.', journey: 'health', icon: '\u{1F6B6}', progress: 32000, total: 50000, completed: false },
  { id: 'q-006', title: 'Plan Review', description: 'Review your insurance coverage details to maximize savings and access care efficiently.', journey: 'plan', icon: '\u{1F4CB}', progress: 0, total: 1, completed: false },
  { id: 'q-007', title: 'Care Champion', description: 'Schedule and attend 3 appointments this month for preventive care.', journey: 'care', icon: '\u{1F3C6}', progress: 1, total: 3, completed: false },
  { id: 'q-008', title: 'Health Data Pioneer', description: 'Connect 2 health devices to the app for comprehensive tracking and insights.', journey: 'health', icon: '\u{1F4F1}', progress: 2, total: 2, completed: true },
  { id: 'q-009', title: 'Benefits Maximizer', description: 'Use 3 different plan benefits this month to get the most value from your coverage.', journey: 'plan', icon: '\u{2B50}', progress: 3, total: 3, completed: true },
];

/** Mock requirements generated based on quest progress. */
const getRequirements = (quest: Quest): QuestRequirement[] => {
  const labels = ['Complete the first step', 'Reach halfway milestone', 'Maintain 3-day streak', 'Sync data with the app', 'Share your progress'];
  const count = Math.min(Math.max(quest.total, 3), 5);
  return labels.slice(0, count).map((label, i) => ({ id: `req-${i}`, label, completed: i < quest.progress }));
};

const JOURNEY_COLORS: Record<string, string> = { health: colors.journeys.health.primary, care: colors.journeys.care.primary, plan: colors.journeys.plan.primary };
const getJourneyColor = (journey: string): string => JOURNEY_COLORS[journey] || colors.brand.primary;

const getTimeRemainingKey = (quest: Quest): { key: string; params?: Record<string, unknown> } => {
  if (quest.completed) return { key: 'gamification.questDetail.timeCompleted' };
  if (quest.progress === 0) return { key: 'gamification.questDetail.timeNoDeadline' };
  const opts: { key: string; params: Record<string, unknown> }[] = [
    { key: 'gamification.questDetail.timeRemaining', params: { time: '2 days' } },
    { key: 'gamification.questDetail.timeRemaining', params: { time: '5 hours' } },
    { key: 'gamification.questDetail.timeRemaining', params: { time: '3 days' } },
    { key: 'gamification.questDetail.timeRemaining', params: { time: '12 hours' } },
  ];
  return opts[quest.id.charCodeAt(quest.id.length - 1) % opts.length];
};

/**
 * QuestDetail screen displays full information about a single quest,
 * including progress, requirements checklist, reward preview, and actions.
 */
const QuestDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const route = useRoute<any>();
  const { questId } = route.params as QuestDetailRouteParams;

  const quest = useMemo(
    () => MOCK_QUESTS.find((q) => q.id === questId),
    [questId],
  );

  if (!quest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('gamification.questDetail.notFound')}</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
            accessibilityLabel={t('common.buttons.back')}
          >
            <Text style={styles.errorButtonText}>{t('common.buttons.back')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const journeyColor = getJourneyColor(quest.journey);
  const progressPercent = quest.total > 0 ? Math.round((quest.progress / quest.total) * 100) : 0;
  const requirements = getRequirements(quest);
  const timeRemainingInfo = getTimeRemainingKey(quest);
  const timeRemaining = t(timeRemainingInfo.key, timeRemainingInfo.params);
  const rewardXP = quest.total * 25;

  const handleAction = useCallback(() => {
    if (quest.completed) {
      Alert.alert(t('gamification.questDetail.rewardClaimedTitle'), t('gamification.questDetail.rewardClaimedMessage', { xp: rewardXP }));
    } else {
      Alert.alert(t('gamification.questDetail.questUpdatedTitle'), quest.progress > 0 ? t('gamification.questDetail.questInProgress') : t('gamification.questDetail.questStarted'));
    }
  }, [quest, rewardXP]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `I'm ${progressPercent}% through the "${quest.title}" quest on AUSTA! ${quest.description}`,
      });
    } catch {
      // User cancelled share
    }
  }, [quest, progressPercent]);

  const getActionLabel = (): string => {
    if (quest.completed) return t('gamification.questDetail.claimReward');
    if (quest.progress > 0) return t('gamification.questDetail.continue');
    return t('gamification.questDetail.startQuest');
  };

  const getActionColor = (): string => {
    if (quest.completed) return colors.semantic.success;
    if (quest.progress > 0) return journeyColor;
    return colors.brand.primary;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerBar, { backgroundColor: journeyColor }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel={t('common.buttons.back')}
        >
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('gamification.questDetail.screenTitle')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quest Icon and Title */}
        <View style={styles.heroSection}>
          <View style={[styles.iconCircle, { backgroundColor: journeyColor + '20' }]}>
            <Text style={styles.heroIcon}>{quest.icon}</Text>
          </View>
          <Text style={styles.heroTitle}>{quest.title}</Text>
          <View style={styles.journeyBadge}>
            <View style={[styles.journeyDot, { backgroundColor: journeyColor }]} />
            <Text style={[styles.journeyLabel, { color: journeyColor }]}>
              {quest.journey.charAt(0).toUpperCase() + quest.journey.slice(1)}
            </Text>
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('gamification.questDetail.description')}</Text>
          <Text style={styles.descriptionText}>{quest.description}</Text>
        </View>

        {/* Progress Section */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('gamification.questDetail.progress')}</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(progressPercent, 100)}%`, backgroundColor: journeyColor },
                ]}
              />
            </View>
          </View>
          <View style={styles.progressDetails}>
            <Text style={styles.progressNumbers}>
              {t('gamification.questDetail.progressOf', { progress: quest.progress, total: quest.total })}
            </Text>
            <Text style={[styles.progressPercent, { color: journeyColor }]}>
              {progressPercent}%
            </Text>
          </View>
        </View>

        {/* Requirements Checklist */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('gamification.questDetail.requirements')}</Text>
          {requirements.map((req) => (
            <View key={req.id} style={styles.requirementRow}>
              <View
                style={[
                  styles.requirementCircle,
                  req.completed && { backgroundColor: journeyColor, borderColor: journeyColor },
                ]}
              >
                {req.completed && <Text style={styles.requirementCheck}>{'\u2713'}</Text>}
              </View>
              <Text
                style={[
                  styles.requirementLabel,
                  req.completed && styles.requirementCompleted,
                ]}
              >
                {req.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Reward Preview */}
        <View style={[styles.card, styles.rewardCard]}>
          <Text style={styles.cardLabel}>{t('gamification.questDetail.reward')}</Text>
          <View style={styles.rewardContent}>
            <Text style={styles.rewardIcon}>{'\u{1F381}'}</Text>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardXP}>{rewardXP} XP</Text>
              <Text style={styles.rewardDescription}>
                {t('gamification.questDetail.rewardDescription')}
              </Text>
            </View>
          </View>
        </View>

        {/* Time Remaining */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeIcon}>{'\u{23F0}'}</Text>
          <Text style={styles.timeText}>{timeRemaining}</Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          onPress={handleAction}
          style={[styles.actionButton, { backgroundColor: getActionColor() }]}
          accessibilityLabel={getActionLabel()}
        >
          <Text style={styles.actionButtonText}>{getActionLabel()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShare}
          style={styles.shareButton}
          accessibilityLabel={t('gamification.questDetail.shareLabel')}
        >
          <Text style={[styles.shareButtonText, { color: journeyColor }]}>
            {t('gamification.questDetail.shareProgress')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) => {
  const cardBase = { backgroundColor: theme.colors.background.default, borderRadius: borderRadiusValues.lg, padding: spacingValues.md, marginBottom: spacingValues.sm, shadowColor: colors.neutral.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2, elevation: 2 } as const;

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background.subtle },
    headerBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacingValues.md, paddingVertical: spacingValues.sm },
    backButton: { width: sizingValues.component.sm, height: sizingValues.component.sm, alignItems: 'center', justifyContent: 'center' },
    backArrow: { fontSize: 20, color: theme.colors.text.onBrand, fontWeight: '600' },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: theme.colors.text.onBrand, textAlign: 'center' },
    headerSpacer: { width: sizingValues.component.sm },
    scrollView: { flex: 1 },
    scrollContent: { padding: spacingValues.md, paddingBottom: spacingValues['5xl'] },
    heroSection: { alignItems: 'center', marginBottom: spacingValues.lg },
    iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: spacingValues.sm },
    heroIcon: { fontSize: 40 },
    heroTitle: { fontSize: 22, fontWeight: '700', color: theme.colors.text.default, textAlign: 'center' },
    journeyBadge: { flexDirection: 'row', alignItems: 'center', marginTop: spacingValues.xs },
    journeyDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacingValues['3xs'] },
    journeyLabel: { fontSize: 14, fontWeight: '500' },
    card: { ...cardBase },
    cardLabel: { fontSize: 14, fontWeight: '600', color: theme.colors.text.muted, marginBottom: spacingValues.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
    descriptionText: { fontSize: 15, color: theme.colors.text.default, lineHeight: 22 },
    progressBarContainer: { marginBottom: spacingValues.xs },
    progressBarBg: { height: 10, backgroundColor: theme.colors.background.subtle, borderRadius: borderRadiusValues.full, overflow: 'hidden' },
    progressBarFill: { height: 10, borderRadius: borderRadiusValues.full },
    progressDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    progressNumbers: { fontSize: 14, color: theme.colors.text.muted },
    progressPercent: { fontSize: 16, fontWeight: '700' },
    requirementRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacingValues.xs },
    requirementCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.neutral.gray400, alignItems: 'center', justifyContent: 'center', marginRight: spacingValues.sm },
    requirementCheck: { fontSize: 12, fontWeight: '700', color: theme.colors.text.onBrand },
    requirementLabel: { fontSize: 14, color: theme.colors.text.default, flex: 1 },
    requirementCompleted: { textDecorationLine: 'line-through', color: theme.colors.text.muted },
    rewardCard: { borderLeftWidth: 3, borderLeftColor: colors.semantic.success },
    rewardContent: { flexDirection: 'row', alignItems: 'center' },
    rewardIcon: { fontSize: 32, marginRight: spacingValues.sm },
    rewardInfo: { flex: 1 },
    rewardXP: { fontSize: 20, fontWeight: '700', color: theme.colors.text.default },
    rewardDescription: { fontSize: 13, color: theme.colors.text.muted, marginTop: spacingValues['4xs'] },
    timeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacingValues.sm, marginBottom: spacingValues.sm },
    timeIcon: { fontSize: 16, marginRight: spacingValues.xs },
    timeText: { fontSize: 14, fontWeight: '500', color: theme.colors.text.muted },
    actionButton: { borderRadius: borderRadiusValues.md, paddingVertical: spacingValues.sm, alignItems: 'center', marginBottom: spacingValues.sm },
    actionButtonText: { fontSize: 16, fontWeight: '700', color: theme.colors.text.onBrand },
    shareButton: { borderRadius: borderRadiusValues.md, paddingVertical: spacingValues.sm, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border.default, marginBottom: spacingValues.md },
    shareButtonText: { fontSize: 16, fontWeight: '600' },
    errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacingValues['2xl'] },
    errorText: { fontSize: 18, fontWeight: '600', color: theme.colors.text.default, marginBottom: spacingValues.md },
    errorButton: { backgroundColor: colors.brand.primary, borderRadius: borderRadiusValues.md, paddingVertical: spacingValues.sm, paddingHorizontal: spacingValues['2xl'] },
    errorButtonText: { fontSize: 16, fontWeight: '600', color: theme.colors.text.onBrand },
  });
};

export default QuestDetail;
