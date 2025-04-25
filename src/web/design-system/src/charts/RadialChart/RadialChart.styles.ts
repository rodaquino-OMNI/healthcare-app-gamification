import styled from 'styled-components';
import Box from '../../primitives/Box';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

/**
 * Main container for the RadialChart component.
 * Uses the Box primitive for consistent layout and spacing.
 */
export const ChartContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

/**
 * Wrapper for the actual chart SVG element.
 * Handles positioning and layout of the chart itself.
 */
export const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Component for displaying text and values in the center of donut charts.
 * Absolutely positioned to center of the parent chart.
 */
export const CenterLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/**
 * Container for chart legends.
 * Displays legend items in a column layout below the chart.
 */
export const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${spacing.md};
  width: 100%;
`;

/**
 * Individual legend item component.
 * Displays a color indicator followed by a label.
 */
export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing.sm};
  cursor: default;
`;

/**
 * Color indicator component for legends.
 * Displays a colored square representing a data series.
 */
export const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: ${spacing.sm};
  background-color: ${props => props.color || colors.neutral.gray300};
`;

/**
 * Text component for legend labels.
 * Displays the name and optional value for a data series.
 */
export const LegendText = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.neutral.gray800};
  display: flex;
  justify-content: space-between;
  width: 100%;
`;