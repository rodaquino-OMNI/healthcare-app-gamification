import React, { forwardRef, useCallback } from 'react';
import { Pressable, type PressableProps, type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

import type { TouchableProps } from './Touchable';
import { borderRadius as borderRadiusTokens } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';

/**
 * Native implementation of the Touchable primitive using Pressable.
 * Provides press feedback via opacity and optional haptic feedback.
 */
export const Touchable = forwardRef<View, TouchableProps>((props, ref) => {
    const {
        onPress,
        onLongPress,
        disabled = false,
        activeOpacity = 0.7,
        testID,
        journey,
        children,
        style,
        fullWidth = false,
        borderRadius,
        accessibilityLabel,
        accessibilityHint,
        accessibilityState,
        ...rest
    } = props;

    const journeyStyle: ViewStyle = journey ? { borderColor: colors.journeys[journey].primary } : {};

    const borderRadiusStyle: ViewStyle = borderRadius
        ? { borderRadius: borderRadiusTokens[borderRadius] as unknown as number }
        : {};

    const baseStyle = StyleSheet.flatten([
        styles.base,
        fullWidth && styles.fullWidth,
        journeyStyle,
        borderRadiusStyle,
        style as StyleProp<ViewStyle>,
    ]);

    const handlePress = useCallback(() => {
        if (onPress) {
            onPress(undefined as never);
        }
    }, [onPress]);

    const handleLongPress = useCallback(() => {
        if (onLongPress) {
            onLongPress(undefined as never);
        }
    }, [onLongPress]);

    return (
        <Pressable
            ref={ref}
            onPress={handlePress}
            onLongPress={onLongPress ? handleLongPress : undefined}
            disabled={disabled}
            testID={testID}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityState={{
                disabled,
                ...accessibilityState,
            }}
            style={({ pressed }: { pressed: boolean }) => [
                baseStyle,
                disabled && styles.disabled,
                pressed && !disabled && { opacity: activeOpacity },
            ]}
            {...(rest as Omit<PressableProps, keyof typeof rest>)}
        >
            {children}
        </Pressable>
    );
});

Touchable.displayName = 'Touchable';

const styles = StyleSheet.create({
    base: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
});

export default Touchable;
