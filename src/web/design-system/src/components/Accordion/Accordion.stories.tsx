import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import Accordion from './Accordion';

const meta: Meta<typeof Accordion> = {
    title: 'Components/Accordion',
    component: Accordion,
    tags: ['autodocs'],
    argTypes: {
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        isExpanded: { control: 'boolean' },
        title: { control: 'text' },
        onToggle: { action: 'toggled' },
    },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
    args: {
        title: 'What is AUSTA Health?',
        content:
            'AUSTA Health is a comprehensive healthcare platform that connects patients with providers, manages health records, and promotes wellness through gamification.',
    },
};

export const Expanded: Story = {
    args: {
        title: 'Health Tips',
        content:
            'Regular exercise, balanced diet, adequate sleep, and stress management are key pillars of good health.',
        isExpanded: true,
    },
};

export const WithJourney: Story = {
    render: (): React.ReactElement => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Accordion
                journey="health"
                title="Health Journey"
                content="Manage your physical health metrics and appointments."
            />
            <Accordion
                journey="care"
                title="Care Journey"
                content="Connect with your care team and manage medications."
            />
            <Accordion
                journey="plan"
                title="Plan Journey"
                content="View your insurance coverage and financial benefits."
            />
        </div>
    ),
};

const ControlledAccordion = (): React.ReactElement => {
    const [expanded, setExpanded] = useState(false);
    return (
        <Accordion
            title={expanded ? 'Click to collapse' : 'Click to expand'}
            content="This is a controlled accordion. The parent component manages the expanded state."
            isExpanded={expanded}
            onToggle={(next) => setExpanded(next)}
        />
    );
};

export const Controlled: Story = {
    render: () => <ControlledAccordion />,
};
