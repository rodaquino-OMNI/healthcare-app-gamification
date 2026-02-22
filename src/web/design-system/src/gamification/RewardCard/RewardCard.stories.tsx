import type { Meta, StoryObj } from '@storybook/react';
import { RewardCard } from './RewardCard';

const meta: Meta<typeof RewardCard> = {
  title: 'Gamification/RewardCard',
  component: RewardCard,
  tags: ['autodocs'],
  argTypes: {
    onPress: { action: 'pressed' },
    testID: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof RewardCard>;

export const Default: Story = {
  args: {
    reward: {
      id: 'weekly-goal',
      title: 'Meta Semanal Atingida',
      description: 'Você completou sua meta de exercícios desta semana!',
      icon: 'steps',
      xp: 100,
      journey: 'health',
    },
  },
};

export const HealthReward: Story = {
  args: {
    reward: {
      id: 'heart-health',
      title: 'Coração Saudável',
      description: 'Mantenha sua frequência cardíaca em repouso na zona ideal por 30 dias.',
      icon: 'heart',
      xp: 250,
      journey: 'health',
    },
    onPress: () => {},
  },
};

export const CareReward: Story = {
  args: {
    reward: {
      id: 'med-master',
      title: 'Mestre da Medicação',
      description: 'Tome todos os medicamentos prescritos por 30 dias consecutivos.',
      icon: 'heart',
      xp: 500,
      journey: 'care',
    },
    onPress: () => {},
  },
};

export const PlanReward: Story = {
  args: {
    reward: {
      id: 'preventive-hero',
      title: 'Herói Preventivo',
      description: 'Complete todos os exames preventivos recomendados pelo seu plano de saúde.',
      icon: 'check',
      xp: 750,
      journey: 'plan',
    },
    onPress: () => {},
  },
};

export const HighXP: Story = {
  args: {
    reward: {
      id: 'annual-champion',
      title: 'Campeão do Ano',
      description: 'Mantenha uma rotina saudável durante todos os meses do ano.',
      icon: 'trophy',
      xp: 2000,
      journey: 'health',
    },
    onPress: () => {},
  },
};

export const WithTestID: Story = {
  args: {
    reward: {
      id: 'daily-reward',
      title: 'Recompensa Diária',
      description: 'Você registrou suas métricas de saúde hoje.',
      icon: 'check',
      xp: 50,
      journey: 'health',
    },
    testID: 'reward-card-daily',
  },
};
