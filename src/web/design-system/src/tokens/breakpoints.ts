/**
 * Breakpoint tokens for the AUSTA SuperApp design system
 * 
 * These tokens define the responsive breakpoints used throughout the application
 * to ensure consistent behavior across different screen sizes and devices.
 * 
 * The breakpoint system follows these target devices:
 * - xs: Small phones (<576px)
 * - sm: Large phones (576px-767px)
 * - md: Tablets (768px-991px)
 * - lg: Small desktops/laptops (992px-1199px)
 * - xl: Large desktops (≥1200px)
 */

/**
 * Numerical values for breakpoints (without units)
 * These can be used in calculations or when raw numbers are needed
 */
export const breakpointValues = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1440
};

/**
 * String values for breakpoints (with px units)
 * These can be used directly in CSS properties
 */
export const breakpoints = {
  xs: '576px',
  sm: '768px',
  md: '992px',
  lg: '1200px',
  xl: '1440px'
};

/**
 * Media query strings for responsive styling
 * 
 * Usage example with styled-components:
 * ```
 * const ResponsiveComponent = styled.div`
 *   font-size: 16px;
 *   
 *   @media ${mediaQueries.md} {
 *     font-size: 18px;
 *   }
 *   
 *   @media ${mediaQueries.lg} {
 *     font-size: 20px;
 *   }
 * `;
 * ```
 */
export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`
};