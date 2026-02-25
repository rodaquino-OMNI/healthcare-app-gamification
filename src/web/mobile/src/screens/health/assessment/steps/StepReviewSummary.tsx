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

interface SectionConfig {
  key: string;
  fields: { label: string; valueKey: string }[];
}

const SECTIONS: SectionConfig[] = [
  {
    key: 'personalInfo',
    fields: [
      { label: 'fullName', valueKey: 'fullName' },
      { label: 'dateOfBirth', valueKey: 'dateOfBirth' },
      { label: 'gender', valueKey: 'gender' },
      { label: 'bloodType', valueKey: 'bloodType' },
    ],
  },
  {
    key: 'healthConditions',
    fields: [
      { label: 'conditions', valueKey: 'existingConditions' },
      { label: 'allergies', valueKey: 'allergies' },
      { label: 'medications', valueKey: 'currentMedications' },
    ],
  },
  {
    key: 'lifestyle',
    fields: [
      { label: 'exercise', valueKey: 'exerciseFrequency' },
      { label: 'diet', valueKey: 'dietType' },
      { label: 'sleep', valueKey: 'sleepHours' },
    ],
  },
  {
    key: 'mentalHealth',
    fields: [
      { label: 'stressLevel', valueKey: 'stressLevel' },
      { label: 'mood', valueKey: 'moodRating' },
    ],
  },
  {
    key: 'goals',
    fields: [
      { label: 'healthGoals', valueKey: 'healthGoals' },
    ],
  },
];

const formatValue = (value: any): string => {
  if (value === undefined || value === null || value === '') return '--';
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '--';
  return String(value);
};

/**
 * StepReviewSummary displays a read-only overview of all assessment data,
 * organized by section with an edit link for each section.
 */
export const StepReviewSummary: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.reviewSummary.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.reviewSummary.subtitle')}
      </Text>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <Card
          key={section.key}
          journey="health"
          elevation="sm"
          padding="md"
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text}>
              {t(`healthAssessment.reviewSummary.sections.${section.key}`)}
            </Text>
            <Touchable
              onPress={() => onUpdate('editSection', section.key)}
              accessibilityLabel={t('healthAssessment.reviewSummary.edit')}
              accessibilityRole="button"
              testID={`edit-${section.key}`}
              style={styles.editButton as any}
            >
              <Text
                fontSize="sm"
                fontWeight="semiBold"
                color={colors.journeys.health.primary}
              >
                {t('healthAssessment.reviewSummary.edit')}
              </Text>
            </Touchable>
          </View>

          {section.fields.map((field) => (
            <View key={field.valueKey} style={styles.fieldRow}>
              <Text fontSize="sm" color={colors.neutral.gray600}>
                {t(`healthAssessment.reviewSummary.fields.${field.label}`)}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={colors.neutral.gray900}
                style={styles.fieldValue}
              >
                {formatValue(data[field.valueKey])}
              </Text>
            </View>
          ))}
        </Card>
      ))}

      {/* Confirmation Note */}
      <View style={styles.noteContainer}>
        <Text fontSize="xs" color={colors.neutral.gray600} textAlign="center">
          {t('healthAssessment.reviewSummary.confirmNote')}
        </Text>
      </View>
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
  card: {
    marginBottom: spacingValues.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues.sm,
  },
  editButton: {
    paddingVertical: spacingValues.xs,
    paddingHorizontal: spacingValues.sm,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacingValues.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray200,
  },
  fieldValue: {
    maxWidth: '50%',
    textAlign: 'right',
  },
  noteContainer: {
    paddingVertical: spacingValues.md,
  },
});

export default StepReviewSummary;
