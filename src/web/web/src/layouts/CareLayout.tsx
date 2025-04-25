import React from 'react';
import { JourneyNav } from 'src/web/web/src/components/navigation/JourneyNav';
import { JourneyContext } from 'src/web/web/src/context/JourneyContext';
import { useJourney } from 'src/web/web/src/hooks/useJourney';
import { MainLayout } from 'src/web/web/src/layouts/MainLayout';

/**
 * Layout component for the Care Now journey.
 * Provides a consistent structure and styling for all screens within the journey.
 */
const CareLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  // LD1: Retrieves the current journey from the JourneyContext.
  const { journey } = useJourney();

  // LD1: Checks if the current journey is the Care Now journey.
  const isCareJourney = journey?.id === 'care';

  // LD1: Renders the main layout structure with the CareNow-specific navigation.
  return (
    <MainLayout>
      {/* LD1: Renders the JourneyNav component, which provides navigation between the main journeys. */}
      <JourneyNav />

      {/* LD1: Renders the children components (the content of the page). */}
      {children}
    </MainLayout>
  );
};

export default CareLayout;