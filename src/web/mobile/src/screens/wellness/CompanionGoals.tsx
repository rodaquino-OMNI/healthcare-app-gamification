import React, { useState, useCallback } from 'react';
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
import type { Theme } from '../../../../design-system/src/themes/base.theme';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { sizingValues } from '../../../../design-system/src/tokens/sizing';
import { ROUTES } from '../../constants/routes';
import type { WellnessNavigationProp } from '../../navigation/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GoalCategory = 'fitness' | 'nutrition' | 'sleep' | 'mindfulness';

interface WellnessGoal {
  id: string;
  titleKey: string;
  category: GoalCategory;
  progress: number;
  target: number;
  icon: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_GOALS: WellnessGoal[] = [
  { id: 'g-1', titleKey: 'journeys.health.wellness.goals.walkSteps', category: 'fitness', progress: 7200, target: 10000, icon: '\u{1F6B6}' },
  { id: 'g-2', titleKey: 'journeys.health.wellness.goals.drinkWater', category: 'nutrition', progress: 5, target: 8, icon: '\u{1F4A7}' },
  { id: 'g-3', titleKey: 'journeys.health.wellness.goals.sleepHours', category: 'sleep', progress: 7, target: 8, icon: '\u{1F634}' },
  { id: 'g-4', titleKey: 'journeys.health.wellness.goals.meditateMinutes', category: 'mindfulness', progress: 10, target: 15, icon: '\u{1F9D8}' },
  { id: 'g-5', titleKey: 'journeys.health.wellness.goals.eatFruits', category: 'nutrition', progress: 2, target: 5, icon: '\u{1F34E}' },
  { id: 'g-6', titleKey: 'journeys.health.wellness.goals.stretchSession', category: 'fitness', progress: 1, target: 2, icon: '\u{1F938}' },
];

const CATEGORY_COLORS: Record<GoalCategory, string> = {
  fitness: colors.journeys.health.primary,
  nutrition: colors.semantic.success,
  sleep: colors.brand.tertiary,
  mindfulness: colors.brand.secondary,
};

const CATEGORY_ICONS: Record<GoalCategory, string> = {
  fitness: '\u{1F4AA}',
  nutrition: '\u{1F957}',
  sleep: '\u{1F319}',
  mindfulness: '\u{1F9D8}',
};

const CATEGORIES: GoalCategory[] = ['fitness', 'nutrition', 'sleep', 'mindfulness'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CompanionGoalsScreen: React.FC = () => {
  const navigation = useNavigation<WellnessNavigationProp>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | 'all'>('all');

  const filteredGoals = selectedCategory === 'all'
    ? MOCK_GOALS
    : MOCK_GOALS.filter((g) => g.category === selectedCategory);

  const overallProgress = MOCK_GOALS.reduce((acc, g) => acc + g.progress / g.target, 0) / MOCK_GOALS.length;

  const handleGoToDailyPlan = useCallback(() => {
    navigation.navigate(ROUTES.WELLNESS_DAILY_PLAN as 'WellnessDailyPlan');
  }, [navigation]);

  const renderProgressRing = (progress: number, size: number, strokeWidth: number, ringColor: string) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const filledAngle = Math.min(progress, 1) * 360;

    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {/* Background ring */}
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: theme.colors.border.default,
          }}
        />
        {/* Filled ring (partial overlay) */}
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: ringColor,
            borderTopColor: filledAngle > 90 ? ringColor : 'transparent',
            borderRightColor: filledAngle > 180 ? ringColor : 'transparent',
            borderBottomColor: filledAngle > 270 ? ringColor : 'transparent',
            borderLeftColor: filledAngle > 0 ? ringColor : 'transparent',
            transform: [{ rotate: '-90deg' }],
          }}
        />
        <Text style={[styles.ringPercentage, { fontSize: size > 80 ? 20 : 12 }]}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
    );
  };

  const renderGoalItem = ({ item }: { item: WellnessGoal }) => {
    const progress = Math.min(item.progress / item.target, 1);
    const ringColor = CATEGORY_COLORS[item.category];
    return (
      <View style={styles.goalCard} testID={`goal-card-${item.id}`}>
        <View style={styles.goalLeft}>
          {renderProgressRing(progress, 48, 4, ringColor)}
        </View>
        <View style={styles.goalContent}>
          <Text style={styles.goalTitle}>{t(item.titleKey)}</Text>
          <Text style={styles.goalProgress}>
            {item.progress} / {item.target}
          </Text>
          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress * 100}%`, backgroundColor: ringColor },
              ]}
            />
          </View>
        </View>
        <Text style={styles.goalIcon}>{item.icon}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} testID="wellness-goals-screen">
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
          {t('journeys.health.wellness.goals.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Overall Progress Ring */}
      <View style={styles.overallContainer}>
        {renderProgressRing(overallProgress, 100, 6, colors.brand.primary)}
        <Text style={styles.overallLabel}>
          {t('journeys.health.wellness.goals.overallProgress')}
        </Text>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          onPress={() => setSelectedCategory('all')}
          style={[styles.categoryChip, selectedCategory === 'all' && styles.categoryChipActive]}
          accessibilityLabel={t('journeys.health.wellness.goals.allCategories')}
          accessibilityState={{ selected: selectedCategory === 'all' }}
        >
          <Text style={[styles.categoryChipText, selectedCategory === 'all' && styles.categoryChipTextActive]}>
            {t('journeys.health.wellness.goals.allCategories')}
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryChip,
                isActive && { backgroundColor: CATEGORY_COLORS[cat] },
              ]}
              accessibilityLabel={t(`journeys.health.wellness.goals.category.${cat}`)}
              accessibilityState={{ selected: isActive }}
            >
              <Text style={styles.categoryIcon}>{CATEGORY_ICONS[cat]}</Text>
              <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                {t(`journeys.health.wellness.goals.category.${cat}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Goal List */}
      <FlatList
        data={filteredGoals}
        keyExtractor={(item) => item.id}
        renderItem={renderGoalItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{'\u{1F3AF}'}</Text>
            <Text style={styles.emptyText}>
              {t('journeys.health.wellness.goals.noGoals')}
            </Text>
          </View>
        }
      />

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.addButton}
          accessibilityLabel={t('journeys.health.wellness.goals.addGoal')}
        >
          <Text style={styles.addButtonText}>
            {t('journeys.health.wellness.goals.addGoal')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleGoToDailyPlan}
          style={styles.dailyPlanButton}
          accessibilityLabel={t('journeys.health.wellness.goals.viewDailyPlan')}
        >
          <Text style={styles.dailyPlanText}>
            {t('journeys.health.wellness.goals.viewDailyPlan')}
          </Text>
        </TouchableOpacity>
      </View>
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
    overallContainer: {
      alignItems: 'center',
      paddingVertical: spacingValues.lg,
    },
    overallLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text.muted,
      marginTop: spacingValues.xs,
    },
    categoriesContainer: {
      maxHeight: 48,
    },
    categoriesContent: {
      paddingHorizontal: spacingValues.md,
      gap: spacingValues.xs,
      alignItems: 'center',
    },
    categoryChip: {
      flexDirection: 'row',
      paddingVertical: spacingValues.xs,
      paddingHorizontal: spacingValues.md,
      borderRadius: borderRadiusValues.full,
      borderWidth: 1,
      borderColor: colors.brand.primary,
      alignItems: 'center',
      gap: spacingValues['3xs'],
    },
    categoryChipActive: {
      backgroundColor: colors.brand.primary,
    },
    categoryIcon: {
      fontSize: 14,
    },
    categoryChipText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.brand.primary,
    },
    categoryChipTextActive: {
      color: theme.colors.text.onBrand,
    },
    listContent: {
      paddingHorizontal: spacingValues.md,
      paddingTop: spacingValues.md,
      paddingBottom: spacingValues.md,
    },
    goalCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.default,
      borderRadius: borderRadiusValues.lg,
      padding: spacingValues.md,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    goalLeft: {
      marginRight: spacingValues.sm,
    },
    goalContent: {
      flex: 1,
    },
    goalTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.default,
    },
    goalProgress: {
      fontSize: 12,
      color: theme.colors.text.muted,
      marginTop: spacingValues['4xs'],
    },
    progressBarBg: {
      height: 6,
      backgroundColor: theme.colors.border.default,
      borderRadius: borderRadiusValues.full,
      marginTop: spacingValues.xs,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: borderRadiusValues.full,
    },
    goalIcon: {
      fontSize: 24,
      marginLeft: spacingValues.xs,
    },
    ringPercentage: {
      fontWeight: '700',
      color: theme.colors.text.default,
    },
    separator: {
      height: spacingValues.xs,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingTop: spacingValues['5xl'],
      gap: spacingValues.xs,
    },
    emptyIcon: {
      fontSize: 48,
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.text.muted,
      textAlign: 'center',
    },
    bottomActions: {
      paddingHorizontal: spacingValues.md,
      paddingVertical: spacingValues.sm,
      gap: spacingValues.xs,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.default,
      backgroundColor: theme.colors.background.default,
    },
    addButton: {
      backgroundColor: colors.brand.primary,
      borderRadius: borderRadiusValues.full,
      paddingVertical: spacingValues.sm,
      alignItems: 'center',
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.onBrand,
    },
    dailyPlanButton: {
      borderRadius: borderRadiusValues.full,
      paddingVertical: spacingValues.sm,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.brand.primary,
    },
    dailyPlanText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.brand.primary,
    },
  });

export default CompanionGoalsScreen;
