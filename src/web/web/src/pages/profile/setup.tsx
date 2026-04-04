import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WEB_PROFILE_ROUTES } from 'shared/constants/routes';
import styled from 'styled-components';

import { useSafeNavRouter as useRouter } from '@/hooks/useSafeRouter';
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

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${spacing.md};
    margin-bottom: ${spacing.md};

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const FieldGroup = styled.div<{ fullWidth?: boolean }>`
    ${(props) => props.fullWidth && `grid-column: 1 / -1;`}
    margin-bottom: 0;
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

const StepIndicator = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.gray[40]};
    text-align: center;
    margin: ${spacing.md} 0 0;
`;

interface ProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
}

/**
 * Profile setup page - collects basic user information (name, email, phone, DOB).
 * Uses a two-column grid layout for desktop screens.
 */

export const getServerSideProps = () => ({ props: {} });

export default function ProfileSetupPage(): React.ReactElement {
    const { t: _t } = useTranslation();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<ProfileFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
    });

    const handleChange = (field: keyof ProfileFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const isValid = form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.phone.trim();

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!isValid) {
            return;
        }

        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            router.push(WEB_PROFILE_ROUTES.ADDRESS);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout>
            <Title>Configurar Perfil</Title>
            <Subtitle>Preencha seus dados pessoais para continuar.</Subtitle>

            <form onSubmit={(e) => void handleSubmit(e)}>
                <FormGrid>
                    <FieldGroup>
                        <Label htmlFor="firstName">Nome</Label>
                        <StyledInput
                            id="firstName"
                            type="text"
                            placeholder="Seu nome"
                            value={form.firstName}
                            onChange={handleChange('firstName')}
                            aria-label="Nome"
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Label htmlFor="lastName">Sobrenome</Label>
                        <StyledInput
                            id="lastName"
                            type="text"
                            placeholder="Seu sobrenome"
                            value={form.lastName}
                            onChange={handleChange('lastName')}
                            aria-label="Sobrenome"
                        />
                    </FieldGroup>

                    <FieldGroup fullWidth>
                        <Label htmlFor="email">E-mail</Label>
                        <StyledInput
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={form.email}
                            onChange={handleChange('email')}
                            aria-label="E-mail"
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Label htmlFor="phone">Telefone</Label>
                        <StyledInput
                            id="phone"
                            type="tel"
                            placeholder="(11) 99999-0000"
                            value={form.phone}
                            onChange={handleChange('phone')}
                            aria-label="Telefone"
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Label htmlFor="dob">Data de Nascimento</Label>
                        <StyledInput
                            id="dob"
                            type="date"
                            value={form.dob}
                            onChange={handleChange('dob')}
                            aria-label="Data de nascimento"
                        />
                    </FieldGroup>
                </FormGrid>

                <SubmitButton type="submit" disabled={isSubmitting || !isValid}>
                    {isSubmitting ? 'Salvando...' : 'Continuar'}
                </SubmitButton>
            </form>

            <StepIndicator>Passo 1 de 5</StepIndicator>
        </AuthLayout>
    );
}
