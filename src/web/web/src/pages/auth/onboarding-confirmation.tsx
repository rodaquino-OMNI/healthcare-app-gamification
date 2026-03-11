import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import { useRouter } from 'next/navigation';
import React from 'react';
import styled from 'styled-components';

import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/layouts/AuthLayout';

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const SuccessIconCircle = styled.div`
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background-color: ${colors.semantic.successBg};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing.xl};
`;

const SuccessEmoji = styled.span`
    font-size: 44px;
`;

const Title = styled.h2`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    margin: 0 0 ${spacing.xs} 0;
`;

const Subtitle = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[50]};
    line-height: ${typography.lineHeight.relaxed};
    margin: 0 0 ${spacing['2xl']} 0;
    max-width: 360px;
`;

const SummaryCard = styled.div`
    width: 100%;
    background-color: ${colors.gray[5]};
    border-radius: ${borderRadius.lg};
    padding: ${spacing.md};
    margin-bottom: ${spacing['2xl']};
    text-align: left;
`;

const SummaryTitle = styled.h3`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.gray[60]};
    margin: 0 0 ${spacing.sm} 0;
    text-transform: uppercase;
    letter-spacing: 1px;
`;

const SummaryRow = styled.div`
    display: flex;
    align-items: center;
    padding: ${spacing.xs} 0;
    border-bottom: 1px solid ${colors.gray[10]};

    &:last-child {
        border-bottom: none;
    }
`;

const SummaryIcon = styled.span`
    font-size: 18px;
    margin-right: ${spacing.sm};
`;

const SummaryLabel = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[70]};
    flex: 1;
`;

const SummaryBadge = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.semantic.success};
    background-color: ${colors.semantic.successBg};
    padding: 2px ${spacing.xs};
    border-radius: 100px;
`;

const PrimaryButton = styled.button`
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

const CelebrationText = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.brand.primary};
    margin: ${spacing.md} 0 0;
`;

const MOCK_GOALS = [
    { icon: '\uD83C\uDFC3', label: 'Fitness e Exercicio' },
    { icon: '\uD83E\uDD57', label: 'Nutricao e Dieta' },
    { icon: '\uD83C\uDF19', label: 'Qualidade do Sono' },
];

/**
 * Onboarding Confirmation page - shows success message after
 * completing the personalization flow with a summary of selected goals.
 */
export default function OnboardingConfirmationPage(): React.ReactElement {
    const router = useRouter();
    const { session: _session } = useAuth();

    return (
        <AuthLayout>
            <ContentContainer>
                <SuccessIconCircle>
                    <SuccessEmoji>{'\u2705'}</SuccessEmoji>
                </SuccessIconCircle>

                <Title>Personalizacao Completa!</Title>
                <Subtitle>
                    Suas preferencias foram salvas com sucesso. O AUSTA esta pronto para ajudar voce a alcancar seus
                    objetivos.
                </Subtitle>

                <SummaryCard>
                    <SummaryTitle>Seus Objetivos</SummaryTitle>
                    {MOCK_GOALS.map((goal, index) => (
                        <SummaryRow key={index}>
                            <SummaryIcon>{goal.icon}</SummaryIcon>
                            <SummaryLabel>{goal.label}</SummaryLabel>
                            <SummaryBadge>Selecionado</SummaryBadge>
                        </SummaryRow>
                    ))}
                </SummaryCard>

                <PrimaryButton onClick={() => router.push('/home')}>Comecar a Usar o AUSTA</PrimaryButton>

                <CelebrationText>Bem-vindo ao AUSTA SuperApp!</CelebrationText>
            </ContentContainer>
        </AuthLayout>
    );
}
