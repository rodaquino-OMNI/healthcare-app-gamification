import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

interface IconProps {
  size?: keyof typeof spacing;
  color?: string;
  journey?: keyof typeof colors.journeys;
  interactive?: boolean;
}

export const IconContainer = styled.svg.attrs({
  role: "img",
})<IconProps>`
  /* Base styles */
  display: inline-block;
  vertical-align: middle;
  
  /* Sizing based on design tokens */
  width: ${({ size = 'md' }) => spacing[size]};
  height: ${({ size = 'md' }) => spacing[size]};
  
  /* Coloring with support for custom colors and journey-specific theming */
  fill: ${({ color, journey }) => {
    if (color) return color;
    if (journey) return colors.journeys[journey].primary;
    return colors.neutral.gray700; // Default from neutral palette
  }};
  
  /* Smooth transitions for state changes */
  transition: fill 0.2s ease-in-out, transform 0.2s ease-in-out;
  
  /* Interactive state styles */
  ${({ interactive, color, journey }) => interactive && `
    cursor: pointer;
    
    &:hover, &:focus {
      fill: ${journey 
        ? colors.journeys[journey].secondary 
        : color || colors.neutral.gray800};
    }
    
    &:active {
      transform: scale(0.95);
    }
  `}
`;