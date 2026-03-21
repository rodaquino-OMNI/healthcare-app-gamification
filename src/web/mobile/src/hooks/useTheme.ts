/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- hook return type inferred */
/**
 * Theme hook that provides access to the current theme.
 * Wraps styled-components useTheme with proper typing.
 */

import { useTheme as useStyledTheme } from 'styled-components/native';

// ---------------------------------------------------------------------------
// AppTheme — fully self-contained explicit type for the object returned by
// this hook. Defined inline (not extending the DS Theme interface) so that
// eslint's TypeScript engine never encounters an "error"-typed intersection.
//
// Having an explicit return type eliminates @typescript-eslint/no-unsafe-*
// violations in every file that destructures `const { theme } = useTheme()`.
// ---------------------------------------------------------------------------

export interface AppThemeColors {
    // -- Brand -----------------------------------------------------------
    brand: {
        primary: string;
        secondary: string;
        tertiary: string;
    };

    // -- Full journey palettes -------------------------------------------
    journeys: {
        health: { primary: string; secondary: string; accent: string; background: string; text: string };
        care: { primary: string; secondary: string; accent: string; background: string; text: string };
        plan: { primary: string; secondary: string; accent: string; background: string; text: string };
    };

    // -- Journey shorthand (flat) — theme.colors.journey.health etc. -----
    journey: {
        health: string;
        care: string;
        plan: string;
    };

    // -- Semantic --------------------------------------------------------
    semantic: {
        success: string;
        warning: string;
        error: string;
        info: string;
        successBg: string;
        warningBg: string;
        errorBg: string;
    };

    // -- Gray scale ------------------------------------------------------
    gray: {
        0: string;
        5: string;
        10: string;
        20: string;
        30: string;
        40: string;
        50: string;
        60: string;
        70: string;
        [key: number]: string;
    };

    // -- Neutral (legacy aliases) ----------------------------------------
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

    // -- Semantic surface tokens -----------------------------------------
    background: {
        default: string;
        muted: string;
        subtle: string;
    };

    // -- Text tokens (DS names + legacy aliases) --------------------------
    text: {
        default: string;
        muted: string;
        subtle: string;
        onBrand: string;
        /** @deprecated alias for text.default */
        primary: string;
        /** @deprecated alias for text.muted */
        secondary: string;
    };

    // -- Border tokens ---------------------------------------------------
    border: {
        default: string;
        muted: string;
        accent: string;
    };

    // -- Gamification ----------------------------------------------------
    gamification: {
        primary: string;
        background: string;
    };
}

export interface AppTheme {
    colors: AppThemeColors;
    typography: {
        fontFamily: { base: string; heading: string; logo: string; mono: string };
        fontWeight: { regular: number; medium: number; bold: number };
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
        lineHeight: { tight: number; base: number; relaxed: number };
        letterSpacing: { tight: string; normal: string; wide: string; wider: string };
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
        component: { '2xs': string; xs: string; sm: string; md: string; lg: string; xl: string };
        icon: { '2xs': string; xs: string; sm: string; md: string; lg: string };
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
    shadows: { sm: string; md: string; lg: string; xl: string };
    animation: {
        duration: { fast: string; normal: string; slow: string };
        easing: { easeIn: string; easeOut: string; easeInOut: string };
    };
}

/** Return type of useTheme(). */
export interface UseThemeResult {
    theme: AppTheme;
    toggleTheme: () => void;
}

// ---------------------------------------------------------------------------
// Default fallback values — used when the ThemeProvider is not mounted or
// when a field is missing from the provided theme object.
// ---------------------------------------------------------------------------

const DEFAULT_COLORS: AppThemeColors = {
    brand: { primary: '#00c3f7', secondary: '#00dbbb', tertiary: '#6D2077' },
    journeys: {
        health: { primary: '#0ACF83', secondary: '#05A66A', accent: '#00875A', background: '#F0FFF4', text: '#1A1A1A' },
        care: { primary: '#FF8C42', secondary: '#F17C3A', accent: '#E55A00', background: '#FFF8F0', text: '#1A1A1A' },
        plan: { primary: '#3A86FF', secondary: '#2D6FD9', accent: '#0057E7', background: '#F0F8FF', text: '#1A1A1A' },
    },
    journey: { health: '#0ACF83', care: '#FF8C42', plan: '#3A86FF' },
    semantic: {
        success: '#7ab765',
        warning: '#f59e0b',
        error: '#e11d48',
        info: '#3b82f6',
        successBg: '#f0fdf4',
        warningBg: '#fffbeb',
        errorBg: '#fff1f2',
    },
    gray: {
        0: '#ffffff',
        5: '#f8fafc',
        10: '#f1f5f9',
        20: '#e2e8f0',
        30: '#cbd5e1',
        40: '#94a3b8',
        50: '#64748b',
        60: '#4b5563',
        70: '#334155',
    },
    neutral: {
        white: '#FFFFFF',
        gray100: '#f8fafc',
        gray200: '#f1f5f9',
        gray300: '#e2e8f0',
        gray400: '#cbd5e1',
        gray500: '#94a3b8',
        gray600: '#64748b',
        gray700: '#4b5563',
        gray800: '#334155',
        gray900: '#1a202c',
        black: '#000000',
    },
    background: { default: '#FFFFFF', muted: '#f8fafc', subtle: '#f1f5f9' },
    text: {
        default: '#334155',
        muted: '#4b5563',
        subtle: '#94a3b8',
        onBrand: '#ffffff',
        primary: '#334155',
        secondary: '#4b5563',
    },
    border: { default: '#e2e8f0', muted: '#f1f5f9', accent: '#00c3f7' },
    gamification: { primary: '#6C63FF', background: '#f0eeff' },
};

const DEFAULT_THEME: AppTheme = {
    colors: DEFAULT_COLORS,
    typography: {
        fontFamily: {
            base: 'Plus Jakarta Sans, sans-serif',
            heading: 'Plus Jakarta Sans, sans-serif',
            logo: 'Nunito, sans-serif',
            mono: 'Roboto Mono, monospace',
        },
        fontWeight: { regular: 400, medium: 500, bold: 700 },
        fontSize: {
            xs: '12px',
            sm: '14px',
            md: '16px',
            lg: '18px',
            xl: '20px',
            '2xl': '24px',
            '3xl': '30px',
            '4xl': '36px',
        },
        lineHeight: { tight: 1.1, base: 1.5, relaxed: 1.6 },
        letterSpacing: { tight: '-0.025em', normal: '0', wide: '0.025em', wider: '0.05em' },
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
        component: { '2xs': '16px', xs: '24px', sm: '32px', md: '40px', lg: '48px', xl: '64px' },
        icon: { '2xs': '12px', xs: '16px', sm: '20px', md: '24px', lg: '32px' },
    },
    borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '20px',
        full: '9999px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
        md: '0 4px 6px -1px rgba(0,0,0,0.1)',
        lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
        xl: '0 20px 25px -5px rgba(0,0,0,0.15)',
    },
    animation: {
        duration: { fast: '100ms', normal: '200ms', slow: '300ms' },
        easing: { easeIn: 'ease-in', easeOut: 'ease-out', easeInOut: 'ease-in-out' },
    },
};

/**
 * Merges a value from the raw styled-components theme with a typed fallback.
 * If `raw` is nullish or the property is missing, returns `fallback`.
 */
function pick<T>(raw: unknown, key: string, fallback: T): T {
    if (raw !== null && typeof raw === 'object' && key in raw) {
        return (raw as Record<string, unknown>)[key] as T;
    }
    return fallback;
}

/**
 * Custom hook that provides access to the current theme.
 * @returns Object containing the theme and toggleTheme function
 */
export function useTheme(): UseThemeResult {
    // useStyledTheme() returns DefaultTheme which may or may not be augmented.
    // Cast to unknown first, then build our AppTheme through typed helpers so
    // eslint never sees any `any` / `error`-typed member accesses.
    const raw: unknown = useStyledTheme();

    const rawColors: unknown = pick<unknown>(raw, 'colors', null);
    const rawJourneys: unknown = pick<unknown>(rawColors, 'journeys', null);
    const rawJourneysHealth: unknown = pick<unknown>(rawJourneys, 'health', null);
    const rawJourneysCare: unknown = pick<unknown>(rawJourneys, 'care', null);
    const rawJourneysPlan: unknown = pick<unknown>(rawJourneys, 'plan', null);

    const colors: AppThemeColors = {
        brand: {
            primary: pick<string>(pick<unknown>(rawColors, 'brand', null), 'primary', DEFAULT_COLORS.brand.primary),
            secondary: pick<string>(
                pick<unknown>(rawColors, 'brand', null),
                'secondary',
                DEFAULT_COLORS.brand.secondary
            ),
            tertiary: pick<string>(pick<unknown>(rawColors, 'brand', null), 'tertiary', DEFAULT_COLORS.brand.tertiary),
        },
        journeys: {
            health: {
                primary: pick<string>(rawJourneysHealth, 'primary', DEFAULT_COLORS.journeys.health.primary),
                secondary: pick<string>(rawJourneysHealth, 'secondary', DEFAULT_COLORS.journeys.health.secondary),
                accent: pick<string>(rawJourneysHealth, 'accent', DEFAULT_COLORS.journeys.health.accent),
                background: pick<string>(rawJourneysHealth, 'background', DEFAULT_COLORS.journeys.health.background),
                text: pick<string>(rawJourneysHealth, 'text', DEFAULT_COLORS.journeys.health.text),
            },
            care: {
                primary: pick<string>(rawJourneysCare, 'primary', DEFAULT_COLORS.journeys.care.primary),
                secondary: pick<string>(rawJourneysCare, 'secondary', DEFAULT_COLORS.journeys.care.secondary),
                accent: pick<string>(rawJourneysCare, 'accent', DEFAULT_COLORS.journeys.care.accent),
                background: pick<string>(rawJourneysCare, 'background', DEFAULT_COLORS.journeys.care.background),
                text: pick<string>(rawJourneysCare, 'text', DEFAULT_COLORS.journeys.care.text),
            },
            plan: {
                primary: pick<string>(rawJourneysPlan, 'primary', DEFAULT_COLORS.journeys.plan.primary),
                secondary: pick<string>(rawJourneysPlan, 'secondary', DEFAULT_COLORS.journeys.plan.secondary),
                accent: pick<string>(rawJourneysPlan, 'accent', DEFAULT_COLORS.journeys.plan.accent),
                background: pick<string>(rawJourneysPlan, 'background', DEFAULT_COLORS.journeys.plan.background),
                text: pick<string>(rawJourneysPlan, 'text', DEFAULT_COLORS.journeys.plan.text),
            },
        },
        // Flat journey shorthand — derived from journeys above.
        journey: {
            health: pick<string>(rawJourneysHealth, 'primary', DEFAULT_COLORS.journey.health),
            care: pick<string>(rawJourneysCare, 'primary', DEFAULT_COLORS.journey.care),
            plan: pick<string>(rawJourneysPlan, 'primary', DEFAULT_COLORS.journey.plan),
        },
        semantic: {
            success: pick<string>(
                pick<unknown>(rawColors, 'semantic', null),
                'success',
                DEFAULT_COLORS.semantic.success
            ),
            warning: pick<string>(
                pick<unknown>(rawColors, 'semantic', null),
                'warning',
                DEFAULT_COLORS.semantic.warning
            ),
            error: pick<string>(pick<unknown>(rawColors, 'semantic', null), 'error', DEFAULT_COLORS.semantic.error),
            info: pick<string>(pick<unknown>(rawColors, 'semantic', null), 'info', DEFAULT_COLORS.semantic.info),
            successBg: pick<string>(
                pick<unknown>(rawColors, 'semantic', null),
                'successBg',
                DEFAULT_COLORS.semantic.successBg
            ),
            warningBg: pick<string>(
                pick<unknown>(rawColors, 'semantic', null),
                'warningBg',
                DEFAULT_COLORS.semantic.warningBg
            ),
            errorBg: pick<string>(
                pick<unknown>(rawColors, 'semantic', null),
                'errorBg',
                DEFAULT_COLORS.semantic.errorBg
            ),
        },
        gray: pick<AppThemeColors['gray']>(rawColors, 'gray', DEFAULT_COLORS.gray),
        neutral: pick<AppThemeColors['neutral']>(rawColors, 'neutral', DEFAULT_COLORS.neutral),
        background: {
            default: pick<string>(
                pick<unknown>(rawColors, 'background', null),
                'default',
                DEFAULT_COLORS.background.default
            ),
            muted: pick<string>(pick<unknown>(rawColors, 'background', null), 'muted', DEFAULT_COLORS.background.muted),
            subtle: pick<string>(
                pick<unknown>(rawColors, 'background', null),
                'subtle',
                DEFAULT_COLORS.background.subtle
            ),
        },
        text: {
            default: pick<string>(pick<unknown>(rawColors, 'text', null), 'default', DEFAULT_COLORS.text.default),
            muted: pick<string>(pick<unknown>(rawColors, 'text', null), 'muted', DEFAULT_COLORS.text.muted),
            subtle: pick<string>(pick<unknown>(rawColors, 'text', null), 'subtle', DEFAULT_COLORS.text.subtle),
            onBrand: pick<string>(pick<unknown>(rawColors, 'text', null), 'onBrand', DEFAULT_COLORS.text.onBrand),
            primary: pick<string>(pick<unknown>(rawColors, 'text', null), 'default', DEFAULT_COLORS.text.primary),
            secondary: pick<string>(pick<unknown>(rawColors, 'text', null), 'muted', DEFAULT_COLORS.text.secondary),
        },
        border: {
            default: pick<string>(pick<unknown>(rawColors, 'border', null), 'default', DEFAULT_COLORS.border.default),
            muted: pick<string>(pick<unknown>(rawColors, 'border', null), 'muted', DEFAULT_COLORS.border.muted),
            accent: pick<string>(pick<unknown>(rawColors, 'border', null), 'accent', DEFAULT_COLORS.border.accent),
        },
        gamification: pick<AppThemeColors['gamification']>(rawColors, 'gamification', DEFAULT_COLORS.gamification),
    };

    const theme: AppTheme = {
        colors,
        typography: pick<AppTheme['typography']>(raw, 'typography', DEFAULT_THEME.typography),
        spacing: pick<AppTheme['spacing']>(raw, 'spacing', DEFAULT_THEME.spacing),
        sizing: pick<AppTheme['sizing']>(raw, 'sizing', DEFAULT_THEME.sizing),
        borderRadius: pick<AppTheme['borderRadius']>(raw, 'borderRadius', DEFAULT_THEME.borderRadius),
        shadows: pick<AppTheme['shadows']>(raw, 'shadows', DEFAULT_THEME.shadows),
        animation: pick<AppTheme['animation']>(raw, 'animation', DEFAULT_THEME.animation),
    };

    return {
        theme,
        toggleTheme: () => {
            // Theme toggle is handled by ThemeContext
        },
    };
}

export default useTheme;
