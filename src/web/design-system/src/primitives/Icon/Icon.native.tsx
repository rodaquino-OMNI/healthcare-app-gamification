import React from 'react';
import { View, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { IconProps, FigmaIconContainerProps, FigmaIconSize, FigmaIconColor } from './Icon';
import { getIcon } from './iconRegistry';
import { colors } from '../../tokens/colors';
import { sizingValues } from '../../tokens/sizing';

type IconSizeKey = keyof typeof sizingValues.icon;

const resolveIconSize = (size: string | number): number => {
    if (typeof size === 'number') {
        return size;
    }
    if (size in sizingValues.icon) {
        return sizingValues.icon[size as IconSizeKey];
    }
    return parseInt(size, 10) || 24;
};

export const Icon: React.FC<IconProps & { testID?: string }> = ({
    name,
    size = 'md',
    color,
    interactive = false,
    'aria-hidden': ariaHiddenProp,
    'aria-label': ariaLabel,
    testID,
}) => {
    const icon = getIcon(name);
    if (!icon) {
        if (__DEV__) {
            console.warn(`Icon "${name}" not found in registry`);
        }
        return null;
    }

    const resolvedAriaHidden = ariaHiddenProp !== undefined ? ariaHiddenProp : !interactive;
    const ariaHiddenBool = resolvedAriaHidden !== false && resolvedAriaHidden !== 'false';
    const pxSize = resolveIconSize(size);
    const fillColor = color ?? colors.neutral.gray700;

    return (
        <View
            testID={testID ?? 'icon-container'}
            accessible={!ariaHiddenBool}
            accessibilityLabel={ariaHiddenBool ? undefined : ariaLabel}
            accessibilityRole={ariaHiddenBool ? undefined : 'image'}
            style={{ width: pxSize, height: pxSize, alignItems: 'center', justifyContent: 'center' }}
        >
            <Svg width={pxSize} height={pxSize} viewBox={icon.viewBox ?? '0 0 24 24'} fill="none">
                <Path d={icon.path} fill={fillColor} />
            </Svg>
        </View>
    );
};

// --------------------------------------------------------------------------
// FigmaIconContainer
// --------------------------------------------------------------------------

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

export const FigmaIconContainer: React.FC<FigmaIconContainerProps & { testID?: string }> = ({
    size,
    color: colorProp,
    style: styleProp,
    children,
    testID,
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
        <View testID={testID ?? 'figma-icon-container'} style={containerStyle}>
            {children}
        </View>
    );
};

export type { FigmaIconContainerProps };
