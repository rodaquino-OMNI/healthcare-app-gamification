import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
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
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Filter category for videos.
 */
type VideoCategory = 'all' | 'fitness' | 'yoga' | 'meditation' | 'nutrition';

/**
 * A single video item.
 */
interface Video {
  id: string;
  title: string;
  category: Exclude<VideoCategory, 'all'>;
  duration: string;
  description: string;
}

const FILTER_TABS: { key: VideoCategory; labelKey: string }[] = [
  { key: 'all', labelKey: 'journeys.health.wellnessResources.videoLibrary.filterAll' },
  { key: 'fitness', labelKey: 'journeys.health.wellnessResources.videoLibrary.filterFitness' },
  { key: 'yoga', labelKey: 'journeys.health.wellnessResources.videoLibrary.filterYoga' },
  { key: 'meditation', labelKey: 'journeys.health.wellnessResources.videoLibrary.filterMeditation' },
  { key: 'nutrition', labelKey: 'journeys.health.wellnessResources.videoLibrary.filterNutrition' },
];

const MOCK_VIDEOS: Video[] = [
  {
    id: 'video-1',
    title: 'Morning Yoga Flow',
    category: 'yoga',
    duration: '12:30',
    description: 'Start your day with this energizing 12-minute yoga sequence.',
  },
  {
    id: 'video-2',
    title: 'Full Body HIIT Workout',
    category: 'fitness',
    duration: '25:00',
    description: 'High-intensity interval training for total body conditioning.',
  },
  {
    id: 'video-3',
    title: 'Guided Sleep Meditation',
    category: 'meditation',
    duration: '18:45',
    description: 'Relax and prepare for restful sleep with this guided session.',
  },
  {
    id: 'video-4',
    title: 'Healthy Meal Prep Basics',
    category: 'nutrition',
    duration: '15:20',
    description: 'Learn to prepare a week of nutritious meals in under an hour.',
  },
  {
    id: 'video-5',
    title: 'Stress Relief Stretching',
    category: 'yoga',
    duration: '10:00',
    description: 'Gentle stretches to release tension and reduce stress.',
  },
  {
    id: 'video-6',
    title: 'Core Strength Fundamentals',
    category: 'fitness',
    duration: '20:15',
    description: 'Build a strong foundation with these essential core exercises.',
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = spacingValues.sm;
const CARD_WIDTH = (SCREEN_WIDTH - spacingValues.md * 2 - COLUMN_GAP) / 2;
const THUMBNAIL_HEIGHT = CARD_WIDTH * 0.65;

/**
 * VideoLibrary displays a filterable grid of wellness video content.
 */
export const VideoLibrary: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeFilter, setActiveFilter] = useState<VideoCategory>('all');

  const filteredVideos = useMemo(() => {
    if (activeFilter === 'all') return MOCK_VIDEOS;
    return MOCK_VIDEOS.filter((v) => v.category === activeFilter);
  }, [activeFilter]);

  const handleFilterPress = useCallback((filter: VideoCategory) => {
    setActiveFilter(filter);
  }, []);

  const handleVideoPress = useCallback(
    (videoId: string) => {
      navigation.navigate('HealthWellnessResourcesVideoPlayer', { videoId });
    },
    [navigation],
  );

  const renderVideo = useCallback(
    ({ item }: ListRenderItemInfo<Video>) => (
      <Touchable
        onPress={() => handleVideoPress(item.id)}
        accessibilityLabel={item.title}
        accessibilityRole="button"
        testID={`wellness-resources-video-library-item-${item.id}`}
        style={styles.videoCardTouchable}
      >
        <View style={styles.videoCard}>
          {/* Thumbnail with Play Overlay */}
          <View style={styles.thumbnailContainer}>
            <Ionicons
              name="videocam-outline"
              size={28}
              color={colors.journeys.health.primary}
            />
            <View style={styles.playOverlay}>
              <Ionicons
                name="play-circle-outline"
                size={36}
                color={colors.neutral.white}
              />
            </View>
            {/* Duration Badge */}
            <View style={styles.durationBadge}>
              <Text fontSize="xs" fontWeight="semiBold" color={colors.neutral.white}>
                {item.duration}
              </Text>
            </View>
          </View>

          {/* Video Info */}
          <View style={styles.videoInfo}>
            <Text fontSize="sm" fontWeight="semiBold" numberOfLines={2}>
              {item.title}
            </Text>
            <Text fontSize="xs" color={colors.gray[50]} numberOfLines={1}>
              {item.category}
            </Text>
          </View>
        </View>
      </Touchable>
    ),
    [handleVideoPress],
  );

  const keyExtractor = useCallback((item: Video) => item.id, []);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="videocam-off-outline"
          size={48}
          color={colors.gray[30]}
        />
        <Text fontSize="md" color={colors.gray[50]}>
          {t('journeys.health.wellnessResources.videoLibrary.noResults')}
        </Text>
      </View>
    ),
    [t],
  );

  const renderColumnWrapper = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <View style={styles.columnWrapper}>{children}</View>
    ),
    [],
  );

  return (
    <View style={styles.container} testID="wellness-resources-video-library-screen">
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('common.buttons.back')}
          accessibilityRole="button"
          testID="wellness-resources-video-library-back-button"
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.journeys.health.primary}
          />
        </Touchable>
        <Text variant="heading" journey="health">
          {t('journeys.health.wellnessResources.videoLibrary.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Category Filter Chips */}
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
              testID={`wellness-resources-video-library-filter-${filter.key}`}
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

      {/* Video Grid */}
      <FlatList
        data={filteredVideos}
        renderItem={renderVideo}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        testID="wellness-resources-video-library-flatlist"
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
  columnWrapper: {
    justifyContent: 'space-between',
  },
  videoCardTouchable: {
    width: CARD_WIDTH,
  },
  videoCard: {
    borderRadius: 12,
    backgroundColor: colors.gray[0],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray[10],
  },
  thumbnailContainer: {
    width: '100%',
    height: THUMBNAIL_HEIGHT,
    backgroundColor: colors.journeys.health.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: spacingValues['4xs'],
    right: spacingValues['4xs'],
    paddingHorizontal: spacingValues.xs,
    paddingVertical: spacingValues['4xs'],
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  videoInfo: {
    padding: spacingValues.sm,
    gap: spacingValues['4xs'],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingValues['3xl'],
    gap: spacingValues.md,
  },
});

export default VideoLibrary;
