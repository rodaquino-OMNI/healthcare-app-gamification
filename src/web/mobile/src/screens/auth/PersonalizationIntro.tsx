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
`;

const IllustrationContainer = styled.View`
  width: 160px;
  height: 160px;
  border-radius: 80px;
  background-color: ${colors.brand.primaryLight || colors.gray[5]};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing['2xl']};
  margin-top: ${spacing.xl};
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

// --- Data ---

const BENEFITS = [
  { icon: '\u2705', key: 'betterRecommendations' },
  { icon: '\u2705', key: 'personalizedTips' },
  { icon: '\u2705', key: 'tailoredPlans' },
  { icon: '\u2705', key: 'smarterInsights' },
] as const;

// --- Component ---

/**
 * PersonalizationIntro screen introduces the personalization flow
 * and explains the benefits of completing it. Users can proceed
 * to goal selection or skip the flow.
 */
export const PersonalizationIntro: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const handleGetStarted = () => {
    navigation.navigate(ROUTES.AUTH_GOAL_SELECTION);
  };

  const handleSkip = () => {
    navigation.navigate(ROUTES.HOME);
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        testID="personalization-intro-scroll"
      >
        <ContentWrapper>
          {/* Hero Illustration */}
          <IllustrationContainer>
            <IllustrationEmoji
              accessibilityLabel={t('onboarding.personalizationIntro.illustrationAlt')}
            >
              {'\u2728'}
            </IllustrationEmoji>
          </IllustrationContainer>

          {/* Title & Subtitle */}
          <Title testID="personalization-intro-title">
            {t('onboarding.personalizationIntro.title')}
          </Title>
          <Subtitle>
            {t('onboarding.personalizationIntro.subtitle')}
          </Subtitle>

          {/* Benefits List */}
          <BenefitsList>
            {BENEFITS.map((benefit) => (
              <BenefitRow key={benefit.key}>
                <BenefitIcon>{benefit.icon}</BenefitIcon>
                <BenefitText>
                  {t(`onboarding.personalizationIntro.benefits.${benefit.key}`)}
                </BenefitText>
              </BenefitRow>
            ))}
          </BenefitsList>

          {/* Get Started Button */}
          <PrimaryButton
            onPress={handleGetStarted}
            accessibilityRole="button"
            accessibilityLabel={t('onboarding.personalizationIntro.getStarted')}
            testID="personalization-intro-get-started"
          >
            <PrimaryButtonText>
              {t('onboarding.personalizationIntro.getStarted')}
            </PrimaryButtonText>
          </PrimaryButton>

          {/* Skip Link */}
          <SkipLink
            onPress={handleSkip}
            accessibilityRole="link"
            accessibilityLabel={t('onboarding.personalizationIntro.skip')}
            testID="personalization-intro-skip"
          >
            <SkipLinkText>
              {t('onboarding.personalizationIntro.skip')}
            </SkipLinkText>
          </SkipLink>
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default PersonalizationIntro;
