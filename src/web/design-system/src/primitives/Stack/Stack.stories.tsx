import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';
import { colors } from '../../tokens/colors';

const meta: Meta<typeof Stack> = {
    title: 'Primitives/Stack',
    component: Stack,
    tags: ['autodocs'],
    argTypes: {
        direction: {
            control: 'select',
            options: ['column', 'row'],
        },
        align: {
            control: 'select',
            options: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
        },
        wrap: { control: 'boolean' },
        spacing: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof Stack>;

const Item = ({ label }: { label: string }) => (
    <div
        style={{
            padding: '12px 16px',
            background: colors.gray[10],
            borderRadius: '4px',
            minWidth: '80px',
            textAlign: 'center',
        }}
    >
        {label}
    </div>
);

export const Default: Story = {
    args: {
        direction: 'column',
        spacing: 'md',
        children: (
            <>
                <Item label="Item 1" />
                <Item label="Item 2" />
                <Item label="Item 3" />
            </>
        ),
    },
};

export const Row: Story = {
    args: {
        direction: 'row',
        spacing: 'md',
        align: 'center',
        children: (
            <>
                <Item label="Item 1" />
                <Item label="Item 2" />
                <Item label="Item 3" />
            </>
        ),
    },
};

export const Wrapped: Story = {
    args: {
        direction: 'row',
        spacing: 'sm',
        wrap: true,
        children: (
            <>
                {Array.from({ length: 8 }, (_, i) => (
                    <Item key={i} label={`Tag ${i + 1}`} />
                ))}
            </>
        ),
    },
    parameters: {
        docs: { description: { story: 'Stack with wrapping enabled — items wrap to the next line.' } },
    },
};

export const Responsive: Story = {
    args: {
        direction: { xs: 'column', md: 'row' },
        spacing: { xs: 'sm', md: 'lg' },
        children: (
            <>
                <Item label="Responsive 1" />
                <Item label="Responsive 2" />
                <Item label="Responsive 3" />
            </>
        ),
    },
};
