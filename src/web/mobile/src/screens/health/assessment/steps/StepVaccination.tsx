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

const COVID_STATUS = ['fullyVaccinated', 'partiallyVaccinated', 'notVaccinated', 'preferNotToSay'] as const;

const YES_NO_OPTIONS = ['yes', 'no'] as const;

const YES_NO_UNSURE = ['yes', 'no', 'unsure'] as const;

export const StepVaccination: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.vaccination.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.vaccination.subtitle')}
      </Text>

      {/* COVID-19 Status */}
      <Text variant="heading" fontSize="md" journey="health" style={styles.subSectionTitle}>
        {t('healthAssessment.vaccination.covidTitle')}
      </Text>
      <View style={styles.optionList}>
        {COVID_STATUS.map((opt) => {
          const selected = data.covidStatus === opt;
          return (
            <Touchable
              key={opt}
              onPress={() => onUpdate('covidStatus', opt)}
              accessibilityLabel={t(`healthAssessment.vaccination.covid.${opt}`)}
              accessibilityRole="button"
              testID={`covid-status-${opt}`}
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
                {t(`healthAssessment.vaccination.covid.${opt}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Flu Vaccine */}
      <Text variant="heading" fontSize="md" journey="health" style={styles.subSectionTitle}>
        {t('healthAssessment.vaccination.fluTitle')}
      </Text>
      <View style={styles.chipRow}>
        {YES_NO_OPTIONS.map((opt) => {
          const selected = data.fluVaccine === opt;
          return (
            <Touchable
              key={opt}
              onPress={() => onUpdate('fluVaccine', opt)}
              accessibilityLabel={t(`healthAssessment.vaccination.yesNo.${opt}`)}
              accessibilityRole="button"
              testID={`flu-vaccine-${opt}`}
              style={[styles.chipWide, selected && styles.chipSelected]}
            >
              <Text
                fontSize="sm"
                fontWeight={selected ? 'semiBold' : 'regular'}
                color={selected ? colors.neutral.white : colors.neutral.gray700}
              >
                {t(`healthAssessment.vaccination.yesNo.${opt}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Other Vaccines */}
      <Text variant="heading" fontSize="md" journey="health" style={styles.subSectionTitle}>
        {t('healthAssessment.vaccination.otherVaccinesTitle')}
      </Text>
      <View style={styles.chipRow}>
        {YES_NO_UNSURE.map((opt) => {
          const selected = data.otherVaccines === opt;
          return (
            <Touchable
              key={opt}
              onPress={() => onUpdate('otherVaccines', opt)}
              accessibilityLabel={t(`healthAssessment.vaccination.yesNoUnsure.${opt}`)}
              accessibilityRole="button"
              testID={`other-vaccines-${opt}`}
              style={[styles.chipWide, selected && styles.chipSelected]}
            >
              <Text
                fontSize="sm"
                fontWeight={selected ? 'semiBold' : 'regular'}
                color={selected ? colors.neutral.white : colors.neutral.gray700}
              >
                {t(`healthAssessment.vaccination.yesNoUnsure.${opt}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Vaccination Card */}
      <Text variant="heading" fontSize="md" journey="health" style={styles.subSectionTitle}>
        {t('healthAssessment.vaccination.cardTitle')}
      </Text>
      <View style={styles.chipRow}>
        {YES_NO_OPTIONS.map((opt) => {
          const selected = data.vaccinationCard === opt;
          return (
            <Touchable
              key={opt}
              onPress={() => onUpdate('vaccinationCard', opt)}
              accessibilityLabel={t(`healthAssessment.vaccination.yesNo.${opt}`)}
              accessibilityRole="button"
              testID={`vaccination-card-${opt}`}
              style={[styles.chipWide, selected && styles.chipSelected]}
            >
              <Text
                fontSize="sm"
                fontWeight={selected ? 'semiBold' : 'regular'}
                color={selected ? colors.neutral.white : colors.neutral.gray700}
              >
                {t(`healthAssessment.vaccination.yesNo.${opt}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Info Card */}
      <Card journey="health" elevation="sm" padding="md" style={styles.infoCard}>
        <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
          {t('healthAssessment.vaccination.infoTitle')}
        </Text>
        <Text fontSize="sm" color={colors.neutral.gray600} style={styles.infoText}>
          {t('healthAssessment.vaccination.infoMessage')}
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
  chipRow: {
    flexDirection: 'row',
    gap: spacingValues.xs,
  },
  chipWide: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
    borderRadius: borderRadiusValues.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  chipSelected: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  infoCard: {
    marginTop: spacingValues.xl,
    borderLeftWidth: 3,
    borderLeftColor: colors.semantic.info,
  },
  infoText: {
    marginTop: spacingValues.xs,
    lineHeight: 20,
  },
});

export default StepVaccination;
