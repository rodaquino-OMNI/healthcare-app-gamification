import styled from 'styled-components';
import { Text } from '../../primitives/Text';
import { Box } from '../../primitives/Box';
import { tokens as theme } from '../../tokens';

/**
 * The main container for the ClaimCard component.
 * Uses the Plan journey colors and styling.
 */
export const ClaimCardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  border-radius: ${theme.spacing.md};
  background-color: ${theme.colors.neutral.white};
  border-left: 4px solid ${theme.colors.journeys.plan.primary};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
  transition: box-shadow ${theme.animation.duration.normal} ${theme.animation.easing.easeInOut};
  
  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

/**
 * The header section of the ClaimCard component.
 * Contains the claim title and status.
 */
export const ClaimCardHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.neutral.gray200};
  background-color: ${theme.colors.journeys.plan.background};
`;

/**
 * The body section of the ClaimCard component.
 * Contains the main claim information.
 */
export const ClaimCardBody = styled(Box)`
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

/**
 * The footer section of the ClaimCard component.
 * Contains actions and additional information.
 */
export const ClaimCardFooter = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.neutral.gray200};
  background-color: ${theme.colors.neutral.gray100};
`;

/**
 * The text component for displaying the claim status.
 * Uses different colors based on the status.
 */
export const ClaimStatusText = styled(Text)<{ status: 'pending' | 'approved' | 'denied' | 'inReview' | 'moreInfo' }>`
  font-weight: ${theme.typography.fontWeight.medium};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.spacing.sm};
  display: inline-flex;
  align-items: center;
  
  ${({ status }) => {
    switch (status) {
      case 'approved':
        return `
          color: ${theme.colors.semantic.success};
          background-color: rgba(0, 200, 83, 0.1);
        `;
      case 'denied':
        return `
          color: ${theme.colors.semantic.error};
          background-color: rgba(255, 59, 48, 0.1);
        `;
      case 'pending':
        return `
          color: ${theme.colors.journeys.plan.primary};
          background-color: rgba(58, 134, 255, 0.1);
        `;
      case 'inReview':
        return `
          color: ${theme.colors.journeys.plan.accent};
          background-color: rgba(0, 87, 231, 0.1);
        `;
      case 'moreInfo':
        return `
          color: ${theme.colors.semantic.warning};
          background-color: rgba(255, 214, 0, 0.1);
        `;
      default:
        return '';
    }
  }}
`;