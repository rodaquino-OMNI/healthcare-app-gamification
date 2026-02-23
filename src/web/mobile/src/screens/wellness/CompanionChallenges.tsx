import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  SectionList,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { sizingValues } from '@design-system/tokens/sizing';
import { ROUTES } from '../../constants/routes';
import type { WellnessNavigationProp } from '../../navigation/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ChallengeStatus = 'active' | 'upcoming' | 'completed';

interface WellnessChallenge {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  progress: number;
  target: number;
  rewardPoints: number;
  participantCount: number;
  status: ChallengeStatus;
  daysLeft: number;
}

type TabKey = 'active' | 'upcoming' | 'completed';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const TABS: Array<{ key: TabKey; labelKey: string }> = [
  { key: 'active', labelKey: 'journeys.health.wellness.challenges.tabs.active' },
  { key: 'upcoming', labelKey: 'journeys.health.wellness.challenges.tabs.upcoming' },
  { key: 'completed', labelKey: 'journeys.health.wellness.challenges.tabs.completed' },
];

const MOCK_CHALLENGES: WellnessChallenge[] = [
  { id: 'ch-1', titleKey: 'journeys.health.wellness.challenges.items.walkChallenge', descriptionKey: 'journeys.health.wellness.challenges.items.walkChallengeDesc', icon: '\u{1F6B6}', progress: 35000, target: 70000, rewardPoints: 500, participantCount: 1243, status: 'active', daysLeft: 4 },
  { id: 'ch-2', titleKey: 'journeys.health.wellness.challenges.items.meditationStreak', descriptionKey: 'journeys.health.wellness.challenges.items.meditationStreakDesc', icon: '\u{1F9D8}', progress: 5, target: 7, rewardPoints: 300, participantCount: 876, status: 'active', daysLeft: 2 },
  { id: 'ch-3', titleKey: 'journeys.health.wellness.challenges.items.hydrationWeek', descriptionKey: 'journeys.health.wellness.challenges.items.hydrationWeekDesc', icon: '\u{1F4A7}', progress: 40, target: 56, rewardPoints: 250, participantCount: 2100, status: 'active', daysLeft: 3 },
  { id: 'ch-4', titleKey: 'journeys.health.wellness.challenges.items.sleepChallenge', descriptionKey: 'journeys.health.wellness.challenges.items.sleepChallengeDesc', icon: '\u{1F634}', progress: 0, target: 30, rewardPoints: 750, participantCount: 654, status: 'upcoming', daysLeft: 7 },
  { id: 'ch-5', titleKey: 'journeys.health.wellness.challenges.items.nutritionQuest', descriptionKey: 'journeys.health.wellness.challenges.items.nutritionQuestDesc', icon: '\u{1F957}', progress: 0, target: 21, rewardPoints: 400, participantCount: 432, status: 'upcoming', daysLeft: 14 },
  { id: 'ch-6', titleKey: 'journeys.health.wellness.challenges.items.breathingMaster', descriptionKey: 'journeys.health.wellness.challenges.items.breathingMasterDesc', icon: '\u{1F32C}', progress: 10, target: 10, rewardPoints: 200, participantCount: 1567, status: 'completed', daysLeft: 0 },
  { id: 'ch-7', titleKey: 'journeys.health.wellness.challenges.items.journalHabit', descriptionKey: 'journeys.health.wellness.challenges.items.journalHabitDesc', icon: '\u{1F4D3}', progress: 14, target: 14, rewardPoints: 350, participantCount: 989, status: 'completed', daysLeft: 0 },
];

const STATUS_COLORS: Record<ChallengeStatus, string> = {
  active: colors.semantic.success,
  upcoming: colors.semantic.info,
  completed: colors.brand.secondary,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CompanionChallengesScreen: React.FC = () => {
  const navigation = useNavigation<WellnessNavigationProp>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const [activeTab, setActiveTab] = useState<TabKey>('active');

  const filteredChallenges = MOCK_CHALLENGES.filter((c) => c.status === activeTab);

  const sections = filteredChallenges.length > 0
    ? [{ title: t(`journeys.health.wellness.challenges.tabs.${activeTab}`), data: filteredChallenges }]
    : [];

  const handleChallengePress = useCallback(
    (challengeId: string) => {
      navigation.navigate(ROUTES.WELLNESS_CHALLENGE_DETAIL as 'WellnessChallengeDetail', { challengeId });
    },
    [navigation],
  );

  const renderChallengeCard = ({ item }: { item: WellnessChallenge }) => {
    const progress = Math.min(item.progress / item.target, 1);
    return (
      <TouchableOpacity
        style={styles.challengeCard}
        onPress={() => handleChallengePress(item.id)}
        testID={`challenge-card-${item.id}`}
        accessibilityLabel={t(item.titleKey)}
      >
        {/* Icon & Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{item.icon}</Text>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {t(item.descriptionKey)}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: STATUS_COLORS[item.status],
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {item.progress} / {item.target}
        </Text>

        {/* Footer: reward, participants, days */}
        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Text style={styles.footerIcon}>{'\u{2B50}'}</Text>
            <Text style={styles.footerText}>
              {t('journeys.health.wellness.challenges.rewardPoints', { count: item.rewardPoints })}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerIcon}>{'\u{1F465}'}</Text>
            <Text style={styles.footerText}>
              {t('journeys.health.wellness.challenges.participants', { count: item.participantCount })}
            </Text>
          </View>
          {item.daysLeft > 0 && (
            <View style={styles.footerItem}>
              <Text style={styles.footerIcon}>{'\u{23F3}'}</Text>
              <Text style={styles.footerText}>
                {t('journeys.health.wellness.challenges.daysLeft', { count: item.daysLeft })}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>{'\u{1F3C6}'}</Text>
      <Text style={styles.emptyTitle}>
        {t('journeys.health.wellness.challenges.emptyTitle')}
      </Text>
      <Text style={styles.emptySubtitle}>
        {t(`journeys.health.wellness.challenges.empty.${activeTab}`)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} testID="wellness-challenges-screen">
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
          {t('journeys.health.wellness.challenges.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, isActive && styles.tabActive]}
              accessibilityLabel={t(tab.labelKey)}
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {t(tab.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Challenge List */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderChallengeCard}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
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
    tabsContainer: {
      maxHeight: 48,
      marginTop: spacingValues.md,
    },
    tabsContent: {
      paddingHorizontal: spacingValues.md,
      gap: spacingValues.xs,
      alignItems: 'center',
    },
    tab: {
      paddingVertical: spacingValues.xs,
      paddingHorizontal: spacingValues.lg,
      borderRadius: borderRadiusValues.full,
      borderWidth: 1,
      borderColor: colors.brand.primary,
    },
    tabActive: {
      backgroundColor: colors.brand.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.brand.primary,
    },
    tabTextActive: {
      color: theme.colors.text.onBrand,
    },
    listContent: {
      paddingHorizontal: spacingValues.md,
      paddingBottom: spacingValues['5xl'],
    },
    sectionHeader: {
      paddingTop: spacingValues.lg,
      paddingBottom: spacingValues.xs,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.default,
    },
    challengeCard: {
      backgroundColor: theme.colors.background.default,
      borderRadius: borderRadiusValues.lg,
      padding: spacingValues.md,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      marginBottom: spacingValues.sm,
    },
    cardIcon: {
      fontSize: 32,
      marginRight: spacingValues.sm,
    },
    cardHeaderText: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.default,
    },
    cardDescription: {
      fontSize: 13,
      color: theme.colors.text.muted,
      marginTop: spacingValues['4xs'],
    },
    progressBarBg: {
      height: 8,
      backgroundColor: theme.colors.border.default,
      borderRadius: borderRadiusValues.full,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: borderRadiusValues.full,
    },
    progressText: {
      fontSize: 12,
      color: theme.colors.text.muted,
      marginTop: spacingValues['4xs'],
    },
    cardFooter: {
      flexDirection: 'row',
      marginTop: spacingValues.sm,
      gap: spacingValues.md,
    },
    footerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacingValues['4xs'],
    },
    footerIcon: {
      fontSize: 12,
    },
    footerText: {
      fontSize: 11,
      color: theme.colors.text.muted,
    },
    separator: {
      height: spacingValues.xs,
    },
    emptyContainer: {
      paddingTop: spacingValues['5xl'],
      alignItems: 'center',
      gap: spacingValues.xs,
    },
    emptyIcon: {
      fontSize: 48,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text.default,
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.colors.text.muted,
      textAlign: 'center',
      paddingHorizontal: spacingValues['2xl'],
    },
  });

export default CompanionChallengesScreen;
