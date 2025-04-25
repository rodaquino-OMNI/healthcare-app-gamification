import React from 'react';
import { 
  VictoryChart, 
  VictoryLine, 
  VictoryAxis, 
  VictoryTheme, 
  VictoryScatter, 
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryLabel
} from 'victory';

import Box from '../../primitives/Box/Box';
import Text from '../../primitives/Text/Text';
import { colors } from '../../tokens/index';
import { ChartContainer, ChartWrapper } from './LineChart.styles';
import { useJourneyColor } from '@web/shared';

/**
 * Props interface for the LineChart component
 */
export interface LineChartProps {
  /**
   * The data to display in the chart
   */
  data: Array<any>;
  
  /**
   * The key in data objects to use for x-axis values
   */
  xAxisKey: string;
  
  /**
   * The key in data objects to use for y-axis values
   */
  yAxisKey: string;
  
  /**
   * Label for the x-axis
   */
  xAxisLabel?: string;
  
  /**
   * Label for the y-axis
   */
  yAxisLabel?: string;
  
  /**
   * Color for the line (optional, will use journey color if not provided)
   */
  lineColor?: string;
  
  /**
   * Journey context for theming (health, care, plan)
   */
  journey?: 'health' | 'care' | 'plan';
}

/**
 * LineChart component for visualizing time-series data.
 * Uses Victory charts to render data with customizable axes and styling.
 * Supports journey-specific theming.
 *
 * @example
 * // Basic usage with array of objects
 * <LineChart
 *   data={[
 *     { date: new Date('2023-01-01'), value: 10 },
 *     { date: new Date('2023-01-02'), value: 15 },
 *     { date: new Date('2023-01-03'), value: 12 }
 *   ]}
 *   xAxisKey="date"
 *   yAxisKey="value"
 *   xAxisLabel="Date"
 *   yAxisLabel="Value"
 *   journey="health"
 * />
 */
export const LineChart: React.FC<LineChartProps> = ({
  data,
  xAxisKey,
  yAxisKey,
  xAxisLabel,
  yAxisLabel,
  lineColor,
  journey = 'health'
}) => {
  // Get journey color or use direct access if hook is not available
  const journeyColor = useJourneyColor(journey);
  // Fallback to direct token access if hook is not available
  const chartColor = lineColor || journeyColor?.primary || colors.journeys[journey].primary;
  
  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <Text color="gray600" textAlign="center">No data available</Text>
      </ChartContainer>
    );
  }
  
  // Format data for Victory
  const formattedData = data.map(item => ({
    x: item[xAxisKey],
    y: item[yAxisKey],
    // Include original data for tooltip
    original: item
  }));
  
  // Determine if x-axis is date-based
  const isDateXAxis = formattedData.length > 0 && formattedData[0].x instanceof Date;
  
  // Format date for display
  const formatDate = (date: Date): string => {
    if (!(date instanceof Date)) return String(date);
    return date.toLocaleDateString();
  };
  
  // Custom tooltip content
  const tooltipContent = (d: any) => {
    const xValue = isDateXAxis ? formatDate(d.datum.x) : d.datum.x;
    return `${xValue}: ${d.datum.y}`;
  };
  
  return (
    <ChartContainer>
      {(xAxisLabel || yAxisLabel) && (
        <Box display="flex" justifyContent="space-between" marginBottom="md">
          {yAxisLabel && (
            <Text fontSize="sm" color="gray600" aria-hidden="true">{yAxisLabel}</Text>
          )}
          {xAxisLabel && (
            <Text fontSize="sm" color="gray600" aria-hidden="true">{xAxisLabel}</Text>
          )}
        </Box>
      )}
      
      <ChartWrapper
        role="img"
        aria-label={`Line chart showing ${yAxisLabel || 'data'} over ${xAxisLabel || 'time'}`}
      >
        <VictoryChart
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 50, left: 60, right: 20 }}
          domainPadding={{ x: [20, 20], y: [20, 20] }}
          height={300}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={tooltipContent}
              labelComponent={
                <VictoryTooltip
                  cornerRadius={5}
                  flyoutStyle={{
                    fill: colors.neutral.white,
                    stroke: colors.neutral.gray300,
                    strokeWidth: 1,
                  }}
                  style={{ fontSize: 12, fill: colors.neutral.gray900 }}
                />
              }
            />
          }
        >
          {/* Y Axis */}
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: colors.neutral.gray300 },
              tickLabels: { 
                fill: colors.neutral.gray700,
                fontSize: 12,
                padding: 5
              },
              grid: { 
                stroke: colors.neutral.gray200,
                strokeDasharray: '4, 4'
              }
            }}
            tickFormat={(t) => String(t)}
            axisLabelComponent={<VictoryLabel dy={-40} />}
            label={yAxisLabel}
          />
          
          {/* X Axis */}
          <VictoryAxis
            style={{
              axis: { stroke: colors.neutral.gray300 },
              tickLabels: { 
                fill: colors.neutral.gray700,
                fontSize: 12,
                padding: 5
              },
              grid: { 
                stroke: colors.neutral.gray200,
                strokeDasharray: '4, 4'
              }
            }}
            tickFormat={isDateXAxis ? formatDate : undefined}
            axisLabelComponent={<VictoryLabel dy={30} />}
            label={xAxisLabel}
          />
          
          {/* Data Line */}
          <VictoryLine
            data={formattedData}
            style={{
              data: { 
                stroke: chartColor,
                strokeWidth: 2
              }
            }}
            animate={{
              duration: 500,
              onLoad: { duration: 500 }
            }}
          />
          
          {/* Data Points */}
          <VictoryScatter
            data={formattedData}
            size={4}
            style={{
              data: {
                fill: colors.neutral.white,
                stroke: chartColor,
                strokeWidth: 2
              }
            }}
          />
        </VictoryChart>
      </ChartWrapper>
    </ChartContainer>
  );
};

export default LineChart;