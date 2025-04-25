import styled from 'styled-components';
import type { ThemeType } from 'styled-components';

export const SymptomSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.journeys.care.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  width: 100%;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const SymptomList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.neutral.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  width: 100%;
  
  /* Scrollbar styling for webkit browsers */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral.gray200};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.journeys.care.secondary};
    border-radius: 4px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    max-height: 400px;
  }
`;

export const SymptomItem = styled.li<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ selected, theme }) => selected 
    ? `${theme.colors.journeys.care.primary}20`  // 20% opacity
    : theme.colors.neutral.white};
  border: 1px solid ${({ selected, theme }) => selected 
    ? theme.colors.journeys.care.primary
    : theme.colors.neutral.gray300};
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none; // Prevent text selection during clicking

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.journeys.care.primary}10`}; // 10% opacity
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.journeys.care.primary};
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  /* Add checkmark for selected items */
  ${({ selected, theme }) => selected && `
    &::before {
      content: '✓';
      color: ${theme.colors.journeys.care.primary};
      margin-right: ${theme.spacing.xs};
      font-weight: ${theme.typography.fontWeight.bold};
    }
  `}
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  }
`;

export const SymptomLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral.gray900};
  margin-left: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;