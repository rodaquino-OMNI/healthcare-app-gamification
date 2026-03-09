import type { Meta, StoryObj } from '@storybook/react';

import GoalCard from './GoalCard';

const meta: Meta<typeof GoalCard> = {
    title: 'Health/GoalCard',
    component: GoalCard,
    tags: ['autodocs'],
    argTypes: {
        title: { control: 'text' },
        description: { control: 'text' },
        progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        completed: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof GoalCard>;

export const Default: Story = {
    args: {
        title: 'Caminhar 10.000 passos por dia',
        description: 'Manter uma rotina de atividade física diária para melhorar a saúde cardiovascular.',
        progress: 0,
        completed: false,
    },
};

export const InProgress: Story = {
    args: {
        title: 'Beber 2 litros de água por dia',
        description: 'Manter a hidratação adequada ao longo do dia.',
        progress: 65,
        completed: false,
    },
};

export const Completed: Story = {
    args: {
        title: 'Praticar meditação por 7 dias',
        description: 'Reduzir o estresse e melhorar o bem-estar mental.',
        progress: 100,
        completed: true,
    },
};

export const AlmostDone: Story = {
    args: {
        title: 'Dormir 8 horas por noite',
        description: 'Melhorar a qualidade do sono para recuperação física.',
        progress: 86,
        completed: false,
    },
};

export const NoDescription: Story = {
    args: {
        title: 'Reduzir pressão arterial',
        progress: 40,
        completed: false,
    },
};

export const JustStarted: Story = {
    args: {
        title: 'Perder 5kg em 3 meses',
        description: 'Atingir o peso ideal com dieta balanceada e exercícios regulares.',
        progress: 10,
        completed: false,
    },
};
