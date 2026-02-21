import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';
import { shadows } from '../../tokens/shadows';

export const DropZone = styled.div<{ isDragging: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  padding: ${spacing['2xl']} ${spacing.md};
  border: 2px dashed ${props => props.isDragging ? colors.brand.primary : colors.neutral.gray300};
  border-radius: ${borderRadius.lg};
  background-color: ${props => props.isDragging ? colors.neutral.gray100 : colors.neutral.white};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${colors.brand.primary};
  }
`;

export const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${colors.neutral.gray100};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.sm};
`;

export const ProgressInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${spacing['3xs']};
`;

export const ProgressBarTrack = styled.div`
  width: 100%;
  height: ${spacing['3xs']};
  background-color: ${colors.neutral.gray300};
  border-radius: ${borderRadius.full};
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.full};
  transition: width 0.3s ease-in-out;
`;

export const FileName = styled.span`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray900};
`;

export const StatusText = styled.span`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.xs};
  color: ${colors.neutral.gray500};
`;

export const ActionButton = styled.button`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.brand.primary};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${spacing['3xs']};

  &:hover {
    text-decoration: underline;
  }
`;

export const BrowseLink = styled.span`
  color: ${colors.brand.primary};
  font-weight: ${typography.fontWeight.semiBold};
  cursor: pointer;
  text-decoration: underline;
`;
