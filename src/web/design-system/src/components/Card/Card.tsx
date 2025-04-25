import React from 'react';
import { Box } from '../primitives/Box/Box';
import { CardContainer } from './Card.styles';

/**
 * Interface defining the props for the Card component
 */
export interface CardProps {
  /** Content to be rendered inside the card */
  children: React.ReactNode;
  /** Optional callback function when card is pressed/clicked */
  onPress?: () => void;
  /** Controls the shadow depth of the card */
  elevation?: 'sm' | 'md' | 'lg'; 
  /** Journey context for automatic theming */
  journey?: 'health' | 'care' | 'plan';
  /** Whether the card should appear interactive (cursor pointer, hover effects) */
  interactive?: boolean;
  /** Background color of the card, overrides journey background if specified */
  backgroundColor?: string;
  /** Border color of the card */
  borderColor?: string;
  /** Border radius of the card */
  borderRadius?: string;
  /** Padding inside the card */
  padding?: string;
  /** Margin around the card */
  margin?: string;
  /** Width of the card */
  width?: string;
  /** Height of the card */
  height?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
}

/**
 * A versatile card component that serves as a container for content with consistent 
 * styling and theming support. The Card component is built on top of the Box primitive
 * and supports journey-specific theming, interactive states, and various layout options.
 * 
 * @example
 * // Basic usage
 * <Card>
 *   <Text>Card content</Text>
 * </Card>
 * 
 * @example
 * // With journey-specific theming
 * <Card journey="health" elevation="md">
 *   <Text>Health Journey Card</Text>
 * </Card>
 * 
 * @example
 * // Interactive card with click handler
 * <Card onPress={() => console.log('Card clicked')} elevation="lg">
 *   <Text>Click me</Text>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  elevation = 'sm',
  journey,
  interactive = false,
  backgroundColor,
  borderColor,
  borderRadius = 'md',
  padding = 'md',
  margin,
  width,
  height,
  accessibilityLabel,
  ...rest
}) => {
  // Determine if card should be interactive based on props
  const isInteractive = interactive || !!onPress;
  
  // Style object to override CardContainer defaults when needed
  const style = {
    cursor: isInteractive ? 'pointer' : 'default',
    transition: 'all 0.2s ease-in-out',
  };
  
  return (
    <Box
      as={CardContainer}
      display="flex"
      flexDirection="column"
      boxShadow={elevation}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      padding={padding}
      margin={margin}
      width={width}
      height={height}
      onClick={onPress}
      role={onPress ? 'button' : undefined}
      aria-label={accessibilityLabel}
      journey={journey}
      // Apply journey-specific left border if journey is provided
      borderLeft={journey ? `4px solid` : undefined}
      borderLeftColor={journey ? `journeys.${journey}.primary` : undefined}
      // Apply border color if specified
      borderColor={borderColor || 'neutral.gray200'}
      style={style}
      {...rest}
    >
      {children}
    </Box>
  );
};