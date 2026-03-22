import React, { forwardRef } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { StyledTouchableOpacity } from './Touchable.styles';
import { borderRadius as borderRadiusTokens } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';

/**
 * Props interface for the Touchable component
 */
export interface TouchableProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
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
    style?: StyleProp<ViewStyle> | React.CSSProperties;

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
        onLongPress: _onLongPress,
        disabled = false,
        activeOpacity: _activeOpacity,
        testID,
        journey,
        children,
        style,
        fullWidth = false,
        borderRadius,
        accessibilityLabel,
        accessibilityHint,
        accessibilityRole,
        accessible: _accessible,
        accessibilityState,
        ...rest
    } = props;

    // Determine journey-specific styles if journey is specified
    const journeyStyle: ViewStyle = journey
        ? {
              borderColor: colors.journeys[journey].primary,
          }
        : {};

    // Resolve borderRadius token
    const borderRadiusStyle: ViewStyle = borderRadius
        ? { borderRadius: borderRadiusTokens[borderRadius] as unknown as number }
        : {};

    // Flatten style prop (supports RN style arrays and CSS properties) into a plain object
    const flatStyle: Record<string, unknown> = Array.isArray(style)
        ? ((StyleSheet.flatten(style as StyleProp<ViewStyle>) as Record<string, unknown>) ?? {})
        : typeof style === 'object' && style !== null
          ? (style as Record<string, unknown>)
          : {};
    const combinedStyle = { ...journeyStyle, ...borderRadiusStyle, ...flatStyle } as React.CSSProperties;

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
