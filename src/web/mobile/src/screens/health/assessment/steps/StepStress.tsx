import React, { useCallback } from 'react';
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

const STRESS_LEVELS = [
  { key: 1, emoji: '\uD83D\uDE0A', color: colors.semantic.success },
  { key: 2, emoji: '\uD83D\uDE42', color: colors.semantic.success },
  { key: 3, emoji: '\uD83D\uDE10', color: colors.semantic.warning },
  { key: 4, emoji: '\uD83D\uDE1F', color: colors.semantic.warning },
  { key: 5, emoji: '\uD83D\uDE23', color: colors.semantic.error },
] as const;

const STRESS_SOURCES = [
  'work',
  'finances',
  'relationships',
  'health',
  'family',
  'other',
] as const;

const COPING_MECHANISMS = [
  'exercise',
  'meditation',
  'therapy',
  'hobbies',
  'socialSupport',
] as const;

const MENTAL_HEALTH_OPTIONS = ['yes', 'sometimes', 'no'] as const;

export const StepStress: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();

  const selectedSources: string[] = data.stressSources ?? [];
  const selectedCoping: string[] = data.copingMechanisms ?? [];

  const handleToggleSource = useCallback(
    (source: string) => {
      const updated = selectedSources.includes(source)
        ? selectedSources.filter((s) => s !== source)
        : [...selectedSources, source];
      onUpdate('stressSources', updated);
    },
    [selectedSources, onUpdate],
  );

  const handleToggleCoping = useCallback(
    (mechanism: string) => {
      const updated = selectedCoping.includes(mechanism)
        ? selectedCoping.filter((m) => m !== mechanism)
        : [...selectedCoping, mechanism];
      onUpdate('copingMechanisms', updated);
    },
    [selectedCoping, onUpdate],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Stress Level */}
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.stress.levelTitle')}
      </Text>
      <View style={styles.levelRow}>
        {STRESS_LEVELS.map(({ key, emoji, color }) => {
          const selected = data.stressLevel === key;
          return (
            <Touchable
              key={key}
              onPress={() => onUpdate('stressLevel', key)}
              accessibilityLabel={t(`healthAssessment.stress.level.${key}`)}
              accessibilityRole="button"
              testID={`stress-level-${key}`}
              style={[
                styles.levelCard,
                selected && { borderColor: color, backgroundColor: colors.journeys.health.background },
              ]}
            >
              <Text fontSize="heading-xl" textAlign="center">
                {emoji}
              </Text>
              <Text
                fontSize="xs"
                fontWeight={selected ? 'semiBold' : 'regular'}
                color={selected ? color : colors.neutral.gray600}
                textAlign="center"
              >
                {t(`healthAssessment.stress.level.${key}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Stress Sources */}
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.stress.sourcesTitle')}
      </Text>
      <View style={styles.chipGrid}>
        {STRESS_SOURCES.map((source) => {
          const selected = selectedSources.includes(source);
          return (
            <Touchable
              key={source}
              onPress={() => handleToggleSource(source)}
              accessibilityLabel={t(`healthAssessment.stress.sources.${source}`)}
              accessibilityRole="checkbox"
              testID={`stress-source-${source}`}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text
                fontSize="sm"
                fontWeight={selected ? 'semiBold' : 'regular'}
                color={selected ? colors.neutral.white : colors.neutral.gray700}
              >
                {t(`healthAssessment.stress.sources.${source}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Coping Mechanisms */}
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.stress.copingTitle')}
      </Text>
      <View style={styles.chipGrid}>
        {COPING_MECHANISMS.map((mechanism) => {
          const selected = selectedCoping.includes(mechanism);
          return (
            <Touchable
              key={mechanism}
              onPress={() => handleToggleCoping(mechanism)}
              accessibilityLabel={t(`healthAssessment.stress.coping.${mechanism}`)}
              accessibilityRole="checkbox"
              testID={`stress-coping-${mechanism}`}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text
                fontSize="sm"
                fontWeight={selected ? 'semiBold' : 'regular'}
                color={selected ? colors.neutral.white : colors.neutral.gray700}
              >
                {t(`healthAssessment.stress.coping.${mechanism}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Mental Health Screening */}
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.stress.mentalHealthTitle')}
      </Text>
      <Card journey="health" elevation="sm" padding="md">
        <Text fontSize="sm" color={colors.neutral.gray600} style={styles.mentalHealthQuestion}>
          {t('healthAssessment.stress.mentalHealthQuestion')}
        </Text>
        <View style={styles.mentalHealthRow}>
          {MENTAL_HEALTH_OPTIONS.map((opt) => {
            const selected = data.mentalHealthScreening === opt;
            return (
              <Touchable
                key={opt}
                onPress={() => onUpdate('mentalHealthScreening', opt)}
                accessibilityLabel={t(`healthAssessment.stress.mentalHealth.${opt}`)}
                accessibilityRole="button"
                testID={`mental-health-${opt}`}
                style={[styles.mentalHealthChip, selected && styles.mentalHealthChipSelected]}
              >
                <Text
                  fontSize="sm"
                  fontWeight={selected ? 'semiBold' : 'regular'}
                  color={selected ? colors.neutral.white : colors.neutral.gray700}
                >
                  {t(`healthAssessment.stress.mentalHealth.${opt}`)}
                </Text>
              </Touchable>
            );
          })}
        </View>
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
    marginBottom: spacingValues.sm,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacingValues.xs,
  },
  levelCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
    borderRadius: borderRadiusValues.md,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
  },
  chip: {
    paddingVertical: spacingValues.xs,
    paddingHorizontal: spacingValues.md,
    borderRadius: borderRadiusValues.full,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
  },
  chipSelected: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  mentalHealthQuestion: {
    marginBottom: spacingValues.sm,
  },
  mentalHealthRow: {
    flexDirection: 'row',
    gap: spacingValues.xs,
  },
  mentalHealthChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacingValues.xs,
    borderRadius: borderRadiusValues.full,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
  },
  mentalHealthChipSelected: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
});

export default StepStress;
