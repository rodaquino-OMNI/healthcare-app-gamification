import React, { forwardRef } from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import { StyledTouchableOpacity } from './Touchable.styles';
import { colors } from '../../tokens/colors';

/**
 * Props interface for the Touchable component
 */
export interface TouchableProps {
  /**
   * Function called when the component is pressed
   */
  onPress?: (event: GestureResponderEvent) => void;
  
  /**
   * Function called when the component is long pressed
   */
  onLongPress?: (event: GestureResponderEvent) => void;
  
  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * The opacity value when the component is pressed (0 to 1)
   * @default 0.2
   */
  activeOpacity?: number;
  
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
  
  /**
   * Accessibility hint provides additional context for screen readers
   */
  accessibilityHint?: string;
  
  /**
   * Accessibility role defines the type of interactive element
   */
  accessibilityRole?: string;
  
  /**
   * Whether the component is accessible to screen readers
   * @default true
   */
  accessible?: boolean;
  
  /**
   * TestID for testing purposes
   */
  testID?: string;
  
  /**
   * Journey identifier for journey-specific styling (health, care, plan)
   */
  journey?: 'health' | 'care' | 'plan';
  
  /**
   * Child elements to render inside the touchable
   */
  children?: React.ReactNode;
  
  /**
   * Additional styles to apply to the component
   */
  style?: object;
  
  /**
   * Whether the touchable should take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Generates appropriate accessibility props based on component props
 * @param props The component props
 * @returns Accessibility props object with role, label, and state
 */
const getAccessibilityProps = (props: TouchableProps) => {
  const {
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    accessible = true,
    disabled,
  } = props;

  return {
    accessible,
    accessibilityRole,
    accessibilityLabel,
    accessibilityHint,
    accessibilityState: {
      disabled: !!disabled,
    },
  };
};

/**
 * A cross-platform touchable component that provides consistent interaction behavior
 * with support for journey-specific styling and accessibility.
 * 
 * This primitive component serves as a foundation for all touchable elements in the AUSTA
 * SuperApp, ensuring consistent behavior across platforms with appropriate feedback
 * mechanisms and accessibility support.
 */
export const Touchable = forwardRef<TouchableOpacity, TouchableProps>((props, ref) => {
  const {
    onPress,
    onLongPress,
    disabled = false,
    activeOpacity = 0.2,
    testID,
    journey,
    children,
    style,
    fullWidth = false,
    ...rest
  } = props;

  // Get accessibility props
  const accessibilityProps = getAccessibilityProps(props);

  // Determine journey-specific styles if journey is specified
  const journeyStyle = journey 
    ? { 
        borderColor: colors.journeys[journey].primary,
        // Focus outline color based on journey
        outlineColor: colors.journeys[journey].accent,
      } 
    : {};

  return (
    <StyledTouchableOpacity
      ref={ref}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      testID={testID}
      fullWidth={fullWidth}
      style={[journeyStyle, style]}
      {...accessibilityProps}
      {...rest}
    >
      {children}
    </StyledTouchableOpacity>
  );
});

// Display name for debugging
Touchable.displayName = 'Touchable';