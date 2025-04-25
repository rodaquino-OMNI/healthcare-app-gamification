/**
 * Raw numeric font size values in pixels, providing a scale from extra small to extra-extra-extra large.
 * These values can be used for programmatic calculations when raw numbers are needed.
 */
export const fontSizeValues = {
  xs: 12,  // Extra small text (captions, footnotes)
  sm: 14,  // Small text (secondary text, labels)
  md: 16,  // Medium text (body text - default)
  lg: 18,  // Large text (emphasized body text)
  xl: 20,  // Extra large text (subheadings, card titles)
  '2xl': 24, // 2x Extra large (section headers)
  '3xl': 30, // 3x Extra large (page titles)
  '4xl': 36, // 4x Extra large (hero text, major headings)
};

/**
 * Typography values defining font families, weights, sizes, line heights, and letter spacing 
 * for consistent text styling across all journeys of the AUSTA SuperApp.
 * 
 * These values support both Brazilian Portuguese and English content while maintaining
 * optimal readability and accessibility compliance.
 */
export const typography = {
  /**
   * Font families used throughout the application
   */
  fontFamily: {
    base: 'Roboto, sans-serif',     // Base text for all general content
    heading: 'Roboto, sans-serif',  // Headings and titles
    mono: 'Roboto Mono, monospace', // Monospaced text for code, metrics, etc.
  },
  
  /**
   * Font weights for different text styles
   * Following the Roboto font weight system
   */
  fontWeight: {
    regular: 400, // Regular weight for most text
    medium: 500,  // Medium weight for semi-emphasis and subheadings
    bold: 700,    // Bold weight for strong emphasis and headings
  },
  
  /**
   * Font sizes with pixel units
   * Follows a typographic scale for consistent visual hierarchy
   */
  fontSize: {
    xs: `${fontSizeValues.xs}px`,     // Extra small: 12px
    sm: `${fontSizeValues.sm}px`,     // Small: 14px
    md: `${fontSizeValues.md}px`,     // Medium: 16px (base)
    lg: `${fontSizeValues.lg}px`,     // Large: 18px
    xl: `${fontSizeValues.xl}px`,     // Extra large: 20px
    '2xl': `${fontSizeValues['2xl']}px`, // 2x Extra large: 24px
    '3xl': `${fontSizeValues['3xl']}px`, // 3x Extra large: 30px
    '4xl': `${fontSizeValues['4xl']}px`, // 4x Extra large: 36px
  },
  
  /**
   * Line heights for different text densities
   * Ensures proper readability and accessibility
   */
  lineHeight: {
    tight: 1.2,    // Tight spacing, good for headings and short text
    base: 1.5,     // Base spacing, optimal for body text and readability
    relaxed: 1.75, // Relaxed spacing, good for larger text and better readability
  },
  
  /**
   * Letter spacing for different text styles
   * Improves readability based on text size and purpose
   */
  letterSpacing: {
    tight: '-0.025em', // Tight letter spacing for headings and display text
    normal: '0',       // Normal letter spacing for body text
    wide: '0.025em',   // Wide letter spacing for improved legibility in small text
  },
};