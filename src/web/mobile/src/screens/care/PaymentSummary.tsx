import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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

type PaymentSummaryRouteParams = {
  appointmentId: string;
  doctorName: string;
};

interface PaymentCard {
  id: string;
  brand: string;
  lastFour: string;
  holderName: string;
}

interface FeeLineItem {
  label: string;
  amount: number;
  type: 'charge' | 'discount' | 'total';
}

const MOCK_CARDS: PaymentCard[] = [
  { id: 'card-001', brand: 'Visa', lastFour: '4242', holderName: 'Rodrigo S.' },
  { id: 'card-002', brand: 'Mastercard', lastFour: '8831', holderName: 'Rodrigo S.' },
];

const MOCK_INSURANCE = {
  planName: 'AUSTA Premium',
  memberId: 'AUS-2026-00481',
  coveragePercent: 80,
  status: 'active' as const,
};

const formatCurrency = (value: number): string =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

/**
 * PaymentSummary screen displays a detailed payment breakdown
 * for a care appointment, including insurance coverage, saved
 * payment methods, and action buttons to pay or defer.
 */
const PaymentSummary: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: PaymentSummaryRouteParams }, 'params'>>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const { appointmentId, doctorName } = route.params || {
    appointmentId: 'appt-001',
    doctorName: 'Dra. Ana Silva',
  };

  const [selectedCardId, setSelectedCardId] = useState<string>(MOCK_CARDS[0].id);

  const consultationFee = 350.0;
  const insuranceDiscount = consultationFee * (MOCK_INSURANCE.coveragePercent / 100);
  const copay = consultationFee - insuranceDiscount;
  const additionalFees = 5.0;
  const totalAmount = copay + additionalFees;

  const lineItems: FeeLineItem[] = [
    { label: t('journeys.care.payment.consultationFee'), amount: consultationFee, type: 'charge' },
    { label: t('journeys.care.payment.insuranceCoverage'), amount: -insuranceDiscount, type: 'discount' },
    { label: t('journeys.care.payment.copay'), amount: copay, type: 'charge' },
    { label: t('journeys.care.payment.additionalFees'), amount: additionalFees, type: 'charge' },
  ];

  const handlePayNow = useCallback(() => {
    navigation.navigate(ROUTES.CARE_PAYMENT_RECEIPT, {
      appointmentId,
      paymentId: `pay-${Date.now()}`,
    });
  }, [navigation, appointmentId]);

  const handlePayLater = useCallback(() => {
    navigation.navigate(ROUTES.CARE_DASHBOARD);
  }, [navigation]);

  const handleAddPaymentMethod = useCallback(() => {
    // Mock: would open add payment method flow
  }, []);

  const handleSelectCard = useCallback((cardId: string) => {
    setSelectedCardId(cardId);
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Text variant="heading" journey="care" testID="payment-summary-title">
          {t('journeys.care.payment.summaryTitle')}
        </Text>
        <Text
          fontSize="text-sm"
          color={colors.neutral.gray600}
          testID="payment-doctor-name"
        >
          {t('journeys.care.payment.consultationWith', { doctorName })}
        </Text>

        {/* Payment Breakdown */}
        <Card journey="care" elevation="md">
          <Text variant="body" fontWeight="semiBold" journey="care" testID="breakdown-title">
            {t('journeys.care.payment.breakdownTitle')}
          </Text>

          {lineItems.map((item, index) => (
            <View key={index} style={styles.lineItemRow}>
              <View style={styles.lineItemLabel}>
                <Text fontSize="text-sm" color={colors.neutral.gray600}>
                  {item.label}
                </Text>
                {item.label === t('journeys.care.payment.insuranceCoverage') && (
                  <Badge
                    variant="status"
                    status="success"
                    testID="coverage-badge"
                    accessibilityLabel={t('journeys.care.payment.coveragePercent', {
                      percent: MOCK_INSURANCE.coveragePercent,
                    })}
                  >
                    {MOCK_INSURANCE.coveragePercent}%
                  </Badge>
                )}
              </View>
              <Text
                fontSize="text-sm"
                fontWeight="semiBold"
                color={item.type === 'discount' ? colors.semantic.success : colors.journeys.care.text}
                testID={`line-item-${index}`}
              >
                {item.type === 'discount' ? '- ' : ''}
                {formatCurrency(Math.abs(item.amount))}
              </Text>
            </View>
          ))}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Total */}
          <View style={styles.totalRow}>
            <Text variant="body" fontWeight="bold" journey="care">
              {t('journeys.care.payment.total')}
            </Text>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color={colors.journeys.care.primary}
              testID="total-amount"
            >
              {formatCurrency(totalAmount)}
            </Text>
          </View>
        </Card>

        {/* Insurance Info */}
        <Card journey="care" elevation="sm">
          <Text variant="body" fontWeight="semiBold" journey="care" testID="insurance-title">
            {t('journeys.care.payment.insuranceInfo')}
          </Text>

          <View style={styles.infoRow}>
            <Text fontSize="text-sm" color={colors.neutral.gray600}>
              {t('journeys.care.payment.planName')}
            </Text>
            <Text fontSize="text-sm" fontWeight="semiBold" journey="care" testID="plan-name">
              {MOCK_INSURANCE.planName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text fontSize="text-sm" color={colors.neutral.gray600}>
              {t('journeys.care.payment.memberId')}
            </Text>
            <Text fontSize="text-sm" journey="care" testID="member-id">
              {MOCK_INSURANCE.memberId}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text fontSize="text-sm" color={colors.neutral.gray600}>
              {t('journeys.care.payment.coverageStatus')}
            </Text>
            <Badge
              variant="status"
              status="success"
              testID="coverage-status-badge"
              accessibilityLabel={t('journeys.care.payment.coverageActive')}
            >
              {t('journeys.care.payment.coverageActive')}
            </Badge>
          </View>
        </Card>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text variant="body" fontWeight="semiBold" journey="care" testID="payment-methods-title">
            {t('journeys.care.payment.paymentMethod')}
          </Text>

          {MOCK_CARDS.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.cardOption,
                selectedCardId === card.id && styles.cardOptionSelected,
              ]}
              onPress={() => handleSelectCard(card.id)}
              testID={`card-option-${card.lastFour}`}
              accessibilityLabel={t('journeys.care.payment.selectCard', {
                brand: card.brand,
                lastFour: card.lastFour,
              })}
              accessibilityRole="radio"
            >
              <View style={styles.cardInfo}>
                <View style={styles.cardBrandIcon}>
                  <Text fontSize="text-sm" fontWeight="bold" color={colors.neutral.white}>
                    {card.brand.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text fontSize="text-sm" fontWeight="semiBold" journey="care">
                    {card.brand} {t('journeys.care.payment.endingIn')} {card.lastFour}
                  </Text>
                  <Text fontSize="text-sm" color={colors.neutral.gray600}>
                    {card.holderName}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  selectedCardId === card.id && styles.radioOuterSelected,
                ]}
              >
                {selectedCardId === card.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={handleAddPaymentMethod}
            style={styles.addMethodButton}
            testID="add-payment-method"
            accessibilityLabel={t('journeys.care.payment.addPaymentMethod')}
            accessibilityRole="button"
          >
            <Text
              fontSize="text-sm"
              fontWeight="semiBold"
              color={colors.journeys.care.primary}
            >
              + {t('journeys.care.payment.addPaymentMethod')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaContainer}>
          <Button
            onPress={handlePayNow}
            journey="care"
            testID="pay-now-button"
            accessibilityLabel={t('journeys.care.payment.payNow')}
          >
            {t('journeys.care.payment.payNow')} - {formatCurrency(totalAmount)}
          </Button>

          <Button
            onPress={handlePayLater}
            journey="care"
            variant="secondary"
            testID="pay-later-button"
            accessibilityLabel={t('journeys.care.payment.payLater')}
          >
            {t('journeys.care.payment.payLater')}
          </Button>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text
            fontSize="text-sm"
            color={colors.neutral.gray500}
            textAlign="center"
            testID="security-notice"
          >
            {t('journeys.care.payment.securityNotice')}
          </Text>
          <Text
            fontSize="text-sm"
            color={colors.neutral.gray500}
            textAlign="center"
          >
            {t('journeys.care.payment.lgpdCompliant')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  lineItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingValues['3xs'],
  },
  lineItemLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.default,
    marginVertical: spacingValues.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingValues['3xs'],
  },
  section: {
    marginTop: spacingValues.md,
    gap: spacingValues.sm,
  },
  cardOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacingValues.sm,
    borderRadius: spacingValues.xs,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  cardOptionSelected: {
    borderColor: colors.journeys.care.primary,
    borderWidth: 2,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
  },
  cardBrandIcon: {
    width: 40,
    height: 28,
    borderRadius: spacingValues['3xs'],
    backgroundColor: colors.journeys.care.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.neutral.gray400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.journeys.care.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.journeys.care.primary,
  },
  addMethodButton: {
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
  },
  ctaContainer: {
    marginTop: spacingValues.xl,
    gap: spacingValues.sm,
  },
  securityNotice: {
    marginTop: spacingValues.xl,
    gap: spacingValues['4xs'],
    paddingHorizontal: spacingValues.md,
  },
});

export { PaymentSummary };
export default PaymentSummary;
