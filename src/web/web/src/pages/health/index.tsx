import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useJourney } from '../../hooks/useJourney';
import { JOURNEY_IDS } from '../../../shared/constants/journeys';
import HealthLayout from '../../layouts/HealthLayout';

/**
 * Main component for the Health Journey index page.
 * Redirects to the Health Dashboard page.
 */
const HealthJourneyIndex: React.FC = () => {
    const router = useRouter();
    const { setJourney } = useJourney();

    // Set the current journey to Health and redirect to the dashboard
    useEffect(() => {
        setJourney(JOURNEY_IDS.HEALTH);
        router.push('/health/dashboard');
    }, [router, setJourney]);

    // Minimal content since we're redirecting
    return (
        <HealthLayout>
            <div>Redirecting to Health Dashboard...</div>
        </HealthLayout>
    );
};

export default HealthJourneyIndex;
