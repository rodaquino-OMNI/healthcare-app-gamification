import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CheckboxProps } from './Checkbox';
import { colors } from '../../tokens/colors';

const spacingValues = { xs: 8, md: 16 };
const borderRadiusValues = { sm: 6 };

export const Checkbox = forwardRef<View, CheckboxProps>((props, ref) => {
    const { id, checked = false, disabled = false, onChange, label, testID, journey } = props;

    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const getJourneyColor = (): string => {
        if (journey && colors.journeys[journey]) {
            return colors.journeys[journey].primary;
        }
        return colors.brand.primary;
    };

    const selectedColor = getJourneyColor();

    const handlePress = useCallback(() => {
        if (disabled) {
            return;
        }
        const next = !isChecked;
        setIsChecked(next);
        onChange({ target: { checked: next } } as any);
    }, [disabled, isChecked, onChange]);

    const boxBg = isChecked
        ? disabled
            ? colors.neutral.gray200
            : selectedColor
        : disabled
          ? colors.neutral.gray200
          : 'transparent';

    const boxBorder = isChecked ? selectedColor : colors.neutral.gray500;

    return (
        <Pressable
            ref={ref}
            onPress={handlePress}
            disabled={disabled}
            style={[styles.container, disabled && styles.disabled]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked, disabled }}
            testID={testID || `checkbox-${id}`}
        >
            <View style={[styles.box, { backgroundColor: boxBg, borderColor: boxBorder }]}>
                {isChecked && (
                    <Text style={styles.check} testID="checkbox-checkmark">
                        ✓
                    </Text>
                )}
            </View>
            <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
        </Pressable>
    );
});

Checkbox.displayName = 'Checkbox';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    disabled: { opacity: 0.5 },
    box: {
        width: spacingValues.md,
        height: spacingValues.md,
        borderRadius: borderRadiusValues.sm,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.xs,
    },
    check: { color: colors.neutral.white, fontSize: 12, lineHeight: 14 },
    label: { fontSize: 16, color: colors.neutral.gray900 },
    labelDisabled: { color: colors.neutral.gray400 },
});
