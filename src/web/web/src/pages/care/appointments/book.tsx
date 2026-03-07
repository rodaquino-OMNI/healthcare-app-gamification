import React from 'react'; // React v18.0+
import { useRouter } from 'next/router'; // next/router latest

import { JourneyHeader } from 'src/web/web/src/components/shared/JourneyHeader';
import { AppointmentForm } from 'src/web/web/src/components/forms/AppointmentForm';
import { JourneyContext } from 'src/web/web/src/context/JourneyContext';
import { CareLayout } from 'src/web/web/src/layouts/CareLayout';

/**
 * Renders the appointment booking page with the JourneyHeader and AppointmentForm.
 * @returns {JSX.Element} The rendered appointment booking page.
 */
const AppointmentBookingPage: React.FC = () => {
    // LD1: Uses the useRouter hook to get the router object.
    const router = useRouter();

    // LD1: Renders the CareLayout component to provide the basic layout for the Care Now journey.
    return (
        <CareLayout>
            {/* LD1: Renders the JourneyHeader component with the title 'Agendar Consulta'. */}
            <JourneyHeader title="Agendar Consulta" />
            {/* LD1: Renders the AppointmentForm component to handle the appointment booking process. */}
            <AppointmentForm />
        </CareLayout>
    );
};

export default AppointmentBookingPage;
