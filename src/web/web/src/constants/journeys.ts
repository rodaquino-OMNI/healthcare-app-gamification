/**
 * Journey constants for the AUSTA SuperApp
 * 
 * This file defines all constants related to the three core user journeys:
 * - My Health ("Minha Saúde")
 * - Care Now ("Cuidar-me Agora")
 * - My Plan & Benefits ("Meu Plano & Benefícios")
 * 
 * These constants ensure consistent journey identification, naming, styling,
 * and navigation throughout the application.
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
 * Type representing valid journey IDs
 */
export type JourneyId = typeof JOURNEY_IDS[keyof typeof JOURNEY_IDS];

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
  HEALTH: '#0ACF83', // Green for Health journey
  CARE: '#FF8C42',   // Orange for Care journey
  PLAN: '#3A86FF',   // Blue for Plan journey
} as const;

/**
 * Icon names for each journey used in navigation and UI elements
 */
export const JOURNEY_ICONS = {
  HEALTH: 'heart',
  CARE: 'medical-bag',
  PLAN: 'card',
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
export const DEFAULT_JOURNEY: JourneyId = JOURNEY_IDS.HEALTH;

/**
 * Preferred display order of journeys in navigation and dashboard
 */
export const JOURNEY_ORDER: JourneyId[] = [
  JOURNEY_IDS.HEALTH,
  JOURNEY_IDS.CARE,
  JOURNEY_IDS.PLAN,
];

/**
 * Journey configuration interface
 */
export interface JourneyConfig {
  id: JourneyId;
  name: string;
  color: string;
  icon: string;
  route: string;
}

/**
 * Comprehensive configuration for each journey including all properties
 */
export const JOURNEY_CONFIG: Record<keyof typeof JOURNEY_IDS, JourneyConfig> = {
  HEALTH: {
    id: JOURNEY_IDS.HEALTH,
    name: JOURNEY_NAMES.HEALTH,
    color: JOURNEY_COLORS.HEALTH,
    icon: JOURNEY_ICONS.HEALTH,
    route: JOURNEY_ROUTES.HEALTH,
  },
  CARE: {
    id: JOURNEY_IDS.CARE,
    name: JOURNEY_NAMES.CARE,
    color: JOURNEY_COLORS.CARE,
    icon: JOURNEY_ICONS.CARE,
    route: JOURNEY_ROUTES.CARE,
  },
  PLAN: {
    id: JOURNEY_IDS.PLAN,
    name: JOURNEY_NAMES.PLAN,
    color: JOURNEY_COLORS.PLAN,
    icon: JOURNEY_ICONS.PLAN,
    route: JOURNEY_ROUTES.PLAN,
  },
};