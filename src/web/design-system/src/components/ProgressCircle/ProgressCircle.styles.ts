import styled, { css } from 'styled-components';
import { colors } from '../../../tokens/colors';
import { animation } from '../../../tokens/animation';

/**
 * Props for the circle container
 */
export interface CircleContainerProps {
  size: number;
}

/**
 * Props for the SVG element
 */
export interface CircleSVGProps {
  size: number;
}

/**
 * Props for the background circle
 */
export interface CircleBackgroundProps {
  size: number;
  strokeWidth: number;
  color: string;
}

/**
 * Props for the progress circle
 */
export interface CircleProgressProps {
  size: number;
  strokeWidth: number;
  progress: number;
  color: string;
  journey: string;
}

/**
 * Props for the text element
 */
export interface CircleTextProps {
  color: string;
}

/**
 * Container component for the progress circle
 * Handles positioning and dimensions
 */
export const CircleContainer = styled.div<CircleContainerProps>`
  position: relative;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * SVG element that renders the circular progress indicator
 */
export const CircleSVG = styled.svg<CircleSVGProps>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  transform: rotate(-90deg); /* Start progress from the top */
`;

/**
 * Background circle element
 * Represents the empty/background part of the progress circle
 */
export const CircleBackground = styled.circle<CircleBackgroundProps>`
  cx: ${({ size }) => size / 2}px;
  cy: ${({ size }) => size / 2}px;
  r: ${({ size, strokeWidth }) => (size - strokeWidth) / 2}px;
  fill: none;
  stroke: ${({ color }) => color || colors.neutral.gray200};
  stroke-width: ${({ strokeWidth }) => strokeWidth}px;
`;

/**
 * Progress circle element
 * Represents the filled/progress part of the progress circle
 */
export const CircleProgress = styled.circle<CircleProgressProps>`
  cx: ${({ size }) => size / 2}px;
  cy: ${({ size }) => size / 2}px;
  r: ${({ size, strokeWidth }) => (size - strokeWidth) / 2}px;
  fill: none;
  stroke: ${({ color, journey }) => {
    // Use provided color if available
    if (color) return color;
    
    // Otherwise use journey color if valid journey provided
    if (journey && colors.journeys[journey]) {
      return colors.journeys[journey].primary;
    }
    
    // Fallback to default color
    return colors.brand.primary;
  }};
  stroke-width: ${({ strokeWidth }) => strokeWidth}px;
  stroke-linecap: round;
  stroke-dasharray: ${({ size, strokeWidth }) => {
    const circumference = 2 * Math.PI * ((size - strokeWidth) / 2);
    return `${circumference}px ${circumference}px`;
  }};
  stroke-dashoffset: ${({ size, strokeWidth, progress }) => {
    const circumference = 2 * Math.PI * ((size - strokeWidth) / 2);
    const progressValue = Math.min(Math.max(progress, 0), 100); // Clamp progress between 0-100
    return `${circumference - (progressValue / 100) * circumference}px`;
  }};
  transition: stroke-dashoffset ${animation.duration.normal} ${animation.easing.easeInOut};
`;

/**
 * Text component that displays the percentage in the center of the circle
 */
export const CircleText = styled.text<CircleTextProps>`
  transform: rotate(90deg); /* Correct orientation for text */
  text-anchor: middle;
  dominant-baseline: middle;
  font-size: 16px;
  font-weight: bold;
  fill: ${({ color }) => color || colors.neutral.gray900};
`;