import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Stepper } from './Stepper';

const appointmentSteps = [
    { label: 'Choose Specialty', description: 'Select the type of care' },
    { label: 'Select Doctor', description: 'Find your provider' },
    { label: 'Pick Date', description: 'Choose appointment time' },
    { label: 'Confirm', description: 'Review and book' },
];

const meta: Meta<typeof Stepper> = {
    title: 'Components/Stepper',
    component: Stepper,
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
        },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        activeStep: { control: { type: 'range', min: 0, max: 3, step: 1 } },
        onStepPress: { action: 'step pressed' },
    },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
    args: {
        steps: appointmentSteps,
        activeStep: 1,
        orientation: 'horizontal',
        journey: 'care',
    },
};

export const Vertical: Story = {
    args: {
        steps: appointmentSteps,
        activeStep: 2,
        orientation: 'vertical',
        journey: 'health',
    },
};

export const WithDescriptions: Story = {
    args: {
        steps: appointmentSteps,
        activeStep: 1,
        orientation: 'horizontal',
        journey: 'care',
    },
};

const InteractiveStepper = (): React.ReactElement => {
    const [active, setActive] = useState(0);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Stepper steps={appointmentSteps} activeStep={active} journey="health" onStepPress={setActive} />
            <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}>
                    Previous
                </button>
                <button
                    onClick={() => setActive(Math.min(appointmentSteps.length - 1, active + 1))}
                    disabled={active === appointmentSteps.length - 1}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export const Interactive: Story = {
    render: () => <InteractiveStepper />,
};
