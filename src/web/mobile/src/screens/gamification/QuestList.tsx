import React, { useCallback } from 'react';
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
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';

import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacingValues } from 'src/web/design-system/src/tokens/spacing';
import { borderRadiusValues } from 'src/web/design-system/src/tokens/borderRadius';
import { sizingValues } from 'src/web/design-system/src/tokens/sizing';

import { QuestListItem, CategorizedQuest } from './QuestListItem';
import { useQuestFilters, TABS } from './useQuestFilters';

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
 * QuestList screen displays quests organized by category sections
 * with filter tabs for Active, Available, and Completed states.
 */
const QuestList: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const { activeTab, setActiveTab, sections, stats } = useQuestFilters(MOCK_QUESTS, t);

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

  const renderQuestItem = ({ item }: { item: CategorizedQuest }) => (
    <QuestListItem item={item} theme={theme} onPress={handleQuestPress} />
  );

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
        testID="gamification-quest-list"
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

const createStyles = (theme: Theme) => StyleSheet.create({
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
  summaryCard: {
    marginHorizontal: spacingValues.md,
    marginTop: spacingValues.md,
    backgroundColor: theme.colors.background.default,
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
    color: theme.colors.text.default,
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
    color: theme.colors.text.default,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.text.muted,
    marginTop: spacingValues['4xs'],
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border.default,
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

export default QuestList;
