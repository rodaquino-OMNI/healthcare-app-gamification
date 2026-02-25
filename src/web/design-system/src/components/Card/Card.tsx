import React from 'react';
import { Box } from '../../primitives/Box/Box';

/**
 * Interface defining the props for the Card component
 */
export interface CardProps {
  /** Content to be rendered inside the card */
  children?: React.ReactNode;
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
  padding?: string | number;
  /** Margin around the card */
  margin?: string | number;
  /** Width of the card */
  width?: string;
  /** Height of the card */
  height?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Test ID for component testing */
  testID?: string;
  /** Additional style overrides */
  style?: any;
  /** Shadow shorthand */
  shadow?: string;

  /**
   * Shorthand for applying a medium elevation shadow (shadows.md).
   * When true and no explicit boxShadow is set, applies the standard elevated shadow.
   * The existing `elevation` prop is preserved for granular control.
   * @default false
   */
  elevated?: boolean;

  /** Allow additional passthrough props for RN/web compatibility */
  [key: string]: any;
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
  borderRadius = 'md',
  padding = 'md',
  margin,
  width,
  height,
  accessibilityLabel,
  elevated = false,
  ...rest
}) => {
  // Determine if card should be interactive based on props
  const isInteractive = interactive || !!onPress;

  // Resolve elevation: `elevated` shorthand applies shadows.md when no explicit elevation override
  const resolvedElevation = elevated ? 'md' : elevation;

  // Style object to override CardContainer defaults when needed
  const style: React.CSSProperties = {
    cursor: isInteractive ? 'pointer' : 'default',
    transition: 'all 0.2s ease-in-out',
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      boxShadow={resolvedElevation}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      padding={padding !== undefined ? String(padding) : undefined}
      margin={margin !== undefined ? String(margin) : undefined}
      width={width}
      height={height}
      onClick={onPress as React.MouseEventHandler<HTMLDivElement>}
      role={onPress ? 'button' : undefined}
      aria-label={accessibilityLabel}
      journey={journey}
      style={style}
      data-testid={rest.testID}
    >
      {children}
    </Box>
  );
};