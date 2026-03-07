import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import AuthLayout from 'src/web/web/src/layouts/AuthLayout';
import { WEB_AUTH_ROUTES } from 'src/web/shared/constants/routes';

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

const FieldGroup = styled.div`
    margin-bottom: ${spacing.md};
`;

const Label = styled.label`
    display: block;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.gray[60]};
    margin-bottom: ${spacing['3xs']};
`;

const StyledInput = styled.input`
    width: 100%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[70]};
    padding: ${spacing.sm} ${spacing.md};
    border: 1px solid ${colors.gray[20]};
    border-radius: 10px;
    outline: none;
    transition: border-color 0.15s ease;
    box-sizing: border-box;

    &:focus {
        border-color: ${colors.brand.primary};
        box-shadow: 0 0 0 3px ${colors.brand.primary}20;
    }

    &::placeholder {
        color: ${colors.gray[40]};
    }
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

    &:hover:not(:disabled) {
        background-color: ${colors.brandPalette[400]};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const SuccessCard = styled.div`
    text-align: center;
    padding: ${spacing.xl} 0;
`;

const SuccessIcon = styled.div`
    font-size: 48px;
    margin-bottom: ${spacing.md};
`;

const SuccessTitle = styled.h3`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-md']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    margin: 0 0 ${spacing.xs} 0;
`;

const SuccessText = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
    margin: 0 0 ${spacing.xl} 0;
    line-height: ${typography.lineHeight.base};
`;

const BackLink = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.brand.primary};
    background: none;
    border: none;
    cursor: pointer;
    display: block;
    margin: ${spacing.md} auto 0;

    &:hover {
        text-decoration: underline;
    }
`;

const ErrorText = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.semantic.error};
    margin: ${spacing['3xs']} 0 0;
`;

/**
 * Forgot Password page - allows users to request a password reset link via email.
 */
export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidEmail) {
            setError('Por favor, insira um e-mail valido.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsSuccess(true);
        } catch {
            setError('Erro ao enviar e-mail. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <AuthLayout>
                <SuccessCard>
                    <SuccessIcon>{'\u2709\uFE0F'}</SuccessIcon>
                    <SuccessTitle>E-mail Enviado</SuccessTitle>
                    <SuccessText>
                        Se uma conta com o e-mail <strong>{email}</strong> existir, voce recebera um link para redefinir
                        sua senha.
                    </SuccessText>
                    <SubmitButton onClick={() => router.push(WEB_AUTH_ROUTES.LOGIN)}>Voltar ao Login</SubmitButton>
                </SuccessCard>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <Title>Esqueceu a Senha?</Title>
            <Subtitle>Insira seu e-mail e enviaremos um link para redefinir sua senha.</Subtitle>

            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <Label htmlFor="email">E-mail</Label>
                    <StyledInput
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        aria-label="E-mail"
                    />
                    {error && <ErrorText>{error}</ErrorText>}
                </FieldGroup>

                <SubmitButton type="submit" disabled={isSubmitting || !email.trim()}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Link'}
                </SubmitButton>
            </form>

            <BackLink onClick={() => router.push(WEB_AUTH_ROUTES.LOGIN)}>Voltar ao Login</BackLink>
        </AuthLayout>
    );
}
