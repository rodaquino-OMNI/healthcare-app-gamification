import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import Input from './Input';

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        type: {
            control: 'select',
            options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
        },
        disabled: { control: 'boolean' },
        label: { control: 'text' },
        placeholder: { control: 'text' },
        error: { control: 'text' },
        helperText: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof Input>;

const DefaultInput = (): React.ReactElement => {
    const [value, setValue] = useState('');
    return (
        <div style={{ maxWidth: '320px' }}>
            <Input
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                placeholder="Enter text..."
                journey="health"
            />
        </div>
    );
};

export const Default: Story = {
    render: () => <DefaultInput />,
};

const WithLabelInput = (): React.ReactElement => {
    const [value, setValue] = useState('');
    return (
        <div style={{ maxWidth: '320px' }}>
            <Input
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                label="Email Address"
                placeholder="you@example.com"
                type="email"
                journey="health"
            />
        </div>
    );
};

export const WithLabel: Story = {
    render: () => <WithLabelInput />,
};

const WithErrorInput = (): React.ReactElement => {
    const [value, setValue] = useState('invalid');
    return (
        <div style={{ maxWidth: '320px' }}>
            <Input
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                label="Email Address"
                error="Please enter a valid email address"
                journey="care"
            />
        </div>
    );
};

export const WithError: Story = {
    render: () => <WithErrorInput />,
};

const WithHelperTextInput = (): React.ReactElement => {
    const [value, setValue] = useState('');
    return (
        <div style={{ maxWidth: '320px' }}>
            <Input
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                label="CPF"
                placeholder="000.000.000-00"
                helperText="Enter your Brazilian tax ID number"
                journey="plan"
            />
        </div>
    );
};

export const WithHelperText: Story = {
    render: () => <WithHelperTextInput />,
};

export const Disabled: Story = {
    render: (): React.ReactElement => (
        <div style={{ maxWidth: '320px' }}>
            <Input value="Read-only value" onChange={() => {}} label="Account Number" disabled journey="health" />
        </div>
    ),
};
