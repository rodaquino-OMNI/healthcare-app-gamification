import styled, { css } from 'styled-components';

interface StyledTouchableProps {
  fullWidth?: boolean;
  disabled?: boolean;
}

/**
 * StyledTouchable provides a consistent touchable component for web
 * with appropriate visual feedback and styling.
 *
 * Props:
 * - fullWidth: Makes the touchable expand to fill its container width
 * - disabled: Disables the touchable and applies a visual indication
 */
export const StyledTouchableOpacity = styled.button<StyledTouchableProps>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  text-align: left;

  /* Handle width */
  width: ${props => (props.fullWidth ? '100%' : 'auto')};

  /* Disabled state styling */
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: opacity 0.2s ease;
  outline: none;

  ${props => !props.disabled && css`
    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }
  `}

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.5);
  }
`;
