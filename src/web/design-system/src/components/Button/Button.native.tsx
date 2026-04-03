import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ButtonProps } from './Button';
import { Icon } from '../../primitives/Icon/Icon';
import { colors } from '../../tokens/colors';
import { nativeShadow } from '../../utils/native-shadows';

const spacingValues = { '4xs': 2, '3xs': 4, '2xs': 6, xs: 8, sm: 12, md: 16, lg: 20, xl: 24 };
const borderRadiusValues = { none: 0, xs: 4, sm: 6, md: 8, lg: 16, xl: 24, full: 9999 };
const iconSizeMap = { sm: 16, md: 20, lg: 24 } as const;
const paddingMap = {
    sm: { paddingVertical: spacingValues.xs, paddingHorizontal: spacingValues.sm },
    md: { paddingVertical: spacingValues.sm, paddingHorizontal: spacingValues.md },
    lg: { paddingVertical: spacingValues.md, paddingHorizontal: spacingValues.lg },
} as const;

const variantToHierarchy: Record<string, 'primary' | 'secondary' | 'noFill'> = {
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'noFill',
};

function resolveColors(
    color: ButtonProps['color'],
    hierarchy: 'primary' | 'secondary' | 'noFill',
    variant: string,
    journey: 'health' | 'care' | 'plan'
): { bg: string; text: string; border: string | undefined } {
    if (color) {
        const base = colors.componentColors[color];
        if (hierarchy === 'primary') {
            return { bg: base, text: colors.neutral.white, border: undefined };
        }
        if (hierarchy === 'secondary') {
            return { bg: `${base}1A`, text: base, border: base };
        }
        return { bg: 'transparent', text: base, border: undefined };
    }
    const jp = colors.journeys[journey].primary;
    if (variant === 'secondary') {
        return { bg: colors.neutral.white, text: jp, border: jp };
    }
    if (variant === 'tertiary') {
        return { bg: 'transparent', text: jp, border: undefined };
    }
    return { bg: jp, text: colors.neutral.white, border: undefined };
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    onPress,
    accessibilityLabel,
    children,
    journey = 'health',
    color,
    hierarchy,
    testID,
    style,
    ...rest
}) => {
    const h = hierarchy || variantToHierarchy[variant] || 'primary';
    const { bg, text, border } = resolveColors(color, h, variant, journey);
    const pad = paddingMap[size] || paddingMap.md;
    const hasContent = React.Children.count(children) > 0;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
            accessibilityRole="button"
            testID={testID ?? 'button'}
            style={[
                styles.base,
                pad,
                { backgroundColor: bg, borderRadius: borderRadiusValues.md },
                border ? { borderWidth: 1, borderColor: border } : undefined,
                nativeShadow('md'),
                disabled ? styles.disabled : undefined,
                style,
            ]}
            {...rest}
        >
            {loading ? (
                <ActivityIndicator size="small" color={text} />
            ) : (
                <>
                    {icon && <Icon name={icon} size={iconSizeMap[size] || 20} color={text} />}
                    {icon && hasContent && <View style={{ width: spacingValues.sm }} />}
                    {hasContent && <Text style={[styles.label, { color: text }]}>{children}</Text>}
                </>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    disabled: { opacity: 0.5 },
    label: { fontWeight: '500', fontSize: 16 },
});
