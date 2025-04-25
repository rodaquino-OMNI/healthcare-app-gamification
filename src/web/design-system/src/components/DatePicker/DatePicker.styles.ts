import styled, { ThemeProps, StyledProps } from 'styled-components';

// Define the props that can be passed to the DatePicker components
interface DatePickerProps {
  journey?: 'health' | 'care' | 'plan' | string;
}

interface DatePickerButtonProps extends DatePickerProps {
  selected?: boolean;
  disabled?: boolean;
  today?: boolean;
}

// Main container for the DatePicker
export const DatePickerContainer = styled.div<DatePickerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.neutral.gray300};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
`;

// Header of the DatePicker with month/year display and navigation
export const DatePickerHeader = styled.div<DatePickerProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, journey }) => 
    journey && theme.colors.journeys?.[journey]?.primary 
      ? theme.colors.journeys[journey].primary 
      : theme.colors.brand.primary
  };
  color: ${({ theme }) => theme.colors.neutral.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

// Body of the DatePicker containing the calendar
export const DatePickerBody = styled.div<DatePickerProps>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
`;

// Footer of the DatePicker with action buttons
export const DatePickerFooter = styled.div<DatePickerProps>`
  display: flex;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral.gray300};
  gap: ${({ theme }) => theme.spacing.md};
`;

// Button used in the DatePicker
export const DatePickerButton = styled.button<DatePickerButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  
  /* Default state */
  background-color: transparent;
  color: ${({ theme }) => theme.colors.neutral.gray800};
  
  /* Selected state */
  ${({ selected, theme, journey }) => selected && `
    background-color: ${
      journey && theme.colors.journeys?.[journey]?.primary 
        ? theme.colors.journeys[journey].primary 
        : theme.colors.brand.primary
    };
    color: ${theme.colors.neutral.white};
  `}
  
  /* Today state */
  ${({ today, theme, selected, journey }) => today && !selected && `
    border: 2px solid ${
      journey && theme.colors.journeys?.[journey]?.primary 
        ? theme.colors.journeys[journey].primary 
        : theme.colors.brand.primary
    };
  `}
  
  /* Disabled state */
  ${({ disabled, theme }) => disabled && `
    opacity: 0.4;
    cursor: not-allowed;
  `}
  
  /* Hover state (when not disabled) */
  &:hover:not(:disabled) {
    background-color: ${({ theme, selected, journey }) => 
      selected 
        ? (journey && theme.colors.journeys?.[journey]?.secondary 
            ? theme.colors.journeys[journey].secondary 
            : theme.colors.brand.secondary)
        : theme.colors.neutral.gray200
    };
  }
  
  /* Focus state */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme, journey }) => 
      journey && theme.colors.journeys?.[journey]?.primary 
        ? theme.colors.journeys[journey].primary 
        : theme.colors.brand.primary
    };
  }
  
  /* Transition for smooth state changes */
  transition: all 0.2s ease-in-out;
`;