import React from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';
import { ROUTES } from '../../constants/routes';

// --- Styled components ---

const Container = styled.View`
  flex: 1;
  background-color: ${colors.neutral.white};
  align-items: center;
  justify-content: center;
  padding-horizontal: ${spacing['2xl']};
`;

const TopSection = styled.View`
  align-items: center;
  margin-bottom: ${spacing['3xl']};
`;

const LogoCircle = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 48px;
  background-color: ${colors.brand.primary};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.xl};
`;

const LogoLetter = styled.Text`
  font-family: ${typography.fontFamily.logo};
  font-size: ${typography.fontSize['display-sm']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.white};
`;

const BrandName = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['display-sm']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[70]};
  margin-bottom: ${spacing.xs};
`;

const Tagline = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.gray[50]};
  text-align: center;
`;

const IllustrationPlaceholder = styled.View`
  width: 100%;
  height: 200px;
  background-color: ${colors.brandPalette[50]};
  border-radius: ${borderRadius.lg};
  margin-bottom: ${spacing['3xl']};
  align-items: center;
  justify-content: center;
`;

const IllustrationText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.gray[40]};
`;

const ButtonsSection = styled.View`
  width: 100%;
`;

const PrimaryButton = styled.TouchableOpacity`
  width: 100%;
  height: ${sizing.component.lg};
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.sm};
`;

const PrimaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

const SecondaryButton = styled.TouchableOpacity`
  width: 100%;
  height: ${sizing.component.lg};
  background-color: transparent;
  border-radius: ${borderRadius.md};
  border-width: 1.5px;
  border-color: ${colors.brand.primary};
  align-items: center;
  justify-content: center;
`;

const SecondaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.brand.primary};
`;

// --- Component ---

/**
 * WelcomeCTAScreen is the final call-to-action before authentication.
 *
 * It presents:
 * - A branded logo and tagline
 * - An illustration placeholder area
 * - Two prominent buttons: "Login" (primary) and "Create Account" (outline/secondary)
 *
 * Navigates to AUTH_LOGIN or AUTH_REGISTER via the ROUTES constants.
 */
export default function WelcomeCTAScreen() {
  const navigation = useNavigation<any>();

  const handleLogin = () => {
    navigation.navigate(ROUTES.AUTH_LOGIN);
  };

  const handleCreateAccount = () => {
    navigation.navigate(ROUTES.AUTH_REGISTER);
  };

  return (
    <Container>
      <TopSection>
        <LogoCircle>
          <LogoLetter>A</LogoLetter>
        </LogoCircle>
        <BrandName>AUSTA</BrandName>
        <Tagline>Your complete healthcare companion</Tagline>
      </TopSection>

      <IllustrationPlaceholder>
        <IllustrationText>Illustration</IllustrationText>
      </IllustrationPlaceholder>

      <ButtonsSection>
        <PrimaryButton
          onPress={handleLogin}
          accessibilityLabel="Login to your account"
          accessibilityRole="button"
          testID="welcome-cta-login"
        >
          <PrimaryButtonText>Login</PrimaryButtonText>
        </PrimaryButton>

        <SecondaryButton
          onPress={handleCreateAccount}
          accessibilityLabel="Create a new account"
          accessibilityRole="button"
          testID="welcome-cta-register"
        >
          <SecondaryButtonText>Create Account</SecondaryButtonText>
        </SecondaryButton>
      </ButtonsSection>
    </Container>
  );
}
