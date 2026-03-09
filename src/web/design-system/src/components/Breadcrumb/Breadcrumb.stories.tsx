import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumb } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
    title: 'Components/Breadcrumb',
    component: Breadcrumb,
    tags: ['autodocs'],
    argTypes: {
        separator: { control: 'text' },
        accessibilityLabel: { control: 'text' },
        onItemPress: { action: 'item pressed' },
    },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
    args: {
        items: [{ label: 'Home', href: '/' }, { label: 'Health', href: '/health' }, { label: 'Appointments' }],
        separator: '/',
    },
};

export const CustomSeparator: Story = {
    args: {
        items: [{ label: 'Home', href: '/' }, { label: 'Care', href: '/care' }, { label: 'Medications' }],
        separator: '>',
    },
};

export const LongPath: Story = {
    args: {
        items: [
            { label: 'Home', href: '/' },
            { label: 'Health', href: '/health' },
            { label: 'Monitoring', href: '/health/monitoring' },
            { label: 'Heart Rate', href: '/health/monitoring/heart-rate' },
            { label: 'Weekly Report' },
        ],
    },
};
