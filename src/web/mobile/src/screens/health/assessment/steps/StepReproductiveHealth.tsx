import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';

interface StepProps {
  data: Record<string, any>;
  onUpdate: (field: string, value: any) => void;
}

const PREGNANCY_STATUS = ['notPregnant', 'pregnant', 'trying', 'unsure'] as const;

const LAST_CHECKUP = ['lessThan6Months', '6to12Months', '1to2Years', 'moreThan2Years'] as const;

const CONTRACEPTION = ['yes', 'no', 'notApplicable'] as const;

const MENSTRUAL_REGULARITY = ['regular', 'irregular', 'notApplicable'] as const;

export const StepReproductiveHealth: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.reproductiveHealth.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.reproductiveHealth.subtitle')}
      </Text>

      {/* Skip Button */}
      <Touchable
        onPress={() => onUpdate('reproductiveSkipped', true)}
        accessibilityLabel={t('healthAssessment.reproductiveHealth.skip')}
        accessibilityRole="button"
        testID="reproductive-skip"
        style={styles.skipButton}
      >
        <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.primary}>
          {t('healthAssessment.reproductiveHealth.skip')}
        </Text>
      </Touchable>

      {/* Pregnancy Status */}
      <Text variant="heading" fontSize="md" journey="health" style={styles.subSectionTitle}>
        {t('healthAssessment.reproductiveHealth.pregnancyTitle')}
      </Text>
      <View style={styles.optionList}>
        {PREGNANCY_STATUS.map((opt) => {
          const selected = data.pregnancyStatus === opt;
          return (
            <Touchable
              key={opt}
              onPress={() => onUpdate('pregnancyStatus', opt)}
              accessibilityLabel={t(`healthAssessment.reproductiveHealth.pregnancy.${opt}`)}
              accessibilityRole="button"
              testID={`pregnancy-${opt}`}
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
                {t(`healthAssessment.reproductiveHealth.pregnancy.${opt}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Last Checkup */}
      <Text variant="heading" fontSize="md" journey="health" style={styles.subSectionTitle}>
        {t('healthAssessment.reproductiveHealth.checkupTitle')}
      </Text>
      <View style={styles.chipGrid}>
        {LAST_CHECKUP.map((opt) => {
          const selected = data.lastReproductiveCheckup === opt;
          return (
            <Touchable
              key={opt}
              onPress={() => onUpdate('lastReproductiveCheckup', opt)}
              accessibilityLabel={t(`healthAssessment.reproductiveHealth.checkup.${opt}`)}
              accessibilityRole="button"
              testID={`checkup-${opt}`}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text
                fontSize="sm"
                fontWeight={selected ? 'semiBold' : 'regular'}
                color={selected ? colors.neutral.white : colors.neutral.gray700}
              >
                {t(`healthAssessment.reproductiveHealth.checkup.${opt}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Contraception */}
      <Text variant="heading" fontSize="md" journey="health" style={styles.subSectionTitle}>
        {t('healthAssessment.reproductiveHealth.contraceptionTitle')}
      </Text>
      <View style={styles.chipRow}>
        {CONTRACEPTION.map((opt) => {
          const selected = data.contraception === opt;
          return (
            <Touchable
              key={opt}
              onPress={() => onUpdate('contraception', opt)}
              accessibilityLabel={t(`healthAssessment.reproductiveHealth.contraception.${opt}`)}
              accessibilityRole="button"
              testID={`contraception-${opt}`}
              style={[styles.chipWide, selected && styles.chipSelected]}
            >
              <Text
                fontSize="sm"
                fontWeight={selected ? 'semiBold' : 'regular'}
                color={selected ? colors.neutral.white : colors.neutral.gray700}
              >
                {t(`healthAssessment.reproductiveHealth.contraception.${opt}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Menstrual Regularity */}
      <Text variant="heading" fontSize="md" journey="health" style={styles.subSectionTitle}>
        {t('healthAssessment.reproductiveHealth.menstrualTitle')}
      </Text>
      <View style={styles.chipRow}>
        {MENSTRUAL_REGULARITY.map((opt) => {
          const selected = data.menstrualRegularity === opt;
          return (
            <Touchable
              key={opt}
              onPress={() => onUpdate('menstrualRegularity', opt)}
              accessibilityLabel={t(`healthAssessment.reproductiveHealth.menstrual.${opt}`)}
              accessibilityRole="button"
              testID={`menstrual-${opt}`}
              style={[styles.chipWide, selected && styles.chipSelected]}
            >
              <Text
                fontSize="sm"
                fontWeight={selected ? 'semiBold' : 'regular'}
                color={selected ? colors.neutral.white : colors.neutral.gray700}
              >
                {t(`healthAssessment.reproductiveHealth.menstrual.${opt}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Privacy Note */}
      <Card journey="health" elevation="sm" padding="md" style={styles.noteCard}>
        <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
          {t('healthAssessment.reproductiveHealth.privacyTitle')}
        </Text>
        <Text fontSize="sm" color={colors.neutral.gray600} style={styles.noteText}>
          {t('healthAssessment.reproductiveHealth.privacyMessage')}
        </Text>
      </Card>
    </ScrollView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  sectionTitle: {
    marginTop: spacingValues.xl,
    marginBottom: spacingValues.xs,
  },
  subtitle: {
    marginBottom: spacingValues.sm,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingVertical: spacingValues.xs,
    paddingHorizontal: spacingValues.md,
    marginBottom: spacingValues.md,
  },
  subSectionTitle: {
    marginTop: spacingValues.lg,
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
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
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
    borderColor: theme.colors.border.default,
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
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacingValues.xs,
  },
  chip: {
    paddingVertical: spacingValues.xs,
    paddingHorizontal: spacingValues.md,
    borderRadius: borderRadiusValues.full,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  chipWide: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacingValues.xs,
    borderRadius: borderRadiusValues.full,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  chipSelected: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  noteCard: {
    marginTop: spacingValues.xl,
    borderLeftWidth: 3,
    borderLeftColor: colors.semantic.info,
  },
  noteText: {
    marginTop: spacingValues.xs,
    lineHeight: 20,
  },
});

export default StepReproductiveHealth;
