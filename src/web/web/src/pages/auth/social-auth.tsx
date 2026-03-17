import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React from 'react';
import styled from 'styled-components';

import { useAuth } from '@/hooks/useAuth';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: ${spacing.xl};
    font-family: ${typography.fontFamily.body};
    background-color: ${colors.neutral.white};
`;

const FormContainer = styled.div`
    width: 100%;
    max-width: 400px;
`;

const Title = styled.h1`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.neutral.gray900};
    margin: 0 0 ${spacing.md} 0;
    text-align: center;
`;

const Description = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.neutral.gray600};
    margin: 0 0 ${spacing.xl} 0;
    text-align: center;
`;

const SocialButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${spacing.md};
    margin-bottom: ${spacing.xl};
`;

const SocialButton = styled.button<{ variant: 'google' | 'apple' | 'facebook' }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    padding: ${spacing.md} ${spacing.lg};
    border-radius: ${borderRadius.md};
    border: 1px solid;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing.sm};

    ${(props) => {
        switch (props.variant) {
            case 'google':
                return `
          background-color: ${colors.neutral.white};
          border-color: ${colors.neutral.gray300};
          color: ${colors.neutral.gray900};

          &:hover {
            background-color: ${colors.neutral.gray100};
            border-color: ${colors.neutral.gray400};
          }
        `;
            case 'apple':
                return `
          background-color: ${colors.neutral.gray900};
          border-color: ${colors.neutral.gray900};
          color: ${colors.neutral.white};

          &:hover {
            background-color: ${colors.neutral.black};
            border-color: ${colors.neutral.black};
          }
        `;
            case 'facebook':
                return `
          background-color: ${colors.brand.primary};
          border-color: ${colors.brand.primary};
          color: ${colors.neutral.white};

          &:hover {
            opacity: 0.9;
          }
        `;
            default:
                return '';
        }
    }}
`;

const Divider = styled.div`
    display: flex;
    align-items: center;
    gap: ${spacing.md};
    margin: ${spacing.lg} 0;

    &::before,
    &::after {
        content: '';
        flex: 1;
        height: 1px;
        background-color: ${colors.neutral.gray300};
    }
`;

const DividerText = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.neutral.gray600};
`;

const EmailLink = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    width: 100%;
    padding: ${spacing.md} ${spacing.lg};
    background-color: ${colors.neutral.white};
    border: 1px solid ${colors.neutral.gray300};
    border-radius: ${borderRadius.md};
    color: ${colors.neutral.gray900};
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        background-color: ${colors.neutral.gray100};
        border-color: ${colors.neutral.gray400};
    }
`;

const LegalText = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.neutral.gray500};
    margin: ${spacing.xl} 0 0 0;
    text-align: center;
    line-height: ${typography.lineHeight.relaxed};
`;

const LegalLink = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.brand.primary};
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    transition: opacity 0.15s ease;

    &:hover {
        opacity: 0.7;
    }
`;

interface OAuthProviderConfig {
    authUrl: string;
    clientId: string;
    scope: string;
    redirectUri: string;
}

const getRedirectUri = (): string => (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '');

const OAUTH_CONFIG: Record<string, OAuthProviderConfig> = {
    google: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        scope: 'openid email profile',
        redirectUri: getRedirectUri(),
    },
    apple: {
        authUrl: 'https://appleid.apple.com/auth/authorize',
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '',
        scope: 'name email',
        redirectUri: getRedirectUri(),
    },
    facebook: {
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
        scope: 'email public_profile',
        redirectUri: getRedirectUri(),
    },
};

export const getServerSideProps = () => ({ props: {} });

export default function SocialAuthPage(): React.ReactElement {
    const router = useRouter();
    const { isAuthenticated: _isAuthenticated, isLoading: _isLoading } = useAuth();

    const handleSocialAuth = (provider: string): void => {
        const config = OAUTH_CONFIG[provider.toLowerCase()];
        if (!config?.clientId) {
            console.warn(`OAuth not configured for ${provider}`);
            return;
        }
        const state =
            typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(2);
        const params = new URLSearchParams({
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            response_type: 'code',
            scope: config.scope,
            state,
        });
        sessionStorage.setItem('oauth_state', state);
        window.location.href = `${config.authUrl}?${params.toString()}`;
    };

    const handleEmailLogin = (): void => {
        void router.push('/auth/login');
    };

    const handleLegalLink = (page: string): void => {
        void router.push(`/${page}`);
    };

    return (
        <PageContainer>
            <FormContainer>
                <Title>Bem-vindo</Title>
                <Description>Faça login ou crie uma conta para continuar</Description>

                <SocialButtonsContainer>
                    <SocialButton variant="google" onClick={() => handleSocialAuth('Google')}>
                        <span>🔍</span>
                        Continuar com Google
                    </SocialButton>

                    <SocialButton variant="apple" onClick={() => handleSocialAuth('Apple')}>
                        <span>🍎</span>
                        Continuar com Apple
                    </SocialButton>

                    <SocialButton variant="facebook" onClick={() => handleSocialAuth('Facebook')}>
                        <span>📘</span>
                        Continuar com Facebook
                    </SocialButton>
                </SocialButtonsContainer>

                <Divider>
                    <DividerText>ou continue com email</DividerText>
                </Divider>

                <EmailLink onClick={handleEmailLogin}>Continuar com Email</EmailLink>

                <LegalText>
                    Ao continuar, você concorda com nossa{' '}
                    <LegalLink onClick={() => handleLegalLink('privacy-policy')}>Política de Privacidade</LegalLink> e{' '}
                    <LegalLink onClick={() => handleLegalLink('terms')}>Termos de Serviço</LegalLink>. De acordo com a
                    LGPD, seus dados serão processados de forma segura.
                </LegalText>
            </FormContainer>
        </PageContainer>
    );
}
