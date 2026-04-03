import React, { useEffect } from 'react';
import { JOURNEY_IDS } from 'shared/constants/journeys';

import { useJourney } from '../../hooks/useJourney';
import HealthLayout from '../../layouts/HealthLayout';

/**
 * Main component for the Health Journey index page.
 */
const HealthJourneyIndex: React.FC = () => {
    const { setJourney } = useJourney();

    useEffect(() => {
        setJourney(JOURNEY_IDS.HEALTH);
    }, [setJourney]);

    return (
        <HealthLayout>
            <div>
                <h2>Minha Saude</h2>
                <p>Acompanhe suas metricas de saude, metas e integracoes.</p>
            </div>
        </HealthLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default HealthJourneyIndex;
