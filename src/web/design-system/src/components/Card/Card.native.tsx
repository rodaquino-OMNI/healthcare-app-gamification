import React from 'react';
import { Pressable } from 'react-native';

import type { CardProps } from './Card';
import { Box } from '../../primitives/Box/Box.native';

/**
 * React Native Card component built on the Box primitive.
 * Supports journey theming, elevation shadow presets, and interactive press states.
 *
 * @example
 * <Card journey="health" elevation="md">
 *   <Text>Health content</Text>
 * </Card>
 *
 * @example
 * <Card onPress={() => navigate('Details')} elevated>
 *   <Text>Tap me</Text>
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
    testID,
    style,
    elevated = false,
    // shadow is intentionally unused — elevation/elevated are the RN API
    shadow: _shadow,
    borderColor: _borderColor,
    ...rest
}) => {
    const isInteractive = interactive || !!onPress;

    // `elevated` shorthand maps to 'md'; otherwise use the explicit elevation prop
    const resolvedElevation = elevated ? 'md' : elevation;

    const box = (
        <Box
            boxShadow={resolvedElevation}
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
            padding={padding !== undefined ? String(padding) : undefined}
            margin={margin !== undefined ? String(margin) : undefined}
            width={width}
            height={height}
            journey={journey}
            style={style}
            testID={isInteractive ? undefined : testID}
            {...rest}
        >
            {children}
        </Box>
    );

    if (isInteractive) {
        return (
            <Pressable
                onPress={onPress}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                testID={testID}
                style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}
            >
                {box}
            </Pressable>
        );
    }

    return box;
};

export type { CardProps };

export default Card;
