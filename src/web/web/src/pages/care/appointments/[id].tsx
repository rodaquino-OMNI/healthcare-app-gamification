import { AppointmentCard } from 'design-system/care/AppointmentCard/AppointmentCard';
import type { GetStaticPaths } from 'next';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAppointments } from '@/hooks/useAppointments';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter'; // next/router 13.0+

/**
 * Renders the details of a specific appointment.
 * @returns A React component displaying the appointment details.
 */
const AppointmentDetail: React.FC = () => {
    // LD1: Retrieves the appointment ID from the route parameters using `useRouter`.
    const router = useRouter();
    const { id } = router.query;

    // LD1: Fetches the appointment data using the `useAppointments` hook.
    const { loading, error, appointments } = useAppointments();
    const { t } = useTranslation();

    // LD1: Renders a loading state if the appointment data is still being fetched.
    if (loading) {
        return <div>{t('common.loading')}</div>;
    }

    // LD1: Renders an error state if there was an error fetching the appointment data.
    if (error) {
        return <div>{t('common.error')}</div>;
    }

    // LD1: Filters the appointments array to find the appointment with the matching ID.
    const appointment = appointments.find((appt) => appt.id === id);

    // LD1: Renders a message if the appointment is not found.
    if (!appointment) {
        return <div>Appointment not found.</div>;
    }

    // LD1: Renders the AppointmentCard component with the fetched appointment data.
    return (
        <div>
            {/* LD1: Renders the JourneyHeader component for the Care journey. */}
            <JourneyHeader title="Appointment Details" />
            {/* LD1: Renders the AppointmentCard component with the fetched appointment data. */}
            <AppointmentCard
                appointment={appointment}
                provider={{
                    id: appointment.providerId,
                    name: 'Dr. Smith', // Replace with actual provider data
                    specialty: 'Cardiologist', // Replace with actual provider data
                }}
                onViewDetails={() => {
                    // LD1: Placeholder for view details action
                    alert('View details clicked');
                }}
                onReschedule={() => {
                    // LD1: Placeholder for reschedule action
                    alert('Reschedule clicked');
                }}
                onCancel={() => {
                    // LD1: Placeholder for cancel action
                    alert('Cancel clicked');
                }}
                onJoinTelemedicine={() => {
                    // LD1: Placeholder for join telemedicine action
                    alert('Join telemedicine clicked');
                }}
            />
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = () => ({
    paths: [],
    fallback: 'blocking' as const,
});

export const getStaticProps = () => ({ props: {} });

export default AppointmentDetail;
