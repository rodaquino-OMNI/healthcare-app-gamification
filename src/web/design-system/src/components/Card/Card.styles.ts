import styled, { ThemeProps, DefaultTheme } from 'styled-components';
import { borderRadius } from '../../tokens/borderRadius';
import { shadows } from '../../tokens/shadows';
import { spacing } from '../../tokens/spacing';
import { colors } from '../../tokens/colors';

/**
 * The main container for the Card component.
 * Applies base styles and handles theming.
 */
export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${spacing.md};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.sm};
  transition: all ${props => props.theme.animation?.duration?.fast || '0.15s'} ease-in-out;

  &:hover {
    box-shadow: ${shadows.md};
  }

  cursor: pointer;
  border: 1px solid ${colors.neutral.gray200};
  background-color: ${colors.neutral.white};
`;