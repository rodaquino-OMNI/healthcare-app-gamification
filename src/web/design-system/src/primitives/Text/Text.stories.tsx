import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Text } from './Text';

const meta: Meta<typeof Text> = {
    title: 'Primitives/Text',
    component: Text,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['display', 'heading', 'body', 'caption'],
        },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        as: {
            control: 'select',
            options: ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'div'],
        },
        textAlign: {
            control: 'select',
            options: ['left', 'right', 'center', 'justify'],
        },
        truncate: { control: 'boolean' },
        fontSize: { control: 'text' },
        fontWeight: { control: 'text' },
        color: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
    args: {
        children: 'Default text content',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Text variant="display">Display variant</Text>
            <Text variant="heading">Heading variant</Text>
            <Text variant="body">Body variant — used for most text content</Text>
            <Text variant="caption">Caption variant — smaller supporting text</Text>
        </div>
    ),
};

export const Truncated: Story = {
    args: {
        truncate: true,
        children:
            'This text is very long and will be truncated with an ellipsis when it overflows the container boundary',
        style: { maxWidth: '200px', display: 'block' },
    },
};

export const WithJourney: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Text journey="health">Health journey text</Text>
            <Text journey="care">Care journey text</Text>
            <Text journey="plan">Plan journey text</Text>
        </div>
    ),
};

export const AsParagraph: Story = {
    args: {
        as: 'p',
        variant: 'body',
        children: 'This renders as a paragraph element.',
    },
};
