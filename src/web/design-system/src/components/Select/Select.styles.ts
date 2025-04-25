import styled from 'styled-components';
import { colors, spacing, typography, borderRadius, shadows } from '../tokens';

// Container component that wraps the entire Select component
export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${spacing.sm};
  width: 100%;
`;

// Label component for the Select with proper styling
export const SelectLabel = styled.label`
  font-size: ${typography.fontSize.md};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray700};
  margin-bottom: ${spacing.xs};
`;

// Wrapper for the select element to control its appearance
export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

// The styled select element with journey-specific theming
export const StyledSelect = styled.select<{ 
  journey?: 'health' | 'care' | 'plan'; 
  error?: boolean;
}>`
  appearance: none;
  width: 100%;
  padding: ${spacing.sm};
  padding-right: ${spacing.xl};
  font-size: ${typography.fontSize.md};
  font-family: ${typography.fontFamily.base};
  border-radius: ${borderRadius.sm};
  border: 1px solid ${props => 
    props.error ? colors.semantic.error : colors.neutral.gray300
  };
  background-color: ${colors.neutral.white};
  color: ${colors.neutral.gray800};
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${props => 
      props.error 
        ? colors.semantic.error 
        : props.journey 
          ? colors.journeys[props.journey].primary 
          : colors.brand.primary
    };
    box-shadow: ${props => {
      const color = props.error 
        ? colors.semantic.error 
        : props.journey 
          ? colors.journeys[props.journey].primary 
          : colors.brand.primary;
      return `0 0 0 2px ${color}40`;
    }};
  }

  &:hover:not(:disabled) {
    border-color: ${props => 
      props.error 
        ? colors.semantic.error 
        : props.journey 
          ? colors.journeys[props.journey].primary 
          : colors.brand.primary
    };
  }

  &:disabled {
    background-color: ${colors.neutral.gray100};
    color: ${colors.neutral.gray500};
    cursor: not-allowed;
  }
`;

// Custom dropdown icon component for the select
export const SelectIcon = styled.div<{ 
  journey?: 'health' | 'care' | 'plan'; 
  disabled?: boolean;
  error?: boolean;
}>`
  position: absolute;
  right: ${spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${props => 
    props.disabled 
      ? colors.neutral.gray400 
      : props.error 
        ? colors.semantic.error 
        : props.journey 
          ? colors.journeys[props.journey].primary 
          : colors.neutral.gray600
  };
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Styled option element for the select dropdown
export const SelectOption = styled.option`
  font-size: ${typography.fontSize.md};
  font-family: ${typography.fontFamily.base};
  color: ${colors.neutral.gray800};
  padding: ${spacing.xs} ${spacing.sm};
`;