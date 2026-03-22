import { Badge } from '@design-system/components/Badge/Badge';
import { Button } from '@design-system/components/Button/Button';
import { Card } from '@design-system/components/Card/Card';
import { Text } from '@design-system/primitives/Text/Text';
import { colors } from '@design-system/tokens/colors';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Appointment } from '@shared/types/care.types';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';

import { JourneyHeader } from '@components/shared/JourneyHeader';
import { LoadingIndicator } from '@components/shared/LoadingIndicator';
import { ROUTES } from '@constants/routes';
import { useAppointments } from '@hooks/useAppointments';
import { formatDate } from '@utils/date';

import type { CareStackParamList } from '../../navigation/types';

/**
 * Appointment with optional status field (extended from the base type).
 */
interface AppointmentWithStatus extends Appointment {
    status?: string;
}

/**
 * Displays the details of a specific appointment with actions
 * to reschedule or cancel. Uses care journey theming (#FFF8F0 / #FF8C42).
 */
const AppointmentDetail: React.FC = () => {
    const route = useRoute<RouteProp<CareStackParamList, 'CareAppointments'>>();
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const { appointmentId: id } = route.params ?? {};
    const { t } = useTranslation();

    /**
     * Maps appointment status values to Badge status prop values.
     */
    const STATUS_MAP: Record<string, { label: string; status: 'success' | 'warning' | 'error' }> = {
        confirmed: { label: t('journeys.care.appointments.statusConfirmed'), status: 'success' },
        pending: { label: t('journeys.care.appointments.statusPending'), status: 'warning' },
        cancelled: { label: t('journeys.care.appointments.statusCancelled'), status: 'error' },
    };

    const { appointments, isLoading, error, cancel } = useAppointments();
    const appointment: AppointmentWithStatus | undefined = appointments.find((appt) => appt.id === id) as
        | AppointmentWithStatus
        | undefined;

    const handleCancel = useCallback(() => {
        if (appointment) {
            cancel(appointment.id);
            navigation.goBack();
        }
    }, [appointment, cancel, navigation]);

    const handleReschedule = useCallback(() => {
        if (appointment) {
            navigation.navigate(ROUTES.CARE_DOCTOR_AVAILABILITY, {
                doctorId: appointment.providerId,
            });
        }
    }, [appointment, navigation]);

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.container}>
                <JourneyHeader title={t('journeys.care.appointments.detail')} showBackButton />
                <View style={styles.centerContent}>
                    <LoadingIndicator journey="care" label={t('journeys.care.appointments.loadingDetails')} />
                </View>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={styles.container}>
                <JourneyHeader title={t('journeys.care.appointments.detail')} showBackButton />
                <View style={styles.centerContent}>
                    <Text fontSize="md" color={colors.semantic.error} textAlign="center">
                        {t('journeys.care.appointments.errorLoadingDetails', { message: error.message })}
                    </Text>
                </View>
            </View>
        );
    }

    // Not found state
    if (!appointment) {
        return (
            <View style={styles.container}>
                <JourneyHeader title={t('journeys.care.appointments.detail')} showBackButton />
                <View style={styles.centerContent}>
                    <Text fontSize="md" color={colors.gray[50]} textAlign="center">
                        {t('journeys.care.appointments.notFound')}
                    </Text>
                </View>
            </View>
        );
    }

    const formattedDateTime = formatDate(new Date(appointment.dateTime), 'PPPp');
    const appointmentStatus = appointment.status ?? 'confirmed';
    const statusInfo = STATUS_MAP[appointmentStatus] || STATUS_MAP.confirmed;

    return (
        <View style={styles.container}>
            <JourneyHeader title={t('journeys.care.appointments.detail')} showBackButton />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Status badge */}
                <View style={styles.statusRow}>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        {t('common.labels.status')}:
                    </Text>
                    <Badge journey="care" size="sm" status={statusInfo.status}>
                        {statusInfo.label}
                    </Badge>
                </View>

                {/* Appointment details card */}
                <Card journey="care" elevation="md">
                    <Text variant="heading" journey="care">
                        {t('journeys.care.appointments.consultation')}
                    </Text>

                    <View style={styles.detailRow}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.care.appointments.provider')}:
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={colors.gray[70]}>
                            {appointment.providerId}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.care.appointments.dateTime')}:
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={colors.gray[70]}>
                            {formattedDateTime}
                        </Text>
                    </View>

                    {appointment.reason && (
                        <View style={styles.detailRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.care.appointments.reason')}:
                            </Text>
                            <Text fontSize="sm" color={colors.gray[70]}>
                                {appointment.reason}
                            </Text>
                        </View>
                    )}
                </Card>

                {/* Action buttons */}
                <View style={styles.actionsSection}>
                    <Button
                        journey="care"
                        variant="secondary"
                        onPress={handleReschedule}
                        accessibilityLabel="Reagendar esta consulta"
                    >
                        {t('journeys.care.appointments.reschedule')}
                    </Button>

                    <View style={styles.actionGap} />

                    <Button
                        journey="care"
                        variant="tertiary"
                        onPress={handleCancel}
                        accessibilityLabel="Cancelar esta consulta"
                    >
                        {t('journeys.care.appointments.cancel')}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.care.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    actionsSection: {
        marginTop: 32,
        paddingHorizontal: 8,
    },
    actionGap: {
        height: 12,
    },
});

export default AppointmentDetail;
