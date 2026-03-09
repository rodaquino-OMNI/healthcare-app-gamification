import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ProgressCircle } from './ProgressCircle';

const meta: Meta<typeof ProgressCircle> = {
    title: 'Components/ProgressCircle',
    component: ProgressCircle,
    tags: ['autodocs'],
    argTypes: {
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        sizePreset: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        showLabel: { control: 'boolean' },
        progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        color: { control: 'color' },
    },
};

export default meta;
type Story = StoryObj<typeof ProgressCircle>;

export const Default: Story = {
    args: {
        progress: 75,
        journey: 'health',
        sizePreset: 'md',
        showLabel: false,
    },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <ProgressCircle progress={60} sizePreset="sm" journey="health" showLabel />
            <ProgressCircle progress={60} sizePreset="md" journey="health" showLabel />
            <ProgressCircle progress={60} sizePreset="lg" journey="health" showLabel />
        </div>
    ),
};

export const WithLabel: Story = {
    args: {
        progress: 85,
        journey: 'health',
        sizePreset: 'lg',
        showLabel: true,
    },
};

export const JourneyVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <ProgressCircle progress={80} journey="health" sizePreset="md" showLabel />
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Health</p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <ProgressCircle progress={60} journey="care" sizePreset="md" showLabel />
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Care</p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <ProgressCircle progress={45} journey="plan" sizePreset="md" showLabel />
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Plan</p>
            </div>
        </div>
    ),
};

export const FullProgress: Story = {
    args: {
        progress: 100,
        journey: 'health',
        sizePreset: 'lg',
        showLabel: true,
    },
};

export const EmptyProgress: Story = {
    args: {
        progress: 0,
        journey: 'care',
        sizePreset: 'lg',
        showLabel: true,
    },
};
