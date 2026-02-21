import React from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';
import { shadows } from '../../../../design-system/src/tokens/shadows';
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
`;

const HeaderSection = styled.View`
  width: 100%;
  margin-bottom: ${spacing['2xl']};
`;

const StepIndicator = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
`;

const StepBarContainer = styled.View`
  flex-direction: row;
  margin-top: ${spacing.sm};
  gap: ${spacing['3xs']};
`;

const StepDot = styled.View<{ active: boolean }>`
  flex: 1;
  height: 4px;
  border-radius: ${borderRadius.full};
  background-color: ${(props) =>
    props.active ? colors.brand.primary : colors.gray[20]};
`;

const SuccessIconContainer = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 48px;
  background-color: ${colors.semantic.successBg};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing['2xl']};
  margin-top: ${spacing['2xl']};
`;

const SuccessIcon = styled.Text`
  font-size: 48px;
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  text-align: center;
  margin-bottom: ${spacing.sm};
`;

const SubtitleText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.gray[50]};
  text-align: center;
  margin-bottom: ${spacing['3xl']};
`;

const SummaryCard = styled.View`
  width: 100%;
  background-color: ${colors.gray[5]};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
  margin-bottom: ${spacing['3xl']};
  border-width: 1px;
  border-color: ${colors.gray[20]};
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${spacing.sm};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[20]};
`;

const SummaryRowLast = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${spacing.sm};
`;

const SummaryLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
`;

const SummaryValue = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray900};
  flex-shrink: 1;
  text-align: right;
  max-width: 60%;
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const PrimaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

const CelebrationText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.brand.primary};
  text-align: center;
  margin-top: ${spacing.md};
`;

/**
 * ProfileConfirmation screen -- Step 7/7 of the profile onboarding flow.
 * Displays success state and profile summary, navigates to Home.
 */
const ProfileConfirmation: React.FC = () => {
  const navigation = useNavigation();

  // TODO: Retrieve actual profile data from context/store
  const profileData = {
    name: 'User Name',
    email: 'user@email.com',
    phone: '+55 11 99999-9999',
  };

  const handleContinueToHome = () => {
    // Reset navigation stack and go to Home
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.HOME as never }],
    });
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ContentWrapper>
          {/* Step Indicator */}
          <HeaderSection>
            <StepIndicator>Step 7 of 7</StepIndicator>
            <StepBarContainer>
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <StepDot key={step} active={step <= 7} />
              ))}
            </StepBarContainer>
          </HeaderSection>

          {/* Success Icon */}
          <SuccessIconContainer>
            <SuccessIcon accessibilityLabel="Success checkmark">
              &#10003;
            </SuccessIcon>
          </SuccessIconContainer>

          {/* Title */}
          <Title>Profile Complete!</Title>
          <SubtitleText>
            Your profile has been set up successfully. You are ready to
            start your health journey.
          </SubtitleText>

          {/* Summary Card */}
          <SummaryCard>
            <SummaryRow>
              <SummaryLabel>Name</SummaryLabel>
              <SummaryValue
                numberOfLines={1}
                testID="profile-confirm-name"
              >
                {profileData.name}
              </SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Email</SummaryLabel>
              <SummaryValue
                numberOfLines={1}
                testID="profile-confirm-email"
              >
                {profileData.email}
              </SummaryValue>
            </SummaryRow>
            <SummaryRowLast>
              <SummaryLabel>Phone</SummaryLabel>
              <SummaryValue
                numberOfLines={1}
                testID="profile-confirm-phone"
              >
                {profileData.phone}
              </SummaryValue>
            </SummaryRowLast>
          </SummaryCard>

          {/* Continue to Home Button */}
          <PrimaryButton
            onPress={handleContinueToHome}
            accessibilityRole="button"
            accessibilityLabel="Continue to home screen"
            testID="profile-confirm-continue"
          >
            <PrimaryButtonText>Continue to Home</PrimaryButtonText>
          </PrimaryButton>

          <CelebrationText>
            Welcome to AUSTA SuperApp
          </CelebrationText>
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default ProfileConfirmation;
