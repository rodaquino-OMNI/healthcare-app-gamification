import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  TextInput,
  ScrollView,
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
 * Filter category for articles.
 */
type ArticleCategory = 'all' | 'fitness' | 'nutrition' | 'mental-health';

/**
 * A single article item.
 */
interface Article {
  id: string;
  title: string;
  category: Exclude<ArticleCategory, 'all'>;
  readTime: string;
  summary: string;
}

const FILTER_TABS: { key: ArticleCategory; labelKey: string }[] = [
  { key: 'all', labelKey: 'journeys.health.wellnessResources.articleList.filterAll' },
  { key: 'fitness', labelKey: 'journeys.health.wellnessResources.articleList.filterFitness' },
  { key: 'nutrition', labelKey: 'journeys.health.wellnessResources.articleList.filterNutrition' },
  { key: 'mental-health', labelKey: 'journeys.health.wellnessResources.articleList.filterMentalHealth' },
];

const MOCK_ARTICLES: Article[] = [
  {
    id: 'article-1',
    title: 'Building a Sustainable Exercise Routine',
    category: 'fitness',
    readTime: '6 min',
    summary: 'Learn how to create a workout schedule that fits your lifestyle and keeps you motivated.',
  },
  {
    id: 'article-2',
    title: 'Understanding Macronutrients',
    category: 'nutrition',
    readTime: '8 min',
    summary: 'A comprehensive guide to proteins, carbohydrates, and fats for optimal health.',
  },
  {
    id: 'article-3',
    title: 'Managing Stress Through Mindfulness',
    category: 'mental-health',
    readTime: '5 min',
    summary: 'Practical techniques for reducing stress and improving mental well-being.',
  },
  {
    id: 'article-4',
    title: 'The Science of Hydration',
    category: 'nutrition',
    readTime: '4 min',
    summary: 'Why water intake matters and how to stay properly hydrated throughout the day.',
  },
  {
    id: 'article-5',
    title: 'HIIT vs Steady-State Cardio',
    category: 'fitness',
    readTime: '7 min',
    summary: 'Comparing high-intensity interval training with traditional cardio for fitness goals.',
  },
  {
    id: 'article-6',
    title: 'Sleep Hygiene for Better Rest',
    category: 'mental-health',
    readTime: '5 min',
    summary: 'Evidence-based strategies to improve your sleep quality and duration.',
  },
];

const CATEGORY_COLORS: Record<Exclude<ArticleCategory, 'all'>, string> = {
  fitness: colors.semantic.success,
  nutrition: colors.semantic.info,
  'mental-health': colors.journeys.health.secondary,
};

/**
 * ArticleList displays a searchable and filterable list of wellness articles.
 */
export const ArticleList: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ArticleCategory>('all');

  const filteredArticles = useMemo(() => {
    let result = MOCK_ARTICLES;

    if (activeFilter !== 'all') {
      result = result.filter((a) => a.category === activeFilter);
    }

    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.summary.toLowerCase().includes(query),
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

  const handleFilterPress = useCallback((filter: ArticleCategory) => {
    setActiveFilter(filter);
  }, []);

  const handleArticlePress = useCallback(
    (articleId: string) => {
      navigation.navigate('HealthWellnessResourcesArticleDetail', { articleId });
    },
    [navigation],
  );

  const renderArticle = useCallback(
    ({ item }: ListRenderItemInfo<Article>) => (
      <Touchable
        onPress={() => handleArticlePress(item.id)}
        accessibilityLabel={item.title}
        accessibilityRole="button"
        testID={`wellness-resources-article-list-item-${item.id}`}
      >
        <Card journey="health" elevation="sm" padding="md">
          <View style={styles.articleRow}>
            {/* Thumbnail Placeholder */}
            <View style={styles.thumbnailPlaceholder}>
              <Ionicons
                name="book-outline"
                size={24}
                color={colors.journeys.health.primary}
              />
            </View>

            {/* Article Info */}
            <View style={styles.articleInfo}>
              <Text fontSize="md" fontWeight="semiBold" numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.articleMeta}>
                <View
                  style={[
                    styles.categoryTag,
                    { backgroundColor: CATEGORY_COLORS[item.category] },
                  ]}
                >
                  <Text fontSize="xs" fontWeight="semiBold" color={colors.neutral.white}>
                    {item.category}
                  </Text>
                </View>
                <View style={styles.readTimeBadge}>
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={colors.gray[50]}
                  />
                  <Text fontSize="xs" color={colors.gray[50]}>
                    {item.readTime}
                  </Text>
                </View>
              </View>
              <Text fontSize="xs" color={colors.gray[50]} numberOfLines={2}>
                {item.summary}
              </Text>
            </View>
          </View>
        </Card>
      </Touchable>
    ),
    [handleArticlePress],
  );

  const keyExtractor = useCallback((item: Article) => item.id, []);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="search-outline"
          size={48}
          color={colors.gray[30]}
        />
        <Text fontSize="md" color={colors.gray[50]}>
          {t('journeys.health.wellnessResources.articleList.noResults')}
        </Text>
      </View>
    ),
    [t],
  );

  return (
    <View style={styles.container} testID="wellness-resources-article-list-screen">
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('common.buttons.back')}
          accessibilityRole="button"
          testID="wellness-resources-article-list-back-button"
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.journeys.health.primary}
          />
        </Touchable>
        <Text variant="heading" journey="health">
          {t('journeys.health.wellnessResources.articleList.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.gray[40]}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t('journeys.health.wellnessResources.articleList.searchPlaceholder')}
            placeholderTextColor={colors.gray[40]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel={t('journeys.health.wellnessResources.articleList.searchPlaceholder')}
            testID="wellness-resources-article-list-search-input"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {FILTER_TABS.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <Touchable
              key={filter.key}
              onPress={() => handleFilterPress(filter.key)}
              accessibilityLabel={t(filter.labelKey)}
              accessibilityRole="button"
              testID={`wellness-resources-article-list-filter-${filter.key}`}
              style={[
                styles.filterChip,
                isActive && styles.filterChipActive,
              ] as any}
            >
              <Text
                fontSize="sm"
                fontWeight={isActive ? 'semiBold' : 'regular'}
                color={
                  isActive
                    ? colors.neutral.white
                    : colors.gray[60]
                }
              >
                {t(filter.labelKey)}
              </Text>
            </Touchable>
          );
        })}
      </ScrollView>

      {/* Article List */}
      <FlatList
        data={filteredArticles}
        renderItem={renderArticle}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        testID="wellness-resources-article-list-flatlist"
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
  searchContainer: {
    paddingHorizontal: spacingValues.md,
    marginBottom: spacingValues.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[0],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[20],
    paddingHorizontal: spacingValues.sm,
    gap: spacingValues.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacingValues.sm,
    fontSize: 14,
    color: colors.gray[70],
  },
  filterScroll: {
    paddingHorizontal: spacingValues.md,
    gap: spacingValues.xs,
    marginBottom: spacingValues.sm,
  },
  filterChip: {
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderRadius: 20,
    backgroundColor: colors.gray[0],
    borderWidth: 1,
    borderColor: colors.gray[20],
  },
  filterChipActive: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  listContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
    gap: spacingValues.sm,
  },
  articleRow: {
    flexDirection: 'row',
    gap: spacingValues.sm,
  },
  thumbnailPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.journeys.health.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleInfo: {
    flex: 1,
    gap: spacingValues['4xs'],
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.xs,
  },
  categoryTag: {
    paddingHorizontal: spacingValues.xs,
    paddingVertical: spacingValues['4xs'],
    borderRadius: 4,
  },
  readTimeBadge: {
    flexDirection: 'row',
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

export default ArticleList;
