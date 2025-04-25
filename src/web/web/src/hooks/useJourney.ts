import { useRouter } from 'next/router'; // next/router 13.0+
import { ALL_JOURNEYS } from 'src/web/shared/constants/journeys.ts';
import { Journey } from 'src/web/shared/types/index.ts';
import { useJourneyContext } from 'src/web/web/src/context/JourneyContext.tsx';

/**
 * Custom hook that provides access to the current user journey in the AUSTA SuperApp.
 * It automatically detects the journey from the current route and provides utility functions
 * to access and modify the current journey.
 * 
 * @returns An object containing the current journey and a function to set the journey
 */
export const useJourney = () => {
  const { currentJourney, setCurrentJourney, journeyData } = useJourneyContext();
  const router = useRouter();

  // Extract the journey ID from the route path
  // The first segment of the path after the initial slash will be the journey ID
  // e.g., /health/dashboard => health, /care/appointments => care
  const routePath = router.asPath;
  const pathSegments = routePath.split('/').filter(Boolean);
  const journeyIdFromRoute = pathSegments.length > 0 ? pathSegments[0] : null;

  // If a valid journey ID is found in the route and it's different from the current journey,
  // update the current journey
  if (journeyIdFromRoute && ALL_JOURNEYS.some(journey => journey.id === journeyIdFromRoute) && 
      journeyIdFromRoute !== currentJourney) {
    setCurrentJourney(journeyIdFromRoute);
  }

  return {
    /**
     * The current user journey object, or null if no journey is selected
     */
    journey: journeyData || null,
    
    /**
     * Function to set the current journey
     * @param journeyOrId A Journey object or journey ID string
     */
    setJourney: (journeyOrId: Journey | string | null) => {
      if (!journeyOrId) {
        // Default to first journey if null is passed
        setCurrentJourney(ALL_JOURNEYS[0].id);
      } else if (typeof journeyOrId === 'string') {
        // Set by ID
        setCurrentJourney(journeyOrId);
      } else {
        // Set by Journey object
        setCurrentJourney(journeyOrId.id);
      }
    }
  };
};