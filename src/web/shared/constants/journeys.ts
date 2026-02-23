export const JOURNEY_IDS = {
  HEALTH: 'health',
  CARE: 'care',
  PLAN: 'plan',
  GAMIFICATION: 'gamification',
  WELLNESS: 'wellness',
} as const;

export const JOURNEY_NAMES = {
  health: 'Minha Saude',
  care: 'Cuidar-me Agora',
  plan: 'Meu Plano e Cobertura',
  gamification: 'Conquistas',
  wellness: 'Bem-estar',
} as const;

export const JOURNEY_COLORS = {
  health: '#4CAF50',
  care: '#2196F3',
  plan: '#FF9800',
  gamification: '#9C27B0',
  wellness: '#00BCD4',
} as const;

export const JOURNEY_ICONS = {
  health: 'heart',
  care: 'medical',
  plan: 'shield',
  gamification: 'trophy',
  wellness: 'leaf',
} as const;

export const ALL_JOURNEYS = ['health', 'care', 'plan', 'gamification', 'wellness'] as const;

export type JourneyId = typeof ALL_JOURNEYS[number];
