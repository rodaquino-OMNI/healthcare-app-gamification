import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';

interface StepProps {
  data: Record<string, any>;
  onUpdate: (field: string, value: any) => void;
}

interface CategoryConfig {
  key: string;
  subKeys: string[];
}

const CATEGORIES: CategoryConfig[] = [
  { key: 'physical', subKeys: ['exercise', 'bmi'] },
  { key: 'nutrition', subKeys: ['diet', 'hydration'] },
  { key: 'mental', subKeys: ['stress', 'mood'] },
  { key: 'lifestyle', subKeys: ['sleep', 'habits'] },
];

const getScoreColor = (score: number): string => {
  if (score >= 80) return colors.semantic.success;
  if (score >= 60) return colors.semantic.warning;
  return colors.semantic.error;
};

const CIRCLE_SIZE = 140;
const CIRCLE_BORDER = 10;

/**
 * StepResultsHealthScore displays the overall health score with a
 * circular progress indicator and breakdown by category.
 */
export const StepResultsHealthScore: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();

  const overallScore: number = data.overallScore ?? 0;
  const categoryScores: Record<string, number> = data.categoryScores ?? {};

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text
        variant="heading"
        fontSize="lg"
        journey="health"
        textAlign="center"
        style={styles.title}
      >
        {t('healthAssessment.resultsHealthScore.title')}
      </Text>

      {/* Circular Score */}
      <View style={styles.circleContainer} testID="overall-score-display">
        <View
          style={[
            styles.circleOuter,
            { borderColor: getScoreColor(overallScore) },
          ]}
        >
          <View style={styles.circleInner}>
            <Text
              fontSize="heading-xl"
              fontWeight="bold"
              color={colors.brand.primary}
              textAlign="center"
            >
              {String(overallScore)}
            </Text>
            <Text fontSize="xs" color={colors.neutral.gray600} textAlign="center">
              {t('healthAssessment.resultsHealthScore.outOf100')}
            </Text>
          </View>
        </View>
        <Text
          fontSize="sm"
          fontWeight="medium"
          color={getScoreColor(overallScore)}
          textAlign="center"
          style={styles.scoreLabel}
        >
          {overallScore >= 80
            ? t('healthAssessment.resultsHealthScore.excellent')
            : overallScore >= 60
            ? t('healthAssessment.resultsHealthScore.good')
            : t('healthAssessment.resultsHealthScore.needsWork')}
        </Text>
      </View>

      {/* Category Breakdown */}
      <Text
        fontSize="md"
        fontWeight="semiBold"
        color={colors.journeys.health.text}
        style={styles.breakdownTitle}
      >
        {t('healthAssessment.resultsHealthScore.breakdownTitle')}
      </Text>

      {CATEGORIES.map((cat) => {
        const score: number = categoryScores[cat.key] ?? 0;
        const barColor = getScoreColor(score);
        return (
          <Card
            key={cat.key}
            journey="health"
            elevation="sm"
            padding="md"
            style={styles.categoryCard}
          >
            <View style={styles.categoryHeader}>
              <Text fontSize="sm" fontWeight="semiBold" color={colors.neutral.gray900}>
                {t(`healthAssessment.resultsHealthScore.categories.${cat.key}`)}
              </Text>
              <Text fontSize="sm" fontWeight="bold" color={barColor}>
                {String(score)}
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressTrack} testID={`progress-${cat.key}`}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(score, 100)}%`, backgroundColor: barColor },
                ]}
              />
            </View>

            {/* Sub-scores */}
            <View style={styles.subScoreRow}>
              {cat.subKeys.map((sub) => (
                <Text key={sub} fontSize="xs" color={colors.neutral.gray600}>
                  {t(`healthAssessment.resultsHealthScore.subCategories.${sub}`)}
                </Text>
              ))}
            </View>
          </Card>
        );
      })}

      {/* CTA Buttons */}
      <View style={styles.ctaContainer}>
        <Touchable
          onPress={() => onUpdate('viewRecommendations', true)}
          accessibilityLabel={t('healthAssessment.resultsHealthScore.viewRecommendations')}
          accessibilityRole="button"
          testID="btn-view-recommendations"
          style={styles.primaryButton}
        >
          <Text
            fontSize="md"
            fontWeight="semiBold"
            color={colors.neutral.white}
            textAlign="center"
          >
            {t('healthAssessment.resultsHealthScore.viewRecommendations')}
          </Text>
        </Touchable>

        <Touchable
          onPress={() => onUpdate('shareWithDoctor', true)}
          accessibilityLabel={t('healthAssessment.resultsHealthScore.shareWithDoctor')}
          accessibilityRole="button"
          testID="btn-share-doctor"
          style={styles.secondaryButton}
        >
          <Text
            fontSize="md"
            fontWeight="semiBold"
            color={colors.journeys.health.primary}
            textAlign="center"
          >
            {t('healthAssessment.resultsHealthScore.shareWithDoctor')}
          </Text>
        </Touchable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  title: {
    marginTop: spacingValues.xl,
    marginBottom: spacingValues.lg,
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: spacingValues.xl,
  },
  circleOuter: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: CIRCLE_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.white,
  },
  circleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreLabel: {
    marginTop: spacingValues.sm,
  },
  breakdownTitle: {
    marginBottom: spacingValues.md,
  },
  categoryCard: {
    marginBottom: spacingValues.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues.xs,
  },
  progressTrack: {
    height: 8,
    borderRadius: borderRadiusValues.full,
    backgroundColor: colors.neutral.gray200,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: borderRadiusValues.full,
  },
  subScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingValues.xs,
  },
  ctaContainer: {
    marginTop: spacingValues.lg,
    gap: spacingValues.sm,
  },
  primaryButton: {
    backgroundColor: colors.journeys.health.primary,
    paddingVertical: spacingValues.md,
    borderRadius: borderRadiusValues.md,
    alignItems: 'center',
  },
  secondaryButton: {
    paddingVertical: spacingValues.md,
    borderRadius: borderRadiusValues.md,
    borderWidth: 1,
    borderColor: colors.journeys.health.primary,
    backgroundColor: colors.neutral.white,
    alignItems: 'center',
  },
});

export default StepResultsHealthScore;
