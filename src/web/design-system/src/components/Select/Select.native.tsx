import React, { useState, useCallback, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';

import type { SelectProps } from './Select';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Input } from '../../components/Input/Input';
import { Modal } from '../../components/Modal/Modal';
import { RadioButton } from '../../components/RadioButton/RadioButton';
import { Box } from '../../primitives/Box/Box';
import { Text } from '../../primitives/Text/Text';
import { Touchable } from '../../primitives/Touchable/Touchable';
import { tokens } from '../../tokens';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacingValues } from '../../tokens/spacing';

export const Select = forwardRef<View, SelectProps>((props, ref) => {
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
    const inputRef = useRef<View | null>(null);
    useImperativeHandle(ref, () => inputRef.current as View);
    useEffect(() => {
        if (!isOpen) {
            setSearchText('');
        }
    }, [isOpen]);

    const handleChange = useCallback(
        (sel: string) => {
            if (multiple) {
                const cur = Array.isArray(value) ? value : [];
                onChange(cur.includes(sel) ? cur.filter((v) => v !== sel) : [...cur, sel]);
            } else {
                onChange(sel);
                setIsOpen(false);
            }
        },
        [multiple, onChange, value]
    );

    const handleToggle = useCallback(() => {
        if (!disabled) {
            setIsOpen((p) => !p);
        }
    }, [disabled]);

    const filtered =
        searchable && searchText
            ? options.filter((o) => o.label.toLowerCase().includes(searchText.toLowerCase()))
            : options;

    const getDisplayValue = (): string => {
        if (multiple) {
            const sel = Array.isArray(value) ? value : [];
            if (sel.length === 0) {
                return placeholder;
            }
            if (sel.length === 1) {
                return options.find((o) => o.value === sel[0])?.label ?? placeholder;
            }
            return `${sel.length} selected`;
        }
        return options.find((o) => o.value === value)?.label ?? placeholder;
    };

    const jColor = journey ? tokens.colors.journeys[journey]?.primary : tokens.colors.brand.primary;

    return (
        <Box style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Touchable
                onPress={handleToggle}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={`${label}, ${getDisplayValue()}`}
                accessibilityState={{ expanded: isOpen, disabled }}
                ref={inputRef}
                style={{
                    ...styles.touchable,
                    ...(disabled ? { opacity: 0.5 } : {}),
                    ...(journey ? { borderColor: jColor } : {}),
                }}
                testID={testID || 'select-component'}
                journey={journey}
            >
                <Text style={styles.text}>{getDisplayValue()}</Text>
                <Box style={styles.icon}>
                    <Text>▼</Text>
                </Box>
            </Touchable>
            <Modal visible={isOpen} onClose={() => setIsOpen(false)} title={label} journey={journey}>
                <Box>
                    {searchable && (
                        <Box style={{ marginBottom: spacingValues.md }}>
                            <Input
                                value={searchText}
                                onChangeText={setSearchText}
                                placeholder="Search options..."
                                journey={journey}
                                testID="select-search-input"
                            />
                        </Box>
                    )}
                    {filtered.length > 0 ? (
                        filtered.map((o) => (
                            <Box key={o.value} style={styles.option}>
                                {multiple ? (
                                    <Checkbox
                                        id={`select-option-${o.value}`}
                                        name={`select-${label}`}
                                        value={o.value}
                                        checked={Array.isArray(value) && value.includes(o.value)}
                                        onChange={() => handleChange(o.value)}
                                        label={o.label}
                                        journey={journey}
                                        testID={`select-checkbox-${o.value}`}
                                    />
                                ) : (
                                    <RadioButton
                                        id={`select-option-${o.value}`}
                                        name={`select-${label}`}
                                        value={o.value}
                                        checked={value === o.value}
                                        onChange={() => handleChange(o.value)}
                                        label={o.label}
                                        journey={journey}
                                        testID={`select-radio-${o.value}`}
                                    />
                                )}
                            </Box>
                        ))
                    ) : (
                        <Text>No options found</Text>
                    )}
                </Box>
            </Modal>
        </Box>
    );
});

Select.displayName = 'Select';

const styles = StyleSheet.create({
    container: { flexDirection: 'column', marginBottom: spacingValues.md },
    label: { fontSize: 16, color: colors.neutral.gray900, marginBottom: spacingValues.xs },
    touchable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.md,
        borderRadius: borderRadiusValues.xs,
        borderWidth: 1,
        borderColor: colors.neutral.gray500,
    },
    text: { fontSize: 16, color: colors.neutral.gray900 },
    icon: { marginLeft: spacingValues.xs },
    option: {
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.gray300,
    },
});
