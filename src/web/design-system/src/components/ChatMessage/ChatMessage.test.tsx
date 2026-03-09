import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { ChatMessage, TypingIndicator } from './ChatMessage';

describe('ChatMessage', () => {
    it('renders sent message', () => {
        render(<ChatMessage message="Hello there!" sender="Alice" timestamp="10:30 AM" variant="sent" />);
        expect(screen.getByTestId('chat-message')).toBeInTheDocument();
        expect(screen.getByTestId('chat-text')).toHaveTextContent('Hello there!');
    });

    it('renders received message', () => {
        render(<ChatMessage message="Hi!" sender="Bob" timestamp="10:31 AM" variant="received" />);
        expect(screen.getByTestId('chat-text')).toHaveTextContent('Hi!');
    });

    it('displays sender name', () => {
        render(<ChatMessage message="Test" sender="Alice" timestamp="10:30 AM" variant="sent" />);
        expect(screen.getByTestId('chat-sender')).toHaveTextContent('Alice');
    });

    it('displays timestamp', () => {
        render(<ChatMessage message="Test" sender="Alice" timestamp="10:30 AM" variant="sent" />);
        expect(screen.getByTestId('chat-timestamp')).toHaveTextContent('10:30 AM');
    });

    it('shows avatar with initials when no avatar provided', () => {
        render(<ChatMessage message="Test" sender="Alice" timestamp="10:30 AM" variant="sent" />);
        expect(screen.getByTestId('chat-avatar')).toHaveTextContent('A');
    });

    it('renders custom avatar', () => {
        render(
            <ChatMessage
                message="Test"
                sender="Alice"
                timestamp="10:30 AM"
                variant="sent"
                avatar={<img alt="avatar" data-testid="custom-avatar" />}
            />
        );
        expect(screen.getByTestId('custom-avatar')).toBeInTheDocument();
    });

    it('renders sent variant chat bubble', () => {
        render(<ChatMessage message="Hello" sender="Alice" timestamp="10:30 AM" variant="sent" />);
        expect(screen.getByTestId('chat-bubble')).toBeInTheDocument();
    });

    it('renders received variant chat bubble', () => {
        render(<ChatMessage message="Hello" sender="Bob" timestamp="10:30 AM" variant="received" />);
        expect(screen.getByTestId('chat-bubble')).toBeInTheDocument();
    });

    it('renders meta info section', () => {
        render(<ChatMessage message="Test" sender="Alice" timestamp="10:30 AM" variant="sent" />);
        expect(screen.getByTestId('chat-meta')).toBeInTheDocument();
    });

    it('applies accessibilityLabel when provided', () => {
        render(
            <ChatMessage
                message="Test"
                sender="Alice"
                timestamp="10:30 AM"
                variant="sent"
                accessibilityLabel="Message from Alice"
            />
        );
        expect(screen.getByTestId('chat-message')).toHaveAttribute('aria-label', 'Message from Alice');
    });

    it('renders with journey prop health', () => {
        render(<ChatMessage message="Test" sender="Alice" timestamp="10:30 AM" variant="sent" journey="health" />);
        expect(screen.getByTestId('chat-message')).toBeInTheDocument();
    });

    it('renders with journey prop care', () => {
        render(<ChatMessage message="Test" sender="Alice" timestamp="10:30 AM" variant="sent" journey="care" />);
        expect(screen.getByTestId('chat-message')).toBeInTheDocument();
    });

    it('renders with journey prop plan', () => {
        render(<ChatMessage message="Test" sender="Alice" timestamp="10:30 AM" variant="sent" journey="plan" />);
        expect(screen.getByTestId('chat-message')).toBeInTheDocument();
    });

    it('shows first letter initial from multi-word sender name', () => {
        render(<ChatMessage message="Test" sender="Dr. Smith" timestamp="10:30 AM" variant="received" />);
        expect(screen.getByTestId('chat-avatar')).toHaveTextContent('D');
    });
});

describe('TypingIndicator', () => {
    it('renders typing indicator', () => {
        render(<TypingIndicator />);
        expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
    });

    it('shows sender name when provided', () => {
        render(<TypingIndicator sender="Dr. Smith" />);
        expect(screen.getByTestId('typing-label')).toHaveTextContent('Dr. Smith is typing');
    });

    it('does not show label when no sender', () => {
        render(<TypingIndicator />);
        expect(screen.queryByTestId('typing-label')).not.toBeInTheDocument();
    });

    it('renders with journey prop', () => {
        render(<TypingIndicator sender="Alice" journey="health" />);
        expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
    });

    it('renders without sender and without journey', () => {
        render(<TypingIndicator />);
        expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
        expect(screen.queryByTestId('typing-label')).not.toBeInTheDocument();
    });
});
