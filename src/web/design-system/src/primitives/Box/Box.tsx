import React from 'react';
import { spacing } from '../../tokens/spacing';
import { colors } from '../../tokens/colors';
import { shadows } from '../../tokens/shadows';
import { breakpoints } from '../../tokens/breakpoints';
import { BoxContainer } from './Box.styles';

/**
 * Props for the Box component, extending the BoxContainer props
 * with additional functionality like journey theming.
 */
export interface BoxProps extends React.ComponentPropsWithoutRef<typeof BoxContainer> {
  /**
   * Journey context for automatic theming
   */
  journey?: 'health' | 'care' | 'plan';
  
  /**
   * React children
   */
  children?: React.ReactNode;
}

/**
 * Box is a versatile layout component that serves as a building block for UI components.
 * It provides extensive styling capabilities through props and supports journey-specific theming.
 * 
 * The Box component resolves token values (like 'md', 'lg' for spacing or 'primary', 'secondary' 
 * for colors) to their actual values defined in the design system tokens.
 * 
 * @example
 * // Basic usage
 * <Box padding="md" backgroundColor="gray100">Content</Box>
 * 
 * @example
 * // With journey theming
 * <Box journey="health">Health Journey Content</Box>
 * 
 * @example
 * // With specific styles
 * <Box 
 *   display="flex" 
 *   flexDirection="column" 
 *   padding="lg"
 *   boxShadow="md"
 *   borderRadius="lg"
 * >
 *   Styled Content
 * </Box>
 */
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(({
  // Extract props that need special handling
  journey,
  backgroundColor,
  color,
  padding,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  margin,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  boxShadow,
  borderRadius,
  children,
  ...rest
}, ref) => {
  // Apply journey-specific background if specified
  let bgColor = backgroundColor;
  if (journey && !backgroundColor) {
    bgColor = colors.journeys[journey].background;
  }
  
  // Helper function to resolve token values to their actual values
  const resolveToken = (value: string | undefined, tokenMap: Record<string, string>): string | undefined => {
    if (!value) return undefined;
    return tokenMap[value] || value; // Use token value if it exists, otherwise raw value
  };
  
  // Resolve tokens for various properties
  const resolvedProps = {
    // Colors
    backgroundColor: bgColor ? resolveToken(bgColor, colors) : undefined,
    color: color ? resolveToken(color, colors) : undefined,
    
    // Spacing - padding
    padding: padding ? resolveToken(padding, spacing) : undefined,
    paddingTop: paddingTop ? resolveToken(paddingTop, spacing) : undefined,
    paddingRight: paddingRight ? resolveToken(paddingRight, spacing) : undefined,
    paddingBottom: paddingBottom ? resolveToken(paddingBottom, spacing) : undefined,
    paddingLeft: paddingLeft ? resolveToken(paddingLeft, spacing) : undefined,
    
    // Spacing - margin
    margin: margin ? resolveToken(margin, spacing) : undefined,
    marginTop: marginTop ? resolveToken(marginTop, spacing) : undefined,
    marginRight: marginRight ? resolveToken(marginRight, spacing) : undefined,
    marginBottom: marginBottom ? resolveToken(marginBottom, spacing) : undefined,
    marginLeft: marginLeft ? resolveToken(marginLeft, spacing) : undefined,
    
    // Visual properties
    boxShadow: boxShadow ? resolveToken(boxShadow, shadows) : undefined,
    borderRadius: borderRadius ? resolveToken(borderRadius, spacing) : undefined,
  };
  
  return (
    <BoxContainer
      ref={ref}
      {...resolvedProps}
      {...rest}
    >
      {children}
    </BoxContainer>
  );
});

// Set display name for better debugging
Box.displayName = 'Box';