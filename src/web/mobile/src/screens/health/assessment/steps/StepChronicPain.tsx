import React, { useCallback } from 'react';
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

const PAIN_LOCATIONS = ['head', 'neck', 'back', 'shoulders', 'knees', 'hips', 'hands', 'feet'] as const;
const PAIN_FREQUENCY = ['daily', 'weekly', 'monthly', 'rarely'] as const;
const PAIN_IMPACT = ['none', 'mild', 'moderate', 'severe'] as const;
const SEVERITY_RANGE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

const getSeverityColor = (level: number): string => {
  if (level <= 3) return colors.semantic.success;
  if (level <= 6) return colors.semantic.warning;
  return colors.semantic.error;
};

export const StepChronicPain: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const hasPain = data.hasPain;
  const selectedLocations: string[] = data.painLocations ?? [];

  const handleToggleLocation = useCallback(
    (location: string) => {
      const updated = selectedLocations.includes(location)
        ? selectedLocations.filter((l) => l !== location)
        : [...selectedLocations, location];
      onUpdate('painLocations', updated);
    },
    [selectedLocations, onUpdate],
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.chronicPain.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.chronicPain.subtitle')}
      </Text>

      <View style={styles.chipRow}>
        {(['yes', 'no'] as const).map((opt) => {
          const selected = hasPain === opt;
          return (
            <Touchable key={opt} onPress={() => onUpdate('hasPain', opt)} accessibilityLabel={t(`healthAssessment.chronicPain.hasPain.${opt}`)} accessibilityRole="button" testID={`has-pain-${opt}`} style={[styles.chipWide, selected && styles.chipSelected]}>
              <Text fontSize="sm" fontWeight={selected ? 'semiBold' : 'regular'} color={selected ? colors.neutral.white : colors.neutral.gray700}>
                {t(`healthAssessment.chronicPain.hasPain.${opt}`)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {hasPain === 'yes' && (
        <>
          <Text variant="heading" fontSize="md" journey="health" style={styles.subTitle}>
            {t('healthAssessment.chronicPain.locationTitle')}
          </Text>
          <View style={styles.chipGrid}>
            {PAIN_LOCATIONS.map((location) => {
              const selected = selectedLocations.includes(location);
              return (
                <Touchable key={location} onPress={() => handleToggleLocation(location)} accessibilityLabel={t(`healthAssessment.chronicPain.locations.${location}`)} accessibilityRole="checkbox" testID={`pain-location-${location}`} style={[styles.chip, selected && styles.chipSelected]}>
                  <Text fontSize="sm" fontWeight={selected ? 'semiBold' : 'regular'} color={selected ? colors.neutral.white : colors.neutral.gray700}>
                    {t(`healthAssessment.chronicPain.locations.${location}`)}
                  </Text>
                </Touchable>
              );
            })}
          </View>

          <Text variant="heading" fontSize="md" journey="health" style={styles.subTitle}>
            {t('healthAssessment.chronicPain.severityTitle')}
          </Text>
          <View style={styles.severityRow}>
            {SEVERITY_RANGE.map((level) => {
              const selected = data.painSeverity === level;
              const activeColor = getSeverityColor(level);
              return (
                <Touchable key={level} onPress={() => onUpdate('painSeverity', level)} accessibilityLabel={t('healthAssessment.chronicPain.severityLevel', { level: String(level) })} accessibilityRole="button" testID={`pain-severity-${level}`} style={[styles.severityCell, selected && { backgroundColor: activeColor, borderColor: activeColor }]}>
                  <Text fontSize="xs" fontWeight={selected ? 'bold' : 'regular'} color={selected ? colors.neutral.white : colors.neutral.gray700} textAlign="center">
                    {String(level)}
                  </Text>
                </Touchable>
              );
            })}
          </View>

          <Text variant="heading" fontSize="md" journey="health" style={styles.subTitle}>
            {t('healthAssessment.chronicPain.frequencyTitle')}
          </Text>
          <View style={styles.optionList}>
            {PAIN_FREQUENCY.map((freq) => {
              const selected = data.painFrequency === freq;
              return (
                <Touchable key={freq} onPress={() => onUpdate('painFrequency', freq)} accessibilityLabel={t(`healthAssessment.chronicPain.frequency.${freq}`)} accessibilityRole="button" testID={`pain-frequency-${freq}`} style={[styles.radioCard, selected && styles.radioCardSelected]}>
                  <View style={[styles.radioCircle, selected && styles.radioCircleActive]}>
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <Text fontSize="sm" fontWeight={selected ? 'semiBold' : 'regular'} color={selected ? colors.journeys.health.text : colors.neutral.gray700} style={styles.radioLabel}>
                    {t(`healthAssessment.chronicPain.frequency.${freq}`)}
                  </Text>
                </Touchable>
              );
            })}
          </View>

          <Text variant="heading" fontSize="md" journey="health" style={styles.subTitle}>
            {t('healthAssessment.chronicPain.impactTitle')}
          </Text>
          <View style={styles.chipGrid}>
            {PAIN_IMPACT.map((impact) => {
              const selected = data.painImpact === impact;
              return (
                <Touchable key={impact} onPress={() => onUpdate('painImpact', impact)} accessibilityLabel={t(`healthAssessment.chronicPain.impact.${impact}`)} accessibilityRole="button" testID={`pain-impact-${impact}`} style={[styles.chip, selected && styles.chipSelected]}>
                  <Text fontSize="sm" fontWeight={selected ? 'semiBold' : 'regular'} color={selected ? colors.neutral.white : colors.neutral.gray700}>
                    {t(`healthAssessment.chronicPain.impact.${impact}`)}
                  </Text>
                </Touchable>
              );
            })}
          </View>
        </>
      )}

      <Card journey="health" elevation="sm" padding="md" style={styles.infoCard}>
        <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
          {t('healthAssessment.chronicPain.tipTitle')}
        </Text>
        <Text fontSize="sm" color={colors.neutral.gray600} style={styles.infoText}>
          {t('healthAssessment.chronicPain.tipMessage')}
        </Text>
      </Card>
    </ScrollView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: { paddingHorizontal: spacingValues.md, paddingBottom: spacingValues['3xl'] },
  sectionTitle: { marginTop: spacingValues.xl, marginBottom: spacingValues.xs },
  subtitle: { marginBottom: spacingValues.md },
  subTitle: { marginTop: spacingValues.lg, marginBottom: spacingValues.sm },
  chipRow: { flexDirection: 'row', gap: spacingValues.xs },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacingValues.xs },
  chipWide: { flex: 1, alignItems: 'center', paddingVertical: spacingValues.sm, borderRadius: borderRadiusValues.md, borderWidth: 1, borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.default },
  chip: { paddingVertical: spacingValues.xs, paddingHorizontal: spacingValues.md, borderRadius: borderRadiusValues.full, borderWidth: 1, borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.default },
  chipSelected: { backgroundColor: colors.journeys.health.primary, borderColor: colors.journeys.health.primary },
  severityRow: { flexDirection: 'row', gap: spacingValues.xs },
  severityCell: { flex: 1, alignItems: 'center', paddingVertical: spacingValues.xs, borderRadius: borderRadiusValues.sm, borderWidth: 1, borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.default },
  optionList: { gap: spacingValues.xs },
  radioCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacingValues.sm, paddingHorizontal: spacingValues.md, borderRadius: borderRadiusValues.md, borderWidth: 1, borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.default },
  radioCardSelected: { borderColor: colors.journeys.health.primary, backgroundColor: colors.journeys.health.background },
  radioCircle: { width: 20, height: 20, borderRadius: borderRadiusValues.full, borderWidth: 2, borderColor: theme.colors.border.default, alignItems: 'center', justifyContent: 'center' },
  radioCircleActive: { borderColor: colors.journeys.health.primary },
  radioInner: { width: 10, height: 10, borderRadius: borderRadiusValues.full, backgroundColor: colors.journeys.health.primary },
  radioLabel: { marginLeft: spacingValues.sm, flex: 1 },
  infoCard: { marginTop: spacingValues.xl, borderLeftWidth: 3, borderLeftColor: colors.journeys.health.primary },
  infoText: { marginTop: spacingValues.xs, lineHeight: 20 },
});

export default StepChronicPain;
