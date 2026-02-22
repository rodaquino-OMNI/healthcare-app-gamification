import React from 'react';
import { VictoryPie } from 'victory';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { ChartContainer, ChartWrapper, CenterLabel } from './DonutChart.styles';

export interface DonutChartProps {
  data: Array<{ x: string; y: number }>;
  labelType?: 'percentage' | 'value' | 'label' | 'none';
  colorScale?: string[];
  journey?: 'health' | 'care' | 'plan';
  innerRadius?: number;
  centerLabel?: string;
  centerValue?: string;
}

const journeyColorScales: Record<string, string[]> = {
  health: [
    colors.journeys.health.primary,
    colors.journeys.health.secondary,
    colors.journeys.health.accent,
    colors.semantic.success,
    colors.semantic.info,
  ],
  care: [
    colors.journeys.care.primary,
    colors.journeys.care.secondary,
    colors.journeys.care.accent,
    colors.semantic.warning,
    colors.semantic.info,
  ],
  plan: [
    colors.journeys.plan.primary,
    colors.journeys.plan.secondary,
    colors.journeys.plan.accent,
    colors.semantic.info,
    colors.semantic.success,
  ],
};

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  labelType = 'percentage',
  colorScale,
  journey = 'health',
  innerRadius = 80,
  centerLabel,
  centerValue,
}) => {
  const total = data.reduce((sum, item) => sum + item.y, 0);
  const effectiveColorScale = colorScale || journeyColorScales[journey] || journeyColorScales.health;

  const getLabels = () => {
    switch (labelType) {
      case 'percentage':
        return ({ datum }: any) =>
          total > 0 ? `${Math.round((datum.y / total) * 100)}%` : '0%';
      case 'value':
        return ({ datum }: any) => String(datum.y);
      case 'label':
        return ({ datum }: any) => datum.x;
      case 'none':
        return () => '';
      default:
        return ({ datum }: any) =>
          total > 0 ? `${Math.round((datum.y / total) * 100)}%` : '0%';
    }
  };

  return (
    <ChartContainer role="figure" aria-label={`Donut chart with ${data.length} segments`}>
      <ChartWrapper aria-hidden="true">
        <VictoryPie
          data={data}
          colorScale={effectiveColorScale}
          labels={getLabels()}
          innerRadius={innerRadius}
          style={{
            labels: {
              fontSize: 12,
              fill: colors.neutral.gray800,
              fontFamily: typography.fontFamily.body,
            },
          }}
          animate={{ duration: 500 }}
        />
        {(centerLabel || centerValue) && (
          <CenterLabel>
            {centerValue && (
              <span style={{
                fontSize: typography.fontSize['heading-xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral.gray900,
              }}>
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span style={{
                fontSize: typography.fontSize['text-xs'],
                color: colors.neutral.gray600,
              }}>
                {centerLabel}
              </span>
            )}
          </CenterLabel>
        )}
      </ChartWrapper>
    </ChartContainer>
  );
};

export default DonutChart;
