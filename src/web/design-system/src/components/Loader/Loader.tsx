import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';

export interface LoaderProps {
  variant?: 'spinner' | 'skeleton' | 'progress';
  size?: 'sm' | 'md' | 'lg';
  progress?: number;
  journey?: 'health' | 'care' | 'plan';
  accessibilityLabel?: string;
}

const sizeMap = {
  sm: spacing.md,
  md: spacing['2xl'],
  lg: spacing['4xl'],
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const SpinnerContainer = styled.div<{ size: string; journey?: string }>`
  width: ${props => props.size};
  height: ${props => props.size};
  border: 3px solid ${colors.neutral.gray300};
  border-top-color: ${props => {
    const j = props.journey;
    if (j && colors.journeys[j as keyof typeof colors.journeys]) {
      return colors.journeys[j as keyof typeof colors.journeys].primary;
    }
    return colors.brand.primary;
  }};
  border-radius: ${borderRadius.full};
  animation: ${spin} 0.8s linear infinite;
`;

const SkeletonBlock = styled.div<{ size: string }>`
  width: 100%;
  height: ${props => props.size};
  background-color: ${colors.neutral.gray300};
  border-radius: ${borderRadius.sm};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: ${spacing.xs};
  background-color: ${colors.neutral.gray300};
  border-radius: ${borderRadius.full};
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ progress: number; journey?: string }>`
  height: 100%;
  width: ${props => Math.min(100, Math.max(0, props.progress))}%;
  background-color: ${props => {
    const j = props.journey;
    if (j && colors.journeys[j as keyof typeof colors.journeys]) {
      return colors.journeys[j as keyof typeof colors.journeys].primary;
    }
    return colors.brand.primary;
  }};
  border-radius: ${borderRadius.full};
  transition: width 0.3s ease-in-out;
`;

export const Loader: React.FC<LoaderProps> = ({
  variant = 'spinner',
  size = 'md',
  progress = 0,
  journey,
  accessibilityLabel = 'Loading',
}) => {
  if (variant === 'skeleton') {
    return (
      <SkeletonBlock
        size={sizeMap[size]}
        role="progressbar"
        aria-label={accessibilityLabel}
        data-testid="loader-skeleton"
      />
    );
  }

  if (variant === 'progress') {
    return (
      <ProgressBarContainer
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={accessibilityLabel}
        data-testid="loader-progress"
      >
        <ProgressBarFill progress={progress} journey={journey} data-testid="loader-progress-fill" />
      </ProgressBarContainer>
    );
  }

  return (
    <SpinnerContainer
      size={sizeMap[size]}
      journey={journey}
      role="progressbar"
      aria-label={accessibilityLabel}
      data-testid="loader-spinner"
    />
  );
};
