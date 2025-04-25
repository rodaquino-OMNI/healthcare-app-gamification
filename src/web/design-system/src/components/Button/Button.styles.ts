import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { shadows } from '../../tokens/shadows';
import { breakpoints } from '../../tokens/breakpoints';
import { baseTheme } from '../../themes/base.theme';
import { healthTheme } from '../../themes/health.theme';
import { careTheme } from '../../themes/care.theme';
import { planTheme } from '../../themes/plan.theme';

/**
 * Props interface for all button components
 */
interface ButtonProps {
  journey?: 'health' | 'care' | 'plan';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

/**
 * Helper function to get journey-specific color
 */
const getJourneyColor = (journey: 'health' | 'care' | 'plan' | undefined, colorType: 'primary' | 'secondary' | 'accent' | 'background') => {
  if (journey && colors.journeys[journey]) {
    return colors.journeys[journey][colorType];
  }
  // Default to brand primary color if no journey specified
  return colors.brand.primary;
};

/**
 * Primary Button
 * Filled button with journey-specific background color
 */
export const PrimaryButton = styled.button<ButtonProps>`
  /* Base styles */
  font-family: ${typography.fontFamily.base};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.md};
  line-height: ${typography.lineHeight.base};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${shadows.sm};
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  /* Size variants */
  ${props => props.size === 'sm' && `
    padding: ${spacing.xs} ${spacing.sm};
    font-size: ${typography.fontSize.sm};
  `}
  
  ${props => props.size === 'lg' && `
    padding: ${spacing.md} ${spacing.lg};
    font-size: ${typography.fontSize.lg};
  `}

  /* Primary button specific */
  background-color: ${props => getJourneyColor(props.journey, 'primary')};
  color: ${colors.neutral.white};
  border: none;

  /* State styles */
  &:hover:not(:disabled) {
    background-color: ${props => getJourneyColor(props.journey, 'secondary')};
  }

  &:active:not(:disabled) {
    background-color: ${props => getJourneyColor(props.journey, 'accent')};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${props => getJourneyColor(props.journey, 'primary')}40;
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Responsive adjustments */
  @media (min-width: ${breakpoints.md}) {
    font-size: ${props => props.size === 'sm' 
      ? typography.fontSize.sm 
      : props.size === 'lg' 
        ? typography.fontSize.xl 
        : typography.fontSize.lg};
  }
`;

/**
 * Secondary Button
 * Outlined button with journey-specific border and text color
 */
export const SecondaryButton = styled.button<ButtonProps>`
  /* Base styles */
  font-family: ${typography.fontFamily.base};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.md};
  line-height: ${typography.lineHeight.base};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  /* Size variants */
  ${props => props.size === 'sm' && `
    padding: ${spacing.xs} ${spacing.sm};
    font-size: ${typography.fontSize.sm};
  `}
  
  ${props => props.size === 'lg' && `
    padding: ${spacing.md} ${spacing.lg};
    font-size: ${typography.fontSize.lg};
  `}

  /* Secondary button specific */
  background-color: transparent;
  color: ${props => getJourneyColor(props.journey, 'primary')};
  border: 1px solid ${props => getJourneyColor(props.journey, 'primary')};

  /* State styles */
  &:hover:not(:disabled) {
    background-color: ${props => getJourneyColor(props.journey, 'background')};
  }

  &:active:not(:disabled) {
    background-color: ${props => `${getJourneyColor(props.journey, 'background')}CC`};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${props => getJourneyColor(props.journey, 'primary')}40;
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Responsive adjustments */
  @media (min-width: ${breakpoints.md}) {
    font-size: ${props => props.size === 'sm' 
      ? typography.fontSize.sm 
      : props.size === 'lg' 
        ? typography.fontSize.xl 
        : typography.fontSize.lg};
  }
`;

/**
 * Tertiary Button
 * Text-only button with journey-specific text color
 */
export const TertiaryButton = styled.button<ButtonProps>`
  /* Base styles */
  font-family: ${typography.fontFamily.base};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.md};
  line-height: ${typography.lineHeight.base};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  /* Size variants */
  ${props => props.size === 'sm' && `
    padding: ${spacing.xs} ${spacing.xs};
    font-size: ${typography.fontSize.sm};
  `}
  
  ${props => props.size === 'lg' && `
    padding: ${spacing.sm} ${spacing.md};
    font-size: ${typography.fontSize.lg};
  `}

  /* Tertiary button specific */
  background-color: transparent;
  color: ${props => getJourneyColor(props.journey, 'primary')};
  border: none;

  /* State styles */
  &:hover:not(:disabled) {
    background-color: ${props => `${getJourneyColor(props.journey, 'primary')}10`};
  }

  &:active:not(:disabled) {
    background-color: ${props => `${getJourneyColor(props.journey, 'primary')}20`};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${props => getJourneyColor(props.journey, 'primary')}40;
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Responsive adjustments */
  @media (min-width: ${breakpoints.md}) {
    font-size: ${props => props.size === 'sm' 
      ? typography.fontSize.sm 
      : props.size === 'lg' 
        ? typography.fontSize.xl 
        : typography.fontSize.lg};
  }
`;