/**
 * Border Radius Tokens
 *
 * Defines the border radius scale for the AUSTA SuperApp design system.
 * This file provides a consistent set of border radius values used throughout
 * the application for rounding corners on UI elements.
 */

/**
 * Raw numeric border radius values in pixels
 * Used for programmatic calculations and manipulations
 *
 * 12-step scale (none → full), aligned with Figma DS Variables:
 *   none(0), 3xs(1), 2xs(2), xs(4), sm(6), md(8), lg(16), xl(24), 2xl(32), 3xl(48), 4xl(64), full(9999)
 *
 * Note: 2xs(2) is the hairline rounding used for compact UI elements.
 */
export const borderRadiusValues = {
    none: 0, // No border radius (sharp corners)
    '3xs': 1, // Hairline micro-rounding (Figma core.json radius.3xs)
    '2xs': 2, // Hairline rounding (compact elements, tags)
    xs: 4, // Extra small border radius
    sm: 6, // Small border radius
    md: 8, // Medium border radius
    lg: 16, // Large border radius
    xl: 24, // Extra large border radius
    '2xl': 32, // 2x-large border radius (Figma radius-2xl — was 20, corrected to match Figma)
    '3xl': 48, // 3x-large border radius (Figma radius-3xl)
    '4xl': 64, // 4x-large border radius (Figma radius-4xl)
    full: 9999, // Full border radius (pill shape)
};

/**
 * Border radius values with pixel units
 * For direct use in styled-components and CSS
 */
export const borderRadius = {
    none: '0px', // No border radius (sharp corners)
    '3xs': '1px', // Hairline micro-rounding (Figma core.json radius.3xs)
    '2xs': '2px', // Hairline rounding (compact elements, tags)
    xs: '4px', // Extra small border radius
    sm: '6px', // Small border radius
    md: '8px', // Medium border radius
    lg: '16px', // Large border radius
    xl: '24px', // Extra large border radius
    '2xl': '32px', // 2x-large border radius (Figma radius-2xl — was 20px, corrected)
    '3xl': '48px', // 3x-large border radius (Figma radius-3xl)
    '4xl': '64px', // 4x-large border radius (Figma radius-4xl)
    full: '9999px', // Full border radius (pill shape)
};
