import { baseTheme, Theme } from './base.theme';

/**
 * Dark Theme
 *
 * Provides a dark color scheme for the AUSTA SuperApp design system.
 * Semantic surface, text, and border colors are derived from the Figma dark.json
 * token definitions, which map to the following resolved hex values:
 *
 *   fg.default     -> colors.white         -> #FFFFFF   (primary text on dark)
 *   fg.muted       -> colors.gray.30       -> #CBD5E1   (secondary text on dark)
 *   fg.subtle      -> colors.gray.40       -> #94A3B8   (placeholder on dark)
 *   bg.default     -> colors.gray.70       -> #334155   (dark page background)
 *   bg.muted       -> colors.gray.60       -> #4B5563   (dark card background)
 *   bg.subtle      -> colors.gray.50       -> #64748B   (dark subtle sections)
 *   border.default -> colors.gray.50       -> #64748B
 *   border.muted   -> colors.gray.60       -> #4B5563
 *   border.accent  -> colors.brand.300     -> #00C3F7
 *   accent.default -> colors.brand.300     -> #00C3F7
 *   accent.secondary -> colors.accent.300  -> #00DBBB
 *   semantic.destructive -> colors.destructive.500 -> #E11D48
 *   semantic.warning     -> colors.warning.500     -> #F59E0B
 *   semantic.success     -> colors.success.500     -> #7AB765
 *   shadows.default -> rgba(black, 0.4)
 */
export const darkTheme: Theme = {
    ...baseTheme,

    colors: {
        ...baseTheme.colors,

        // Brand colors remain the same in dark mode
        brand: {
            primary: '#00c3f7',
            secondary: '#00dbbb',
            tertiary: baseTheme.colors.brand.tertiary,
        },

        // Semantic status colors — same hues, slightly adjusted for dark readability
        semantic: {
            success: '#7ab765',
            warning: '#f59e0b',
            error: '#e11d48',
            info: '#3b82f6',
        },

        // Dark mode surface colors (from dark.json bg tokens)
        background: {
            default: '#334155', // bg.default -> colors.gray.70
            muted: '#4b5563', // bg.muted   -> colors.gray.60
            subtle: '#64748b', // bg.subtle  -> colors.gray.50
        },

        // Dark mode text colors (from dark.json fg tokens)
        text: {
            default: '#ffffff', // fg.default -> colors.white
            muted: '#cbd5e1', // fg.muted   -> colors.gray.30
            subtle: '#94a3b8', // fg.subtle  -> colors.gray.40
            onBrand: '#ffffff', // fg.onBrand -> colors.white
        },

        // Dark mode border colors (from dark.json border tokens)
        border: {
            default: '#64748b', // border.default -> colors.gray.50
            muted: '#4b5563', // border.muted   -> colors.gray.60
            accent: '#00c3f7', // border.accent  -> colors.brand.300
        },

        // Journey colors — retain light-mode journey palettes on dark backgrounds
        // so each journey retains its distinct identity
        journeys: {
            ...baseTheme.colors.journeys,
        },

        // Neutral palette stays the same; consumers pick appropriate values
        neutral: {
            ...baseTheme.colors.neutral,
        },
    },

    // Elevate shadow opacity in dark mode for better contrast
    shadows: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.5)',
        md: '0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.5)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.5)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.5), 0 10px 10px rgba(0, 0, 0, 0.4)',
    },
};
