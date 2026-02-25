import React, { useCallback } from 'react';
import { View, TextInput, ScrollView, StyleSheet } from 'react-native';
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

const HAS_INSURANCE_OPTIONS = ['yes', 'no'] as const;

const PLAN_TYPES = ['basic', 'standard', 'premium'] as const;

const COVERAGE_OPTIONS = ['medical', 'dental', 'vision'] as const;

/**
 * StepInsuranceInfo collects insurance details: provider, plan type,
 * member ID, and coverage areas.
 */
export const StepInsuranceInfo: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const coverageSelected: string[] = data.coverageDetails || [];

  const handleToggleCoverage = useCallback(
    (item: string) => {
      const updated = coverageSelected.includes(item)
        ? coverageSelected.filter((c: string) => c !== item)
        : [...coverageSelected, item];
      onUpdate('coverageDetails', updated);
    },
    [coverageSelected, onUpdate],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.insuranceInfo.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.insuranceInfo.subtitle')}
      </Text>

      {/* Has Insurance */}
      <Text fontWeight="medium" fontSize="sm" style={styles.label}>
        {t('healthAssessment.insuranceInfo.hasInsuranceLabel')}
      </Text>
      <View style={styles.optionRow}>
        {HAS_INSURANCE_OPTIONS.map((opt) => {
          const selected = data.hasInsurance === opt;
          return (
            <Touchable
              key={opt}
              onPress={() => onUpdate('hasInsurance', opt)}
              accessibilityLabel={t(`healthAssessment.insuranceInfo.hasInsurance.${opt}`)}
              accessibilityRole="button"
              testID={`insurance-has-${opt}`}
              style={[styles.toggleChip, selected && styles.toggleChipSelected] as any}
            >
              <Text
                fontSize="sm"
                fontWeight={selected ? 'semiBold' : 'regular'}
                color={selected ? colors.neutral.white : colors.neutral.gray700}
              >
                {t(`healthAssessment.insuranceInfo.hasInsurance.${opt}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {data.hasInsurance === 'yes' && (
        <>
          {/* Provider Name */}
          <View style={styles.fieldGroup}>
            <Text fontWeight="medium" fontSize="sm" style={styles.label}>
              {t('healthAssessment.insuranceInfo.providerLabel')}
            </Text>
            <TextInput
              style={styles.textInput}
              value={data.providerName || ''}
              onChangeText={(text) => onUpdate('providerName', text)}
              placeholder={t('healthAssessment.insuranceInfo.providerPlaceholder')}
              placeholderTextColor={colors.neutral.gray500}
              testID="input-provider-name"
            />
          </View>

          {/* Plan Type */}
          <Text fontWeight="medium" fontSize="sm" style={styles.label}>
            {t('healthAssessment.insuranceInfo.planTypeLabel')}
          </Text>
          <View style={styles.chipRow}>
            {PLAN_TYPES.map((opt) => {
              const selected = data.planType === opt;
              return (
                <Touchable
                  key={opt}
                  onPress={() => onUpdate('planType', opt)}
                  accessibilityLabel={t(`healthAssessment.insuranceInfo.planType.${opt}`)}
                  accessibilityRole="button"
                  testID={`plan-type-${opt}`}
                  style={[styles.chip, selected && styles.chipSelected] as any}
                >
                  <Text
                    fontSize="sm"
                    fontWeight={selected ? 'semiBold' : 'regular'}
                    color={selected ? colors.neutral.white : colors.neutral.gray700}
                  >
                    {t(`healthAssessment.insuranceInfo.planType.${opt}`)}
                  </Text>
                </Touchable>
              );
            })}
          </View>

          {/* Member ID */}
          <View style={styles.fieldGroup}>
            <Text fontWeight="medium" fontSize="sm" style={styles.label}>
              {t('healthAssessment.insuranceInfo.memberIdLabel')}
            </Text>
            <TextInput
              style={styles.textInput}
              value={data.memberId || ''}
              onChangeText={(text) => onUpdate('memberId', text)}
              placeholder={t('healthAssessment.insuranceInfo.memberIdPlaceholder')}
              placeholderTextColor={colors.neutral.gray500}
              testID="input-member-id"
            />
          </View>

          {/* Coverage Details */}
          <Text fontWeight="medium" fontSize="sm" style={styles.label}>
            {t('healthAssessment.insuranceInfo.coverageLabel')}
          </Text>
          <View style={styles.chipRow}>
            {COVERAGE_OPTIONS.map((opt) => {
              const isActive = coverageSelected.includes(opt);
              return (
                <Touchable
                  key={opt}
                  onPress={() => handleToggleCoverage(opt)}
                  accessibilityLabel={t(`healthAssessment.insuranceInfo.coverage.${opt}`)}
                  accessibilityRole="checkbox"
                  testID={`coverage-${opt}`}
                  style={[styles.chip, isActive && styles.chipSelected] as any}
                >
                  <Text
                    fontSize="sm"
                    fontWeight={isActive ? 'semiBold' : 'regular'}
                    color={isActive ? colors.neutral.white : colors.neutral.gray700}
                  >
                    {t(`healthAssessment.insuranceInfo.coverage.${opt}`)}
                  </Text>
                </Touchable>
              );
            })}
          </View>
        </>
      )}

      {/* Info Card */}
      <Card journey="health" elevation="sm" padding="md" style={styles.infoCard}>
        <Text fontSize="sm" color={colors.neutral.gray600}>
          {t('healthAssessment.insuranceInfo.infoMessage')}
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
    marginBottom: spacingValues.xl,
  },
  fieldGroup: {
    marginTop: spacingValues.md,
  },
  label: {
    marginBottom: spacingValues.xs,
    marginTop: spacingValues.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: borderRadiusValues.md,
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    fontSize: 16,
    color: theme.colors.text.default,
    backgroundColor: theme.colors.background.default,
  },
  optionRow: {
    flexDirection: 'row',
    gap: spacingValues.sm,
  },
  toggleChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
    borderRadius: borderRadiusValues.full,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  toggleChipSelected: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  chipSelected: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  infoCard: {
    marginTop: spacingValues.xl,
  },
});

export default StepInsuranceInfo;
