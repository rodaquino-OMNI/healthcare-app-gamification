/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { useContext } from 'react'; // react v17.0.2

import { JourneyContext } from '../context/JourneyContext';

/**
 * A custom hook that provides access to the current journey and a function to update it.
 * This hook simplifies the process of managing the active journey and ensures that
 * components can easily access and modify the journey state.
 *
 * @returns An object containing the current journey and the setJourney function
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- hook return type is complex
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- hook return type is complex
export const useJourney = () => {
    return useContext(JourneyContext);
};
