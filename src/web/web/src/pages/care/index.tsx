import React from 'react'; // react@18.0.0
import { useTranslation } from 'react-i18next';

import { useAppointments } from '@/hooks';
import { CareLayout } from '@/layouts/CareLayout';

/**
 * This file defines the main entry point for the Care Now journey in the web application.
 * It renders the CareLayout component.
 */
const CareNowPage: React.FC = () => {
    const { t } = useTranslation();
    const { appointments, loading, error } = useAppointments();

    return (
        <CareLayout>
            {loading && <div>{t('journeys.care.loadingDashboard')}</div>}
            {error && <div>{t('journeys.care.errorLoading')}</div>}
            {!loading && !error && (
                <div>
                    <h2>{t('journeys.care.title')}</h2>
                    <p>{t('journeys.care.appointmentCount', { count: appointments.length })}</p>
                </div>
            )}
        </CareLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default CareNowPage;
