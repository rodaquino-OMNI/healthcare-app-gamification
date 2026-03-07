import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface ChatMessage {
    id: string;
    sender: 'doctor' | 'patient';
    text: string;
    time: string;
}

const MOCK_MESSAGES: ChatMessage[] = [
    { id: 'm1', sender: 'doctor', text: 'Hello! How are you feeling today?', time: '10:01' },
    { id: 'm2', sender: 'patient', text: 'I have been having headaches for the past 3 days.', time: '10:02' },
    {
        id: 'm3',
        sender: 'doctor',
        text: 'I see. Can you describe the pain? Is it constant or intermittent?',
        time: '10:03',
    },
    { id: 'm4', sender: 'patient', text: 'It comes and goes, mostly in the afternoon.', time: '10:04' },
];

const QUICK_REPLIES = ['Yes, that is correct', 'I have a question', 'Can you repeat that?'];

/** In-call chat panel for text communication during telemedicine sessions. */
const ChatPage: React.FC = () => {
    const router = useRouter();

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing.lg }}>
                <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                    In-Call Chat
                </Text>
                <Badge variant="status" status="success">
                    Live
                </Badge>
            </Box>

            <Card journey="care" elevation="md" padding="lg" style={{ marginBottom: spacing.lg }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, minHeight: '300px' }}>
                    {MOCK_MESSAGES.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                alignSelf: msg.sender === 'patient' ? 'flex-end' : 'flex-start',
                                maxWidth: '75%',
                            }}
                        >
                            <div
                                style={{
                                    padding: spacing.sm,
                                    borderRadius: spacing.xs,
                                    backgroundColor:
                                        msg.sender === 'patient' ? colors.journeys.care.primary : colors.gray[10],
                                }}
                            >
                                <Text
                                    fontSize="sm"
                                    color={msg.sender === 'patient' ? colors.neutral.white : colors.journeys.care.text}
                                >
                                    {msg.text}
                                </Text>
                            </div>
                            <Text fontSize="sm" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                                {msg.sender === 'doctor' ? 'Dr. Santos' : 'You'} - {msg.time}
                            </Text>
                        </div>
                    ))}
                </div>
            </Card>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md }}>
                {QUICK_REPLIES.map((reply) => (
                    <Button
                        key={reply}
                        variant="tertiary"
                        journey="care"
                        onPress={() => {}}
                        accessibilityLabel={reply}
                        data-testid={`quick-reply-${reply.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                        {reply}
                    </Button>
                ))}
            </div>

            <Box display="flex" style={{ gap: spacing.sm }}>
                <div
                    style={{
                        flex: 1,
                        padding: spacing.sm,
                        border: `1px solid ${colors.gray[20]}`,
                        borderRadius: spacing.xs,
                        backgroundColor: colors.neutral.white,
                    }}
                >
                    <Text fontSize="sm" color={colors.gray[40]}>
                        Type a message...
                    </Text>
                </div>
                <Button journey="care" onPress={() => {}} accessibilityLabel="Send message" data-testid="chat-send-btn">
                    Send
                </Button>
            </Box>

            <Box display="flex" justifyContent="center" style={{ marginTop: spacing.lg }}>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Return to video"
                    data-testid="chat-back-to-video-btn"
                >
                    Return to Video
                </Button>
            </Box>
        </div>
    );
};

export default ChatPage;
