import { Badge } from '@design-system/components/Badge/Badge';
import { Button } from '@design-system/components/Button/Button';
import { Card } from '@design-system/components/Card/Card';
import { Checkbox } from '@design-system/components/Checkbox/Checkbox';
import { Input } from '@design-system/components/Input';
import { Select } from '@design-system/components/Select/Select';
import { Text } from '@design-system/primitives/Text/Text';
import { colors } from '@design-system/tokens/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';

import { JourneyHeader } from '@components/shared/JourneyHeader';
import { ROUTES } from '@constants/routes';

/**
 * Route params expected by BookingSchedule.
 */
interface BookingScheduleRouteParams {
    doctorId: string;
    date: string;
    time: string;
}

/** Mock doctor data keyed by ID. */
const MOCK_DOCTORS: Record<string, { name: string; specialty: string }> = {
    'doc-001': { name: 'Dra. Maria Silva', specialty: 'Clinica Geral' },
    'doc-002': { name: 'Dr. Pedro Santos', specialty: 'Cardiologia' },
    'doc-003': { name: 'Dra. Ana Oliveira', specialty: 'Dermatologia' },
};

const APPOINTMENT_TYPE_OPTIONS = [
    { label: 'Presencial', value: 'presencial' },
    { label: 'Teleconsulta', value: 'teleconsulta' },
];

const INSURANCE_OPTIONS = [
    { label: 'Particular', value: 'particular' },
    { label: 'SulAmerica', value: 'sulamerica' },
    { label: 'Unimed', value: 'unimed' },
    { label: 'Bradesco Saude', value: 'bradesco' },
    { label: 'Amil', value: 'amil' },
];

/**
 * Formats a date string (YYYY-MM-DD) into a human-readable Brazilian format.
 */
const formatDateBR = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
};

/**
 * BookingSchedule screen presents a form where the user confirms
 * appointment details before finalizing the booking.
 */
const BookingSchedule: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { doctorId, date, time } = route.params as BookingScheduleRouteParams;
    const { t } = useTranslation();

    const doctor = MOCK_DOCTORS[doctorId] || { name: 'Medico', specialty: 'Especialidade' };

    const [patientName, setPatientName] = useState('Rodrigo Silva');
    const [patientDob, setPatientDob] = useState('15/03/1990');
    const [reason, setReason] = useState('');
    const [appointmentType, setAppointmentType] = useState('presencial');
    const [insurance, setInsurance] = useState('particular');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleConfirm = useCallback(() => {
        navigation.navigate(ROUTES.CARE_BOOKING_CONFIRMATION, {
            appointmentId: `appt-${Date.now()}`,
            doctorId,
            date,
            time,
            type: appointmentType,
        });
    }, [navigation, doctorId, date, time, appointmentType]);

    return (
        <View style={styles.container}>
            <JourneyHeader title={t('journeys.care.appointments.book')} showBackButton />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Summary card */}
                <Card journey="care" elevation="sm">
                    <Text variant="heading" journey="care">
                        {t('journeys.care.appointments.summary')}
                    </Text>
                    <View style={styles.summaryRow}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.care.appointments.provider')}:
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={colors.gray[70]}>
                            {doctor.name}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.care.appointments.type')}:
                        </Text>
                        <Badge journey="care" size="sm">
                            {doctor.specialty}
                        </Badge>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.care.appointments.date')}:
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={colors.gray[70]}>
                            {formatDateBR(date)}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.care.appointments.time')}:
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={colors.gray[70]}>
                            {time}
                        </Text>
                    </View>
                </Card>

                {/* Patient section */}
                <View style={styles.section}>
                    <Text variant="heading" journey="care" fontSize="md">
                        {t('journeys.care.appointments.patient')}
                    </Text>
                    <Input
                        label={t('journeys.care.appointments.patientName')}
                        value={patientName}
                        onChange={(e: any) => setPatientName(e.target?.value ?? e)}
                        journey="care"
                        aria-label="Nome do paciente"
                    />
                    <View style={styles.fieldGap} />
                    <Input
                        label={t('journeys.care.appointments.dateOfBirth')}
                        value={patientDob}
                        onChange={(e: any) => setPatientDob(e.target?.value ?? e)}
                        journey="care"
                        placeholder="DD/MM/AAAA"
                        aria-label="Data de nascimento do paciente"
                    />
                </View>

                {/* Reason section */}
                <View style={styles.section}>
                    <Text variant="heading" journey="care" fontSize="md">
                        {t('journeys.care.appointments.reason')}
                    </Text>
                    <Input
                        label={t('journeys.care.appointments.describeReason')}
                        value={reason}
                        onChange={(e: any) => setReason(e.target?.value ?? e)}
                        journey="care"
                        placeholder="Ex: Dor de cabeca persistente, febre..."
                        aria-label="Motivo da consulta"
                    />
                </View>

                {/* Appointment type */}
                <View style={styles.section}>
                    <Text variant="heading" journey="care" fontSize="md">
                        {t('journeys.care.appointments.appointmentType')}
                    </Text>
                    <Select
                        label={t('journeys.care.appointments.selectType')}
                        options={APPOINTMENT_TYPE_OPTIONS}
                        value={appointmentType}
                        onChange={(val) => setAppointmentType(val as string)}
                        journey="care"
                    />
                </View>

                {/* Insurance */}
                <View style={styles.section}>
                    <Text variant="heading" journey="care" fontSize="md">
                        {t('journeys.care.appointments.insurance')}
                    </Text>
                    <Select
                        label={t('journeys.care.appointments.selectInsurance')}
                        options={INSURANCE_OPTIONS}
                        value={insurance}
                        onChange={(val) => setInsurance(val as string)}
                        journey="care"
                    />
                </View>

                {/* Terms checkbox */}
                <View style={styles.section}>
                    <Checkbox
                        id="terms-checkbox"
                        name="terms"
                        value="accepted"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                        label={t('journeys.care.appointments.acceptTerms')}
                        journey="care"
                    />
                </View>

                {/* Confirm button */}
                <View style={styles.bottomAction}>
                    <Button
                        journey="care"
                        variant="primary"
                        onPress={handleConfirm}
                        disabled={!termsAccepted}
                        accessibilityLabel="Confirmar agendamento da consulta"
                    >
                        {t('journeys.care.appointments.confirm')}
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
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    section: {
        marginTop: 24,
    },
    fieldGap: {
        height: 12,
    },
    bottomAction: {
        marginTop: 32,
        paddingHorizontal: 8,
    },
});

export default BookingSchedule;
