import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { RadioButton } from './RadioButton';

const meta: Meta<typeof RadioButton> = {
    title: 'Components/RadioButton',
    component: RadioButton,
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
type Story = StoryObj<typeof RadioButton>;

const DefaultRadio = (): React.ReactElement => {
    const [selected, setSelected] = useState('');
    return (
        <RadioButton
            id="r1"
            name="group"
            value="option1"
            label="Option 1"
            checked={selected === 'option1'}
            onChange={() => setSelected('option1')}
        />
    );
};

export const Default: Story = {
    render: () => <DefaultRadio />,
};

export const Checked: Story = {
    render: (): React.ReactElement => (
        <RadioButton
            id="checked"
            name="group"
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
            <RadioButton
                id="d1"
                name="d"
                value="d1"
                label="Disabled unchecked"
                checked={false}
                disabled
                onChange={() => {}}
            />
            <RadioButton
                id="d2"
                name="d"
                value="d2"
                label="Disabled checked"
                checked={true}
                disabled
                onChange={() => {}}
            />
        </div>
    ),
};

const RadioGroupDemo = (): React.ReactElement => {
    const [selected, setSelected] = useState('');
    const options = ['Morning', 'Afternoon', 'Evening'];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {options.map((opt) => (
                <RadioButton
                    key={opt}
                    id={opt.toLowerCase()}
                    name="time"
                    value={opt.toLowerCase()}
                    label={opt}
                    checked={selected === opt.toLowerCase()}
                    onChange={() => setSelected(opt.toLowerCase())}
                    journey="health"
                />
            ))}
        </div>
    );
};

export const RadioGroup: Story = {
    render: () => <RadioGroupDemo />,
};
