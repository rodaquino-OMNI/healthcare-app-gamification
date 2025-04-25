import styled, { ThemeProps, css } from 'styled-components';

export const CheckboxContainer = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clipPath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export const StyledCheckbox = styled.div<{
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  journey?: 'health' | 'care' | 'plan';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 2px solid ${({ theme, error, checked, disabled, journey }) => {
    if (disabled) return theme.colors.neutral.gray400;
    if (error) return theme.colors.semantic.error;
    if (checked) {
      if (journey === 'health') return theme.colors.journeys.health.primary;
      if (journey === 'care') return theme.colors.journeys.care.primary;
      if (journey === 'plan') return theme.colors.journeys.plan.primary;
      return theme.colors.brand.primary;
    }
    return theme.colors.neutral.gray500;
  }};
  background-color: ${({ theme, checked, disabled, journey }) => {
    if (disabled) return theme.colors.neutral.gray100;
    if (checked) {
      if (journey === 'health') return theme.colors.journeys.health.primary;
      if (journey === 'care') return theme.colors.journeys.care.primary;
      if (journey === 'plan') return theme.colors.journeys.plan.primary;
      return theme.colors.brand.primary;
    }
    return theme.colors.neutral.white;
  }};
  transition: all ${({ theme }) => theme.animation.duration.fast};

  ${({ checked }) =>
    checked &&
    css`
      &::after {
        content: '';
        width: 10px;
        height: 10px;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>');
        background-repeat: no-repeat;
        background-position: center;
      }
    `}

  &:hover {
    ${({ disabled, checked, theme, journey }) =>
      !disabled &&
      !checked &&
      css`
        border-color: ${journey ? theme.colors.journeys[journey].primary : theme.colors.brand.primary};
      `}
  }
`;

export const CheckboxLabel = styled.span<{ disabled?: boolean }>`
  margin-left: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.neutral.gray600 : theme.colors.neutral.gray900};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
`;