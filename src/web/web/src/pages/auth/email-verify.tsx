import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { WEB_AUTH_ROUTES } from 'shared/constants/routes';
import styled from 'styled-components';

import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/layouts/AuthLayout';

const Title = styled.h2`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    text-align: center;
    margin: 0 0 ${spacing.xs} 0;
`;

const Subtitle = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
    text-align: center;
    margin: 0 0 ${spacing.xl} 0;
    line-height: ${typography.lineHeight.base};
`;

const OtpContainer = styled.div`
    display: flex;
    gap: ${spacing.xs};
    justify-content: center;
    margin-bottom: ${spacing.xl};
`;

const OtpInput = styled.input<{ hasValue: boolean }>`
    width: 48px;
    height: 56px;
    text-align: center;
    font-family: ${typography.fontFamily.mono};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    border: 2px solid ${(props) => (props.hasValue ? colors.brand.primary : colors.gray[20])};
    border-radius: 10px;
    outline: none;
    transition: border-color 0.15s ease;

    &:focus {
        border-color: ${colors.brand.primary};
        box-shadow: 0 0 0 3px ${colors.brand.primary}20;
    }

    &::placeholder {
        color: ${colors.gray[30]};
    }
`;

const TimerText = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
    text-align: center;
    margin: 0 0 ${spacing.md} 0;
`;

const SubmitButton = styled.button`
    width: 100%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.white};
    background-color: ${colors.brand.primary};
    border: none;
    border-radius: 10px;
    padding: ${spacing.sm} ${spacing.xl};
    cursor: pointer;
    transition: background-color 0.15s ease;
    margin-bottom: ${spacing.md};

    &:hover:not(:disabled) {
        background-color: ${colors.brandPalette[400]};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ResendButton = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.brand.primary};
    background: none;
    border: none;
    cursor: pointer;
    display: block;
    margin: 0 auto;

    &:hover:not(:disabled) {
        text-decoration: underline;
    }

    &:disabled {
        color: ${colors.gray[40]};
        cursor: not-allowed;
    }
`;

const FeedbackMessage = styled.p<{ variant: 'success' | 'error' }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${(props) => (props.variant === 'success' ? colors.semantic.success : colors.semantic.error)};
    background-color: ${(props) => (props.variant === 'success' ? colors.semantic.successBg : colors.semantic.errorBg)};
    text-align: center;
    padding: ${spacing.xs} ${spacing.sm};
    border-radius: 8px;
    margin: 0 0 ${spacing.md} 0;
`;

const COUNTDOWN_SECONDS = 60;
const OTP_LENGTH = 6;

/**
 * Email verification page with 6-digit OTP input.
 * Includes countdown timer and resend functionality.
 */
export default function EmailVerifyPage(): React.ReactElement {
    const router = useRouter();
    const { isLoading: isAuthLoading, error: authError } = useAuth();
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const isDisabled = isSubmitting || isAuthLoading;

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [countdown]);

    const handleInputChange = (index: number, value: string): void => {
        if (!/^\d*$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setFeedback(null);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent): void => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        const newOtp = [...otp];
        pasted.split('').forEach((char, i) => {
            newOtp[i] = char;
        });
        setOtp(newOtp);
        const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleSubmit = async (): Promise<void> => {
        const code = otp.join('');
        if (code.length < OTP_LENGTH) {
            setFeedback({ type: 'error', message: 'Por favor, insira todos os 6 digitos.' });
            return;
        }

        setIsSubmitting(true);
        try {
            // Simulated API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setFeedback({ type: 'success', message: 'E-mail verificado com sucesso!' });
            setTimeout(() => router.push(WEB_AUTH_ROUTES.SET_PASSWORD), 1500);
        } catch {
            setFeedback({ type: 'error', message: 'Codigo invalido. Tente novamente.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = (): void => {
        setCountdown(COUNTDOWN_SECONDS);
        setOtp(Array(OTP_LENGTH).fill(''));
        setFeedback({ type: 'success', message: 'Novo codigo enviado para seu e-mail.' });
        inputRefs.current[0]?.focus();
    };

    const formatCountdown = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AuthLayout>
            <Title>Verificar E-mail</Title>
            <Subtitle>
                Enviamos um codigo de 6 digitos para seu e-mail. Insira-o abaixo para verificar sua conta.
            </Subtitle>

            <OtpContainer>
                {otp.map((digit, index) => (
                    <OtpInput
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        hasValue={digit !== ''}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        aria-label={`Digito ${index + 1}`}
                    />
                ))}
            </OtpContainer>

            {countdown > 0 && <TimerText>Codigo expira em {formatCountdown(countdown)}</TimerText>}

            {authError && <FeedbackMessage variant="error">{authError}</FeedbackMessage>}
            {feedback && <FeedbackMessage variant={feedback.type}>{feedback.message}</FeedbackMessage>}

            <SubmitButton onClick={() => void handleSubmit()} disabled={isDisabled || otp.join('').length < OTP_LENGTH}>
                {isSubmitting ? 'Verificando...' : 'Verificar'}
            </SubmitButton>

            <ResendButton onClick={handleResend} disabled={countdown > 0}>
                {countdown > 0 ? `Reenviar codigo em ${formatCountdown(countdown)}` : 'Reenviar codigo'}
            </ResendButton>
        </AuthLayout>
    );
}
