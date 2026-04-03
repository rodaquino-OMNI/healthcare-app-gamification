import React, { forwardRef, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RadioButtonProps } from './RadioButton';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacingValues } from '../../tokens/spacing';

export const RadioButton = forwardRef<View, RadioButtonProps>((props, ref) => {
    const {
        id: _id,
        name: _name,
        value: _value,
        checked = false,
        disabled = false,
        onChange,
        label,
        testID,
        journey,
    } = props;

    const accentColor = journey ? colors.journeys[journey].primary : colors.brand.primary;

    const handlePress = useCallback(() => {
        if (!disabled) {
            onChange({ target: { checked: true } } as any);
        }
    }, [disabled, onChange]);

    return (
        <Pressable
            ref={ref}
            onPress={handlePress}
            disabled={disabled}
            style={[styles.container, disabled && styles.disabled]}
            testID={testID}
            accessibilityRole="radio"
            accessibilityState={{ checked, disabled }}
        >
            <View
                style={[
                    styles.radio,
                    {
                        borderColor: checked
                            ? disabled
                                ? colors.neutral.gray400
                                : accentColor
                            : colors.neutral.gray500,
                        backgroundColor: checked
                            ? disabled
                                ? colors.neutral.gray200
                                : accentColor
                            : disabled
                              ? colors.neutral.gray200
                              : 'transparent',
                    },
                ]}
            >
                {checked && <View style={styles.dot} />}
            </View>
            <Text style={[styles.label, { color: disabled ? colors.neutral.gray500 : colors.neutral.gray900 }]}>
                {label}
            </Text>
        </Pressable>
    );
});

RadioButton.displayName = 'RadioButton';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    disabled: { opacity: 0.5 },
    radio: {
        width: spacingValues.lg,
        height: spacingValues.lg,
        borderRadius: borderRadiusValues.full,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.xs,
    },
    dot: {
        width: spacingValues.xs,
        height: spacingValues.xs,
        borderRadius: borderRadiusValues.full,
        backgroundColor: colors.neutral.white,
    },
    label: { fontSize: 16 },
});
