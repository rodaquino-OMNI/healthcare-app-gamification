import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

import type { HomeStackParamList } from '../../navigation/types';

// --- Styled Components ---

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background.default};
`;

const Header = styled.View`
    flex-direction: row;
    align-items: center;
    padding-horizontal: ${spacing.md};
    padding-vertical: ${spacing.sm};
    border-bottom-width: 1px;
    border-bottom-color: ${({ theme }) => theme.colors.border.default};
`;

const BackButton = styled.TouchableOpacity`
    width: ${sizing.component.sm};
    height: ${sizing.component.sm};
    align-items: center;
    justify-content: center;
    margin-right: ${spacing.xs};
`;

const BackText = styled.Text`
    font-size: ${typography.fontSize['text-xl']};
    color: ${({ theme }) => theme.colors.text.default};
`;

const HeaderTitle = styled.Text`
    flex: 1;
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.default};
`;

const ContentContainer = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding-horizontal: ${spacing['2xl']};
`;

const IconCircle = styled.View`
    width: 96px;
    height: 96px;
    border-radius: 48px;
    background-color: ${({ theme }) => theme.colors.background.subtle};
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing.xl};
`;

const IconText = styled.Text`
    font-size: 48px;
`;

const Title = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
    text-align: center;
    margin-bottom: ${spacing.xs};
`;

const Description = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${({ theme }) => theme.colors.text.muted};
    text-align: center;
    line-height: 24px;
    margin-bottom: ${spacing['2xl']};
`;

const SuggestionsContainer = styled.View`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.background.subtle};
    border-radius: ${borderRadius.md};
    padding: ${spacing.md};
    margin-bottom: ${spacing['2xl']};
`;

const SuggestionsTitle = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacing.sm};
`;

const SuggestionRow = styled.View`
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: ${spacing.xs};
`;

const BulletText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.brand.primary};
    margin-right: ${spacing.xs};
    line-height: 22px;
`;

const SuggestionText = styled.Text`
    flex: 1;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.default};
    line-height: 22px;
`;

const TryAgainButton = styled.TouchableOpacity`
    background-color: ${colors.brand.primary};
    border-radius: ${borderRadius.md};
    height: ${sizing.component.lg};
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const TryAgainText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.onBrand};
`;

// --- Component ---

/**
 * SearchNoResults -- Empty state when no search results are found.
 * Displays a magnifying glass icon, descriptive text, helpful suggestions,
 * and a "Try Again" button that navigates back.
 */
export const SearchNoResults: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
    const { t } = useTranslation();

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleTryAgain = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const suggestions = [
        t('search.noResults.suggestionSpelling'),
        t('search.noResults.suggestionKeywords'),
        t('search.noResults.suggestionCategories'),
    ];

    return (
        <Container>
            <Header>
                <BackButton
                    onPress={handleBack}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.back')}
                    testID="no-results-back"
                >
                    <BackText>{'\u2190'}</BackText>
                </BackButton>
                <HeaderTitle testID="no-results-header">{t('search.noResults.headerTitle')}</HeaderTitle>
            </Header>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <ContentContainer>
                    <IconCircle>
                        <IconText testID="no-results-icon">{'\u{1F50D}'}</IconText>
                    </IconCircle>

                    <Title testID="no-results-title">{t('search.noResults.title')}</Title>

                    <Description testID="no-results-description">{t('search.noResults.description')}</Description>

                    <SuggestionsContainer>
                        <SuggestionsTitle testID="no-results-suggestions-title">
                            {t('search.noResults.suggestionsTitle')}
                        </SuggestionsTitle>
                        {suggestions.map((suggestion, index) => (
                            <SuggestionRow key={index}>
                                <BulletText>{'\u2022'}</BulletText>
                                <SuggestionText testID={`no-results-suggestion-${index}`}>{suggestion}</SuggestionText>
                            </SuggestionRow>
                        ))}
                    </SuggestionsContainer>

                    <TryAgainButton
                        onPress={handleTryAgain}
                        accessibilityRole="button"
                        accessibilityLabel={t('search.noResults.tryAgain')}
                        testID="no-results-try-again"
                    >
                        <TryAgainText>{t('search.noResults.tryAgain')}</TryAgainText>
                    </TryAgainButton>
                </ContentContainer>
            </ScrollView>
        </Container>
    );
};

export default SearchNoResults;
