import styled, { keyframes, css } from 'styled-components';
import { Icon } from '@some-ui-library/icons'; // v1.0.0

// Animation for expanding and collapsing accordion content
const expandAnimation = keyframes`
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 1000px; // A large enough value for most content
    opacity: 1;
  }
`;

const collapseAnimation = keyframes`
  from {
    max-height: 1000px;
    opacity: 1;
  }
  to {
    max-height: 0;
    opacity: 0;
  }
`;

export const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.neutral.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
  
  /* Journey-specific styling - safely access journey colors with fallbacks */
  border-left: 3px solid ${({ theme, journey }) => {
    if (journey && theme.colors.journeys && theme.colors.journeys[journey]) {
      return theme.colors.journeys[journey].primary;
    }
    return theme.colors.brand.primary;
  }};
  
  /* Hover state with journey-specific colors */
  &:hover {
    background-color: ${({ theme, journey }) => {
      if (journey && theme.colors.journeys && theme.colors.journeys[journey]) {
        return theme.colors.journeys[journey].background || theme.colors.neutral.gray200;
      }
      return theme.colors.neutral.gray200;
    }};
  }
  
  /* Expanded state styling */
  ${({ isExpanded, theme, journey }) => isExpanded && css`
    background-color: ${(() => {
      if (journey && theme.colors.journeys && theme.colors.journeys[journey]) {
        return theme.colors.journeys[journey].background || theme.colors.neutral.gray200;
      }
      return theme.colors.neutral.gray200;
    })()};
    font-weight: ${theme.typography.fontWeight.bold};
  `}
  
  /* Accessibility focus styles */
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.brand.primary};
  }
`;

export const AccordionContent = styled.div`
  overflow: hidden;
  animation: ${({ isExpanded }) => isExpanded ? expandAnimation : collapseAnimation} 0.3s ease forwards;
  max-height: ${({ isExpanded }) => isExpanded ? '1000px' : '0'};
  opacity: ${({ isExpanded }) => isExpanded ? 1 : 0};
  padding: ${({ isExpanded, theme }) => isExpanded ? theme.spacing.md : '0'};
  transition: all 0.3s ease;
  
  /* Journey-specific styling with safety checks */
  ${({ theme, journey, isExpanded }) => {
    if (journey && isExpanded && theme.colors.journeys && theme.colors.journeys[journey]) {
      return css`
        border-left: 3px solid ${theme.colors.journeys[journey].secondary || 'transparent'};
        margin-left: ${theme.spacing.xs};
        padding-left: ${theme.spacing.md};
      `;
    }
    return '';
  }}
`;

export const AccordionIcon = styled(Icon)`
  transition: transform 0.3s ease;
  transform: ${({ isExpanded }) => isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  
  /* Journey-specific styling with safety checks */
  color: ${({ theme, journey }) => {
    if (journey && theme.colors.journeys && theme.colors.journeys[journey]) {
      return theme.colors.journeys[journey].primary;
    }
    return theme.colors.brand.primary;
  }};
  
  margin-left: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;