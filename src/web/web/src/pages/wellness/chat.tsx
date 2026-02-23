import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', sender: 'ai', text: 'Hello! I am your AI Wellness Companion. How are you feeling today?', timestamp: '9:30 AM' },
  { id: '2', sender: 'user', text: 'I have been feeling a bit stressed lately.', timestamp: '9:31 AM' },
  { id: '3', sender: 'ai', text: 'I understand. Stress is common but manageable. Would you like to try a breathing exercise, talk about what is causing your stress, or explore some relaxation techniques?', timestamp: '9:31 AM' },
];

const QUICK_SUGGESTIONS = [
  'Breathing exercise',
  'Sleep tips',
  'Stress management',
  'Meditation guide',
];

const ChatPage: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        text: 'Thank you for sharing. Let me suggest some wellness strategies that might help.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl, display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
      <Box display="flex" alignItems="center" style={{ marginBottom: spacing.lg }}>
        <button
          onClick={() => router.push('/wellness')}
          style={{ background: 'none', border: 'none', color: colors.journeys.health.primary, cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: 0, marginRight: spacing.md }}
          aria-label="Back to wellness home"
        >
          Back
        </button>
        <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.text}>
          AI Wellness Chat
        </Text>
      </Box>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.lg }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '75%',
            }}
          >
            <Card
              journey="health"
              elevation="sm"
              padding="sm"
            >
              <div style={{
                backgroundColor: msg.sender === 'user' ? colors.journeys.health.primary : colors.gray[5],
                borderRadius: '12px',
                padding: `${spacing.xs} ${spacing.sm}`,
              }}>
                <Text fontSize="sm" color={msg.sender === 'user' ? colors.gray[0] : colors.gray[70]}>
                  {msg.text}
                </Text>
              </div>
              <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing['3xs'], textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                {msg.timestamp}
              </Text>
            </Card>
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start' }}>
            <Text fontSize="sm" color={colors.gray[40]} fontStyle="italic">AI is thinking...</Text>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap', marginBottom: spacing.sm }}>
        {QUICK_SUGGESTIONS.map((suggestion) => (
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
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
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
