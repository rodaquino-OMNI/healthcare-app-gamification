import React, { useState, useCallback, forwardRef } from 'react';
import { View, Modal as RNModal, FlatList, TextInput, Pressable, StyleSheet } from 'react-native';

import { Icon } from '../../primitives/Icon/Icon.native';
import { Text } from '../../primitives/Text/Text.native';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacingValues } from '../../tokens/spacing';
import { Checkbox } from '../Checkbox/Checkbox.native';

export interface SelectProps {
    options: Array<{ label: string; value: string }>;
    value: string | string[];
    onChange: (value: string | string[]) => void;
    label: string;
    multiple?: boolean;
    searchable?: boolean;
    placeholder?: string;
    disabled?: boolean;
    testID?: string;
    journey?: 'health' | 'care' | 'plan';
}

const Select = forwardRef<View, SelectProps>((props, ref) => {
    const {
        options,
        value,
        onChange,
        label,
        multiple = false,
        searchable = false,
        placeholder = 'Select an option',
        disabled = false,
        testID,
        journey,
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');

    const journeyColor = journey && colors.journeys[journey] ? colors.journeys[journey].primary : colors.brand.primary;

    const handleToggle = useCallback(() => {
        if (!disabled) {
            setIsOpen((prev) => !prev);
        }
    }, [disabled]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setSearchText('');
    }, []);

    const handleChange = useCallback(
        (selectedValue: string) => {
            if (multiple) {
                const currentValues = Array.isArray(value) ? value : [];
                const newValues = currentValues.includes(selectedValue)
                    ? currentValues.filter((v) => v !== selectedValue)
                    : [...currentValues, selectedValue];
                onChange(newValues);
            } else {
                onChange(selectedValue);
                handleClose();
            }
        },
        [multiple, onChange, value, handleClose]
    );

    const filteredOptions =
        searchable && searchText
            ? options.filter((option) => option.label.toLowerCase().includes(searchText.toLowerCase()))
            : options;

    const getDisplayValue = (): string => {
        if (multiple) {
            const selectedValues = Array.isArray(value) ? value : [];
            if (selectedValues.length === 0) {
                return placeholder;
            }
            if (selectedValues.length === 1) {
                const found = options.find((opt) => opt.value === selectedValues[0]);
                return found ? found.label : placeholder;
            }
            return `${selectedValues.length} selected`;
        }
        const found = options.find((opt) => opt.value === value);
        return found ? found.label : placeholder;
    };

    const triggerBorderColor = journey ? journeyColor : colors.neutral.gray500;

    return (
        <View style={styles.container} ref={ref}>
            <Text style={styles.label}>{label}</Text>

            <Pressable
                onPress={handleToggle}
                style={[styles.trigger, { borderColor: triggerBorderColor }, disabled && styles.disabled]}
                accessibilityRole="button"
                accessibilityLabel={`${label}, ${getDisplayValue()}`}
                accessibilityState={{ expanded: isOpen, disabled }}
                testID={testID ?? 'select-component'}
            >
                <Text style={styles.triggerText}>{getDisplayValue()}</Text>
                <Icon name="chevron-down" size={16} color={colors.neutral.gray500} />
            </Pressable>

            <RNModal visible={isOpen} transparent animationType="slide" onRequestClose={handleClose}>
                <Pressable style={styles.overlay} onPress={handleClose}>
                    <Pressable style={styles.sheet} onPress={() => undefined}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{label}</Text>
                            <Pressable onPress={handleClose} accessibilityLabel="Close">
                                <Icon name="close-x" size={20} color={colors.neutral.gray900} />
                            </Pressable>
                        </View>

                        {/* Search */}
                        {searchable && (
                            <TextInput
                                value={searchText}
                                onChangeText={setSearchText}
                                placeholder="Search options..."
                                style={styles.searchInput}
                                testID="select-search-input"
                            />
                        )}

                        {/* Options */}
                        {filteredOptions.length > 0 ? (
                            <FlatList
                                data={filteredOptions}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) =>
                                    multiple ? (
                                        <View style={styles.option}>
                                            <Checkbox
                                                id={`select-option-${item.value}`}
                                                name={`select-${label}`}
                                                value={item.value}
                                                checked={Array.isArray(value) && value.includes(item.value)}
                                                onChange={() => handleChange(item.value)}
                                                label={item.label}
                                                journey={journey}
                                                testID={`select-checkbox-${item.value}`}
                                            />
                                        </View>
                                    ) : (
                                        <Pressable
                                            style={styles.option}
                                            onPress={() => handleChange(item.value)}
                                            testID={`select-option-${item.value}`}
                                        >
                                            <Text style={styles.optionText}>{item.label}</Text>
                                            {value === item.value && (
                                                <Icon name="check-single" size={16} color={journeyColor} />
                                            )}
                                        </Pressable>
                                    )
                                }
                            />
                        ) : (
                            <Text style={styles.emptyText}>No options found</Text>
                        )}
                    </Pressable>
                </Pressable>
            </RNModal>
        </View>
    );
});

Select.displayName = 'Select';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginBottom: spacingValues.md,
    },
    label: {
        fontSize: 16,
        color: colors.neutral.gray900,
        marginBottom: spacingValues.xs,
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.md,
        borderRadius: borderRadiusValues.xs,
        borderWidth: 1,
    },
    triggerText: {
        fontSize: 16,
        color: colors.neutral.gray900,
        flex: 1,
    },
    disabled: {
        opacity: 0.5,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: colors.neutral.white,
        borderTopLeftRadius: borderRadiusValues.xl,
        borderTopRightRadius: borderRadiusValues.xl,
        maxHeight: '70%',
        padding: spacingValues.md,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacingValues.sm,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.neutral.gray900,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: colors.neutral.gray300,
        borderRadius: borderRadiusValues.xs,
        padding: spacingValues.xs,
        marginBottom: spacingValues.sm,
        fontSize: 16,
        color: colors.neutral.gray900,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.gray300,
    },
    optionText: {
        fontSize: 16,
        color: colors.neutral.gray900,
        flex: 1,
    },
    emptyText: {
        fontSize: 16,
        color: colors.neutral.gray500,
        textAlign: 'center',
        paddingVertical: spacingValues.md,
    },
});

export { Select };
export default Select;
