/**
 * Color tokens for the AUSTA SuperApp design system.
 * Values updated from Figma DTCG source (core.json + light.json).
 *
 * The color system is organized into:
 * - Brand palette: Full brand color ramp from Figma core.json
 * - Brand: Core brand identity shorthand tokens
 * - Journeys: Colors specific to each user journey (Health, Care, Plan) — code-only
 * - Semantic: Colors that convey meaning (success, error, warning, info)
 * - Neutral / Gray scale: Slate-based values from Figma core.json
 */

/**
 * Full brand palette ramp from Figma core.json (colors.brand).
 * Use these for fine-grained color control or when you need a specific shade.
 */
export const brandPalette = {
    /** #edfbff — lightest background */
    50: '#edfbff',
    /** #ccf4ff — light background */
    100: '#ccf4ff',
    /** #a7e2f2 — light accent */
    200: '#a7e2f2',
    /** #00c3f7 — Azul AUSTA, PRIMARY brand color */
    300: '#00c3f7',
    /** #02b7e8 — hover/pressed state */
    400: '#02b7e8',
    /** #00a8d5 — dark accent */
    500: '#00a8d5',
} as const;

/**
 * Complete color palette for the AUSTA SuperApp
 */
export const colors = {
    /**
     * Primary brand colors that represent the AUSTA brand identity.
     * Updated from Figma core.json — brand.300 (#00c3f7) is the primary color,
     * accent.300 (#00dbbb) is the secondary color.
     */
    brand: {
        /** #00c3f7 — Azul AUSTA, primary brand color (was #0066CC) */
        primary: '#00c3f7',
        /** #00dbbb — Verde AUSTA, secondary brand color (was #00A3E0) */
        secondary: '#00dbbb',
        /** #6D2077 — tertiary brand color for accents (code-only extension) */
        tertiary: '#6D2077',
    },

    /**
     * Full brand color palette from Figma (50–500 ramp).
     * Sourced from core.json colors.brand.
     */
    brandPalette,

    /**
     * Journey-specific color palettes.
     * Code-only extensions — no Figma equivalents. Kept for backward compatibility.
     * Each journey has its own color scheme:
     * - My Health (Minha Saude): Green palette
     * - Care Now (Cuidar-me Agora): Orange palette
     * - My Plan (Meu Plano & Beneficios): Blue palette
     * - Community: Purple palette
     */
    journeys: {
        health: {
            primary: '#0ACF83', // Main health journey color (Green)
            secondary: '#05A66A', // Secondary health color
            accent: '#00875A', // Strong accent for highlights
            background: '#F0FFF4', // Light background
            text: '#1A1A1A', // Text on health backgrounds
        },
        care: {
            primary: '#FF8C42', // Main care journey color (Orange)
            secondary: '#F17C3A', // Secondary care color
            accent: '#E55A00', // Strong accent for highlights
            background: '#FFF8F0', // Light background
            text: '#1A1A1A', // Text on care backgrounds
        },
        plan: {
            primary: '#3A86FF', // Main plan journey color (Blue)
            secondary: '#2D6FD9', // Secondary plan color
            accent: '#0057E7', // Strong accent for highlights
            background: '#F0F8FF', // Light background
            text: '#1A1A1A', // Text on plan backgrounds
        },
        community: {
            primary: '#9F7AEA', // Main community journey color (Purple) — code-only extension
            secondary: '#805AD5',
            accent: '#6B46C1',
            background: '#FAF5FF',
            text: '#1A1A1A',
        },
    },

    /**
     * Semantic colors that convey specific meanings.
     * Updated from Figma core.json (colors.success, colors.warning, colors.destructive).
     */
    semantic: {
        /** #7ab765 — Figma success color (was #00C853) */
        success: '#7ab765',
        /** #f59e0b — Figma warning color (was #FFD600) */
        warning: '#f59e0b',
        /** #e11d48 — Figma destructive/error color (was #FF3B30) */
        error: '#e11d48',
        /** #3b82f6 — info color (was #0066CC) */
        info: '#3b82f6',

        // Background variants for semantic states (from Figma core.json)
        successBg: '#f0fdf4',
        warningBg: '#fffbeb',
        errorBg: '#fff1f2',
    },

    /**
     * Gray / neutral scale — Tailwind Slate values from Figma core.json (colors.gray, labeled 0–70).
     * These are the semantic step labels used by Figma light.json.
     */
    gray: {
        /** #ffffff — White */
        0: '#ffffff',
        /** #f8fafc — card backgrounds */
        5: '#f8fafc',
        /** #f1f5f9 — subtle bg */
        10: '#f1f5f9',
        /** #e2e8f0 — borders, separators */
        20: '#e2e8f0',
        /** #cbd5e1 — disabled, overlays */
        30: '#cbd5e1',
        /** #94a3b8 — placeholder text */
        40: '#94a3b8',
        /** #64748b — secondary text */
        50: '#64748b',
        /** #4b5563 — primary text / dark bg */
        60: '#4b5563',
        /** #334155 — darkest text / dark bg alt */
        70: '#334155',
    },

    /**
     * Gamification color palette.
     * Code-only extension — used across achievements, quests, rewards, and leaderboard pages.
     */
    gamification: {
        primary: '#6C63FF', // Main gamification accent (purple)
        background: '#f0eeff', // Light highlight background
    },

    /**
     * Neutral colors — kept as backward-compatible aliases pointing to Figma gray values.
     * @deprecated Use colors.gray scale or semantic tokens directly.
     * These will be removed in a future major version.
     */
    neutral: {
        white: '#FFFFFF',
        /** @deprecated Use colors.gray[5] */
        gray100: '#f8fafc',
        /** @deprecated Use colors.gray[10] */
        gray200: '#f1f5f9',
        /** @deprecated Use colors.gray[20] */
        gray300: '#e2e8f0',
        /** @deprecated Use colors.gray[30] */
        gray400: '#cbd5e1',
        /** @deprecated Use colors.gray[40] */
        gray500: '#94a3b8',
        /** @deprecated Use colors.gray[50] */
        gray600: '#64748b',
        /** @deprecated Use colors.gray[60] */
        gray700: '#4b5563',
        /** @deprecated Use colors.gray[70] */
        gray800: '#334155',
        gray900: '#1a202c',
        black: '#000000',
    },
} as const;

/**
 * Backward-compatible named export for journey colors.
 * Allows `import { journeys } from './tokens/colors'` in existing components.
 * @deprecated Use `colors.journeys` instead.
 */
export const journeys = colors.journeys;
