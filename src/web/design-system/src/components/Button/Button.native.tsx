import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { Icon } from '../../primitives/Icon/Icon.native';
import { Text } from '../../primitives/Text/Text.native';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacingValues } from '../../tokens/spacing';

/**
 * Props interface for the Button component (React Native).
 * Matches the web ButtonProps API for cross-platform compatibility.
 */
export interface ButtonProps {
    /** Button style variant @default 'primary' */
    variant?: string;
    /** Button size @default 'md' */
    size?: 'sm' | 'md' | 'lg';
    /** Whether the button is disabled @default false */
    disabled?: boolean;
    /** Whether to show a loading spinner @default false */
    loading?: boolean;
    /** Icon name to display inside the button */
    icon?: string;
    /** Function called when the button is pressed */
    onPress?: () => void;
    /** Accessibility label for screen readers */
    accessibilityLabel?: string;
    /** Button content */
    children?: React.ReactNode;
    /** Journey identifier for journey-specific styling @default 'health' */
    journey?: 'health' | 'care' | 'plan';
    /** Whether the button displays only an icon @default false */
    iconOnly?: boolean;
    /** Figma component color variant — overrides journey-based colors */
    color?: 'brand' | 'destructive' | 'gray' | 'success';
    /** Button visual hierarchy level @default 'primary' */
    hierarchy?: 'primary' | 'secondary' | 'noFill';
    /** Whether the button is rendered in a mobile context @default false */
    isMobile?: boolean;
    /** Test ID for component testing */
    testID?: string;
    /** Additional style overrides */
    style?: ViewStyle;
    /** Button type (web compat — unused in RN) */
    type?: string;
    /** Allow additional passthrough props */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

// ---------------------------------------------------------------------------
// Size configuration
// ---------------------------------------------------------------------------

interface SizeConfig {
    paddingVertical: number;
    paddingHorizontal: number;
    iconSize: number;
    fontSize: number;
}

const SIZE_CONFIG: Record<NonNullable<ButtonProps['size']>, SizeConfig> = {
    sm: {
        paddingVertical: spacingValues.xs, // 8
        paddingHorizontal: spacingValues.sm, // 12
        iconSize: 16,
        fontSize: 14,
    },
    md: {
        paddingVertical: spacingValues.sm, // 12
        paddingHorizontal: spacingValues.md, // 16
        iconSize: 20,
        fontSize: 16,
    },
    lg: {
        paddingVertical: spacingValues.md, // 16
        paddingHorizontal: spacingValues.lg, // 20
        iconSize: 24,
        fontSize: 18,
    },
};

// ---------------------------------------------------------------------------
// Color resolution helpers
// ---------------------------------------------------------------------------

/** Maps variant string to hierarchy for backward compat. */
const VARIANT_TO_HIERARCHY: Record<string, ButtonProps['hierarchy']> = {
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'noFill',
};

function resolveHierarchy(hierarchy: ButtonProps['hierarchy'], variant: string): NonNullable<ButtonProps['hierarchy']> {
    return hierarchy ?? VARIANT_TO_HIERARCHY[variant] ?? 'primary';
}

function resolveBackgroundColor(
    color: ButtonProps['color'],
    hierarchy: NonNullable<ButtonProps['hierarchy']>,
    variant: string,
    journey: NonNullable<ButtonProps['journey']>
): string {
    if (color) {
        const base = colors.componentColors[color];
        if (hierarchy === 'secondary') {
            return `${base}1A`; // 10% opacity
        }
        if (hierarchy === 'noFill') {
            return 'transparent';
        }
        return base; // primary
    }
    // Journey-based fallback
    switch (variant) {
        case 'secondary':
            return colors.neutral.white;
        case 'tertiary':
            return 'transparent';
        default:
            return colors.journeys[journey].primary;
    }
}

function resolveTextColor(
    color: ButtonProps['color'],
    hierarchy: NonNullable<ButtonProps['hierarchy']>,
    variant: string,
    journey: NonNullable<ButtonProps['journey']>
): string {
    if (color) {
        if (hierarchy === 'primary') {
            return colors.neutral.white;
        }
        return colors.componentColors[color];
    }
    if (variant === 'primary') {
        return colors.neutral.white;
    }
    return colors.journeys[journey].primary;
}

function resolveBorderColor(
    color: ButtonProps['color'],
    hierarchy: NonNullable<ButtonProps['hierarchy']>,
    variant: string,
    journey: NonNullable<ButtonProps['journey']>
): string | undefined {
    if (color) {
        return hierarchy === 'secondary' ? colors.componentColors[color] : undefined;
    }
    return variant === 'secondary' ? colors.journeys[journey].primary : undefined;
}

// ---------------------------------------------------------------------------
// Button component
// ---------------------------------------------------------------------------

/**
 * Button component for the AUSTA SuperApp design system (React Native).
 *
 * Uses Pressable for touch handling with pressed-state opacity feedback.
 * Supports the full variant/hierarchy/color/journey theming system matching
 * the web Button.tsx API.
 *
 * @example
 * ```tsx
 * <Button variant="primary" journey="health" onPress={handlePress}>
 *   Book Appointment
 * </Button>
 *
 * <Button color="destructive" hierarchy="secondary" size="sm" icon="trash">
 *   Delete
 * </Button>
 *
 * <Button loading size="lg" journey="care">
 *   Submitting...
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    onPress,
    accessibilityLabel,
    children,
    journey = 'health',
    iconOnly = false,
    color,
    hierarchy: hierarchyProp,
    isMobile: _isMobile = false,
    testID,
    style,
    type: _type,
    ...rest
}) => {
    const hierarchy = resolveHierarchy(hierarchyProp, variant);
    const sizeConfig = SIZE_CONFIG[size];

    const bgColor = resolveBackgroundColor(color, hierarchy, variant, journey);
    const textColor = resolveTextColor(color, hierarchy, variant, journey);
    const borderColor = resolveBorderColor(color, hierarchy, variant, journey);

    const isDisabled = disabled || loading;
    const hasContent = React.Children.count(children) > 0;
    const showIcon = !!icon && !loading;

    const containerStyle: ViewStyle = {
        paddingVertical: iconOnly ? sizeConfig.paddingVertical : sizeConfig.paddingVertical,
        paddingHorizontal: iconOnly ? sizeConfig.paddingVertical : sizeConfig.paddingHorizontal,
        backgroundColor: bgColor,
        borderRadius: borderRadiusValues.md,
        ...(borderColor ? { borderWidth: 1, borderColor } : {}),
    };

    return (
        <Pressable
            onPress={isDisabled ? undefined : onPress}
            disabled={isDisabled}
            testID={testID}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
            accessibilityState={{ disabled: isDisabled }}
            style={({ pressed }: { pressed: boolean }) => [
                styles.base,
                containerStyle,
                isDisabled && styles.disabled,
                pressed && !isDisabled && styles.pressed,
                style,
            ]}
            {...rest}
        >
            {loading ? (
                <ActivityIndicator size="small" color={textColor} />
            ) : (
                <View style={styles.content}>
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */}
                    {showIcon && <Icon name={icon as any} size={sizeConfig.iconSize} color={textColor} />}
                    {showIcon && hasContent && <View style={styles.iconSpacer} />}
                    {hasContent && (
                        <Text fontWeight="medium" fontSize={sizeConfig.fontSize} color={textColor}>
                            {children}
                        </Text>
                    )}
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    iconSpacer: {
        width: spacingValues.xs, // 8px gap between icon and text
    } as ViewStyle,
    disabled: {
        opacity: 0.5,
    } as ViewStyle,
    pressed: {
        opacity: 0.7,
    } as ViewStyle,
});

export default Button;
