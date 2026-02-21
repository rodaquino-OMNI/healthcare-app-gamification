import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Checkbox } from 'src/web/design-system/src/components/Checkbox/Checkbox';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { JourneyHeader } from 'src/web/mobile/src/components/shared/JourneyHeader';
import { ROUTES } from 'src/web/mobile/src/constants/routes';

/**
 * Route params expected by BookingConfirmation.
 */
interface BookingConfirmationRouteParams {
  appointmentId: string;
  doctorId: string;
  date: string;
  time: string;
  type: string;
}

/** Mock doctor data keyed by ID. */
const MOCK_DOCTORS: Record<string, { name: string; specialty: string; location: string }> = {
  'doc-001': { name: 'Dra. Maria Silva', specialty: 'Clinica Geral', location: 'Clinica Saude Total - Av. Paulista, 1000' },
  'doc-002': { name: 'Dr. Pedro Santos', specialty: 'Cardiologia', location: 'Hospital do Coracao - R. Desembargador, 200' },
  'doc-003': { name: 'Dra. Ana Oliveira', specialty: 'Dermatologia', location: 'Centro Medico - Av. Brasil, 500' },
};

/**
 * Formats a date string (YYYY-MM-DD) into a human-readable Brazilian format.
 */
const formatDateBR = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  const months = [
    'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  return `${parseInt(day, 10)} de ${months[parseInt(month, 10) - 1]} de ${year}`;
};

/**
 * BookingConfirmation screen shows a success message after
 * the appointment has been booked, along with a summary and
 * actions like adding to calendar or entering the waiting room.
 */
const BookingConfirmation: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { appointmentId, doctorId, date, time, type } =
    route.params as BookingConfirmationRouteParams;

  const doctor = MOCK_DOCTORS[doctorId] || {
    name: 'Medico',
    specialty: 'Especialidade',
    location: 'Consultorio',
  };

  const [reminderEnabled, setReminderEnabled] = useState(true);
  const isTeleconsulta = type === 'teleconsulta';

  const handleGoHome = useCallback(() => {
    navigation.navigate(ROUTES.CARE_DASHBOARD);
  }, [navigation]);

  const handleWaitingRoom = useCallback(() => {
    navigation.navigate(ROUTES.CARE_WAITING_ROOM, { appointmentId });
  }, [navigation, appointmentId]);

  const handleAddToCalendar = useCallback(() => {
    // Mock: in production this would open the native calendar
  }, []);

  return (
    <View style={styles.container}>
      <JourneyHeader title="Confirmacao" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Success icon and heading */}
        <View style={styles.successSection}>
          <View style={styles.successCircle}>
            <Text fontSize="xl" fontWeight="bold" color="#FFFFFF" textAlign="center">
              {'✓'}
            </Text>
          </View>
          <Text variant="heading" journey="care" textAlign="center">
            Consulta Agendada com Sucesso!
          </Text>
        </View>

        {/* Appointment summary card */}
        <Card journey="care" elevation="md">
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
          <View style={styles.summaryRow}>
            <Text fontSize="sm" color="#666">Tipo:</Text>
            <Badge
              journey="care"
              size="sm"
              status={isTeleconsulta ? 'info' : 'neutral'}
            >
              {isTeleconsulta ? 'Teleconsulta' : 'Presencial'}
            </Badge>
          </View>
          <View style={styles.summaryRow}>
            <Text fontSize="sm" color="#666">Local:</Text>
            <Text fontSize="sm" color="#333">
              {isTeleconsulta ? 'Online' : doctor.location}
            </Text>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            journey="care"
            variant="secondary"
            onPress={handleAddToCalendar}
            accessibilityLabel="Adicionar consulta ao calendario"
          >
            Adicionar ao Calendario
          </Button>

          <View style={styles.reminderRow}>
            <Checkbox
              id="reminder-checkbox"
              name="reminder"
              value="30min"
              checked={reminderEnabled}
              onChange={() => setReminderEnabled(!reminderEnabled)}
              label="Lembrete 30 min antes"
              journey="care"
            />
          </View>

          {isTeleconsulta && (
            <View style={styles.waitingRoomButton}>
              <Button
                journey="care"
                variant="primary"
                onPress={handleWaitingRoom}
                accessibilityLabel="Ir para sala de espera da teleconsulta"
              >
                Sala de Espera
              </Button>
            </View>
          )}
        </View>

        {/* Bottom: go home */}
        <View style={styles.bottomAction}>
          <Button
            journey="care"
            variant="tertiary"
            onPress={handleGoHome}
            accessibilityLabel="Voltar ao inicio"
          >
            Voltar ao Inicio
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
  successSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  actionsSection: {
    marginTop: 24,
  },
  reminderRow: {
    marginTop: 16,
  },
  waitingRoomButton: {
    marginTop: 16,
  },
  bottomAction: {
    marginTop: 32,
    alignItems: 'center',
  },
});

export default BookingConfirmation;
