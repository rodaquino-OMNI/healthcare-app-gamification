import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';
import { colors } from '../../tokens/colors';

const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['rectangular', 'circular', 'text'],
    },
    animated: { control: 'boolean' },
    width: { control: 'text' },
    height: { control: 'text' },
    borderRadius: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: '200px',
    height: '20px',
    variant: 'rectangular',
    animated: true,
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: '48px',
    height: '48px',
    animated: true,
  },
};

export const TextVariant: Story = {
  args: {
    variant: 'text',
    width: '80%',
    animated: true,
  },
};

export const CardSkeleton: Story = {
  render: () => (
    <div style={{ padding: '16px', border: `1px solid ${colors.gray[20]}`, borderRadius: '8px', width: '300px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
        <Skeleton variant="circular" width="40px" height="40px" />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <div style={{ marginTop: '4px' }}>
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height="120px" />
      <div style={{ marginTop: '12px' }}>
        <Skeleton variant="text" width="100%" />
        <div style={{ marginTop: '4px' }}>
          <Skeleton variant="text" width="90%" />
        </div>
        <div style={{ marginTop: '4px' }}>
          <Skeleton variant="text" width="75%" />
        </div>
      </div>
    </div>
  ),
};
