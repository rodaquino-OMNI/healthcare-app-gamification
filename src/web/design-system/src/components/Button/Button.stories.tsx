import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        disabled: { control: 'boolean' },
        loading: { control: 'boolean' },
        icon: {
            control: 'select',
            options: ['', 'heart', 'calendar', 'check', 'add', 'settings'],
        },
        onPress: { action: 'pressed' },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        variant: 'primary',
        size: 'md',
        journey: 'health',
        children: 'Get Started',
    },
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Button variant="primary" journey="health">
                Primary
            </Button>
            <Button variant="secondary" journey="health">
                Secondary
            </Button>
            <Button variant="tertiary" journey="health">
                Tertiary
            </Button>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Button size="sm" journey="health">
                Small
            </Button>
            <Button size="md" journey="health">
                Medium
            </Button>
            <Button size="lg" journey="health">
                Large
            </Button>
        </div>
    ),
};

export const Loading: Story = {
    args: {
        loading: true,
        journey: 'health',
        children: 'Loading...',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        journey: 'health',
        children: 'Disabled',
    },
};

export const WithIcon: Story = {
    args: {
        icon: 'heart',
        journey: 'health',
        children: 'Add to Favorites',
    },
};

export const JourneyVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button journey="health">Health</Button>
            <Button journey="care">Care</Button>
            <Button journey="plan">Plan</Button>
        </div>
    ),
};
