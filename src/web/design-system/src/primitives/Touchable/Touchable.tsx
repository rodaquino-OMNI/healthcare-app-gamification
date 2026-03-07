import React, { forwardRef } from 'react';
import { StyledTouchableOpacity } from './Touchable.styles';
import { colors } from '../../tokens/colors';
import { borderRadius as borderRadiusTokens } from '../../tokens/borderRadius';

/**
 * Props interface for the Touchable component
 */
export interface TouchableProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Function called when the component is pressed
     */
    onPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;

    /**
     * Function called when the component is long pressed
     */
    onLongPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;

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
     * Accessibility state
     */
    accessibilityState?: {
        disabled?: boolean;
        checked?: boolean;
        expanded?: boolean;
        selected?: boolean;
    };

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
    style?: React.CSSProperties;

    /**
     * Whether the touchable should take up the full width of its container
     * @default false
     */
    fullWidth?: boolean;

    /**
     * Border radius from design tokens
     */
    borderRadius?: keyof typeof borderRadiusTokens;
}

/**
 * A cross-platform touchable component that provides consistent interaction behavior
 * with support for journey-specific styling and accessibility.
 */
export const Touchable = forwardRef<HTMLButtonElement, TouchableProps>((props, ref) => {
    const {
        onPress,
        onLongPress,
        disabled = false,
        activeOpacity,
        testID,
        journey,
        children,
        style,
        fullWidth = false,
        borderRadius,
        accessibilityLabel,
        accessibilityHint,
        accessibilityRole,
        accessible,
        accessibilityState,
        ...rest
    } = props;

    // Determine journey-specific styles if journey is specified
    const journeyStyle: React.CSSProperties = journey
        ? {
              borderColor: colors.journeys[journey].primary,
              outlineColor: colors.journeys[journey].accent,
          }
        : {};

    // Resolve borderRadius token
    const borderRadiusStyle: React.CSSProperties = borderRadius
        ? { borderRadius: borderRadiusTokens[borderRadius] }
        : {};

    const combinedStyle: React.CSSProperties = { ...journeyStyle, ...borderRadiusStyle, ...style };

    return (
        <StyledTouchableOpacity
            ref={ref}
            onClick={onPress}
            disabled={disabled}
            data-testid={testID}
            fullWidth={fullWidth}
            style={combinedStyle}
            aria-label={accessibilityLabel}
            aria-disabled={accessibilityState?.disabled ?? disabled}
            aria-checked={accessibilityState?.checked}
            aria-expanded={accessibilityState?.expanded}
            aria-selected={accessibilityState?.selected}
            role={accessibilityRole as React.AriaRole}
            title={accessibilityHint}
            {...rest}
        >
            {children}
        </StyledTouchableOpacity>
    );
});

// Display name for debugging
Touchable.displayName = 'Touchable';
