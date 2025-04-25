import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ALL_JOURNEYS } from 'src/web/shared/constants/journeys.ts';
import { useAuth } from 'src/web/web/src/hooks/useAuth.ts';

/**
 * Type for a journey object as defined in journeys.ts
 */
export type Journey = typeof ALL_JOURNEYS[number];

/**
 * Context for managing the current user journey
 */
export interface JourneyContextType {
  /**
   * The current journey ID
   */
  currentJourney: string;
  
  /**
   * Function to set the current journey
   * @param journeyId The ID of the journey to set as current
   */
  setCurrentJourney: (journeyId: string) => void;
  
  /**
   * The full data for the current journey
   */
  journeyData: Journey | undefined;
}

/**
 * Context for sharing journey state across components
 */
const JourneyContext = createContext<JourneyContextType>({
  currentJourney: '',
  setCurrentJourney: () => {},
  journeyData: undefined,
});

interface JourneyProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the JourneyContext
 * Manages the current journey state and provides methods to update it
 */
export const JourneyProvider = ({ children }: JourneyProviderProps) => {
  // Default to the first journey
  const [currentJourney, setCurrentJourney] = useState(ALL_JOURNEYS[0].id);
  const { isAuthenticated } = useAuth();

  // Set initial journey or handle authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      // Ensure we have a valid journey selected after authentication
      if (!currentJourney) {
        setCurrentJourney(ALL_JOURNEYS[0].id);
      }
    }
  }, [isAuthenticated, currentJourney]);

  // Get the current journey data
  const journeyData = ALL_JOURNEYS.find(journey => journey.id === currentJourney);

  // Handle journey changes with validation
  const handleSetCurrentJourney = (journeyId: string) => {
    // Validate that the journey ID is valid
    if (ALL_JOURNEYS.some(journey => journey.id === journeyId)) {
      setCurrentJourney(journeyId);
      // Could potentially store user's journey preference here for persistence
    } else {
      console.error(`Invalid journey ID: ${journeyId}`);
    }
  };

  const value = {
    currentJourney,
    setCurrentJourney: handleSetCurrentJourney,
    journeyData,
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};

/**
 * Hook to access the JourneyContext
 * @returns The journey context value
 * @throws Error if used outside of a JourneyProvider
 */
export const useJourney = (): JourneyContextType => {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};