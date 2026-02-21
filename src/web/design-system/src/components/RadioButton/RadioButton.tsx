import React, { forwardRef, useCallback, useState, useImperativeHandle } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Text } from '../../primitives/Text/Text';
import { Touchable } from '../../primitives/Touchable/Touchable';
import { useTheme } from '../../themes';
import { colors } from '../../tokens/colors';
import { spacing, spacingValues } from '../../tokens/spacing';
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
  onChange: (event: any) => void;
  
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
 * It supports different sizes, and theming based on the selected journey.
 */
export const RadioButton = forwardRef<any, RadioButtonProps>((props, ref) => {
  const {
    id,
    name,
    value,
    checked = false,
    disabled = false,
    onChange,
    label,
    testID,
    journey
  } = props;
  
  const theme = useTheme();
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Define the ref API
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }));
  
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

  return (
    <Touchable
      accessible={true}
      accessibilityRole="radio"
      accessibilityState={{ 
        checked: checked,
        disabled: disabled
      }}
      accessibilityLabel={label}
      onPress={() => {
        if (!disabled && inputRef.current) {
          inputRef.current.click();
        }
      }}
      disabled={disabled}
      testID={testID}
      style={styles.container}
    >
      {Platform.OS === 'web' && (
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
            width: spacingValues.lg,
            height: spacingValues.lg,
            borderRadius: borderRadiusValues.full,
            borderWidth: 2,
            borderColor: checked
              ? (disabled ? colors.neutral.gray400 : accentColor)
              : colors.neutral.gray500,
            marginRight: spacingValues.xs,
            WebkitAppearance: 'none',
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            backgroundColor: checked
              ? (disabled ? colors.neutral.gray200 : accentColor)
              : disabled ? colors.neutral.gray200 : 'transparent',
          }}
        />
      )}
      
      <Text
        style={[
          styles.label,
          disabled && styles.labelDisabled
        ]}
      >
        {label}
      </Text>
    </Touchable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: spacingValues.lg,
    height: spacingValues.lg,
    borderRadius: borderRadiusValues.full,
    borderWidth: 2,
    borderColor: colors.neutral.gray500,
    marginRight: spacingValues.xs,
    WebkitAppearance: 'none',
    outline: 'none',
    cursor: 'pointer',
  },
  inputChecked: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  inputDisabled: {
    backgroundColor: colors.neutral.gray200,
    borderColor: colors.neutral.gray400,
    cursor: 'not-allowed',
  },
  label: {
    fontSize: typography.fontSize.md,
    color: colors.neutral.gray900,
    userSelect: 'none',
  },
  labelDisabled: {
    color: colors.neutral.gray500,
  },
});

RadioButton.displayName = 'RadioButton';