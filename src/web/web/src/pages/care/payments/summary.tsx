import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface FeeItem {
    label: string;
    amount: string;
    type: 'charge' | 'discount' | 'total';
}

const FEE_BREAKDOWN: FeeItem[] = [
    { label: 'Telemedicine Consultation', amount: 'R$ 250.00', type: 'charge' },
    { label: 'Insurance Coverage (80%)', amount: '- R$ 200.00', type: 'discount' },
    { label: 'Copay', amount: 'R$ 50.00', type: 'charge' },
    { label: 'Total Due', amount: 'R$ 50.00', type: 'total' },
];

const MOCK_PAYMENT = {
    method: 'Credit Card ending in 4321',
    doctor: 'Dr. Maria Santos',
    date: 'Feb 21, 2026',
    service: 'Telemedicine - General Practitioner',
};

/** Payment summary page with fee breakdown and payment action. */
const PaymentSummaryPage: React.FC = () => {
    const router = useRouter();

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
                        {MOCK_PAYMENT.doctor}
                    </Text>
                </Box>
                <Box display="flex" justifyContent="space-between" style={{ marginBottom: spacing['3xs'] }}>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Service
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                        {MOCK_PAYMENT.service}
                    </Text>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Date
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                        {MOCK_PAYMENT.date}
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
                    {FEE_BREAKDOWN.map((item, idx) => (
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
                            {MOCK_PAYMENT.method}
                        </Text>
                    </div>
                    <Badge variant="status" status="info">
                        Saved
                    </Badge>
                </Box>
            </Card>

            <Button
                journey="care"
                onPress={() => router.push('/care/payments/receipt')}
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

export default PaymentSummaryPage;
