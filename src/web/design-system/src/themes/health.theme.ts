import { baseTheme, Theme } from './base.theme';
import { colors } from '../tokens/colors';
import { borderRadius } from '../tokens/borderRadius';

/**
 * Health journey theme
 * Extends the base theme with Health journey-specific styling
 * Health journey uses a green color palette (#0ACF83) to provide
 * a distinct visual identity for the My Health (Minha Saude) journey.
 */
export const healthTheme = {
  ...baseTheme,
  name: 'Health Theme',
  journeyKey: 'health',

  // Override specific properties for Health journey
  colors: {
    ...baseTheme.colors,
    primary: colors.journeys.health.primary,
    secondary: colors.journeys.health.secondary,
    accent: colors.journeys.health.accent,
    background: {
      ...baseTheme.colors.background,
      default: colors.journeys.health.background,
    },
    text: {
      ...baseTheme.colors.text,
      default: colors.journeys.health.text,
    },
    border: {
      ...baseTheme.colors.border,
      default: colors.journeys.health.secondary,
      accent: colors.journeys.health.primary,
    },
    focus: colors.journeys.health.primary,
  },

  shadows: {
    ...baseTheme.shadows,
    focus: `0 0 0 2px ${colors.journeys.health.primary}`,
  },

  // Component-specific styling for Health journey
  components: {
    button: {
      primary: {
        background: colors.journeys.health.primary,
        color: colors.neutral.white,
        hoverBackground: colors.journeys.health.secondary,
        activeBackground: colors.journeys.health.accent,
      },
      secondary: {
        background: 'transparent',
        color: colors.journeys.health.primary,
        border: `1px solid ${colors.journeys.health.primary}`,
        hoverBackground: colors.journeys.health.background,
        activeBackground: colors.journeys.health.background,
      },
    },

    card: {
      background: colors.neutral.white,
      border: `1px solid ${colors.neutral.gray300}`,
      borderLeft: `4px solid ${colors.journeys.health.primary}`,
      borderRadius: borderRadius.md,
      shadow: baseTheme.shadows.sm,
    },

    input: {
      border: `1px solid ${colors.neutral.gray400}`,
      focusBorder: `1px solid ${colors.journeys.health.primary}`,
      background: colors.neutral.white,
      placeholderColor: colors.neutral.gray500,
    },

    progressBar: {
      background: colors.neutral.gray200,
      fill: colors.journeys.health.primary,
      borderRadius: borderRadius.xs,
    },

    metricCard: {
      background: colors.neutral.white,
      border: `1px solid ${colors.neutral.gray300}`,
      borderTop: `4px solid ${colors.journeys.health.primary}`,
      borderRadius: borderRadius.md,
      shadow: baseTheme.shadows.sm,
      iconColor: colors.journeys.health.primary,
    },

    healthChart: {
      lineColor: colors.journeys.health.primary,
      gridColor: colors.neutral.gray300,
      labelColor: colors.neutral.gray600,
      axisColor: colors.neutral.gray400,
    },
  },
};
