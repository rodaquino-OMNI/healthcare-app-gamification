import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMediaQuery } from '@mui/material';
import { Box } from '../../primitives/Box/Box';
import { Text } from '../../primitives/Text/Text';
import { breakpoints, colors, typography } from '../../tokens';

export interface BarChartProps {
  /**
   * Array of numeric values to display as bars
   */
  data: number[];
  
  /**
   * Array of labels for the x-axis categories
   */
  labels: string[];
  
  /**
   * Array of color values for the bars
   * If multiple colors are provided, the first color will be used
   */
  colors: string[];
  
  /**
   * Journey identifier for theming (health, care, plan)
   */
  journey: string;
  
  /**
   * Chart title
   */
  title: string;
}

/**
 * BarChart component for visualizing categorical data.
 * Uses Recharts library with the AUSTA design system styling.
 * 
 * @example
 * ```tsx
 * <BarChart
 *   data={[10, 20, 15, 30]}
 *   labels={['Jan', 'Feb', 'Mar', 'Apr']}
 *   colors={['#0ACF83']}
 *   journey="health"
 *   title="Monthly Activity"
 * />
 * ```
 */
export const BarChart: React.FC<BarChartProps> = ({
  data,
  labels,
  colors,
  journey,
  title,
}) => {
  // Check if screen is at least tablet sized
  const isTabletOrLarger = useMediaQuery(`(min-width: ${breakpoints.md})`);
  
  // Ensure data and labels have matching lengths by using the shorter length
  const dataLength = data.length;
  const labelsLength = labels.length;
  const minLength = Math.min(dataLength, labelsLength);
  
  // Create safe arrays with matching lengths
  const safeData = data.slice(0, minLength);
  const safeLabels = labels.slice(0, minLength);
  
  // Default color based on journey — uses design tokens
  const journeyKey = journey as keyof typeof colors.journeys;
  const defaultColor = colors.journeys[journeyKey]?.primary || colors.journeys.health.primary;
  
  // If no colors provided, use the default journey color
  const chartColor = colors && colors.length > 0 ? colors[0] : defaultColor;
  
  // Transform the data into the format expected by Recharts
  const chartData = safeLabels.map((label, index) => ({
    name: label,
    value: safeData[index] || 0,
  }));
  
  // Determine if we have long labels
  const hasLongLabels = safeLabels.some(label => label.length > 6);
  
  // Calculate responsive adjustments
  const labelAngle = isTabletOrLarger ? 0 : hasLongLabels ? -45 : 0;
  const labelAnchor = isTabletOrLarger ? 'middle' : hasLongLabels ? 'end' : 'middle';
  const labelHeight = hasLongLabels ? 60 : 40;
  
  // Create accessible description of the chart for screen readers
  const accessibleDescription = `${title ? `Bar chart titled ${title}. ` : ''}Chart displaying ${safeLabels.length} data points. ${safeLabels.map((label, index) => 
    `${label}: ${safeData[index].toLocaleString()}`
  ).join('. ')}.`;
  
  return (
    <Box 
      journey={journey}
      padding="md"
      borderRadius="md"
      boxShadow="sm"
      width="100%"
      data-testid="bar-chart"
      aria-labelledby={title ? "chart-title" : undefined}
      role="figure"
      aria-describedby="chart-description"
    >
      {title && (
        <Text 
          as="h3" 
          fontSize="lg" 
          fontWeight="medium" 
          journey={journey}
          marginBottom="md"
          id="chart-title"
        >
          {title}
        </Text>
      )}
      
      <ResponsiveContainer width="100%" height={isTabletOrLarger ? 300 : 250}>
        <ComposedChart
          data={chartData}
          margin={{
            top: 10,
            right: isTabletOrLarger ? 20 : 10,
            left: isTabletOrLarger ? 20 : 10,
            bottom: hasLongLabels ? (isTabletOrLarger ? 20 : 40) : 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: isTabletOrLarger ? 14 : 12, fontFamily: typography.fontFamily.body }}
            tickMargin={10}
            interval={chartData.length <= 6 ? 0 : 'auto'}
            angle={labelAngle}
            textAnchor={labelAnchor}
            height={labelHeight}
          />
          <YAxis
            tick={{ fontSize: isTabletOrLarger ? 14 : 12, fontFamily: typography.fontFamily.body }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toLocaleString()}`, '']}
            labelStyle={{ color: colors.neutral.gray900 }}
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
            }}
          />
          <Bar 
            dataKey="value" 
            fill={chartColor} 
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
            name=""
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Visually hidden description for screen readers */}
      <Text
        id="chart-description"
        as="p"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0'
        }}
      >
        {accessibleDescription}
      </Text>
    </Box>
  );
};