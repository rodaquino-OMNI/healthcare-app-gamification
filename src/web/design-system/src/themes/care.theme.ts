import { baseTheme } from '../base.theme';
import { colors } from '../../tokens/colors';

/**
 * Care Now journey theme
 * Extends the base theme with Care Now journey-specific styling
 * Care Now journey uses an orange color palette (#FF8C42) to provide
 * a distinct visual identity for the Care Now journey.
 */
export const careTheme = {
  ...baseTheme,
  name: 'Care Theme',
  journeyKey: 'care',
  
  // Override specific properties for Care journey
  colors: {
    ...baseTheme.colors,
    primary: colors.journeys.care.primary,
    secondary: colors.journeys.care.secondary,
    accent: colors.journeys.care.accent,
    background: colors.journeys.care.background,
    text: colors.journeys.care.text,
    border: colors.journeys.care.secondary,
    focus: colors.journeys.care.primary,
  },
  
  shadows: {
    ...baseTheme.shadows,
    focus: `0 0 0 2px ${colors.journeys.care.primary}`,
  },
  
  // Component-specific styling for Care journey
  components: {
    button: {
      primary: {
        background: colors.journeys.care.primary,
        color: colors.neutral.white,
        hoverBackground: colors.journeys.care.secondary,
        activeBackground: colors.journeys.care.accent,
      },
      secondary: {
        background: 'transparent',
        color: colors.journeys.care.primary,
        border: `1px solid ${colors.journeys.care.primary}`,
        hoverBackground: colors.journeys.care.background,
        activeBackground: colors.journeys.care.background,
      },
    },
    
    card: {
      background: colors.neutral.white,
      border: `1px solid ${colors.neutral.gray300}`,
      borderLeft: `4px solid ${colors.journeys.care.primary}`,
      borderRadius: '8px',
      shadow: baseTheme.shadows.sm,
    },
    
    input: {
      border: `1px solid ${colors.neutral.gray400}`,
      focusBorder: `1px solid ${colors.journeys.care.primary}`,
      background: colors.neutral.white,
      placeholderColor: colors.neutral.gray500,
    },
    
    progressBar: {
      background: colors.neutral.gray200,
      fill: colors.journeys.care.primary,
      borderRadius: '4px',
    },
    
    metricCard: {
      background: colors.neutral.white,
      border: `1px solid ${colors.neutral.gray300}`,
      borderTop: `4px solid ${colors.journeys.care.primary}`,
      borderRadius: '8px',
      shadow: baseTheme.shadows.sm,
      iconColor: colors.journeys.care.primary,
    },
    
    healthChart: {
      lineColor: colors.journeys.care.primary,
      gridColor: colors.neutral.gray300,
      labelColor: colors.neutral.gray600,
      axisColor: colors.neutral.gray400,
    },
  },
};