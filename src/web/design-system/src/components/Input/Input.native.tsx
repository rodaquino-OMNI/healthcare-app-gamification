import React, { useState } from 'react';
import { View, TextInput, StyleSheet, type ViewStyle, type TextStyle, type TextInputProps } from 'react-native';

import { Text } from '../../primitives/Text/Text.native';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacingValues } from '../../tokens/spacing';
import { fontFamilyByWeight } from '../../tokens/typography';

type Journey = 'health' | 'care' | 'plan';

export interface InputNativeProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    journey?: Journey;
    testID?: string;
    accessibilityLabel?: string;
    error?: string;
    helperText?: string;
    secureTextEntry?: boolean;
    multiline?: boolean;
    keyboardType?: TextInputProps['keyboardType'];
    autoCapitalize?: TextInputProps['autoCapitalize'];
    autoCorrect?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

/**
 * Input component (React Native).
 * Native implementation of the design system Input, using TextInput
 * with focus/error/disabled states and token-based styling.
 *
 * @example
 * <Input
 *   value={email}
 *   onChangeText={setEmail}
 *   placeholder="Enter your email"
 *   label="Email"
 *   journey="health"
 * />
 */
export const Input: React.FC<InputNativeProps> = ({
    value,
    onChangeText,
    placeholder,
    disabled = false,
    label,
    journey: _journey,
    testID,
    accessibilityLabel,
    error,
    helperText,
    secureTextEntry,
    multiline,
    keyboardType,
    autoCapitalize,
    autoCorrect,
    onBlur,
    onFocus,
    style,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (): void => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = (): void => {
        setIsFocused(false);
        onBlur?.();
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const inputBorderColor = (() => {
        if (error) {
            return colors.semantic.error;
        }
        if (isFocused) {
            return colors.brand.primary;
        }
        return colors.neutral.gray300;
    })();

    const inputStyle: TextStyle[] = [
        styles.input,
        { borderColor: inputBorderColor },
        disabled ? styles.inputDisabled : null,
        multiline ? styles.inputMultiline : null,
        style,
    ].filter(Boolean) as TextStyle[];

    return (
        <View style={styles.container}>
            {label !== null && label !== undefined && (
                <Text fontSize={16} fontWeight="medium" color={colors.neutral.gray700} style={styles.label}>
                    {label}
                </Text>
            )}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.neutral.gray500}
                editable={!disabled}
                secureTextEntry={secureTextEntry}
                multiline={multiline}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={inputStyle}
                testID={testID}
                accessibilityLabel={accessibilityLabel ?? label}
                accessibilityState={{ disabled }}
                {...rest}
            />
            {error !== null && error !== undefined && error.length > 0 && (
                <Text fontSize={12} color={colors.semantic.error} style={styles.subText} accessibilityRole="alert">
                    {error}
                </Text>
            )}
            {(error === null || error === undefined || error.length === 0) &&
                helperText !== null &&
                helperText !== undefined &&
                helperText.length > 0 && (
                    <Text fontSize={12} color={colors.gray[50]} style={styles.subText}>
                        {helperText}
                    </Text>
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginBottom: spacingValues.sm,
        width: '100%',
    } as ViewStyle,
    label: {
        marginBottom: spacingValues.xs,
    } as TextStyle,
    input: {
        padding: spacingValues.sm,
        fontSize: 16,
        borderRadius: borderRadiusValues.sm,
        borderWidth: 1,
        color: colors.neutral.gray700,
        fontFamily: fontFamilyByWeight[400],
        width: '100%',
    } as TextStyle,
    inputDisabled: {
        backgroundColor: colors.neutral.gray100,
        opacity: 0.6,
    } as TextStyle,
    inputMultiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    } as TextStyle,
    subText: {
        marginTop: spacingValues['3xs'],
    } as TextStyle,
});

export default Input;
