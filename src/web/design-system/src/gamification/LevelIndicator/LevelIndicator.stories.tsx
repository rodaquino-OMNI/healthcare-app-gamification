import type { Meta, StoryObj } from '@storybook/react';
import { LevelIndicator } from './LevelIndicator';

const meta: Meta<typeof LevelIndicator> = {
    title: 'Gamification/LevelIndicator',
    component: LevelIndicator,
    tags: ['autodocs'],
    argTypes: {
        level: { control: { type: 'range', min: 1, max: 30, step: 1 } },
        currentXp: { control: { type: 'range', min: 0, max: 5000, step: 50 } },
        nextLevelXp: { control: { type: 'range', min: 500, max: 10000, step: 100 } },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof LevelIndicator>;

export const Default: Story = {
    args: {
        level: 5,
        currentXp: 1200,
        nextLevelXp: 2000,
        journey: 'health',
    },
};

export const WithAchievement: Story = {
    args: {
        level: 8,
        currentXp: 3200,
        nextLevelXp: 4000,
        journey: 'health',
        recentAchievement: {
            id: 'daily-goal',
            title: 'Meta Diária Completa',
            description: 'Complete sua meta diária de atividade',
            icon: 'steps',
            progress: 1,
            total: 1,
            unlocked: true,
            journey: 'health',
        },
    },
};

export const HighLevel: Story = {
    args: {
        level: 22,
        currentXp: 18500,
        nextLevelXp: 20000,
        journey: 'health',
    },
};

export const Beginner: Story = {
    args: {
        level: 1,
        currentXp: 150,
        nextLevelXp: 500,
        journey: 'health',
    },
};

export const CareJourney: Story = {
    args: {
        level: 12,
        currentXp: 5800,
        nextLevelXp: 7000,
        journey: 'care',
        recentAchievement: {
            id: 'med-adherence',
            title: 'Adesão ao Tratamento',
            description: 'Tome todos os medicamentos por 30 dias',
            icon: 'heart',
            progress: 30,
            total: 30,
            unlocked: true,
            journey: 'care',
        },
    },
};

export const PlanJourney: Story = {
    args: {
        level: 7,
        currentXp: 2100,
        nextLevelXp: 3000,
        journey: 'plan',
    },
};
