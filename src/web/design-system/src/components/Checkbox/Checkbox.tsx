import React, { forwardRef, useState, useCallback, useEffect } from 'react';

import { baseTheme } from '../../themes';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacingValues } from '../../tokens/spacing';

/**
 * Interface defining the props for the Checkbox component.
 */
export interface CheckboxProps {
    /**
     * The unique identifier for the checkbox.
     */
    id: string;

    /**
     * The name of the checkbox input.
     */
    name: string;

    /**
     * The value of the checkbox input.
     */
    value: string;

    /**
     * A boolean indicating whether the checkbox is checked.
     */
    checked?: boolean;

    /**
     * A boolean indicating whether the checkbox is disabled.
     */
    disabled?: boolean;

    /**
     * A callback function that is called when the checkbox value changes.
     */
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

    /**
     * The label text for the checkbox.
     */
    label: string;

    /**
     * Test identifier for the checkbox.
     */
    testID?: string;

    /**
     * Journey identifier for journey-specific styling.
     */
    journey?: 'health' | 'care' | 'plan';
}

/**
 * A custom Checkbox component with styling and accessibility features.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
    const { id, name, value, checked = false, disabled = false, onChange, label, testID, journey } = props;

    const theme = baseTheme;
    const [isChecked, setIsChecked] = useState(checked);

    // Update internal state when checked prop changes
    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    // Get journey-specific styling
    const getJourneyColor = (): string => {
        if (journey && theme.colors.journeys[journey]) {
            return theme.colors.journeys[journey].primary;
        }
        return theme.colors.brand.primary;
    };

    const selectedColor = getJourneyColor();

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!disabled) {
                setIsChecked(e.target.checked);
                onChange(e);
            }
        },
        [disabled, onChange]
    );

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
    };

    const inputStyle: React.CSSProperties = {
        width: spacingValues.md,
        height: spacingValues.md,
        borderRadius: borderRadiusValues.sm,
        border: `2px solid ${isChecked ? selectedColor : colors.neutral.gray500}`,
        marginRight: spacingValues.xs,
        WebkitAppearance: 'none',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: isChecked
            ? disabled
                ? colors.neutral.gray200
                : selectedColor
            : disabled
              ? colors.neutral.gray200
              : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    };

    const labelStyle: React.CSSProperties = {
        fontSize: 16,
        color: disabled ? colors.neutral.gray400 : colors.neutral.gray900,
        userSelect: 'none',
    };

    return (
        <label htmlFor={id} style={containerStyle} data-testid={testID || `checkbox-${id}`}>
            <div style={inputStyle}>
                {isChecked && (
                    <span
                        data-testid="checkbox-checkmark"
                        aria-hidden="true"
                        style={{
                            color: colors.neutral.white,
                            fontSize: 12,
                            lineHeight: 1,
                        }}
                    >
                        ✓
                    </span>
                )}
            </div>
            <input
                ref={ref}
                type="checkbox"
                id={id}
                name={name}
                value={value}
                checked={isChecked}
                disabled={disabled}
                onChange={handleChange}
                style={{
                    position: 'absolute',
                    opacity: 0,
                    width: 0,
                    height: 0,
                }}
                aria-hidden="true"
            />
            <span style={labelStyle}>{label}</span>
        </label>
    );
});

// Set display name for better debugging
Checkbox.displayName = 'Checkbox';
