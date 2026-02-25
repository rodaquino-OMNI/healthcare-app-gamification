import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Filter period for diary entries.
 */
type FilterPeriod = 'week' | 'month' | 'all';

/**
 * Quality emoji index (1-5).
 */
type QualityLevel = 1 | 2 | 3 | 4 | 5;

/**
 * A single sleep diary entry.
 */
interface SleepEntry {
  id: string;
  date: string;
  score: number;
  hours: number;
  qualityLevel: QualityLevel;
  bedtime: string;
  wakeTime: string;
}

const QUALITY_EMOJIS: Record<QualityLevel, string> = {
  1: '\u{1F629}',
  2: '\u{1F641}',
  3: '\u{1F610}',
  4: '\u{1F642}',
  5: '\u{1F60D}',
};

/**
 * Get color for a sleep score value.
 */
const getScoreColor = (score: number): string => {
  if (score >= 85) return colors.semantic.success;
  if (score >= 70) return colors.journeys.health.primary;
  if (score >= 50) return colors.semantic.warning;
  return colors.semantic.error;
};

/**
 * Mock sleep diary data.
 */
const MOCK_ENTRIES: SleepEntry[] = [
  { id: 'se-1', date: '2026-02-23', score: 85, hours: 7.5, qualityLevel: 4, bedtime: '10:30 PM', wakeTime: '6:00 AM' },
  { id: 'se-2', date: '2026-02-22', score: 78, hours: 7.2, qualityLevel: 3, bedtime: '11:00 PM', wakeTime: '6:15 AM' },
  { id: 'se-3', date: '2026-02-21', score: 91, hours: 8.5, qualityLevel: 5, bedtime: '10:00 PM', wakeTime: '6:30 AM' },
  { id: 'se-4', date: '2026-02-20', score: 65, hours: 6.0, qualityLevel: 2, bedtime: '12:00 AM', wakeTime: '6:00 AM' },
  { id: 'se-5', date: '2026-02-19', score: 82, hours: 7.8, qualityLevel: 4, bedtime: '10:15 PM', wakeTime: '6:00 AM' },
  { id: 'se-6', date: '2026-02-18', score: 73, hours: 6.8, qualityLevel: 3, bedtime: '11:30 PM', wakeTime: '6:20 AM' },
  { id: 'se-7', date: '2026-02-17', score: 88, hours: 8.0, qualityLevel: 4, bedtime: '10:00 PM', wakeTime: '6:00 AM' },
  { id: 'se-8', date: '2026-02-16', score: 55, hours: 5.5, qualityLevel: 2, bedtime: '1:00 AM', wakeTime: '6:30 AM' },
  { id: 'se-9', date: '2026-02-15', score: 90, hours: 8.2, qualityLevel: 5, bedtime: '9:45 PM', wakeTime: '6:00 AM' },
  { id: 'se-10', date: '2026-02-14', score: 76, hours: 7.0, qualityLevel: 3, bedtime: '10:45 PM', wakeTime: '5:45 AM' },
  { id: 'se-11', date: '2026-02-13', score: 84, hours: 7.6, qualityLevel: 4, bedtime: '10:30 PM', wakeTime: '6:10 AM' },
  { id: 'se-12', date: '2026-02-12', score: 68, hours: 6.3, qualityLevel: 2, bedtime: '11:45 PM', wakeTime: '6:05 AM' },
];

const FILTERS: { key: FilterPeriod; labelKey: string }[] = [
  { key: 'week', labelKey: 'journeys.health.sleep.diary.week' },
  { key: 'month', labelKey: 'journeys.health.sleep.diary.month' },
  { key: 'all', labelKey: 'journeys.health.sleep.diary.all' },
];

/**
 * SleepDiary displays a filterable list of past sleep entries,
 * each showing the date, score, hours slept, and quality emoji.
 */
export const SleepDiary: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>('week');

  const filteredEntries = useMemo(() => {
    if (activeFilter === 'week') return MOCK_ENTRIES.slice(0, 7);
    if (activeFilter === 'month') return MOCK_ENTRIES;
    return MOCK_ENTRIES;
  }, [activeFilter]);

  const handleFilterPress = useCallback((filter: FilterPeriod) => {
    setActiveFilter(filter);
  }, []);

  const renderEntry = useCallback(
    ({ item }: ListRenderItemInfo<SleepEntry>) => {
      const scoreColor = getScoreColor(item.score);
      return (
        <Card journey="health" elevation="sm" padding="md">
          <View style={styles.entryRow} testID={`sleep-diary-entry-${item.id}`}>
            {/* Date & Time */}
            <View style={styles.entryDateCol}>
              <Text fontSize="md" fontWeight="semiBold">
                {item.date}
              </Text>
              <Text fontSize="xs" color={colors.gray[50]}>
                {item.bedtime} - {item.wakeTime}
              </Text>
            </View>

            {/* Score Badge */}
            <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
              <Text fontSize="sm" fontWeight="bold" color={colors.neutral.white}>
                {item.score}
              </Text>
            </View>

            {/* Hours */}
            <View style={styles.entryHoursCol}>
              <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.primary}>
                {item.hours}h
              </Text>
              <Text fontSize="xs" color={colors.gray[50]}>
                {t('journeys.health.sleep.diary.slept')}
              </Text>
            </View>

            {/* Quality Emoji */}
            <Text fontSize="xl">
              {QUALITY_EMOJIS[item.qualityLevel]}
            </Text>
          </View>
        </Card>
      );
    },
    [t],
  );

  const keyExtractor = useCallback((item: SleepEntry) => item.id, []);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="moon-outline"
          size={48}
          color={colors.gray[30]}
        />
        <Text fontSize="md" color={colors.gray[50]}>
          {t('journeys.health.sleep.diary.noEntries')}
        </Text>
      </View>
    ),
    [t],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('common.buttons.back')}
          accessibilityRole="button"
          testID="back-button"
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.journeys.health.primary}
          />
        </Touchable>
        <Text variant="heading" journey="health">
          {t('journeys.health.sleep.diary.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <Touchable
              key={filter.key}
              onPress={() => handleFilterPress(filter.key)}
              accessibilityLabel={t(filter.labelKey)}
              accessibilityRole="button"
              testID={`sleep-diary-filter-${filter.key}`}
              style={[
                styles.filterTab,
                isActive && styles.filterTabActive,
              ] as any}
            >
              <Text
                fontSize="sm"
                fontWeight={isActive ? 'semiBold' : 'regular'}
                color={
                  isActive
                    ? colors.journeys.health.primary
                    : colors.gray[50]
                }
              >
                {t(filter.labelKey)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Entry List */}
      <FlatList
        data={filteredEntries}
        renderItem={renderEntry}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        testID="sleep-diary-list"
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.journeys.health.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingValues.md,
    paddingTop: spacingValues['3xl'],
    paddingBottom: spacingValues.sm,
  },
  headerSpacer: {
    width: 40,
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: spacingValues.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[20],
    overflow: 'hidden',
    marginBottom: spacingValues.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacingValues.sm,
    alignItems: 'center',
    backgroundColor: colors.gray[0],
  },
  filterTabActive: {
    backgroundColor: colors.journeys.health.background,
  },
  listContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
    gap: spacingValues.sm,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
  },
  entryDateCol: {
    flex: 1,
    gap: spacingValues['4xs'],
  },
  scoreBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryHoursCol: {
    alignItems: 'center',
    gap: spacingValues['4xs'],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingValues['3xl'],
    gap: spacingValues.md,
  },
});

export default SleepDiary;
