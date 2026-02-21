import React, { forwardRef, useState, useCallback, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, Platform, TextInputProps } from 'react-native';
import { Box } from '../../primitives/Box';
import { Text } from '../../primitives/Text';
import { Touchable } from '../../primitives/Touchable';
import { useTheme } from '../../themes';
import { colors } from '../../tokens/colors';
import { borderRadiusValues } from '../../tokens/borderRadius';
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
export const Checkbox = forwardRef<any, CheckboxProps>((props, ref) => {
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
  const [isChecked, setIsChecked] = useState(checked);
  const inputRef = React.useRef<any>(null);
  
  // Update internal state when checked prop changes
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);
  
  // Expose the focus method to the parent through ref
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }));
  
  // Handle checkbox change
  const handleChange = useCallback(() => {
    if (!disabled) {
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      
      // Create a synthetic event for the onChange handler
      const syntheticEvent = {
        target: {
          checked: newChecked,
          value,
          name,
          id
        },
        currentTarget: {
          checked: newChecked,
          value,
          name,
          id
        },
        nativeEvent: {},
        preventDefault: () => {},
        stopPropagation: () => {},
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
        persist: () => {},
        type: 'change',
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
  }, [disabled, isChecked, onChange, value, name, id]);
  
  // Get journey-specific styling
  const getJourneyColor = () => {
    if (journey && theme.colors.journeys[journey]) {
      return theme.colors.journeys[journey].primary;
    }
    return theme.colors.brand.primary; // Default to brand primary color
  };
  
  // Selected color based on journey
  const selectedColor = getJourneyColor();
  
  return (
    <Touchable
      onPress={handleChange}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled }}
      accessibilityLabel={label}
      testID={testID || `checkbox-${id}`}
      style={styles.container}
    >
      <Box
        style={[
          styles.input,
          isChecked && [styles.inputChecked, { backgroundColor: selectedColor, borderColor: selectedColor }],
          disabled && styles.inputDisabled
        ]}
      >
        {isChecked && (
          <Text
            testID="checkbox-checkmark"
            aria-hidden="true"
            style={styles.checkmark}
          >
            ✓
          </Text>
        )}
      </Box>
      
      {/* Hidden native input for web platform only */}
      {Platform.OS === 'web' && (
        <input
          ref={inputRef}
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
            height: 0
          }}
          aria-hidden="true"
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
    width: 20,
    height: 20,
    borderRadius: borderRadiusValues.sm,
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
  },
  checkmark: {
    color: colors.neutral.white,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    color: colors.neutral.gray900,
    userSelect: 'none',
  },
  labelDisabled: {
    color: colors.neutral.gray400,
  },
});

// Set display name for better debugging
Checkbox.displayName = 'Checkbox';