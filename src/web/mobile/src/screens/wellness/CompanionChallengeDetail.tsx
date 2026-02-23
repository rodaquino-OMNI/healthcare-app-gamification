import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { sizingValues } from '../../../../design-system/src/tokens/sizing';
import type { WellnessScreenProps } from '../../navigation/types';

interface Participant { id: string; name: string; avatar: string; progress: number }
interface RuleItem { id: string; textKey: string }

interface ChallengeDetail {
  id: string; titleKey: string; descriptionKey: string; icon: string;
  progress: number; target: number; rewardPoints: number; participantCount: number;
  durationDays: number; daysLeft: number; isJoined: boolean;
  rules: RuleItem[]; participants: Participant[];
}

const MOCK_CHALLENGE: ChallengeDetail = {
  id: 'ch-1',
  titleKey: 'journeys.health.wellness.challengeDetail.walkChallengeTitle',
  descriptionKey: 'journeys.health.wellness.challengeDetail.walkChallengeDescription',
  icon: '\u{1F6B6}',
  progress: 35000,
  target: 70000,
  rewardPoints: 500,
  participantCount: 1243,
  durationDays: 7,
  daysLeft: 4,
  isJoined: true,
  rules: [
    { id: 'r-1', textKey: 'journeys.health.wellness.challengeDetail.rules.trackSteps' },
    { id: 'r-2', textKey: 'journeys.health.wellness.challengeDetail.rules.dailyMinimum' },
    { id: 'r-3', textKey: 'journeys.health.wellness.challengeDetail.rules.noMissedDays' },
    { id: 'r-4', textKey: 'journeys.health.wellness.challengeDetail.rules.syncDevice' },
  ],
  participants: [
    { id: 'p-1', name: 'Ana S.', avatar: '\u{1F469}', progress: 82 },
    { id: 'p-2', name: 'Carlos M.', avatar: '\u{1F468}', progress: 76 },
    { id: 'p-3', name: 'Maria L.', avatar: '\u{1F469}', progress: 65 },
    { id: 'p-4', name: 'Pedro R.', avatar: '\u{1F468}', progress: 50 },
    { id: 'p-5', name: 'Julia F.', avatar: '\u{1F469}', progress: 45 },
  ],
};

type Props = WellnessScreenProps<'WellnessChallengeDetail'>;

export const CompanionChallengeDetailScreen: React.FC<Props> = ({ route }) => {
  const { challengeId } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  // In a real app, we would fetch by challengeId
  const challenge = { ...MOCK_CHALLENGE, id: challengeId };
  const [isJoined, setIsJoined] = useState(challenge.isJoined);

  const progress = Math.min(challenge.progress / challenge.target, 1);

  const handleJoinLeave = useCallback(() => {
    setIsJoined((prev) => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.container} testID="wellness-challenge-detail-screen">
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
          {t('journeys.health.wellness.challengeDetail.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Challenge Header */}
        <View style={styles.heroSection}>
          <Text style={styles.heroIcon}>{challenge.icon}</Text>
          <Text style={styles.heroTitle}>{t(challenge.titleKey)}</Text>
          <Text style={styles.heroDescription}>{t(challenge.descriptionKey)}</Text>
        </View>

        {/* Progress Section */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>
            {t('journeys.health.wellness.challengeDetail.progress')}
          </Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              {challenge.progress.toLocaleString()} / {challenge.target.toLocaleString()}
            </Text>
            <Text style={styles.progressPercent}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{challenge.durationDays}</Text>
            <Text style={styles.statLabel}>
              {t('journeys.health.wellness.challengeDetail.duration')}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.semantic.warning }]}>
              {challenge.daysLeft}
            </Text>
            <Text style={styles.statLabel}>
              {t('journeys.health.wellness.challengeDetail.remaining')}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.semantic.success }]}>
              {challenge.rewardPoints}
            </Text>
            <Text style={styles.statLabel}>
              {t('journeys.health.wellness.challengeDetail.reward')}
            </Text>
          </View>
        </View>

        {/* Rules */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>
            {t('journeys.health.wellness.challengeDetail.rulesTitle')}
          </Text>
          {challenge.rules.map((rule, index) => (
            <View key={rule.id} style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>{index + 1}.</Text>
              <Text style={styles.ruleText}>{t(rule.textKey)}</Text>
            </View>
          ))}
        </View>

        {/* Participants Preview */}
        <View style={styles.card}>
          <View style={styles.participantsHeader}>
            <Text style={styles.cardSectionTitle}>
              {t('journeys.health.wellness.challengeDetail.participantsTitle')}
            </Text>
            <Text style={styles.participantCount}>
              {t('journeys.health.wellness.challengeDetail.totalParticipants', {
                count: challenge.participantCount,
              })}
            </Text>
          </View>
          {challenge.participants.map((participant) => (
            <View key={participant.id} style={styles.participantRow}>
              <Text style={styles.participantAvatar}>{participant.avatar}</Text>
              <Text style={styles.participantName}>{participant.name}</Text>
              <View style={styles.participantBarBg}>
                <View
                  style={[
                    styles.participantBarFill,
                    { width: `${participant.progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.participantPercent}>{participant.progress}%</Text>
            </View>
          ))}
        </View>

        {/* Reward Info */}
        <View style={styles.rewardCard}>
          <Text style={styles.rewardIcon}>{'\u{1F3C6}'}</Text>
          <View style={styles.rewardContent}>
            <Text style={styles.rewardTitle}>
              {t('journeys.health.wellness.challengeDetail.rewardTitle')}
            </Text>
            <Text style={styles.rewardDescription}>
              {t('journeys.health.wellness.challengeDetail.rewardDescription', {
                points: challenge.rewardPoints,
              })}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          onPress={handleJoinLeave}
          style={[styles.actionButton, isJoined && styles.leaveButton]}
          accessibilityLabel={
            isJoined
              ? t('journeys.health.wellness.challengeDetail.leave')
              : t('journeys.health.wellness.challengeDetail.join')
          }
        >
          <Text style={[styles.actionButtonText, isJoined && styles.leaveButtonText]}>
            {isJoined
              ? t('journeys.health.wellness.challengeDetail.leave')
              : t('journeys.health.wellness.challengeDetail.join')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
    scrollContent: {
      paddingHorizontal: spacingValues.md,
      paddingBottom: spacingValues['5xl'],
    },
    heroSection: {
      alignItems: 'center',
      paddingVertical: spacingValues.xl,
    },
    heroIcon: {
      fontSize: 56,
      marginBottom: spacingValues.sm,
    },
    heroTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.text.default,
      textAlign: 'center',
    },
    heroDescription: {
      fontSize: 14,
      color: theme.colors.text.muted,
      textAlign: 'center',
      marginTop: spacingValues.xs,
      paddingHorizontal: spacingValues.md,
    },
    card: {
      backgroundColor: theme.colors.background.default,
      borderRadius: borderRadiusValues.lg,
      padding: spacingValues.md,
      marginBottom: spacingValues.sm,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    cardSectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.default,
      marginBottom: spacingValues.sm,
    },
    progressBarBg: {
      height: 10,
      backgroundColor: theme.colors.border.default,
      borderRadius: borderRadiusValues.full,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: colors.semantic.success,
      borderRadius: borderRadiusValues.full,
    },
    progressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacingValues['3xs'],
    },
    progressText: {
      fontSize: 12,
      color: theme.colors.text.muted,
    },
    progressPercent: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.semantic.success,
    },
    statsRow: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background.default,
      borderRadius: borderRadiusValues.lg,
      padding: spacingValues.md,
      marginBottom: spacingValues.sm,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.text.default,
    },
    statLabel: {
      fontSize: 11,
      color: theme.colors.text.muted,
      marginTop: spacingValues['4xs'],
    },
    statDivider: {
      width: 1,
      height: 32,
      backgroundColor: theme.colors.border.default,
    },
    ruleItem: {
      flexDirection: 'row',
      marginBottom: spacingValues.xs,
    },
    ruleBullet: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.brand.primary,
      width: 24,
    },
    ruleText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text.default,
      lineHeight: 20,
    },
    participantsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacingValues.sm,
    },
    participantCount: {
      fontSize: 12,
      color: theme.colors.text.muted,
    },
    participantRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacingValues.xs,
    },
    participantAvatar: {
      fontSize: 20,
      marginRight: spacingValues.xs,
    },
    participantName: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.text.default,
      width: 80,
    },
    participantBarBg: {
      flex: 1,
      height: 6,
      backgroundColor: theme.colors.border.default,
      borderRadius: borderRadiusValues.full,
      overflow: 'hidden',
      marginHorizontal: spacingValues.xs,
    },
    participantBarFill: {
      height: '100%',
      backgroundColor: colors.brand.primary,
      borderRadius: borderRadiusValues.full,
    },
    participantPercent: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.text.muted,
      width: 36,
      textAlign: 'right',
    },
    rewardCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background.default,
      borderRadius: borderRadiusValues.lg,
      padding: spacingValues.md,
      marginBottom: spacingValues.sm,
      borderLeftWidth: 4,
      borderLeftColor: colors.semantic.success,
    },
    rewardIcon: {
      fontSize: 32,
      marginRight: spacingValues.sm,
    },
    rewardContent: {
      flex: 1,
    },
    rewardTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.default,
    },
    rewardDescription: {
      fontSize: 13,
      color: theme.colors.text.muted,
      marginTop: spacingValues['4xs'],
    },
    bottomAction: {
      paddingHorizontal: spacingValues.md,
      paddingVertical: spacingValues.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.default,
      backgroundColor: theme.colors.background.default,
    },
    actionButton: {
      backgroundColor: colors.brand.primary,
      borderRadius: borderRadiusValues.full,
      paddingVertical: spacingValues.sm,
      alignItems: 'center',
    },
    leaveButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.semantic.error,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.onBrand,
    },
    leaveButtonText: {
      color: colors.semantic.error,
    },
  });

export default CompanionChallengeDetailScreen;
