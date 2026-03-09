import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';

interface AsyncMessage {
    id: string;
    sender: 'doctor' | 'patient';
    text: string;
    time: string;
    date: string;
    read: boolean;
}

const MOCK_DOCTOR = {
    name: 'Dr. Maria Santos',
    specialty: 'General Practitioner',
    responseTime: 'Usually responds within 2 hours',
};

const MOCK_MESSAGES: AsyncMessage[] = [
    {
        id: 'a1',
        sender: 'patient',
        text: 'Hi Dr. Santos, I wanted to let you know the headaches have improved since starting the medication.',
        time: '9:15 AM',
        date: 'Feb 20',
        read: true,
    },
    {
        id: 'a2',
        sender: 'doctor',
        text: 'That is great news! Are you experiencing any side effects from the ibuprofen or cyclobenzaprine?',
        time: '11:30 AM',
        date: 'Feb 20',
        read: true,
    },
    {
        id: 'a3',
        sender: 'patient',
        text: 'Some mild drowsiness from the cyclobenzaprine, but nothing too bad. Should I continue at the same dose?',
        time: '2:45 PM',
        date: 'Feb 20',
        read: true,
    },
    {
        id: 'a4',
        sender: 'doctor',
        text: 'Mild drowsiness is expected and should improve in a few days. Continue with the current dose. If drowsiness persists beyond a week, we can adjust. Keep me updated!',
        time: '4:10 PM',
        date: 'Feb 20',
        read: false,
    },
];

/** Asynchronous messaging page for non-urgent doctor communication. */
const AsyncChatPage: React.FC = () => {
    const router = useRouter();

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Message Your Doctor
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
                Send non-urgent messages to your care team.
            </Text>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                        <div
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                backgroundColor: colors.journeys.care.primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text fontSize="sm" fontWeight="bold" color={colors.neutral.white}>
                                MS
                            </Text>
                        </div>
                        <div>
                            <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                {MOCK_DOCTOR.name}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {MOCK_DOCTOR.specialty}
                            </Text>
                        </div>
                    </Box>
                    <Badge variant="status" status="success">
                        Online
                    </Badge>
                </Box>
                <Text fontSize="sm" color={colors.gray[40]} style={{ marginTop: spacing.xs }}>
                    {MOCK_DOCTOR.responseTime}
                </Text>
            </Card>

            <Card journey="care" elevation="md" padding="lg" style={{ marginBottom: spacing.lg }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: spacing.md,
                        minHeight: '260px',
                    }}
                >
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
                                {msg.date} at {msg.time}
                            </Text>
                        </div>
                    ))}
                </div>
            </Card>

            <Box display="flex" style={{ gap: spacing.sm }}>
                <Button
                    variant="tertiary"
                    journey="care"
                    onPress={() => {}}
                    accessibilityLabel="Attach file"
                    data-testid="async-chat-attach-btn"
                >
                    Attach
                </Button>
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
                        Type your message...
                    </Text>
                </div>
                <Button
                    journey="care"
                    onPress={() => {}}
                    accessibilityLabel="Send message"
                    data-testid="async-chat-send-btn"
                >
                    Send
                </Button>
            </Box>

            <Box display="flex" justifyContent="center" style={{ marginTop: spacing.xl }}>
                <Button
                    variant="tertiary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                    data-testid="async-chat-back-btn"
                >
                    Back
                </Button>
            </Box>
        </div>
    );
};

export default AsyncChatPage;
