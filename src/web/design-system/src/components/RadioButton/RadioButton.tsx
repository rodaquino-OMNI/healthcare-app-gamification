import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { baseTheme } from '../../themes';
import { colors } from '../../tokens/colors';
import { spacingValues } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';
import { borderRadiusValues } from '../../tokens/borderRadius';

/**
 * Interface defining the props for the RadioButton component.
 */
export interface RadioButtonProps {
  /**
   * The unique identifier for the RadioButton.
   */
  id: string;

  /**
   * The name of the RadioButton input.
   */
  name: string;

  /**
   * The value of the RadioButton input.
   */
  value: string;

  /**
   * A boolean indicating whether the RadioButton is checked.
   */
  checked?: boolean;

  /**
   * A boolean indicating whether the RadioButton is disabled.
   */
  disabled?: boolean;

  /**
   * A callback function that is called when the RadioButton value changes.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * The label text for the RadioButton.
   */
  label: string;

  /**
   * Test identifier for the RadioButton.
   */
  testID?: string;

  /**
   * Journey identifier for journey-specific theming.
   */
  journey?: 'health' | 'care' | 'plan';
}

/**
 * A custom RadioButton component with styling and accessibility features,
 * designed to be consistent with the AUSTA SuperApp's design system.
 */
export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>((props, ref) => {
  const {
    id,
    name,
    value,
    checked = false,
    disabled = false,
    onChange,
    label,
    testID,
    journey,
  } = props;

  const theme = baseTheme;
  const inputRef = useRef<HTMLInputElement>(null);

  // Forward ref — expose focus method
  useImperativeHandle(ref, () => inputRef.current!);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e);
    }
  }, [disabled, onChange]);

  // Get the appropriate color based on journey
  const getJourneyColor = () => {
    if (journey && theme.colors.journeys[journey]) {
      return theme.colors.journeys[journey].primary;
    }
    return theme.colors.brand.primary;
  };

  const accentColor = getJourneyColor();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  const inputStyle: React.CSSProperties = {
    width: spacingValues.lg,
    height: spacingValues.lg,
    borderRadius: borderRadiusValues.full,
    border: `2px solid ${checked ? (disabled ? colors.neutral.gray400 : accentColor) : colors.neutral.gray500}`,
    marginRight: spacingValues.xs,
    WebkitAppearance: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: checked
      ? (disabled ? colors.neutral.gray200 : accentColor)
      : disabled ? colors.neutral.gray200 : 'transparent',
    flexShrink: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: typeof typography.fontSize.md === 'string'
      ? parseInt(typography.fontSize.md, 10) || 16
      : 16,
    color: disabled ? colors.neutral.gray500 : colors.neutral.gray900,
    userSelect: 'none',
  };

  return (
    <label
      htmlFor={id}
      style={containerStyle}
      data-testid={testID}
    >
      <input
        ref={inputRef}
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
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
      <div style={inputStyle} />
      <span style={labelStyle}>{label}</span>
    </label>
  );
});

RadioButton.displayName = 'RadioButton';
