import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { ROUTES } from '../../constants/routes';
import type { WellnessNavigationProp } from '../../navigation/types';

/**
 * Represents a quick reply chip.
 */
interface QuickReply {
  id: string;
  labelKey: string;
  icon: string;
  category: 'mood' | 'health' | 'activity' | 'nutrition';
}

/**
 * Represents a category section.
 */
interface ReplyCategory {
  key: 'mood' | 'health' | 'activity' | 'nutrition';
  titleKey: string;
  icon: string;
}

/**
 * Mock quick reply data for development.
 */
const MOCK_REPLIES: QuickReply[] = [
  { id: 'qr-001', labelKey: 'journeys.health.wellness.quickReplies.feelingGreat', icon: '\u{1F60A}', category: 'mood' },
  { id: 'qr-002', labelKey: 'journeys.health.wellness.quickReplies.feelingAnxious', icon: '\u{1F630}', category: 'mood' },
  { id: 'qr-003', labelKey: 'journeys.health.wellness.quickReplies.feelingTired', icon: '\u{1F634}', category: 'mood' },
  { id: 'qr-004', labelKey: 'journeys.health.wellness.quickReplies.feelingStressed', icon: '\u{1F625}', category: 'mood' },
  { id: 'qr-005', labelKey: 'journeys.health.wellness.quickReplies.headache', icon: '\u{1F915}', category: 'health' },
  { id: 'qr-006', labelKey: 'journeys.health.wellness.quickReplies.sleepIssues', icon: '\u{1F62B}', category: 'health' },
  { id: 'qr-007', labelKey: 'journeys.health.wellness.quickReplies.backPain', icon: '\u{1FA7A}', category: 'health' },
  { id: 'qr-008', labelKey: 'journeys.health.wellness.quickReplies.suggestWorkout', icon: '\u{1F3CB}', category: 'activity' },
  { id: 'qr-009', labelKey: 'journeys.health.wellness.quickReplies.suggestYoga', icon: '\u{1F9D8}', category: 'activity' },
  { id: 'qr-010', labelKey: 'journeys.health.wellness.quickReplies.suggestWalk', icon: '\u{1F6B6}', category: 'activity' },
  { id: 'qr-011', labelKey: 'journeys.health.wellness.quickReplies.mealIdeas', icon: '\u{1F957}', category: 'nutrition' },
  { id: 'qr-012', labelKey: 'journeys.health.wellness.quickReplies.hydrationTip', icon: '\u{1F4A7}', category: 'nutrition' },
  { id: 'qr-013', labelKey: 'journeys.health.wellness.quickReplies.snackSuggestion', icon: '\u{1F34E}', category: 'nutrition' },
];

const CATEGORIES: ReplyCategory[] = [
  { key: 'mood', titleKey: 'journeys.health.wellness.quickReplies.categoryMood', icon: '\u{1F60A}' },
  { key: 'health', titleKey: 'journeys.health.wellness.quickReplies.categoryHealth', icon: '\u{1FA7A}' },
  { key: 'activity', titleKey: 'journeys.health.wellness.quickReplies.categoryActivity', icon: '\u{1F3CB}' },
  { key: 'nutrition', titleKey: 'journeys.health.wellness.quickReplies.categoryNutrition', icon: '\u{1F957}' },
];

/**
 * CompanionQuickRepliesScreen displays preset response chips
 * organized by category for quick conversation starters.
 */
export const CompanionQuickRepliesScreen: React.FC = () => {
  const navigation = useNavigation<WellnessNavigationProp>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const handleReplyPress = useCallback(
    (_replyId: string) => {
      navigation.navigate(ROUTES.WELLNESS_CHAT_ACTIVE as 'WellnessChatActive');
    },
    [navigation],
  );

  const getRepliesByCategory = (category: QuickReply['category']) =>
    MOCK_REPLIES.filter((reply) => reply.category === category);

  return (
    <SafeAreaView style={styles.container} testID="wellness-quick-replies-screen">
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel={t('common.buttons.back')}
        >
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>
          {t('journeys.health.wellness.quickReplies.screenTitle')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          {t('journeys.health.wellness.quickReplies.description')}
        </Text>

        {CATEGORIES.map((category) => {
          const categoryReplies = getRepliesByCategory(category.key);
          return (
            <View key={category.key} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryTitle}>{t(category.titleKey)}</Text>
              </View>
              <View style={styles.chipsContainer}>
                {categoryReplies.map((reply) => (
                  <TouchableOpacity
                    key={reply.id}
                    style={styles.chip}
                    onPress={() => handleReplyPress(reply.id)}
                    accessibilityLabel={t(reply.labelKey)}
                    accessibilityRole="button"
                    testID={`quick-reply-${reply.id}`}
                  >
                    <Text style={styles.chipIcon}>{reply.icon}</Text>
                    <Text style={styles.chipLabel}>{t(reply.labelKey)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
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
    headerSpacer: {
      width: 40,
    },
    scrollContent: {
      padding: spacingValues.md,
      paddingBottom: spacingValues['5xl'],
    },
    description: {
      fontSize: 15,
      color: theme.colors.text.muted,
      textAlign: 'center',
      marginBottom: spacingValues.lg,
    },
    categorySection: {
      marginBottom: spacingValues.lg,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacingValues.sm,
    },
    categoryIcon: {
      fontSize: 20,
      marginRight: spacingValues.xs,
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.default,
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacingValues.xs,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacingValues.xs,
      paddingHorizontal: spacingValues.sm,
      backgroundColor: theme.colors.background.subtle,
      borderRadius: borderRadiusValues.full,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    chipIcon: {
      fontSize: 16,
      marginRight: spacingValues['3xs'],
    },
    chipLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text.default,
    },
  });

export default CompanionQuickRepliesScreen;
