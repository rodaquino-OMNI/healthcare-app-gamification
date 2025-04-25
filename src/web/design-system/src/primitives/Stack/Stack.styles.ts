import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import { spacing } from '../../tokens/spacing';
import { breakpoints } from '../../tokens/breakpoints';

/**
 * Helper function to get the appropriate spacing value based on the spacing prop.
 * Resolves spacing tokens to actual values.
 */
const getSpacingValue = (space?: string | number): string => {
  if (space === undefined) return '0';
  
  // If it's a number, assume pixels
  if (typeof space === 'number') return `${space}px`;
  
  // Check if it's a token key in the spacing object
  if (space in spacing) return spacing[space as keyof typeof spacing];
  
  // Otherwise, return the space value as is
  return String(space);
};

/**
 * Generates the CSS for the Stack component based on its props.
 */
const getStackStyles = (props: {
  direction?: 'column' | 'row';
  spacing?: string | number;
  wrap?: boolean;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
}) => {
  const { direction = 'column', spacing: stackSpacing, wrap, align } = props;
  
  return css`
    display: flex;
    flex-direction: ${direction};
    flex-wrap: ${wrap ? 'wrap' : 'nowrap'};
    align-items: ${align || 'stretch'};
    
    ${stackSpacing !== undefined && css`
      gap: ${getSpacingValue(stackSpacing)};
      
      /* Fallback for browsers that don't support gap */
      @supports not (gap: ${getSpacingValue(stackSpacing)}) {
        ${direction === 'column' 
          ? `& > * + * { margin-top: ${getSpacingValue(stackSpacing)}; }`
          : `& > * + * { margin-left: ${getSpacingValue(stackSpacing)}; }`
        }
      }
      
      /* Responsive spacing using media queries */
      ${Object.entries(breakpoints).map(([breakpoint, value]) => `
        @media (min-width: ${value}) {
          gap: ${getSpacingValue(stackSpacing)};
        }
      `).join('')}
    `}
  `;
};

/**
 * The main styled component for the Stack primitive that arranges its children in a stack layout.
 * Extends the Box component to inherit all its styling capabilities.
 */
export const StackContainer = styled(Box)`
  ${props => getStackStyles(props)}
`;