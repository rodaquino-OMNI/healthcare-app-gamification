import { Button } from 'design-system/components/Button/Button';
import { Box, Text, Icon } from 'design-system/primitives/index';
import React from 'react';
import { JOURNEY_ICONS } from 'shared/constants/index';

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps {
    /**
     * The title to display in the empty state
     */
    title: string;

    /**
     * The description text to display below the title
     */
    description: string;

    /**
     * Optional icon name to display. If journey is provided but no icon,
     * the journey's default icon will be used.
     */
    icon?: string;

    /**
     * Journey identifier for journey-specific styling
     */
    journey?: 'health' | 'care' | 'plan';

    /**
     * Optional label for the action button
     */
    actionLabel?: string;

    /**
     * Optional function to call when the action button is pressed
     */
    onAction?: () => void;
}

/**
 * A reusable component to display a placeholder UI when there is no data to show.
 * It provides a consistent way to inform users that a particular section is currently
 * empty and suggests possible actions or reasons for the empty state.
 *
 * @example
 * // Basic usage
 * <EmptyState
 *   title="No health metrics"
 *   description="You haven't recorded any health metrics yet."
 *   journey="health"
 * />
 *
 * @example
 * // With action button
 * <EmptyState
 *   title="No appointments"
 *   description="You don't have any upcoming appointments."
 *   journey="care"
 *   actionLabel="Book appointment"
 *   onAction={() => navigation.navigate('BookAppointment')}
 * />
 *
 * @example
 * // Offline state
 * <EmptyState
 *   title="Currently offline"
 *   description="Please check your connection and try again."
 *   icon="wifi-off"
 *   actionLabel="Retry"
 *   onAction={handleRefresh}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, journey, actionLabel, onAction }) => {
    // Determine which icon to show based on provided icon or journey
    let displayIcon = icon;

    // If no icon provided but journey is specified, use journey-specific icon
    if (!icon && journey) {
        const journeyKey = journey.toUpperCase() as keyof typeof JOURNEY_ICONS;
        displayIcon = JOURNEY_ICONS[journeyKey];
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding="lg"
            journey={journey}
            backgroundColor={journey ? undefined : 'neutral.gray100'}
            borderRadius="md"
            boxShadow="sm"
            width="100%"
            minHeight="200px"
            data-testid="empty-state"
        >
            {displayIcon && (
                <Box marginBottom="md">
                    <Icon
                        name={displayIcon}
                        size="48px"
                        color={journey ? `journeys.${journey}.primary` : 'neutral.gray600'}
                        aria-hidden={true}
                    />
                </Box>
            )}

            <Text
                as="h3"
                fontSize="xl"
                fontWeight="bold"
                color={journey ? `journeys.${journey}.primary` : 'neutral.gray900'}
                marginBottom="sm"
                textAlign="center"
            >
                {title}
            </Text>

            <Text color="neutral.gray700" marginBottom={actionLabel ? 'md' : undefined} textAlign="center">
                {description}
            </Text>

            {actionLabel && onAction && (
                <Box marginTop="md">
                    <Button variant="primary" journey={journey} onPress={onAction} aria-label={actionLabel}>
                        {actionLabel}
                    </Button>
                </Box>
            )}
        </Box>
    );
};
