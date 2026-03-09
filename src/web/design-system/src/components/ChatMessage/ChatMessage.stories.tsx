import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ChatMessage, TypingIndicator } from './ChatMessage';

const meta: Meta<typeof ChatMessage> = {
    title: 'Components/ChatMessage',
    component: ChatMessage,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['sent', 'received'],
        },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        message: { control: 'text' },
        sender: { control: 'text' },
        timestamp: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof ChatMessage>;

export const Default: Story = {
    args: {
        message: 'Hello! How can I help you today?',
        sender: 'Dr. Ana',
        timestamp: '10:30',
        variant: 'received',
        journey: 'health',
    },
};

export const Sent: Story = {
    args: {
        message: 'I have been feeling dizzy lately.',
        sender: 'You',
        timestamp: '10:31',
        variant: 'sent',
        journey: 'health',
    },
};

export const Received: Story = {
    args: {
        message: 'I recommend scheduling an appointment. Would Tuesday work for you?',
        sender: 'Dr. Carlos',
        timestamp: '10:32',
        variant: 'received',
        journey: 'care',
    },
};

export const Conversation: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '500px' }}>
            <ChatMessage
                message="Good morning! How are you feeling today?"
                sender="Dr. Ana"
                timestamp="09:00"
                variant="received"
                journey="health"
            />
            <ChatMessage
                message="A bit tired, but otherwise okay."
                sender="You"
                timestamp="09:01"
                variant="sent"
                journey="health"
            />
            <ChatMessage
                message="Did you take your medication this morning?"
                sender="Dr. Ana"
                timestamp="09:02"
                variant="received"
                journey="health"
            />
            <ChatMessage message="Yes, I did." sender="You" timestamp="09:03" variant="sent" journey="health" />
        </div>
    ),
};

export const WithTypingIndicator: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '500px' }}>
            <ChatMessage
                message="I will review your results shortly."
                sender="Dr. Ana"
                timestamp="10:45"
                variant="received"
                journey="health"
            />
            <TypingIndicator sender="Dr. Ana" journey="health" />
        </div>
    ),
};

export const TypingIndicatorOnly: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <TypingIndicator sender="Dr. Carlos" journey="care" />
            <TypingIndicator journey="health" />
        </div>
    ),
};
