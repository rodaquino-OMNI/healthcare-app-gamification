import React from 'react';
import { useTheme } from 'styled-components';
import { ProgressBarContainer, ProgressBarFill } from './ProgressBar.styles';

/**
 * Props for the ProgressBar component
 */
export interface ProgressBarProps {
  /** Current progress value */
  current: number;
  /** Total value representing 100% progress */
  total: number;
  /** Journey context for theming (health, care, plan) */
  journey?: 'health' | 'care' | 'plan';
  /** Accessibility label */
  ariaLabel?: string;
  /** CSS class for styling */
  className?: string;
  /** Whether to show level markers */
  showLevels?: boolean;
  /** Array of level markers */
  levelMarkers?: number[];
  /** Size of the progress bar (sm, md, lg) */
  size?: 'sm' | 'md' | 'lg';
  /** Test ID for testing */
  testId?: string;
}

/**
 * Calculates the percentage of progress based on current and total values
 * @param current Current progress value
 * @param total Total value representing 100% progress
 * @returns Percentage value between 0 and 100
 */
const calculatePercentage = (current: number, total: number): number => {
  if (total <= 0) return 0;
  const percentage = (current / total) * 100;
  return Math.min(Math.max(percentage, 0), 100);
};

/**
 * A progress bar component that visualizes progress with journey-specific theming
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  journey = 'health',
  ariaLabel,
  className,
  showLevels = false,
  levelMarkers = [],
  size = 'md',
  testId,
}) => {
  const theme = useTheme();
  const progressPercentage = calculatePercentage(current, total);
  
  // Determine height based on size
  const getHeight = () => {
    switch (size) {
      case 'sm':
        return theme.spacing.xs;
      case 'lg':
        return theme.spacing.md;
      case 'md':
      default:
        return theme.spacing.sm;
    }
  };
  
  // Generate accessible label if not provided
  const accessibilityLabel = ariaLabel || `Progress: ${Math.round(progressPercentage)}%`;

  // Get marker color based on journey
  const getMarkerColor = () => {
    if (journey && theme.colors.journeys[journey]) {
      return theme.colors.journeys[journey].secondary;
    }
    return theme.colors.brand.secondary;
  };

  return (
    <ProgressBarContainer 
      className={className}
      role="progressbar"
      aria-valuenow={progressPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={accessibilityLabel}
      data-testid={testId}
      style={{ height: getHeight() }}
    >
      <ProgressBarFill 
        progress={progressPercentage}
        journey={journey}
      />
      
      {showLevels && levelMarkers.length > 0 && (
        <>
          {levelMarkers.map((marker, index) => {
            const markerPosition = calculatePercentage(marker, total);
            return (
              <div
                key={`marker-${index}`}
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: `${markerPosition}%`,
                  width: '2px',
                  height: '100%',
                  backgroundColor: getMarkerColor(),
                  zIndex: 2,
                }}
                aria-hidden="true"
              />
            );
          })}
        </>
      )}
    </ProgressBarContainer>
  );
};

export default ProgressBar;