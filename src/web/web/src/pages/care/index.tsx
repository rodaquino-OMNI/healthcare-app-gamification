import React from 'react'; // react@18.0.0

import { useAppointments } from '@/hooks';
import { CareLayout } from '@/layouts/CareLayout';

/**
 * This file defines the main entry point for the Care Now journey in the web application.
 * It renders the CareLayout component.
 */
const CareNowPage: React.FC = () => {
    const { appointments, loading, error } = useAppointments();

    return (
        <CareLayout>
            {loading && <div>Loading care dashboard...</div>}
            {error && <div>Error loading care data.</div>}
            {!loading && !error && (
                <div>
                    <h2>Care Now Journey</h2>
                    <p>You have {appointments.length} appointment(s).</p>
                </div>
            )}
        </CareLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default CareNowPage;
