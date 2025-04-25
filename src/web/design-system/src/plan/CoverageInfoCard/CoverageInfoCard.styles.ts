import styled from 'styled-components';
import { themeGet } from 'styled-system';

export const CoverageInfoCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.journeys.plan.background || '#F0F8FF'};
  border-radius: ${props => themeGet('borderRadius.lg')(props)};
  box-shadow: ${props => themeGet('shadows.md')(props)};
  overflow: hidden;
  margin-bottom: ${props => themeGet('spacing.md')(props)};
  border-left: 4px solid ${props => props.theme.colors.journeys.plan.primary || '#3A86FF'};
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => themeGet('shadows.lg')(props)};
  }

  @media (min-width: ${props => themeGet('breakpoints.md')(props)}) {
    flex-direction: column;
  }
`;

export const CoverageInfoCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => themeGet('spacing.md')(props)};
  border-bottom: 1px solid ${props => props.theme.colors.neutral.gray300};
  background-color: ${props => props.theme.colors.journeys.plan.background || '#F0F8FF'};
`;

export const CoverageInfoCardTitle = styled.h3`
  font-family: ${props => themeGet('typography.fontFamily.heading')(props)};
  font-size: ${props => themeGet('typography.fontSize.lg')(props)};
  font-weight: ${props => themeGet('typography.fontWeight.bold')(props)};
  color: ${props => props.theme.colors.journeys.plan.primary || '#3A86FF'};
  margin: 0;
  padding: 0;
`;

export const CoverageInfoCardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${props => themeGet('spacing.md')(props)};
  gap: ${props => themeGet('spacing.sm')(props)};
`;

export const CoverageInfoCardItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${props => themeGet('spacing.sm')(props)} 0;
  border-bottom: 1px solid ${props => props.theme.colors.neutral.gray200};
  
  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${props => themeGet('breakpoints.sm')(props)}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => themeGet('spacing.xs')(props)};
  }
`;

export const CoverageInfoCardLabel = styled.span`
  font-family: ${props => themeGet('typography.fontFamily.base')(props)};
  font-size: ${props => themeGet('typography.fontSize.sm')(props)};
  color: ${props => props.theme.colors.neutral.gray700};
  font-weight: ${props => themeGet('typography.fontWeight.medium')(props)};
`;

export const CoverageInfoCardValue = styled.span`
  font-family: ${props => themeGet('typography.fontFamily.base')(props)};
  font-size: ${props => themeGet('typography.fontSize.md')(props)};
  color: ${props => props.theme.colors.neutral.gray900};
  font-weight: ${props => themeGet('typography.fontWeight.bold')(props)};
  
  &.highlighted {
    color: ${props => props.theme.colors.journeys.plan.secondary || '#2D6FD9'};
  }
  
  &.covered {
    color: ${props => props.theme.colors.semantic.success || '#00C853'};
  }
  
  &.not-covered {
    color: ${props => props.theme.colors.semantic.error || '#FF3B30'};
  }
  
  &.partially-covered {
    color: ${props => props.theme.colors.semantic.warning || '#FFD600'};
  }
`;