import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import type { WellnessNavigationProp, WellnessScreenProps } from '../../navigation/types';

/**
 * Represents a wellness tip article.
 */
interface WellnessTip {
  id: string;
  titleKey: string;
  bodyKey: string;
  category: string;
  readTimeKey: string;
  icon: string;
}

/**
 * Represents a related tip suggestion.
 */
interface RelatedTip {
  id: string;
  titleKey: string;
  icon: string;
}

/**
 * Mock tip detail data for development.
 */
const MOCK_TIP: WellnessTip = {
  id: 'tip-001',
  titleKey: 'journeys.health.wellness.tipDetail.tipTitle',
  bodyKey: 'journeys.health.wellness.tipDetail.tipBody',
  category: 'journeys.health.wellness.tipDetail.categoryMindfulness',
  readTimeKey: 'journeys.health.wellness.tipDetail.readTime',
  icon: '\u{1F9D8}',
};

/**
 * Mock related tips data for development.
 */
const MOCK_RELATED_TIPS: RelatedTip[] = [
  { id: 'tip-002', titleKey: 'journeys.health.wellness.tipDetail.relatedTip1', icon: '\u{1F4AA}' },
  { id: 'tip-003', titleKey: 'journeys.health.wellness.tipDetail.relatedTip2', icon: '\u{1F34E}' },
  { id: 'tip-004', titleKey: 'journeys.health.wellness.tipDetail.relatedTip3', icon: '\u{1F634}' },
];

/**
 * CompanionWellnessTipScreen displays a wellness tip article
 * with share functionality and related tips.
 */
export const CompanionWellnessTipScreen: React.FC = () => {
  const navigation = useNavigation<WellnessNavigationProp>();
  const route = useRoute<WellnessScreenProps<'WellnessTipDetail'>['route']>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const _tipId = route.params?.tipId;
  const tip = MOCK_TIP;

  const handleShare = () => {
    // Share functionality placeholder
  };

  const handleRelatedTipPress = (relatedTipId: string) => {
    navigation.push('WellnessTipDetail', { tipId: relatedTipId });
  };

  return (
    <SafeAreaView style={styles.container} testID="wellness-tip-detail-screen">
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel={t('common.buttons.back')}
        >
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>
          {t('journeys.health.wellness.tipDetail.screenTitle')}
        </Text>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.shareButton}
          accessibilityLabel={t('journeys.health.wellness.tipDetail.share')}
          accessibilityRole="button"
          testID="tip-share-button"
        >
          <Text style={styles.shareIcon}>{'\u2197'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image placeholder */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageEmoji}>{tip.icon}</Text>
        </View>

        {/* Category + Read time */}
        <View style={styles.metaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{t(tip.category)}</Text>
          </View>
          <Text style={styles.readTime}>{t(tip.readTimeKey)}</Text>
        </View>

        {/* Title */}
        <Text style={styles.tipTitle}>{t(tip.titleKey)}</Text>

        {/* Body */}
        <Text style={styles.tipBody}>{t(tip.bodyKey)}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Related Tips */}
        <Text style={styles.relatedTitle}>
          {t('journeys.health.wellness.tipDetail.relatedTips')}
        </Text>
        {MOCK_RELATED_TIPS.map((related) => (
          <TouchableOpacity
            key={related.id}
            style={styles.relatedItem}
            onPress={() => handleRelatedTipPress(related.id)}
            accessibilityLabel={t(related.titleKey)}
            accessibilityRole="button"
            testID={`related-tip-${related.id}`}
          >
            <Text style={styles.relatedIcon}>{related.icon}</Text>
            <Text style={styles.relatedLabel}>{t(related.titleKey)}</Text>
            <Text style={styles.relatedArrow}>{'\u203A'}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    shareButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shareIcon: {
      fontSize: 20,
      color: theme.colors.text.onBrand,
    },
    scrollContent: {
      paddingBottom: spacingValues['5xl'],
    },
    imagePlaceholder: {
      height: 200,
      backgroundColor: colors.brand.secondary + '15',
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageEmoji: {
      fontSize: 72,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacingValues.md,
      paddingTop: spacingValues.md,
      gap: spacingValues.sm,
    },
    categoryBadge: {
      paddingVertical: spacingValues['3xs'],
      paddingHorizontal: spacingValues.sm,
      backgroundColor: colors.brand.primary + '20',
      borderRadius: borderRadiusValues.full,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.brand.primary,
    },
    readTime: {
      fontSize: 12,
      color: theme.colors.text.muted,
    },
    tipTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text.default,
      paddingHorizontal: spacingValues.md,
      marginTop: spacingValues.sm,
    },
    tipBody: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text.default,
      paddingHorizontal: spacingValues.md,
      marginTop: spacingValues.md,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border.default,
      marginHorizontal: spacingValues.md,
      marginVertical: spacingValues.lg,
    },
    relatedTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text.default,
      paddingHorizontal: spacingValues.md,
      marginBottom: spacingValues.sm,
    },
    relatedItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacingValues.md,
      paddingVertical: spacingValues.sm,
      paddingHorizontal: spacingValues.md,
      backgroundColor: theme.colors.background.subtle,
      borderRadius: borderRadiusValues.md,
      marginBottom: spacingValues.xs,
    },
    relatedIcon: {
      fontSize: 24,
      marginRight: spacingValues.sm,
    },
    relatedLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: theme.colors.text.default,
    },
    relatedArrow: {
      fontSize: 20,
      color: theme.colors.text.muted,
    },
  });

export default CompanionWellnessTipScreen;
