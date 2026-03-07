/**
 * Shadow tokens for the AUSTA SuperApp design system.
 * Values updated from Figma DTCG source (theme.json boxShadow section).
 *
 * Figma shadow tokens:
 *   sm:      0 1px 2px 0 rgba(0,0,0,0.05)        [unchanged]
 *   default: 0 4px 6px -1px rgba(0,0,0,0.1)      [spread updated from 0 -> -1]
 *   lg:      0 10px 15px -3px rgba(0,0,0,0.1)     [spread updated from 0 -> -3]
 *
 * Code-only extensions (no Figma equivalent):
 *   xl: retained as code-only for maximum elevation use cases
 */

export const shadows = {
    /**
     * Small shadow — subtle elevation.
     * From Figma theme.json boxShadow.sm: x:0 y:1 blur:2 spread:0 rgba(0,0,0,0.05)
     * Used for buttons, cards, and slightly elevated components.
     */
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

    /**
     * Medium / default shadow — moderate elevation.
     * From Figma theme.json boxShadow.default: x:0 y:4 blur:6 spread:-1 rgba(0,0,0,0.1)
     * Spread fixed to -1 to match Figma (was 0).
     * Used for dropdowns, popovers, and floating components.
     */
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',

    /**
     * Large shadow — significant elevation.
     * From Figma theme.json boxShadow.lg: x:0 y:10 blur:15 spread:-3 rgba(0,0,0,0.1)
     * Spread fixed to -3 to match Figma (was 0).
     * Used for modal dialogs, sidebars, and prominent UI elements.
     */
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',

    /**
     * Extra large shadow — maximum elevation.
     * Code-only extension — no Figma equivalent.
     * Used for onboarding spotlights, notifications, and maximum-emphasis elements.
     */
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
} as const;
