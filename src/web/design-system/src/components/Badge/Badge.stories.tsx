import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['achievement', 'status'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    status: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral'],
    },
    journey: {
      control: 'select',
      options: ['health', 'care', 'plan'],
    },
    unlocked: { control: 'boolean' },
    dot: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: 'achievement',
    size: 'md',
    journey: 'health',
    unlocked: false,
    children: 'New',
  },
};

export const Achievement: Story = {
  args: {
    variant: 'achievement',
    unlocked: true,
    journey: 'health',
    size: 'md',
    children: 'Pro',
  },
};

export const Status: Story = {
  args: {
    variant: 'status',
    status: 'success',
    children: 'Active',
  },
};

export const Dot: Story = {
  args: {
    variant: 'status',
    status: 'warning',
    dot: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Badge variant="achievement" size="sm" journey="health">S</Badge>
      <Badge variant="achievement" size="md" journey="health">M</Badge>
      <Badge variant="achievement" size="lg" journey="health">L</Badge>
    </div>
  ),
};

export const StatusVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="status" status="success">Success</Badge>
      <Badge variant="status" status="warning">Warning</Badge>
      <Badge variant="status" status="error">Error</Badge>
      <Badge variant="status" status="info">Info</Badge>
      <Badge variant="status" status="neutral">Neutral</Badge>
    </div>
  ),
};
