import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
    title: 'Components/DatePicker',
    component: DatePicker,
    tags: ['autodocs'],
    argTypes: {
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        disabled: { control: 'boolean' },
        label: { control: 'text' },
        placeholder: { control: 'text' },
        error: { control: 'text' },
        dateFormat: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
    render: () => {
        const [date, setDate] = useState<Date | null>(null);
        return (
            <div style={{ maxWidth: '320px' }}>
                <DatePicker value={date} onChange={setDate} placeholder="Select a date" journey="health" />
            </div>
        );
    },
};

export const WithLabel: Story = {
    render: () => {
        const [date, setDate] = useState<Date | null>(null);
        return (
            <div style={{ maxWidth: '320px' }}>
                <DatePicker
                    value={date}
                    onChange={setDate}
                    label="Appointment Date"
                    placeholder="dd/MM/yyyy"
                    journey="care"
                />
            </div>
        );
    },
};

export const WithError: Story = {
    render: () => {
        const [date, setDate] = useState<Date | null>(null);
        return (
            <div style={{ maxWidth: '320px' }}>
                <DatePicker
                    value={date}
                    onChange={setDate}
                    label="Birth Date"
                    error="Please select a valid date"
                    journey="health"
                />
            </div>
        );
    },
};

export const Disabled: Story = {
    render: () => (
        <div style={{ maxWidth: '320px' }}>
            <DatePicker value={new Date()} onChange={() => {}} label="Locked Date" disabled journey="plan" />
        </div>
    ),
};
