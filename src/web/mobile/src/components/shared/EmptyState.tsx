import React from 'react';
import { Stack, Icon, Text, Button } from '@austa/design-system';
import { useJourney } from '../../hooks/useJourney';

/**
 * Props for the EmptyState component
 */
interface EmptyStateProps {
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
  journey?: string;
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
  const currentJourney = journey || contextJourney;

  // Get journey-specific primary color for the icon and button
  const getJourneyColor = () => {
    if (currentJourney === 'health') return '#0ACF83';
    if (currentJourney === 'care') return '#FF8C42';
    if (currentJourney === 'plan') return '#3A86FF';
    return '#0066CC'; // Default to brand primary if no journey specified
  };

  return (
    <Stack
      spacing="lg"
      align="center"
      testID={testID || 'empty-state'}
      padding="xl"
    >
      {/* Icon with journey-specific color */}
      <Icon
        name={icon}
        size={64}
        color={getJourneyColor()}
        aria-hidden={true}
      />

      {/* Main title/message */}
      <Text
        fontSize="xl"
        fontWeight="bold"
        textAlign="center"
        journey={currentJourney as any}
      >
        {title}
      </Text>

      {/* Optional description */}
      {description && (
        <Text
          fontSize="md"
          textAlign="center"
          color="neutral.gray600"
        >
          {description}
        </Text>
      )}

      {/* Optional action button */}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          journey={currentJourney as any}
          onPress={onAction}
          accessibilityLabel={actionLabel}
        >
          {actionLabel}
        </Button>
      )}
    </Stack>
  );
};

export default EmptyState;