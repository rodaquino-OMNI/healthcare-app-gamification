import React from 'react';
import { InputContainer, InputField, InputLabel } from './Input.styles';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';

/**
 * Supported input types for the Input component
 */
type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'datetime-local' | 'time' | string;

/**
 * Journey identifier for journey-specific styling
 */
type Journey = 'health' | 'care' | 'plan';

/**
 * Props interface for the Input component
 */
export interface InputProps {
  /**
   * Current value of the input
   */
  value?: string;

  /**
   * Callback fired when the input value changes
   */
  onChange?: ((event: React.ChangeEvent<HTMLInputElement>) => void) | ((...args: any[]) => void);

  /**
   * Placeholder text displayed when the input is empty
   */
  placeholder?: string;

  /**
   * HTML input type
   * @default 'text'
   */
  type?: InputType;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional label text displayed above the input
   */
  label?: string;

  /**
   * Journey identifier for journey-specific styling
   */
  journey?: Journey;

  /**
   * Test identifier for testing frameworks
   */
  testID?: string;

  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;

  /**
   * ID of the element that labels this input
   */
  'aria-labelledby'?: string;

  /**
   * Error message text displayed below the input
   */
  error?: string;

  /**
   * Helper text displayed below the input
   */
  helperText?: string;

  /**
   * Input name attribute (for form integration)
   */
  name?: string;

  /**
   * onBlur handler
   */
  onBlur?: (...args: any[]) => void;

  /**
   * Ref callback (for react-hook-form)
   */
  ref?: any;

  /**
   * Additional style overrides
   */
  style?: any;

  /**
   * Min value constraint
   */
  min?: string | number;

  /**
   * Max value constraint
   */
  max?: string | number;

  /** Allow additional passthrough props for RN/web/form compatibility */
  [key: string]: any;
}

/**
 * Input component for the AUSTA SuperApp design system.
 * Provides a consistent text input experience across all journeys with
 * appropriate styling, states, and accessibility support.
 *
 * @example
 * <Input
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   placeholder="Enter your email"
 *   type="email"
 *   journey="health"
 * />
 */
export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  label,
  journey,
  testID,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  error,
  helperText,
}) => {
  const inputId = testID || `input-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText && !error ? `${inputId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <InputContainer>
      {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
      <InputField
        id={inputId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        data-testid={testID}
        journey={journey}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        style={error ? { borderColor: colors.semantic.error } : undefined}
      />
      {error && (
        <span
          id={errorId}
          role="alert"
          style={{
            color: colors.semantic.error,
            fontSize: '12px',
            marginTop: spacing['3xs'],
            display: 'block',
          }}
        >
          {error}
        </span>
      )}
      {!error && helperText && (
        <span
          id={helperId}
          style={{
            color: colors.gray[50],
            fontSize: '12px',
            marginTop: spacing['3xs'],
            display: 'block',
          }}
        >
          {helperText}
        </span>
      )}
    </InputContainer>
  );
};

export default Input;
