import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';
import { shadows } from '../../tokens/shadows';

export interface ChatMessageProps {
    message: string;
    sender: string;
    timestamp: string;
    variant: 'sent' | 'received';
    avatar?: React.ReactNode;
    journey?: 'health' | 'care' | 'plan';
    accessibilityLabel?: string;
}

export interface TypingIndicatorProps {
    sender?: string;
    journey?: 'health' | 'care' | 'plan';
}

const getJourneyColor = (journey?: string) => {
    if (journey && colors.journeys[journey as keyof typeof colors.journeys]) {
        return colors.journeys[journey as keyof typeof colors.journeys].primary;
    }
    return colors.brand.primary;
};

const MessageWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const MessageContainer = styled.div<{ variant: 'sent' | 'received' }>`
    display: flex;
    flex-direction: ${(props) => (props.variant === 'sent' ? 'row-reverse' : 'row')};
    align-items: flex-end;
    gap: ${spacing.xs};
    max-width: 80%;
    align-self: ${(props) => (props.variant === 'sent' ? 'flex-end' : 'flex-start')};
`;

const AvatarWrapper = styled.div`
    width: ${spacing['2xl']};
    height: ${spacing['2xl']};
    border-radius: ${borderRadius.full};
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${colors.neutral.gray300};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.gray700};
`;

const Bubble = styled.div<{ variant: 'sent' | 'received'; journey?: string }>`
    padding: ${spacing.sm} ${spacing.md};
    border-radius: ${borderRadius.lg};
    background-color: ${(props) =>
        props.variant === 'sent' ? getJourneyColor(props.journey) : colors.neutral.gray100};
    color: ${(props) => (props.variant === 'sent' ? colors.neutral.white : colors.neutral.gray900)};
    box-shadow: ${shadows.sm};
    ${(props) =>
        props.variant === 'sent'
            ? `border-bottom-right-radius: ${borderRadius.xs};`
            : `border-bottom-left-radius: ${borderRadius.xs};`}
`;

const MessageText = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    line-height: ${typography.lineHeight.base};
    margin: 0;
`;

const MetaInfo = styled.div<{ variant: 'sent' | 'received' }>`
    display: flex;
    gap: ${spacing.xs};
    margin-top: ${spacing['3xs']};
    justify-content: ${(props) => (props.variant === 'sent' ? 'flex-end' : 'flex-start')};
`;

const SenderName = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.neutral.gray600};
`;

const Timestamp = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    color: ${colors.neutral.gray500};
`;

const bounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-${spacing['3xs']}); }
`;

const TypingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: ${spacing.xs};
    padding: ${spacing.sm} ${spacing.md};
    background-color: ${colors.neutral.gray100};
    border-radius: ${borderRadius.lg};
    border-bottom-left-radius: ${borderRadius.xs};
    align-self: flex-start;
    box-shadow: ${shadows.sm};
`;

const TypingDot = styled.span<{ delay: number; journey?: string }>`
    width: ${spacing['2xs']};
    height: ${spacing['2xs']};
    border-radius: ${borderRadius.full};
    background-color: ${(props) => getJourneyColor(props.journey)};
    opacity: 0.6;
    display: inline-block;
    animation: ${bounce} 1.4s ease-in-out infinite;
    animation-delay: ${(props) => props.delay}s;
`;

const TypingLabel = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    color: ${colors.neutral.gray500};
    margin-left: ${spacing.xs};
`;

export const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    sender,
    timestamp,
    variant,
    avatar,
    journey,
    accessibilityLabel,
}) => {
    const getInitials = (name: string) => name.charAt(0).toUpperCase();

    return (
        <MessageWrapper
            data-testid="chat-message"
            role="group"
            aria-label={accessibilityLabel || `Message from ${sender} at ${timestamp}`}
        >
            <MessageContainer variant={variant}>
                <AvatarWrapper data-testid="chat-avatar" aria-hidden="true">
                    {avatar || getInitials(sender)}
                </AvatarWrapper>
                <Bubble variant={variant} journey={journey} data-testid="chat-bubble">
                    <MessageText data-testid="chat-text">{message}</MessageText>
                </Bubble>
            </MessageContainer>
            <MetaInfo variant={variant} data-testid="chat-meta">
                <SenderName data-testid="chat-sender">{sender}</SenderName>
                <Timestamp data-testid="chat-timestamp">{timestamp}</Timestamp>
            </MetaInfo>
        </MessageWrapper>
    );
};

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ sender, journey }) => (
    <TypingContainer
        data-testid="typing-indicator"
        role="status"
        aria-label={sender ? `${sender} is typing` : 'Someone is typing'}
    >
        <TypingDot delay={0} journey={journey} aria-hidden="true" />
        <TypingDot delay={0.2} journey={journey} aria-hidden="true" />
        <TypingDot delay={0.4} journey={journey} aria-hidden="true" />
        {sender && (
            <TypingLabel data-testid="typing-label" aria-hidden="true">
                {sender} is typing
            </TypingLabel>
        )}
    </TypingContainer>
);
