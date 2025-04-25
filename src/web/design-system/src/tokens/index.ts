/**
 * Design Tokens for the AUSTA SuperApp Design System
 * 
 * This file serves as the single entry point for all design tokens used throughout the
 * AUSTA SuperApp, providing a consistent visual language across all user journeys.
 * 
 * The design token system supports:
 * - Journey-specific theming with unique color schemes for each journey:
 *   - My Health (Minha Saúde): Green palette
 *   - Care Now (Cuidar-me Agora): Orange palette
 *   - My Plan (Meu Plano & Benefícios): Blue palette
 * - Consistent spacing based on an 8-point grid system
 * - Typography system optimized for readability in both Portuguese and English
 * - Responsive breakpoints for all device sizes
 * - Elevation system through consistent shadows
 * - Animation tokens for consistent motion design
 * 
 * These tokens form the foundation of the design system and should be used
 * for all visual styling to maintain consistency across the application.
 */

// Import all token categories
import { colors } from './colors';
import { typography, fontSizeValues } from './typography';
import { spacing, spacingValues } from './spacing';
import { breakpoints, breakpointValues, mediaQueries } from './breakpoints';
import { shadows } from './shadows';
import { animation } from './animation';

// Export individual token categories for granular imports
export { colors };
export { typography, fontSizeValues };
export { spacing, spacingValues };
export { breakpoints, breakpointValues, mediaQueries };
export { shadows };
export { animation };

/**
 * Consolidated tokens object containing all design token categories.
 * This provides a convenient way to access all tokens through a single import.
 * 
 * Usage example:
 * ```
 * import { tokens } from '@austa/design-system/tokens';
 * 
 * const Component = styled.div`
 *   color: ${tokens.colors.journeys.health.primary};
 *   font-size: ${tokens.typography.fontSize.md};
 *   margin: ${tokens.spacing.md};
 * `;
 * ```
 */
export const tokens = {
  colors,
  typography,
  spacing,
  breakpoints,
  mediaQueries,
  shadows,
  animation,
};