import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import type { AuthNavigationProp } from '../../navigation/types';

import { ROUTES } from '../../constants/routes';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentWrapper = styled.View`
  flex: 1;
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['3xl']};
  padding-bottom: ${spacing['2xl']};
  justify-content: center;
`;

const HeaderSection = styled.View`
  align-items: center;
  margin-bottom: ${spacing['2xl']};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  text-align: center;
  margin-bottom: ${spacing.xs};
`;

const Subtitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  line-height: 22px;
`;

const SocialButtonsSection = styled.View`
  margin-bottom: ${spacing.xl};
`;

const SocialButton = styled.TouchableOpacity<{ bgColor: string; borderColor?: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: ${spacing.md};
  padding-horizontal: ${spacing.lg};
  border-radius: ${borderRadius.md};
  background-color: ${(props: { bgColor: string }) => props.bgColor};
  border-width: 1px;
  border-color: ${(props: { bgColor: string; borderColor?: string }) => props.borderColor || props.bgColor};
  margin-bottom: ${spacing.sm};
`;

const SocialButtonIcon = styled.Text`
  font-size: ${typography.fontSize['text-lg']};
  margin-right: ${spacing.sm};
`;

const SocialButtonLabel = styled.Text<{ textColor: string }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${(props: { textColor: string }) => props.textColor};
`;

const DividerRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: ${spacing.lg};
`;

const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${colors.gray[20]};
`;

const DividerText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.subtle};
  padding-horizontal: ${spacing.md};
`;

const EmailLink = styled.TouchableOpacity`
  align-items: center;
  padding-vertical: ${spacing.md};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${colors.brand.primary};
  margin-bottom: ${spacing.sm};
`;

const EmailLinkText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.brand.primary};
`;

const ConsentRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${spacing.xl};
  padding-horizontal: ${spacing.xs};
`;

const Checkbox = styled.TouchableOpacity<{ checked: boolean }>`
  width: ${sizing.icon.sm};
  height: ${sizing.icon.sm};
  border-radius: ${borderRadius.sm};
  border-width: 2px;
  border-color: ${(props: { checked: boolean }) => (props.checked ? colors.brand.primary : colors.gray[30])};
  background-color: ${(props: { checked: boolean }) => (props.checked ? colors.brand.primary : 'transparent')};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
  margin-top: 2px;
`;

const CheckmarkText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.onBrand};
  font-weight: ${typography.fontWeight.bold};
`;

const ConsentText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.muted};
  flex: 1;
  line-height: 18px;
`;

const ConsentLink = styled.Text`
  color: ${colors.brand.primary};
  font-weight: ${typography.fontWeight.medium};
`;

const FooterSection = styled.View`
  align-items: center;
  margin-top: ${spacing.md};
`;

const FooterRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FooterText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const FooterLink = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.brand.primary};
`;

const DisclaimerText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-2xs']};
  color: ${({ theme }) => theme.colors.text.subtle};
  text-align: center;
  margin-top: ${spacing.xl};
  line-height: 16px;
  padding-horizontal: ${spacing.md};
`;

// --- Component ---

export const SocialAuth: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { t } = useTranslation();
  const [lgpdConsent, setLgpdConsent] = useState(false);

  const handleSocialLogin = (provider: string) => {
    if (!lgpdConsent) {
      Alert.alert(
        t('auth.socialAuth.consentRequired'),
        t('auth.socialAuth.consentMessage'),
      );
      return;
    }
    // TODO: Integrate with social auth providers
    Alert.alert(provider, t('auth.socialAuth.comingSoon'));
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ContentWrapper>
          <HeaderSection>
            <Title>{t('auth.socialAuth.title')}</Title>
            <Subtitle>{t('auth.socialAuth.subtitle')}</Subtitle>
          </HeaderSection>

          {/* LGPD Consent */}
          <ConsentRow>
            <Checkbox
              checked={lgpdConsent}
              onPress={() => setLgpdConsent(!lgpdConsent)}
              testID="lgpd-consent-checkbox"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: lgpdConsent }}
            >
              {lgpdConsent && <CheckmarkText>{'\u2713'}</CheckmarkText>}
            </Checkbox>
            <ConsentText>
              {t('auth.socialAuth.lgpdConsent')}{' '}
              <ConsentLink
                onPress={() => navigation.navigate(ROUTES.SETTINGS_PRIVACY_POLICY as never)}
              >
                {t('auth.socialAuth.privacyPolicy')}
              </ConsentLink>
              {' '}{t('auth.socialAuth.and')}{' '}
              <ConsentLink
                onPress={() => navigation.navigate(ROUTES.SETTINGS_TERMS as never)}
              >
                {t('auth.socialAuth.termsOfService')}
              </ConsentLink>
            </ConsentText>
          </ConsentRow>

          {/* Social Login Buttons */}
          <SocialButtonsSection>
            {/* Google Sign-In */}
            <SocialButton
              bgColor={colors.neutral.white}
              borderColor={colors.gray[20]}
              onPress={() => handleSocialLogin('Google')}
              testID="social-auth-google"
              accessibilityLabel={t('auth.socialAuth.googleButton')}
            >
              <SocialButtonIcon style={{ color: colors.neutral.gray900 }}>G</SocialButtonIcon>
              <SocialButtonLabel textColor={colors.neutral.gray900}>
                {t('auth.socialAuth.googleButton')}
              </SocialButtonLabel>
            </SocialButton>

            {/* Apple Sign-In (dark style) */}
            <SocialButton
              bgColor={colors.neutral.gray900}
              onPress={() => handleSocialLogin('Apple')}
              testID="social-auth-apple"
              accessibilityLabel={t('auth.socialAuth.appleButton')}
            >
              <SocialButtonIcon style={{ color: colors.neutral.white }}>A</SocialButtonIcon>
              <SocialButtonLabel textColor={colors.neutral.white}>
                {t('auth.socialAuth.appleButton')}
              </SocialButtonLabel>
            </SocialButton>

            {/* Facebook Login (branded blue) */}
            <SocialButton
              bgColor={colors.brand.primary}
              onPress={() => handleSocialLogin('Facebook')}
              testID="social-auth-facebook"
              accessibilityLabel={t('auth.socialAuth.facebookButton')}
            >
              <SocialButtonIcon style={{ color: colors.neutral.white }}>f</SocialButtonIcon>
              <SocialButtonLabel textColor={colors.neutral.white}>
                {t('auth.socialAuth.facebookButton')}
              </SocialButtonLabel>
            </SocialButton>
          </SocialButtonsSection>

          {/* Divider */}
          <DividerRow>
            <DividerLine />
            <DividerText>{t('auth.socialAuth.divider')}</DividerText>
            <DividerLine />
          </DividerRow>

          {/* Email Login Link */}
          <EmailLink
            onPress={() => navigation.navigate('Login')}
            testID="social-auth-email-login"
          >
            <EmailLinkText>{t('auth.socialAuth.emailLogin')}</EmailLinkText>
          </EmailLink>

          {/* Register Link */}
          <FooterSection>
            <FooterRow>
              <FooterText>{t('auth.socialAuth.noAccount')} </FooterText>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                testID="social-auth-register"
              >
                <FooterLink>{t('auth.socialAuth.register')}</FooterLink>
              </TouchableOpacity>
            </FooterRow>
          </FooterSection>

          {/* Privacy Disclaimer */}
          <DisclaimerText>
            {t('auth.socialAuth.disclaimer')}
          </DisclaimerText>
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default SocialAuth;
