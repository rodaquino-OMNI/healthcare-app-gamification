import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Loader } from './Loader';

const meta: Meta<typeof Loader> = {
    title: 'Components/Loader',
    component: Loader,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['spinner', 'skeleton', 'progress'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        accessibilityLabel: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = {
    args: {
        variant: 'spinner',
        size: 'md',
        journey: 'health',
    },
};

export const Spinner: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Loader variant="spinner" size="sm" journey="health" />
            <Loader variant="spinner" size="md" journey="health" />
            <Loader variant="spinner" size="lg" journey="health" />
        </div>
    ),
};

export const SkeletonVariant: Story = {
    args: {
        variant: 'skeleton',
        size: 'md',
    },
};

export const Progress: Story = {
    args: {
        variant: 'progress',
        progress: 65,
        journey: 'health',
    },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Loader variant="spinner" size="sm" journey="care" />
            <Loader variant="spinner" size="md" journey="care" />
            <Loader variant="spinner" size="lg" journey="care" />
        </div>
    ),
};

export const JourneyVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Loader variant="spinner" size="md" journey="health" />
            <Loader variant="spinner" size="md" journey="care" />
            <Loader variant="spinner" size="md" journey="plan" />
        </div>
    ),
};
