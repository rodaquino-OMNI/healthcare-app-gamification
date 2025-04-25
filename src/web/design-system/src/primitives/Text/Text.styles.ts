import styled from 'styled-components';
import { typography, colors, mediaQueries } from '../tokens';

/**
 * Defines the props interface for the StyledText component
 */
export interface TextStyleProps {
  /**
   * Font family for the text
   */
  fontFamily?: string;
  
  /**
   * Font weight for the text
   */
  fontWeight?: number;
  
  /**
   * Font size for the text
   */
  fontSize?: string;
  
  /**
   * Line height for the text
   */
  lineHeight?: number;
  
  /**
   * Letter spacing for the text
   */
  letterSpacing?: string;
  
  /**
   * Text color
   * Can be a direct color value or 'journey' to use journey-specific primary color
   * Can also be 'journey.secondary', 'journey.accent', etc. to use specific journey colors
   */
  color?: string;
  
  /**
   * Text alignment
   */
  align?: string;
  
  /**
   * Journey context for theming
   * Corresponds to 'health', 'care', or 'plan'
   */
  journey?: string;
  
  /**
   * Whether to truncate text with ellipsis
   */
  truncate?: boolean;
  
  /**
   * Whether to apply responsive font sizing
   */
  responsive?: boolean;
}

/**
 * Helper function to calculate responsive font sizes based on breakpoint
 * @param size Original font size with unit
 * @param breakpoint Breakpoint name (sm, md, lg)
 * @returns Calculated size with unit
 */
const calculateResponsiveSize = (size: string, breakpoint: string): string => {
  // Extract numeric value and unit
  const matches = size.match(/^([\d.]+)(\w+)$/);
  if (!matches) return size;
  
  const [, valueStr, unit] = matches;
  const value = parseFloat(valueStr);
  
  // Apply scaling factor based on breakpoint
  let scaleFactor = 1;
  switch (breakpoint) {
    case 'sm':
      scaleFactor = 1;
      break;
    case 'md':
      scaleFactor = 1.125; // 12.5% larger on tablets
      break;
    case 'lg':
      scaleFactor = 1.25; // 25% larger on desktops
      break;
    default:
      scaleFactor = 1;
  }
  
  // Return new size with original unit
  return `${(value * scaleFactor).toFixed(2)}${unit}`;
};

/**
 * Styled component for the Text primitive with configurable typography styling
 * This component provides all necessary typography styling with support for
 * journey-specific theming and accessibility features.
 */
export const StyledText = styled.span<TextStyleProps>`
  font-family: ${props => props.fontFamily || typography.fontFamily.base};
  font-weight: ${props => props.fontWeight || typography.fontWeight.regular};
  font-size: ${props => props.fontSize || typography.fontSize.md};
  line-height: ${props => props.lineHeight || typography.lineHeight.base};
  letter-spacing: ${props => props.letterSpacing || typography.letterSpacing.normal};
  
  color: ${props => {
    if (props.color && props.journey) {
      if (props.color === 'journey') {
        return colors.journeys[props.journey].primary;
      }
      if (props.color.startsWith('journey.')) {
        const journeyProperty = props.color.split('.')[1];
        return colors.journeys[props.journey][journeyProperty] || colors.neutral.gray900;
      }
    }
    return props.color || colors.neutral.gray900;
  }};
  
  text-align: ${props => props.align || 'left'};
  
  ${props => props.truncate && `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
  
  ${props => props.responsive && `
    @media ${mediaQueries.sm} {
      font-size: ${props.fontSize ? calculateResponsiveSize(props.fontSize, 'sm') : typography.fontSize.md};
    }
    @media ${mediaQueries.md} {
      font-size: ${props.fontSize ? calculateResponsiveSize(props.fontSize, 'md') : typography.fontSize.md};
    }
    @media ${mediaQueries.lg} {
      font-size: ${props.fontSize ? calculateResponsiveSize(props.fontSize, 'lg') : typography.fontSize.lg};
    }
  `}
`;