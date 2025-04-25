import styled, { ThemeProps, DefaultTheme } from 'styled-components';

/**
 * The main container for the Card component.
 * Applies base styles and handles theming.
 */
export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all ${props => props.theme.animation.duration.fast} ease-in-out;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.neutral.gray200};
  background-color: ${props => props.theme.colors.neutral.white};
`;