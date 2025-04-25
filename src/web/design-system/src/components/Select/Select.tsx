import React, { useState, useCallback, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Box } from '../../primitives/Box/Box';
import { Text } from '../../primitives/Text/Text';
import { Touchable } from '../../primitives/Touchable/Touchable';
import { Modal } from '../../components/Modal/Modal';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { RadioButton } from '../../components/RadioButton/RadioButton';
import { Input } from '../../components/Input/Input';
import { tokens } from '../../tokens';

/**
 * Interface defining the props for the Select component.
 */
export interface SelectProps {
  /**
   * The options for the select component.
   */
  options: Array<{ label: string; value: string }>;
  
  /**
   * The value of the select component.
   */
  value: string | string[];
  
  /**
   * A callback function that is called when the select value changes.
   */
  onChange: (value: string | string[]) => void;
  
  /**
   * The label text for the select component.
   */
  label: string;
  
  /**
   * A boolean indicating whether the select component is a multi-select.
   * @default false
   */
  multiple?: boolean;
  
  /**
   * A boolean indicating whether the select component is searchable.
   * @default false
   */
  searchable?: boolean;
  
  /**
   * The placeholder text for the select component.
   * @default "Select an option"
   */
  placeholder?: string;
  
  /**
   * A boolean indicating whether the select component is disabled.
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Test identifier for the select component.
   */
  testID?: string;
  
  /**
   * The journey context for the select component.
   */
  journey?: 'health' | 'care' | 'plan';
}

/**
 * A custom Select component with styling and accessibility features.
 */
export const Select = forwardRef<any, SelectProps>((props, ref) => {
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
    journey
  } = props;

  // State for managing dropdown visibility and search functionality
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<any>(null);
  
  // Expose the focus method to parent components
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }));
  
  // Reset search text when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchText('');
    }
  }, [isOpen]);
  
  // Handle selection change
  const handleChange = useCallback((selectedValue: string) => {
    if (multiple) {
      // For multi-select, toggle the selected value in the array
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter(v => v !== selectedValue)
        : [...currentValues, selectedValue];
      onChange(newValues);
    } else {
      // For single-select, just set the value and close the modal
      onChange(selectedValue);
      setIsOpen(false);
    }
  }, [multiple, onChange, value]);
  
  // Toggle dropdown visibility
  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
    }
  }, [disabled]);
  
  // Filter options based on search text
  const filteredOptions = searchable && searchText
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchText.toLowerCase()))
    : options;
  
  // Get display value for the select
  const getDisplayValue = () => {
    if (multiple) {
      // For multi-select, show count of selected items
      const selectedValues = Array.isArray(value) ? value : [];
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const selectedOption = options.find(opt => opt.value === selectedValues[0]);
        return selectedOption ? selectedOption.label : placeholder;
      }
      return `${selectedValues.length} selected`;
    } else {
      // For single-select, show the selected item label
      const selectedOption = options.find(opt => opt.value === value);
      return selectedOption ? selectedOption.label : placeholder;
    }
  };

  // Add keyboard event listener for accessibility
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeydown = (event: KeyboardEvent) => {
      // Close on Escape key
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen]);
  
  // Get journey-specific color
  const getJourneyColor = () => {
    if (journey && tokens.colors.journeys[journey]) {
      return tokens.colors.journeys[journey].primary;
    }
    return tokens.colors.brand.primary;
  };
  
  const journeyColor = getJourneyColor();
  
  return (
    <Box style={styles.container}>
      {/* Select label */}
      <Text style={styles.label}>{label}</Text>
      
      {/* Select trigger button */}
      <Touchable
        onPress={handleToggle}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${getDisplayValue()}`}
        accessibilityHint={`Opens a list of options. Currently selected: ${getDisplayValue()}`}
        accessibilityState={{ expanded: isOpen, disabled }}
        ref={inputRef}
        style={[
          styles.touchable,
          disabled && { opacity: 0.5 },
          journey && { borderColor: journeyColor }
        ]}
        testID={testID || 'select-component'}
        journey={journey}
      >
        <Text style={styles.text}>
          {getDisplayValue()}
        </Text>
        <Box style={styles.icon}>
          <Text aria-hidden="true">▼</Text>
        </Box>
      </Touchable>
      
      {/* Options modal */}
      <Modal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        title={label}
        journey={journey}
      >
        <Box style={styles.modalContent}>
          {/* Search input for filterable selects */}
          {searchable && (
            <Box style={{ marginBottom: tokens.spacing.md }}>
              <Input
                value={searchText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                placeholder="Search options..."
                journey={journey}
                aria-label="Search options"
                testID="select-search-input"
              />
            </Box>
          )}
          
          {/* Render options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <Box 
                key={option.value} 
                style={styles.option}
              >
                {multiple ? (
                  // Multi-select uses checkboxes
                  <Checkbox
                    id={`select-option-${option.value}`}
                    name={`select-${label}`}
                    value={option.value}
                    checked={Array.isArray(value) && value.includes(option.value)}
                    onChange={() => handleChange(option.value)}
                    label={option.label}
                    journey={journey}
                    testID={`select-checkbox-${option.value}`}
                  />
                ) : (
                  // Single-select uses radio buttons
                  <RadioButton
                    id={`select-option-${option.value}`}
                    name={`select-${label}`}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => handleChange(option.value)}
                    label={option.label}
                    journey={journey}
                    testID={`select-radio-${option.value}`}
                  />
                )}
              </Box>
            ))
          ) : (
            // No options found message
            <Text>No options found</Text>
          )}
        </Box>
      </Modal>
    </Box>
  );
});

// Styles for the select component
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 8
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9E9E9E'
  },
  text: {
    fontSize: 16,
    color: '#212121'
  },
  icon: {
    marginLeft: 8
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  }
});

// Set display name for better debugging
Select.displayName = 'Select';