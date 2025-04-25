import React from 'react';
import { format } from 'date-fns';
import {
  AppointmentCardContainer,
  AppointmentCardHeader,
  AppointmentCardBody,
  AppointmentCardFooter,
  ProviderInfo,
  AppointmentDetails,
  AppointmentActions
} from './AppointmentCard.styles';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { Icon } from '../../primitives/Icon/Icon';
import { Text } from '../../primitives/Text/Text';

/**
 * Interface for appointment data
 */
interface Appointment {
  id: string;
  dateTime: string;
  type: 'telemedicine' | 'in_person';
  status: 'upcoming' | 'completed' | 'cancelled';
  reason?: string;
  notes?: string;
}

/**
 * Interface for provider data
 */
interface Provider {
  id: string;
  name: string;
  specialty: string;
  imageUrl?: string;
  rating?: number;
}

/**
 * Props for the AppointmentCard component
 */
export interface AppointmentCardProps {
  /**
   * The appointment data to display.
   */
  appointment: Appointment;
  /**
   * The provider data associated with the appointment.
   */
  provider: Provider;
  /**
   * Callback function when the user wants to view appointment details.
   */
  onViewDetails?: () => void;
  /**
   * Callback function when the user wants to reschedule the appointment.
   */
  onReschedule?: () => void;
  /**
   * Callback function when the user wants to cancel the appointment.
   */
  onCancel?: () => void;
  /**
   * Callback function when the user wants to join a telemedicine session.
   */
  onJoinTelemedicine?: () => void;
  /**
   * Whether to show action buttons.
   * @default true
   */
  showActions?: boolean;
  /**
   * Test ID for testing purposes.
   */
  testID?: string;
}

/**
 * Formats the appointment date and time in a user-friendly format.
 * @param dateTime The date and time string to format
 * @returns Formatted date and time string
 */
const formatAppointmentDate = (dateTime: string): string => {
  const date = new Date(dateTime);
  return format(date, 'PPP p'); // Format like "Apr 29, 2023, 3:00 PM"
};

/**
 * Returns the appropriate color for the appointment status.
 * @param status The appointment status
 * @returns Color code for the status
 */
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'upcoming':
      return 'journeys.care.primary';
    case 'completed':
      return 'semantic.success';
    case 'cancelled':
      return 'semantic.error';
    default:
      return 'journeys.care.primary';
  }
};

/**
 * Returns the appropriate icon name for the appointment type.
 * @param type The appointment type
 * @returns Icon name for the appointment type
 */
const getAppointmentTypeIcon = (type: string): string => {
  switch (type) {
    case 'telemedicine':
      return 'video';
    case 'in_person':
      return 'clinic';
    default:
      return 'calendar';
  }
};

/**
 * A component that displays appointment information in a card format.
 */
export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  provider,
  onViewDetails,
  onReschedule,
  onCancel,
  onJoinTelemedicine,
  showActions = true,
  testID,
}) => {
  const formattedDate = formatAppointmentDate(appointment.dateTime);
  const typeIcon = getAppointmentTypeIcon(appointment.type);
  const statusColor = getStatusColor(appointment.status);
  
  // Create an accessible description of the appointment
  const appointmentDescription = `Consulta ${appointment.type === 'telemedicine' ? 'por telemedicina' : 'presencial'} com ${provider.name}, ${provider.specialty}, ${formattedDate}, status: ${appointment.status === 'upcoming' ? 'agendada' : appointment.status === 'completed' ? 'concluída' : 'cancelada'}`;
  
  // Get status text
  const getStatusText = () => {
    switch (appointment.status) {
      case 'upcoming':
        return 'Agendada';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return '';
    }
  };
  
  return (
    <AppointmentCardContainer data-testid={testID} aria-label={appointmentDescription}>
      <AppointmentCardHeader>
        <ProviderInfo>
          {provider.imageUrl && (
            <img src={provider.imageUrl} alt="" aria-hidden="true" />
          )}
          <div>
            <Text fontWeight="medium" color="neutral.gray800">
              {provider.name}
            </Text>
            <Text fontSize="sm" color="neutral.gray600">
              {provider.specialty}
            </Text>
          </div>
        </ProviderInfo>
        <Icon 
          name={typeIcon} 
          size="24px" 
          color="journeys.care.primary" 
          aria-hidden="true"
        />
      </AppointmentCardHeader>
      
      <AppointmentCardBody>
        <AppointmentDetails>
          <div>
            <Icon name="calendar" size="16px" aria-hidden="true" />
            <Text fontSize="sm">{formattedDate}</Text>
          </div>
          
          <div>
            <Icon 
              name={appointment.type === 'telemedicine' ? 'video' : 'clinic'} 
              size="16px" 
              aria-hidden="true" 
            />
            <Text fontSize="sm">
              {appointment.type === 'telemedicine' ? 'Telemedicina' : 'Consulta presencial'}
            </Text>
          </div>
          
          <div>
            <Icon name="info" size="16px" color={statusColor} aria-hidden="true" />
            <Text fontSize="sm" color={statusColor} fontWeight="medium">
              {getStatusText()}
            </Text>
          </div>
        </AppointmentDetails>
      </AppointmentCardBody>
      
      {showActions && (
        <AppointmentCardFooter>
          <AppointmentActions>
            {onViewDetails && (
              <Button 
                variant="secondary" 
                size="sm" 
                onPress={onViewDetails}
                journey="care"
                accessibilityLabel="Ver detalhes da consulta"
              >
                Ver detalhes
              </Button>
            )}
            
            {appointment.status === 'upcoming' && (
              <>
                {appointment.type === 'telemedicine' && onJoinTelemedicine && (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onPress={onJoinTelemedicine}
                    journey="care"
                    icon="video"
                    accessibilityLabel="Iniciar teleconsulta"
                  >
                    Iniciar consulta
                  </Button>
                )}
                
                {onReschedule && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onPress={onReschedule}
                    journey="care"
                    accessibilityLabel="Reagendar consulta"
                  >
                    Reagendar
                  </Button>
                )}
                
                {onCancel && (
                  <Button 
                    variant="tertiary" 
                    size="sm" 
                    onPress={onCancel}
                    journey="care"
                    accessibilityLabel="Cancelar consulta"
                  >
                    Cancelar
                  </Button>
                )}
              </>
            )}
          </AppointmentActions>
        </AppointmentCardFooter>
      )}
    </AppointmentCardContainer>
  );
};

// Export other interfaces for external use
export type { Appointment, Provider };