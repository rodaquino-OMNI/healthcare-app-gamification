import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTelemedicine } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface AsyncMessage {
    id: string;
    sender: 'doctor' | 'patient';
    text: string;
    time: string;
    date: string;
    read: boolean;
}

/** Asynchronous messaging page for non-urgent doctor communication. */
const AsyncChatPage: React.FC = () => {
    const router = useRouter();
    const { isLoading, error } = useTelemedicine();
    const messages: AsyncMessage[] = [];
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    {t('common.loading')}
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    {t('common.error')}
                </Text>
            </div>
        );
    }

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
                                {'--'}
                            </Text>
                        </div>
                        <div>
                            <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                Doctor
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                Specialist
                            </Text>
                        </div>
                    </Box>
                    <Badge variant="status" status="success">
                        Online
                    </Badge>
                </Box>
                <Text fontSize="sm" color={colors.gray[40]} style={{ marginTop: spacing.xs }}>
                    Usually responds within 2 hours
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
                    {messages.map((msg) => (
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

export const getServerSideProps = () => ({ props: {} });

export default AsyncChatPage;
