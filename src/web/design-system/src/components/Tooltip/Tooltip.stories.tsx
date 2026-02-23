import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { colors } from '../../tokens/colors';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    trigger: {
      control: 'select',
      options: ['hover', 'click'],
    },
    arrow: { control: 'boolean' },
    delay: { control: 'number' },
    content: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

const TriggerButton = ({ label }: { label: string }) => (
  <button style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: `1px solid ${colors.gray[30]}` }}>
    {label}
  </button>
);

export const Default: Story = {
  args: {
    content: 'This is a helpful tooltip',
    placement: 'top',
    trigger: 'hover',
    arrow: true,
    children: <TriggerButton label="Hover over me" />,
  },
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', padding: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Tooltip content="Top tooltip" placement="top">
        <TriggerButton label="Top" />
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <TriggerButton label="Bottom" />
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <TriggerButton label="Left" />
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <TriggerButton label="Right" />
      </Tooltip>
    </div>
  ),
};

export const ClickTrigger: Story = {
  args: {
    content: 'Click to dismiss this tooltip',
    placement: 'top',
    trigger: 'click',
    children: <TriggerButton label="Click me" />,
  },
};

export const NoArrow: Story = {
  args: {
    content: 'Tooltip without arrow',
    placement: 'top',
    arrow: false,
    children: <TriggerButton label="No arrow" />,
  },
};

export const RichContent: Story = {
  args: {
    content: 'Heart rate: 72 bpm — Normal range',
    placement: 'right',
    trigger: 'hover',
    children: (
      <span style={{ cursor: 'help', textDecoration: 'underline dotted' }}>
        Heart Rate
      </span>
    ),
  },
};
