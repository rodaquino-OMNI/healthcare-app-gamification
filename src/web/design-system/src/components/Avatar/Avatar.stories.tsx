import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    sizePreset: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    journey: {
      control: 'select',
      options: ['health', 'care', 'plan'],
    },
    fallbackType: {
      control: 'select',
      options: ['initials', 'icon'],
    },
    showFallback: { control: 'boolean' },
    name: { control: 'text' },
    src: { control: 'text' },
    alt: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    name: 'Ana Silva',
    sizePreset: 'md',
    fallbackType: 'initials',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    name: 'Dr. Carlos',
    alt: 'Dr. Carlos',
    sizePreset: 'md',
  },
};

export const Initials: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Avatar name="Ana Silva" journey="health" sizePreset="md" />
      <Avatar name="Bruno Costa" journey="care" sizePreset="md" />
      <Avatar name="Carla Dias" journey="plan" sizePreset="md" />
    </div>
  ),
};

export const IconFallback: Story = {
  args: {
    fallbackType: 'icon',
    sizePreset: 'md',
    journey: 'health',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Avatar name="Ana" sizePreset="xs" />
      <Avatar name="Ana" sizePreset="sm" />
      <Avatar name="Ana" sizePreset="md" />
      <Avatar name="Ana" sizePreset="lg" />
      <Avatar name="Ana" sizePreset="xl" />
    </div>
  ),
};
