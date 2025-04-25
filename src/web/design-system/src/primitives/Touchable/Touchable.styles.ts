import styled, { css } from 'styled-components';
import { TouchableOpacity, Platform } from 'react-native';

interface StyledTouchableOpacityProps {
  fullWidth?: boolean;
  disabled?: boolean;
}

/**
 * StyledTouchableOpacity provides a consistent touchable component that works across platforms
 * with appropriate visual feedback and styling.
 * 
 * Props:
 * - fullWidth: Makes the touchable expand to fill its container width
 * - disabled: Disables the touchable and applies a visual indication
 * 
 * Note: The native activeOpacity prop is passed through to the underlying TouchableOpacity
 * component and controls the opacity when pressed on mobile platforms.
 */
export const StyledTouchableOpacity = styled(TouchableOpacity)<StyledTouchableOpacityProps>`
  /* Base styles */
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  /* Handle width */
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  
  /* Disabled state styling */
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  
  /* Platform-specific styles */
  ${props => Platform.OS === 'web' && css`
    cursor: ${props.disabled ? 'not-allowed' : 'pointer'};
    transition: opacity 0.2s ease;
    outline: none;
    
    ${!props.disabled && css`
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
  `}
`;