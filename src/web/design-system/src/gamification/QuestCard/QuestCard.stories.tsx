import type { Meta, StoryObj } from '@storybook/react';
import { QuestCard } from './QuestCard';

const meta: Meta<typeof QuestCard> = {
    title: 'Gamification/QuestCard',
    component: QuestCard,
    tags: ['autodocs'],
    argTypes: {
        onPress: { action: 'pressed' },
    },
};

export default meta;
type Story = StoryObj<typeof QuestCard>;

export const Default: Story = {
    args: {
        quest: {
            id: 'weekly-activity',
            title: 'Semana Ativa',
            description: 'Pratique atividade física por 5 dias esta semana',
            icon: 'steps',
            progress: 0,
            total: 5,
            journey: 'health',
        },
    },
};

export const InProgress: Story = {
    args: {
        quest: {
            id: 'hydration-week',
            title: 'Hidratação Perfeita',
            description: 'Beba pelo menos 2L de água por dia durante 7 dias',
            icon: 'heart',
            progress: 4,
            total: 7,
            journey: 'health',
        },
        onPress: () => {},
    },
};

export const Completed: Story = {
    args: {
        quest: {
            id: 'meditation-challenge',
            title: 'Desafio da Meditação',
            description: 'Medite por 10 minutos todos os dias durante uma semana',
            icon: 'sleep',
            progress: 7,
            total: 7,
            journey: 'health',
        },
    },
};

export const CareQuest: Story = {
    args: {
        quest: {
            id: 'medication-streak',
            title: 'Sequência de Medicação',
            description: 'Tome todos os medicamentos prescritos por 14 dias consecutivos',
            icon: 'heart',
            progress: 9,
            total: 14,
            journey: 'care',
        },
        onPress: () => {},
    },
};

export const PlanQuest: Story = {
    args: {
        quest: {
            id: 'annual-checkups',
            title: 'Check-ups do Ano',
            description: 'Complete todos os exames preventivos anuais recomendados',
            icon: 'check',
            progress: 2,
            total: 4,
            journey: 'plan',
        },
        onPress: () => {},
    },
};

export const AlmostComplete: Story = {
    args: {
        quest: {
            id: 'step-challenge',
            title: 'Desafio dos 10.000 Passos',
            description: 'Ande 10.000 passos por dia durante 10 dias seguidos',
            icon: 'steps',
            progress: 9,
            total: 10,
            journey: 'health',
        },
        onPress: () => {},
    },
};
