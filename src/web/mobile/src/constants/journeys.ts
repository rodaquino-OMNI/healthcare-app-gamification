/**
 * Constants related to the different user journeys in the AUSTA SuperApp.
 * These constants support the Journey Navigation System and Journey Color Coding
 * for visual differentiation between the three core journeys.
 */

/**
 * User-facing localized names for each journey
 */
export const JOURNEY_NAMES = {
  MyHealth: 'Minha Saúde',
  CareNow: 'Cuidar-me Agora',
  MyPlan: 'Meu Plano & Benefícios'
};

/**
 * Unique identifiers for each journey
 * Used for routing, analytics tracking, and feature flagging
 */
export const JOURNEY_IDS = {
  MyHealth: 'my-health',
  CareNow: 'care-now',
  MyPlan: 'my-plan'
};

/**
 * Color hexcodes for each journey
 * Used for journey-specific theming and visual differentiation
 * - MyHealth: Green (#0ACF83)
 * - CareNow: Orange (#FF8C42)
 * - MyPlan: Blue (#3A86FF)
 */
export const JOURNEY_COLORS = {
  MyHealth: '#0ACF83',
  CareNow: '#FF8C42',
  MyPlan: '#3A86FF'
};