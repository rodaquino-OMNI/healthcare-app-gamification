import React, { useState, useEffect } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';

import { Icon } from '../../primitives/Icon/Icon.native';
import { Text } from '../../primitives/Text/Text.native';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacingValues } from '../../tokens/spacing';

export interface CheckboxProps {
    id: string;
    name: string;
    value: string;
    checked?: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    testID?: string;
    journey?: 'health' | 'care' | 'plan';
}

const Checkbox: React.FC<CheckboxProps> = ({
    id,
    checked,
    disabled = false,
    onChange,
    label,
    testID,
    journey,
}): React.ReactElement => {
    const [isChecked, setIsChecked] = useState(checked ?? false);

    useEffect(() => {
        setIsChecked(checked ?? false);
    }, [checked]);

    const journeyColor = journey && colors.journeys[journey] ? colors.journeys[journey].primary : colors.brand.primary;

    const handlePress = (): void => {
        if (disabled) {
            return;
        }
        const next = !isChecked;
        setIsChecked(next);
        onChange(next);
    };

    const boxBorderColor = isChecked ? (disabled ? colors.neutral.gray200 : journeyColor) : colors.neutral.gray500;

    const boxBackgroundColor = isChecked ? (disabled ? colors.neutral.gray200 : journeyColor) : 'transparent';

    return (
        <Pressable
            onPress={handlePress}
            style={[styles.container, disabled && styles.disabled]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked, disabled }}
            testID={testID ?? `checkbox-${id}`}
        >
            <View
                style={[
                    styles.box,
                    {
                        borderColor: boxBorderColor,
                        backgroundColor: boxBackgroundColor,
                    },
                ]}
            >
                {isChecked && <Icon name="check-single" size={16} color={colors.neutral.white} />}
            </View>
            <Text style={[styles.label, { color: disabled ? colors.neutral.gray400 : colors.neutral.gray900 }]}>
                {label}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
    box: {
        width: 24,
        height: 24,
        borderRadius: borderRadiusValues.sm,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        marginLeft: spacingValues.xs,
    },
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
export default Checkbox;
