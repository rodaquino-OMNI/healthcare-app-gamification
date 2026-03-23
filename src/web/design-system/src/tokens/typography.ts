/**
 * Typography tokens for the AUSTA SuperApp design system.
 * Values updated from Figma DTCG source (core.json).
 *
 * Font families: Plus Jakarta Sans (heading + body), Nunito (logo).
 * Font sizes: Full Figma scale from display-lg (48px) through text-2xs (10px).
 * Line heights: As ratios (1.1 = 110%, 1.2 = 120%, 1.5 = 150%, 1.6 = 160%).
 * Letter spacing: em values matching Figma letterSpacing tokens.
 */

/**
 * Raw numeric font size values in pixels.
 * Sourced from Figma core.json fontSizes.
 * Used for programmatic calculations when raw numbers are needed.
 */
export const fontSizeValues = {
    // Legacy scale — kept for backward compatibility
    /** @deprecated Use display.lg (48) or heading.h1 (40) */
    xs: 12,
    /** @deprecated Use text.sm (14) */
    sm: 14,
    /** @deprecated Use text.md (16) */
    md: 16,
    /** @deprecated Use text.lg (18) */
    lg: 18,
    /** @deprecated Use text.xl (20) */
    xl: 20,
    /** @deprecated Use heading['2xl'] (24) */
    '2xl': 24,
    /** @deprecated Use display.sm (30) */
    '3xl': 30,
    /** @deprecated Use display.md (36) */
    '4xl': 36,
} as const;

/**
 * Typography values defining font families, weights, sizes, line heights, and letter spacing
 * for consistent text styling across all journeys of the AUSTA SuperApp.
 *
 * Updated from Figma DTCG core.json — primary font is Plus Jakarta Sans.
 */
export const typography = {
    /**
     * Font families used throughout the application.
     * Updated from Figma core.json fontFamilies.
     */
    fontFamily: {
        /** 'Plus Jakarta Sans, sans-serif' — heading text (was Roboto) */
        heading: 'Plus Jakarta Sans, sans-serif',
        /** 'Plus Jakarta Sans, sans-serif' — body/base text (was Roboto) */
        body: 'Plus Jakarta Sans, sans-serif',
        /**
         * Alias for body — kept for backward compatibility.
         * @deprecated Use fontFamily.body
         */
        base: 'Plus Jakarta Sans, sans-serif',
        /** 'Nunito, sans-serif' — AUSTA logo font (from Figma) */
        logo: 'Nunito, sans-serif',
        /** 'Roboto Mono, monospace' — code, metrics (code-only extension) */
        mono: 'Roboto Mono, monospace',
    },

    /**
     * Font weights for different text styles.
     * Sourced from Figma core.json fontWeights.
     */
    fontWeight: {
        /** 400 — Regular weight for most text */
        regular: 400,
        /** 500 — Medium weight for semi-emphasis */
        medium: 500,
        /** 600 — SemiBold weight (from Figma headingSemiBold / bodySemiBold) */
        semiBold: 600,
        /** 700 — Bold weight for headings and strong emphasis */
        bold: 700,
    },

    /**
     * Font sizes with pixel units.
     * Full Figma scale from core.json fontSizes.
     */
    fontSize: {
        // Display scale (from Figma)
        'display-xl': '60px', // display-xl — Heading xl/Bold from Figma
        'display-lg': '48px', // display-lg
        'display-md': '36px', // display-md
        'display-sm': '30px', // display-sm

        // Heading scale (from Figma)
        'heading-2xl': '28px', // heading-2xl
        'heading-xl': '24px', // heading-xl
        'heading-lg': '20px', // heading-lg
        'heading-md': '18px', // heading-md
        'heading-sm': '16px', // heading-sm
        'heading-xs': '14px', // heading-xs

        // Text / body scale (from Figma)
        'text-2xl': '22px', // text-2xl
        'text-xl': '20px', // text-xl
        'text-lg': '18px', // text-lg
        'text-md': '16px', // text-md (default body)
        'text-sm': '14px', // text-sm
        'text-xs': '12px', // text-xs
        'text-2xs': '10px', // text-2xs

        // Label and paragraph (from Figma)
        label: '12px',
        paragraph: '16px',

        // Legacy short-name aliases — backward compatible
        /** @deprecated Use 'text-xs' (12px) */
        xs: '12px',
        /** @deprecated Use 'text-sm' (14px) */
        sm: '14px',
        /** @deprecated Use 'text-md' (16px) */
        md: '16px',
        /** @deprecated Use 'text-lg' (18px) */
        lg: '18px',
        /** @deprecated Use 'text-xl' (20px) */
        xl: '20px',
        /** @deprecated Use 'heading-xl' (24px) */
        '2xl': '24px',
        /** @deprecated Use 'display-sm' (30px) */
        '3xl': '30px',
        /** @deprecated Use 'display-md' (36px) */
        '4xl': '36px',
    },

    /**
     * Named heading size aliases for convenience.
     * Matches h1–h6 convention from Figma core.json fontSizes.
     * Note: Figma h1=48, h2=36, h3=30, h4=24, h5=20, h6=16 (legacy numeric aliases).
     */
    heading: {
        h0: '60px', // Heading xl/Bold from Figma (display-xl)
        h1: '48px', // fontSizes.h1 from Figma
        h2: '36px', // fontSizes.h2 from Figma
        h3: '30px', // fontSizes.h3 from Figma
        h4: '24px', // fontSizes.h4 from Figma
        h5: '20px', // fontSizes.h5 from Figma
        h6: '16px', // fontSizes.h6 from Figma
    },

    /**
     * Line heights as unitless ratios.
     * Converted from Figma core.json lineHeights (% -> decimal).
     */
    lineHeight: {
        /** 1.133 — 68px / 60px, for display-xl (Heading xl from Figma) */
        display: 1.133,
        /** 1.1 — 110% tight, for display text */
        tight: 1.1,
        /** 1.2 — 120% heading line height */
        heading: 1.2,
        /** 1.375 — 22px / 16px, Figma Text md */
        body: 1.375,
        /** 1.333 — 24px / 18px, Figma Text lg */
        bodyLg: 1.333,
        /** 1.429 — 20px / 14px, Figma Text sm */
        bodySm: 1.429,
        /** 1.5 — 150% body line height (kept for backward compat) */
        base: 1.5,
        /** 1.6 — 160% relaxed (was 1.75, updated to match Figma lineHeights.relaxed=160%) */
        relaxed: 1.6,
    },

    /**
     * Letter spacing values.
     * Sourced from Figma core.json letterSpacing (using em equivalents).
     */
    letterSpacing: {
        /** '-0.044em' — tight, for headings (updated from Figma) */
        tight: '-0.044em',
        /** '-0.03em' — tighter than normal, for display/heading (was the old tight) */
        tighter: '-0.03em',
        /** '-0.03em' — display letter spacing from Figma Heading xl (-1.8px / 60px) */
        display: '-0.03em',
        /** '0' — normal, for body text */
        normal: '0',
        /** '0.025em' — wide, for improved legibility in small text */
        wide: '0.025em',
        /** '0.05em' — wider, for all-caps labels (code-only extension) */
        wider: '0.05em',
    },
} as const;

/**
 * Backward-compatible named export for font sizes.
 * Allows `import { fontSize } from './tokens/typography'` in existing components.
 * @deprecated Use `typography.fontSize` instead.
 */
export const fontSize = typography.fontSize;

/**
 * Native (React Native / iOS / Android) font-family mappings.
 * Uses exact PostScript names registered via expo-font in App.tsx.
 * Web consumers should continue using `typography.fontFamily`.
 */
export const fontFamilyNative = {
    /** PlusJakartaSans-SemiBold — heading text on native */
    heading: 'PlusJakartaSans-SemiBold',
    /** PlusJakartaSans-Regular — body text on native */
    body: 'PlusJakartaSans-Regular',
    /** PlusJakartaSans-Regular — alias for body (backward compat) */
    base: 'PlusJakartaSans-Regular',
    /** Nunito-Bold — logo text on native */
    logo: 'Nunito-Bold',
} as const;

/**
 * Maps numeric font weights to the exact loaded font name (PostScript name).
 * Use this in React Native to resolve fontWeight to the correct font file,
 * since iOS requires explicit font filenames per weight.
 */
export const fontFamilyByWeight = {
    400: 'PlusJakartaSans-Regular',
    500: 'PlusJakartaSans-Medium',
    600: 'PlusJakartaSans-SemiBold',
    700: 'PlusJakartaSans-Bold',
} as const;
