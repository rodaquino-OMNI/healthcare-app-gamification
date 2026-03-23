import { describe, it, expect } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { ChatMessage, TypingIndicator, AIImmersiveInput } from './ChatMessage';

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

    describe('AI variants', () => {
        it('renders ai-assistant variant left-aligned with AI badge', () => {
            render(
                <ChatMessage
                    message="I can help you with that."
                    sender="Health Assistant"
                    timestamp="10:30 AM"
                    variant="ai-assistant"
                />
            );
            expect(screen.getByTestId('chat-message')).toBeInTheDocument();
            expect(screen.getByTestId('chat-bubble')).toBeInTheDocument();
            expect(screen.getByTestId('chat-ai-badge')).toHaveTextContent('AI');
        });

        it('renders ai-companion variant left-aligned with AI badge', () => {
            render(
                <ChatMessage
                    message="How are you feeling today?"
                    sender="Wellness Companion"
                    timestamp="10:31 AM"
                    variant="ai-companion"
                />
            );
            expect(screen.getByTestId('chat-message')).toBeInTheDocument();
            expect(screen.getByTestId('chat-bubble')).toBeInTheDocument();
            expect(screen.getByTestId('chat-ai-badge')).toHaveTextContent('AI');
        });

        it('does not render AI badge for sent variant', () => {
            render(<ChatMessage message="Hello" sender="Alice" timestamp="10:30 AM" variant="sent" />);
            expect(screen.queryByTestId('chat-ai-badge')).not.toBeInTheDocument();
        });

        it('does not render AI badge for received variant', () => {
            render(<ChatMessage message="Hello" sender="Bob" timestamp="10:30 AM" variant="received" />);
            expect(screen.queryByTestId('chat-ai-badge')).not.toBeInTheDocument();
        });
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

describe('AIImmersiveInput', () => {
    it('renders the input container', () => {
        render(<AIImmersiveInput value="" onChangeText={() => {}} onSend={() => {}} />);
        expect(screen.getByTestId('ai-immersive-input')).toBeInTheDocument();
        expect(screen.getByTestId('ai-immersive-input-field')).toBeInTheDocument();
        expect(screen.getByTestId('ai-immersive-input-send')).toBeInTheDocument();
    });

    it('renders with custom testID', () => {
        render(<AIImmersiveInput value="" onChangeText={() => {}} onSend={() => {}} testID="custom-input" />);
        expect(screen.getByTestId('custom-input')).toBeInTheDocument();
        expect(screen.getByTestId('custom-input-field')).toBeInTheDocument();
        expect(screen.getByTestId('custom-input-send')).toBeInTheDocument();
    });

    it('calls onSend when send button is clicked', () => {
        const onSend = jest.fn();
        render(<AIImmersiveInput value="Hello" onChangeText={() => {}} onSend={onSend} />);
        fireEvent.click(screen.getByTestId('ai-immersive-input-send'));
        expect(onSend).toHaveBeenCalledTimes(1);
    });

    it('calls onChangeText when input value changes', () => {
        const onChangeText = jest.fn();
        render(<AIImmersiveInput value="" onChangeText={onChangeText} onSend={() => {}} />);
        fireEvent.change(screen.getByTestId('ai-immersive-input-field'), {
            target: { value: 'Hello' },
        });
        expect(onChangeText).toHaveBeenCalledWith('Hello');
    });

    it('renders with custom placeholder', () => {
        render(
            <AIImmersiveInput value="" onChangeText={() => {}} onSend={() => {}} placeholder="Ask me anything..." />
        );
        expect(screen.getByPlaceholderText('Ask me anything...')).toBeInTheDocument();
    });
});
