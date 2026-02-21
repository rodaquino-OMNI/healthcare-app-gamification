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

const PHQ2_QUESTIONS = ['interest', 'depressed'] as const;

const FREQUENCY_OPTIONS = [
  { key: 'notAtAll', score: 0 },
  { key: 'severalDays', score: 1 },
  { key: 'moreThanHalf', score: 2 },
  { key: 'nearlyEvery', score: 3 },
] as const;

export const StepMentalScreening: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();

  const getScore = (): number => {
    let total = 0;
    PHQ2_QUESTIONS.forEach((q) => {
      const answer = data[`phq2_${q}`];
      const option = FREQUENCY_OPTIONS.find((o) => o.key === answer);
      if (option) total += option.score;
    });
    return total;
  };

  const score = getScore();
  const bothAnswered = PHQ2_QUESTIONS.every((q) => data[`phq2_${q}`] !== undefined);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.mentalScreening.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.mentalScreening.subtitle')}
      </Text>

      {/* PHQ-2 Questions */}
      {PHQ2_QUESTIONS.map((question) => (
        <View key={question} style={styles.questionBlock}>
          <Text fontSize="md" fontWeight="medium" color={colors.neutral.gray800} style={styles.questionText}>
            {t(`healthAssessment.mentalScreening.questions.${question}`)}
          </Text>
          <View style={styles.optionList}>
            {FREQUENCY_OPTIONS.map((option) => {
              const selected = data[`phq2_${question}`] === option.key;
              return (
                <Touchable
                  key={option.key}
                  onPress={() => onUpdate(`phq2_${question}`, option.key)}
                  accessibilityLabel={t(`healthAssessment.mentalScreening.options.${option.key}`)}
                  accessibilityRole="button"
                  testID={`phq2-${question}-${option.key}`}
                  style={[styles.optionCard, selected && styles.optionCardSelected]}
                >
                  <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    fontSize="sm"
                    fontWeight={selected ? 'semiBold' : 'regular'}
                    color={selected ? colors.journeys.health.text : colors.neutral.gray700}
                    style={styles.optionLabel}
                  >
                    {t(`healthAssessment.mentalScreening.options.${option.key}`)}
                  </Text>
                </Touchable>
              );
            })}
          </View>
        </View>
      ))}

      {/* Score Indicator */}
      {bothAnswered && (
        <View style={styles.scoreContainer}>
          <Text fontSize="sm" fontWeight="medium" color={colors.neutral.gray600}>
            {t('healthAssessment.mentalScreening.scoreLabel')}
          </Text>
          <View style={[styles.scoreBadge, score >= 3 && styles.scoreBadgeHigh]}>
            <Text fontSize="md" fontWeight="bold" color={colors.neutral.white}>
              {String(score)}/6
            </Text>
          </View>
        </View>
      )}

      {/* Confidentiality Note */}
      <Card journey="health" elevation="sm" padding="md" style={styles.noteCard}>
        <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
          {t('healthAssessment.mentalScreening.confidentialTitle')}
        </Text>
        <Text fontSize="sm" color={colors.neutral.gray600} style={styles.noteText}>
          {t('healthAssessment.mentalScreening.confidentialMessage')}
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  sectionTitle: {
    marginTop: spacingValues.xl,
    marginBottom: spacingValues.xs,
  },
  subtitle: {
    marginBottom: spacingValues.lg,
  },
  questionBlock: {
    marginBottom: spacingValues.xl,
  },
  questionText: {
    marginBottom: spacingValues.sm,
  },
  optionList: {
    gap: spacingValues.xs,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.md,
    borderRadius: borderRadiusValues.md,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
  },
  optionCardSelected: {
    borderColor: colors.journeys.health.primary,
    backgroundColor: colors.journeys.health.background,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: borderRadiusValues.full,
    borderWidth: 2,
    borderColor: colors.neutral.gray400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.journeys.health.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: borderRadiusValues.full,
    backgroundColor: colors.journeys.health.primary,
  },
  optionLabel: {
    marginLeft: spacingValues.sm,
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.md,
    backgroundColor: colors.neutral.gray100,
    borderRadius: borderRadiusValues.md,
    marginBottom: spacingValues.lg,
  },
  scoreBadge: {
    paddingVertical: spacingValues.xs,
    paddingHorizontal: spacingValues.md,
    borderRadius: borderRadiusValues.full,
    backgroundColor: colors.journeys.health.primary,
  },
  scoreBadgeHigh: {
    backgroundColor: colors.semantic.warning,
  },
  noteCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.semantic.info,
  },
  noteText: {
    marginTop: spacingValues.xs,
    lineHeight: 20,
  },
});

export default StepMentalScreening;
