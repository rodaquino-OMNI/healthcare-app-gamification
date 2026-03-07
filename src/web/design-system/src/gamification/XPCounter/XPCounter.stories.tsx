import type { Meta, StoryObj } from '@storybook/react';
import { XPCounter } from './XPCounter';

const meta: Meta<typeof XPCounter> = {
    title: 'Gamification/XPCounter',
    component: XPCounter,
    tags: ['autodocs'],
    argTypes: {
        currentXP: { control: { type: 'range', min: 0, max: 10000, step: 50 } },
        nextLevelXP: { control: { type: 'range', min: 500, max: 20000, step: 100 } },
        levelXP: { control: { type: 'range', min: 0, max: 10000, step: 50 } },
        level: { control: { type: 'range', min: 1, max: 50, step: 1 } },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof XPCounter>;

export const Default: Story = {
    args: {
        currentXP: 1200,
        nextLevelXP: 2000,
        levelXP: 1000,
        level: 5,
        journey: 'health',
    },
};

export const HighLevel: Story = {
    args: {
        currentXP: 15500,
        nextLevelXP: 18000,
        levelXP: 14000,
        level: 20,
        journey: 'health',
    },
};

export const LowProgress: Story = {
    args: {
        currentXP: 50,
        nextLevelXP: 500,
        levelXP: 0,
        level: 1,
        journey: 'health',
    },
};

export const AlmostLevelUp: Story = {
    args: {
        currentXP: 1950,
        nextLevelXP: 2000,
        levelXP: 1500,
        level: 7,
        journey: 'health',
    },
};

export const CareJourney: Story = {
    args: {
        currentXP: 3600,
        nextLevelXP: 5000,
        levelXP: 3000,
        level: 12,
        journey: 'care',
    },
};

export const PlanJourney: Story = {
    args: {
        currentXP: 800,
        nextLevelXP: 1500,
        levelXP: 500,
        level: 3,
        journey: 'plan',
    },
};

export const NoLevel: Story = {
    args: {
        currentXP: 2400,
        nextLevelXP: 3000,
        levelXP: 2000,
        journey: 'health',
    },
};
