/**
 * Constants related to the journey-centered architecture of the AUSTA SuperApp.
 * These constants define the available journeys and their properties.
 */

/**
 * Enum of available journeys in the AUSTA SuperApp
 */
export enum JourneyType {
  HEALTH = 'health',
  CARE = 'care',
  PLAN = 'plan'
}

/**
 * Journey IDs for the three main journeys in the AUSTA SuperApp
 */
export const JOURNEY_IDS = {
  /**
   * Health Journey - "Minha Saúde"
   */
  HEALTH: 'health',
  
  /**
   * Care Journey - "Cuidar-me Agora"
   */
  CARE: 'care',
  
  /**
   * Plan Journey - "Meu Plano & Benefícios"
   */
  PLAN: 'plan'
};

/**
 * Journey display names
 */
export const JOURNEY_NAMES = {
  [JOURNEY_IDS.HEALTH]: 'Minha Saúde',
  [JOURNEY_IDS.CARE]: 'Cuidar-me Agora',
  [JOURNEY_IDS.PLAN]: 'Meu Plano & Benefícios'
};

/**
 * Journey theme colors
 */
export const JOURNEY_COLORS = {
  [JOURNEY_IDS.HEALTH]: '#0ACF83',  // Green
  [JOURNEY_IDS.CARE]: '#FF8C42',    // Orange
  [JOURNEY_IDS.PLAN]: '#3A86FF'     // Blue
};

/**
 * Icon names for each journey
 */
export const JOURNEY_ICONS = {
  [JOURNEY_IDS.HEALTH]: 'heart',
  [JOURNEY_IDS.CARE]: 'medkit',
  [JOURNEY_IDS.PLAN]: 'document'
};

/**
 * Interface for a journey configuration
 */
export interface JourneyConfig {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  enabled: boolean;
  order: number;
}

/**
 * Complete configuration for all journeys
 */
export const JOURNEY_CONFIG: Record<string, JourneyConfig> = {
  [JOURNEY_IDS.HEALTH]: {
    id: JOURNEY_IDS.HEALTH,
    name: JOURNEY_NAMES[JOURNEY_IDS.HEALTH],
    color: JOURNEY_COLORS[JOURNEY_IDS.HEALTH],
    icon: JOURNEY_ICONS[JOURNEY_IDS.HEALTH],
    description: 'Monitor and track your health metrics',
    enabled: true,
    order: 1
  },
  [JOURNEY_IDS.CARE]: {
    id: JOURNEY_IDS.CARE,
    name: JOURNEY_NAMES[JOURNEY_IDS.CARE],
    color: JOURNEY_COLORS[JOURNEY_IDS.CARE],
    icon: JOURNEY_ICONS[JOURNEY_IDS.CARE],
    description: 'Access care when you need it',
    enabled: true,
    order: 2
  },
  [JOURNEY_IDS.PLAN]: {
    id: JOURNEY_IDS.PLAN,
    name: JOURNEY_NAMES[JOURNEY_IDS.PLAN],
    color: JOURNEY_COLORS[JOURNEY_IDS.PLAN],
    icon: JOURNEY_ICONS[JOURNEY_IDS.PLAN],
    description: 'Manage your insurance plan and benefits',
    enabled: true,
    order: 3
  }
};