/**
 * Journey Constants
 * 
 * This file defines constants related to the AUSTA SuperApp's user journeys,
 * including journey identifiers, names, colors, icons and routes.
 * These constants are used throughout the application to ensure consistency and maintainability.
 */

/**
 * Unique identifiers for each journey
 */
export const JOURNEY_IDS = {
  HEALTH: 'health',
  CARE: 'care',
  PLAN: 'plan',
} as const;

/**
 * Display names for each journey in Brazilian Portuguese
 */
export const JOURNEY_NAMES = {
  HEALTH: 'Minha Saúde',
  CARE: 'Cuidar-me Agora',
  PLAN: 'Meu Plano & Benefícios',
} as const;

/**
 * Color schemes for each journey used for theming and visual differentiation
 */
export const JOURNEY_COLORS = {
  HEALTH: {
    primary: '#0ACF83',    // Green
    secondary: '#05A66A',
    accent: '#00875A',
    background: '#F0FFF4',
  },
  CARE: {
    primary: '#FF8C42',    // Orange
    secondary: '#F17C3A',
    accent: '#E55A00',
    background: '#FFF8F0',
  },
  PLAN: {
    primary: '#3A86FF',    // Blue
    secondary: '#2D6FD9',
    accent: '#0057E7',
    background: '#F0F8FF',
  },
} as const;

/**
 * Icon names for each journey used in navigation and UI elements
 */
export const JOURNEY_ICONS = {
  HEALTH: 'heart-pulse',   // Health icon
  CARE: 'medical-bag',     // Care icon
  PLAN: 'shield-account',  // Plan/insurance icon
} as const;

/**
 * Base route paths for each journey used in navigation
 */
export const JOURNEY_ROUTES = {
  HEALTH: '/health',
  CARE: '/care',
  PLAN: '/plan',
} as const;

/**
 * Default journey ID to use when no journey is specified
 */
export const DEFAULT_JOURNEY = JOURNEY_IDS.HEALTH;

/**
 * Preferred display order of journeys in navigation and dashboard
 */
export const JOURNEY_ORDER = [
  JOURNEY_IDS.HEALTH,
  JOURNEY_IDS.CARE,
  JOURNEY_IDS.PLAN,
] as const;

/**
 * Comprehensive configuration for each journey including all properties
 */
export const JOURNEY_CONFIG = {
  [JOURNEY_IDS.HEALTH]: {
    id: JOURNEY_IDS.HEALTH,
    name: JOURNEY_NAMES.HEALTH,
    color: JOURNEY_COLORS.HEALTH,
    icon: JOURNEY_ICONS.HEALTH,
    route: JOURNEY_ROUTES.HEALTH,
  },
  [JOURNEY_IDS.CARE]: {
    id: JOURNEY_IDS.CARE,
    name: JOURNEY_NAMES.CARE,
    color: JOURNEY_COLORS.CARE,
    icon: JOURNEY_ICONS.CARE,
    route: JOURNEY_ROUTES.CARE,
  },
  [JOURNEY_IDS.PLAN]: {
    id: JOURNEY_IDS.PLAN,
    name: JOURNEY_NAMES.PLAN,
    color: JOURNEY_COLORS.PLAN,
    icon: JOURNEY_ICONS.PLAN,
    route: JOURNEY_ROUTES.PLAN,
  },
} as const;