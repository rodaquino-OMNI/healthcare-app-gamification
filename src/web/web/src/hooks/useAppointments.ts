import { ApolloError, useQuery } from '@apollo/client'; // v3.0+
import { GET_APPOINTMENTS } from 'shared/graphql/queries/care.queries';
import { Appointment } from 'shared/types/care.types';

import { useAuth } from '@/hooks/useAuth';

/** Shape returned by the useAppointments hook */
interface UseAppointmentsReturn {
    loading: boolean;
    error: ApolloError | undefined;
    appointments: Appointment[];
}

/** Typed query data shape */
interface AppointmentsData {
    getAppointments: Appointment[];
}

/**
 * Hook to fetch and manage appointments within the Care Now journey.
 *
 * @returns An object containing loading state, error state, and the list of appointments.
 */
export const useAppointments = (): UseAppointmentsReturn => {
    const { session } = useAuth();

    // In a real implementation, the user ID would typically be extracted from
    // the JWT token in session.accessToken or from user context
    // For this implementation, we'll assume it's available via the session
    const userId = session?.userId;

    const { loading, error, data } = useQuery<AppointmentsData>(GET_APPOINTMENTS, {
        variables: { userId },
        skip: !userId,
        fetchPolicy: 'cache-and-network',
    });

    return {
        loading,
        error,
        appointments: data?.getAppointments || [],
    };
};
