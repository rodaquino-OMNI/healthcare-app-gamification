import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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
 * Route params for VideoPlayer screen.
 */
interface VideoPlayerRouteParams {
  videoId: string;
}

/**
 * A video resource with metadata.
 */
interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  author: string;
  category: string;
}

/**
 * A related video thumbnail card.
 */
interface RelatedVideo {
  id: string;
  title: string;
  duration: string;
}

const MOCK_CURRENT_VIDEO: Video = {
  id: 'vid-1',
  title: 'Mindful Breathing for Stress Relief',
  description:
    'Learn evidence-based breathing techniques to manage stress and anxiety in your daily life. This session covers diaphragmatic breathing, box breathing, and 4-7-8 technique with guided practice.',
  duration: '12:34',
  author: 'Dr. Ana Wellness',
  category: 'Mindfulness',
};

const MOCK_RELATED_VIDEOS: RelatedVideo[] = [
  { id: 'vid-2', title: 'Morning Yoga Flow', duration: '8:15' },
  { id: 'vid-3', title: 'Sleep Meditation', duration: '15:00' },
  { id: 'vid-4', title: 'Desk Stretches', duration: '6:42' },
];

/**
 * VideoPlayer displays a video with playback placeholder, metadata,
 * action buttons (share, bookmark), and related videos section.
 */
export const VideoPlayer: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const theme = useTheme();

  const { videoId } = route.params as VideoPlayerRouteParams;
  const [isBookmarked, setIsBookmarked] = useState(false);

  const currentVideo = useMemo(() => MOCK_CURRENT_VIDEO, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePlayPress = useCallback(() => {
    Alert.alert(
      t('journeys.health.wellnessResources.videoPlayer.playTitle'),
      t('journeys.health.wellnessResources.videoPlayer.playMessage'),
    );
  }, [t]);

  const handleShare = useCallback(() => {
    Alert.alert(
      t('journeys.health.wellnessResources.videoPlayer.shareTitle'),
      t('journeys.health.wellnessResources.videoPlayer.shareMessage'),
    );
  }, [t]);

  const handleBookmarkToggle = useCallback(() => {
    setIsBookmarked((prev) => !prev);
  }, []);

  const handleRelatedVideoPress = useCallback(
    (relatedId: string) => {
      navigation.navigate('HealthWellnessResourcesVideoPlayer', { videoId: relatedId });
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={handleGoBack}
          accessibilityLabel={t('common.buttons.back')}
          accessibilityRole="button"
          testID="wellness-resources-video-player-back"
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.journeys.health.primary}
          />
        </Touchable>
        <Text variant="heading" journey="health">
          {t('journeys.health.wellnessResources.videoPlayer.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID="wellness-resources-video-player-scroll"
      >
        {/* Video Placeholder (16:9) */}
        <Touchable
          onPress={handlePlayPress}
          accessibilityLabel={t('journeys.health.wellnessResources.videoPlayer.play')}
          accessibilityRole="button"
          testID="wellness-resources-video-player-play"
        >
          <View style={styles.videoPlaceholder}>
            <Ionicons
              name="play-circle"
              size={64}
              color={colors.neutral.white}
            />
            <View style={styles.durationBadge}>
              <Text fontSize="xs" color={colors.neutral.white}>
                {currentVideo.duration}
              </Text>
            </View>
          </View>
        </Touchable>

        {/* Video Info */}
        <View style={styles.infoSection}>
          <Text fontSize="lg" fontWeight="bold" journey="health">
            {currentVideo.title}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons
              name="person-outline"
              size={14}
              color={colors.gray[50]}
            />
            <Text fontSize="sm" color={colors.gray[50]}>
              {currentVideo.author}
            </Text>
            <View style={styles.metaDot} />
            <Ionicons
              name="pricetag-outline"
              size={14}
              color={colors.gray[50]}
            />
            <Text fontSize="sm" color={colors.gray[50]}>
              {currentVideo.category}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Card journey="health" elevation="sm" padding="md">
          <Text fontSize="md" color={colors.gray[60]}>
            {currentVideo.description}
          </Text>
        </Card>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <Touchable
            onPress={handleShare}
            accessibilityLabel={t('journeys.health.wellnessResources.videoPlayer.share')}
            accessibilityRole="button"
            testID="wellness-resources-video-player-share"
          >
            <View style={styles.actionButton}>
              <Ionicons
                name="share-outline"
                size={22}
                color={colors.journeys.health.primary}
              />
              <Text fontSize="sm" color={colors.journeys.health.primary}>
                {t('journeys.health.wellnessResources.videoPlayer.share')}
              </Text>
            </View>
          </Touchable>

          <Touchable
            onPress={handleBookmarkToggle}
            accessibilityLabel={t('journeys.health.wellnessResources.videoPlayer.bookmark')}
            accessibilityRole="button"
            testID="wellness-resources-video-player-bookmark"
          >
            <View style={styles.actionButton}>
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={colors.journeys.health.primary}
              />
              <Text fontSize="sm" color={colors.journeys.health.primary}>
                {t('journeys.health.wellnessResources.videoPlayer.bookmark')}
              </Text>
            </View>
          </Touchable>
        </View>

        {/* Related Videos */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.wellnessResources.videoPlayer.relatedVideos')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedScrollContent}
          >
            {MOCK_RELATED_VIDEOS.map((video) => (
              <Touchable
                key={video.id}
                onPress={() => handleRelatedVideoPress(video.id)}
                accessibilityLabel={video.title}
                accessibilityRole="button"
                testID={`wellness-resources-video-player-related-${video.id}`}
              >
                <View style={styles.relatedCard}>
                  <View style={styles.relatedThumbnail}>
                    <Ionicons
                      name="play-circle-outline"
                      size={28}
                      color={colors.neutral.white}
                    />
                  </View>
                  <View style={styles.relatedInfo}>
                    <Text fontSize="sm" fontWeight="medium" numberOfLines={2}>
                      {video.title}
                    </Text>
                    <View style={styles.relatedDurationRow}>
                      <Ionicons
                        name="time-outline"
                        size={12}
                        color={colors.gray[40]}
                      />
                      <Text fontSize="xs" color={colors.gray[40]}>
                        {video.duration}
                      </Text>
                    </View>
                  </View>
                </View>
              </Touchable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.gray[80],
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingValues.md,
  },
  durationBadge: {
    position: 'absolute',
    bottom: spacingValues.sm,
    right: spacingValues.sm,
    backgroundColor: colors.gray[70],
    borderRadius: 4,
    paddingHorizontal: spacingValues.xs,
    paddingVertical: spacingValues['4xs'],
  },
  infoSection: {
    marginBottom: spacingValues.md,
    gap: spacingValues.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.xs,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[30],
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacingValues['2xl'],
    marginTop: spacingValues.md,
    marginBottom: spacingValues.md,
  },
  actionButton: {
    alignItems: 'center',
    gap: spacingValues['4xs'],
  },
  sectionContainer: {
    marginTop: spacingValues.xl,
    gap: spacingValues.sm,
  },
  relatedScrollContent: {
    gap: spacingValues.sm,
  },
  relatedCard: {
    width: 160,
    borderRadius: 8,
    backgroundColor: colors.gray[0],
    overflow: 'hidden',
  },
  relatedThumbnail: {
    width: 160,
    height: 90,
    backgroundColor: colors.gray[70],
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedInfo: {
    padding: spacingValues.xs,
    gap: spacingValues['4xs'],
  },
  relatedDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues['4xs'],
  },
});

export default VideoPlayer;
