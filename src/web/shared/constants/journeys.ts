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

export const ALL_JOURNEY_IDS = ['health', 'care', 'plan', 'gamification', 'wellness'] as const;

export type JourneyId = (typeof ALL_JOURNEY_IDS)[number];

export const ALL_JOURNEYS = [
    { id: 'health' as const, name: JOURNEY_NAMES.health, icon: JOURNEY_ICONS.health, color: JOURNEY_COLORS.health },
    { id: 'care' as const, name: JOURNEY_NAMES.care, icon: JOURNEY_ICONS.care, color: JOURNEY_COLORS.care },
    { id: 'plan' as const, name: JOURNEY_NAMES.plan, icon: JOURNEY_ICONS.plan, color: JOURNEY_COLORS.plan },
    {
        id: 'gamification' as const,
        name: JOURNEY_NAMES.gamification,
        icon: JOURNEY_ICONS.gamification,
        color: JOURNEY_COLORS.gamification,
    },
    {
        id: 'wellness' as const,
        name: JOURNEY_NAMES.wellness,
        icon: JOURNEY_ICONS.wellness,
        color: JOURNEY_COLORS.wellness,
    },
] as const;
