import type { Meta, StoryObj } from '@storybook/react';
import { AchievementNotification } from './AchievementNotification';

const meta: Meta<typeof AchievementNotification> = {
  title: 'Gamification/AchievementNotification',
  component: AchievementNotification,
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof AchievementNotification>;

export const Default: Story = {
  args: {
    achievement: {
      id: 'first-steps',
      title: 'Primeiros Passos!',
      description: 'Parabens! Voce completou 5 dias consecutivos de atividade fisica.',
      journey: 'health',
      icon: 'steps',
      progress: 5,
      total: 5,
      unlocked: true,
    },
    onClose: () => {},
  },
};

export const HealthAchievement: Story = {
  args: {
    achievement: {
      id: 'heart-hero',
      title: 'Herói do Coração',
      description: 'Sua frequência cardíaca em repouso está na faixa saudável por 30 dias.',
      journey: 'health',
      icon: 'heart',
      progress: 30,
      total: 30,
      unlocked: true,
    },
    onClose: () => {},
  },
};

export const CareAchievement: Story = {
  args: {
    achievement: {
      id: 'med-master',
      title: 'Mestre da Medicação',
      description: 'Excelente adesão ao tratamento! Você tomou todos os remédios em dia por 2 semanas.',
      journey: 'care',
      icon: 'heart',
      progress: 14,
      total: 14,
      unlocked: true,
    },
    onClose: () => {},
  },
};

export const PlanAchievement: Story = {
  args: {
    achievement: {
      id: 'preventive-care',
      title: 'Saúde em Dia',
      description: 'Você realizou todos os exames preventivos do ano. Parabéns pelo cuidado com sua saúde!',
      journey: 'plan',
      icon: 'check',
      progress: 3,
      total: 3,
      unlocked: true,
    },
    onClose: () => {},
  },
};

export const InProgress: Story = {
  args: {
    achievement: {
      id: 'step-master',
      title: 'Mestre dos Passos',
      description: 'Continue caminhando! Você está a 2 dias de completar seu desafio.',
      journey: 'health',
      icon: 'steps',
      progress: 8,
      total: 10,
      unlocked: false,
    },
    onClose: () => {},
  },
};
