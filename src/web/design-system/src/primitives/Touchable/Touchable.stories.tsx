import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Touchable } from './Touchable';

const meta: Meta<typeof Touchable> = {
  title: 'Primitives/Touchable',
  component: Touchable,
  tags: ['autodocs'],
  argTypes: {
    journey: {
      control: 'select',
      options: ['health', 'care', 'plan'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    activeOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
    onPress: { action: 'pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof Touchable>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: '12px 24px', background: '#0ACF83', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>
        Press me
      </div>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: (
      <div style={{ padding: '12px 24px', background: '#ccc', color: '#666', borderRadius: '8px' }}>
        Disabled
      </div>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: (
      <div style={{ padding: '12px', background: '#0ACF83', color: '#fff', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
        Full Width Touchable
      </div>
    ),
  },
};

export const WithJourney: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Touchable journey="health">
        <div style={{ padding: '12px', background: '#e8f5f0', borderRadius: '8px', cursor: 'pointer' }}>Health</div>
      </Touchable>
      <Touchable journey="care">
        <div style={{ padding: '12px', background: '#fff3e0', borderRadius: '8px', cursor: 'pointer' }}>Care</div>
      </Touchable>
      <Touchable journey="plan">
        <div style={{ padding: '12px', background: '#e3f2fd', borderRadius: '8px', cursor: 'pointer' }}>Plan</div>
      </Touchable>
    </div>
  ),
};
