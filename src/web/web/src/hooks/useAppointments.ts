import { useQuery } from '@apollo/client'; // v3.0+
import { Appointment } from 'shared/types/care.types';
import { useAuth } from '@/context/AuthContext';
import { GET_APPOINTMENTS } from 'shared/graphql/queries/care.queries';

/**
 * Hook to fetch and manage appointments within the Care Now journey.
 *
 * @returns An object containing loading state, error state, and the list of appointments.
 */
export const useAppointments = () => {
    const { session } = useAuth();

    // In a real implementation, the user ID would typically be extracted from
    // the JWT token in session.accessToken or from user context
    // For this implementation, we'll assume it's available via the session
    const userId = session?.userId;

    const { loading, error, data } = useQuery(GET_APPOINTMENTS, {
        variables: { userId },
        skip: !userId, // Skip the query if there's no user ID available
        fetchPolicy: 'cache-and-network', // Fetch from cache first, then update from network
    });

    return {
        loading,
        error,
        appointments: data?.getAppointments || [],
    };
};
