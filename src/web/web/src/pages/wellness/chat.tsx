import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import { useWellness } from '@/hooks/useWellness';

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
}

const PLACEHOLDER_USER_ID = 'me';
const PLACEHOLDER_SESSION_ID = 'session-1';

const QUICK_SUGGESTIONS = ['Breathing exercise', 'Sleep tips', 'Stress management', 'Meditation guide'];

const ChatPage: React.FC = () => {
    const router = useRouter();
    const { chatHistory, quickReplies, sendMessage, loadChatHistory, loadQuickReplies } = useWellness();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        void loadChatHistory(PLACEHOLDER_USER_ID, PLACEHOLDER_SESSION_ID);
        void loadQuickReplies(PLACEHOLDER_USER_ID, PLACEHOLDER_SESSION_ID);
    }, [loadChatHistory, loadQuickReplies]);

    useEffect(() => {
        if (chatHistory) {
            const mapped: Message[] = chatHistory.messages.map((m) => ({
                id: m.id,
                sender: m.role === 'user' ? 'user' : 'ai',
                text: m.content,
                timestamp: m.timestamp,
            }));
            setMessages(mapped);
        }
    }, [chatHistory]);

    const displayQuickSuggestions = quickReplies.length > 0 ? quickReplies.slice(0, 4) : QUICK_SUGGESTIONS;

    const handleSend = (): void => {
        if (!input.trim()) {
            return;
        }
        const userMsg: Message = {
            id: `u-${Date.now()}`,
            sender: 'user',
            text: input.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, userMsg]);
        const content = input.trim();
        setInput('');
        setIsTyping(true);
        void sendMessage(PLACEHOLDER_USER_ID, content, PLACEHOLDER_SESSION_ID)
            .then((reply) => {
                const aiMsg: Message = {
                    id: reply.id,
                    sender: 'ai',
                    text: reply.content,
                    timestamp: reply.timestamp,
                };
                setMessages((prev) => [...prev, aiMsg]);
                setIsTyping(false);
            })
            .catch(() => {
                setIsTyping(false);
            });
    };

    const handleQuickSuggestion = (suggestion: string): void => {
        setInput(suggestion);
    };

    return (
        <div
            style={{
                maxWidth: '720px',
                margin: '0 auto',
                padding: spacing.xl,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '80vh',
            }}
        >
            <Box display="flex" alignItems="center" style={{ marginBottom: spacing.lg }}>
                <button
                    onClick={() => void router.push('/wellness')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: colors.journeys.health.primary,
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        padding: 0,
                        marginRight: spacing.md,
                    }}
                    aria-label="Back to wellness home"
                >
                    Back
                </button>
                <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.text}>
                    AI Wellness Chat
                </Text>
            </Box>

            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm,
                    marginBottom: spacing.lg,
                }}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                        }}
                    >
                        <Card journey="health" elevation="sm" padding="sm">
                            <div
                                style={{
                                    backgroundColor:
                                        msg.sender === 'user' ? colors.journeys.health.primary : colors.gray[5],
                                    borderRadius: '12px',
                                    padding: `${spacing.xs} ${spacing.sm}`,
                                }}
                            >
                                <Text fontSize="sm" color={msg.sender === 'user' ? colors.gray[0] : colors.gray[70]}>
                                    {msg.text}
                                </Text>
                            </div>
                            <Text
                                fontSize="xs"
                                color={colors.gray[40]}
                                style={{
                                    marginTop: spacing['3xs'],
                                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                                }}
                            >
                                {msg.timestamp}
                            </Text>
                        </Card>
                    </div>
                ))}
                {isTyping && (
                    <div style={{ alignSelf: 'flex-start' }}>
                        <Text fontSize="sm" color={colors.gray[40]} fontStyle="italic">
                            AI is thinking...
                        </Text>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap', marginBottom: spacing.sm }}>
                {displayQuickSuggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => handleQuickSuggestion(suggestion)}
                        style={{
                            padding: `${spacing['3xs']} ${spacing.sm}`,
                            borderRadius: '16px',
                            border: `1px solid ${colors.journeys.health.primary}`,
                            backgroundColor: colors.journeys.health.background,
                            color: colors.journeys.health.primary,
                            fontSize: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            <Box display="flex" style={{ gap: spacing.sm }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSend();
                        }
                    }}
                    placeholder="Type a message..."
                    aria-label="Message input"
                    style={{
                        flex: 1,
                        padding: spacing.sm,
                        borderRadius: '8px',
                        border: `1px solid ${colors.gray[20]}`,
                        fontSize: '14px',
                        outline: 'none',
                    }}
                />
                <Button variant="primary" journey="health" onPress={handleSend} accessibilityLabel="Send message">
                    Send
                </Button>
            </Box>
        </div>
    );
};

export default ChatPage;
