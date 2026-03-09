import { Button } from 'design-system/components/Button';
import { Box } from 'design-system/primitives/Box';
import { Text } from 'design-system/primitives/Text';
import React from 'react';

import { useJourney } from '@/hooks/useJourney';

interface ErrorStateProps {
    /**
     * The error message to display to the user
     */
    message: string;

    /**
     * Function to call when the retry button is clicked
     */
    onRetry: () => void;
}

/**
 * A reusable component that displays an error message and provides a retry button.
 * This component is designed to be used throughout the application when an error
 * occurs during data fetching, form submission, or other operations.
 *
 * The component supports journey-specific theming via the useJourney hook,
 * ensuring that error states maintain the visual identity of the current journey.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
    // Get the current journey for theming
    const { journey } = useJourney();
    const journeyId =
        journey?.id === 'health' || journey?.id === 'care' || journey?.id === 'plan' ? journey.id : undefined;

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding="lg"
            journey={journeyId}
            data-testid="error-state"
        >
            <Box marginBottom="lg">
                <Text fontSize="lg" fontWeight="medium" textAlign="center" journey={journeyId}>
                    {message}
                </Text>
            </Box>

            <Button variant="primary" onPress={onRetry} journey={journeyId} accessibilityLabel="Tentar novamente">
                Tentar novamente
            </Button>
        </Box>
    );
};
