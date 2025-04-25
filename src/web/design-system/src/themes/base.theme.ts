import * as tokens from '../tokens';

/**
 * Interface defining the structure of the theme
 */
export interface Theme {
  colors: {
    brand: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    journeys: {
      health: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
      };
      care: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
      };
      plan: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
      };
    };
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    neutral: {
      white: string;
      gray100: string;
      gray200: string;
      gray300: string;
      gray400: string;
      gray500: string;
      gray600: string;
      gray700: string;
      gray800: string;
      gray900: string;
      black: string;
    };
  };
  typography: {
    fontFamily: {
      base: string;
      heading: string;
      mono: string;
    };
    fontWeight: {
      regular: number;
      medium: number;
      bold: number;
    };
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    lineHeight: {
      tight: number;
      base: number;
      relaxed: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animation: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

/**
 * Base theme for the design system
 * Contains all global styles and common values derived from design tokens
 */
export const baseTheme: Theme = {
  colors: {
    brand: {
      primary: tokens.colors.brand.primary,
      secondary: tokens.colors.brand.secondary,
      tertiary: tokens.colors.brand.tertiary,
    },
    journeys: {
      health: {
        primary: tokens.colors.journeys.health.primary,
        secondary: tokens.colors.journeys.health.secondary,
        accent: tokens.colors.journeys.health.accent,
        background: tokens.colors.journeys.health.background,
      },
      care: {
        primary: tokens.colors.journeys.care.primary,
        secondary: tokens.colors.journeys.care.secondary,
        accent: tokens.colors.journeys.care.accent,
        background: tokens.colors.journeys.care.background,
      },
      plan: {
        primary: tokens.colors.journeys.plan.primary,
        secondary: tokens.colors.journeys.plan.secondary,
        accent: tokens.colors.journeys.plan.accent,
        background: tokens.colors.journeys.plan.background,
      },
    },
    semantic: {
      success: tokens.colors.semantic.success,
      warning: tokens.colors.semantic.warning,
      error: tokens.colors.semantic.error,
      info: tokens.colors.semantic.info,
    },
    neutral: {
      white: tokens.colors.neutral.white,
      gray100: tokens.colors.neutral.gray100,
      gray200: tokens.colors.neutral.gray200,
      gray300: tokens.colors.neutral.gray300,
      gray400: tokens.colors.neutral.gray400,
      gray500: tokens.colors.neutral.gray500,
      gray600: tokens.colors.neutral.gray600,
      gray700: tokens.colors.neutral.gray700,
      gray800: tokens.colors.neutral.gray800,
      gray900: tokens.colors.neutral.gray900,
      black: tokens.colors.neutral.black,
    },
  },
  typography: {
    fontFamily: {
      base: tokens.typography.fontFamily.base,
      heading: tokens.typography.fontFamily.heading,
      mono: tokens.typography.fontFamily.mono,
    },
    fontWeight: {
      regular: tokens.typography.fontWeight.regular,
      medium: tokens.typography.fontWeight.medium,
      bold: tokens.typography.fontWeight.bold,
    },
    fontSize: {
      xs: tokens.typography.fontSize.xs,
      sm: tokens.typography.fontSize.sm,
      md: tokens.typography.fontSize.md,
      lg: tokens.typography.fontSize.lg,
      xl: tokens.typography.fontSize.xl,
      '2xl': tokens.typography.fontSize['2xl'],
      '3xl': tokens.typography.fontSize['3xl'],
      '4xl': tokens.typography.fontSize['4xl'],
    },
    lineHeight: {
      tight: tokens.typography.lineHeight.tight,
      base: tokens.typography.lineHeight.base,
      relaxed: tokens.typography.lineHeight.relaxed,
    },
  },
  spacing: {
    xs: tokens.spacing.xs,
    sm: tokens.spacing.sm,
    md: tokens.spacing.md,
    lg: tokens.spacing.lg,
    xl: tokens.spacing.xl,
    '2xl': tokens.spacing['2xl'],
    '3xl': tokens.spacing['3xl'],
    '4xl': tokens.spacing['4xl'],
  },
  borderRadius: {
    sm: tokens.borderRadius.sm,
    md: tokens.borderRadius.md,
    lg: tokens.borderRadius.lg,
    xl: tokens.borderRadius.xl,
    full: tokens.borderRadius.full,
  },
  shadows: {
    sm: tokens.shadows.sm,
    md: tokens.shadows.md,
    lg: tokens.shadows.lg,
    xl: tokens.shadows.xl,
  },
  animation: {
    duration: {
      fast: tokens.animation.duration.fast,
      normal: tokens.animation.duration.normal,
      slow: tokens.animation.duration.slow,
    },
    easing: {
      easeIn: tokens.animation.easing.easeIn,
      easeOut: tokens.animation.easing.easeOut,
      easeInOut: tokens.animation.easing.easeInOut,
    },
  },
};