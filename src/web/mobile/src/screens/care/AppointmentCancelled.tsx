import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { ROUTES } from '@constants/routes';

interface RouteParams {
    appointmentId: string;
    refundAmount?: string;
}

const MOCK_CANCELLED = {
    doctorName: 'Dra. Ana Carolina Silva',
    specialty: 'Cardiologia',
    date: '05 Mar 2026',
    time: '09:00',
    reason: 'Schedule conflict',
};

export const AppointmentCancelled: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { t } = useTranslation();
    const { refundAmount } = route.params as RouteParams;

    const handleBookNew = useCallback(() => {
        navigation.navigate(ROUTES.CARE_DOCTOR_SEARCH);
    }, [navigation]);

    const handleBackToAppointments = useCallback(() => {
        navigation.navigate(ROUTES.CARE_APPOINTMENTS_LIST);
    }, [navigation]);

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    testID="back-button"
                    accessibilityRole="button"
                    accessibilityLabel={t('common.back')}
                >
                    <Text fontSize="lg">{'<-'}</Text>
                </TouchableOpacity>
                <Text fontSize="lg" fontWeight="bold" color={colors.journeys.care.text}>
                    {t('consultation.cancelled.title')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                <View style={styles.iconContainer}>
                    <View style={styles.cancelledCircle}>
                        <Text fontSize="xl" fontWeight="bold" color={colors.neutral.white}>
                            X
                        </Text>
                    </View>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.care.text} textAlign="center">
                        {t('consultation.cancelled.title')}
                    </Text>
                </View>

                <Card journey="care" elevation="sm">
                    <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
                        {t('consultation.cancelled.details')}
                    </Text>
                    <View style={styles.infoRow}>
                        <Text fontSize="sm" color={colors.neutral.gray500}>
                            {t('consultation.appointmentsList.confirmed')}:
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={colors.journeys.care.text}>
                            {MOCK_CANCELLED.doctorName}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text fontSize="sm" color={colors.neutral.gray500}>
                            {t('consultation.reschedule.selectDate')}:
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text}>
                            {MOCK_CANCELLED.date} - {MOCK_CANCELLED.time}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text fontSize="sm" color={colors.neutral.gray500}>
                            {t('consultation.cancel.reason')}:
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text}>
                            {MOCK_CANCELLED.reason}
                        </Text>
                    </View>
                </Card>

                {refundAmount && (
                    <Card journey="care" elevation="sm">
                        <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
                            {t('consultation.cancelled.refundInfo')}
                        </Text>
                        <View style={styles.infoRow}>
                            <Text fontSize="sm" color={colors.neutral.gray500}>
                                {t('consultation.cancelled.refundAmount')}:
                            </Text>
                            <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.primary}>
                                {refundAmount}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text fontSize="sm" color={colors.neutral.gray500}>
                                {t('consultation.cancelled.processingTime')}:
                            </Text>
                            <Text fontSize="sm" color={colors.journeys.care.text}>
                                5-10 dias uteis
                            </Text>
                        </View>
                    </Card>
                )}

                <View style={styles.actions}>
                    <Button
                        journey="care"
                        variant="primary"
                        onPress={handleBookNew}
                        accessibilityLabel={t('consultation.cancelled.bookNew')}
                        testID="book-new-button"
                    >
                        {t('consultation.cancelled.bookNew')}
                    </Button>
                    <View style={styles.actionGap} />
                    <Button
                        journey="care"
                        variant="tertiary"
                        onPress={handleBackToAppointments}
                        accessibilityLabel={t('consultation.cancelled.backToAppointments')}
                        testID="back-to-appointments-button"
                    >
                        {t('consultation.cancelled.backToAppointments')}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.journeys.care.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues.lg,
        paddingBottom: spacingValues.sm,
    },
    scroll: { flex: 1 },
    scrollContent: { padding: spacingValues.md, paddingBottom: spacingValues['3xl'], gap: spacingValues.md },
    iconContainer: {
        alignItems: 'center',
        paddingVertical: spacingValues.lg,
        gap: spacingValues.sm,
    },
    cancelledCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.journeys.care.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacingValues.xs,
    },
    actions: { marginTop: spacingValues.md },
    actionGap: { height: spacingValues.sm },
});

export default AppointmentCancelled;
