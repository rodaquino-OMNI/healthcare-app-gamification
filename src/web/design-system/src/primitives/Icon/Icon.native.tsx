import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { getIcon, IconName } from './iconRegistry';
import { colors } from '../../tokens/colors';
import { sizingValues } from '../../tokens/sizing';

/**
 * Props for the Icon component (React Native).
 */
export interface IconProps {
    /** The name of the icon to display (e.g., 'heart', 'calendar'). */
    name: IconName;
    /** The size of the icon — a sizing.icon token key or a numeric px value. */
    size?: string | number;
    /** The color of the icon fill. */
    color?: string;
    /** Whether the icon is interactive (clickable/tappable). */
    interactive?: boolean;
    /** Accessible label for the icon. */
    accessibilityLabel?: string;
}

/**
 * Resolves an icon size token key or numeric value to a number (px).
 */
const resolveIconSize = (size: string | number): number => {
    if (typeof size === 'number') {
        return size;
    }
    if (size in sizingValues.icon) {
        return sizingValues.icon[size as keyof typeof sizingValues.icon];
    }
    // Attempt to parse a string like '24px' or '24'
    const parsed = parseInt(size, 10);
    return isNaN(parsed) ? sizingValues.icon.md : parsed;
};

/**
 * Icon component for React Native.
 * Renders an SVG icon from the shared iconRegistry using react-native-svg.
 *
 * @example
 * ```tsx
 * <Icon name="heart" size="lg" color={colors.journeys.health.primary} />
 * ```
 */
export const Icon: React.FC<IconProps> = ({ name, size = 'md', color, interactive = false, accessibilityLabel }) => {
    const icon = getIcon(name);

    if (!icon) {
        console.warn(`Icon "${name}" not found in icon registry`);
        return null;
    }

    const numericSize = resolveIconSize(size);

    return (
        <View
            style={{ width: numericSize, height: numericSize }}
            accessibilityRole={interactive ? 'button' : 'image'}
            accessibilityLabel={accessibilityLabel}
            testID="icon-container"
        >
            <Svg viewBox={icon.viewBox || '0 0 24 24'} width={numericSize} height={numericSize}>
                <Path d={icon.path} fill={color || colors.neutral.gray700} />
            </Svg>
        </View>
    );
};

// ---------------------------------------------------------------------------
// FigmaIconContainer — Figma variant-aligned icon wrapper (React Native)
// ---------------------------------------------------------------------------

/** Figma-aligned icon container sizes */
export type FigmaIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Figma-aligned semantic color categories */
export type FigmaIconColor = 'brand' | 'destructive' | 'gray' | 'success' | 'warning';

/** Figma-aligned icon container visual style */
export type FigmaIconStyle = 'primary' | 'secondary' | 'outlined' | 'noFill';

export interface FigmaIconContainerProps {
    size: FigmaIconSize;
    color: FigmaIconColor;
    style: FigmaIconStyle;
    children: React.ReactNode;
}

const FIGMA_SIZE_MAP: Record<FigmaIconSize, number> = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48,
};

const resolveSolidColor = (c: FigmaIconColor): string => {
    switch (c) {
        case 'brand':
            return colors.brand.primary;
        case 'destructive':
            return colors.semantic.error;
        case 'gray':
            return colors.gray[50];
        case 'success':
            return colors.semantic.success;
        case 'warning':
            return colors.semantic.warning;
    }
};

const resolveTintedBg = (c: FigmaIconColor): string => {
    switch (c) {
        case 'brand':
            return colors.brandPalette[50];
        case 'destructive':
            return colors.semantic.errorBg;
        case 'gray':
            return colors.gray[10];
        case 'success':
            return colors.semantic.successBg;
        case 'warning':
            return colors.semantic.warningBg;
    }
};

/**
 * FigmaIconContainer for React Native.
 * Wraps an Icon with Figma-aligned container styling.
 */
export const FigmaIconContainer: React.FC<FigmaIconContainerProps> = ({
    size,
    color: colorProp,
    style: styleProp,
    children,
}) => {
    const pxSize = FIGMA_SIZE_MAP[size];
    const solidColor = resolveSolidColor(colorProp);

    let bgColor = 'transparent';
    let borderColor: string | undefined;

    switch (styleProp) {
        case 'primary':
            bgColor = solidColor;
            break;
        case 'secondary':
            bgColor = resolveTintedBg(colorProp);
            break;
        case 'outlined':
            borderColor = solidColor;
            break;
        case 'noFill':
            break;
    }

    const containerStyle: ViewStyle = {
        width: pxSize,
        height: pxSize,
        borderRadius: Math.round(pxSize * 0.25),
        backgroundColor: bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        ...(borderColor ? { borderWidth: 1, borderColor } : {}),
    };

    return (
        <View style={containerStyle} testID="figma-icon-container">
            {children}
        </View>
    );
};
