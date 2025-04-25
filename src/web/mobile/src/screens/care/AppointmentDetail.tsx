import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; // v6.0+
import { Appointment } from 'src/web/shared/types/care.types';
import { useAppointments } from 'src/web/mobile/src/hooks/useAppointments';
import { ROUTES } from 'src/web/mobile/src/constants/routes';
import { Button, ButtonProps } from 'src/web/design-system/src/components/Button/Button';
import { Card, CardProps } from 'src/web/design-system/src/components/Card/Card';
import { formatDate } from 'src/web/mobile/src/utils/format';
import { JourneyHeader } from 'src/web/mobile/src/components/shared/JourneyHeader';
import { useJourney } from 'src/web/mobile/src/context/JourneyContext';

/**
 * Interface for the route parameters expected by this screen.
 */
interface AppointmentDetailRouteParams {
  id: string;
}

/**
 * Displays the details of a specific appointment.
 * Allows users to view appointment information and potentially take actions like canceling or rescheduling.
 */
export const AppointmentDetail: React.FC = () => {
  // 1. Retrieve the appointment ID from the route parameters using `useRoute`.
  const route = useRoute<any>();
  const { id } = route.params as AppointmentDetailRouteParams;

  // 2. Uses the `useAppointments` hook to fetch appointment data and management functions.
  const { appointments, loading, error, refetch, cancel } = useAppointments();

  // 3. Find the specific appointment based on the ID.
  const appointment: Appointment | undefined = appointments.find(appt => appt.id === id);

  // Access the navigation object
  const navigation = useNavigation();

  // Access the current journey
  const { journey } = useJourney();

  // 4. If the appointment is not found, displays a loading indicator or an error message.
  if (loading) {
    return <View><Text>Loading appointment details...</Text></View>;
  }

  if (error) {
    return <View><Text>Error loading appointment details: {error.message}</Text></View>;
  }

  if (!appointment) {
    return <View><Text>Appointment not found.</Text></View>;
  }

  // 5. Formats the appointment date and time for display using `formatDate`.
  const formattedDateTime = formatDate(appointment.dateTime, 'long');

  // 6. Renders the appointment details, including provider information, date, time, and reason.
  return (
    <View style={styles.container}>
      <JourneyHeader title="Appointment Details" showBackButton />
      <Card style={styles.card}>
        <Text style={styles.heading}>Appointment with</Text>
        <Text style={styles.provider}>{appointment.providerId}</Text>
        <Text style={styles.dateTime}>Date and Time: {formattedDateTime}</Text>
        <Text style={styles.reason}>Reason: {appointment.reason}</Text>

        {/* 7. Provides a button to cancel the appointment, if applicable. */}
        <Button
          variant="secondary"
          onPress={() => {
            cancel(appointment.id);
            navigation.goBack();
          }}
          accessibilityLabel="Cancel Appointment"
          journey={journey}
        >
          Cancel Appointment
        </Button>
      </Card>
    </View>
  );
};

// Styles for the AppointmentDetail component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Light blue background
    padding: 10,
  },
  card: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#FFFFFF', // White card background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3A86FF', // Blue heading color
  },
  provider: {
    fontSize: 18,
    marginBottom: 5,
    color: '#2D6FD9', // Darker blue provider name color
  },
  dateTime: {
    fontSize: 16,
    marginBottom: 5,
    color: '#0057E7', // Even darker blue date/time color
  },
  reason: {
    fontSize: 16,
    marginBottom: 15,
    color: '#0066CC', // Slightly lighter blue reason color
  },
});