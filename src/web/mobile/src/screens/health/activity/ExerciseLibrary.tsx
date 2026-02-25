import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
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
 * Exercise category type.
 */
type ExerciseCategory = 'all' | 'cardio' | 'strength' | 'flexibility' | 'balance';

/**
 * Difficulty level type.
 */
type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Exercise item.
 */
interface Exercise {
  id: string;
  nameKey: string;
  category: Exclude<ExerciseCategory, 'all'>;
  difficulty: Difficulty;
  icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORY_FILTERS: { id: ExerciseCategory; labelKey: string }[] = [
  { id: 'all', labelKey: 'journeys.health.activity.exerciseLibrary.filterAll' },
  { id: 'cardio', labelKey: 'journeys.health.activity.exerciseLibrary.filterCardio' },
  { id: 'strength', labelKey: 'journeys.health.activity.exerciseLibrary.filterStrength' },
  { id: 'flexibility', labelKey: 'journeys.health.activity.exerciseLibrary.filterFlexibility' },
  { id: 'balance', labelKey: 'journeys.health.activity.exerciseLibrary.filterBalance' },
];

const MOCK_EXERCISES: Exercise[] = [
  { id: 'ex-1', nameKey: 'journeys.health.activity.exerciseLibrary.exercises.running', category: 'cardio', difficulty: 'medium', icon: 'fitness-outline' },
  { id: 'ex-2', nameKey: 'journeys.health.activity.exerciseLibrary.exercises.cycling', category: 'cardio', difficulty: 'medium', icon: 'bicycle-outline' },
  { id: 'ex-3', nameKey: 'journeys.health.activity.exerciseLibrary.exercises.walking', category: 'cardio', difficulty: 'easy', icon: 'walk-outline' },
  { id: 'ex-4', nameKey: 'journeys.health.activity.exerciseLibrary.exercises.squats', category: 'strength', difficulty: 'medium', icon: 'barbell-outline' },
  { id: 'ex-5', nameKey: 'journeys.health.activity.exerciseLibrary.exercises.pushups', category: 'strength', difficulty: 'hard', icon: 'body-outline' },
  { id: 'ex-6', nameKey: 'journeys.health.activity.exerciseLibrary.exercises.deadlift', category: 'strength', difficulty: 'hard', icon: 'barbell-outline' },
  { id: 'ex-7', nameKey: 'journeys.health.activity.exerciseLibrary.exercises.yoga', category: 'flexibility', difficulty: 'easy', icon: 'body-outline' },
  { id: 'ex-8', nameKey: 'journeys.health.activity.exerciseLibrary.exercises.stretching', category: 'flexibility', difficulty: 'easy', icon: 'body-outline' },
  { id: 'ex-9', nameKey: 'journeys.health.activity.exerciseLibrary.exercises.taiChi', category: 'balance', difficulty: 'medium', icon: 'body-outline' },
  { id: 'ex-10', nameKey: 'journeys.health.activity.exerciseLibrary.exercises.singleLegStand', category: 'balance', difficulty: 'easy', icon: 'body-outline' },
];

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: colors.semantic.success,
  medium: colors.semantic.warning,
  hard: colors.semantic.error,
};

/**
 * ExerciseLibrary displays a searchable, filterable list of exercises
 * organized by category with difficulty indicators.
 */
export const ExerciseLibrary: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory>('all');

  const filteredExercises = useMemo(() => {
    let exercises = MOCK_EXERCISES;

    if (selectedCategory !== 'all') {
      exercises = exercises.filter((ex) => ex.category === selectedCategory);
    }

    if (searchQuery.trim().length > 0) {
      const query = searchQuery.trim().toLowerCase();
      exercises = exercises.filter((ex) => {
        const name = t(ex.nameKey).toLowerCase();
        return name.includes(query);
      });
    }

    return exercises;
  }, [selectedCategory, searchQuery, t]);

  const handleCategoryChange = useCallback((category: ExerciseCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleExercisePress = useCallback(
    (exerciseId: string) => {
      navigation.navigate('HealthActivityExerciseDetail', { exerciseId });
    },
    [navigation],
  );

  const renderExercise = useCallback(
    ({ item }: ListRenderItemInfo<Exercise>) => (
      <Touchable
        onPress={() => handleExercisePress(item.id)}
        accessibilityLabel={t(item.nameKey)}
        accessibilityRole="button"
        testID={`activity-exercise-library-item-${item.id}`}
      >
        <Card journey="health" elevation="sm" padding="md">
          <View style={styles.exerciseRow}>
            <View style={styles.exerciseIconContainer}>
              <Ionicons
                name={item.icon}
                size={24}
                color={colors.journeys.health.primary}
              />
            </View>
            <View style={styles.exerciseInfo}>
              <Text fontSize="md" fontWeight="semiBold">
                {t(item.nameKey)}
              </Text>
              <Text fontSize="xs" color={colors.gray[40]}>
                {t(`journeys.health.activity.exerciseLibrary.category${item.category.charAt(0).toUpperCase()}${item.category.slice(1)}`)}
              </Text>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: DIFFICULTY_COLORS[item.difficulty] },
              ]}
            >
              <Text fontSize="xs" fontWeight="semiBold" color={colors.gray[0]}>
                {t(`journeys.health.activity.exerciseLibrary.difficulty${item.difficulty.charAt(0).toUpperCase()}${item.difficulty.slice(1)}`)}
              </Text>
            </View>
          </View>
        </Card>
      </Touchable>
    ),
    [handleExercisePress, t],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Ionicons
          name="search-outline"
          size={40}
          color={colors.gray[30]}
        />
        <Text fontSize="md" fontWeight="medium" color={colors.gray[40]}>
          {t('journeys.health.activity.exerciseLibrary.noResults')}
        </Text>
        <Text fontSize="sm" color={colors.gray[30]}>
          {t('journeys.health.activity.exerciseLibrary.noResultsDesc')}
        </Text>
      </View>
    ),
    [t],
  );

  const keyExtractor = useCallback((item: Exercise) => item.id, []);

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
          {t('journeys.health.activity.exerciseLibrary.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.gray[40]}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t('journeys.health.activity.exerciseLibrary.searchPlaceholder')}
            placeholderTextColor={colors.gray[30]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            testID="activity-exercise-library-search"
            accessibilityLabel={t('journeys.health.activity.exerciseLibrary.searchPlaceholder')}
          />
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filterContainer}>
        {CATEGORY_FILTERS.map((filter) => (
          <Touchable
            key={filter.id}
            onPress={() => handleCategoryChange(filter.id)}
            accessibilityLabel={t(filter.labelKey)}
            accessibilityRole="button"
            testID={`activity-exercise-library-filter-${filter.id}`}
            style={[
              styles.filterChip,
              selectedCategory === filter.id && styles.filterChipActive,
            ] as any}
          >
            <Text
              fontSize="sm"
              fontWeight={selectedCategory === filter.id ? 'semiBold' : 'regular'}
              color={
                selectedCategory === filter.id
                  ? colors.journeys.health.primary
                  : colors.gray[50]
              }
            >
              {t(filter.labelKey)}
            </Text>
          </Touchable>
        ))}
      </View>

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        renderItem={renderExercise}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        testID="activity-exercise-library-list"
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
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
  searchContainer: {
    paddingHorizontal: spacingValues.md,
    paddingTop: spacingValues.sm,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[20],
    borderRadius: 8,
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues.xs,
    backgroundColor: colors.gray[0],
    gap: spacingValues.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[60],
    paddingVertical: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    gap: spacingValues.xs,
  },
  filterChip: {
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[20],
    backgroundColor: colors.gray[0],
  },
  filterChipActive: {
    backgroundColor: colors.journeys.health.background,
    borderColor: colors.journeys.health.primary,
  },
  listContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  listSeparator: {
    height: spacingValues.sm,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.journeys.health.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingValues.md,
  },
  exerciseInfo: {
    flex: 1,
    gap: spacingValues['4xs'],
  },
  difficultyBadge: {
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues['4xs'],
    borderRadius: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacingValues['3xl'],
    gap: spacingValues.sm,
  },
});

export default ExerciseLibrary;
