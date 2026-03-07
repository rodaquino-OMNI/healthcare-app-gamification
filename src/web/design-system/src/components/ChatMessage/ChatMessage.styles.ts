import styled, { keyframes } from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';
import { shadows } from '../../tokens/shadows';

export const MessageWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

export const MessageContainer = styled.div<{ variant: 'sent' | 'received' }>`
    display: flex;
    flex-direction: ${(props) => (props.variant === 'sent' ? 'row-reverse' : 'row')};
    align-items: flex-end;
    gap: ${spacing.xs};
    max-width: 80%;
    align-self: ${(props) => (props.variant === 'sent' ? 'flex-end' : 'flex-start')};
`;

export const AvatarWrapper = styled.div`
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

export const Bubble = styled.div<{ variant: 'sent' | 'received' }>`
    padding: ${spacing.sm} ${spacing.md};
    border-radius: ${borderRadius.lg};
    background-color: ${(props) => (props.variant === 'sent' ? colors.brand.primary : colors.neutral.gray100)};
    color: ${(props) => (props.variant === 'sent' ? colors.neutral.white : colors.neutral.gray900)};
    box-shadow: ${shadows.sm};
`;

export const MessageText = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    line-height: ${typography.lineHeight.base};
    margin: 0;
`;

export const MetaInfo = styled.div<{ variant: 'sent' | 'received' }>`
    display: flex;
    gap: ${spacing.xs};
    margin-top: ${spacing['3xs']};
    justify-content: ${(props) => (props.variant === 'sent' ? 'flex-end' : 'flex-start')};
`;

export const SenderName = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.neutral.gray600};
`;

export const Timestamp = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    color: ${colors.neutral.gray500};
`;

export const bounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-${spacing['3xs']}); }
`;

export const TypingContainer = styled.div`
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

export const TypingDot = styled.span<{ delay: number }>`
    width: ${spacing['2xs']};
    height: ${spacing['2xs']};
    border-radius: ${borderRadius.full};
    background-color: ${colors.brand.primary};
    opacity: 0.6;
    display: inline-block;
    animation: ${bounce} 1.4s ease-in-out infinite;
    animation-delay: ${(props) => props.delay}s;
`;

export const TypingLabel = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    color: ${colors.neutral.gray500};
    margin-left: ${spacing.xs};
`;
