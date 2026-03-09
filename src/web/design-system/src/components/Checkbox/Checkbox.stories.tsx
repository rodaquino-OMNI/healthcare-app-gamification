import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    argTypes: {
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        checked: { control: 'boolean' },
        disabled: { control: 'boolean' },
        label: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

const DefaultCheckbox = (): React.ReactElement => {
    const [checked, setChecked] = useState(false);
    return (
        <Checkbox
            id="default"
            name="default"
            value="default"
            label="I agree to the terms"
            checked={checked}
            onChange={() => setChecked(!checked)}
        />
    );
};

export const Default: Story = {
    render: () => <DefaultCheckbox />,
};

export const Checked: Story = {
    render: (): React.ReactElement => (
        <Checkbox
            id="checked"
            name="checked"
            value="checked"
            label="Pre-selected option"
            checked={true}
            onChange={() => {}}
        />
    ),
};

export const Disabled: Story = {
    render: (): React.ReactElement => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Checkbox
                id="dis1"
                name="dis1"
                value="dis1"
                label="Disabled unchecked"
                checked={false}
                disabled
                onChange={() => {}}
            />
            <Checkbox
                id="dis2"
                name="dis2"
                value="dis2"
                label="Disabled checked"
                checked={true}
                disabled
                onChange={() => {}}
            />
        </div>
    ),
};

const JourneyCheckboxes = (): React.ReactElement => {
    const [h, setH] = useState(false);
    const [c, setC] = useState(false);
    const [p, setP] = useState(false);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Checkbox
                id="h"
                name="h"
                value="h"
                label="Health option"
                checked={h}
                journey="health"
                onChange={() => setH(!h)}
            />
            <Checkbox
                id="c"
                name="c"
                value="c"
                label="Care option"
                checked={c}
                journey="care"
                onChange={() => setC(!c)}
            />
            <Checkbox
                id="p"
                name="p"
                value="p"
                label="Plan option"
                checked={p}
                journey="plan"
                onChange={() => setP(!p)}
            />
        </div>
    );
};

export const WithJourney: Story = {
    render: () => <JourneyCheckboxes />,
};
