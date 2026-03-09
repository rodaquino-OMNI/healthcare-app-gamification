import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import { useRouter } from 'next/navigation';
import React from 'react';
import { WEB_AUTH_ROUTES } from 'shared/constants/routes';
import styled from 'styled-components';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, ${colors.brand.primary} 0%, ${colors.brand.secondary} 100%);
    padding: ${spacing.xl};
`;

const HeroCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 480px;
    width: 100%;
`;

const LogoText = styled.h1`
    font-family: ${typography.fontFamily.logo};
    font-size: ${typography.heading.h1};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.neutral.white};
    margin: 0 0 ${spacing.sm} 0;
    letter-spacing: ${typography.letterSpacing.tight};
`;

const Tagline = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xl']};
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 ${spacing['3xl']} 0;
    line-height: ${typography.lineHeight.relaxed};
`;

const Subtitle = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: rgba(255, 255, 255, 0.75);
    margin: 0 0 ${spacing['4xl']} 0;
    line-height: ${typography.lineHeight.base};
    max-width: 360px;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${spacing.md};
    width: 100%;
    max-width: 320px;
`;

const PrimaryButton = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.brand.primary};
    background-color: ${colors.neutral.white};
    border: none;
    border-radius: 12px;
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

const SecondaryButton = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.white};
    background-color: transparent;
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-radius: 12px;
    padding: ${spacing.md} ${spacing.xl};
    cursor: pointer;
    transition:
        background-color 0.15s ease,
        border-color 0.15s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        border-color: ${colors.neutral.white};
    }
`;

/**
 * Welcome page - the first screen users see when visiting the app.
 * Features a brand gradient hero section with login and sign-up CTAs.
 */
export default function WelcomePage(): React.ReactElement {
    const router = useRouter();

    return (
        <PageContainer>
            <HeroCard>
                <LogoText>AUSTA</LogoText>
                <Tagline>Sua saude, conectada.</Tagline>
                <Subtitle>Gerencie sua saude, consultas, plano e conquistas em um unico lugar.</Subtitle>
                <ButtonGroup>
                    <PrimaryButton onClick={() => router.push(WEB_AUTH_ROUTES.LOGIN)}>Entrar</PrimaryButton>
                    <SecondaryButton onClick={() => router.push(WEB_AUTH_ROUTES.REGISTER)}>Criar Conta</SecondaryButton>
                </ButtonGroup>
            </HeroCard>
        </PageContainer>
    );
}
