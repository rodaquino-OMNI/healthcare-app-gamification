import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { CardProps } from './Card';
import { colors } from '../../tokens/colors';
import { nativeShadow, parsePx } from '../../utils/native-shadows';

const spacingValues: Record<string, number> = {
    '4xs': 2,
    '3xs': 4,
    '2xs': 6,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
};
const borderRadiusValues: Record<string, number> = {
    none: 0,
    xs: 4,
    sm: 6,
    md: 8,
    lg: 16,
    xl: 24,
    '2xl': 20,
    full: 9999,
};

function resolveToken(value: string | number | undefined, map: Record<string, number>, fallback: number): number {
    if (value === undefined) {
        return fallback;
    }
    if (typeof value === 'number') {
        return value;
    }
    if (map[value] !== undefined) {
        return map[value];
    }
    return parsePx(value);
}

export const Card: React.FC<CardProps> = ({
    children,
    onPress,
    elevation = 'sm',
    journey,
    interactive: _interactive = false,
    backgroundColor,
    borderRadius = 'md',
    padding = 'md',
    margin,
    width,
    height,
    accessibilityLabel,
    elevated = false,
    testID,
    style,
    ...rest
}) => {
    const resolvedElevation = elevated ? 'md' : elevation;
    const bg = backgroundColor || (journey ? colors.journeys[journey].background : colors.neutral.white);
    const br = resolveToken(borderRadius, borderRadiusValues, borderRadiusValues.md);
    const pad = resolveToken(padding, spacingValues, spacingValues.md);
    const mar = margin !== undefined ? resolveToken(margin, spacingValues, 0) : undefined;

    const cardStyle = [
        styles.base,
        { backgroundColor: bg, borderRadius: br, padding: pad },
        mar !== undefined ? { margin: mar } : undefined,
        width ? { width: parsePx(width) } : undefined,
        height ? { height: parsePx(height) } : undefined,
        nativeShadow(resolvedElevation),
        style,
    ];

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                testID={testID}
                style={cardStyle}
                {...rest}
            >
                {children}
            </Pressable>
        );
    }

    return (
        <View accessibilityLabel={accessibilityLabel} testID={testID} style={cardStyle} {...rest}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: { flexDirection: 'column' },
});
