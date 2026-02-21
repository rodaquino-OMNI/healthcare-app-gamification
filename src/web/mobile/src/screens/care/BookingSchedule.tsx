import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Input } from 'src/web/design-system/src/components/Input/Input';
import { Select } from 'src/web/design-system/src/components/Select/Select';
import { Checkbox } from 'src/web/design-system/src/components/Checkbox/Checkbox';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { JourneyHeader } from 'src/web/mobile/src/components/shared/JourneyHeader';
import { ROUTES } from 'src/web/mobile/src/constants/routes';

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
      <JourneyHeader title="Agendar Consulta" showBackButton />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Summary card */}
        <Card journey="care" elevation="sm">
          <Text variant="heading" journey="care">
            Resumo da Consulta
          </Text>
          <View style={styles.summaryRow}>
            <Text fontSize="sm" color="#666">Medico(a):</Text>
            <Text fontSize="sm" fontWeight="bold" color="#333">{doctor.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text fontSize="sm" color="#666">Especialidade:</Text>
            <Badge journey="care" size="sm">{doctor.specialty}</Badge>
          </View>
          <View style={styles.summaryRow}>
            <Text fontSize="sm" color="#666">Data:</Text>
            <Text fontSize="sm" fontWeight="bold" color="#333">{formatDateBR(date)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text fontSize="sm" color="#666">Horario:</Text>
            <Text fontSize="sm" fontWeight="bold" color="#333">{time}</Text>
          </View>
        </Card>

        {/* Patient section */}
        <View style={styles.section}>
          <Text variant="heading" journey="care" fontSize="md">
            Paciente
          </Text>
          <Input
            label="Nome do paciente"
            value={patientName}
            onChange={(e: any) => setPatientName(e.target?.value ?? e)}
            journey="care"
            aria-label="Nome do paciente"
          />
          <View style={styles.fieldGap} />
          <Input
            label="Data de nascimento"
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
            Motivo da Consulta
          </Text>
          <Input
            label="Descreva o motivo ou sintomas"
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
            Tipo de Consulta
          </Text>
          <Select
            label="Selecione o tipo"
            options={APPOINTMENT_TYPE_OPTIONS}
            value={appointmentType}
            onChange={(val) => setAppointmentType(val as string)}
            journey="care"
          />
        </View>

        {/* Insurance */}
        <View style={styles.section}>
          <Text variant="heading" journey="care" fontSize="md">
            Convenio
          </Text>
          <Select
            label="Selecione o convenio"
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
            label="Li e aceito os termos de atendimento"
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
            Confirmar Agendamento
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
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
