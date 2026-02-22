import type { Meta, StoryObj } from '@storybook/react';
import { AchievementBadge } from './AchievementBadge';

const meta: Meta<typeof AchievementBadge> = {
  title: 'Gamification/AchievementBadge',
  component: AchievementBadge,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showProgress: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof AchievementBadge>;

const lockedAchievement = {
  id: 'first-steps',
  title: 'Primeiros Passos',
  description: 'Complete 5 dias consecutivos de atividade física',
  icon: 'steps',
  progress: 3,
  total: 5,
  unlocked: false,
  journey: 'health',
};

const unlockedAchievement = {
  id: 'hydration-hero',
  title: 'Herói da Hidratação',
  description: 'Beba 2L de água por 7 dias consecutivos',
  icon: 'heart',
  progress: 7,
  total: 7,
  unlocked: true,
  journey: 'health',
};

export const Default: Story = {
  args: {
    achievement: lockedAchievement,
    size: 'md',
    showProgress: true,
  },
};

export const Unlocked: Story = {
  args: {
    achievement: unlockedAchievement,
    size: 'md',
    showProgress: true,
  },
};

export const Locked: Story = {
  args: {
    achievement: lockedAchievement,
    size: 'md',
    showProgress: false,
  },
};

export const WithProgress: Story = {
  args: {
    achievement: {
      id: 'step-master',
      title: 'Mestre dos Passos',
      description: 'Alcance 10.000 passos em 10 dias',
      icon: 'steps',
      progress: 6,
      total: 10,
      unlocked: false,
      journey: 'health',
    },
    size: 'md',
    showProgress: true,
  },
};

export const SizeSmall: Story = {
  args: {
    achievement: unlockedAchievement,
    size: 'sm',
    showProgress: false,
  },
};

export const SizeMedium: Story = {
  args: {
    achievement: unlockedAchievement,
    size: 'md',
    showProgress: false,
  },
};

export const SizeLarge: Story = {
  args: {
    achievement: unlockedAchievement,
    size: 'lg',
    showProgress: false,
  },
};

export const CareJourney: Story = {
  args: {
    achievement: {
      id: 'med-adherence',
      title: 'Adesão ao Tratamento',
      description: 'Tome todos os medicamentos por 30 dias',
      icon: 'heart',
      progress: 30,
      total: 30,
      unlocked: true,
      journey: 'care',
    },
    size: 'md',
    showProgress: false,
  },
};

export const PlanJourney: Story = {
  args: {
    achievement: {
      id: 'preventive-care',
      title: 'Cuidado Preventivo',
      description: 'Complete 3 check-ups anuais',
      icon: 'check',
      progress: 2,
      total: 3,
      unlocked: false,
      journey: 'plan',
    },
    size: 'md',
    showProgress: true,
  },
};
