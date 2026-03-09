import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
    title: 'Components/Tabs',
    component: Tabs,
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
        defaultTab: { control: 'number' },
        onPress: { action: 'tab pressed' },
    },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
    args: {
        journey: 'health',
        variant: 'primary',
        size: 'md',
        children: (
            <>
                <Tabs.TabList>
                    <Tabs.Tab label="Overview" />
                    <Tabs.Tab label="Activity" />
                    <Tabs.Tab label="Nutrition" />
                </Tabs.TabList>
                <Tabs.Panel index={0}>
                    <p>Overview content: Your health summary for this week.</p>
                </Tabs.Panel>
                <Tabs.Panel index={1}>
                    <p>Activity content: Steps, workouts, and active minutes.</p>
                </Tabs.Panel>
                <Tabs.Panel index={2}>
                    <p>Nutrition content: Calories, macros, and hydration.</p>
                </Tabs.Panel>
            </>
        ),
    },
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
                <div key={variant}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 'bold' }}>{variant}</p>
                    <Tabs journey="health" variant={variant}>
                        <Tabs.TabList>
                            <Tabs.Tab label="Tab One" />
                            <Tabs.Tab label="Tab Two" />
                            <Tabs.Tab label="Tab Three" />
                        </Tabs.TabList>
                        <Tabs.Panel index={0}>
                            <p>Panel One</p>
                        </Tabs.Panel>
                        <Tabs.Panel index={1}>
                            <p>Panel Two</p>
                        </Tabs.Panel>
                        <Tabs.Panel index={2}>
                            <p>Panel Three</p>
                        </Tabs.Panel>
                    </Tabs>
                </div>
            ))}
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {(['sm', 'md', 'lg'] as const).map((size) => (
                <div key={size}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 'bold' }}>{size}</p>
                    <Tabs journey="health" size={size}>
                        <Tabs.TabList>
                            <Tabs.Tab label="First" />
                            <Tabs.Tab label="Second" />
                        </Tabs.TabList>
                        <Tabs.Panel index={0}>
                            <p>First panel</p>
                        </Tabs.Panel>
                        <Tabs.Panel index={1}>
                            <p>Second panel</p>
                        </Tabs.Panel>
                    </Tabs>
                </div>
            ))}
        </div>
    ),
};
