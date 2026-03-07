/**
 * Spacing Tokens
 *
 * Defines the spacing scale for the AUSTA SuperApp design system.
 * Updated to Figma's 13-step scale from core.json (spacing section).
 *
 * Old scale: xs(4), sm(8), md(16), lg(24), xl(32), 2xl(48), 3xl(64), 4xl(96)
 * New scale:  4xs(2), 3xs(4), 2xs(6), xs(8), sm(12), md(16), lg(20), xl(24),
 *             2xl(32), 3xl(40), 4xl(48), 5xl(64), 6xl(80)
 *
 * Migration notes:
 *   - Old xs(4)  -> new 3xs(4)
 *   - Old sm(8)  -> new xs(8)  [renamed]
 *   - Old md(16) -> new md(16) [same]
 *   - Old lg(24) -> new xl(24) [renamed]
 *   - Old xl(32) -> new 2xl(32) [renamed]
 *   - Old 2xl(48) -> new 4xl(48) [renamed]
 *   - Old 3xl(64) -> new 5xl(64) [renamed]
 *   - Old 4xl(96) -> removed (no Figma equivalent)
 */

/**
 * Raw numeric spacing values in pixels.
 * Sourced from Figma core.json spacing section.
 */
export const spacingValues = {
    // Figma 13-step scale
    '4xs': 2, // spacing.4xs
    '3xs': 4, // spacing.3xs
    '2xs': 6, // spacing.2xs
    xs: 8, // spacing.xs
    sm: 12, // spacing.sm
    md: 16, // spacing.md
    lg: 20, // spacing.lg
    xl: 24, // spacing.xl
    '2xl': 32, // spacing.2xl
    '3xl': 40, // spacing.3xl
    '4xl': 48, // spacing.4xl
    '5xl': 64, // spacing.5xl
    '6xl': 80, // spacing.6xl
} as const;

/**
 * Spacing values with pixel units.
 * Sourced from Figma core.json spacing section.
 * For direct use in styled-components and CSS.
 */
export const spacing = {
    // Figma 13-step scale
    '4xs': '2px', // spacing.4xs
    '3xs': '4px', // spacing.3xs
    '2xs': '6px', // spacing.2xs
    xs: '8px', // spacing.xs
    sm: '12px', // spacing.sm
    md: '16px', // spacing.md
    lg: '20px', // spacing.lg
    xl: '24px', // spacing.xl
    '2xl': '32px', // spacing.2xl
    '3xl': '40px', // spacing.3xl
    '4xl': '48px', // spacing.4xl
    '5xl': '64px', // spacing.5xl
    '6xl': '80px', // spacing.6xl
} as const;

/**
 * Backward-compatibility aliases for consumers still using the old scale names.
 * @deprecated Map to new Figma-aligned names using the migration notes above.
 *
 * Old name -> New name  (value unchanged unless noted)
 *   xs     -> 3xs       (4px, same value)
 *   sm     -> xs        (8px, same value — old sm was 8, new xs is 8)
 *   md     -> md        (16px, unchanged)
 *   lg     -> xl        (24px, same value)
 *   xl     -> 2xl       (32px, same value)
 *   2xl    -> 4xl       (48px, same value)
 *   3xl    -> 5xl       (64px, same value)
 *   4xl    -> removed   (96px, no Figma equivalent)
 */
export const spacingCompat = {
    /** @deprecated Use spacing['3xs'] (4px) */
    xs: spacing['3xs'],
    /** @deprecated Use spacing.xs (8px) */
    sm: spacing.xs,
    /** md is unchanged at 16px */
    md: spacing.md,
    /** @deprecated Use spacing.xl (24px) */
    lg: spacing.xl,
    /** @deprecated Use spacing['2xl'] (32px) */
    xl: spacing['2xl'],
    /** @deprecated Use spacing['4xl'] (48px) */
    '2xl': spacing['4xl'],
    /** @deprecated Use spacing['5xl'] (64px) */
    '3xl': spacing['5xl'],
} as const;
