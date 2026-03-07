import React from 'react';
import { Box } from 'design-system/primitives/Box';
import { Text } from 'design-system/primitives/Text';
import { ProgressCircle } from 'design-system/components/ProgressCircle';
import { useJourney } from '@/context/JourneyContext';
import { JOURNEY_COLORS } from 'shared/constants/journeys';

/**
 * Props for the LoadingIndicator component
 */
export interface LoadingIndicatorProps {
    /**
     * Size of the loading indicator
     * @default "md"
     */
    size?: string;

    /**
     * Optional text to display below the loading indicator
     */
    text?: string;

    /**
     * Whether the loading indicator should take up the full screen
     * @default false
     */
    fullScreen?: boolean;

    /**
     * Test ID for component testing
     */
    testID?: string;
}

/**
 * A component that displays a loading indicator with journey-specific styling.
 * It can be used across different parts of the application to provide consistent loading feedback to users.
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    size = 'md',
    text,
    fullScreen = false,
    testID,
}) => {
    // Get the current journey from context
    const { currentJourney } = useJourney();

    // Determine color based on current journey
    let journeyColor = JOURNEY_COLORS.HEALTH; // Default to health color

    if (currentJourney === 'health') {
        journeyColor = JOURNEY_COLORS.HEALTH;
    } else if (currentJourney === 'care') {
        journeyColor = JOURNEY_COLORS.CARE;
    } else if (currentJourney === 'plan') {
        journeyColor = JOURNEY_COLORS.PLAN;
    }

    // Determine size in pixels
    const getSizeInPx = () => {
        switch (size) {
            case 'sm':
                return '32px';
            case 'md':
                return '48px';
            case 'lg':
                return '64px';
            case 'xl':
                return '96px';
            default:
                return size; // Allow custom sizes
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width={fullScreen ? '100%' : 'auto'}
            height={fullScreen ? '100%' : 'auto'}
            position={fullScreen ? 'fixed' : 'relative'}
            top={fullScreen ? '0' : undefined}
            left={fullScreen ? '0' : undefined}
            right={fullScreen ? '0' : undefined}
            bottom={fullScreen ? '0' : undefined}
            backgroundColor={fullScreen ? 'neutral.white' : undefined}
            zIndex={fullScreen ? 9999 : undefined}
            padding="md"
            data-testid={testID}
            aria-busy="true"
            aria-live="polite"
        >
            <ProgressCircle
                progress={75} // Fixed value to create a partial circle
                color={journeyColor}
                size={getSizeInPx()}
                ariaLabel={text || 'Loading'}
            />

            {text && (
                <Text
                    fontSize="md"
                    marginTop="md"
                    textAlign="center"
                    journey={currentJourney as 'health' | 'care' | 'plan'}
                >
                    {text}
                </Text>
            )}
        </Box>
    );
};
