import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const sampleOptions = [
  { label: 'Cardiology', value: 'cardiology' },
  { label: 'Dermatology', value: 'dermatology' },
  { label: 'Neurology', value: 'neurology' },
  { label: 'Orthopedics', value: 'orthopedics' },
  { label: 'Pediatrics', value: 'pediatrics' },
  { label: 'Psychiatry', value: 'psychiatry', disabled: true },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    journey: {
      control: 'select',
      options: ['health', 'care', 'plan'],
    },
    searchable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return (
      <div style={{ maxWidth: '320px' }}>
        <Dropdown
          options={sampleOptions}
          value={value}
          placeholder="Select specialty"
          onChange={setValue}
          journey="health"
        />
      </div>
    );
  },
};

export const WithOptions: Story = {
  render: () => {
    const [value, setValue] = useState('cardiology');
    return (
      <div style={{ maxWidth: '320px' }}>
        <Dropdown
          options={sampleOptions}
          value={value}
          onChange={setValue}
          journey="care"
        />
      </div>
    );
  },
};

export const Searchable: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return (
      <div style={{ maxWidth: '320px' }}>
        <Dropdown
          options={sampleOptions}
          value={value}
          placeholder="Search specialties..."
          onChange={setValue}
          searchable
          journey="health"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    value: 'cardiology',
    disabled: true,
    journey: 'health',
  },
};
