import { format } from 'date-fns'; // date-fns v2.30+
import { Button, Card } from 'design-system/components';
import { Box, Text } from 'design-system/primitives';
import Head from 'next/head'; // next/head v13.0+
import React, { useState } from 'react';
import { CARE_ROUTES } from 'shared/constants/routes';
import { Appointment } from 'shared/types/care.types';

import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingIndicator } from '@/components/shared/LoadingIndicator';
import { useAppointments } from '@/hooks/useAppointments';
import { useJourney } from '@/hooks/useJourney';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter'; // next/router v13.0+
import { CareLayout } from '@/layouts/CareLayout';

/**
 * The main component for the appointments index page.
 * @returns The rendered appointments page.
 */
const AppointmentsPage: React.FC = () => {
    // LD1: Use the useAppointments hook to fetch the user's appointments
    const { appointments, loading, error } = useAppointments();
    const refetch = (): void => {
        window.location.reload();
    };

    // LD1: Use the useRouter hook to access the Next.js router
    const router = useRouter();

    // LD1: Define state for filtering and sorting appointments
    const [filter, _setFilter] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
    const [sort, _setSort] = useState<'date' | 'provider'>('date');

    // LD1: Handle loading state with LoadingIndicator component
    if (loading) {
        return (
            <CareLayout>
                <LoadingIndicator text="Carregando suas consultas..." />
            </CareLayout>
        );
    }

    // LD1: Handle error state with ErrorState component
    if (error) {
        return (
            <CareLayout>
                <ErrorState message="Falha ao carregar suas consultas." onRetry={refetch} />
            </CareLayout>
        );
    }

    // LD1: Handle empty state with EmptyState component
    if (!appointments || appointments.length === 0) {
        return (
            <CareLayout>
                <EmptyState
                    title="Nenhuma consulta agendada"
                    description="Agende sua primeira consulta agora mesmo."
                    journey="care"
                    actionLabel="Agendar consulta"
                    onAction={() => void router.push(CARE_ROUTES.WEB_CARE_APPOINTMENT_BOOK)}
                />
            </CareLayout>
        );
    }

    // LD1: Implement filtering and sorting functionality for appointments
    const filteredAppointments = appointments.filter((appointment: Appointment) => {
        if (filter === 'upcoming') {
            return new Date(appointment.dateTime) >= new Date();
        } else if (filter === 'past') {
            return new Date(appointment.dateTime) < new Date();
        } else if (filter === 'cancelled') {
            return appointment.status === 'cancelled';
        }
        return true;
    });

    const sortedAppointments = [...filteredAppointments].sort((a, b) => {
        if (sort === 'date') {
            return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        } else if (sort === 'provider') {
            return a.providerId.localeCompare(b.providerId);
        }
        return 0;
    });

    // LD1: Render a list of appointment cards when data is available
    return (
        <CareLayout>
            <Head>
                <title>My Appointments | Care Now | AUSTA SuperApp</title>
                <meta name="description" content="View and manage your healthcare appointments" />
            </Head>
            <Box padding="md">
                <Text fontSize="xl" fontWeight="bold" marginBottom="md">
                    Minhas Consultas
                </Text>
                {sortedAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
                {/* LD1: Provide a button to navigate to the appointment booking page */}
                <Button
                    variant="primary"
                    journey="care"
                    onPress={() => void router.push(CARE_ROUTES.WEB_CARE_APPOINTMENT_BOOK)}
                >
                    Agendar Nova Consulta
                </Button>
            </Box>
        </CareLayout>
    );
};

/**
 * A component to display an individual appointment.
 * @param Appointment appointment
 * @returns The rendered appointment card.
 */
const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
    // LD1: Format the appointment date and time using date-fns
    const formattedDate = format(new Date(appointment.dateTime), 'dd/MM/yyyy');
    const formattedTime = format(new Date(appointment.dateTime), 'HH:mm');

    // LD1: Apply journey-specific styling using the care journey theme
    useJourney();

    return (
        <Card journey="care" marginBottom="sm">
            <Box padding="md">
                {/* LD1: Display the appointment provider name */}
                <Text fontWeight="bold" fontSize="lg">
                    {appointment.providerId}
                </Text>
                {/* LD1: Display the appointment type (in-person or telemedicine) */}
                <Text color="neutral.gray700">{appointment.type}</Text>
                {/* LD1: Display the appointment date and time */}
                <Text color="neutral.gray700">
                    {formattedDate} - {formattedTime}
                </Text>
                {/* LD1: Display the appointment status (upcoming, completed, cancelled) */}
                <Text color="neutral.gray700">Status: {appointment.status}</Text>
                {/* LD1: Provide a button to view appointment details */}
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => {
                        // LD1: Navigate to the details page for a specific appointment
                    }}
                >
                    Ver Detalhes
                </Button>
            </Box>
        </Card>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default AppointmentsPage;
