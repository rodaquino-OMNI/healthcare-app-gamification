import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { ROUTES } from '@constants/routes';

import type { CareStackParamList } from '../../navigation/types';

const MOCK_DOCTORS: Record<string, { name: string; specialty: string; location: string }> = {
    'doc-001': {
        name: 'Dra. Ana Carolina Silva',
        specialty: 'Cardiologia',
        location: 'Clinica Saude Total - Av. Paulista, 1000',
    },
    'doc-002': {
        name: 'Dr. Pedro Santos',
        specialty: 'Clinica Geral',
        location: 'Hospital do Coracao - R. Desembargador, 200',
    },
    'doc-003': { name: 'Dra. Maria Oliveira', specialty: 'Dermatologia', location: 'Centro Medico - Av. Brasil, 500' },
};

const TYPE_LABELS: Record<string, string> = {
    'in-person': 'Presencial',
    telemedicine: 'Teleconsulta',
    'home-visit': 'Visita Domiciliar',
};

const formatDateBR = (dateStr: string): string => {
    if (!dateStr || !dateStr.includes('-')) {
        return dateStr;
    }
    const [year, month, day] = dateStr.split('-');
    const months = [
        'janeiro',
        'fevereiro',
        'marco',
        'abril',
        'maio',
        'junho',
        'julho',
        'agosto',
        'setembro',
        'outubro',
        'novembro',
        'dezembro',
    ];
    return `${parseInt(day, 10)} de ${months[parseInt(month, 10) - 1]} de ${year}`;
};

/**
 * BookingSuccess screen displays a confirmation after a successful appointment booking.
 * Shows appointment details summary, and provides actions to add to calendar or view appointment.
 */
export const BookingSuccess: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareBookingSuccess'>>();
    const { t } = useTranslation();
    const {
        appointmentId = 'appt-001',
        doctorId = 'doc-001',
        date = '2026-03-01',
        time = '14:00',
        appointmentType = 'in-person',
    } = route.params ?? {};

    const doctor = MOCK_DOCTORS[doctorId] || {
        name: 'Medico(a)',
        specialty: 'Especialidade',
        location: 'Consultorio',
    };

    const typeLabel = TYPE_LABELS[appointmentType] || appointmentType;
    const isTelemedicine = appointmentType === 'telemedicine';

    const handleAddToCalendar = useCallback(() => {
        // Mock: would open native calendar
    }, []);

    const handleViewAppointment = useCallback(() => {
        navigation.navigate(ROUTES.CARE_APPOINTMENTS, { appointmentId });
    }, [navigation, appointmentId]);

    const handleBackToHome = useCallback(() => {
        navigation.navigate(ROUTES.CARE_DASHBOARD);
    }, [navigation]);

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Success Icon and Heading */}
                <View style={styles.successSection}>
                    <View style={styles.successCircleOuter}>
                        <View style={styles.successCircle}>
                            <Text fontSize="xl" fontWeight="bold" color={colors.neutral.white} textAlign="center">
                                {'\u2713'}
                            </Text>
                        </View>
                    </View>
                    <Text
                        fontWeight="bold"
                        fontSize="xl"
                        color={colors.journeys.care.text}
                        textAlign="center"
                        testID="success-title"
                    >
                        {t('consultation.bookingSuccess.title')}
                    </Text>
                    <Text fontSize="md" color={colors.neutral.gray600} textAlign="center" testID="success-subtitle">
                        {t('consultation.bookingSuccess.subtitle')}
                    </Text>
                </View>

                {/* Decorative stars for celebration feel */}
                <View style={styles.celebrationRow}>
                    <Text style={styles.celebrationStar}>{'\u2728'}</Text>
                    <Text style={styles.celebrationStar}>{'\u{1F389}'}</Text>
                    <Text style={styles.celebrationStar}>{'\u2728'}</Text>
                </View>

                {/* Summary Card */}
                <Card journey="care" elevation="md">
                    <View style={styles.summaryRow}>
                        <Text fontSize="sm" color={colors.neutral.gray600}>
                            {t('consultation.bookingSuccess.doctor')}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={colors.journeys.care.text}>
                            {doctor.name}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text fontSize="sm" color={colors.neutral.gray600}>
                            {t('consultation.bookingSuccess.specialty')}
                        </Text>
                        <Badge journey="care" size="sm">
                            {doctor.specialty}
                        </Badge>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text fontSize="sm" color={colors.neutral.gray600}>
                            {t('consultation.bookingSuccess.date')}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={colors.journeys.care.text}>
                            {formatDateBR(date)}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text fontSize="sm" color={colors.neutral.gray600}>
                            {t('consultation.bookingSuccess.time')}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={colors.journeys.care.text}>
                            {time}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text fontSize="sm" color={colors.neutral.gray600}>
                            {t('consultation.bookingSuccess.type')}
                        </Text>
                        <Badge journey="care" size="sm" status={isTelemedicine ? 'info' : 'neutral'}>
                            {typeLabel}
                        </Badge>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text fontSize="sm" color={colors.neutral.gray600}>
                            {t('consultation.bookingSuccess.location')}
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text} style={styles.locationText}>
                            {isTelemedicine ? 'Online' : doctor.location}
                        </Text>
                    </View>
                </Card>

                {/* Action Buttons */}
                <View style={styles.actionsSection}>
                    <Button
                        variant="secondary"
                        journey="care"
                        size="lg"
                        onPress={handleAddToCalendar}
                        accessibilityLabel={t('consultation.bookingSuccess.addToCalendar')}
                        testID="add-to-calendar-button"
                    >
                        {t('consultation.bookingSuccess.addToCalendar')}
                    </Button>

                    <Button
                        variant="primary"
                        journey="care"
                        size="lg"
                        onPress={handleViewAppointment}
                        accessibilityLabel={t('consultation.bookingSuccess.viewAppointment')}
                        testID="view-appointment-button"
                    >
                        {t('consultation.bookingSuccess.viewAppointment')}
                    </Button>

                    <TouchableOpacity
                        onPress={handleBackToHome}
                        accessibilityLabel={t('consultation.bookingSuccess.backToHome')}
                        accessibilityRole="button"
                        testID="back-to-home-button"
                        style={styles.tertiaryButton}
                    >
                        <Text fontSize="md" color={colors.journeys.care.primary} textAlign="center">
                            {t('consultation.bookingSuccess.backToHome')}
                        </Text>
                    </TouchableOpacity>
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
        marginTop: spacingValues['3xl'],
        marginBottom: spacingValues.lg,
        gap: spacingValues.xs,
    },
    successCircleOuter: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: colors.semantic.successBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacingValues.sm,
    },
    successCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.semantic.success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    celebrationRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacingValues.xl,
        marginBottom: spacingValues.xl,
    },
    celebrationStar: {
        fontSize: 28,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.gray200,
    },
    locationText: {
        flex: 1,
        textAlign: 'right',
        maxWidth: '55%',
    },
    actionsSection: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    tertiaryButton: {
        paddingVertical: spacingValues.sm,
        marginTop: spacingValues.xs,
    },
});

export default BookingSuccess;
