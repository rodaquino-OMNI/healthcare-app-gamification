import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
    title: 'Components/Slider',
    component: Slider,
    tags: ['autodocs'],
    argTypes: {
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        disabled: { control: 'boolean' },
        showValue: { control: 'boolean' },
        min: { control: 'number' },
        max: { control: 'number' },
        step: { control: 'number' },
        onChange: { action: 'changed' },
    },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
    render: () => {
        const [value, setValue] = useState(50);
        return (
            <div style={{ maxWidth: '400px', padding: '16px' }}>
                <Slider value={value} onChange={setValue} min={0} max={100} journey="health" />
            </div>
        );
    },
};

export const WithValue: Story = {
    render: () => {
        const [value, setValue] = useState(30);
        return (
            <div style={{ maxWidth: '400px', padding: '16px' }}>
                <Slider value={value} onChange={setValue} min={0} max={100} showValue journey="health" />
            </div>
        );
    },
};

export const Disabled: Story = {
    render: () => (
        <div style={{ maxWidth: '400px', padding: '16px' }}>
            <Slider value={40} onChange={() => {}} min={0} max={100} disabled showValue journey="health" />
        </div>
    ),
};

export const CustomRange: Story = {
    render: () => {
        const [value, setValue] = useState(120);
        return (
            <div style={{ maxWidth: '400px', padding: '16px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '14px' }}>Heart Rate (bpm)</p>
                <Slider value={value} onChange={setValue} min={60} max={200} step={5} showValue journey="health" />
            </div>
        );
    },
};

export const JourneyVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', padding: '16px' }}>
            <Slider value={40} onChange={() => {}} journey="health" showValue />
            <Slider value={60} onChange={() => {}} journey="care" showValue />
            <Slider value={80} onChange={() => {}} journey="plan" showValue />
        </div>
    ),
};
