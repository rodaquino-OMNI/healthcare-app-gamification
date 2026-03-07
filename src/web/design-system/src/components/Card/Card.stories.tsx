import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { colors } from '../../tokens/colors';

const meta: Meta<typeof Card> = {
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
    argTypes: {
        elevation: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        interactive: { control: 'boolean' },
        elevated: { control: 'boolean' },
        padding: { control: 'text' },
        onPress: { action: 'pressed' },
    },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    args: {
        elevation: 'sm',
        padding: 'md',
        children: (
            <div>
                <h3 style={{ margin: '0 0 8px' }}>Card Title</h3>
                <p style={{ margin: 0, color: colors.gray[50] }}>This is a basic card with some content.</p>
            </div>
        ),
    },
};

export const Elevated: Story = {
    args: {
        elevation: 'lg',
        padding: 'lg',
        children: (
            <div>
                <h3 style={{ margin: '0 0 8px' }}>Elevated Card</h3>
                <p style={{ margin: 0, color: colors.gray[50] }}>This card has a more pronounced shadow.</p>
            </div>
        ),
    },
};

export const Interactive: Story = {
    args: {
        interactive: true,
        elevation: 'md',
        padding: 'md',
        children: (
            <div>
                <h3 style={{ margin: '0 0 8px' }}>Clickable Card</h3>
                <p style={{ margin: 0, color: colors.gray[50] }}>Hover to see the interactive effect.</p>
            </div>
        ),
    },
};

export const WithJourney: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Card journey="health" padding="md" style={{ width: '200px' }}>
                <p style={{ margin: 0 }}>Health Journey</p>
            </Card>
            <Card journey="care" padding="md" style={{ width: '200px' }}>
                <p style={{ margin: 0 }}>Care Journey</p>
            </Card>
            <Card journey="plan" padding="md" style={{ width: '200px' }}>
                <p style={{ margin: 0 }}>Plan Journey</p>
            </Card>
        </div>
    ),
};
