import React from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';
import { ROUTES } from '../../constants/routes';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
`;

const ContentWrapper = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['3xl']};
  padding-bottom: ${spacing['4xl']};
  align-items: center;
  flex: 1;
  justify-content: center;
`;

const IllustrationContainer = styled.View`
  width: 140px;
  height: 140px;
  border-radius: 70px;
  background-color: ${colors.gray[5]};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing['2xl']};
  border-width: 3px;
  border-color: ${colors.brand.primary};
`;

const IllustrationEmoji = styled.Text`
  font-size: 64px;
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  text-align: center;
  margin-bottom: ${spacing.sm};
`;

const Subtitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.gray[50]};
  text-align: center;
  margin-bottom: ${spacing['2xl']};
  line-height: 24px;
  padding-horizontal: ${spacing.md};
`;

const BenefitsList = styled.View`
  width: 100%;
  margin-bottom: ${spacing['3xl']};
`;

const BenefitRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${spacing.sm};
  padding-horizontal: ${spacing.md};
  background-color: ${colors.gray[5]};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.sm};
`;

const BenefitIcon = styled.Text`
  font-size: 20px;
  margin-right: ${spacing.md};
`;

const BenefitText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.neutral.gray900};
  flex: 1;
`;

const ButtonsContainer = styled.View`
  width: 100%;
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.md};
`;

const PrimaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

const SkipLink = styled.TouchableOpacity`
  align-items: center;
  padding-vertical: ${spacing.sm};
`;

const SkipLinkText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
  text-decoration-line: underline;
`;

const SecurityNote = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[40]};
  text-align: center;
  margin-top: ${spacing.xl};
  padding-horizontal: ${spacing.lg};
`;

// --- Data ---

const BENEFITS = [
  { icon: '\u26A1', key: 'fasterLogin' },
  { icon: '\uD83D\uDD12', key: 'secureAccess' },
  { icon: '\uD83D\uDE4C', key: 'noPasswords' },
] as const;

// --- Component ---

/**
 * ProfileBiometricSetup screen allows users to enable biometric
 * authentication (Face ID / Touch ID) during profile onboarding.
 * Users can enable it or skip for later.
 */
export const ProfileBiometricSetup: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const handleEnable = () => {
    // TODO: Trigger native biometric enrollment
    // After success, navigate to confirmation
    navigation.navigate(ROUTES.PROFILE_CONFIRMATION);
  };

  const handleSkip = () => {
    navigation.navigate(ROUTES.PROFILE_CONFIRMATION);
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        testID="biometric-setup-scroll"
      >
        <ContentWrapper>
          {/* Illustration */}
          <IllustrationContainer>
            <IllustrationEmoji
              accessibilityLabel={t('profile.biometricSetup.illustrationAlt')}
            >
              {'\uD83D\uDD90\uFE0F'}
            </IllustrationEmoji>
          </IllustrationContainer>

          {/* Title & Subtitle */}
          <Title testID="biometric-setup-title">
            {t('profile.biometricSetup.title')}
          </Title>
          <Subtitle>
            {t('profile.biometricSetup.subtitle')}
          </Subtitle>

          {/* Benefits */}
          <BenefitsList>
            {BENEFITS.map((benefit) => (
              <BenefitRow key={benefit.key}>
                <BenefitIcon>{benefit.icon}</BenefitIcon>
                <BenefitText>
                  {t(`profile.biometricSetup.benefits.${benefit.key}`)}
                </BenefitText>
              </BenefitRow>
            ))}
          </BenefitsList>

          {/* Buttons */}
          <ButtonsContainer>
            <PrimaryButton
              onPress={handleEnable}
              accessibilityRole="button"
              accessibilityLabel={t('profile.biometricSetup.enable')}
              testID="biometric-setup-enable"
            >
              <PrimaryButtonText>
                {t('profile.biometricSetup.enable')}
              </PrimaryButtonText>
            </PrimaryButton>

            <SkipLink
              onPress={handleSkip}
              accessibilityRole="link"
              accessibilityLabel={t('profile.biometricSetup.skip')}
              testID="biometric-setup-skip"
            >
              <SkipLinkText>
                {t('profile.biometricSetup.skip')}
              </SkipLinkText>
            </SkipLink>
          </ButtonsContainer>

          {/* Security Note */}
          <SecurityNote>
            {t('profile.biometricSetup.securityNote')}
          </SecurityNote>
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default ProfileBiometricSetup;
