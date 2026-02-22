import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Primitives/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'heart', 'heart-outline', 'pulse', 'weight', 'sleep', 'steps', 'glucose',
        'calendar', 'doctor', 'pill', 'video', 'clinic',
        'document', 'card', 'money', 'insurance', 'file-upload',
        'home', 'settings', 'notifications', 'profile', 'menu', 'close',
        'arrow-back', 'arrow-forward', 'check', 'add',
        'trophy', 'achievement', 'star', 'level-up', 'reward',
        'success', 'warning', 'error', 'info',
      ],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'heart',
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Icon name="heart" size="xs" />
      <Icon name="heart" size="sm" />
      <Icon name="heart" size="md" />
      <Icon name="heart" size="lg" />
      <Icon name="heart" size="xl" />
    </div>
  ),
};

export const AllIcons: Story = {
  render: () => {
    const icons = [
      'heart', 'heart-outline', 'pulse', 'weight', 'sleep', 'steps', 'glucose',
      'calendar', 'doctor', 'pill', 'video', 'clinic',
      'document', 'card', 'money', 'insurance', 'file-upload',
      'home', 'settings', 'notifications', 'profile', 'menu', 'close',
      'arrow-back', 'arrow-forward', 'check', 'add',
      'trophy', 'achievement', 'star', 'level-up', 'reward',
      'success', 'warning', 'error', 'info',
    ];
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {icons.map((name) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Icon name={name} size="md" />
            <span style={{ fontSize: '10px', color: '#666' }}>{name}</span>
          </div>
        ))}
      </div>
    );
  },
};
