import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Touchable } from './Touchable';
import { colors } from '../../tokens/colors';

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
      <div style={{ padding: '12px 24px', background: colors.journeys.health.primary, color: colors.neutral.white, borderRadius: '8px', cursor: 'pointer' }}>
        Press me
      </div>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: (
      <div style={{ padding: '12px 24px', background: colors.gray[30], color: colors.gray[50], borderRadius: '8px' }}>
        Disabled
      </div>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: (
      <div style={{ padding: '12px', background: colors.journeys.health.primary, color: colors.neutral.white, borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
        Full Width Touchable
      </div>
    ),
  },
};

export const WithJourney: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Touchable journey="health">
        <div style={{ padding: '12px', background: colors.journeys.health.background, borderRadius: '8px', cursor: 'pointer' }}>Health</div>
      </Touchable>
      <Touchable journey="care">
        <div style={{ padding: '12px', background: colors.journeys.care.background, borderRadius: '8px', cursor: 'pointer' }}>Care</div>
      </Touchable>
      <Touchable journey="plan">
        <div style={{ padding: '12px', background: colors.journeys.plan.background, borderRadius: '8px', cursor: 'pointer' }}>Plan</div>
      </Touchable>
    </div>
  ),
};
