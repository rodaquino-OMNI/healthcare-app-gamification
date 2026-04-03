import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import type { InputProps } from './Input';
import { colors } from '../../tokens/colors';

const spacingValues = { '3xs': 4, '2xs': 6, xs: 8, sm: 12, md: 16 };
const borderRadiusValues = { xs: 4 };

const typeToKeyboard: Record<string, { keyboardType?: string; secureTextEntry?: boolean }> = {
    email: { keyboardType: 'email-address' },
    number: { keyboardType: 'numeric' },
    tel: { keyboardType: 'phone-pad' },
    password: { secureTextEntry: true },
};

export const Input: React.FC<InputProps> = ({
    value,
    onChange,
    onChangeText,
    placeholder,
    type = 'text',
    disabled = false,
    label,
    journey,
    testID,
    error,
    helperText,
    onBlur,
    style,
    ...rest
}) => {
    const [focused, setFocused] = useState(false);
    const keyboardConfig = typeToKeyboard[type] || {};

    const handleChangeText = (text: string): void => {
        if (onChangeText) {
            onChangeText(text);
        } else if (onChange) {
            (onChange as (...args: any[]) => void)(text);
        }
    };

    const borderColor = error
        ? colors.semantic.error
        : focused && journey
          ? colors.journeys[journey].primary
          : colors.neutral.gray500;

    return (
        <View style={[styles.container, style]}>
            {label && (
                <Text style={styles.label} accessibilityRole="text">
                    {label}
                </Text>
            )}
            <TextInput
                value={value}
                onChangeText={handleChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.neutral.gray500}
                editable={!disabled}
                secureTextEntry={keyboardConfig.secureTextEntry}
                keyboardType={keyboardConfig.keyboardType as any}
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                    setFocused(false);
                    onBlur?.(e);
                }}
                testID={testID}
                accessibilityLabel={rest['aria-label'] || label}
                style={[styles.input, { borderColor }, disabled && styles.disabled]}
                {...rest}
            />
            {error && (
                <Text style={styles.error} accessibilityRole="alert">
                    {error}
                </Text>
            )}
            {!error && helperText && <Text style={styles.helper}>{helperText}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%' },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.neutral.gray700,
        marginBottom: spacingValues['3xs'],
    },
    input: {
        borderWidth: 1,
        borderRadius: borderRadiusValues.xs,
        padding: spacingValues.sm,
        fontSize: 16,
        color: colors.neutral.gray800,
        backgroundColor: colors.neutral.white,
    },
    disabled: { opacity: 0.5, backgroundColor: colors.neutral.gray200 },
    error: {
        color: colors.semantic.error,
        fontSize: 12,
        marginTop: spacingValues['3xs'],
    },
    helper: {
        color: colors.gray[50],
        fontSize: 12,
        marginTop: spacingValues['3xs'],
    },
});

export default Input;
