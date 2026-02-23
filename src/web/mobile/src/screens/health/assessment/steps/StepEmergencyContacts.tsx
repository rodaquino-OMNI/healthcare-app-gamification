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

const RELATIONSHIP_OPTIONS = [
  'spouse',
  'parent',
  'sibling',
  'child',
  'friend',
  'other',
] as const;

/**
 * StepEmergencyContacts collects primary and optional secondary
 * emergency contact information.
 */
export const StepEmergencyContacts: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const handleShowSecondary = useCallback(() => {
    onUpdate('showSecondary', !data.showSecondary);
  }, [data.showSecondary, onUpdate]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.emergencyContacts.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.emergencyContacts.subtitle')}
      </Text>

      {/* Primary Contact */}
      <Card journey="health" elevation="sm" padding="md" style={styles.card}>
        <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text}>
          {t('healthAssessment.emergencyContacts.primaryTitle')}
        </Text>

        {/* Name */}
        <View style={styles.fieldGroup}>
          <Text fontWeight="medium" fontSize="sm" style={styles.label}>
            {t('healthAssessment.emergencyContacts.nameLabel')}
          </Text>
          <TextInput
            style={styles.textInput}
            value={data.primaryName || ''}
            onChangeText={(text) => onUpdate('primaryName', text)}
            placeholder={t('healthAssessment.emergencyContacts.namePlaceholder')}
            placeholderTextColor={colors.neutral.gray500}
            autoCapitalize="words"
            testID="input-primary-name"
          />
        </View>

        {/* Relationship */}
        <Text fontWeight="medium" fontSize="sm" style={styles.label}>
          {t('healthAssessment.emergencyContacts.relationshipLabel')}
        </Text>
        <View style={styles.chipRow}>
          {RELATIONSHIP_OPTIONS.map((opt) => {
            const selected = data.primaryRelationship === opt;
            return (
              <Touchable
                key={opt}
                onPress={() => onUpdate('primaryRelationship', opt)}
                accessibilityLabel={t(`healthAssessment.emergencyContacts.relationship.${opt}`)}
                accessibilityRole="button"
                testID={`primary-relationship-${opt}`}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  fontSize="sm"
                  fontWeight={selected ? 'semiBold' : 'regular'}
                  color={selected ? colors.neutral.white : colors.neutral.gray700}
                >
                  {t(`healthAssessment.emergencyContacts.relationship.${opt}`)}
                </Text>
              </Touchable>
            );
          })}
        </View>

        {/* Phone */}
        <View style={styles.fieldGroup}>
          <Text fontWeight="medium" fontSize="sm" style={styles.label}>
            {t('healthAssessment.emergencyContacts.phoneLabel')}
          </Text>
          <TextInput
            style={styles.textInput}
            value={data.primaryPhone || ''}
            onChangeText={(text) => onUpdate('primaryPhone', text)}
            placeholder={t('healthAssessment.emergencyContacts.phonePlaceholder')}
            placeholderTextColor={colors.neutral.gray500}
            keyboardType="phone-pad"
            testID="input-primary-phone"
          />
        </View>
      </Card>

      {/* Add Secondary Toggle */}
      <Touchable
        onPress={handleShowSecondary}
        accessibilityLabel={t('healthAssessment.emergencyContacts.addSecondary')}
        accessibilityRole="button"
        testID="toggle-secondary-contact"
        style={styles.addButton}
      >
        <Text
          fontSize="sm"
          fontWeight="semiBold"
          color={colors.journeys.health.primary}
        >
          {data.showSecondary
            ? t('healthAssessment.emergencyContacts.removeSecondary')
            : t('healthAssessment.emergencyContacts.addSecondary')}
        </Text>
      </Touchable>

      {/* Secondary Contact */}
      {data.showSecondary && (
        <Card journey="health" elevation="sm" padding="md" style={styles.card}>
          <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text}>
            {t('healthAssessment.emergencyContacts.secondaryTitle')}
          </Text>

          <View style={styles.fieldGroup}>
            <Text fontWeight="medium" fontSize="sm" style={styles.label}>
              {t('healthAssessment.emergencyContacts.nameLabel')}
            </Text>
            <TextInput
              style={styles.textInput}
              value={data.secondaryName || ''}
              onChangeText={(text) => onUpdate('secondaryName', text)}
              placeholder={t('healthAssessment.emergencyContacts.namePlaceholder')}
              placeholderTextColor={colors.neutral.gray500}
              autoCapitalize="words"
              testID="input-secondary-name"
            />
          </View>

          <Text fontWeight="medium" fontSize="sm" style={styles.label}>
            {t('healthAssessment.emergencyContacts.relationshipLabel')}
          </Text>
          <View style={styles.chipRow}>
            {RELATIONSHIP_OPTIONS.map((opt) => {
              const selected = data.secondaryRelationship === opt;
              return (
                <Touchable
                  key={opt}
                  onPress={() => onUpdate('secondaryRelationship', opt)}
                  accessibilityLabel={t(`healthAssessment.emergencyContacts.relationship.${opt}`)}
                  accessibilityRole="button"
                  testID={`secondary-relationship-${opt}`}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text
                    fontSize="sm"
                    fontWeight={selected ? 'semiBold' : 'regular'}
                    color={selected ? colors.neutral.white : colors.neutral.gray700}
                  >
                    {t(`healthAssessment.emergencyContacts.relationship.${opt}`)}
                  </Text>
                </Touchable>
              );
            })}
          </View>

          <View style={styles.fieldGroup}>
            <Text fontWeight="medium" fontSize="sm" style={styles.label}>
              {t('healthAssessment.emergencyContacts.phoneLabel')}
            </Text>
            <TextInput
              style={styles.textInput}
              value={data.secondaryPhone || ''}
              onChangeText={(text) => onUpdate('secondaryPhone', text)}
              placeholder={t('healthAssessment.emergencyContacts.phonePlaceholder')}
              placeholderTextColor={colors.neutral.gray500}
              keyboardType="phone-pad"
              testID="input-secondary-phone"
            />
          </View>
        </Card>
      )}
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
  card: {
    marginBottom: spacingValues.md,
  },
  fieldGroup: {
    marginTop: spacingValues.sm,
  },
  label: {
    marginBottom: spacingValues.xs,
    marginTop: spacingValues.sm,
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
  addButton: {
    alignItems: 'center',
    paddingVertical: spacingValues.md,
  },
});

export default StepEmergencyContacts;
