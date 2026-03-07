import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const MOCK_RECEIPT = {
    transactionId: 'TXN-2026-0221-7834',
    date: 'Feb 21, 2026',
    time: '10:47 AM',
    status: 'Approved',
    method: 'Credit Card ending in 4321',
    amount: 'R$ 50.00',
    doctor: 'Dr. Maria Santos',
    service: 'Telemedicine Consultation',
    duration: '18 min',
    insurancePlan: 'AUSTA Gold',
    insuranceCoverage: 'R$ 200.00',
};

/** Payment receipt page showing transaction confirmation and download options. */
const ReceiptPage: React.FC = () => {
    const router = useRouter();

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" justifyContent="center" style={{ marginBottom: spacing.md }}>
                <div
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: colors.semantic.successBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text fontSize="2xl" color={colors.semantic.success}>
                        {'✓'}
                    </Text>
                </div>
            </Box>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.care.text}
                style={{ textAlign: 'center', marginBottom: spacing.xs }}
            >
                Payment Successful
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                Your payment has been processed successfully.
            </Text>

            <Card journey="care" elevation="md" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ marginBottom: spacing.md }}
                >
                    <Text fontWeight="bold" fontSize="lg" color={colors.journeys.care.text}>
                        Transaction Details
                    </Text>
                    <Badge variant="status" status="success">
                        {MOCK_RECEIPT.status}
                    </Badge>
                </Box>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Transaction ID
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                            {MOCK_RECEIPT.transactionId}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Date
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                            {MOCK_RECEIPT.date} at {MOCK_RECEIPT.time}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Payment Method
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                            {MOCK_RECEIPT.method}
                        </Text>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        style={{ paddingTop: spacing.xs, borderTop: `1px solid ${colors.gray[20]}` }}
                    >
                        <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
                            Amount Paid
                        </Text>
                        <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.primary}>
                            {MOCK_RECEIPT.amount}
                        </Text>
                    </Box>
                </div>
            </Card>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.xl }}>
                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Service Details
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['3xs'] }}>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Doctor
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text}>
                            {MOCK_RECEIPT.doctor}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Service
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text}>
                            {MOCK_RECEIPT.service}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Duration
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text}>
                            {MOCK_RECEIPT.duration}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Insurance
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text}>
                            {MOCK_RECEIPT.insurancePlan} (-{MOCK_RECEIPT.insuranceCoverage})
                        </Text>
                    </Box>
                </div>
            </Card>

            <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.lg }}>
                <Button
                    journey="care"
                    onPress={() => {}}
                    accessibilityLabel="Download PDF receipt"
                    data-testid="receipt-download-pdf-btn"
                >
                    Download PDF
                </Button>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => {}}
                    accessibilityLabel="Email receipt"
                    data-testid="receipt-email-btn"
                >
                    Email Receipt
                </Button>
            </div>

            <Box display="flex" justifyContent="center">
                <Button
                    variant="tertiary"
                    journey="care"
                    onPress={() => router.push('/care')}
                    accessibilityLabel="Return to care dashboard"
                    data-testid="receipt-back-btn"
                >
                    Return to Care
                </Button>
            </Box>
        </div>
    );
};

export default ReceiptPage;
