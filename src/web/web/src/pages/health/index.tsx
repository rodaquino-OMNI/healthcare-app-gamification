import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { JOURNEY_IDS } from 'shared/constants/journeys';

import { useJourney } from '../../hooks/useJourney';
import HealthLayout from '../../layouts/HealthLayout';

/**
 * Main component for the Health Journey index page.
 */
const HealthJourneyIndex: React.FC = () => {
    const { t } = useTranslation();
    const { setJourney } = useJourney();

    useEffect(() => {
        setJourney(JOURNEY_IDS.HEALTH);
    }, [setJourney]);

    return (
        <HealthLayout>
            <div>
                <h2>{t('journeys.health.title')}</h2>
                <p>{t('journeys.health.subtitle')}</p>
            </div>
        </HealthLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default HealthJourneyIndex;
