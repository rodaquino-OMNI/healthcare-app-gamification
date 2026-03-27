import React from 'react';
import { View, type ViewStyle, type ViewProps } from 'react-native';

import type { BoxProps } from './Box';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { sizingValues } from '../../tokens/sizing';
import { spacingValues } from '../../tokens/spacing';

/** CSS box-shadow tokens mapped to RN shadow + elevation props. */
const shadowPresets: Record<string, ViewStyle> = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 6,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 10,
    },
};

/** Resolve token key or CSS px string to numeric value using a token map. */
function resolveToken(value: string | number | undefined, tokens: Record<string, number>): number | undefined {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === 'number') {
        return value;
    }
    if (tokens[value] !== undefined) {
        return tokens[value];
    }
    const n = parseFloat(value);
    return isNaN(n) ? undefined : n;
}

/** Resolve dimension; preserves percentage strings for RN flex layout. */
function resolveDim(value: string | number | undefined): string | number | undefined {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === 'number') {
        return value;
    }
    if (value.endsWith('%')) {
        return value;
    }
    const n = parseFloat(value);
    return isNaN(n) ? undefined : n;
}

/** Resolve color token or pass through raw color string. */
function resolveColor(value: string | undefined): string | undefined {
    if (!value) {
        return undefined;
    }
    return (colors.neutral as Record<string, string>)[value] ?? value;
}

type NativeBoxProps = Omit<BoxProps, 'ref'> & ViewProps;

/**
 * React Native Box primitive. Maps the web Box CSS props to RN ViewStyle,
 * resolving design-system tokens (spacing, borderRadius, shadows, sizing)
 * to their numeric equivalents.
 */
export const Box = React.forwardRef<View, NativeBoxProps>(
    (
        {
            journey,
            backgroundColor,
            color: _color,
            padding,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            margin,
            marginTop,
            marginRight,
            marginBottom,
            marginLeft,
            boxShadow,
            borderRadius,
            size,
            display: _display,
            flexDirection,
            flexWrap,
            justifyContent,
            alignItems,
            alignContent,
            flex,
            flexGrow,
            flexShrink,
            flexBasis,
            gap,
            width,
            height,
            minWidth,
            maxWidth,
            minHeight,
            maxHeight,
            position,
            top,
            right,
            bottom,
            left,
            zIndex,
            overflow,
            opacity,
            children,
            style,
            ...rest
        },
        ref
    ) => {
        // Journey-specific background fallback
        let bgColor = backgroundColor;
        if (journey && !backgroundColor) {
            bgColor = colors.journeys[journey].background;
        }

        const sp = spacingValues as Record<string, number>;
        const br = borderRadiusValues as Record<string, number>;

        const viewStyle: ViewStyle = {
            // Flex layout
            flexDirection: flexDirection as ViewStyle['flexDirection'],
            flexWrap: flexWrap as ViewStyle['flexWrap'],
            justifyContent: justifyContent as ViewStyle['justifyContent'],
            alignItems: alignItems as ViewStyle['alignItems'],
            alignContent: alignContent as ViewStyle['alignContent'],
            flex:
                flex !== null && flex !== undefined
                    ? typeof flex === 'number'
                        ? flex
                        : parseFloat(String(flex)) || undefined
                    : undefined,
            flexGrow: flexGrow !== null && flexGrow !== undefined ? Number(flexGrow) : undefined,
            flexShrink: flexShrink !== null && flexShrink !== undefined ? Number(flexShrink) : undefined,
            flexBasis: flexBasis !== null && flexBasis !== undefined ? resolveDim(flexBasis) : undefined,
            gap: resolveToken(gap, sp),
            // Dimensions
            width: size ? (sizingValues.component[size] as unknown as number) : resolveDim(width),
            height: size ? (sizingValues.component[size] as unknown as number) : resolveDim(height),
            minWidth: resolveDim(minWidth),
            maxWidth: resolveDim(maxWidth),
            minHeight: resolveDim(minHeight),
            maxHeight: resolveDim(maxHeight),
            // Padding
            padding: resolveToken(padding, sp),
            paddingTop: resolveToken(paddingTop, sp),
            paddingRight: resolveToken(paddingRight, sp),
            paddingBottom: resolveToken(paddingBottom, sp),
            paddingLeft: resolveToken(paddingLeft, sp),
            // Margin
            margin: resolveToken(margin, sp),
            marginTop: resolveToken(marginTop, sp),
            marginRight: resolveToken(marginRight, sp),
            marginBottom: resolveToken(marginBottom, sp),
            marginLeft: resolveToken(marginLeft, sp),
            // Positioning
            position: position as ViewStyle['position'],
            top: resolveDim(top) as number | undefined,
            right: resolveDim(right) as number | undefined,
            bottom: resolveDim(bottom) as number | undefined,
            left: resolveDim(left) as number | undefined,
            zIndex: zIndex !== null && zIndex !== undefined ? Number(zIndex) : undefined,
            // Visual
            backgroundColor: resolveColor(bgColor),
            borderRadius: resolveToken(borderRadius, br),
            overflow: overflow as ViewStyle['overflow'],
            opacity: opacity !== null && opacity !== undefined ? Number(opacity) : undefined,
            // Shadow (spread from preset)
            ...(boxShadow ? (shadowPresets[boxShadow] ?? {}) : {}),
        };

        // Strip undefined keys so RN doesn't warn
        const cleanStyle = Object.fromEntries(
            Object.entries(viewStyle).filter(([, v]) => v !== undefined)
        ) as ViewStyle;

        return (
            <View ref={ref} style={[cleanStyle, style as ViewStyle]} {...rest}>
                {children}
            </View>
        );
    }
);

Box.displayName = 'Box';

export default Box;
