import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Appointment } from 'src/web/shared/types/care.types';
import { useAppointments } from 'src/web/mobile/src/hooks/useAppointments';
import { ROUTES } from 'src/web/mobile/src/constants/routes';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { formatDate } from 'src/web/mobile/src/utils/format';
import { JourneyHeader } from 'src/web/mobile/src/components/shared/JourneyHeader';
import { LoadingIndicator } from 'src/web/mobile/src/components/shared/LoadingIndicator';

/**
 * Route parameters expected by the AppointmentDetail screen.
 */
interface AppointmentDetailRouteParams {
  id: string;
}

/**
 * Maps appointment status values to Badge status prop values.
 */
const STATUS_MAP: Record<string, { label: string; status: 'success' | 'warning' | 'error' }> = {
  confirmed: { label: 'Confirmada', status: 'success' },
  pending: { label: 'Pendente', status: 'warning' },
  cancelled: { label: 'Cancelada', status: 'error' },
};

/**
 * Displays the details of a specific appointment with actions
 * to reschedule or cancel. Uses care journey theming (#FFF8F0 / #FF8C42).
 */
const AppointmentDetail: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params as AppointmentDetailRouteParams;

  const { appointments, loading, error, cancel } = useAppointments();
  const appointment: Appointment | undefined = appointments.find((appt) => appt.id === id);

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
  if (loading) {
    return (
      <View style={styles.container}>
        <JourneyHeader title="Detalhes da Consulta" showBackButton />
        <View style={styles.centerContent}>
          <LoadingIndicator journey="care" label="Carregando detalhes..." />
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <JourneyHeader title="Detalhes da Consulta" showBackButton />
        <View style={styles.centerContent}>
          <Text fontSize="md" color="#D32F2F" textAlign="center">
            Erro ao carregar detalhes: {error.message}
          </Text>
        </View>
      </View>
    );
  }

  // Not found state
  if (!appointment) {
    return (
      <View style={styles.container}>
        <JourneyHeader title="Detalhes da Consulta" showBackButton />
        <View style={styles.centerContent}>
          <Text fontSize="md" color="#666" textAlign="center">
            Consulta nao encontrada.
          </Text>
        </View>
      </View>
    );
  }

  const formattedDateTime = formatDate(appointment.dateTime, 'long');
  const appointmentStatus = (appointment as any).status || 'confirmed';
  const statusInfo = STATUS_MAP[appointmentStatus] || STATUS_MAP.confirmed;

  return (
    <View style={styles.container}>
      <JourneyHeader title="Detalhes da Consulta" showBackButton />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Status badge */}
        <View style={styles.statusRow}>
          <Text fontSize="sm" color="#666">Status:</Text>
          <Badge journey="care" size="sm" status={statusInfo.status}>
            {statusInfo.label}
          </Badge>
        </View>

        {/* Appointment details card */}
        <Card journey="care" elevation="md">
          <Text variant="heading" journey="care">
            Consulta
          </Text>

          <View style={styles.detailRow}>
            <Text fontSize="sm" color="#666">Medico(a):</Text>
            <Text fontSize="sm" fontWeight="bold" color="#333">
              {appointment.providerId}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text fontSize="sm" color="#666">Data e Horario:</Text>
            <Text fontSize="sm" fontWeight="bold" color="#333">
              {formattedDateTime}
            </Text>
          </View>

          {appointment.reason && (
            <View style={styles.detailRow}>
              <Text fontSize="sm" color="#666">Motivo:</Text>
              <Text fontSize="sm" color="#333">
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
            Reagendar Consulta
          </Button>

          <View style={styles.actionGap} />

          <Button
            journey="care"
            variant="tertiary"
            onPress={handleCancel}
            accessibilityLabel="Cancelar esta consulta"
          >
            Cancelar Consulta
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
