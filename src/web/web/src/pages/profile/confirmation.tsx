import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { colors } from 'design-system/tokens/colors';
import { typography } from 'design-system/tokens/typography';
import { spacing } from 'design-system/tokens/spacing';
import AuthLayout from '@/layouts/AuthLayout';

const SuccessContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const SuccessIcon = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: ${colors.semantic.successBg};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing.xl};
`;

const CheckMark = styled.span`
    font-size: 36px;
    color: ${colors.semantic.success};
`;

const Title = styled.h2`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    margin: 0 0 ${spacing.xs} 0;
`;

const Message = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[50]};
    line-height: ${typography.lineHeight.relaxed};
    margin: 0 0 ${spacing['2xl']} 0;
    max-width: 320px;
`;

const SummaryCard = styled.div`
    width: 100%;
    background-color: ${colors.gray[5]};
    border-radius: 12px;
    padding: ${spacing.md};
    margin-bottom: ${spacing.xl};
    text-align: left;
`;

const SummaryTitle = styled.h3`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.gray[60]};
    margin: 0 0 ${spacing.sm} 0;
    text-transform: uppercase;
    letter-spacing: ${typography.letterSpacing.wide};
`;

const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${spacing.xs} 0;
    border-bottom: 1px solid ${colors.gray[10]};

    &:last-child {
        border-bottom: none;
    }
`;

const SummaryLabel = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
`;

const SummaryValue = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.gray[70]};
`;

const StatusBadge = styled.span<{ variant: 'complete' | 'pending' }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.medium};
    padding: ${spacing['4xs']} ${spacing.xs};
    border-radius: 100px;
    ${(props) =>
        props.variant === 'complete'
            ? `
      background-color: ${colors.semantic.successBg};
      color: ${colors.semantic.success};
    `
            : `
      background-color: ${colors.semantic.warningBg};
      color: ${colors.semantic.warning};
    `}
`;

const ContinueButton = styled.button`
    width: 100%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.white};
    background: linear-gradient(135deg, ${colors.brand.primary}, ${colors.brand.secondary});
    border: none;
    border-radius: 10px;
    padding: ${spacing.md} ${spacing.xl};
    cursor: pointer;
    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
    }
`;

const StepIndicator = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.gray[40]};
    text-align: center;
    margin: ${spacing.md} 0 0;
`;

/**
 * Profile Confirmation page - shows success message and profile summary.
 * Final step in the onboarding flow before entering the dashboard.
 */
export default function ProfileConfirmationPage() {
    const router = useRouter();

    const handleContinue = () => {
        router.push('/home');
    };

    return (
        <AuthLayout>
            <SuccessContainer>
                <SuccessIcon>
                    <CheckMark>{'\u2713'}</CheckMark>
                </SuccessIcon>

                <Title>Perfil Completo!</Title>
                <Message>Seu perfil foi configurado com sucesso. Voce esta pronto para comecar a usar o AUSTA.</Message>

                <SummaryCard>
                    <SummaryTitle>Resumo do Perfil</SummaryTitle>

                    <SummaryRow>
                        <SummaryLabel>Dados Pessoais</SummaryLabel>
                        <StatusBadge variant="complete">Completo</StatusBadge>
                    </SummaryRow>

                    <SummaryRow>
                        <SummaryLabel>Endereco</SummaryLabel>
                        <StatusBadge variant="complete">Completo</StatusBadge>
                    </SummaryRow>

                    <SummaryRow>
                        <SummaryLabel>Documentos</SummaryLabel>
                        <StatusBadge variant="complete">Completo</StatusBadge>
                    </SummaryRow>

                    <SummaryRow>
                        <SummaryLabel>Foto de Perfil</SummaryLabel>
                        <StatusBadge variant="complete">Completo</StatusBadge>
                    </SummaryRow>

                    <SummaryRow>
                        <SummaryLabel>Verificacao de E-mail</SummaryLabel>
                        <StatusBadge variant="complete">Verificado</StatusBadge>
                    </SummaryRow>
                </SummaryCard>

                <ContinueButton onClick={handleContinue}>Ir para o Dashboard</ContinueButton>

                <StepIndicator>Passo 5 de 5 - Concluido</StepIndicator>
            </SuccessContainer>
        </AuthLayout>
    );
}
