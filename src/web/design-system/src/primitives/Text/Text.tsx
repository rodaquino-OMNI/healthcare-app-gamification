import React from 'react';
import styled from 'styled-components';
import { typography } from '../../tokens/typography';
import { colors } from '../../tokens/colors';

/**
 * Props for the Text component
 */
export interface TextProps {
  /**
   * Font family to use (from design system or custom value)
   */
  fontFamily?: string;
  
  /**
   * Font size to use (from design system or custom value)
   */
  fontSize?: string;
  
  /**
   * Font weight to use (from design system or custom value)
   */
  fontWeight?: string;
  
  /**
   * Line height to use (from design system or custom value)
   */
  lineHeight?: string;
  
  /**
   * Text color to use (from design system or custom value)
   */
  color?: string;
  
  /**
   * Text alignment (left, right, center, justify)
   */
  textAlign?: string;
  
  /**
   * Test ID for component testing
   */
  testID?: string;
  
  /**
   * Journey identifier for journey-specific theming
   */
  journey?: 'health' | 'care' | 'plan';
  
  /**
   * Determines if text should be truncated with ellipsis when overflowing
   */
  truncate?: boolean;
  
  /**
   * HTML element to render as
   */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'div';
  
  /**
   * Accessibility props
   */
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  
  /**
   * Child elements (text content)
   */
  children: React.ReactNode;
}

/**
 * Resolves typography token values based on provided token name
 */
const getTypographyToken = <T extends Record<string, any>>(
  category: T,
  value: string | undefined,
  defaultValue: keyof T
): string | number => {
  if (value === undefined) {
    return category[defaultValue];
  }
  
  if (value in category) {
    return category[value as keyof T];
  }
  
  return value;
};

/**
 * Gets the appropriate text color based on props
 */
const getTextColor = (props: Pick<TextProps, 'color' | 'journey'>): string => {
  if (props.color) {
    return props.color;
  }
  
  if (props.journey && props.journey in colors.journeys) {
    return colors.journeys[props.journey].text;
  }
  
  return colors.neutral.gray900;
};

// Create the styled component
const StyledText = styled.span<TextProps>`
  /* Font styles */
  font-family: ${props => getTypographyToken(typography.fontFamily, props.fontFamily, 'base')};
  font-size: ${props => getTypographyToken(typography.fontSize, props.fontSize, 'md')};
  font-weight: ${props => getTypographyToken(typography.fontWeight, props.fontWeight, 'regular')};
  line-height: ${props => getTypographyToken(typography.lineHeight, props.lineHeight, 'base')};
  
  /* Text color */
  color: ${props => getTextColor(props)};
  
  /* Text alignment */
  text-align: ${props => props.textAlign || 'left'};
  
  /* Text truncation */
  ${props => props.truncate && `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
  
  /* Ensure smooth font rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

/**
 * Text component for displaying text with consistent styling across the AUSTA SuperApp.
 * Provides support for design system typography tokens, responsiveness, and accessibility.
 */
export const Text: React.FC<TextProps> = ({
  as,
  children,
  testID,
  ...props
}) => {
  return (
    <StyledText 
      as={as}
      data-testid={testID}
      {...props}
    >
      {children}
    </StyledText>
  );
};

// Default props
Text.defaultProps = {
  as: 'span',
  fontFamily: 'base',
  fontSize: 'md',
  fontWeight: 'regular',
  lineHeight: 'base',
  textAlign: 'left',
  truncate: false,
};

export default Text;