import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, Share, Alert } from 'react-native';

import { ROUTES } from '@constants/routes';

type PaymentReceiptRouteParams = {
    appointmentId: string;
    paymentId: string;
};

type PaymentStatus = 'paid' | 'pending' | 'failed';

interface TransactionData {
    transactionId: string;
    dateTime: string;
    amountPaid: number;
    paymentMethod: string;
    lastFour: string;
    status: PaymentStatus;
}

interface ServiceData {
    doctorName: string;
    appointmentDate: string;
    serviceType: string;
}

const MOCK_TRANSACTION: TransactionData = {
    transactionId: 'TXN-2026-0481-A7F3',
    dateTime: '21/02/2026 14:32',
    amountPaid: 75.0,
    paymentMethod: 'Visa',
    lastFour: '4242',
    status: 'paid',
};

const MOCK_SERVICE: ServiceData = {
    doctorName: 'Dra. Ana Carolina Silva',
    appointmentDate: '21/02/2026',
    serviceType: 'Consulta Cardiologia',
};

const getStatusBadge = (status: PaymentStatus): 'success' | 'warning' | 'error' => {
    switch (status) {
        case 'paid':
            return 'success';
        case 'pending':
            return 'warning';
        case 'failed':
            return 'error';
        default:
            return 'warning';
    }
};

const formatCurrency = (value: number): string => `R$ ${value.toFixed(2).replace('.', ',')}`;

/**
 * PaymentReceipt screen displays the payment confirmation
 * and receipt details including transaction info, service
 * details, and actions to download/share/print the receipt.
 */
const PaymentReceipt: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<{ params: PaymentReceiptRouteParams }, 'params'>>();
    const { t } = useTranslation();

    const { _appointmentId, _paymentId } = route.params || {
        appointmentId: 'appt-001',
        paymentId: 'pay-001',
    };

    const transaction = MOCK_TRANSACTION;
    const service = MOCK_SERVICE;

    const handleDownloadPDF = useCallback(async () => {
        try {
            await Share.share({
                title: t('journeys.care.payment.receiptPdfTitle'),
                message: t('journeys.care.payment.receiptShareMessage', {
                    transactionId: transaction.transactionId,
                    amount: formatCurrency(transaction.amountPaid),
                }),
            });
        } catch {
            // User cancelled or share failed
        }
    }, [t, transaction]);

    const handleEmailReceipt = useCallback(() => {
        Alert.alert(t('journeys.care.payment.emailSentTitle'), t('journeys.care.payment.emailSentMessage'), [
            { text: t('journeys.care.payment.ok') },
        ]);
    }, [t]);

    const handlePrintReceipt = useCallback(() => {
        Alert.alert(t('journeys.care.payment.printTitle'), t('journeys.care.payment.printMessage'), [
            { text: t('journeys.care.payment.ok') },
        ]);
    }, [t]);

    const handleReturnDashboard = useCallback(() => {
        navigation.navigate(ROUTES.CARE_DASHBOARD);
    }, [navigation]);

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Success Header */}
                <View style={styles.successSection}>
                    <View style={styles.successCircle}>
                        <Text fontSize="xl" fontWeight="bold" color={colors.neutral.white} textAlign="center">
                            {'\u2713'}
                        </Text>
                    </View>
                    <Text variant="heading" journey="care" textAlign="center" testID="receipt-title">
                        {t('journeys.care.payment.paymentConfirmed')}
                    </Text>
                    <Text
                        fontSize="text-sm"
                        color={colors.neutral.gray600}
                        textAlign="center"
                        testID="receipt-subtitle"
                    >
                        {t('journeys.care.payment.receiptSubtitle')}
                    </Text>
                </View>

                {/* Transaction Details */}
                <Card journey="care" elevation="md">
                    <Text variant="body" fontWeight="semiBold" journey="care" testID="transaction-title">
                        {t('journeys.care.payment.transactionDetails')}
                    </Text>

                    <View style={styles.detailRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.payment.transactionId')}
                        </Text>
                        <Text fontSize="text-sm" fontWeight="semiBold" journey="care" testID="transaction-id">
                            {transaction.transactionId}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.payment.dateTime')}
                        </Text>
                        <Text fontSize="text-sm" journey="care" testID="transaction-datetime">
                            {transaction.dateTime}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.payment.amountPaid')}
                        </Text>
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={colors.journeys.care.primary}
                            testID="transaction-amount"
                        >
                            {formatCurrency(transaction.amountPaid)}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.payment.paymentMethod')}
                        </Text>
                        <Text fontSize="text-sm" journey="care" testID="transaction-method">
                            {transaction.paymentMethod} **** {transaction.lastFour}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.payment.status')}
                        </Text>
                        <Badge
                            variant="status"
                            status={getStatusBadge(transaction.status)}
                            testID="transaction-status-badge"
                            accessibilityLabel={t(`journeys.care.payment.status_${transaction.status}`)}
                        >
                            {t(`journeys.care.payment.status_${transaction.status}`)}
                        </Badge>
                    </View>
                </Card>

                {/* Service Details */}
                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care" testID="service-title">
                        {t('journeys.care.payment.serviceDetails')}
                    </Text>

                    <View style={styles.detailRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.payment.doctorName')}
                        </Text>
                        <Text fontSize="text-sm" fontWeight="semiBold" journey="care" testID="service-doctor">
                            {service.doctorName}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.payment.appointmentDate')}
                        </Text>
                        <Text fontSize="text-sm" journey="care" testID="service-date">
                            {service.appointmentDate}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.payment.serviceType')}
                        </Text>
                        <Badge journey="care" testID="service-type-badge">
                            {service.serviceType}
                        </Badge>
                    </View>
                </Card>

                {/* Actions */}
                <View style={styles.actionsSection}>
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.payment.actions')}
                    </Text>

                    <Button
                        onPress={handleDownloadPDF}
                        journey="care"
                        variant="secondary"
                        testID="download-pdf-button"
                        accessibilityLabel={t('journeys.care.payment.downloadPdf')}
                    >
                        {t('journeys.care.payment.downloadPdf')}
                    </Button>

                    <Button
                        onPress={handleEmailReceipt}
                        journey="care"
                        variant="secondary"
                        testID="email-receipt-button"
                        accessibilityLabel={t('journeys.care.payment.emailReceipt')}
                    >
                        {t('journeys.care.payment.emailReceipt')}
                    </Button>

                    <Button
                        onPress={handlePrintReceipt}
                        journey="care"
                        variant="secondary"
                        testID="print-receipt-button"
                        accessibilityLabel={t('journeys.care.payment.printReceipt')}
                    >
                        {t('journeys.care.payment.printReceipt')}
                    </Button>
                </View>

                {/* Return to Dashboard */}
                <View style={styles.returnSection}>
                    <Button
                        onPress={handleReturnDashboard}
                        journey="care"
                        testID="return-dashboard-button"
                        accessibilityLabel={t('journeys.care.payment.returnDashboard')}
                    >
                        {t('journeys.care.payment.returnDashboard')}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
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
    successSection: {
        alignItems: 'center',
        marginBottom: spacingValues.xl,
        marginTop: spacingValues.md,
        gap: spacingValues.xs,
    },
    successCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.semantic.success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues['3xs'],
    },
    actionsSection: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    returnSection: {
        marginTop: spacingValues['2xl'],
        marginBottom: spacingValues.md,
    },
});

export { PaymentReceipt };
export default PaymentReceipt;
