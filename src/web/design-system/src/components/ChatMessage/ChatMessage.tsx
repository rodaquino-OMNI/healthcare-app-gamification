import React from 'react';
import styled, { keyframes } from 'styled-components';

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { shadows } from '../../tokens/shadows';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export type ChatMessageVariant = 'sent' | 'received' | 'ai-assistant' | 'ai-companion';

export interface ChatMessageProps {
    message: string;
    sender: string;
    timestamp: string;
    variant: ChatMessageVariant;
    avatar?: React.ReactNode;
    journey?: 'health' | 'care' | 'plan';
    accessibilityLabel?: string;
}

export interface AIImmersiveInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    placeholder?: string;
    journey?: 'health' | 'care' | 'plan';
    testID?: string;
}

export interface TypingIndicatorProps {
    sender?: string;
    journey?: 'health' | 'care' | 'plan';
}

const getJourneyColor = (journey?: string): string => {
    if (journey && colors.journeys[journey as keyof typeof colors.journeys]) {
        return colors.journeys[journey as keyof typeof colors.journeys].primary;
    }
    return colors.brand.primary;
};

const MessageWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const isLeftAligned = (variant: ChatMessageVariant): boolean =>
    variant === 'received' || variant === 'ai-assistant' || variant === 'ai-companion';

const MessageContainer = styled.div<{ variant: ChatMessageVariant }>`
    display: flex;
    flex-direction: ${(props) => (isLeftAligned(props.variant) ? 'row' : 'row-reverse')};
    align-items: flex-end;
    gap: ${spacing.xs};
    max-width: 80%;
    align-self: ${(props) => (isLeftAligned(props.variant) ? 'flex-start' : 'flex-end')};
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

const getBubbleBg = (variant: ChatMessageVariant, journey?: string): string => {
    switch (variant) {
        case 'sent':
            return getJourneyColor(journey);
        case 'ai-assistant':
            return colors.gray[10];
        case 'ai-companion':
            return colors.semantic.infoBg;
        case 'received':
        default:
            return colors.neutral.gray100;
    }
};

const Bubble = styled.div<{ variant: ChatMessageVariant; journey?: string }>`
    padding: ${spacing.sm} ${spacing.md};
    border-radius: ${borderRadius.lg};
    background-color: ${(props) => getBubbleBg(props.variant, props.journey)};
    color: ${(props) => (props.variant === 'sent' ? colors.neutral.white : colors.neutral.gray900)};
    box-shadow: ${shadows.sm};
    ${(props) =>
        isLeftAligned(props.variant)
            ? `border-bottom-left-radius: ${borderRadius.xs};`
            : `border-bottom-right-radius: ${borderRadius.xs};`}
`;

const MessageText = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    line-height: ${typography.lineHeight.base};
    margin: 0;
`;

const AIBadge = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-2xs']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.semantic.info};
    background-color: ${colors.semantic.infoBg};
    padding: 1px ${spacing['3xs']};
    border-radius: ${borderRadius.sm};
    margin-right: ${spacing['3xs']};
`;

const MetaInfo = styled.div<{ variant: ChatMessageVariant }>`
    display: flex;
    gap: ${spacing.xs};
    margin-top: ${spacing['3xs']};
    justify-content: ${(props) => (isLeftAligned(props.variant) ? 'flex-start' : 'flex-end')};
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

const getAILabel = (variant: ChatMessageVariant): string | null => {
    if (variant === 'ai-assistant') {
        return 'AI';
    }
    if (variant === 'ai-companion') {
        return 'AI';
    }
    return null;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    sender,
    timestamp,
    variant,
    avatar,
    journey,
    accessibilityLabel,
}) => {
    const getInitials = (name: string): string => name.charAt(0).toUpperCase();
    const aiLabel = getAILabel(variant);

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
                {aiLabel && <AIBadge data-testid="chat-ai-badge">{aiLabel}</AIBadge>}
                <SenderName data-testid="chat-sender">{sender}</SenderName>
                <Timestamp data-testid="chat-timestamp">{timestamp}</Timestamp>
            </MetaInfo>
        </MessageWrapper>
    );
};

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    gap: ${spacing.xs};
    padding: ${spacing.xs} ${spacing.sm};
    background-color: ${colors.neutral.white};
    border-radius: ${borderRadius.full};
    box-shadow: ${shadows.md};
    border: 1px solid ${colors.gray[20]};
`;

const StyledInput = styled.input`
    flex: 1;
    border: none;
    outline: none;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.neutral.gray900};
    background: transparent;
    padding: ${spacing.xs} 0;

    &::placeholder {
        color: ${colors.gray[40]};
    }
`;

const SendButton = styled.button<{ journey?: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${spacing['2xl']};
    height: ${spacing['2xl']};
    border-radius: ${borderRadius.full};
    border: none;
    cursor: pointer;
    background-color: ${(props) => getJourneyColor(props.journey)};
    color: ${colors.neutral.white};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.85;
    }

    &:active {
        opacity: 0.7;
    }
`;

export const AIImmersiveInput: React.FC<AIImmersiveInputProps> = ({
    value,
    onChangeText,
    onSend,
    placeholder = 'Type a message...',
    journey,
    testID,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter' && value.trim()) {
            onSend();
        }
    };

    return (
        <InputContainer data-testid={testID || 'ai-immersive-input'}>
            <StyledInput
                type="text"
                value={value}
                onChange={(e) => onChangeText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                data-testid={testID ? `${testID}-field` : 'ai-immersive-input-field'}
                aria-label={placeholder}
            />
            <SendButton
                journey={journey}
                onClick={onSend}
                data-testid={testID ? `${testID}-send` : 'ai-immersive-input-send'}
                aria-label="Send message"
                type="button"
            >
                Send
            </SendButton>
        </InputContainer>
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
