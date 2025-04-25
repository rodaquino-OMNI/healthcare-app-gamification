import React from 'react';
import styled from 'styled-components';
import { useAppointments } from 'src/web/web/src/hooks/useAppointments';
import { Appointment } from 'src/web/shared/types/care.types';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { formatRelativeDate } from 'src/web/shared/utils/date';
import { MOBILE_CARE_ROUTES } from 'src/web/shared/constants/routes';
import { useJourney } from 'src/web/web/src/context/JourneyContext';

// Styled components for the widget
const WidgetTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.colors.neutral.gray900};
`;

const AppointmentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
`;

const AppointmentItem = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.colors.neutral.gray200};
  
  &:last-child {
    border-bottom: none;
  }
`;

const AppointmentDate = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.neutral.gray900};
  margin-bottom: 4px;
`;

const AppointmentDetails = styled.div`
  color: ${props => props.theme.colors.neutral.gray700};
  font-size: 14px;
`;

const NoAppointmentsMessage = styled.p`
  color: ${props => props.theme.colors.neutral.gray600};
  text-align: center;
  margin: 24px 0;
`;

const LoadingMessage = styled.p`
  color: ${props => props.theme.colors.neutral.gray600};
  text-align: center;
  margin: 24px 0;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.semantic.error};
  text-align: center;
  margin: 24px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

/**
 * Displays a list of upcoming appointments in a widget format for the Care Now journey dashboard.
 * This component fetches appointment data and displays up to three upcoming appointments,
 * with a button to navigate to the full appointments page.
 */
export const AppointmentsWidget: React.FC = () => {
  const { currentJourney } = useJourney();
  const { appointments, loading, error } = useAppointments();
  
  // Get upcoming appointments, sorted by date (nearest first)
  const upcomingAppointments = React.useMemo(() => {
    if (!appointments?.length) return [];
    
    return [...appointments]
      .filter(appointment => new Date(appointment.dateTime) >= new Date())
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      .slice(0, 3); // Show at most 3 appointments
  }, [appointments]);
  
  // Format appointment time (HH:MM)
  const formatAppointmentTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString(['pt-BR', 'en-US'], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false // Use 24-hour format for Brazilian convention
    });
  };
  
  // Handle navigation to appointments page
  // In a real implementation, this would use the appropriate navigation method
  // depending on platform (router.push for web, navigation.navigate for mobile)
  const handleViewAllAppointments = () => {
    // For web implementation, we would use Next.js router:
    // router.push('/care/appointments');
    
    // For demonstration purposes, just log the navigation intent
    console.log(`Navigate to: ${MOBILE_CARE_ROUTES.APPOINTMENTS}`);
  };
  
  return (
    <Card journey="care" elevation="sm">
      <WidgetTitle>Upcoming Appointments</WidgetTitle>
      
      {loading && (
        <LoadingMessage>Loading appointments...</LoadingMessage>
      )}
      
      {error && (
        <ErrorMessage>Failed to load appointments. Please try again later.</ErrorMessage>
      )}
      
      {!loading && !error && upcomingAppointments.length === 0 && (
        <NoAppointmentsMessage>You have no upcoming appointments.</NoAppointmentsMessage>
      )}
      
      {!loading && !error && upcomingAppointments.length > 0 && (
        <AppointmentList>
          {upcomingAppointments.map((appointment) => (
            <AppointmentItem key={appointment.id}>
              <AppointmentDate>
                {formatRelativeDate(appointment.dateTime)}, {formatAppointmentTime(appointment.dateTime)}
              </AppointmentDate>
              <AppointmentDetails>
                {appointment.type} appointment
                {appointment.reason && ` • ${appointment.reason}`}
              </AppointmentDetails>
            </AppointmentItem>
          ))}
        </AppointmentList>
      )}
      
      <ButtonContainer>
        <Button 
          journey="care"
          variant="secondary"
          icon="calendar"
          onPress={handleViewAllAppointments}
          accessibilityLabel="View all appointments"
        >
          View All Appointments
        </Button>
      </ButtonContainer>
    </Card>
  );
};