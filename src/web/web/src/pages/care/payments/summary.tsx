import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { usePayments } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface FeeItem {
    label: string;
    amount: string;
    type: 'charge' | 'discount' | 'total';
}

/** Payment summary page with fee breakdown and payment action. */
const PaymentSummaryPage: React.FC = () => {
    const router = useRouter();
    const { payments, isLoading, error } = usePayments();
    const feeBreakdown: FeeItem[] = [];
    const paymentInfo = {
        method: '',
        doctor: '',
        date: '',
        service: '',
    };
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    {t('common.loading')}
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    {t('common.error')}
                </Text>
            </div>
        );
    }

    void payments;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Payment Summary
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Review your charges before payment.
            </Text>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Service Details
                </Text>
                <Box display="flex" justifyContent="space-between" style={{ marginBottom: spacing['3xs'] }}>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Doctor
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                        {paymentInfo.doctor}
                    </Text>
                </Box>
                <Box display="flex" justifyContent="space-between" style={{ marginBottom: spacing['3xs'] }}>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Service
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                        {paymentInfo.service}
                    </Text>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Date
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                        {paymentInfo.date}
                    </Text>
                </Box>
            </Card>

            <Card journey="care" elevation="md" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.md }}
                >
                    Fee Breakdown
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {feeBreakdown.map((item, idx) => (
                        <Box
                            key={idx}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{
                                paddingTop: item.type === 'total' ? spacing.sm : undefined,
                                borderTop: item.type === 'total' ? `1px solid ${colors.gray[20]}` : undefined,
                            }}
                        >
                            <Text
                                fontSize={item.type === 'total' ? 'md' : 'sm'}
                                fontWeight={item.type === 'total' ? 'bold' : 'regular'}
                                color={item.type === 'discount' ? colors.semantic.success : colors.journeys.care.text}
                            >
                                {item.label}
                            </Text>
                            <Text
                                fontSize={item.type === 'total' ? 'lg' : 'sm'}
                                fontWeight={item.type === 'total' ? 'bold' : 'medium'}
                                color={item.type === 'discount' ? colors.semantic.success : colors.journeys.care.text}
                            >
                                {item.amount}
                            </Text>
                        </Box>
                    ))}
                </div>
            </Card>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.xl }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <div>
                        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                            Payment Method
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {paymentInfo.method}
                        </Text>
                    </div>
                    <Badge variant="status" status="info">
                        Saved
                    </Badge>
                </Box>
            </Card>

            <Button
                journey="care"
                onPress={() => void router.push('/care/payments/receipt')}
                accessibilityLabel="Pay now"
                data-testid="payment-pay-now-btn"
            >
                Pay Now - R$ 50.00
            </Button>

            <Box display="flex" justifyContent="center" style={{ marginTop: spacing.lg }}>
                <Button
                    variant="tertiary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                    data-testid="payment-summary-back-btn"
                >
                    Back
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default PaymentSummaryPage;
