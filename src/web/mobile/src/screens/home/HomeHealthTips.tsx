import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';

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
`;

const BackText = styled.Text`
    font-size: ${typography.fontSize['text-xl']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.default};
`;

const HeaderTitle = styled.Text`
    flex: 1;
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
    text-align: center;
`;

const HeaderSpacer = styled.View`
    width: ${sizing.component.sm};
`;

const SectionLabel = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.muted};
    text-transform: uppercase;
    letter-spacing: ${typography.letterSpacing.wide};
    padding-horizontal: ${spacing.md};
    margin-top: ${spacing.xl};
    margin-bottom: ${spacing.sm};
`;

const TipCard = styled.TouchableOpacity<{ bgColor: string }>`
    width: 160px;
    height: 200px;
    background-color: ${(props) => props.bgColor};
    border-radius: ${borderRadius.lg};
    padding: ${spacing.lg};
    margin-right: ${spacing.sm};
    justify-content: space-between;
`;

const TipEmoji = styled.Text`
    font-size: 36px;
`;

const TipTitle = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.onBrand};
    margin-top: ${spacing.sm};
`;

const ReadMoreText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.onBrand};
    opacity: 0.8;
`;

const FeaturedSection = styled.View`
    padding-horizontal: ${spacing.md};
    margin-top: ${spacing.xl};
`;

const FeaturedTitle = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacing.sm};
`;

const FeaturedCard = styled.TouchableOpacity`
    background-color: ${({ theme }) => theme.colors.background.muted};
    border-radius: ${borderRadius.md};
    padding: ${spacing.md};
    margin-bottom: ${spacing.sm};
    flex-direction: row;
    align-items: center;
`;

const FeaturedIcon = styled.Text`
    font-size: ${typography.fontSize['heading-xl']};
    margin-right: ${spacing.md};
`;

const FeaturedInfo = styled.View`
    flex: 1;
`;

const FeaturedCardTitle = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacing['4xs']};
`;

const FeaturedCardDescription = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.muted};
`;

// --- Types ---

interface HealthTip {
    id: string;
    emoji: string;
    titleKey: string;
    bgColor: string;
}

interface FeaturedTip {
    id: string;
    emoji: string;
    titleKey: string;
    descriptionKey: string;
}

// --- Mock Data ---

const MOCK_TIPS: HealthTip[] = [
    {
        id: 'tip-1',
        emoji: '\uD83E\uDD57',
        titleKey: 'home.healthTips.tip1',
        bgColor: colors.journeys.health.primary,
    },
    {
        id: 'tip-2',
        emoji: '\uD83C\uDFC3',
        titleKey: 'home.healthTips.tip2',
        bgColor: colors.journeys.care.primary,
    },
    {
        id: 'tip-3',
        emoji: '\uD83D\uDE34',
        titleKey: 'home.healthTips.tip3',
        bgColor: colors.journeys.plan.primary,
    },
    {
        id: 'tip-4',
        emoji: '\uD83E\uDDD8',
        titleKey: 'home.healthTips.tip4',
        bgColor: colors.brand.tertiary,
    },
    {
        id: 'tip-5',
        emoji: '\uD83D\uDCA7',
        titleKey: 'home.healthTips.tip5',
        bgColor: colors.brand.primary,
    },
];

const FEATURED_TIPS: FeaturedTip[] = [
    {
        id: 'feat-1',
        emoji: '\u2764\uFE0F',
        titleKey: 'home.healthTips.featured1Title',
        descriptionKey: 'home.healthTips.featured1Desc',
    },
    {
        id: 'feat-2',
        emoji: '\uD83E\uDDE0',
        titleKey: 'home.healthTips.featured2Title',
        descriptionKey: 'home.healthTips.featured2Desc',
    },
];

// --- Component ---

export const HomeHealthTipsScreen: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const renderTipCard = useCallback(
        ({ item }: { item: HealthTip }) => (
            <TipCard
                bgColor={item.bgColor}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={t(item.titleKey)}
                testID={`health-tip-${item.id}`}
            >
                <TipEmoji accessibilityElementsHidden>{item.emoji}</TipEmoji>
                <TipTitle numberOfLines={3}>{t(item.titleKey)}</TipTitle>
                <ReadMoreText>{t('home.healthTips.readMore')}</ReadMoreText>
            </TipCard>
        ),
        [t]
    );

    const tipKeyExtractor = useCallback((item: HealthTip) => item.id, []);

    return (
        <Container>
            <Header>
                <BackButton
                    onPress={handleGoBack}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.back')}
                    testID="health-tips-back"
                >
                    <BackText>{'\u003C'}</BackText>
                </BackButton>
                <HeaderTitle accessibilityRole="header" testID="health-tips-title">
                    {t('home.healthTips.title')}
                </HeaderTitle>
                <HeaderSpacer />
            </Header>

            <SectionLabel testID="health-tips-section-label">{t('home.healthTips.dailyTips')}</SectionLabel>

            <FlatList
                data={MOCK_TIPS}
                renderItem={renderTipCard}
                keyExtractor={tipKeyExtractor}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: spacingValues.md,
                    paddingBottom: spacingValues.md,
                }}
            />

            <FeaturedSection>
                <FeaturedTitle testID="health-tips-featured-title">{t('home.healthTips.featured')}</FeaturedTitle>

                {FEATURED_TIPS.map((tip) => (
                    <FeaturedCard
                        key={tip.id}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={t(tip.titleKey)}
                        testID={`health-tip-featured-${tip.id}`}
                    >
                        <FeaturedIcon accessibilityElementsHidden>{tip.emoji}</FeaturedIcon>
                        <FeaturedInfo>
                            <FeaturedCardTitle>{t(tip.titleKey)}</FeaturedCardTitle>
                            <FeaturedCardDescription>{t(tip.descriptionKey)}</FeaturedCardDescription>
                        </FeaturedInfo>
                    </FeaturedCard>
                ))}
            </FeaturedSection>
        </Container>
    );
};

export default HomeHealthTipsScreen;
