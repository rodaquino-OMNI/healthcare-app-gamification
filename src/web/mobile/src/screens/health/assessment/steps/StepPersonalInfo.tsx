import React, { useCallback } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';

interface StepProps {
  data: Record<string, any>;
  onUpdate: (field: string, value: any) => void;
}

const GENDER_OPTIONS = ['male', 'female', 'other'] as const;

const BLOOD_TYPE_OPTIONS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
] as const;

/**
 * StepPersonalInfo collects basic demographic data: name, DOB, gender, blood type.
 */
export const StepPersonalInfo: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const handleGenderSelect = useCallback(
    (gender: string) => {
      onUpdate('gender', gender);
    },
    [onUpdate],
  );

  const handleBloodTypeSelect = useCallback(
    (type: string) => {
      onUpdate('bloodType', type);
    },
    [onUpdate],
  );

  return (
    <View style={styles.container} testID="step-personal-info">
      {/* Section Title */}
      <Text variant="heading" fontSize="heading-lg" journey="health">
        {t('healthAssessment.personalInfo.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.personalInfo.subtitle')}
      </Text>

      {/* Full Name */}
      <View style={styles.fieldGroup}>
        <Text fontWeight="medium" fontSize="sm" style={styles.label}>
          {t('healthAssessment.personalInfo.fullName')}
        </Text>
        <TextInput
          style={styles.textInput}
          value={data.fullName || ''}
          onChangeText={(text) => onUpdate('fullName', text)}
          placeholder={t('healthAssessment.personalInfo.fullNamePlaceholder')}
          placeholderTextColor={colors.neutral.gray500}
          autoCapitalize="words"
          testID="input-full-name"
        />
      </View>

      {/* Date of Birth */}
      <View style={styles.fieldGroup}>
        <Text fontWeight="medium" fontSize="sm" style={styles.label}>
          {t('healthAssessment.personalInfo.dateOfBirth')}
        </Text>
        <TextInput
          style={styles.textInput}
          value={data.dateOfBirth || ''}
          onChangeText={(text) => onUpdate('dateOfBirth', text)}
          placeholder={t('healthAssessment.personalInfo.dateOfBirthPlaceholder')}
          placeholderTextColor={colors.neutral.gray500}
          keyboardType="numeric"
          testID="input-date-of-birth"
        />
      </View>

      {/* Gender Selector */}
      <View style={styles.fieldGroup}>
        <Text fontWeight="medium" fontSize="sm" style={styles.label}>
          {t('healthAssessment.personalInfo.gender')}
        </Text>
        <View style={styles.optionRow}>
          {GENDER_OPTIONS.map((option) => (
            <Touchable
              key={option}
              onPress={() => handleGenderSelect(option)}
              accessibilityLabel={t(
                `healthAssessment.personalInfo.gender_${option}`,
              )}
              accessibilityRole="button"
              testID={`gender-${option}`}
              style={[
                styles.optionPill,
                data.gender === option && styles.optionPillSelected,
              ]}
            >
              <Text
                fontSize="sm"
                fontWeight={data.gender === option ? 'semiBold' : 'regular'}
                color={
                  data.gender === option
                    ? colors.neutral.white
                    : colors.neutral.gray700
                }
              >
                {t(`healthAssessment.personalInfo.gender_${option}`)}
              </Text>
            </Touchable>
          ))}
        </View>
      </View>

      {/* Blood Type Grid */}
      <View style={styles.fieldGroup}>
        <Text fontWeight="medium" fontSize="sm" style={styles.label}>
          {t('healthAssessment.personalInfo.bloodType')}
        </Text>
        <View style={styles.bloodTypeGrid}>
          {BLOOD_TYPE_OPTIONS.map((type) => (
            <Touchable
              key={type}
              onPress={() => handleBloodTypeSelect(type)}
              accessibilityLabel={type}
              accessibilityRole="button"
              testID={`blood-type-${type}`}
              style={[
                styles.bloodTypeCell,
                data.bloodType === type && styles.bloodTypeCellSelected,
              ]}
            >
              <Text
                fontSize="sm"
                fontWeight={data.bloodType === type ? 'semiBold' : 'regular'}
                color={
                  data.bloodType === type
                    ? colors.neutral.white
                    : colors.neutral.gray700
                }
                textAlign="center"
              >
                {type}
              </Text>
            </Touchable>
          ))}
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingTop: spacingValues.xl,
  },
  subtitle: {
    marginTop: spacingValues.xs,
    marginBottom: spacingValues.xl,
  },
  fieldGroup: {
    marginBottom: spacingValues.lg,
  },
  label: {
    marginBottom: spacingValues.xs,
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
    gap: spacingValues.xs,
  },
  optionPill: {
    flex: 1,
    paddingVertical: spacingValues.sm,
    borderRadius: borderRadiusValues.full,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
  },
  optionPillSelected: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  bloodTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
  },
  bloodTypeCell: {
    width: '23%',
    paddingVertical: spacingValues.sm,
    borderRadius: borderRadiusValues.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
  },
  bloodTypeCellSelected: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
});

export default StepPersonalInfo;
