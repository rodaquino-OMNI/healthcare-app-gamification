import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { borderRadius } from 'src/web/design-system/src/tokens/borderRadius';

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

  ${props => {
    switch (props.variant) {
      case 'google':
        return `
          background-color: ${colors.neutral.white};
          border-color: ${colors.neutral.gray300};
          color: ${colors.neutral.gray900};

          &:hover {
            background-color: ${colors.neutral.gray50};
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
    background-color: ${colors.neutral.gray50};
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

export default function SocialAuthPage() {
  const router = useRouter();

  const handleSocialAuth = (provider: string) => {
    console.log(`Iniciando autenticação com ${provider}`);
    // TODO: Implement actual OAuth flow
  };

  const handleEmailLogin = () => {
    router.push('/auth/login');
  };

  const handleLegalLink = (page: string) => {
    router.push(`/${page}`);
  };

  return (
    <PageContainer>
      <FormContainer>
        <Title>Bem-vindo</Title>
        <Description>Faça login ou crie uma conta para continuar</Description>

        <SocialButtonsContainer>
          <SocialButton
            variant="google"
            onClick={() => handleSocialAuth('Google')}
          >
            <span>🔍</span>
            Continuar com Google
          </SocialButton>

          <SocialButton
            variant="apple"
            onClick={() => handleSocialAuth('Apple')}
          >
            <span>🍎</span>
            Continuar com Apple
          </SocialButton>

          <SocialButton
            variant="facebook"
            onClick={() => handleSocialAuth('Facebook')}
          >
            <span>📘</span>
            Continuar com Facebook
          </SocialButton>
        </SocialButtonsContainer>

        <Divider>
          <DividerText>ou continue com email</DividerText>
        </Divider>

        <EmailLink onClick={handleEmailLogin}>
          Continuar com Email
        </EmailLink>

        <LegalText>
          Ao continuar, você concorda com nossa{' '}
          <LegalLink onClick={() => handleLegalLink('privacy-policy')}>
            Política de Privacidade
          </LegalLink>
          {' '}e{' '}
          <LegalLink onClick={() => handleLegalLink('terms')}>
            Termos de Serviço
          </LegalLink>
          . De acordo com a LGPD, seus dados serão processados de forma segura.
        </LegalText>
      </FormContainer>
    </PageContainer>
  );
}
