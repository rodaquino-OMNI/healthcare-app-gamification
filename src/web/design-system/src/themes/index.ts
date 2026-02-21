/**
 * Aggregates and exports all theme definitions for the AUSTA SuperApp design system.
 * This module provides a single entry point for accessing the base theme, journey-specific
 * themes (Health, Care, and Plan), and the dark theme, enabling consistent styling and
 * theming across the application.
 */

// Import all themes
import { baseTheme } from './base.theme';
import { healthTheme } from './health.theme';
import { careTheme } from './care.theme';
import { planTheme } from './plan.theme';
import { darkTheme } from './dark.theme';

// Export all themes
export {
  baseTheme,    // Base theme with common styles
  healthTheme,  // Health Journey theme (green)
  careTheme,    // Care Now Journey theme (orange)
  planTheme,    // My Plan & Benefits Journey theme (blue)
  darkTheme,    // Dark mode theme
};

// Re-export the Theme interface for consumers
export type { Theme } from './base.theme';
