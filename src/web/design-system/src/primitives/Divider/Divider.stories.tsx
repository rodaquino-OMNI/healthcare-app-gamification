import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
    title: 'Primitives/Divider',
    component: Divider,
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
        },
        thickness: {
            control: 'select',
            options: ['1px', '2px'],
        },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        spacing: { control: 'text' },
        color: { control: 'color' },
    },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
    args: {
        orientation: 'horizontal',
        thickness: '1px',
    },
};

export const Thick: Story = {
    args: {
        orientation: 'horizontal',
        thickness: '2px',
    },
};

export const Vertical: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', height: '60px', gap: '16px' }}>
            <span>Left</span>
            <Divider orientation="vertical" />
            <span>Right</span>
        </div>
    ),
};

export const WithJourney: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Divider journey="health" />
            <Divider journey="care" />
            <Divider journey="plan" />
        </div>
    ),
};

export const WithSpacing: Story = {
    args: {
        orientation: 'horizontal',
        spacing: 'md',
    },
};
