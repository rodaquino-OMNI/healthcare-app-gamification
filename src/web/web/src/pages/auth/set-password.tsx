import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import { WEB_PROFILE_ROUTES } from 'shared/constants/routes';
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

const StyledInput = styled.input<{ hasError?: boolean }>`
    width: 100%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[70]};
    padding: ${spacing.sm} ${spacing.md};
    border: 1px solid ${(props) => (props.hasError ? colors.semantic.error : colors.gray[20])};
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

const StrengthContainer = styled.div`
    margin: ${spacing.sm} 0;
`;

const StrengthBar = styled.div`
    display: flex;
    gap: ${spacing['3xs']};
    margin-bottom: ${spacing['3xs']};
`;

const StrengthSegment = styled.div<{ active: boolean; color: string }>`
    height: 4px;
    flex: 1;
    border-radius: 2px;
    background-color: ${(props) => (props.active ? props.color : colors.gray[10])};
    transition: background-color 0.2s ease;
`;

const StrengthLabel = styled.span<{ color: string }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.medium};
    color: ${(props) => props.color};
`;

const RulesList = styled.ul`
    list-style: none;
    padding: 0;
    margin: ${spacing.md} 0;
`;

const RuleItem = styled.li<{ met: boolean }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${(props) => (props.met ? colors.semantic.success : colors.gray[40])};
    display: flex;
    align-items: center;
    gap: ${spacing['3xs']};
    margin-bottom: ${spacing['3xs']};
`;

const RuleIcon = styled.span<{ met: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    font-size: 10px;
    background-color: ${(props) => (props.met ? colors.semantic.success : colors.gray[20])};
    color: ${(props) => (props.met ? colors.neutral.white : colors.gray[40])};
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
    margin-top: ${spacing.md};

    &:hover:not(:disabled) {
        background-color: ${colors.brandPalette[400]};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ErrorText = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.semantic.error};
    margin: ${spacing['3xs']} 0 0;
`;

interface PasswordRules {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
}

function evaluatePassword(password: string): PasswordRules {
    return {
        minLength: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };
}

function getStrength(rules: PasswordRules): { level: number; label: string; color: string } {
    const met = Object.values(rules).filter(Boolean).length;
    if (met <= 1) {
        return { level: 1, label: 'Fraca', color: colors.semantic.error };
    }
    if (met <= 2) {
        return { level: 2, label: 'Razoavel', color: colors.semantic.warning };
    }
    if (met <= 3) {
        return { level: 3, label: 'Boa', color: colors.brand.primary };
    }
    if (met <= 4) {
        return { level: 4, label: 'Forte', color: colors.semantic.success };
    }
    return { level: 5, label: 'Excelente', color: colors.semantic.success };
}

/**
 * Set Password page with password strength indicator and validation rules.
 */
export default function SetPasswordPage(): React.ReactElement {
    const router = useRouter();
    const { isLoading: isAuthLoading, error: authError } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmError, setConfirmError] = useState(authError ?? '');

    const rules = useMemo(() => evaluatePassword(password), [password]);
    const strength = useMemo(() => getStrength(rules), [rules]);
    const allRulesMet = Object.values(rules).every(Boolean);
    const passwordsMatch = password === confirmPassword;

    const handleSubmit = async (): Promise<void> => {
        if (!passwordsMatch) {
            setConfirmError('As senhas nao coincidem.');
            return;
        }
        if (!allRulesMet) {
            return;
        }

        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push(WEB_PROFILE_ROUTES.SETUP);
        } catch {
            setConfirmError('Erro ao definir senha. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout>
            <Title>Definir Senha</Title>
            <Subtitle>Crie uma senha segura para sua conta.</Subtitle>

            <FieldGroup>
                <Label htmlFor="password">Senha</Label>
                <StyledInput
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setConfirmError('');
                    }}
                    aria-label="Senha"
                />
            </FieldGroup>

            {password.length > 0 && (
                <>
                    <StrengthContainer>
                        <StrengthBar>
                            {[1, 2, 3, 4, 5].map((level) => (
                                <StrengthSegment key={level} active={level <= strength.level} color={strength.color} />
                            ))}
                        </StrengthBar>
                        <StrengthLabel color={strength.color}>{strength.label}</StrengthLabel>
                    </StrengthContainer>

                    <RulesList>
                        <RuleItem met={rules.minLength}>
                            <RuleIcon met={rules.minLength}>{rules.minLength ? '\u2713' : '\u2022'}</RuleIcon>
                            Minimo de 8 caracteres
                        </RuleItem>
                        <RuleItem met={rules.uppercase}>
                            <RuleIcon met={rules.uppercase}>{rules.uppercase ? '\u2713' : '\u2022'}</RuleIcon>
                            Uma letra maiuscula
                        </RuleItem>
                        <RuleItem met={rules.lowercase}>
                            <RuleIcon met={rules.lowercase}>{rules.lowercase ? '\u2713' : '\u2022'}</RuleIcon>
                            Uma letra minuscula
                        </RuleItem>
                        <RuleItem met={rules.number}>
                            <RuleIcon met={rules.number}>{rules.number ? '\u2713' : '\u2022'}</RuleIcon>
                            Um numero
                        </RuleItem>
                        <RuleItem met={rules.special}>
                            <RuleIcon met={rules.special}>{rules.special ? '\u2713' : '\u2022'}</RuleIcon>
                            Um caractere especial
                        </RuleItem>
                    </RulesList>
                </>
            )}

            <FieldGroup>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <StyledInput
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    hasError={!!confirmError}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setConfirmError('');
                    }}
                    aria-label="Confirmar senha"
                />
                {confirmError && <ErrorText>{confirmError}</ErrorText>}
            </FieldGroup>

            <SubmitButton
                onClick={() => void handleSubmit()}
                disabled={isSubmitting || isAuthLoading || !allRulesMet || !confirmPassword}
            >
                {isSubmitting ? 'Salvando...' : 'Definir Senha'}
            </SubmitButton>
        </AuthLayout>
    );
}
