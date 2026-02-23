import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Content type for bookmarked items.
 */
type ContentType = 'article' | 'video' | 'program';

/**
 * A bookmarked content item.
 */
interface BookmarkedItem {
  id: string;
  title: string;
  summary: string;
  type: ContentType;
}

const TYPE_ICONS: Record<ContentType, keyof typeof Ionicons.glyphMap> = {
  article: 'document-text-outline',
  video: 'videocam-outline',
  program: 'school-outline',
};

const TYPE_LABELS: Record<ContentType, string> = {
  article: 'Article',
  video: 'Video',
  program: 'Program',
};

const MOCK_BOOKMARKS: BookmarkedItem[] = [
  {
    id: 'bm-1',
    title: '10 Tips for Better Sleep Hygiene',
    summary: 'Discover evidence-based strategies to improve your sleep quality and establish a healthy bedtime routine.',
    type: 'article',
  },
  {
    id: 'bm-2',
    title: 'Mindful Breathing for Stress Relief',
    summary: 'A guided video session covering diaphragmatic breathing, box breathing, and the 4-7-8 technique.',
    type: 'video',
  },
  {
    id: 'bm-3',
    title: 'Stress Management Essentials',
    summary: 'A 4-week program designed to help you understand stress triggers and build long-term resilience.',
    type: 'program',
  },
  {
    id: 'bm-4',
    title: 'Understanding Nutrition Labels',
    summary: 'Learn how to read and interpret nutrition labels to make healthier food choices every day.',
    type: 'article',
  },
];

/**
 * WellnessBookmarks displays a list of saved content items (articles, videos, programs)
 * with the ability to remove bookmarks. Shows an empty state when no bookmarks exist.
 */
export const WellnessBookmarks: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();

  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>(MOCK_BOOKMARKS);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleRemoveBookmark = useCallback((itemId: string) => {
    setBookmarks((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const handleBrowseResources = useCallback(() => {
    navigation.navigate('WellnessResourcesHome');
  }, [navigation]);

  const renderBookmarkItem = useCallback(
    ({ item }: ListRenderItemInfo<BookmarkedItem>) => {
      const icon = TYPE_ICONS[item.type];
      const typeLabel = TYPE_LABELS[item.type];

      return (
        <Card journey="health" elevation="sm" padding="md">
          <View style={styles.itemRow}>
            {/* Icon & Badge */}
            <View style={styles.iconContainer}>
              <Ionicons
                name={icon}
                size={24}
                color={colors.journeys.health.primary}
              />
            </View>

            {/* Content */}
            <View style={styles.itemContent}>
              <View style={styles.typeBadge}>
                <Text fontSize="xs" color={colors.journeys.health.primary}>
                  {typeLabel}
                </Text>
              </View>
              <Text fontSize="md" fontWeight="semiBold">
                {item.title}
              </Text>
              <Text
                fontSize="sm"
                color={colors.gray[50]}
                numberOfLines={2}
              >
                {item.summary}
              </Text>
            </View>

            {/* Remove Button */}
            <Touchable
              onPress={() => handleRemoveBookmark(item.id)}
              accessibilityLabel={t('journeys.health.wellnessResources.bookmarks.remove')}
              accessibilityRole="button"
              testID={`wellness-resources-bookmarks-remove-${item.id}`}
            >
              <View style={styles.removeButton}>
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={colors.semantic.error}
                />
              </View>
            </Touchable>
          </View>
        </Card>
      );
    },
    [handleRemoveBookmark, t],
  );

  const keyExtractor = useCallback((item: BookmarkedItem) => item.id, []);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="bookmark-outline"
          size={56}
          color={colors.gray[30]}
        />
        <Text fontSize="lg" fontWeight="semiBold" color={colors.gray[50]}>
          {t('journeys.health.wellnessResources.bookmarks.emptyTitle')}
        </Text>
        <Text fontSize="sm" color={colors.gray[40]} style={styles.emptySubtext}>
          {t('journeys.health.wellnessResources.bookmarks.emptyMessage')}
        </Text>
        <View style={styles.emptyCtaContainer}>
          <Button
            journey="health"
            onPress={handleBrowseResources}
            accessibilityLabel={t('journeys.health.wellnessResources.bookmarks.browse')}
            testID="wellness-resources-bookmarks-browse"
          >
            {t('journeys.health.wellnessResources.bookmarks.browse')}
          </Button>
        </View>
      </View>
    ),
    [handleBrowseResources, t],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={handleGoBack}
          accessibilityLabel={t('common.buttons.back')}
          accessibilityRole="button"
          testID="wellness-resources-bookmarks-back"
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.journeys.health.primary}
          />
        </Touchable>
        <Text variant="heading" journey="health">
          {t('journeys.health.wellnessResources.bookmarks.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Bookmarks List */}
      <FlatList
        data={bookmarks}
        renderItem={renderBookmarkItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        testID="wellness-resources-bookmarks-list"
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
  listContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
    gap: spacingValues.sm,
    flexGrow: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacingValues.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.journeys.health.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
    gap: spacingValues['4xs'],
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacingValues.xs,
    paddingVertical: spacingValues['4xs'],
    borderRadius: 4,
    backgroundColor: colors.journeys.health.background,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingValues['5xl'],
    gap: spacingValues.sm,
  },
  emptySubtext: {
    textAlign: 'center',
    paddingHorizontal: spacingValues['2xl'],
  },
  emptyCtaContainer: {
    marginTop: spacingValues.md,
    width: '80%',
  },
});

export default WellnessBookmarks;
