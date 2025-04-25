/**
 * Spacing Tokens
 * 
 * Defines the spacing scale for the AUSTA SuperApp design system.
 * This file provides a consistent set of spacing values used throughout
 * the application for margins, paddings, and layout spacing.
 * 
 * The spacing system follows an 8-point grid system with additional 
 * values for finer control.
 */

/**
 * Raw numeric spacing values in pixels
 * Used for programmatic calculations and manipulations
 */
export const spacingValues = {
  xs: 4,   // Extra small spacing
  sm: 8,   // Small spacing
  md: 16,  // Medium spacing
  lg: 24,  // Large spacing
  xl: 32,  // Extra large spacing
  '2xl': 48,  // 2x Extra large spacing
  '3xl': 64,  // 3x Extra large spacing
  '4xl': 96,  // 4x Extra large spacing
};

/**
 * Spacing values with pixel units
 * For direct use in styled-components and CSS
 */
export const spacing = {
  xs: '4px',    // Extra small spacing
  sm: '8px',    // Small spacing
  md: '16px',   // Medium spacing
  lg: '24px',   // Large spacing
  xl: '32px',   // Extra large spacing
  '2xl': '48px', // 2x Extra large spacing
  '3xl': '64px', // 3x Extra large spacing
  '4xl': '96px', // 4x Extra large spacing
};