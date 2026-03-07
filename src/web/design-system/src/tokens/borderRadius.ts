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
 * 8-step scale (none → full):
 *   none(0), 2xs(2), xs(4), sm(6), md(8), lg(16), xl(24), 2xl(20), full(9999)
 *
 * Note: 2xs(2) is the hairline rounding used for compact UI elements.
 *       2xl(20) bridges xl(24) and lg(16) for cards and modals.
 */
export const borderRadiusValues = {
    none: 0, // No border radius (sharp corners)
    '2xs': 2, // Hairline rounding (compact elements, tags)
    xs: 4, // Extra small border radius
    sm: 6, // Small border radius
    md: 8, // Medium border radius
    lg: 16, // Large border radius
    '2xl': 20, // 2x-large border radius (cards, modals)
    xl: 24, // Extra large border radius
    full: 9999, // Full border radius (pill shape)
};

/**
 * Border radius values with pixel units
 * For direct use in styled-components and CSS
 */
export const borderRadius = {
    none: '0px', // No border radius (sharp corners)
    '2xs': '2px', // Hairline rounding (compact elements, tags)
    xs: '4px', // Extra small border radius
    sm: '6px', // Small border radius
    md: '8px', // Medium border radius
    lg: '16px', // Large border radius
    '2xl': '20px', // 2x-large border radius (cards, modals)
    xl: '24px', // Extra large border radius
    full: '9999px', // Full border radius (pill shape)
};
