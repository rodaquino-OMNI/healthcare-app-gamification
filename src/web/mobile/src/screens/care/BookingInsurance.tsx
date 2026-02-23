import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { ROUTES } from '@constants/routes';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

interface InsurancePlan {
  id: string;
  name: string;
  covered: boolean;
  copay: string;
  coveragePercent: number;
  authorized: boolean;
}

const INSURANCE_PLANS: InsurancePlan[] = [
  { id: 'unimed', name: 'Unimed', covered: true, copay: 'R$ 50,00', coveragePercent: 80, authorized: true },
  { id: 'bradesco', name: 'Bradesco Saude', covered: true, copay: 'R$ 70,00', coveragePercent: 70, authorized: true },
  { id: 'sulamerica', name: 'SulAmerica', covered: true, copay: 'R$ 60,00', coveragePercent: 75, authorized: false },
  { id: 'amil', name: 'Amil', covered: false, copay: '-', coveragePercent: 0, authorized: false },
  { id: 'particular', name: 'Particular', covered: false, copay: '-', coveragePercent: 0, authorized: false },
];

/**
 * BookingInsurance screen allows the user to select and verify their insurance
 * coverage for the appointment. Shows copay estimate, coverage percentage, and
 * authorization status.
 */
export const BookingInsurance: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const { doctorId, appointmentType } = route.params || {
    doctorId: 'doc-001',
    appointmentType: 'in-person',
  };

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);

  const selectedPlan = INSURANCE_PLANS.find((p) => p.id === selectedPlanId);

  useEffect(() => {
    if (selectedPlanId) {
      setIsVerifying(true);
      setVerificationDone(false);
      const timer = setTimeout(() => {
        setIsVerifying(false);
        setVerificationDone(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [selectedPlanId]);

  const handleContinue = useCallback(() => {
    navigation.navigate(ROUTES.CARE_BOOKING_SCHEDULE, {
      doctorId,
      appointmentType,
      insurancePlan: selectedPlanId,
    });
  }, [navigation, doctorId, appointmentType, selectedPlanId]);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          testID="back-button"
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text fontSize="lg">{'\u2190'}</Text>
        </TouchableOpacity>
        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.care.text}>
          {t('consultation.insurance.title')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Plan Selector */}
        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
          {t('consultation.insurance.selectPlan')}
        </Text>

        {INSURANCE_PLANS.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          return (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelectedPlanId(plan.id)}
              accessibilityLabel={plan.name}
              accessibilityRole="button"
              testID={`plan-${plan.id}`}
              style={[styles.planOption, isSelected && styles.planOptionSelected]}
            >
              <View style={styles.radioOuter}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
              <Text
                fontSize="md"
                fontWeight={isSelected ? 'bold' : 'regular'}
                color={colors.journeys.care.text}
              >
                {plan.id === 'particular'
                  ? t('consultation.insurance.particular')
                  : plan.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Verification Result */}
        {isVerifying && (
          <Card journey="care" elevation="sm">
            <View style={styles.verifyingContainer}>
              <Text fontSize="md" color={colors.neutral.gray600}>
                {t('consultation.insurance.verifying')}...
              </Text>
            </View>
          </Card>
        )}

        {verificationDone && selectedPlan && (
          <View style={styles.resultSection}>
            {/* Coverage Status Card */}
            <Card journey="care" elevation="md">
              <View style={styles.statusHeader}>
                <Badge
                  variant="status"
                  status={selectedPlan.covered ? 'success' : 'error'}
                  testID="coverage-status"
                  accessibilityLabel={
                    selectedPlan.covered
                      ? t('consultation.insurance.covered')
                      : t('consultation.insurance.notCovered')
                  }
                >
                  {selectedPlan.covered
                    ? t('consultation.insurance.covered')
                    : t('consultation.insurance.notCovered')}
                </Badge>
              </View>

              {selectedPlan.covered && (
                <View style={styles.coverageDetails}>
                  <View style={styles.detailRow}>
                    <Text fontSize="sm" color={colors.neutral.gray600}>
                      {t('consultation.insurance.copay')}
                    </Text>
                    <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                      {selectedPlan.copay}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text fontSize="sm" color={colors.neutral.gray600}>
                      {t('consultation.insurance.coverage')}
                    </Text>
                    <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.primary}>
                      {selectedPlan.coveragePercent}%
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text fontSize="sm" color={colors.neutral.gray600}>
                      {t('consultation.insurance.authorization')}
                    </Text>
                    <Badge
                      variant="status"
                      status={selectedPlan.authorized ? 'success' : 'warning'}
                      size="sm"
                      testID="auth-status"
                    >
                      {selectedPlan.authorized
                        ? t('consultation.insurance.authorized')
                        : t('consultation.insurance.verifying')}
                    </Badge>
                  </View>
                </View>
              )}
            </Card>

            {/* Warning for not covered */}
            {!selectedPlan.covered && selectedPlan.id !== 'particular' && (
              <Card journey="care" elevation="sm">
                <View style={styles.warningCard}>
                  <Text fontSize="lg">{'\u26A0\uFE0F'}</Text>
                  <Text fontSize="sm" color={colors.neutral.gray700} style={styles.warningText}>
                    {t('consultation.insurance.warning')}
                  </Text>
                </View>
              </Card>
            )}
          </View>
        )}
      </ScrollView>

      {/* Continue CTA */}
      <View style={styles.ctaContainer}>
        <Button
          variant="primary"
          journey="care"
          size="lg"
          onPress={handleContinue}
          disabled={!verificationDone || !selectedPlan}
          accessibilityLabel={t('consultation.insurance.continue')}
          testID="continue-button"
        >
          {t('consultation.insurance.continue')}
        </Button>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['6xl'],
    gap: spacingValues.sm,
  },
  planOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.md,
    borderRadius: spacingValues.xs,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
    gap: spacingValues.sm,
  },
  planOptionSelected: {
    borderColor: colors.journeys.care.primary,
    backgroundColor: colors.journeys.care.background,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.journeys.care.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.journeys.care.primary,
  },
  verifyingContainer: {
    alignItems: 'center',
    paddingVertical: spacingValues.lg,
  },
  resultSection: {
    gap: spacingValues.sm,
    marginTop: spacingValues.xs,
  },
  statusHeader: {
    alignItems: 'flex-start',
    marginBottom: spacingValues.sm,
  },
  coverageDetails: {
    gap: spacingValues.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray200,
    paddingTop: spacingValues.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
  },
  warningText: {
    flex: 1,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.journeys.care.background,
    padding: spacingValues.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
});

export default BookingInsurance;
