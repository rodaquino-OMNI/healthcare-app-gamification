/**
 * Color tokens for the AUSTA SuperApp design system.
 * This file defines the color palette used throughout the application to ensure
 * visual consistency and support journey-based theming.
 * 
 * The color system is organized into:
 * - Brand colors: Core brand identity colors
 * - Journeys: Colors specific to each user journey (Health, Care, Plan)
 * - Semantic: Colors that convey meaning (success, error, etc.)
 * - Neutral: Grayscale colors for text, backgrounds, and UI elements
 */

/**
 * Complete color palette for the AUSTA SuperApp
 */
export const colors = {
  /**
   * Primary brand colors that represent the AUSTA brand identity
   */
  brand: {
    primary: '#0066CC',    // Primary brand color
    secondary: '#00A3E0',  // Secondary brand color
    tertiary: '#6D2077',   // Tertiary brand color for accents
  },

  /**
   * Journey-specific color palettes.
   * Each journey has its own color scheme to help users identify which journey they're in:
   * - My Health (Minha Saúde): Green palette
   * - Care Now (Cuidar-me Agora): Orange palette
   * - My Plan (Meu Plano & Benefícios): Blue palette
   */
  journeys: {
    health: {
      primary: '#0ACF83',    // Main health journey color (Green)
      secondary: '#05A66A',  // Secondary health color for buttons, accents
      accent: '#00875A',     // Strong accent color for highlights, important elements
      background: '#F0FFF4', // Light background color for health journey screens
      text: '#1A1A1A',       // Text color to use on health journey backgrounds
    },
    care: {
      primary: '#FF8C42',    // Main care journey color (Orange)
      secondary: '#F17C3A',  // Secondary care color for buttons, accents
      accent: '#E55A00',     // Strong accent color for highlights, important elements
      background: '#FFF8F0', // Light background color for care journey screens
      text: '#1A1A1A',       // Text color to use on care journey backgrounds
    },
    plan: {
      primary: '#3A86FF',    // Main plan journey color (Blue)
      secondary: '#2D6FD9',  // Secondary plan color for buttons, accents
      accent: '#0057E7',     // Strong accent color for highlights, important elements
      background: '#F0F8FF', // Light background color for plan journey screens
      text: '#1A1A1A',       // Text color to use on plan journey backgrounds
    },
  },

  /**
   * Semantic colors that convey specific meanings
   */
  semantic: {
    success: '#00C853', // Positive actions, confirmations, completed states
    warning: '#FFD600', // Alerts, warnings, actions requiring attention
    error: '#FF3B30',   // Errors, destructive actions, critical alerts
    info: '#0066CC',    // Informational messages, help text
  },

  /**
   * Neutral colors for text, backgrounds, borders, and other UI elements
   */
  neutral: {
    white: '#FFFFFF',   // Pure white for backgrounds, cards
    gray100: '#F5F5F5', // Very light gray for subtle backgrounds, hover states
    gray200: '#EEEEEE', // Light gray for dividers, disabled buttons
    gray300: '#E0E0E0', // Light gray for borders, dividers
    gray400: '#BDBDBD', // Medium gray for disabled text, icons
    gray500: '#9E9E9E', // Medium gray for placeholder text
    gray600: '#757575', // Medium-dark gray for secondary text
    gray700: '#616161', // Dark gray for body text
    gray800: '#424242', // Very dark gray for headings
    gray900: '#212121', // Nearly black for primary text
    black: '#000000',   // Pure black for high contrast elements
  },
};