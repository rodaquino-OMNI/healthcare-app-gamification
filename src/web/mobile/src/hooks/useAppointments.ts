import { useQuery, useMutation, ApolloError, gql } from '@apollo/client'; // v3.7.17
import { useAuth } from './useAuth';
import { Appointment } from 'src/web/shared/types/care.types';

/**
 * GraphQL query for fetching user appointments
 */
const GET_APPOINTMENTS = gql`
  query GetAppointments {
    appointments {
      id
      providerId
      userId
      dateTime
      type
      status
      reason
      notes
    }
  }
`;

/**
 * GraphQL mutation for cancelling an appointment
 */
const CANCEL_APPOINTMENT = gql`
  mutation CancelAppointment($id: ID!) {
    cancelAppointment(id: $id) {
      id
      status
    }
  }
`;

/**
 * Provides hooks for fetching and managing appointments.
 * This hook supports the Care Now Journey (F-102) by enabling users
 * to view and manage their healthcare appointments.
 * 
 * @returns An object containing the list of appointments, loading state, error, refetch function, and cancel function.
 */
export function useAppointments() {
  // Get auth session for API authorization
  const { session } = useAuth();
  
  // Fetch appointments using GraphQL query
  const { data, loading, error, refetch } = useQuery<{ appointments: Appointment[] }>(
    GET_APPOINTMENTS,
    {
      // Skip query if user is not authenticated
      skip: !session,
      // Fetch fresh data on component mount
      fetchPolicy: 'cache-and-network',
      // Context for request headers
      context: {
        headers: {
          Authorization: session ? `Bearer ${session.accessToken}` : ''
        }
      }
    }
  );
  
  // Set up mutation for cancelling appointments
  const [cancelMutation] = useMutation(
    CANCEL_APPOINTMENT,
    {
      // Add auth headers to the request
      context: {
        headers: {
          Authorization: session ? `Bearer ${session.accessToken}` : ''
        }
      },
      // Update cache after successful cancellation to avoid refetching
      update(cache, { data: { cancelAppointment } }) {
        // Read current appointments from cache
        const cachedData = cache.readQuery<{ appointments: Appointment[] }>({
          query: GET_APPOINTMENTS
        });
        
        if (cachedData) {
          // Update the cancelled appointment in the cache
          cache.writeQuery({
            query: GET_APPOINTMENTS,
            data: {
              appointments: cachedData.appointments.map(appointment => 
                appointment.id === cancelAppointment.id 
                  ? { ...appointment, status: cancelAppointment.status } 
                  : appointment
              )
            }
          });
        }
      }
    }
  );
  
  /**
   * Cancel an appointment by ID
   * 
   * @param id - ID of the appointment to cancel
   * @returns Promise that resolves when the cancellation is complete
   */
  const cancel = async (id: string): Promise<void> => {
    if (!session) {
      throw new Error('Authentication required');
    }
    
    try {
      await cancelMutation({ variables: { id } });
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      throw err;
    }
  };
  
  return {
    appointments: data?.appointments || [],
    loading,
    error,
    refetch,
    cancel
  };
}