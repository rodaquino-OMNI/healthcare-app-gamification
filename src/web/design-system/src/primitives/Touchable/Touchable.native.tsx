import React, { forwardRef } from 'react';
import { Pressable, View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';

import type { TouchableProps } from './Touchable';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';

export const Touchable = forwardRef<View, TouchableProps>((props, ref) => {
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
        borderRadius,
        accessibilityLabel,
        accessibilityHint,
        accessibilityRole,
        accessible,
        accessibilityState,
        ...rest
    } = props;

    const journeyStyle: ViewStyle = journey ? { borderColor: colors.journeys[journey].primary } : {};

    const radiusStyle: ViewStyle = borderRadius ? { borderRadius: borderRadiusValues[borderRadius] } : {};

    const baseStyle: ViewStyle = {
        ...journeyStyle,
        ...radiusStyle,
        ...(fullWidth ? { alignSelf: 'stretch' } : {}),
        ...(disabled ? { opacity: 0.5 } : {}),
    };

    const flatStyle = style ? StyleSheet.flatten(style as StyleProp<ViewStyle>) : {};

    return (
        <Pressable
            ref={ref}
            onPress={onPress as (event: any) => void}
            onLongPress={onLongPress as ((event: any) => void) | undefined}
            disabled={disabled}
            testID={testID}
            accessible={accessible}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityRole={accessibilityRole as any}
            accessibilityState={{
                disabled: accessibilityState?.disabled ?? disabled,
                checked: accessibilityState?.checked,
                expanded: accessibilityState?.expanded,
                selected: accessibilityState?.selected,
            }}
            style={({ pressed }) => [baseStyle, flatStyle, pressed && { opacity: activeOpacity }]}
            {...rest}
        >
            {children}
        </Pressable>
    );
});

Touchable.displayName = 'Touchable';
