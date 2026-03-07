import React from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import JourneyHeader from '@/components/shared/JourneyHeader';
import { useJourney } from '@/context/JourneyContext';
import { JOURNEY_IDS } from 'shared/constants/journeys';
import MainLayout from '@/layouts/MainLayout';

/**
 * Provides the layout for the 'My Plan & Benefits' journey.
 * @param children - React nodes to render within the layout.
 * @returns The rendered layout with the sidebar and header.
 */
const PlanLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    // LD1: Retrieves the journey ID using the `useJourney` hook.
    const { journey } = useJourney();

    // LD1: Renders the `MainLayout` component.
    return (
        <MainLayout>
            {/* LD1: Renders the `JourneyHeader` component with the title 'Meu Plano & Benefícios'. */}
            <JourneyHeader title="Meu Plano & Benefícios" />

            {/* LD1: Renders the `Sidebar` component. */}
            <Sidebar />

            {/* LD1: Renders the children (content of the page). */}
            {children}
        </MainLayout>
    );
};

export default PlanLayout;
