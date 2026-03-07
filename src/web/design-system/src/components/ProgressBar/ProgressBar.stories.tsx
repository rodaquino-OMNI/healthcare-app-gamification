import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
    title: 'Components/ProgressBar',
    component: ProgressBar,
    tags: ['autodocs'],
    argTypes: {
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        animated: { control: 'boolean' },
        showLevels: { control: 'boolean' },
        current: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        total: { control: 'number' },
    },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
    args: {
        current: 65,
        total: 100,
        journey: 'health',
        size: 'md',
        animated: true,
    },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <div>
                <p style={{ margin: '0 0 4px', fontSize: '12px' }}>Small</p>
                <ProgressBar current={40} total={100} size="sm" journey="health" />
            </div>
            <div>
                <p style={{ margin: '0 0 4px', fontSize: '12px' }}>Medium</p>
                <ProgressBar current={60} total={100} size="md" journey="health" />
            </div>
            <div>
                <p style={{ margin: '0 0 4px', fontSize: '12px' }}>Large</p>
                <ProgressBar current={80} total={100} size="lg" journey="health" />
            </div>
        </div>
    ),
};

export const Animated: Story = {
    args: {
        current: 75,
        total: 100,
        journey: 'care',
        animated: true,
    },
};

export const WithLevels: Story = {
    args: {
        current: 60,
        total: 100,
        journey: 'health',
        showLevels: true,
        levelMarkers: [25, 50, 75],
    },
};

export const JourneyVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
            <ProgressBar current={70} total={100} journey="health" />
            <ProgressBar current={50} total={100} journey="care" />
            <ProgressBar current={90} total={100} journey="plan" />
        </div>
    ),
};
