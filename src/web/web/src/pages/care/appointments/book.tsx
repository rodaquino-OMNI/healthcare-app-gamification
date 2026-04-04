import React from 'react'; // React v18.0+
import { useTranslation } from 'react-i18next';

import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAppointments } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter'; // next/router latest
import { CareLayout } from '@/layouts/CareLayout';

/**
 * Renders the appointment booking page with the JourneyHeader and AppointmentForm.
 * @returns {JSX.Element} The rendered appointment booking page.
 */
const AppointmentBookingPage: React.FC = () => {
    // LD1: Uses the useRouter hook to get the router object.
    useRouter();
    const { appointments: _appointments, loading, error } = useAppointments();
    const { t } = useTranslation();

    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Agendar Consulta" />
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>{t('common.loading')}</p>
                </div>
            </CareLayout>
        );
    }

    if (error) {
        return (
            <CareLayout>
                <JourneyHeader title="Agendar Consulta" />
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>{t('common.error')}</p>
                </div>
            </CareLayout>
        );
    }

    // LD1: Renders the CareLayout component to provide the basic layout for the Care Now journey.
    return (
        <CareLayout>
            {/* LD1: Renders the JourneyHeader component with the title 'Agendar Consulta'. */}
            <JourneyHeader title="Agendar Consulta" />
            {/* LD1: Renders the AppointmentForm component
                to handle the appointment booking process. */}
            <AppointmentForm />
        </CareLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default AppointmentBookingPage;
