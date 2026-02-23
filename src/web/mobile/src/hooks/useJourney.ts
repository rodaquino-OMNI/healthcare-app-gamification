import { useContext } from 'react'; // react v17.0.2
import { JOURNEY_IDS } from '@shared/constants/journeys';
import { JourneyContext } from '../context/JourneyContext';
import { JourneyId } from '@shared/types';

/**
 * A custom hook that provides access to the current journey and a function to update it.
 * This hook simplifies the process of managing the active journey and ensures that
 * components can easily access and modify the journey state.
 * 
 * @returns An object containing the current journey and the setJourney function
 */
export const useJourney = () => {
  return useContext(JourneyContext);
};