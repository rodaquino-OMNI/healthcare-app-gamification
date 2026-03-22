/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Icon, Text, Button } from '@austa/design-system';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useJourney } from '../../hooks/useJourney';

/** The set of journey identifiers recognised by design-system components. */
type JourneyType = 'health' | 'care' | 'plan';

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps {
    /** Icon name to display */
    icon: string;
    /** Main message to display */
    title: string;
    /** Optional secondary description */
    description?: string;
    /** Optional label for action button */
    actionLabel?: string;
    /** Optional handler for action button press */
    onAction?: () => void;
    /** Journey context for theming (health, care, plan) */
    journey?: JourneyType | string;
    /** Test ID for component testing */
    testID?: string;
}

/**
 * EmptyState component displays a user-friendly message when there is no data to show.
 * It includes an icon, title, optional description, and optional action button.
 * The component supports journey-specific styling to maintain visual consistency.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="heart"
 *   title="No health metrics found"
 *   description="Connect a device or add metrics manually to see data here."
 *   actionLabel="Add Metrics"
 *   onAction={() => navigation.navigate('AddMetrics')}
 *   journey="health"
 * />
 * ```
 */
const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    journey,
    testID,
}) => {
    // Use the provided journey or get it from context
    const { journey: contextJourney } = useJourney();
    const currentJourney: JourneyType | string | undefined = journey ?? contextJourney;
    const journeyForDS: JourneyType | undefined =
        currentJourney === 'health' || currentJourney === 'care' || currentJourney === 'plan'
            ? currentJourney
            : undefined;

    // Get journey-specific primary color for the icon and button
    const getJourneyColor = () => {
        if (currentJourney === 'health') {
            return '#0ACF83';
        }
        if (currentJourney === 'care') {
            return '#FF8C42';
        }
        if (currentJourney === 'plan') {
            return '#3A86FF';
        }
        return '#0066CC'; // Default to brand primary if no journey specified
    };

    return (
        <View style={emptyStyles.container} testID={testID || 'empty-state'}>
            {/* Icon with journey-specific color */}
            <Icon name={icon} size={64} color={getJourneyColor()} aria-hidden={true} />

            {/* Main title/message */}
            <Text fontSize="xl" fontWeight="bold" textAlign="center" journey={journeyForDS}>
                {title}
            </Text>

            {/* Optional description */}
            {description && (
                <Text fontSize="md" textAlign="center" color="neutral.gray600">
                    {description}
                </Text>
            )}

            {/* Optional action button */}
            {actionLabel && onAction && (
                <Button variant="primary" journey={journeyForDS} onPress={onAction} accessibilityLabel={actionLabel}>
                    {actionLabel}
                </Button>
            )}
        </View>
    );
};

const emptyStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 24,
        gap: 16,
    },
});

export default EmptyState;
