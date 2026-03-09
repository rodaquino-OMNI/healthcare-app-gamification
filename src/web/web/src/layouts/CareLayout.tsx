import React from 'react';

import { JourneyNav } from '@/components/navigation/JourneyNav';
import { useJourney } from '@/hooks/useJourney';
import { MainLayout } from '@/layouts/MainLayout';

interface CareLayoutProps {
    children: React.ReactNode;
}

/**
 * Layout component for the Care Now journey.
 * Provides a consistent structure and styling for all
 * screens within the journey.
 */
export const CareLayout: React.FC<CareLayoutProps> = ({ children }) => {
    // LD1: Retrieves the current journey from the JourneyContext.
    useJourney();

    // LD1: Renders the main layout structure with the CareNow-specific navigation.
    return (
        <MainLayout>
            {/* LD1: Renders the JourneyNav for navigation. */}
            <JourneyNav />

            {/* LD1: Renders the children components (the content of the page). */}
            {children}
        </MainLayout>
    );
};

export default CareLayout;
