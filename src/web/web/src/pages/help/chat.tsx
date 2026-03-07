import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { colors, typography, spacing, borderRadius } from 'design-system/tokens';

interface ChatMessage {
    id: string;
    sender: 'user' | 'agent';
    text: string;
    time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: '1',
        sender: 'agent',
        text: 'Ola! Sou a assistente virtual do AUSTA. Como posso ajudar voce hoje?',
        time: '14:30',
    },
];

/**
 * Live chat interface page.
 * Simple chat UI for support conversations.
 */
const ChatPage: NextPage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const userMsg: ChatMessage = {
            id: String(Date.now()),
            sender: 'user',
            text: input.trim(),
            time: timeStr,
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');

        // Simulated agent response
        setTimeout(() => {
            const agentMsg: ChatMessage = {
                id: String(Date.now() + 1),
                sender: 'agent',
                text: 'Obrigada pela sua mensagem! Um atendente humano entrara em contato em breve. Tempo estimado de espera: 3 minutos.',
                time: timeStr,
            };
            setMessages((prev) => [...prev, agentMsg]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '80vh',
                maxWidth: '600px',
                margin: '0 auto',
                padding: spacing.md,
            }}
        >
            {/* Header */}
            <div style={headerStyle}>
                <button onClick={() => router.push('/help')} style={backBtnStyle}>
                    &larr;
                </button>
                <div>
                    <h1 style={headerTitleStyle}>Chat ao Vivo</h1>
                    <span style={headerStatusStyle}>Atendente disponivel</span>
                </div>
            </div>

            {/* Messages */}
            <div style={messagesContainerStyle}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            display: 'flex',
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            marginBottom: spacing.sm,
                        }}
                    >
                        <div
                            style={{
                                ...bubbleStyle,
                                backgroundColor: msg.sender === 'user' ? colors.brand.primary : colors.gray[10],
                                color: msg.sender === 'user' ? colors.neutral.white : colors.gray[70],
                            }}
                        >
                            <p style={bubbleTextStyle}>{msg.text}</p>
                            <span
                                style={{
                                    ...timeStyle,
                                    color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : colors.gray[40],
                                }}
                            >
                                {msg.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input area */}
            <div style={inputAreaStyle}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem..."
                    style={inputStyle}
                    aria-label="Mensagem"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    style={{
                        ...sendBtnStyle,
                        backgroundColor: input.trim() ? colors.brand.primary : colors.gray[30],
                    }}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.gray[0],
    borderRadius: `${borderRadius.md} ${borderRadius.md} 0 0`,
    borderBottom: `1px solid ${colors.gray[10]}`,
};
const backBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: colors.brand.primary,
    fontSize: typography.fontSize['heading-md'],
    cursor: 'pointer',
    padding: spacing.xs,
};
const headerTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    margin: 0,
    fontFamily: typography.fontFamily.body,
};
const headerStatusStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-xs'],
    color: colors.semantic.success,
    fontFamily: typography.fontFamily.body,
};
const messagesContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: spacing.md,
    backgroundColor: colors.gray[5],
};
const bubbleStyle: React.CSSProperties = {
    maxWidth: '75%',
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
};
const bubbleTextStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    lineHeight: typography.lineHeight.base,
    fontFamily: typography.fontFamily.body,
    margin: 0,
};
const timeStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-2xs'],
    display: 'block',
    marginTop: spacing['3xs'],
    textAlign: 'right' as const,
};
const inputAreaStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.gray[0],
    borderTop: `1px solid ${colors.gray[10]}`,
    borderRadius: `0 0 ${borderRadius.md} ${borderRadius.md}`,
};
const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.gray[20]}`,
    fontSize: typography.fontSize['text-md'],
    fontFamily: typography.fontFamily.body,
    color: colors.gray[70],
    boxSizing: 'border-box',
};
const sendBtnStyle: React.CSSProperties = {
    padding: `${spacing.sm} ${spacing.md}`,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: typography.fontFamily.body,
    flexShrink: 0,
};

export default ChatPage;
