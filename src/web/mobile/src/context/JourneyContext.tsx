import React, { createContext, useContext, useState, ReactNode } from 'react';
import { JOURNEY_IDS } from '@shared/constants/journeys';
import { JourneyId } from '@shared/types';

/**
 * Context interface that defines what's provided by the JourneyContext
 * Provides access to the current journey and a function to update it
 */
interface JourneyContextType {
  journey: JourneyId;
  setJourney: (journey: JourneyId) => void;
}

/**
 * Create the Journey context with default values
 * This context allows components to access and update the active journey,
 * ensuring consistent journey-based styling and behavior across the app
 */
export const JourneyContext = createContext<JourneyContextType>({
  journey: JOURNEY_IDS.HEALTH, // Default to health journey
  setJourney: () => {}, // Empty function as placeholder
});

/**
 * Provider component that manages the current journey state
 * Wraps the application to provide journey context to all components
 * 
 * @param children - React nodes to be wrapped by the provider
 */
export const JourneyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize the journey state with the default journey (Health)
  const [journey, setJourney] = useState<JourneyId>(JOURNEY_IDS.HEALTH);

  // Provide the journey context to children
  return (
    <JourneyContext.Provider value={{ journey, setJourney }}>
      {children}
    </JourneyContext.Provider>
  );
};

/**
 * Hook to access the current journey context
 * @returns The current journey and setJourney function
 */
export const useJourney = () => {
  return useContext(JourneyContext);
};