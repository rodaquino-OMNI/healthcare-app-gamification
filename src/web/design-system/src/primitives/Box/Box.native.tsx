import React from 'react';
import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';

import type { BoxProps } from './Box';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { sizingValues } from '../../tokens/sizing';
import { spacingValues } from '../../tokens/spacing';
import { nativeShadow } from '../../utils/native-shadows';

type SpacingKey = keyof typeof spacingValues;
type RadiusKey = keyof typeof borderRadiusValues;
type ShadowKey = 'sm' | 'md' | 'lg' | 'xl';
const resolveSpacing = (value: string | undefined): number | undefined => {
    if (!value) {
        return undefined;
    }
    return (spacingValues[value as SpacingKey] ?? parseInt(value, 10)) || undefined;
};

const resolveRadius = (value: string | undefined): number | undefined => {
    if (!value) {
        return undefined;
    }
    return (borderRadiusValues[value as RadiusKey] ?? parseInt(value, 10)) || undefined;
};

export const Box = React.forwardRef<View, BoxProps & { testID?: string; style?: StyleProp<ViewStyle> }>(
    (
        {
            journey,
            backgroundColor,
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
            children,
            testID,
            style,
            ...rest
        },
        ref
    ) => {
        let bgColor = backgroundColor;
        if (journey && !backgroundColor) {
            bgColor = colors.journeys[journey].background;
        }

        const viewStyle: ViewStyle = {
            ...(bgColor ? { backgroundColor: bgColor } : {}),
            ...(resolveSpacing(padding) !== null ? { padding: resolveSpacing(padding) } : {}),
            ...(resolveSpacing(paddingTop) !== null ? { paddingTop: resolveSpacing(paddingTop) } : {}),
            ...(resolveSpacing(paddingRight) !== null ? { paddingRight: resolveSpacing(paddingRight) } : {}),
            ...(resolveSpacing(paddingBottom) !== null ? { paddingBottom: resolveSpacing(paddingBottom) } : {}),
            ...(resolveSpacing(paddingLeft) !== null ? { paddingLeft: resolveSpacing(paddingLeft) } : {}),
            ...(resolveSpacing(margin) !== null ? { margin: resolveSpacing(margin) } : {}),
            ...(resolveSpacing(marginTop) !== null ? { marginTop: resolveSpacing(marginTop) } : {}),
            ...(resolveSpacing(marginRight) !== null ? { marginRight: resolveSpacing(marginRight) } : {}),
            ...(resolveSpacing(marginBottom) !== null ? { marginBottom: resolveSpacing(marginBottom) } : {}),
            ...(resolveSpacing(marginLeft) !== null ? { marginLeft: resolveSpacing(marginLeft) } : {}),
            ...(resolveRadius(borderRadius) !== null ? { borderRadius: resolveRadius(borderRadius) } : {}),
            ...(size
                ? {
                      width: sizingValues.component[size],
                      height: sizingValues.component[size],
                  }
                : {}),
            ...(boxShadow ? nativeShadow(boxShadow as ShadowKey) : {}),
        };

        const flatStyle = style ? StyleSheet.flatten(style as StyleProp<ViewStyle>) : {};

        return (
            <View ref={ref} testID={testID} style={[viewStyle, flatStyle]} {...rest}>
                {children}
            </View>
        );
    }
);

Box.displayName = 'Box';
