import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacingValues } from 'src/web/design-system/src/tokens/spacing';
import { borderRadiusValues } from 'src/web/design-system/src/tokens/borderRadius';
import { sizingValues } from 'src/web/design-system/src/tokens/sizing';
import { Quest } from 'src/web/shared/types/gamification.types';

/**
 * Extended quest type with category for section grouping.
 */
interface CategorizedQuest extends Quest {
  category: 'daily' | 'weekly' | 'special';
}

type TabFilter = 'active' | 'available' | 'completed';

const TABS: { key: TabFilter; labelKey: string }[] = [
  { key: 'active', labelKey: 'gamification.quests.tabActive' },
  { key: 'available', labelKey: 'gamification.quests.tabAvailable' },
  { key: 'completed', labelKey: 'gamification.quests.tabCompleted' },
];

/**
 * Mock quest data for development and immediate rendering.
 */
const MOCK_QUESTS: CategorizedQuest[] = [
  { id: 'q-001', title: 'Morning Health Check', description: 'Log your vitals before 9 AM today', journey: 'health', icon: '\u{1F3AF}', progress: 1, total: 1, completed: false, category: 'daily' },
  { id: 'q-002', title: 'Hydration Hero', description: 'Drink 8 glasses of water today', journey: 'health', icon: '\u{1F4A7}', progress: 5, total: 8, completed: false, category: 'daily' },
  { id: 'q-003', title: 'Medication Adherence', description: 'Take all prescribed medications on time', journey: 'care', icon: '\u{1F48A}', progress: 2, total: 3, completed: false, category: 'daily' },
  { id: 'q-004', title: 'Step Master', description: 'Walk 50,000 steps this week', journey: 'health', icon: '\u{1F6B6}', progress: 32000, total: 50000, completed: false, category: 'weekly' },
  { id: 'q-005', title: 'Wellness Explorer', description: 'Read 5 health articles this week', journey: 'health', icon: '\u{1F4DA}', progress: 3, total: 5, completed: false, category: 'weekly' },
  { id: 'q-006', title: 'Plan Review', description: 'Review your insurance coverage details this week', journey: 'plan', icon: '\u{1F4CB}', progress: 0, total: 1, completed: false, category: 'weekly' },
  { id: 'q-007', title: 'Care Champion', description: 'Schedule and attend 3 appointments this month', journey: 'care', icon: '\u{1F3C6}', progress: 1, total: 3, completed: false, category: 'special' },
  { id: 'q-008', title: 'Health Data Pioneer', description: 'Connect 2 health devices to the app', journey: 'health', icon: '\u{1F4F1}', progress: 2, total: 2, completed: true, category: 'special' },
  { id: 'q-009', title: 'Benefits Maximizer', description: 'Use 3 different plan benefits this month', journey: 'plan', icon: '\u{2B50}', progress: 3, total: 3, completed: true, category: 'special' },
  { id: 'q-010', title: 'Daily Mood Log', description: 'Record your mood every day this week', journey: 'health', icon: '\u{1F60A}', progress: 0, total: 7, completed: false, category: 'weekly' },
  { id: 'q-011', title: 'First Appointment', description: 'Book your first telemedicine appointment', journey: 'care', icon: '\u{1F4F9}', progress: 0, total: 1, completed: false, category: 'special' },
  { id: 'q-012', title: 'Sleep Tracker', description: 'Log your sleep for 7 consecutive nights', journey: 'health', icon: '\u{1F634}', progress: 7, total: 7, completed: true, category: 'weekly' },
];

/**
 * Returns the journey color for a given journey string.
 */
const getJourneyColor = (journey: string): string => {
  switch (journey) {
    case 'health':
      return colors.journeys.health.primary;
    case 'care':
      return colors.journeys.care.primary;
    case 'plan':
      return colors.journeys.plan.primary;
    default:
      return colors.brand.primary;
  }
};

/**
 * QuestList screen displays quests organized by category sections
 * with filter tabs for Active, Available, and Completed states.
 */
const QuestList: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabFilter>('active');

  const quests = MOCK_QUESTS;

  const stats = useMemo(() => {
    const total = quests.length;
    const completed = quests.filter((q) => q.completed).length;
    const active = quests.filter((q) => !q.completed && q.progress > 0).length;
    return { total, completed, active };
  }, [quests]);

  const filteredQuests = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return quests.filter((q) => !q.completed && q.progress > 0);
      case 'available':
        return quests.filter((q) => !q.completed && q.progress === 0);
      case 'completed':
        return quests.filter((q) => q.completed);
      default:
        return quests;
    }
  }, [quests, activeTab]);

  const sections = useMemo(() => {
    const daily = filteredQuests.filter((q) => q.category === 'daily');
    const weekly = filteredQuests.filter((q) => q.category === 'weekly');
    const special = filteredQuests.filter((q) => q.category === 'special');

    const result: { title: string; data: CategorizedQuest[] }[] = [];
    if (daily.length > 0) result.push({ title: t('gamification.quests.sectionDaily'), data: daily });
    if (weekly.length > 0) result.push({ title: t('gamification.quests.sectionWeekly'), data: weekly });
    if (special.length > 0) result.push({ title: t('gamification.quests.sectionSpecial'), data: special });
    return result;
  }, [filteredQuests]);

  const handleQuestPress = useCallback(
    (questId: string) => {
      navigation.navigate('GamificationQuestDetail', { questId });
    },
    [navigation],
  );

  const renderSummaryCard = () => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>{t('gamification.quests.summaryTitle')}</Text>
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{stats.total}</Text>
          <Text style={styles.summaryLabel}>{t('gamification.quests.summaryTotal')}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: colors.journeys.health.primary }]}>
            {stats.active}
          </Text>
          <Text style={styles.summaryLabel}>{t('gamification.quests.summaryActive')}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: colors.semantic.success }]}>
            {stats.completed}
          </Text>
          <Text style={styles.summaryLabel}>{t('gamification.quests.summaryCompleted')}</Text>
        </View>
      </View>
    </View>
  );

  const renderTabs = () => (
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
            accessibilityLabel={t('gamification.quests.filterBy', { label: t(tab.labelKey) })}
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {t(tab.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderQuestItem = ({ item }: { item: CategorizedQuest }) => {
    const journeyColor = getJourneyColor(item.journey);
    const progressPercent = item.total > 0 ? (item.progress / item.total) * 100 : 0;

    return (
      <TouchableOpacity
        onPress={() => handleQuestPress(item.id)}
        style={styles.questItem}
        accessibilityLabel={t('gamification.quests.questAccessibility', { title: item.title, journey: item.journey, percent: Math.round(progressPercent) })}
        accessibilityHint={t('gamification.quests.questHint')}
      >
        <View style={styles.questIconContainer}>
          <Text style={styles.questIcon}>{item.icon}</Text>
        </View>
        <View style={styles.questContent}>
          <View style={styles.questHeader}>
            <Text style={styles.questTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {item.completed && (
              <Text style={styles.checkmark}>{'\u2713'}</Text>
            )}
          </View>
          <Text style={styles.questDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.questMeta}>
            <View style={[styles.journeyDot, { backgroundColor: journeyColor }]} />
            <Text style={[styles.journeyText, { color: journeyColor }]}>
              {item.journey.charAt(0).toUpperCase() + item.journey.slice(1)}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(progressPercent, 100)}%`, backgroundColor: journeyColor },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {item.progress}/{item.total}
            </Text>
          </View>
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
      <Text style={styles.emptyIcon}>{'\u{1F50D}'}</Text>
      <Text style={styles.emptyTitle}>{t('gamification.quests.emptyTitle')}</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'active'
          ? t('gamification.quests.emptyActive')
          : activeTab === 'available'
          ? t('gamification.quests.emptyAvailable')
          : t('gamification.quests.emptyCompleted')}
      </Text>
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
        <Text style={styles.screenTitle}>{t('gamification.quests.screenTitle')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {renderSummaryCard()}
      {renderTabs()}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderQuestItem}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.gray100,
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
    color: colors.neutral.white,
    fontWeight: '600',
  },
  screenTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral.white,
    textAlign: 'center',
  },
  headerSpacer: {
    width: sizingValues.component.sm,
  },
  summaryCard: {
    marginHorizontal: spacingValues.md,
    marginTop: spacingValues.md,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadiusValues.lg,
    padding: spacingValues.md,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.gray800,
    marginBottom: spacingValues.sm,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.neutral.gray800,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.neutral.gray500,
    marginTop: spacingValues['4xs'],
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.neutral.gray300,
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
    backgroundColor: 'transparent',
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
    color: colors.neutral.white,
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
    color: colors.neutral.gray700,
  },
  questItem: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadiusValues.md,
    padding: spacingValues.sm,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  questIconContainer: {
    width: sizingValues.component.lg,
    height: sizingValues.component.lg,
    borderRadius: borderRadiusValues.md,
    backgroundColor: colors.neutral.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingValues.sm,
  },
  questIcon: {
    fontSize: 24,
  },
  questContent: {
    flex: 1,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.gray800,
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.semantic.success,
    marginLeft: spacingValues.xs,
  },
  questDescription: {
    fontSize: 13,
    color: colors.neutral.gray500,
    marginTop: spacingValues['4xs'],
  },
  questMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacingValues.xs,
  },
  journeyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacingValues['3xs'],
  },
  journeyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacingValues.xs,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.neutral.gray300,
    borderRadius: borderRadiusValues.full,
    overflow: 'hidden',
    marginRight: spacingValues.xs,
  },
  progressBarFill: {
    height: 6,
    borderRadius: borderRadiusValues.full,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.neutral.gray500,
    minWidth: 36,
    textAlign: 'right',
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
    color: colors.neutral.gray700,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.neutral.gray500,
    textAlign: 'center',
    paddingHorizontal: spacingValues['2xl'],
  },
});

export default QuestList;
