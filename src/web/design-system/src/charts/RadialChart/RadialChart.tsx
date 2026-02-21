import React from 'react';
import { VictoryPie } from 'victory';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { ChartContainer, ChartWrapper } from './RadialChart.styles';

export interface RadialChartProps {
  data: Array<{ x: string; y: number }>;
  labelType?: 'percentage' | 'value' | 'label' | 'none';
  colorScale?: string[];
  journey?: 'health' | 'care' | 'plan';
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

export const RadialChart: React.FC<RadialChartProps> = ({
  data,
  labelType = 'percentage',
  colorScale,
  journey = 'health',
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
    <ChartContainer>
      <ChartWrapper aria-label={`Radial chart with ${data.length} segments`}>
        <VictoryPie
          data={data}
          colorScale={effectiveColorScale}
          labels={getLabels()}
          style={{
            labels: {
              fontSize: 12,
              fill: colors.neutral.gray800,
              fontFamily: typography.fontFamily.body,
            },
          }}
          animate={{ duration: 500 }}
        />
      </ChartWrapper>
    </ChartContainer>
  );
};

export default RadialChart;
