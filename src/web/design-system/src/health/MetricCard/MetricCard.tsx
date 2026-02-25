import React from 'react';
import { Card } from '../../components/Card/Card';
import { Text } from '../../primitives/Text/Text';
import { Icon } from '../../primitives/Icon/Icon';
import { HealthChart } from '../HealthChart/HealthChart';
import { AchievementBadge } from '../../gamification/AchievementBadge/AchievementBadge';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';
import { sizing } from '../../tokens/sizing';

/**
 * Props for the MetricCard component
 */
export interface MetricCardProps {
  /**
   * The name of the health metric (e.g., Heart Rate, Blood Pressure).
   */
  metricName: string;
  
  /**
   * The value of the health metric.
   */
  value: string | number;
  
  /**
   * The unit of measurement for the health metric (e.g., bpm, mmHg).
   */
  unit: string;
  
  /**
   * The trend of the health metric (e.g., increasing, decreasing, stable).
   */
  trend?: string;
  
  /**
   * The journey context for theming the card.
   */
  journey: 'health' | 'care' | 'plan';
  
  /**
   * Whether to display a chart for the metric.
   */
  showChart?: boolean;
  
  /**
   * Optional click handler for the card.
   */
  onPress?: () => void;
}

/**
 * A reusable component for displaying health metrics with their values, units, and trends.
 * It supports journey-specific theming and integrates with the gamification system to display
 * achievement badges when appropriate.
 *
 * @example
 * ```jsx
 * <MetricCard
 *   metricName="Heart Rate"
 *   value={72}
 *   unit="bpm"
 *   trend="stable"
 *   journey="health"
 * />
 * ```
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  metricName,
  value,
  unit,
  trend,
  journey,
  showChart = false,
  onPress
}) => {
  // Determine the appropriate icon based on the metric name
  const getMetricIcon = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('heart') || lowerName.includes('pulse')) {
      return 'heart';
    } else if (lowerName.includes('blood pressure')) {
      return 'pulse';
    } else if (lowerName.includes('weight')) {
      return 'weight';
    } else if (lowerName.includes('sleep')) {
      return 'sleep';
    } else if (lowerName.includes('steps') || lowerName.includes('walk')) {
      return 'steps';
    } else if (lowerName.includes('glucose')) {
      return 'glucose';
    }
    // Default icon if no matches
    return 'pulse';
  };

  // Get trend icon and color
  const getTrendIcon = (trendValue?: string): { icon: string; color: string } => {
    if (!trendValue) return { icon: '', color: '' };
    
    const lowerTrend = trendValue.toLowerCase();
    if (lowerTrend.includes('up') || lowerTrend.includes('increase')) {
      return { icon: 'arrow-forward', color: colors.semantic.warning };
    } else if (lowerTrend.includes('down') || lowerTrend.includes('decrease')) {
      return { icon: 'arrow-back', color: colors.semantic.info };
    } else if (lowerTrend.includes('stable') || lowerTrend.includes('normal')) {
      return { icon: 'check', color: colors.semantic.success };
    }
    
    return { icon: 'info', color: colors.neutral.gray600 };
  };
  
  const trendInfo = getTrendIcon(trend);
  const metricIcon = getMetricIcon(metricName);
  const journeyColor = colors.journeys[journey];
  
  // Check if metric has achieved a goal or milestone for gamification
  const hasAchievement = trend?.toLowerCase().includes('record') || 
                         trend?.toLowerCase().includes('goal') || 
                         trend?.toLowerCase().includes('milestone');
  
  // Create mock achievement for demonstration (in a real app, this would come from props)
  const mockAchievement = hasAchievement ? {
    id: `${metricName.toLowerCase().replace(/\s/g, '-')}-achievement`,
    title: `${metricName} Achievement`,
    description: `Reached an achievement in ${metricName.toLowerCase()}`,
    icon: metricIcon,
    progress: 100,
    total: 100,
    unlocked: true,
    journey
  } : undefined;
  
  return (
    <Card 
      journey={journey}
      elevation="sm"
      onPress={onPress}
      interactive={!!onPress}
      padding="md"
      accessibilityLabel={`${metricName}: ${value} ${unit}${trend ? `, trend: ${trend}` : ''}`}
      data-testid="metric-card"
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: spacing.sm 
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          gap: spacing.xs 
        }}>
          <Icon 
            name={metricIcon} 
            color={journeyColor.primary}
            size={sizing.icon.md}
            aria-hidden="true"
          />
          <Text 
            fontWeight="medium"
            color="gray900"
          >
            {metricName}
          </Text>
        </div>
        
        {mockAchievement && (
          <AchievementBadge 
            achievement={mockAchievement}
            size="sm"
          />
        )}
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'baseline',
        marginBottom: trend ? spacing.sm : 0
      }}>
        <Text 
          fontSize="2xl"
          fontWeight="bold"
          color="gray900"
        >
          {value}
        </Text>
        <Text 
          fontSize="lg"
          color="gray600"
          style={{ marginLeft: spacing.xs }}
        >
          {unit}
        </Text>
      </div>
      
      {trend && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          gap: spacing.xs 
        }}>
          {trendInfo.icon && (
            <Icon 
              name={trendInfo.icon} 
              color={trendInfo.color}
              size={sizing.icon.xs}
              aria-hidden="true"
            />
          )}
          <Text 
            fontSize="sm"
            color={trendInfo.color || colors.neutral.gray600}
          >
            {trend}
          </Text>
        </div>
      )}
      
      {showChart && (
        <div style={{ marginTop: spacing.md }}>
          <HealthChart
            type="line"
            data={[
              { id: '1', type: 'metric', unit: unit, timestamp: new Date(Date.now() - 86400000 * 6).toISOString(), value: Number(value) * 0.85 },
              { id: '2', type: 'metric', unit: unit, timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), value: Number(value) * 0.9 },
              { id: '3', type: 'metric', unit: unit, timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), value: Number(value) * 0.82 },
              { id: '4', type: 'metric', unit: unit, timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), value: Number(value) * 0.95 },
              { id: '5', type: 'metric', unit: unit, timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), value: Number(value) * 0.88 },
              { id: '6', type: 'metric', unit: unit, timestamp: new Date(Date.now() - 86400000).toISOString(), value: Number(value) * 0.93 },
              { id: '7', type: 'metric', unit: unit, timestamp: new Date().toISOString(), value: Number(value) }
            ]}
            xAxisKey="timestamp"
            yAxisKey="value"
            journey={journey}
          />
        </div>
      )}
    </Card>
  );
};

export default MetricCard;