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

const CONSENT_KEYS = [
  'shareHealthData',
  'receiveInsights',
  'dataProtection',
] as const;

/**
 * StepConsentPrivacy presents data consent toggles and privacy information.
 * Users must acknowledge data sharing, insights, and LGPD/HIPAA compliance.
 */
export const StepConsentPrivacy: React.FC<StepProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const handleToggle = useCallback(
    (key: string) => {
      onUpdate(key, !data[key]);
    },
    [data, onUpdate],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
        {t('healthAssessment.consentPrivacy.title')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
        {t('healthAssessment.consentPrivacy.subtitle')}
      </Text>

      {/* Consent Toggles */}
      {CONSENT_KEYS.map((key) => {
        const isChecked = !!data[key];
        return (
          <Touchable
            key={key}
            onPress={() => handleToggle(key)}
            accessibilityLabel={t(`healthAssessment.consentPrivacy.${key}`)}
            accessibilityRole="checkbox"
            testID={`consent-${key}`}
            style={[styles.consentRow, isChecked && styles.consentRowActive] as any}
          >
            <View style={[styles.checkbox, isChecked && styles.checkboxActive] as any}>
              {isChecked && (
                <Text fontSize="xs" color={colors.neutral.white} textAlign="center">
                  {'\u2713'}
                </Text>
              )}
            </View>
            <View style={styles.consentTextWrap}>
              <Text
                fontSize="sm"
                fontWeight={isChecked ? 'semiBold' : 'regular'}
                color={isChecked ? colors.journeys.health.text : colors.neutral.gray700}
                style={styles.consentLabel}
              >
                {t(`healthAssessment.consentPrivacy.${key}`)}
              </Text>
            </View>
          </Touchable>
        );
      })}

      {/* Data Usage Explanation */}
      <Card journey="health" elevation="sm" padding="md" style={styles.infoCard}>
        <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text} style={styles.infoTitle}>
          {t('healthAssessment.consentPrivacy.dataUsageTitle')}
        </Text>
        <Text fontSize="sm" color={colors.neutral.gray600} style={styles.infoText}>
          {t('healthAssessment.consentPrivacy.dataUsageBody')}
        </Text>
      </Card>

      {/* Privacy Policy Link */}
      <Touchable
        onPress={() => onUpdate('viewPrivacyPolicy', true)}
        accessibilityLabel={t('healthAssessment.consentPrivacy.privacyPolicyLink')}
        accessibilityRole="link"
        testID="privacy-policy-link"
        style={styles.linkButton}
      >
        <Text
          fontSize="sm"
          fontWeight="semiBold"
          color={colors.journeys.health.primary}
        >
          {t('healthAssessment.consentPrivacy.privacyPolicyLink')}
        </Text>
      </Touchable>

      {/* Security Note */}
      <View style={styles.securityNote}>
        <Text fontSize="xs" color={colors.neutral.gray600} textAlign="center">
          {t('healthAssessment.consentPrivacy.securityNote')}
        </Text>
      </View>
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
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacingValues.md,
    paddingHorizontal: spacingValues.md,
    marginBottom: spacingValues.sm,
    borderRadius: borderRadiusValues.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  consentRowActive: {
    borderColor: colors.journeys.health.primary,
    backgroundColor: colors.journeys.health.background,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: borderRadiusValues.xs,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  consentTextWrap: {
    flex: 1,
    marginLeft: spacingValues.sm,
  },
  consentLabel: {
    lineHeight: 20,
  },
  infoCard: {
    marginTop: spacingValues.lg,
  },
  infoTitle: {
    marginBottom: spacingValues.xs,
  },
  infoText: {
    lineHeight: 20,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: spacingValues.md,
    marginTop: spacingValues.sm,
  },
  securityNote: {
    paddingVertical: spacingValues.sm,
  },
});

export default StepConsentPrivacy;
