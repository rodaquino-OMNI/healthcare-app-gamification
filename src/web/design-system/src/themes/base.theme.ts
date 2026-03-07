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
                text: string;
            };
            care: {
                primary: string;
                secondary: string;
                accent: string;
                background: string;
                text: string;
            };
            plan: {
                primary: string;
                secondary: string;
                accent: string;
                background: string;
                text: string;
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
        background: {
            default: string;
            muted: string;
            subtle: string;
        };
        text: {
            default: string;
            muted: string;
            subtle: string;
            onBrand: string;
        };
        border: {
            default: string;
            muted: string;
            accent: string;
        };
    };
    typography: {
        fontFamily: {
            base: string;
            heading: string;
            logo: string;
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
        letterSpacing: {
            tight: string;
            normal: string;
            wide: string;
            wider: string;
        };
    };
    spacing: {
        '4xs': string;
        '3xs': string;
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
    sizing: {
        component: {
            '2xs': string;
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
        icon: {
            '2xs': string;
            xs: string;
            sm: string;
            md: string;
            lg: string;
        };
    };
    borderRadius: {
        none: string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
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
            primary: '#00c3f7',
            secondary: '#00dbbb',
            tertiary: tokens.colors.brand.tertiary,
        },
        journeys: {
            health: {
                primary: tokens.colors.journeys.health.primary,
                secondary: tokens.colors.journeys.health.secondary,
                accent: tokens.colors.journeys.health.accent,
                background: tokens.colors.journeys.health.background,
                text: tokens.colors.journeys.health.text,
            },
            care: {
                primary: tokens.colors.journeys.care.primary,
                secondary: tokens.colors.journeys.care.secondary,
                accent: tokens.colors.journeys.care.accent,
                background: tokens.colors.journeys.care.background,
                text: tokens.colors.journeys.care.text,
            },
            plan: {
                primary: tokens.colors.journeys.plan.primary,
                secondary: tokens.colors.journeys.plan.secondary,
                accent: tokens.colors.journeys.plan.accent,
                background: tokens.colors.journeys.plan.background,
                text: tokens.colors.journeys.plan.text,
            },
        },
        semantic: {
            success: '#7ab765',
            warning: '#f59e0b',
            error: '#e11d48',
            info: '#3b82f6',
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
        // Light mode semantic surface/text/border colors
        background: {
            default: '#ffffff',
            muted: '#f8fafc',
            subtle: '#f1f5f9',
        },
        text: {
            default: '#334155',
            muted: '#4b5563',
            subtle: '#94a3b8',
            onBrand: '#ffffff',
        },
        border: {
            default: '#e2e8f0',
            muted: '#f1f5f9',
            accent: '#00c3f7',
        },
    },
    typography: {
        fontFamily: {
            base: 'Plus Jakarta Sans, sans-serif',
            heading: 'Plus Jakarta Sans, sans-serif',
            logo: 'Nunito, sans-serif',
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
        letterSpacing: {
            tight: '-0.025em',
            normal: '0',
            wide: '0.025em',
            wider: '0.05em',
        },
    },
    spacing: {
        '4xs': '2px',
        '3xs': '4px',
        '2xs': '6px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '48px',
        '5xl': '64px',
        '6xl': '80px',
    },
    sizing: {
        component: {
            '2xs': '16px',
            xs: '24px',
            sm: '32px',
            md: '40px',
            lg: '48px',
            xl: '64px',
        },
        icon: {
            '2xs': '12px',
            xs: '16px',
            sm: '20px',
            md: '24px',
            lg: '32px',
        },
    },
    borderRadius: {
        none: tokens.borderRadius.none,
        xs: tokens.borderRadius['2xs'],
        sm: tokens.borderRadius.xs,
        md: tokens.borderRadius.md,
        lg: tokens.borderRadius.lg,
        xl: tokens.borderRadius.xl,
        '2xl': tokens.borderRadius['2xl'],
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
