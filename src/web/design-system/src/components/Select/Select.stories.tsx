import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const specialtyOptions = [
  { label: 'Cardiology', value: 'cardiology' },
  { label: 'Dermatology', value: 'dermatology' },
  { label: 'Neurology', value: 'neurology' },
  { label: 'Orthopedics', value: 'orthopedics' },
  { label: 'Pediatrics', value: 'pediatrics' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    journey: {
      control: 'select',
      options: ['health', 'care', 'plan'],
    },
    multiple: { control: 'boolean' },
    searchable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '320px' }}>
        <Select
          options={specialtyOptions}
          value={value}
          onChange={(v) => setValue(v as string)}
          label="Specialty"
          journey="health"
        />
      </div>
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div style={{ maxWidth: '320px' }}>
        <Select
          options={specialtyOptions}
          value={values}
          onChange={(v) => setValues(v as string[])}
          label="Select Specialties"
          multiple
          journey="care"
        />
      </div>
    );
  },
};

export const Searchable: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '320px' }}>
        <Select
          options={specialtyOptions}
          value={value}
          onChange={(v) => setValue(v as string)}
          label="Search Specialty"
          searchable
          journey="health"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: '320px' }}>
      <Select
        options={specialtyOptions}
        value="cardiology"
        onChange={() => {}}
        label="Locked Specialty"
        disabled
        journey="plan"
      />
    </div>
  ),
};
