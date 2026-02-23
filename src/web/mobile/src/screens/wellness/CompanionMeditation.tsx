import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import type { WellnessNavigationProp } from '../../navigation/types';

/**
 * Meditation category type.
 */
type MeditationCategory = 'sleep' | 'focus' | 'calm' | 'energy';

/**
 * Represents a meditation session.
 */
interface MeditationSession {
  id: string;
  titleKey: string;
  durationMinutes: number;
  category: MeditationCategory;
  icon: string;
}

/**
 * Represents a past meditation session entry.
 */
interface SessionHistory {
  id: string;
  titleKey: string;
  date: string;
  durationMinutes: number;
  category: MeditationCategory;
}

/**
 * Category config for filter tabs.
 */
interface CategoryTab {
  key: MeditationCategory | 'all';
  labelKey: string;
  icon: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  { key: 'all', labelKey: 'journeys.health.wellness.meditation.categoryAll', icon: '\u{1F3B5}' },
  { key: 'sleep', labelKey: 'journeys.health.wellness.meditation.categorySleep', icon: '\u{1F634}' },
  { key: 'focus', labelKey: 'journeys.health.wellness.meditation.categoryFocus', icon: '\u{1F3AF}' },
  { key: 'calm', labelKey: 'journeys.health.wellness.meditation.categoryCalm', icon: '\u{1F54A}' },
  { key: 'energy', labelKey: 'journeys.health.wellness.meditation.categoryEnergy', icon: '\u{26A1}' },
];

/**
 * Mock meditation sessions for development.
 */
const MOCK_SESSIONS: MeditationSession[] = [
  { id: 'med-001', titleKey: 'journeys.health.wellness.meditation.sessionSleepSounds', durationMinutes: 15, category: 'sleep', icon: '\u{1F634}' },
  { id: 'med-002', titleKey: 'journeys.health.wellness.meditation.sessionDeepFocus', durationMinutes: 10, category: 'focus', icon: '\u{1F3AF}' },
  { id: 'med-003', titleKey: 'journeys.health.wellness.meditation.sessionInnerCalm', durationMinutes: 20, category: 'calm', icon: '\u{1F54A}' },
  { id: 'med-004', titleKey: 'journeys.health.wellness.meditation.sessionMorningBoost', durationMinutes: 8, category: 'energy', icon: '\u{26A1}' },
  { id: 'med-005', titleKey: 'journeys.health.wellness.meditation.sessionBodyScan', durationMinutes: 12, category: 'calm', icon: '\u{1F9D8}' },
  { id: 'med-006', titleKey: 'journeys.health.wellness.meditation.sessionSleepStory', durationMinutes: 25, category: 'sleep', icon: '\u{1F31C}' },
];

/**
 * Mock session history for development.
 */
const MOCK_HISTORY: SessionHistory[] = [
  { id: 'hist-001', titleKey: 'journeys.health.wellness.meditation.sessionInnerCalm', date: '2024-01-14', durationMinutes: 20, category: 'calm' },
  { id: 'hist-002', titleKey: 'journeys.health.wellness.meditation.sessionDeepFocus', date: '2024-01-13', durationMinutes: 10, category: 'focus' },
  { id: 'hist-003', titleKey: 'journeys.health.wellness.meditation.sessionSleepSounds', date: '2024-01-12', durationMinutes: 15, category: 'sleep' },
];

/**
 * CompanionMeditationScreen provides guided meditation sessions
 * with audio player UI, category filters, and session history.
 */
export const CompanionMeditationScreen: React.FC = () => {
  const navigation = useNavigation<WellnessNavigationProp>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const [activeCategory, setActiveCategory] = useState<MeditationCategory | 'all'>('all');
  const [playingSessionId, setPlayingSessionId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const filteredSessions = activeCategory === 'all'
    ? MOCK_SESSIONS
    : MOCK_SESSIONS.filter((s) => s.category === activeCategory);

  const handlePlayPause = useCallback((sessionId: string) => {
    if (playingSessionId === sessionId) {
      setPlayingSessionId(null);
      setProgress(0);
    } else {
      setPlayingSessionId(sessionId);
      setProgress(0);
    }
  }, [playingSessionId]);

  const getCategoryColor = (category: MeditationCategory): string => {
    switch (category) {
      case 'sleep': return colors.brand.tertiary;
      case 'focus': return colors.semantic.info;
      case 'calm': return colors.brand.secondary;
      case 'energy': return colors.semantic.warning;
    }
  };

  const renderSessionCard = ({ item }: { item: MeditationSession }) => {
    const isPlaying = playingSessionId === item.id;
    return (
      <TouchableOpacity
        style={[styles.sessionCard, isPlaying && styles.sessionCardActive]}
        onPress={() => handlePlayPause(item.id)}
        accessibilityLabel={t(item.titleKey)}
        accessibilityRole="button"
        testID={`meditation-session-${item.id}`}
      >
        <View style={[styles.sessionIcon, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
          <Text style={styles.sessionEmoji}>{item.icon}</Text>
        </View>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>{t(item.titleKey)}</Text>
          <Text style={styles.sessionDuration}>
            {t('journeys.health.wellness.meditation.minutes', { count: item.durationMinutes })}
          </Text>
          {isPlaying && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: getCategoryColor(item.category) }]} />
            </View>
          )}
        </View>
        <View style={[styles.playButton, isPlaying && { backgroundColor: getCategoryColor(item.category) }]}>
          <Text style={styles.playIcon}>{isPlaying ? '\u23F8' : '\u25B6'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} testID="wellness-meditation-screen">
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel={t('common.buttons.back')}
        >
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>
          {t('journeys.health.wellness.meditation.screenTitle')}
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
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveCategory(tab.key)}
              accessibilityLabel={t(tab.labelKey)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              testID={`category-tab-${tab.key}`}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {t(tab.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Session List */}
      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id}
        renderItem={renderSessionCard}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <View style={styles.historySection}>
            <Text style={styles.historySectionTitle}>
              {t('journeys.health.wellness.meditation.recentSessions')}
            </Text>
            {MOCK_HISTORY.map((entry) => (
              <View key={entry.id} style={styles.historyItem} testID={`meditation-history-${entry.id}`}>
                <View style={[styles.historyDot, { backgroundColor: getCategoryColor(entry.category) }]} />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>{t(entry.titleKey)}</Text>
                  <Text style={styles.historyMeta}>
                    {entry.date} {'\u00B7'} {t('journeys.health.wellness.meditation.minutes', { count: entry.durationMinutes })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        }
        showsVerticalScrollIndicator={false}
        testID="meditation-session-list"
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
    },
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacingValues.md,
      paddingVertical: spacingValues.sm,
      backgroundColor: colors.brand.primary,
    },
    backButton: {
      width: 40,
      height: 40,
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
      width: 40,
    },
    tabsContainer: {
      maxHeight: 56,
      marginTop: spacingValues.sm,
    },
    tabsContent: {
      paddingHorizontal: spacingValues.md,
      gap: spacingValues.xs,
      alignItems: 'center',
    },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacingValues.xs,
      paddingHorizontal: spacingValues.md,
      borderRadius: borderRadiusValues.full,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      backgroundColor: 'transparent',
      gap: spacingValues['3xs'],
    },
    tabActive: {
      backgroundColor: colors.brand.primary,
      borderColor: colors.brand.primary,
    },
    tabIcon: {
      fontSize: 14,
    },
    tabText: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.text.default,
    },
    tabTextActive: {
      color: theme.colors.text.onBrand,
    },
    listContent: {
      paddingHorizontal: spacingValues.md,
      paddingTop: spacingValues.md,
      paddingBottom: spacingValues['5xl'],
    },
    sessionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacingValues.md,
      backgroundColor: theme.colors.background.subtle,
      borderRadius: borderRadiusValues.lg,
    },
    sessionCardActive: {
      backgroundColor: theme.colors.background.default,
      borderWidth: 1,
      borderColor: colors.brand.primary,
    },
    sessionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacingValues.sm,
    },
    sessionEmoji: {
      fontSize: 24,
    },
    sessionInfo: {
      flex: 1,
    },
    sessionTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text.default,
    },
    sessionDuration: {
      fontSize: 13,
      color: theme.colors.text.muted,
      marginTop: spacingValues['4xs'],
    },
    progressBarContainer: {
      height: 4,
      backgroundColor: theme.colors.border.default,
      borderRadius: 2,
      marginTop: spacingValues.xs,
    },
    progressBar: {
      height: 4,
      borderRadius: 2,
    },
    playButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.brand.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: spacingValues.sm,
    },
    playIcon: {
      fontSize: 16,
      color: theme.colors.text.onBrand,
    },
    separator: {
      height: spacingValues.xs,
    },
    historySection: {
      marginTop: spacingValues['2xl'],
    },
    historySectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.default,
      marginBottom: spacingValues.sm,
    },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacingValues.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.default,
    },
    historyDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: spacingValues.sm,
    },
    historyInfo: {
      flex: 1,
    },
    historyTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text.default,
    },
    historyMeta: {
      fontSize: 12,
      color: theme.colors.text.muted,
      marginTop: spacingValues['4xs'],
    },
  });

export default CompanionMeditationScreen;
