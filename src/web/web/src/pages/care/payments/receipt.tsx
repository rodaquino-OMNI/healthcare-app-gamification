import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';

import { usePayments } from '@/hooks';

/** Payment receipt page showing transaction confirmation and download options. */
const ReceiptPage: React.FC = () => {
    const router = useRouter();
    const { isLoading, error, getReceipt } = usePayments();
    const receipt = getReceipt('current');

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading receipt...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    Failed to load receipt.
                </Text>
            </div>
        );
    }

    const receiptData = {
        transactionId: receipt?.transactionId ?? '',
        date: receipt?.date ?? '',
        time: receipt?.time ?? '',
        status: receipt?.status ?? '',
        method: receipt?.method ?? '',
        amount: receipt?.amount ?? '',
        doctor: receipt?.doctor ?? '',
        service: receipt?.service ?? '',
        duration: receipt?.duration ?? '',
        insurancePlan: receipt?.insurancePlan ?? '',
        insuranceCoverage: receipt?.insuranceCoverage ?? '',
    };

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
                        {receiptData.status}
                    </Badge>
                </Box>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Transaction ID
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                            {receiptData.transactionId}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Date
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                            {receiptData.date} at {receiptData.time}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Payment Method
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                            {receiptData.method}
                        </Text>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        style={{
                            paddingTop: spacing.xs,
                            borderTop: `1px solid ${colors.gray[20]}`,
                        }}
                    >
                        <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
                            Amount Paid
                        </Text>
                        <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.primary}>
                            {receiptData.amount}
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
                            {receiptData.doctor}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Service
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text}>
                            {receiptData.service}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Duration
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text}>
                            {receiptData.duration}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Insurance
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text}>
                            {receiptData.insurancePlan} (-{receiptData.insuranceCoverage})
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
                    onPress={() => void router.push('/care')}
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
