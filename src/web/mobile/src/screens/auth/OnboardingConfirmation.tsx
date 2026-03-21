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

import type { RootStackParamList } from '../../navigation/types';

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

const SuccessIconContainer = styled.View`
    width: 120px;
    height: 120px;
    border-radius: 60px;
    background-color: ${colors.semantic.successBg};
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing['2xl']};
    margin-top: ${spacing['2xl']};
`;

const SuccessIcon = styled.Text`
    font-size: 56px;
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

const SummaryCard = styled.View`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.background.muted};
    border-radius: ${borderRadius.lg};
    padding: ${spacing.xl};
    margin-bottom: ${spacing['3xl']};
    border-width: 1px;
    border-color: ${({ theme }) => theme.colors.border.default};
`;

const SummaryTitle = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.muted};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: ${spacing.md};
`;

const SummaryRow = styled.View`
    flex-direction: row;
    align-items: center;
    padding-vertical: ${spacing.sm};
    border-bottom-width: 1px;
    border-bottom-color: ${({ theme }) => theme.colors.border.default};
`;

const SummaryRowLast = styled.View`
    flex-direction: row;
    align-items: center;
    padding-vertical: ${spacing.sm};
`;

const SummaryIcon = styled.Text`
    font-size: 20px;
    margin-right: ${spacing.sm};
`;

const SummaryLabel = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.default};
    flex: 1;
`;

const SummaryBadge = styled.View`
    background-color: ${colors.semantic.successBg};
    border-radius: ${borderRadius.full};
    padding-horizontal: ${spacing.sm};
    padding-vertical: ${spacing['4xs']};
`;

const SummaryBadgeText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.semantic.success};
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
    color: ${({ theme }) => theme.colors.text.onBrand};
`;

const CelebrationText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.brand.primary};
    text-align: center;
    margin-top: ${spacing.md};
`;

// --- Data ---

const MOCK_SELECTED_GOALS = [
    { icon: '\uD83C\uDFC3', key: 'fitness' },
    { icon: '\uD83E\uDD57', key: 'nutrition' },
    { icon: '\uD83C\uDF19', key: 'sleep' },
] as const;

// --- Component ---

/**
 * OnboardingConfirmation screen shows a success message after
 * the personalization flow is complete, displaying a summary
 * of selected goals and a CTA to enter the main app.
 */
export const OnboardingConfirmation: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();

    const handleStartApp = (): void => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
        });
    };

    return (
        <Container>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                testID="onboarding-confirmation-scroll"
            >
                <ContentWrapper>
                    {/* Success Icon */}
                    <SuccessIconContainer>
                        <SuccessIcon accessibilityLabel={t('onboarding.confirmation.successIcon')}>
                            {'\u2705'}
                        </SuccessIcon>
                    </SuccessIconContainer>

                    {/* Title & Subtitle */}
                    <Title testID="onboarding-confirmation-title">{t('onboarding.confirmation.title')}</Title>
                    <Subtitle>{t('onboarding.confirmation.subtitle')}</Subtitle>

                    {/* Summary Card */}
                    <SummaryCard testID="onboarding-confirmation-summary">
                        <SummaryTitle>{t('onboarding.confirmation.summaryTitle')}</SummaryTitle>
                        {MOCK_SELECTED_GOALS.map((goal, index) => {
                            const isLast = index === MOCK_SELECTED_GOALS.length - 1;
                            const Row = isLast ? SummaryRowLast : SummaryRow;
                            return (
                                <Row key={goal.key}>
                                    <SummaryIcon>{goal.icon}</SummaryIcon>
                                    <SummaryLabel>{t(`onboarding.goalSelection.goals.${goal.key}.title`)}</SummaryLabel>
                                    <SummaryBadge>
                                        <SummaryBadgeText>{t('onboarding.confirmation.selected')}</SummaryBadgeText>
                                    </SummaryBadge>
                                </Row>
                            );
                        })}
                    </SummaryCard>

                    {/* Start App Button */}
                    <PrimaryButton
                        onPress={handleStartApp}
                        accessibilityRole="button"
                        accessibilityLabel={t('onboarding.confirmation.startApp')}
                        testID="onboarding-confirmation-start"
                    >
                        <PrimaryButtonText>{t('onboarding.confirmation.startApp')}</PrimaryButtonText>
                    </PrimaryButton>

                    <CelebrationText>{t('onboarding.confirmation.celebration')}</CelebrationText>
                </ContentWrapper>
            </ScrollView>
        </Container>
    );
};

export default OnboardingConfirmation;
