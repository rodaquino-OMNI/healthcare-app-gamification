import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
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

const HeaderRow = styled.View`
    flex-direction: row;
    align-items: center;
    padding-horizontal: ${spacing.xl};
    padding-top: ${spacing['2xl']};
    padding-bottom: ${spacing.md};
`;

const BackButton = styled.TouchableOpacity`
    padding: ${spacing.xs};
    margin-right: ${spacing.sm};
`;

const BackIcon = styled.Text`
    font-size: 24px;
    color: ${({ theme }) => theme.colors.text.default};
`;

const HeaderTitle = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
    flex: 1;
`;

const ContentWrapper = styled.View`
    padding-horizontal: ${spacing.xl};
    padding-bottom: ${spacing['4xl']};
`;

const Title = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacing.xs};
`;

const Subtitle = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${({ theme }) => theme.colors.text.muted};
    margin-bottom: ${spacing['2xl']};
    line-height: 22px;
`;

const GoalsGrid = styled.View`
    margin-bottom: ${spacing['2xl']};
`;

const GoalCard = styled.TouchableOpacity<{ selected: boolean }>`
    flex-direction: row;
    align-items: center;
    background-color: ${(props) =>
        props.selected ? props.theme.colors.background.muted : props.theme.colors.neutral.white};
    border-width: 2px;
    border-color: ${(props) => (props.selected ? colors.brand.primary : props.theme.colors.border.default)};
    border-radius: ${borderRadius.lg};
    padding: ${spacing.lg};
    margin-bottom: ${spacing.sm};
`;

const GoalIconContainer = styled.View<{ selected: boolean }>`
    width: 48px;
    height: 48px;
    border-radius: ${borderRadius.md};
    background-color: ${(props) => (props.selected ? colors.brand.primary : props.theme.colors.border.muted)};
    align-items: center;
    justify-content: center;
    margin-right: ${spacing.md};
`;

const GoalIcon = styled.Text`
    font-size: 24px;
`;

const GoalTextContainer = styled.View`
    flex: 1;
`;

const GoalTitle = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacing['3xs']};
`;

const GoalDescription = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.muted};
`;

const CheckmarkContainer = styled.View<{ selected: boolean }>`
    width: 24px;
    height: 24px;
    border-radius: 12px;
    border-width: 2px;
    border-color: ${(props) => (props.selected ? colors.brand.primary : props.theme.colors.text.subtle)};
    background-color: ${(props) => (props.selected ? colors.brand.primary : 'transparent')};
    align-items: center;
    justify-content: center;
`;

const CheckmarkText = styled.Text`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.onBrand};
`;

const BottomSection = styled.View`
    padding-horizontal: ${spacing.xl};
    padding-bottom: ${spacing['3xl']};
    padding-top: ${spacing.md};
`;

const ContinueButton = styled.TouchableOpacity<{ disabled: boolean }>`
    background-color: ${(props) => (props.disabled ? props.theme.colors.text.subtle : colors.brand.primary)};
    border-radius: ${borderRadius.md};
    height: ${sizing.component.lg};
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const ContinueButtonText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.onBrand};
`;

const SelectionCount = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.muted};
    text-align: center;
    margin-top: ${spacing.sm};
`;

// --- Data ---

interface GoalItem {
    id: string;
    icon: string;
    titleKey: string;
    descriptionKey: string;
}

const GOALS: GoalItem[] = [
    {
        id: 'weight',
        icon: '\u2696\uFE0F',
        titleKey: 'onboarding.goalSelection.goals.weight.title',
        descriptionKey: 'onboarding.goalSelection.goals.weight.description',
    },
    {
        id: 'chronic',
        icon: '\u2764\uFE0F',
        titleKey: 'onboarding.goalSelection.goals.chronic.title',
        descriptionKey: 'onboarding.goalSelection.goals.chronic.description',
    },
    {
        id: 'fitness',
        icon: '\uD83C\uDFC3',
        titleKey: 'onboarding.goalSelection.goals.fitness.title',
        descriptionKey: 'onboarding.goalSelection.goals.fitness.description',
    },
    {
        id: 'mental',
        icon: '\uD83E\uDDE0',
        titleKey: 'onboarding.goalSelection.goals.mental.title',
        descriptionKey: 'onboarding.goalSelection.goals.mental.description',
    },
    {
        id: 'nutrition',
        icon: '\uD83E\uDD57',
        titleKey: 'onboarding.goalSelection.goals.nutrition.title',
        descriptionKey: 'onboarding.goalSelection.goals.nutrition.description',
    },
    {
        id: 'sleep',
        icon: '\uD83C\uDF19',
        titleKey: 'onboarding.goalSelection.goals.sleep.title',
        descriptionKey: 'onboarding.goalSelection.goals.sleep.description',
    },
];

// --- Component ---

/**
 * GoalSelection screen allows users to select their health goals
 * during the personalization onboarding flow. Users can select
 * multiple goals from a list of options.
 */
export const GoalSelection: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const { t } = useTranslation();
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    const toggleGoal = useCallback((goalId: string) => {
        setSelectedGoals((prev) => (prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]));
    }, []);

    const handleContinue = (): void => {
        navigation.navigate(ROUTES.AUTH_ONBOARDING_CONFIRMATION);
    };

    const handleBack = (): void => {
        navigation.goBack();
    };

    const isDisabled = selectedGoals.length === 0;

    return (
        <Container>
            {/* Header with Back Button */}
            <HeaderRow>
                <BackButton
                    onPress={handleBack}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.buttons.back')}
                    testID="goal-selection-back"
                >
                    <BackIcon>{'\u2190'}</BackIcon>
                </BackButton>
                <HeaderTitle>{t('onboarding.goalSelection.headerTitle')}</HeaderTitle>
            </HeaderRow>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                testID="goal-selection-scroll"
            >
                <ContentWrapper>
                    {/* Title & Subtitle */}
                    <Title testID="goal-selection-title">{t('onboarding.goalSelection.title')}</Title>
                    <Subtitle>{t('onboarding.goalSelection.subtitle')}</Subtitle>

                    {/* Goals Grid */}
                    <GoalsGrid>
                        {GOALS.map((goal) => {
                            const isSelected = selectedGoals.includes(goal.id);
                            return (
                                <GoalCard
                                    key={goal.id}
                                    selected={isSelected}
                                    onPress={() => toggleGoal(goal.id)}
                                    accessibilityRole="checkbox"
                                    accessibilityState={{ checked: isSelected }}
                                    accessibilityLabel={t(goal.titleKey)}
                                    testID={`goal-card-${goal.id}`}
                                >
                                    <GoalIconContainer selected={isSelected}>
                                        <GoalIcon>{goal.icon}</GoalIcon>
                                    </GoalIconContainer>
                                    <GoalTextContainer>
                                        <GoalTitle>{t(goal.titleKey)}</GoalTitle>
                                        <GoalDescription>{t(goal.descriptionKey)}</GoalDescription>
                                    </GoalTextContainer>
                                    <CheckmarkContainer selected={isSelected}>
                                        {isSelected && <CheckmarkText>{'\u2713'}</CheckmarkText>}
                                    </CheckmarkContainer>
                                </GoalCard>
                            );
                        })}
                    </GoalsGrid>
                </ContentWrapper>
            </ScrollView>

            {/* Bottom CTA */}
            <BottomSection>
                <ContinueButton
                    disabled={isDisabled}
                    onPress={handleContinue}
                    accessibilityRole="button"
                    accessibilityLabel={t('onboarding.goalSelection.continue')}
                    accessibilityState={{ disabled: isDisabled }}
                    testID="goal-selection-continue"
                >
                    <ContinueButtonText>{t('onboarding.goalSelection.continue')}</ContinueButtonText>
                </ContinueButton>
                <SelectionCount>
                    {t('onboarding.goalSelection.selectedCount', {
                        count: selectedGoals.length,
                    })}
                </SelectionCount>
            </BottomSection>
        </Container>
    );
};

export default GoalSelection;
