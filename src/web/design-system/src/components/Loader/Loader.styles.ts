import styled, { keyframes } from 'styled-components';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

export const SpinnerContainer = styled.div<{ size: string; journey?: string }>`
  width: ${props => props.size};
  height: ${props => props.size};
  border: 3px solid ${colors.neutral.gray300};
  border-top-color: ${colors.brand.primary};
  border-radius: ${borderRadius.full};
  animation: ${spin} 0.8s linear infinite;
`;

export const SkeletonBlock = styled.div<{ size: string }>`
  width: 100%;
  height: ${props => props.size};
  background-color: ${colors.neutral.gray300};
  border-radius: ${borderRadius.sm};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: ${spacing.xs};
  background-color: ${colors.neutral.gray300};
  border-radius: ${borderRadius.full};
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => Math.min(100, Math.max(0, props.progress))}%;
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.full};
  transition: width 0.3s ease-in-out;
`;
