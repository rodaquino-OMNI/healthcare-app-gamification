import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

import { ROUTES } from '../../constants/routes';
import type { AuthStackParamList } from '../../navigation/types';

// --- Styled Components ---

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background.default};
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
    background-color: ${({ theme }) => colors.brand.secondary || theme.colors.background.muted};
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
    color: ${({ theme }) => theme.colors.text.default};
    text-align: center;
    margin-bottom: ${spacing.sm};
`;

const Subtitle = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${({ theme }) => theme.colors.text.muted};
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
    background-color: ${({ theme }) => theme.colors.background.muted};
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
    color: ${({ theme }) => theme.colors.text.default};
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
    color: ${({ theme }) => theme.colors.text.onBrand};
`;

const SkipLink = styled.TouchableOpacity`
    align-items: center;
    padding-vertical: ${spacing.sm};
`;

const SkipLinkText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.muted};
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
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const { t } = useTranslation();

    const handleGetStarted = (): void => {
        navigation.navigate(ROUTES.AUTH_GOAL_SELECTION);
    };

    const handleSkip = (): void => {
        // Navigate to the Home tab — cross-stack navigation via parent navigator
        navigation.getParent()?.navigate(ROUTES.HOME);
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
                        <IllustrationEmoji accessibilityLabel={t('onboarding.personalizationIntro.illustrationAlt')}>
                            {'\u2728'}
                        </IllustrationEmoji>
                    </IllustrationContainer>

                    {/* Title & Subtitle */}
                    <Title testID="personalization-intro-title">{t('onboarding.personalizationIntro.title')}</Title>
                    <Subtitle>{t('onboarding.personalizationIntro.subtitle')}</Subtitle>

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
                        <PrimaryButtonText>{t('onboarding.personalizationIntro.getStarted')}</PrimaryButtonText>
                    </PrimaryButton>

                    {/* Skip Link */}
                    <SkipLink
                        onPress={handleSkip}
                        accessibilityRole="link"
                        accessibilityLabel={t('onboarding.personalizationIntro.skip')}
                        testID="personalization-intro-skip"
                    >
                        <SkipLinkText>{t('onboarding.personalizationIntro.skip')}</SkipLinkText>
                    </SkipLink>
                </ContentWrapper>
            </ScrollView>
        </Container>
    );
};

export default PersonalizationIntro;
