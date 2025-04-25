/**
 * Shadow tokens for the AUSTA SuperApp design system
 * 
 * These shadow styles provide consistent elevation and depth across the application,
 * with each level representing a different elevation from the surface.
 * 
 * - sm: Subtle shadows for slightly elevated components (cards, buttons)
 * - md: Medium shadows for floating elements (dropdowns, popovers)
 * - lg: Large shadows for modal dialogs and prominent UI elements
 * - xl: Extra large shadows for elements that need maximum elevation
 */

export const shadows = {
  /**
   * Small shadow - subtle elevation (1px)
   * Used for buttons, cards, and other slightly elevated components
   */
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',

  /**
   * Medium shadow - moderate elevation (4px)
   * Used for dropdowns, popovers, and components that float above the interface
   */
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',

  /**
   * Large shadow - significant elevation (10px)
   * Used for modal dialogs, sidebars, and other prominent UI elements
   */
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',

  /**
   * Extra large shadow - maximum elevation (20px)
   * Used for onboarding spotlights, notifications, and elements requiring maximum emphasis
   */
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
};